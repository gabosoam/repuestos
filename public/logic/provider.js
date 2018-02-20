var roles = [{
    "value": 1,
    "text": "Usuario"
}, {
    "value": 2,
    "text": "Administrador"
}];



kendo.culture("es-ES");
$(document).ready(function () {

    dataSource = new kendo.data.DataSource({
        transport: {
            read: { url: "/provider/read", dataType: "json" },
            update: { url: "/provider/update", type: "POST", dataType: "json" },
            destroy: { url: "/provider/delete", type: "POST", dataType: "json" },
            create: { url: "/provider/create", type: "POST", dataType: "json" },
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
                    id: { editable: false, nullable: false},
                    name: { validation: { required: true, }, type: 'string' },
                    company: { validation: { required: false, }, type: 'string' }
                }
            }
        }
    },
    );

    $("#grid").kendoGrid({
        dataSource: dataSource,
        height: 475,
        filterable: true,
        resizable: true,
        pageable: { refresh: true, pageSizes: true, },
        toolbar: ['create','excel'],
        columns: [
            { field: "name", title: "Nombre", filterable: { multi: true, search: true, search: true } },
            { field: "company", title: "Empresa", filterable: { multi: true, search: true, search: true } },
            { command: ["edit", "destroy"], title: "Acciones"}],
        editable: "popup"
    });
});
function redirect(location) {
    window.location.href = location;
}
