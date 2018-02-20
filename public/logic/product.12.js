

$('#btnPrint').hide();
$("#txtSerie").kendoComboBox();

var validator = $("#formsave").kendoValidator().data("kendoValidator");
var validatorModel = $("#formSaveModel").kendoValidator().data("kendoValidator");
$("#save").on("click", function () {
    if (validator.validate()) {
        save();
    }
});

dataSourceCombo = new kendo.data.DataSource({
    transport: {
        read: {
            url: "/model/read",
            dataType: "json"
        }
    }
});

$("#txtCodigo").kendoComboBox({
    dataSource: dataSourceCombo,
    filter: "contains",
    dataTextField: "code",
    dataValueField: "id",
    placeholder: "Buscar código...",
    minLength: 1,
    change: onChange
});

function onChange(e) {



    var code = this.value();

    $('#code2').val(code);

    var valor = code.replace("#", "%26");


    $.ajax({
        type: 'GET',
        url: '/model/' + valor,
        success: sendData
    });



};

function sendData(data) {

    if (data.length > 0) {

       
        $("#txtSerie").data("kendoComboBox").value("");

        
        dataSourceSeries = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/product/read/" + data[0].id,
                    dataType: "json"
                }
            }
        });

        $("#txtSerie").kendoComboBox({
            dataSource: dataSourceSeries,
            filter: "contains",
            dataTextField: "barcode",
            dataValueField: "id",
            placeholder: "Buscar serie...",
            minLength: 1,
        });




        $('#modelProduct').val(data[0].id);
    
    } else {
        var r = confirm("El producto con el código " + $('#code2').val() + " no existe \n ¿Desea agregarlo?");
        if (r == true) {
            $('#myModal').modal({
                backdrop: 'static',
                keyboard: false
            })
            $('#codeModal').val($('#code2').val());
        } else {

        }
    }

}


dataSourceCombo = new kendo.data.DataSource({
    transport: {
        read: {
            url: "/model/read",
            dataType: "json"
        }
    }
});

function comboCodigos(container, options) {
    $('<input required data-bind="value:' + options.field + '"/>')
        .appendTo(container)
        .kendoComboBox({
            dataSource: dataSourceCombo,
            dataTextField: "code",
            dataValueField: "id",
            filter: "contains",
            minLength: 1
        });
}


function generateBarcode() {
    $.get("/generateBarcode", function (data) {

        $('#barcode').val(data[0].barcode);

    });
}

$("#saveModel").on("click", function () {
    if (validatorModel.validate()) {
        saveModel();
    }
});

$("#closeBill").on("click", function () {


    if (userBill == userSession) {
        const confirmation = confirm('Al cerrar la saida ya no se podrá agregar ni eliminar productos a esta orden \n ¿Desea continuar?');
        if (confirmation) {
            $.post("/bill/close", { code: bill }, function (data) {
                if (data.affectedRows > 0) {
                    location.href = "/voucher/" + bill;

                } else {

                }
            });
        } else {

        }
    } else {
        alert('Sólo el usuario ' + user + ' puede cerrar el ingreso');
    }


});

$('#barcode').keypress(function (e) {
    if (e.which == 13) {
        if ($(this).val() != '') {
            save();

        } else {

        }

    }
});

$('#code2').keypress(function (e) {

    if (e.which == 13) {

        if ($('#code2').val() != '') {
            var valor = $(this).val().replace("#", "%26");

            $.ajax({
                type: 'GET',
                url: '/model/' + valor,
                success: sendData
            });
        }
    }
});



function sendData2(data) {
    if (data.length > 0) {
        $('#modelProduct').val(data[0].id)

    } else {
        var r = confirm("El producto con el código " + $('#code2').val() + " no existe \n ¿Desea agregarlo?");
        if (r == true) {
            $('#myModal').modal('show');
            $('#codeModal').val($('#code2').val());
        } else {
            alert('not okay');
        }
    }

}

function save() {
    var validator = $("#formsave").kendoValidator().data("kendoValidator");
    if (validator.validate()) {
        var data = $('#formsave').serialize();
        var data2 = $('#formsave').serializeArray();

        if (data2[4].value == 'S/N') {
            var x = prompt("Ingresar la cantidad ", "1");
            var cant = parseInt(x);
            data2.push({ name: "cant", value: cant });

            $.post("/product/createserial", data2, function (info) {

                if (info != 'Ya existe el producto') {
                    $('#grid2').data('kendoGrid').dataSource.read();
                    $('#grid2').data('kendoGrid').refresh();

                    $('#barcode').focus();
                } else {
                    alert('Ya existe el número de serie');
                    $('#barcode').focus();
                }

            });


        } else if (data2[4].value.toUpperCase() == 'A/S') {

            var x = prompt("Ingresar la cantidad ", "1");
            var cant = parseInt(x);
            data2.push({ name: "cant", value: cant });

            $.post("/product/createserialauto", data2, function (info) {
                alert(info)
                if (info == 'Ingreso correcto') {
                    $('#grid2').data('kendoGrid').dataSource.read();
                    $('#grid2').data('kendoGrid').refresh();

                    $('#barcode').focus();
                } else {
                    alert('Existio un error');
                    $('#barcode').focus();
                }

            });



        } else {
            var confirmation = confirm('Está seguro de guardar el número de serie: ' + data2[4].value);

            if (confirmation) {
                $.post("/product/create", data, function (info) {

                    if (info != 'Ya existe el producto') {
                        $('#grid2').data('kendoGrid').dataSource.read();
                        $('#grid2').data('kendoGrid').refresh();

                        $('#barcode').focus();
                    } else {
                        alert('Ya existe el número de serie');
                        $('#barcode').focus();
                    }

                });

            }
        }

    }

}

function saveModel() {

    var data = $('#formSaveModel').serialize();
    var data2 = $('#formSaveModel').serializeArray();


    $.post("/model/create", data, function (info) {

        if (info) {
            $('#nameProduct').data('kendoComboBox').dataSource.read();
            $('#nameProduct').data('kendoComboBox').refresh();

            $.ajax({
                type: 'GET',
                url: '/model/' + data2[0].value,
                success: sendData
            });
            $('#myModal').modal('toggle');
            $('#formSaveModel')[0].reset();

        } else {


        }



    });
}

$(document).ready(function () {

    dataSourceCombo = new kendo.data.DataSource({
        transport: {
            read: {
                url: "/model/read",
                dataType: "json"
            }
        }
    });

    dataSourceLocation = new kendo.data.DataSource({
        transport: {
            read: {
                url: "/location/read",
                dataType: "json"
            }
        }
    });

    dataSourceBrand = new kendo.data.DataSource({
        transport: {
            read: {
                url: "/brand/read",
                dataType: "json"
            }
        }
    });

    dataSourceCategory = new kendo.data.DataSource({
        transport: {
            read: {
                url: "/category/read",
                dataType: "json"
            }
        }
    });




    $("#nameProduct").kendoComboBox({
        dataSource: dataSourceCombo,
        filter: "contains",
        dataTextField: "description",
        dataValueField: "code",
        placeholder: "Buscar producto",
        minLength: 1,
        change: onChange
    });



    function onChange(e) {



        var code = this.value();

        $('#code2').val(code);

        var valor = code.replace("#", "%26");


        $.ajax({
            type: 'GET',
            url: '/model/' + valor,
            success: sendData
        });



    };

    $("#location").kendoDropDownList({
        dataSource: dataSourceLocation,
        editable: false,
        dataTextField: "name",
        dataValueField: "id",
        title: "Seleccionar almacén",
        minLength: 1

    });

    $("#brand").kendoDropDownList({
        dataSource: dataSourceBrand,
        editable: false,
        dataTextField: "name",
        dataValueField: "id",
        title: "Seleccionar almacén",
        minLength: 1

    });

    $("#category").kendoDropDownList({
        dataSource: dataSourceCategory,
        editable: false,
        dataTextField: "name",
        dataValueField: "id",
        title: "Seleccionar almacén",
        minLength: 1

    });






    $('#formSaveModel')[0].reset();

    function userNameAutoCompleteEditor(container, options) {
        $('<input required data-bind="value:' + options.field + '"/>')
            .appendTo(container)
            .kendoAutoComplete({
                dataSource: dataSourceCombo,
                placeholder: "Busca un producto",
                dataTextField: "description",
                filter: "contains",
                minLength: 1
            });
    }

    function editNumberWithoutSpinners(container, options) {
        $('<input data-text-field="' + options.field + '" ' +
            'data-value-field="' + options.field + '" ' +
            'data-bind="value:' + options.field + '" ' +
            'data-format="' + options.format + '"/>')
            .appendTo(container)
            .kendoNumericTextBox({
                spinners: false
            });
    }

    dataSource = new kendo.data.DataSource({
        transport: {
            read: { url: "/bill/read/" + bill, dataType: "json" },
            update: { url: "/product/update2", type: "POST", dataType: "json" },
            destroy: { url: "/product/delete2", type: "POST", dataType: "json" },
            create: {
                url: "/product/create2", type: "POST", dataType: "json", success: function (data) {
                    alert(data)
                },
            },
            parameterMap: function (options, operation) {
                if (operation !== "read" && options.models) {
                    var datos = options.models[0]
                    return datos;
                }
            }
        },

        batch: true,
        pageSize: 10,
        serverFiltering: false,
        requestEnd: function (e) {
            if (e.type != "read") {
                // refresh the grid
                e.sender.read();
            }
        },
        schema: {
            model: {
                id: "id",
                fields: {
                    id: { editable: false },
                    Producto: { editable: false },
                    barcode: { validation: { required: true }, type: 'string', editable: true },
                    brand: { validation: { required: true }, type: 'string', editable: false },
                    category: { validation: { required: true }, type: 'string', editable: false },
                    description: { validation: { required: true, }, type: 'string', editable: false },
                    bill: { type: 'string', defaultValue: bill, editable: false, visible: false },
                
                    code: { editable: true }
                }
            }
        },
     
        group: {
            field: "code", aggregates: [
                { field: "barcode", aggregate: "count" },
                { field: "code", aggregate: "count" },
            ]
        },
        aggregate: [{ field: "barcode", aggregate: "count" }],
        aggregate: [{ field: "code", aggregate: "count" }],
        pageSize: 1000
    },
    );

    $.get("/location/read2", function (data) {

        $.get( "/model/readmodel", function( codes ) {
            $("#grid2").kendoGrid({
                dataSource: dataSource,
            
                dataSource: dataSource,
                height: 475,
                filterable: true,
                groupable: true,
                resizable: true,

                pageable: { refresh: true, pageSizes: true, },
                toolbar: ['excel'],
                toolbar: ['excel'],

                pageable: { refresh: true, pageSizes: true, },
                pdf: {
                    allPages: true,
                    avoidLinks: true,
                    paperSize: "A4",
                    margin: { top: "7.8cm", left: "1cm", right: "1cm", bottom: "2.54cm" },
                    landscape: false,
                    repeatHeaders: true,
                    template: $("#page-template").html(),
                    scale: 0.8
                },
                pdfExport: function (e) {
                    var grid = $("#grid2").data("kendoGrid");
                    grid.hideColumn(5);
                    grid.hideColumn(7);

                    e.promise
                        .done(function () {
                            grid.showColumn(5);
                            grid.showColumn(7);
                        });
                },
                columns: [
                    { field: "description", title: "Producto", filterable: { search: true, multi:true } },
                    { field: "category", title: "Tipo",filterable: { search: true, multi:true }},
                    { field: "brand", title: "Marca",filterable: { search: true, multi:true } },
                    { field: "code", title: "Código", filterable: { search: true, multi:true }, values: codes, editor: comboCodigos, aggregates: ["min", "max", "count"], groupHeaderTemplate: "Cantidad: #= count#"},
                    { field: "barcode", aggregates: ["count"], title: "No. de serie", filterable: { search: true, multi:true } },
               
                    { field: "fdr", title: "FDR" },
                    { field: "cso", title: "CSO" },
                    { field: "wbs", title: "WBS" },
                    { field: "comment", title: "Área" },
                    { field: "bill", title: "Factura", hidden:true },
                    { command: ["edit", "destroy"], title: "Acciones" }],
                editable: "popup"
            })

        })


    });





})
