var states = [{
  "value": 0,
  "text": "EN BODEGA"
}, {
  "value": 1,
  "text": "ENTREGADO"
},
{
  "value": 2,
  "text": "RESERVADO"
}];

var types = [ {
  "value": 1,
  "text": "INGRESO"
},
{
  "value": 2,
  "text": "SALIDA"
}];


function etiqueta() {

  var gridDataArray = $('#grid').data('kendoGrid')._data;


  w3.displayObject("Etiquetas", { etiquetas: gridDataArray });

  $("#manchego2").kendoBarcode({
    value: "CIN2017420010",
    type: "code128",
    width: 150,
    height: 50
  });
  $("#myModal2").modal()
}



kendo.culture("es-ES");
$(document).ready(function () {
  dataSource = new kendo.data.DataSource({
    transport: {
      read: { url: "/product/read", dataType: "json" }
    },
    batch: true,
    pageSize: 10,
    serverFiltering: false,
    schema: {
      model: {
        id: "id",
        fields: {
          code: { type: "string" },
          type: { type: "string" },
          date: { type: 'date', editable: false },
          voucherdate: { type: 'date', editable: false },
          state: { type: 'state', editable: false }
        }
      }
    },


    group: [{ field: "description", dir: "asc" }],
    aggregate: [
      { field: "code", aggregate: "count" },
      { field: "category", aggregate: "count" },
      { field: "state", aggregate: "count" }],
    pageSize: 10000
  }
  );


  dataSourceEvent = new kendo.data.DataSource({
    transport: {
      read: { url: "/event", dataType: "json" }
    },
    batch: true,
    pageSize: 10,
    serverFiltering: false,
    schema: {
      model: {
        id: "id",
        fields: {
          code: { type: "string" },
          date: { type: 'date', editable: false },
          voucherdate: { type: 'date', editable: false },
          state: { type: 'state', editable: false }
        }
      }
    },

    pageSize: 10000
  }
  );

  dataSourceError = new kendo.data.DataSource({
    transport: {
      read: { url: "/error", dataType: "json" }
    },
    batch: true,

    serverFiltering: false,
    schema: {
      model: {
        id: "id",
        fields: {
          date: { type: 'date', editable: false },
          voucherdate: { type: 'date', editable: false }
        }
      }
    },

    pageSize: 10
  }
  );





  $("#grid").kendoGrid({
    dataSource: dataSource,
    height: 600,
    toolbar: ['excel'],
    pdf: {
      allPages: true,
      avoidLinks: true,
      paperSize: "A4",
      margin: { top: "3.8cm", left: "1cm", right: "1cm", bottom: "2.54cm" },
      landscape: true,
      repeatHeaders: true,
      template: $("#page-template").html(),
      scale: 0.8,
      fileName: "reporte.pdf",
      exportOnlyData: "true"
    },
    scrollable: true,
    columnMenu: true,
    filterable: true,
    resizable: true,
    groupable: true,

    pageable: { refresh: true },
    columns: [
      { field: "code", title: "Código", filterable: { multi: true, search: true } },
      { field: "barcode", title: "Serie", filterable: { multi: true, search: true } },
      { field: "description", title: "Producto",  filterable: { multi: true, search: true, search: true }},
      { field: "category", title: "Tipo", filterable: { multi: true, search: true } },
      { field: "brand",columnMenu: false, title: "Marca", filterable: { multi: true, search: true } },
      { field: "date", title: "Fecha", format: "{0:dd/MM/yyyy}", filterable: { multi: true, search: true, search: true }},
      
      { field: "name", title: "Proveedor", filterable: { multi: true, search: true } },
      { field: "company", title: "Empresa", filterable: { multi: true, search: true } },
      { field: "fdr", title: "FDR", filterable: { multi: true, search: true } },
      { field: "wbs", title: "WBS", filterable: { multi: true, search: true } },
      { field: "cso", title: "CSO", filterable: { multi: true, search: true } }
      
    ],
    dataBound: function (e) {
      if (this.dataSource.group().length > 0) {
        console.log($(".k-grouping-row"));

        for (var i = 0; i < $(".k-grouping-row").length; i++) {
          this.collapseGroup($(".k-grouping-row")[i]);
        }

      }
    }
  });

  $("#grid3").kendoGrid({
    dataSource: dataSourceError,
    toolbar: ['excel'],
    height: 600,
    scrollable: true,
    columnMenu: true,
    filterable: true,
    resizable: true,
    groupable: true,

    pageable: { refresh: true },
    columns: [
      { field: "type", title: "Tipo", filterable: { search: true, multi: true } },
      { field: "user", title: "Usuario", filterable: { search: true, multi: true, } },
      { field: "date", title: "Fecha", filterable: { search: true }, format: "{0:dd/MM/yyyy HH:mm:ss}" },
      { field: "message", title: "Mensaje", filterable: { multi: true, search: true } },
    ],

  });



  $("#grid2").kendoGrid({
    dataSource: dataSourceEvent,
    toolbar: ['excel'],
    height: 600,
    scrollable: true,
    columnMenu: true,
    filterable: true,
    resizable: true,
    groupable: true,
    pageable: { refresh: true },
    columns: [
      { field: "table", title: "Tabla afectada", filterable: { search: true, multi: true } },
      { field: "values", title: "Valores", filterable: { search: true } },
      { field: "user", title: "Usuario", filterable: { search: true, multi: true, } },
      { field: "date", title: "Fecha", filterable: { search: true }, format: "{0:dd/MM/yyyy HH:mm:ss}" },
      { field: "ip", title: "IP Origen", filterable: { multi: true, search: true } },
      { field: "type", title: "Tipo", filterable: { search: true, multi: true } },
    ],

  });



  $('#panel').on('DOMSubtreeModified', function (event) {
    $("#grid3").data("kendoGrid").dataSource.read();
  });


});
