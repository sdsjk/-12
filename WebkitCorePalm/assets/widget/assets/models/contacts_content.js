var contactModel = Backbone.Model.extend({
    idAttribute : "userId"
})

var contactCollection = Backbone.Collection.extend({
    model:contactModel,
    parse : function(resp) {
        return resp.msg;
    },
    sync : function(method, model, options) {
        this.options = options;
        switch(method) {
        case "create":
        case "update":
        case "patch":
            break;
        case "read":
            if(options.dptId)
                contactViewService.request(options);
            else
                contactViewService.requestSearch(options);
            break;
        case "delete":
            break;
        default:
            break;
        }
    }
})
   