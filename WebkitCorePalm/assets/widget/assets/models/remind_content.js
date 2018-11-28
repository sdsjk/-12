var remindModel = Backbone.Model.extend({
    idAttribute : "objectId"
})

var remindCollection = Backbone.Collection.extend({
    model : remindModel, 
    parse : function(resp) {
        return resp.msg.list;
    },
    sync : function(method, model, options) {
        this.options = options;
        switch(method) {
        case "create":
        case "update":
        case "patch":
            break;
        case "read":
            remindViewService.request(options);
            break;
        case "delete":
            break;
        default:
            break;
        }
    }
})
   