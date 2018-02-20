

kendo.culture("es-ES");
$(document).ready(function () {
    var socket = io.connect();
    socket.emit('getDates', function (category, brand) {

        console.log(brand)
    dataSource = new kendo.data.DataSource({
        transport:{
            read: {url:"/model/read", dataType: "json"},
            create: {url:"/model/create",type:"POST", dataType: "json"},
            destroy: { url: "/model/delete", type: "POST", dataType: "json" },
            update: { url: "/model/update", type: "POST", dataType: "json" },
            parameterMap: function (options, operation) {
                if (operation !== "read" && options.models) {
                    var datos = options.models[0]
                    console.log(datos)
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
                    code: { validation: { required: true, size:13 }, type: 'string' },
                    description: { validation: { required: true, size:13 }, type: 'string' },
                    brand: { validation: { required: true, }, type: 'string' },
                    category: { validation: { required: true, }, type: 'string' },
                  
                }
            }
        }
    },
    );

    
    
      $("#grid").kendoGrid({
          dataSource: dataSource,
          height: 475,
          filterable: true,
          columnMenu: true,
          groupable: true,
          resizable: true,
          
          pageable: { refresh: true, pageSizes: true, },
          toolbar: ['create','excel'],
          
       
          columns: [
              { field: "code", title: "Código", filterable: {search: true,multi:true } },
              { field: "description", title: "Producto",filterable: { search: true, multi:true } },
              { field: "brand", values:brand, title: "Marca", filterable: {search: true, multi: true } },
              { field: "category", values:category, title: "Tipo", filterable: {search: true, multi: true } },
              { command: ["edit", "destroy"], title: "Acciones" }],
          editable: "popup"
      });



    })


});