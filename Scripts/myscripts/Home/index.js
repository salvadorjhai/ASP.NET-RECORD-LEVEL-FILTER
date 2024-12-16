
var dtProduct;
var dtProductData;
function reloadProductTable() {

    // check if initialized
    if (dtProduct == null) {
        initProductTable()
        return;
    }

    // else change url
    var q = {
        statuslvl: statuslevelfilter.active_filter
    }

    dtProduct.ajax.url("/product/LoadProducts?q=" + JSON.stringify(q)).load(function (json) {
        dtProductData = json.data
        // add other function to be called after table reloads
        dtProduct.columns.adjust();

        setTimeout(statuslevelfilter.updateBadgeCount(json.badgecount), 1); // update badge count
    }, false)

}
function initProductTable() {

    var q = {
        statuslvl: statuslevelfilter.active_filter
    }

    $('#ProductTable').DataTable().destroy();
    dtProduct = $('#ProductTable').DataTable({
        stateSave: true,
        ajax: {
            "url": "/product/LoadProducts?q=" + JSON.stringify(q),
            "type": "GET",
            datatype: "json",
            error: function (errormessage) {
                toastError("Error!", "Failed to load datatable ...")
            }
        },
        pageLength: 5,
        order: [[1, "asc"]], // index based
        lengthMenu: [
            [5, 10, 30, 50, -1],
            [" 5", 10, 30, 50, "All"]
        ],
        autoWidth: true,
        initComplete: function (settings, json) {
            dtProductData = json.data;
            document.body.style.cursor = 'default';

            setTimeout(statuslevelfilter.updateBadgeCount(json.badgecount), 1); // update badge count
        },
        columns: [
            // data: , name: , orderable: , autoWidth: , width: , className: 'text-center' , "visible":false
            { "data": "id", "autoWidth": true },
            { "data": "ProductName", "autoWidth": true },
            { "data": "ProductDescription", "autoWidth": true },
            { "data": "ProductCategory", "autoWidth": true },
            { "data": "ProductCategoryDescription", "autoWidth": true },
            { "data": "ProductPrice", "autoWidth": true }
        ],
        aoColumnDefs: [
            {
                "width": "90px",
                "aTargets": [0], // target column
                "bSortable": false,
                "mRender": function (data, type, full, meta) {
                    return `<button class="btn btn-primary btn-sm btnRowEdit" style="font-size:smaller;" id="vw_${full.id}" data-id="${full.id}" onclick="showEditProductModal(${full.id})"> <span class="fas fa-edit"></span> VIEW</button> `;
                },
                "className": "text-center text-uppercase"
            }
        ]

    });
}

function showProductModal() {
    $(".field-validation-error, .validation-summary-errors > ul").empty();
    $('#ProductForm')[0].reset();
    $('#id').val('-1');

    $('#ProductModal h5').text('ADD NEW DETAILS');
    $('#ProductModal').modal('show');

    // to update next level display
    statuslevelfilter.BuildMoveToButtons(0)
}

function showEditProductModal(id) {

    $.ajax({
        url: "/product/getbyid/?id=" + id,
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        success: function (result, textStatus, jqXHR) {
            if (result.data != null) {
                fillProductForm(result.data);
                $('#ProductModal h5').text('EDIT DETAILS');
                $('#ProductModal').modal('show');
                $('#ProductModal').find('form').data('isDirty', false);
            } else {
                swal("Error!", "There are no details to display.\n", "warning");
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            swal("Error!", "Oops! something went wrong ... \n", "error");

        }
    });
}

function fillProductForm(js) {
    window._seldata = js;
    $('#id').val(js['id']);
    $('#id').closest('form').data('isDirty', false);
    $('#ProductName').val(js['ProductName']);
    $('#ProductDescription').val(js['ProductDescription']);
    $('#ProductCategory').val(js['ProductCategory']);
    $('#ProductCategoryDescription').val(js['ProductCategoryDescription']);
    $('#ProductPrice').val(js['ProductPrice']);

    // to update next level display
    statuslevelfilter.BuildMoveToButtons(js.statuslvl)
}

function saveProductForm() {

    var model = {
        id: _.toNumber($('#id').val()),
        ProductName: $('#ProductName').val(),
        ProductDescription: $('#ProductDescription').val(),
        ProductCategory: $('#ProductCategory').val(),
        ProductCategoryDescription: $('#ProductCategoryDescription').val(),
        ProductPrice: _.toNumber($('#ProductPrice').val())
    }

    $.ajax({
        url: "/product/upsert",
        data: JSON.stringify(model),
        type: "POST",
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        success: function (response, textStatus, jqXHR) {
            var msg;
            if (response.result == null) {
                msg = response.toLowerCase();
            } else {
                msg = response.result.toLowerCase();
            }
            if (msg.includes("success")) {
                $('#ProductModal').find('form').data('isDirty', false);
                $('#ProductModal').modal('hide');
                reloadProductTable(); // or dtProductTable.ajax.reload(null,false)
                swal("Saved!", "Record has been saved", "success");

            } else if (msg.includes("nochange")) {
                $('#ProductModal').find('form').data('isDirty', false);
                $('#ProductModal').modal('hide');
            } else {
                swal("Error", "An error occured: " + msg + "\n", "warning");

            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status == 401) {
                swal2({
                    title: `Unauthorized`,
                    html: 'It seems you have been logged out.<br><b>Please login and try again.</b>',
                    icon: 'error',
                    dangerMode: true,
                    showCancelButton: false,
                }, () => {
                    window.location = "/Authentication/Logout";
                });
                return;
            }
            swal("Error!", "Oops! something went wrong ... \n", "error");
        }
    });


}

/** ----------------------------------- */

function onMoveToLevelButtonClicked(sender) {
    var moveToId = $(sender)[0].dataset.value
    var moveToTitle = $(sender)[0].dataset.title

    swal2({
        title: `Update Status?`,
        html: `Are you sure you want to move and update the status to <b>${moveToTitle}</b>`,
        icon: 'warning',
        dangerMode: true,
    }, () => {
        updateProductStatus(window._seldata.id, moveToId)
    });

}

function updateProductStatus(id, newstatusid) {

    var model = {
        id: _.toNumber($('#id').val()),
        statusid: _.toNumber(newstatusid),
    }

    $.ajax({
        url: "/product/updatestatuslevel",
        data: JSON.stringify(model),
        type: "POST",
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        success: function (response, textStatus, jqXHR) {
            var msg;
            if (response.result == null) {
                msg = response.toLowerCase();
            } else {
                msg = response.result.toLowerCase();
            }
            if (msg.includes("success")) {
                $('#ProductModal').find('form').data('isDirty', false);
                $('#ProductModal').modal('hide');
                reloadProductTable(); // or dtProductTable.ajax.reload(null,false)
                swal("Saved!", "Record has been saved", "success");

            } else if (msg.includes("nochange")) {
                $('#ProductModal').find('form').data('isDirty', false);
                $('#ProductModal').modal('hide');
            } else {
                swal("Error", "An error occured: " + msg + "\n", "warning");

            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status == 401) {
                swal2({
                    title: `Unauthorized`,
                    html: 'It seems you have been logged out.<br><b>Please login and try again.</b>',
                    icon: 'error',
                    dangerMode: true,
                    showCancelButton: false,
                }, () => {
                    window.location = "/Authentication/Logout";
                });
                return;
            }
            swal("Error!", "Oops! something went wrong ... \n", "error");
        }
    });


}

var statuslevelfilter = new StatusLevelFilter({
    parent_filter: $('#js-level-filter'),
    parent_statusbutton: $('#js-level-update'),
    // function to call after filter
    onLevelFilterClicked_Handler: reloadProductTable,
    // function to click on status update
    onMoveToLevelButtonClicked_Handler: onMoveToLevelButtonClicked,
    // default level id
    default_level: 1,
    // approval level
    approval_levels: [
        {
            id: 1,
            status: "Prepared",
            name: "Prepare",
            btnclass: `btn btn-outline-primary`,
            badgeclass: `badge bg-primary`,
            backclass: `btn btn-danger`,
            moveclass: `btn btn-success`,
        },
        {
            id: 2,
            status: "For Checking",
            name: "Submit",
            btnclass: `btn btn-outline-primary`,
            badgeclass: `badge bg-primary`,
            backclass: `btn btn-danger`,
            moveclass: `btn btn-success`,
        },
        {
            id: 3,
            status: "Endorsed",
            name: "Endorse",
            btnclass: `btn btn-outline-primary`,
            badgeclass: `badge bg-primary`,
            backclass: `btn btn-danger`,
            moveclass: `btn btn-success`,
        },
        {
            id: 9,
            status: "Approved",
            name: "Approve",
            btnclass: `btn btn-outline-primary`,
            badgeclass: `badge bg-primary`,
            backclass: `btn btn-danger`,
            moveclass: `btn btn-success`,
        },
        {
            id: 5,
            status: "Cancelled/Deleted",
            name: "Cancel",
            btnclass: `btn btn-outline-danger`,
            badgeclass: `badge bg-danger`,
            backclass: `btn btn-danger`,
            moveclass: `btn btn-warning`,
            iscancelled: true,
        }
    ]
});

// allowed movement
statuslevelfilter.allowed_movement = [
    // can prepare
    {
        id: 1,
        backlevel: 1,
        movelevel: 1,
    },
    // can submit
    {
        id: 2,
        backlevel: 1,
        movelevel: 1,
    },
    // can approve
    {
        id: 9,
        backlevel: 1,
        movelevel: 1,
    },
]

// initialize
statuslevelfilter.Initialize();
