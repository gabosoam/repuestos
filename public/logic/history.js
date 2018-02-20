var types = [ {
    "value": 1,
    "text": "INGRESO"
  },
  {
    "value": 2,
    "text": "SALIDA"
  }];

kendo.culture("es-ES");
$(document).ready(function () {
    var socket = io.connect();
    socket.emit('getDates', function (category, brand) {
    dataSource = new kendo.data.DataSource({
        transport:{
            read: {url:"/history/read/"+productId, dataType: "json"},
            create: {url:"/model/create",type:"POST", dataType: "json"},
            destroy: { url: "/model/delete", type: "POST", dataType: "json" },
            update: { url: "/model/update", type: "POST", dataType: "json" },
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
                    description: { validation: { required: true, size:13 }, type: 'string' },
                    date: { validation: { required: true, }, type: 'date' },
                   
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
          columnMenu: false,
          groupable: true,
          resizable: true,
          sortable: true,
          
          pageable: { refresh: true, pageSizes: true, },
          toolbar: ['excel'],
          excel: {
            fileName: "Kendo UI Grid Export.xlsx",
            filterable: true,
            allPages: true
        },
          
       
          columns: [
            { field: "type",values: types, title: "Transacción", filterable: {search: true,multi:true }, hidden: false,sortable: false },
            { field: "date", title: "Fecha", filterable: {search: true,multi:false }, hidden: false, format: "{0:dd/MM/yyyy}",sortable: true },
            { field: "fdr", title: "FDR", filterable: {search: true,multi:true }, hidden: false,sortable: false },
            { field: "cso", title: "CSO", filterable: {search: true,multi:true }, hidden: false,sortable: false },
            { field: "wbs", title: "WBS", filterable: {search: true,multi:true }, hidden: false,sortable: false },
            { field: "location", title: "Ubicación", filterable: {search: true,multi:true }, hidden: false,sortable: false },
            { field: "name", title: "Proveedor", filterable: {search: true,multi:true }, hidden: false,sortable: false },
            { field: "company", title: "Empresa", filterable: {search: true,multi:true }, hidden: false,sortable: false },
            { field: "client", title: "Cliente", filterable: {search: true,multi:true }, hidden: false,sortable: false },
            { field: "clientcompany", title: "Empresa", filterable: {search: true,multi:true }, hidden: false,sortable: false },],
          editable: "popup"
      });

      function showDetails(e) {
        e.preventDefault();
        var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
        location.href = "/history/" + dataItem.id;
    }

    })


});