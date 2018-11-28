var pointRecondModel = Backbone.Model.extend({
    idAttribute : "objectId"
});

var pointRecondList = Backbone.Collection.extend({
    model : pointRecondModel,
    service : pointRecondService,
    parse : function(resp) {
        return resp.msg.list;
    },
    sync : function(method, model, options) {
        switch(method) {
        case "create":
            break;
        case "update":
            break;
        case "patch":
            break;
        case "read":
            pointRecondService.request(options);
            break;
        case "delete":
            break;
        default:
            break;
        }
    } 
})


