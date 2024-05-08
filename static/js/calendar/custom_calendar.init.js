task_statuses = {
        "1": "bg-soft-dark",
        "2": "bg-soft-success",
        "3": "bg-soft-warning",
        "4": "bg-soft-danger"
    }

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
document.addEventListener('DOMContentLoaded', function() {
        var form_modal = new bootstrap.Modal(document.getElementById("event-modal"), {
            keyboard: !1
        })
        var event_modal = new bootstrap.Modal(document.getElementById("event-show-modal"), {
            keyboard: !1
        })
        var i = (document.getElementById("event-modal"), document.getElementById("modal-title"))
        var v = null
        var form_event = document.getElementById("form-event")
        var choices_object = new Choices("#task_object", {
            searchEnabled: !1
        })
        var choices_technologist = new Choices("#task_technologist", {
            searchEnabled: !1
        })
        var choices_technic = new Choices("#task_technic", {
            searchEnabled: !1
        })
        var y = events_from_db
        console.log(events_from_db)
        function date_click(e) {
            document.getElementById("form-event").reset(),
            document.getElementById("btn-delete-event").setAttribute("hidden", !0),
            form_modal.show(),
            form_event.classList.remove("was-validated"),
            form_event.reset(),
            v = null,
            i.innerText = gettext("Add task"),
            newEventData = e,
            console.log(e.dateStr),
            document.getElementById("event-start-date").value = e.dateStr,
            document.getElementById("edit-event-btn").setAttribute("data-id", "new-event"),
            document.getElementById("edit-event-btn").click(),
            document.getElementById("edit-event-btn").setAttribute("hidden", !0)
        }

        function eventClicked() {
            document.getElementById("form-event").classList.add("view-event"),
            document.getElementById("event-start-date").parentNode.classList.add("d-none"),
            document.getElementById("event-start-date").classList.replace("d-block", "d-none"),
            document.getElementById("btn-save-event").setAttribute("hidden", !0)
        }

        function editEvent(e) {
            var t = e.getAttribute("data-id");
            ("new-event" == t ? (document.getElementById("modal-title").innerHTML = "",
                                 document.getElementById("modal-title").innerHTML = gettext("Add task"),
                document.getElementById("btn-save-event").innerHTML = gettext("Add"), eventTyped) : "edit-event" == t ? (e.innerHTML = "Cancel", e.setAttribute("data-id", "cancel-event"),
                document.getElementById("btn-save-event").innerHTML = "Update Event",
                e.removeAttribute("hidden"), eventTyped) : (e.innerHTML = "Edit", e.setAttribute("data-id", "edit-event"),
                eventClicked))()
        }

        function r() {
            return 768 <= window.innerWidth && window.innerWidth < 1200 ? "timeGridWeek" : window.innerWidth <= 768 ? "listMonth" : "dayGridMonth"
        }
        function o(e) {
            document.getElementById("form-event").reset(),
                document.getElementById("btn-delete-event").setAttribute("hidden", !0),
                form_modal.show(), l.classList.remove("was-validated"),
                form_event.reset(),
                v = null,
                i.innerText = "Add Event",
                newEventData = e,
                document.getElementById("edit-event-btn").setAttribute("data-id", "new-event"),
                document.getElementById("edit-event-btn").click(),
                document.getElementById("edit-event-btn").setAttribute("hidden", !0)
        }
        var calendarEl = document.getElementById('calendar');
        var E = new FullCalendar.Calendar(calendarEl, {
            timeZone: "local",
            editable: !0,
            droppable: !0,
            selectable: !0,
            navLinks: !0,
            initialView: r(),
            themeSystem: "bootstrap",
            headerToolbar: {
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth"
            },
            windowResize: function(e) {
                var t = r();
                E.changeView(t)
            },
            events: y,
            dateClick: function(e) {
                date_click(e)
            },
            eventClick: function(e) {
                task_data = e.event._def.extendedProps.data.split("|")

                // document.getElementById("show_task_object").value,
                // document.getElementById("show_task_technologist").value,
                // document.getElementById("show_task_technic").value = "pest_technician_01@fake.com",
                // document.getElementById("show_task").value,
                // document.getElementById("show_event-category").value = task_data[3],
                // document.getElementById("show_task_time").value = task_data[5],
                // document.getElementById("show_description").value
                $('#show_task_object').text(task_data[0])
                $('#show_task').text(task_data[1])
                $('#show_task_technologist').text(task_data[2])
                $('#show_task_technic').text(task_data[3])
                $('#show_event-category').text(task_data[4])
                $('#show_task_date').text(task_data[5])
                $('#show_task_time').text(task_data[6])
                $('#show_description').text(task_data[7])

                document.getElementById("edit-event-btn").removeAttribute("hidden"),
                document.getElementById("btn-save-event").setAttribute("hidden", !0),
                document.getElementById("edit-event-btn").setAttribute("data-id", "edit-event"),
                document.getElementById("edit-event-btn").setAttribute("hidden", !0),
                document.getElementById("edit-event-btn").innerHTML = "Edit",
                eventClicked(),
                // form_modal.show(),
                event_modal.show(),
                // form_event.reset(),
                v = e.event,
                newEventData = null,
                i.innerText = v.title,
                document.getElementById("btn-delete-event").removeAttribute("hidden")
            }
        });
        console.log(E.getEvents())
        E.render();
        form_event.addEventListener("submit", function(e) {
            const csrftoken = getCookie('csrftoken');
            e.preventDefault();
            var task_object = document.getElementById("task_object").value,
                task_technologist = document.getElementById("task_technologist").value,
                task_technic = document.getElementById("task_technic").value,
                task = document.getElementById("task").value,
                task_status = document.getElementById("event-category").value,
                task_date = document.getElementById("event-start-date").value,
                task_time = document.getElementById("task_time").value,
                description = document.getElementById("description").value

            var data = {
                'task_object': task_object,
                'pest_company_id': pest_company_id,
                'task_technologist': task_technologist,
                'task_technic': task_technic,
                'task': task,
                'task_status': task_status,
                'task_date': task_date,
                'task_time': task_time,
                'description': description,
            };
            var calendar = E;
            var task_status_style = task_statuses[task_status];
            $.ajax({
                type: 'POST',
                headers: {'X-CSRFToken': csrftoken},
                url: 'create_calendar_task',
                data: data,
                success: function (data) {

                    var new_task = {
                        id: data["id"],
                        title: data["data"]["title"],
                        start: task_date,
                        className: task_status_style,
                        allDay: !0,
                        data: `${task_object}|${task}|${task_technologist}|${task_technic}|${task_status}|${task_date}|${task_time}|${description}`
                    }
                    calendar.addEvent(new_task)
                    events_from_db.push(new_task)
                    calendar.render();
                    console.log(data["data"]["title"]);
                },
                dataType: 'json',
            });


            form_modal.hide();



            // {
            //     id: 1,
            //     title: event_category + " " + ,
            //     start: "2023-06-21",
            //     className: "bg-soft-info",
            //     allDay: !0
            // }

            //     m = !1,
            //     u = (1 < d.length ? ((o = new Date(d[1])).setDate(o.getDate() + 1),
            //         d = new Date(d[0]), m = !0) : (t = d, u = document.getElementById("timepicker1").value.trim(),
            //         n = document.getElementById("timepicker2").value.trim(),
            //         d = new Date(d + "T" + u), o = new Date(t + "T" + n)), y.length + 1);
            // !1 === p[0].checkValidity() ? p[0].classList.add("was-validated") : (v ? (v.setProp("id", s), v.setProp("title", e), v.setProp("classNames", [a]), v.setStart(i), v.setEnd(l), v.setAllDay(m), v.setExtendedProp("description", c), v.setExtendedProp("location", r), t = y.findIndex(function(e) {
            //     return e.id == v.id
            // }), y[t] && (y[t].title = e, y[t].start = i, y[t].end = l, y[t].allDay = m, y[t].className = a, y[t].description = c, y[t].location = r), E.render()) : (E.addEvent(n = {
            //     id: u,
            //     title: e,
            //     start: d,
            //     end: o,
            //     allDay: m,
            //     className: a,
            //     description: c,
            //     location: r
            // }), y.push(n)), g.hide(), upcomingEvent(y))
        });
        // document.getElementById("btn-new-event").addEventListener("click", function(e) {
        //     o(),
        //     document.getElementById("edit-event-btn").setAttribute("data-id", "new-event"),
        //     document.getElementById("edit-event-btn").click(),
        //     document.getElementById("edit-event-btn").setAttribute("hidden", !0)
        // })

      });