

kendo.culture("es-ES");
$(document).ready(function () {


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

    function buscador(sql) {
        alert(sql)
    }





    var socket = io.connect();

    socket.emit('getDates', function (category, brand) {
    dataSource = new kendo.data.DataSource({
        transport:{
            read: {url:"/product/read", dataType: "json"},
            
            create: {url:"/product/create",type:"POST", dataType: "json"},
            
            destroy: { url: "/product/delete", type: "POST", dataType: "json" },
            update: { url: "/product/update", type: "POST", dataType: "json" },
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
        schema: {
            model: {
                id: "id",
                fields: {
                    code: { validation: { required: true, size:13 }, type: 'string' },
                    description: { validation: { required: true, size:13 }, type: 'string' , editable:false},
    
                   
                    brand: { validation: { required: true, }, type: 'string', editable:false },
                    category: { validation: { required: true, }, type: 'string', editable:false },
                  
                }
            }
        }
    },
    );

    $.get( "/model/readmodel", function( codes ) {
        $("#grid").kendoGrid({
            dataSource: dataSource,
            height: 475,
            filterable: true,
            columnMenu: true,
            groupable: true,
            resizable: true,
            
            pageable: { refresh: true, pageSizes: true, },
     
            columns: [
              { field: "description", title: "Producto",filterable: { search: true, multi:true } },
                { field: "brand", title: "Marca", filterable: {search: true, multi: true } },
                { field: "category", editable: false, title: "Tipo", filterable: {search: true, multi: true } },
                { field: "code", values: codes, editor: comboCodigos, title: "Código", filterable: {search: true,multi:true } },
                { field: "barcode", title: "Número de serie", filterable: {search: true,multi:true } },
                { command: [{ text: "Historial", click: showDetails, iconClass: 'icon icon-chart-column' }], title: "Acciones" }],
            editable: "popup"
        });
      });
    
   

      function showDetails(e) {
        e.preventDefault();
        var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
        location.href = "/history/" + dataItem.id;
    }

    })


});