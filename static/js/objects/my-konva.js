"use strict";
var FLOOR_PLANS = [];

var trap_statuses = {
    dark: "#878686",
    success: "#79db37",
    warning: "#eba434",
    danger: "#c41212",
};

function mouseX(evt) {
  if (evt.pageX) {
    return evt.pageX;
  } else if (evt.clientX) {
    return evt.clientX + (document.documentElement.scrollLeft ?
      document.documentElement.scrollLeft :
      document.body.scrollLeft);
  } else {
    return null;
  }
}

function mouseY(evt) {
  if (evt.pageY) {
    return evt.pageY;
  } else if (evt.clientY) {
    return evt.clientY + (document.documentElement.scrollTop ?
      document.documentElement.scrollTop :
      document.body.scrollTop);
  } else {
    return null;
  }
}


class FloorPlan {
    constructor(floor_id, floor_plan_url, img_scale) {
        this.perent_container = document.getElementById('perent_container');
        this.perent_container.addEventListener("resize", main);
        this.clientWidth = this.perent_container.clientWidth;

        this.width = this.clientWidth;
        this.height = window.innerHeight;

        this.floor_id = floor_id;
        this.floor_plan_url = floor_plan_url;
        this.stage = new Konva.Stage({
            container: 'container_' + floor_id, // div id в шаблоні html / div id in html template
            width: this.width - 50,
            height: this.height - 200,
            draggable: true, // дає змогу навігації шляхом перетягування / draggable navigation
            });

        this.current_shape = '';
        this.scaleBy = 1.01;
        this.mode_status = 'usual';  //usual or edit

        this.tooltip = new Konva.Label({
            opacity: 0.75,
            visible: false,
        });
        this.layer_floor = new Konva.Layer();
        this.layer_traps = new Konva.Layer();
        this.layer_hubs = new Konva.Layer();
        this.layer_traps_history = new Konva.Layer();
        this.layer_vulnerability = new Konva.Layer();
        this.tooltipLayer = new Konva.Layer();
        this.menu_node = document.getElementById('menu_' + floor_id);

        this.sliderContainer = document.getElementById('scale_' + floor_id);
        this.clickPipsSlider = document.getElementById('soft_' + floor_id);


        this.floor_plan_img = '';
        this.floor_plan_img_scale = img_scale;
        this.edit_btn = document.getElementById("edit_btn_" + this.floor_id);

        // this.get_traps();
        $("#edit_traps_" + this.floor_id).on('click', {
            that: this,
        }, this.edit_location);

        $("#edit_hubs_" + this.floor_id).on('click', {
            that: this,
        }, this.edit_hub_location);

        $("#edit_scale_" + this.floor_id).on('click', {
            that: this,
        }, this.edit_scale);

        $("#show_all_" + this.floor_id).on('click', {
            that: this,
        }, function (event) {
            var floor_plan = event.data.that;
            $(`#trap_title_${floor_plan.floor_id}`).attr('hidden', true);
            $(`#vulnerability_title_${floor_plan.floor_id}`).attr('hidden', true);
            floor_plan.layer_traps.show();
            floor_plan.layer_vulnerability.show();
        });

        $("#show_traps_" + this.floor_id).on('click', {
            that: this,
        }, function (event) {
            var floor_plan = event.data.that;
            $(`#vulnerability_title_${floor_plan.floor_id}`).attr('hidden', true);
            $(`#trap_title_${floor_plan.floor_id}`).attr('hidden', false);
            floor_plan.layer_traps.show();
            floor_plan.layer_vulnerability.hide();
        });

        $("#show_vulnerability_" + this.floor_id).on('click', {
            that: this,
        }, function (event) {
            var floor_plan = event.data.that;
            $(`#trap_title_${floor_plan.floor_id}`).attr('hidden', true);
            $(`#vulnerability_title_${floor_plan.floor_id}`).attr('hidden', false);
            floor_plan.layer_traps.hide();
            floor_plan.layer_vulnerability.show();
        });

    }

    init() {
        var that = this;
        this.stage.add(this.layer_floor);
        this.stage.add(this.layer_traps);
        this.stage.add(this.layer_hubs);
        this.stage.add(this.layer_vulnerability);
        this.stage.add(this.tooltipLayer);
        this.stage.draw();
        this.layer_floor.draw();
        this.layer_traps.draw();
        this.layer_hubs.draw();
        this.layer_vulnerability.draw();
        this.tooltipLayer.draw();

        this.tooltip.add(
            new Konva.Tag({
                fill: '#9edcff',
                pointerDirection: 'left',
                pointerWidth: 20,
                pointerHeight: 28,
                lineJoin: 'round',
                shadowColor: 'black',
                shadowBlur: 10,
                shadowOffsetX: 10,
                shadowOffsetY: 10,
                shadowOpacity: 0.5,
            })
        );

        this.tooltip.add(
            new Konva.Text({
                text: '',
                fontFamily: 'Calibri',
                fontSize: 18,
                padding: 5,
                fill: 'black',
            })
        );

        this.tooltipLayer.add(this.tooltip);

        this.stage.on('wheel', (e) => {
            e.evt.preventDefault();

            var oldScale = this.stage.scaleX();
            var pointer = this.stage.getPointerPosition();

            var mousePointTo = {
                x: (pointer.x - this.stage.x()) / oldScale,
                y: (pointer.y - this.stage.y()) / oldScale,
            };

            let direction = e.evt.deltaY > 0 ? 1 : -1;

            if (e.evt.ctrlKey) {
                direction = -direction;
            }

            var newScale = direction > 0 ? oldScale * this.scaleBy : oldScale / this.scaleBy;

            this.stage.scale({x: newScale, y: newScale});

            var newPos = {
                x: pointer.x - mousePointTo.x * newScale,
                y: pointer.y - mousePointTo.y * newScale,
            };
            this.stage.position(newPos);
        });

        function getDistance(p1, p2) {
            return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
        }

        function getCenter(p1, p2) {
            return {
                x: (p1.x + p2.x) / 2,
                y: (p1.y + p2.y) / 2,
            };
        }

        this.lastCenter = null;
        this.lastDist = 0;

        this.stage.on('touchmove', function (e) {
            e.evt.preventDefault();
            // var that = e.data.that;
            var touch1 = e.evt.touches[0];
            var touch2 = e.evt.touches[1];

            if (touch1 && touch2) {
                // if the stage was under Konva's drag&drop
                // we need to stop it, and implement our own pan logic with two pointers
                if (that.stage.isDragging()) {
                    that.stage.stopDrag();
                }

                var p1 = {
                    x: touch1.clientX,
                    y: touch1.clientY,
                };
                var p2 = {
                    x: touch2.clientX,
                    y: touch2.clientY,
                };

                if (!that.lastCenter) {
                    that.lastCenter = getCenter(p1, p2);
                    return;
                }
                var newCenter = getCenter(p1, p2);

                var dist = getDistance(p1, p2);

                if (!that.lastDist) {
                    that.lastDist = dist;
                }

                // local coordinates of center point
                var pointTo = {
                    x: (newCenter.x - that.stage.x()) / that.stage.scaleX(),
                    y: (newCenter.y - that.stage.y()) / that.stage.scaleX(),
                };

                var scale = stage.scaleX() * (dist / that.lastDist);

                that.stage.scaleX(scale);
                that.stage.scaleY(scale);

                // calculate new position of the stage
                var dx = newCenter.x - that.lastCenter.x;
                var dy = newCenter.y - that.lastCenter.y;

                var newPos = {
                    x: newCenter.x - pointTo.x * scale + dx,
                    y: newCenter.y - pointTo.y * scale + dy,
                };

                that.stage.position(newPos);

                that.lastDist = dist;
                that.lastCenter = newCenter;
            }
        });
        that.stage.on('touchend', function () {
            that.lastDist = 0;
            that.lastCenter = null;
        });
    }

    show_floor_img() {
        var that = this;
        Konva.Image.fromURL(that.floor_plan_url, function (floo_plan_img) {
            floo_plan_img.setAttrs({
                x: 0,
                y: 0,
            });
            floo_plan_img.scale({
                  x: that.floor_plan_img_scale,
                  y: that.floor_plan_img_scale
                });
            floo_plan_img.on('contextmenu', function (e) {
                // prevent default behavior
                e.evt.preventDefault();
                if (e.target === this.stage) {
                    // if we are on empty place of the stage we will do nothing
                    return;
                }
                if (that.mode_status === 'usual') {
                    return;
                }

                that.current_shape = e.target;
                // Відображення контекстного меню / show menu
                that.menu_node.style.top = 50 + 'px';
                that.menu_node.style.left = 10 + 'px';
                that.menu_node.style.display = 'initial';
            });
            // floo_plan_img.on('mousedown touchstart', function() {
            //     let point_flor = floorPlan.getRelativePointerPosition();
            //     let point_stage = stage.getPointerPosition();
            // });
            that.layer_floor.add(floo_plan_img);
        });
    }

    edit_location(event) {
        var floor_plan = event.data.that;
        floor_plan.mode_status = 'edit';
        let upper_children = floor_plan.layer_traps.getChildren();
        for (let i = 0; i < upper_children.length; i++) {
            upper_children[i].setAttr('draggable', true);
        }
        $(`#trap_title_${floor_plan.floor_id}`).attr('hidden', false);
        $(`#btn_traps_${floor_plan.floor_id}`).attr('hidden', false);
        $(`#vulnerability_title_${floor_plan.floor_id}`).attr('hidden', true);
        $(`#filter_group_${floor_plan.floor_id}`).attr('hidden', true);
        $(`#save_trap_${floor_plan.floor_id}`).off('click').on('click', {
            that: floor_plan,
        }, floor_plan.save_location).attr('hidden', false);
        $(`#btnGroupDrop_${floor_plan.floor_id}`).attr('hidden', true);


    }

    save_location(event) {
        var floor_plan = event.data.that;
        floor_plan.mode_status = 'usual';
        var floor_children = floor_plan.layer_floor.getChildren();
        var floor_img = floor_children[0];
        // floor_img.on('contextmenu', function (e) {
        //
        // });
        var upper_children = floor_plan.layer_traps.getChildren();
        for (let i = 0; i < upper_children.length; i++) {
            upper_children[i].setAttr('draggable', false);
            floor_plan.location_to_bd({
                id: upper_children[i].getAttr('bd_id'),
                x: parseInt(upper_children[i].getAttr('x')),
                y: parseInt(upper_children[i].getAttr('y')),
                floor_id: parseInt(floor_plan['floor_id']),
            });
        }
        $(`#btnGroupDrop_${floor_plan.floor_id}`).attr('hidden', false);
        $(`#filter_group_${floor_plan.floor_id}`).attr('hidden', false);
        $(`#traps_grp_btn_${floor_plan.floor_id}`).attr('hidden', true);

        $(`#save_trap_${floor_plan.floor_id}`).on('click', {
            that: floor_plan,
        }, floor_plan.edit_location).attr('hidden', true);
        main();
    }

    edit_hub_location(event) {
        var floor_plan = event.data.that;
        floor_plan.mode_status = 'edit';
        let upper_children = floor_plan.layer_hubs.getChildren();
        for (let i = 0; i < upper_children.length; i++) {
            upper_children[i].setAttr('draggable', true);
        }
        $(`#trap_title_${floor_plan.floor_id}`).attr('hidden', false);
        $(`#btn_hubs_${floor_plan.floor_id}`).attr('hidden', false);
        $(`#vulnerability_title_${floor_plan.floor_id}`).attr('hidden', true);
        $(`#filter_group_${floor_plan.floor_id}`).attr('hidden', true);
        $(`#save_trap_${floor_plan.floor_id}`).off('click').on('click', {
            that: floor_plan,
        }, floor_plan.save_hub_location).attr('hidden', false);
        $(`#btnGroupDrop_${floor_plan.floor_id}`).attr('hidden', true);


    }

    save_hub_location(event) {
        var floor_plan = event.data.that;
        floor_plan.mode_status = 'usual';
        var floor_children = floor_plan.layer_floor.getChildren();
        var upper_children = floor_plan.layer_hubs.getChildren();
        for (let i = 0; i < upper_children.length; i++) {
            upper_children[i].setAttr('draggable', false);
            floor_plan.hub_location_to_bd({
                id: upper_children[i].getAttr('bd_id'),
                x: parseInt(upper_children[i].getAttr('x')),
                y: parseInt(upper_children[i].getAttr('y')),
                floor_id: parseInt(floor_plan['floor_id']),
            });
        }
        $(`#btnGroupDrop_${floor_plan.floor_id}`).attr('hidden', false);
        $(`#filter_group_${floor_plan.floor_id}`).attr('hidden', false);
        $(`#traps_grp_btn_${floor_plan.floor_id}`).attr('hidden', true);

        $(`#save_trap_${floor_plan.floor_id}`).on('click', {
            that: floor_plan,
        }, floor_plan.edit_location).attr('hidden', true);
        main();
    }


    edit_scale(event) {
        var floor_plan = event.data.that;
        floor_plan.mode_status = 'edit';
        floor_plan.create_slider(floor_plan);
        $(`#save_scale_${floor_plan.floor_id}`).on('click', {
            that: floor_plan,
        }, floor_plan.save_scale).attr('hidden', false);
        $(`#btnGroupDrop_${floor_plan.floor_id}`).attr('hidden', true);

    }

    save_scale(event) {
        var floor_plan = event.data.that;
        floor_plan.mode_status = 'usual';
        var floor_children = floor_plan.layer_floor.getChildren();
        var floor_img = floor_children[0];
        floor_img.on('contextmenu', function (e) {

        });
        floor_plan.scale_to_bd({
                id: floor_plan.floor_id,
                scale: parseFloat(floor_img.scale().x[0]),
            });
        floor_plan.sliderContainer.style.display = 'none';
        floor_plan.clickPipsSlider.noUiSlider.destroy();
        $(`#btnGroupDrop_${floor_plan.floor_id}`).attr('hidden', false);
        $(`#save_scale_${floor_plan.floor_id}`).on('click', {
            that: floor_plan,
        }, floor_plan.save_scale).attr('hidden', true);
    }


    scale_to_bd(floor_plan) {
        const csrftoken = getCookie('csrftoken');
        var data = {
            'floor_plan': floor_plan,
        };
        $.ajax({
            type: 'POST',
            headers: {'X-CSRFToken': csrftoken},
            url: '/object/' + slug + '/change-img-scale',
            data: data,
            success: function (data) {
            },
            dataType: 'json',
        });
    }

    location_to_bd(trap) {
        const csrftoken = getCookie('csrftoken');
        var data = {
            'trap': trap,
        };
        $.ajax({
            type: 'POST',
            headers: {'X-CSRFToken': csrftoken},
            url: '/object/plan/' + slug + '/change-trap-location',
            data: data,
            success: function (data) {
            },
            dataType: 'json',
        });
    }

    hub_location_to_bd(hub) {
        const csrftoken = getCookie('csrftoken');
        var data = {
            'hub': hub,
        };
        $.ajax({
            type: 'POST',
            headers: {'X-CSRFToken': csrftoken},
            url: '/object/plan/' + slug + '/change-hub-location',
            data: data,
            success: function (data) {
                console.log(data);
            },
            dataType: 'json',
        });
    }

    create_slider(that) {
        var range = {
            'min': [0],
            '10%': [1, 0.1],
            'max': [10]
        };

        noUiSlider.create(that.clickPipsSlider, {
            range: range,
            start: [1],

            tooltips: true,
            pips: {mode: 'values', values: [1, 10], density: 5}
        });

        that.clickPipsSlider.noUiSlider.on('update', function (values, handle) {
            let img = that.layer_floor.getChildren();
            img[0].scale({
                x: values,
                y: values,
            });
        });
        that.sliderContainer.style.display = 'initial';
    }

    get_traps(floor_id, layer_traps) {
        var that = this;

        $.ajax({
            type: 'POST',
            url: `${slug}/traps`,
            success: function (data) {
                if (data['status'] !== null) {
                    if (data['status'] === 'ok') {
                        for (let i = 0; i < data['data'].length; i++) {
                            var group = new Konva.Group({
                                draggable: true,
                            });
                            // if (data['data'][i].floor.toString() !== this.floor_id){
                            //     continue;
                            // }
                            if (data['data'][i].floor.toString() === floor_id) {
                                if (data['data'][i].x === 0 && data['data'][i].y === 0) {
                                    // $('#menu_' + that.floor_id).append('<button class="btn" id="' + that.floor_id + data['data'][i].id + '" value=' + data['data'][i].id + '>' + data['data'][i].number + ' | ' + data['data'][i].model + '</button>');
                                    // $(`#menu_${that.floor_id}`).append(`<button class="btn btn-sm" id="${that.floor_id}${data['data'][i].id}" value="${data['data'][i].id}">${data['data'][i].number} | ${data['data'][i].model}</button>`);
                                    console.log(`add_trap_${that.floor_id}${data['data'][i].id}`)
                                    $(`#add_trap_${that.floor_id}${data['data'][i].id}`).on('click', () => {
                                        console.log(data['data'][i].id);
                                        let down_chield = that.layer_floor.getChildren();
                                        // let point_pos = down_chield[0].getRelativePointerPosition();
                                        let point_pos = down_chield[0].getSelfRect();
                                        console.log(point_pos);
                                        var rect = new Konva.Rect({
                                            bd_id: data['data'][i].id,
                                            x: point_pos.width / 2,
                                            y: 30,
                                            width: 12,
                                            height: 12,
                                            fill: trap_statuses[data['data'][i].status],
                                            stroke: 'black',
                                            strokeWidth: 1,
                                            draggable: true,
                                        });
                                        $(`#menu_${that.floor_id}`).hide()
                                        document.getElementById(`add_trap_${that.floor_id}${data['data'][i].id}`).remove()
                                        rect.on('mousemove', function () {
                                            var rectPos = rect.getAbsolutePosition(that.stage);
                                            that.tooltip.position({
                                                x: rectPos.x + 12,
                                                y: rectPos.y + 6,
                                            });
                                            let tooltip_chield = that.tooltip.getChildren();
                                            tooltip_chield[1].text(data['data'][i].number + ' | ' + data['data'][i].model);
                                            // tooltip.text(data['data'][i].number + ' | ' + data['data'][i].model);
                                            that.tooltip.show();
                                        });

                                        rect.on('mouseout', function () {
                                            that.tooltip.hide();
                                        });

                                        that.layer_traps.add(rect);
                                        $("#" + data['data'][i].id).remove();
                                    });

                                }
                                else {

                                    let rect = new Konva.Rect({
                                        bd_id: data['data'][i].id,
                                        x: data['data'][i].x,
                                        y: data['data'][i].y,
                                        width: 12,
                                        height: 12,
                                        fill: trap_statuses[data['data'][i].status],
                                        stroke: 'black',
                                        strokeWidth: 1,
                                        shadowColor: 'black',
                                        shadowBlur: 5,
                                        shadowOffsetX: 4,
                                        shadowOffsetY: 4,
                                        shadowOpacity: 0.6,
                                    });

                                    let trap_number = new Konva.Label({
                                        opacity: 0.75,
                                        visible: true,
                                    });

                                    trap_number.add(
                                        new Konva.Tag({
                                            pointerDirection: 'down',
                                            pointerWidth: 10,
                                            lineJoin: 'round',
                                            shadowColor: 'black',
                                            shadowBlur: 10,
                                            shadowOffsetX: 10,
                                            shadowOffsetY: 10,
                                            shadowOpacity: 0.5,
                                        })
                                    );

                                    trap_number.add(
                                        new Konva.Text({
                                            text: data['data'][i].number,
                                            fontFamily: 'Calibri',
                                            fontSize: 18,
                                            fontStyle: 'bold',
                                            padding: 5,
                                            fill: 'black',
                                        })
                                    );

                                    trap_number.position({
                                        x: data['data'][i].x + 7,
                                        y: data['data'][i].y,
                                    });
                                    trap_number.show();
                                    that.layer_traps.add(trap_number);

                                    rect.on('mousemove', function () {
                                        var mousePos = that.stage.getPointerPosition();
                                        that.tooltip.position({
                                            x: data['data'][i].x + 12,
                                            y: data['data'][i].y + 6,
                                        });
                                        let tooltip_chield = that.tooltip.getChildren();
                                        tooltip_chield[1].text(data['data'][i].number + ' | ' + data['data'][i].model);
                                        // tooltip.text(data['data'][i].number + ' | ' + data['data'][i].model);
                                        that.tooltip.show();
                                    });

                                    rect.on('mouseout', function () {
                                        that.tooltip.hide();
                                    });

                                    rect.on('mousedown touchstart', function () {
                                        if (that.mode_status !== 'edit') {
                                            let host_url = new URL($(location).prop('href'));
                                            $(location).prop('href', host_url.protocol + "//" + host_url.host + "/trap/info/" + data['data'][i].slug);
                                        }
                                    });

                                    rect.on('mouseenter', function () {
                                        if (that.mode_status !== 'edit') {
                                            that.stage.container().style.cursor = 'pointer';
                                        }
                                    });

                                    rect.on('mouseleave', function () {
                                        that.stage.container().style.cursor = 'default';
                                    });

                                    that.layer_traps.add(rect);
                                }
                            }

                        }
                    } else if (data['status'] === 'error') {
                    }
                }
            },
            dataType: 'json',
        });
    }

}

window.onresize = function (event) {
    main()
};


function main() {
    for (let floor_plan = 0; floor_plan < floor_plans.length; floor_plan++) {
        let floor_init = new FloorPlan(floor_plans[floor_plan].id, floor_plans[floor_plan].url, floor_plans[floor_plan].scale)
        FLOOR_PLANS.push(floor_init)
        floor_init.init()
        floor_init.show_floor_img()
        floor_init.get_traps(floor_init.floor_id, floor_init.layer_traps)
        floor_init.get_hubs(floor_init.floor_id)
    }
}

// window.onload=function(event){
//     main();
// };

document.addEventListener('DOMContentLoaded', function() {
    main();
}, false);

// function fullscreen_mode(){
//     $(`#main_card`).attr('hidden', true)
//     main()
// }
// $(`#full_screen_btn`).on('click', fullscreen_mode)

$(".minimize-card").on('click', function() {
    var $this = $(this);
    var port = $($this.parents('.card'));
    var card = $(port).children('.card-block').slideToggle();
    $(this).toggleClass("fa-minus").fadeIn('slow');
    $(this).toggleClass("fa-plus").fadeIn('slow');
});
$(".full-card").on('click', function() {
    var $this = $(this);
    var port = $($this.parents('.card'));
    port.toggleClass("full-card");
});

//
// //Створення основного полотна / Create main canvas
// var stage = new Konva.Stage({
//     container: 'container', // div id в шаблоні html / div id in html template
//     width: width,
//     height: height,
//     draggable: true, // дає змогу навігації шляхом перетягування / draggable navigation
// });
//
//
// /*
// Код нижче, створює слої, та додає їх
// до головного полотна
// layer_floor - для плану будівлі
// layer_traps
// - для розміщення елементів
//
// The code below creates layers, and add them to
// layer_floor - for the building plan
// layer_traps
// - for placing elements
// */
// var layer_floor = new Konva.Layer();
// var layer_traps = new Konva.Layer();
// var layer_vulnerability = new Konva.Layer();
// var tooltipLayer = new Konva.Layer();
//
// stage.add(layer_floor);
// stage.add(layer_traps);
// stage.add(layer_vulnerability);
// stage.add(tooltipLayer);
//
// var tooltip = new Konva.Label({
//         opacity: 0.75,
//         visible: false,
//       });
//
// tooltip.add(
//         new Konva.Tag({
//           fill: '#9edcff',
//           pointerDirection: 'left',
//           pointerWidth: 20,
//           pointerHeight: 28,
//           lineJoin: 'round',
//           shadowColor: 'black',
//           shadowBlur: 10,
//           shadowOffsetX: 10,
//           shadowOffsetY: 10,
//           shadowOpacity: 0.5,
//         })
//       );
//
// tooltip.add(
//         new Konva.Text({
//           text: '',
//           fontFamily: 'Calibri',
//           fontSize: 18,
//           padding: 5,
//           fill: 'black',
//         })
//       );
//
// tooltipLayer.add(tooltip);
//
// var radialGradPentagon = new Konva.Circle({
//       x: 500,
//       y: stage.height() / 2,
//       radius: 25,
//       fillRadialGradientStartPoint: { x: 0, y: 0 },
//       fillRadialGradientStartRadius: 0,
//       fillRadialGradientEndPoint: { x: 0, y: 0 },
//       fillRadialGradientEndRadius: 25,
//       fillRadialGradientColorStops: [0.3, '#c41212', 1, 'rgba(255,255,255,0.35)'],
//       opacity: 0.9,
//       draggable: true,
//     });
// layer_vulnerability.add(radialGradPentagon);
//
// var floor_plan = Konva.Image.fromURL(floor_plan_url[0], function(floorPlan) {
//     floorPlan.setAttrs({
//         img_id: 1,
//         x: 0,
//         y: 0,
//     });
//     floorPlan.on('contextmenu', function(e) {
//         // prevent default behavior
//         e.evt.preventDefault();
//         if (e.target === stage) {
//             // if we are on empty place of the stage we will do nothing
//             return;
//         }
//         if (mode_status === 'usual'){
//             return;
//         }
//         currentShape = e.target;
//         // show menu
//         menuNode.style.display = 'initial';
//         var containerRect = stage.container().getBoundingClientRect();
//         var imageRect = e.target.getClientRect();
//         console.log([containerRect, imageRect]);
//         menuNode.style.top =
//             stage.getPointerPosition().y + 4 + 'px';
//         menuNode.style.left =
//             stage.getPointerPosition().x + 25 + 'px';
//     });
//     floorPlan.on('mousedown touchstart', function() {
//         let point_flor = floorPlan.getRelativePointerPosition();
//         let point_stage = stage.getPointerPosition();
//         console.log([point_flor, point_stage]);
//
//     });
//     layer_floor.add(floorPlan);
//     console.log(floorPlan);
// });
//
// // function changeScale(currentSize) {
// //     if (currentSize.width > currentSize.height) {
// //         if (currentSize.width > width) {
// //             return 1 / (currentSize.width / width);
// //         }
// //     } else {
// //         return 1;
// //     }
// // }
// //
// // function changeSize(currentSize) {
// //     if (currentSize.width > currentSize.height) {
// //         if (currentSize.width > 800) {
// //             let arg = currentSize.width / 800;
// //             let newX = currentSize.width / arg;
// //             let newY = currentSize.height / arg;
// //             return {
// //                 x: newX,
// //                 y: newY
// //             };
// //         }
// //     } else if (currentSize.width < currentSize.height) {
// //         if (currentSize.y > 800) {
// //             let arg = currentSize.height / 800;
// //             let newX = currentSize.width / arg;
// //             let newY = currentSize.height / arg;
// //             return {
// //                 x: newX,
// //                 y: newY
// //             };
// //         }
// //     } else {
// //         return currentSize;
// //     }
// //
// // }
//
// layer_floor.draw();
// layer_traps.draw();
//
//
// $("#edit_btn").on('click', edit_location);
//
// function edit_location() {
//     mode_status = 'edit';
//     var upper_children = layer_traps.getChildren();
//     for (let i = 0; i < upper_children.length; i++) {
//        upper_children[i].setAttr('draggable', true);
//     }
//     $("#edit_btn").off('click').on('click', save_location);
//     $('#edit_btn').html('Зберегти');
// }
//
// function save_location() {
//     mode_status = 'usual';
//     var floor_children = layer_floor.getChildren();
//     var floor_img = floor_children[0];
//     floor_img.on('contextmenu', function(e) {
//         return;
//     });
//     var upper_children = layer_traps.getChildren();
//     for (let i = 0; i < upper_children.length; i++) {
//        upper_children[i].setAttr('draggable', false);
//        location_to_bd({
//            id: upper_children[i].getAttr('bd_id'),
//            x: parseInt(upper_children[i].getAttr('x')),
//            y: parseInt(upper_children[i].getAttr('y')),
//        });
//        $("#edit_btn").off('click').on('click', edit_location);
//        $('#edit_btn').html('Редагувати');
//     }
// }
//
// function location_to_bd(trap){
//     const csrftoken = getCookie('csrftoken');
//     console.log(trap);
//     var data = {
//         'trap': trap,
//     };
//     $.ajax({
//         type: 'POST',
//         headers: {'X-CSRFToken': csrftoken},
//         url: 'change-trap-location',
//         data: data,
//         success: function (data) {
//             console.log(data);
//         },
//         dataType: 'json',
//     });
// }
//
//
// var scaleBy = 1.01;
// stage.on('wheel', (e) => {
//         // stop default scrolling
//         e.evt.preventDefault();
//
//         var oldScale = stage.scaleX();
//         var pointer = stage.getPointerPosition();
//
//         var mousePointTo = {
//           x: (pointer.x - stage.x()) / oldScale,
//           y: (pointer.y - stage.y()) / oldScale,
//         };
//
//         // how to scale? Zoom in? Or zoom out?
//         let direction = e.evt.deltaY > 0 ? 1 : -1;
//
//         // when we zoom on trackpad, e.evt.ctrlKey is true
//         // in that case lets revert direction
//         if (e.evt.ctrlKey) {
//           direction = -direction;
//         }
//
//         var newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;
//
//         stage.scale({ x: newScale, y: newScale });
//
//         var newPos = {
//           x: pointer.x - mousePointTo.x * newScale,
//           y: pointer.y - mousePointTo.y * newScale,
//         };
//         stage.position(newPos);
//       });
//
//
// function get_traps() {
//     $.ajax({
//         type: 'GET',
//         url: 'traps',
//         success: function(data) {
//             if (data['status'] != null) {
//                 if (data['status'] === 'ok') {
//                     for (let i = 0; i < data['data'].length; i++) {
//                         var group = new Konva.Group({
//                             draggable: true,
//                         });
//                         if (data['data'][i].x === 0 && data['data'][i].y === 0) {
//                             $('#menu').append('<button class="btn" id="' + data['data'][i].id + '" value=' + data['data'][i].id + '>' + data['data'][i].number + ' | ' + data['data'][i].model + '</button>');
//                             document.getElementById(data['data'][i].id).addEventListener('click', () => {
//                                 let down_chield = layer_floor.getChildren();
//                                 let point_pos = down_chield[0].getRelativePointerPosition();
//                                 var rect = new Konva.Rect({
//                                     bd_id: data['data'][i].id,
//                                     x: point_pos.x,
//                                     y: point_pos.y,
//                                     width: 15,
//                                     height: 15,
//                                     fill: trap_statuses[data['data'][i].status],
//                                     stroke: 'black',
//                                     strokeWidth: 1,
//                                     draggable: true,
//                                   });
//
//                                 rect.on('mousemove', function() {
//                                     var mousePos = stage.getPointerPosition();
//                                     tooltip.position({
//                                         x: mousePos.x,
//                                         y: mousePos.y,
//                                     });
//                                     let tooltip_chield = tooltip.getChildren();
//                                     tooltip_chield[1].text(data['data'][i].number + ' | ' + data['data'][i].model);
//                                     // tooltip.text(data['data'][i].number + ' | ' + data['data'][i].model);
//                                     tooltip.show();
//                                 });
//
//                                 rect.on('mouseout', function() {
//                                     tooltip.hide();
//                                 });
//
//                                 layer_traps.add(rect);
//                                 $("#"+data['data'][i].id).remove();
//                             });
//                         } else {
//                             let rect = new Konva.Rect({
//                                 bd_id: data['data'][i].id,
//                                 x: data['data'][i].x,
//                                 y: data['data'][i].y,
//                                 width: 15,
//                                 height: 15,
//                                 fill: trap_statuses[data['data'][i].status],
//                                 stroke: 'black',
//                                 strokeWidth: 1,
//                                 shadowColor: 'black',
//                                       shadowBlur: 5,
//                                       shadowOffsetX: 4,
//                                       shadowOffsetY: 4,
//                                       shadowOpacity: 0.6,
//                             });
//
//                             let trap_number = new Konva.Label({
//                                     opacity: 0.75,
//                                     visible: true,
//                                   });
//
//                             trap_number.add(
//                                     new Konva.Tag({
//                                       pointerDirection: 'down',
//                                       pointerWidth: 10,
//                                       lineJoin: 'round',
//                                       shadowColor: 'black',
//                                       shadowBlur: 10,
//                                       shadowOffsetX: 10,
//                                       shadowOffsetY: 10,
//                                       shadowOpacity: 0.5,
//                                     })
//                                   );
//
//                             trap_number.add(
//                                     new Konva.Text({
//                                       text: data['data'][i].number,
//                                       fontFamily: 'Calibri',
//                                       fontSize: 18,
//                                       fontStyle: 'bold',
//                                       padding: 5,
//                                       fill: 'black',
//                                     })
//                                   );
//
//                             trap_number.position({
//                                     x: data['data'][i].x + 7,
//                                     y: data['data'][i].y,
//                                 });
//                             trap_number.show();
//                             layer_traps.add(trap_number);
//
//                             rect.on('mousemove', function() {
//                                 var mousePos = stage.getPointerPosition();
//                                 tooltip.position({
//                                     x: data['data'][i].x + 15,
//                                     y: data['data'][i].y + 7,
//                                 });
//                                 let tooltip_chield = tooltip.getChildren();
//                                     tooltip_chield[1].text(data['data'][i].number + ' | ' + data['data'][i].model);
//                                 // tooltip.text(data['data'][i].number + ' | ' + data['data'][i].model);
//                                 tooltip.show();
//                             });
//
//                             rect.on('mouseout', function() {
//                                 tooltip.hide();
//                             });
//
//                             rect.on('mousedown touchstart', function() {
//                                 if (mode_status !== 'edit'){
//                                     let host_url = new URL($(location).prop('href'));
//                                     console.log(host_url.protocol+"//"+host_url.host+"/trap/"+data['data'][i].slug+"/info");
//                                     $(location).prop('href', host_url.protocol+"//"+host_url.host+"/trap/"+data['data'][i].slug+"/info");
//                                 }
//                             });
//
//                             rect.on('mouseenter', function () {
//                                 if (mode_status !== 'edit'){
//                                     stage.container().style.cursor = 'pointer';
//                                 }
//                             });
//
//                             rect.on('mouseleave', function () {
//                                 stage.container().style.cursor = 'default';
//                             });
//
//                             layer_traps.add(rect);
//                         };
//                     }
//                 } else if (data['status'] === 'error') {
//                     console.log(data)
//                 }
//             }
//         },
//         dataType: 'json',
//     });
// }
//
// $("#show_all").on('click', function (){
//     layer_traps.show();
//     layer_vulnerability.show();
// });
//
// $("#show_traps").on('click', function (){
//     layer_traps.show();
//     layer_vulnerability.hide();
// });
//
// $("#show_vulnerability").on('click', function (){
//     layer_traps.hide();
//     layer_vulnerability.show();
// });
//
// document.addEventListener('DOMContentLoaded', function() {
//     get_traps();
// }, false);