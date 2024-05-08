document.addEventListener("DOMContentLoaded", function() {
    new DataTable("#hubs_w", {
        "ordering":  false,
        "footerCallback": false,
        "info": false,
        "language": {
            "lengthMenu": `_MENU_ ${gettext("per page")}`,
            "zeroRecords": `${gettext("The table is empty")}`,
            "info": `${gettext("Page")} _PAGE_ from _PAGES_`,
            "infoEmpty": `${gettext("No records available")}`,
            "infoFiltered": gettext("(filtered from _MAX_ total records)"),
            "search": `${gettext("Search")}:`,
            "paginate": {
                "previous": `${gettext("Back")}`,
                "next": `${gettext("Forward")}`,
            }
        }
    });
}),
document.addEventListener("DOMContentLoaded", function() {
    new DataTable("#traps_w", {
        "ordering":  false,
        "footerCallback": false,
        "info": false,
        "language": {
            "lengthMenu": `_MENU_ ${gettext("per page")}`,
            "zeroRecords": `${gettext("The table is empty")}`,
            "info": `${gettext("Page")} _PAGE_ from _PAGES_`,
            "infoEmpty": `${gettext("No records available")}`,
            "infoFiltered": gettext("(filtered from _MAX_ total records)"),
            "search": `${gettext("Search")}:`,
            "paginate": {
                "previous": `${gettext("Back")}`,
                "next": `${gettext("Forward")}`,
            }
        }
    });
}),
    document.addEventListener("DOMContentLoaded", function() {
    new DataTable("#scroll-vertical", {
        scrollY: "100px",
        scrollCollapse: !0,
        paging: !1,
        searching: false,
    })
}),
    document.addEventListener("DOMContentLoaded", function() {
    new DataTable("#scroll-horizontal", {
        scrollX: !0
    })
}),
    document.addEventListener("DOMContentLoaded", function() {
    new DataTable("#alternative-pagination", {
        pagingType: "full_numbers"
    })
}),
    $(document).ready(function() {
    var e = $("#add-rows").DataTable(),
        a = 1;
    $("#addRow").on("click", function() {
        e.row.add([a + ".1", a + ".2", a + ".3", a + ".4", a + ".5", a + ".6", a + ".7", a + ".8", a + ".9", a + ".10", a + ".11", a + ".12"]).draw(!1), a++
    }), $("#addRow").click()
}), $(document).ready(function() {
    $("#example").DataTable()
}),
    document.addEventListener("DOMContentLoaded", function() {
    new DataTable("#fixed-header", {
        fixedHeader: !0
    })
}),
    document.addEventListener("DOMContentLoaded", function() {
    new DataTable("#model-datatables", {
        responsive: {
            details: {
                display: $.fn.dataTable.Responsive.display.modal({
                    header: function(e) {
                        e = e.data();
                        return "Details for " + e[0] + " " + e[1]
                    }
                }),
                renderer: $.fn.dataTable.Responsive.renderer.tableAll({
                    tableClass: "table"
                })
            }
        }
    })
}), document.addEventListener("DOMContentLoaded", function() {
    new DataTable("#buttons-datatables", {
        dom: "Bfrtip",
        buttons: ["excel", "print"],
        ordering: false,
        searching: false,
        paging: false,
        footerCallback: false
    })
}), document.addEventListener("DOMContentLoaded", function() {
    new DataTable("#ajax-datatables", {
        ajax: "/static/json/datatable.json"
    })
});

// $('#buttons-datatables').DataTable( {
//     buttons: [
//         'pdf'
//     ]
// } );