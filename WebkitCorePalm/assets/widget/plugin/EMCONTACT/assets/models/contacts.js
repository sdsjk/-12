var perModel = Backbone.Model.extend({
    idAttribute: "userId"
})
var dptModel = Backbone.Model.extend({
    idAttribute: "entityId"
})
var perCollection = Backbone.Collection.extend({
    model: perModel,
    parse: function (resp) {
        return resp.msg;
    },
    sync: function (method, model, options) {
        this.options = options;
        switch (method) {
            case "create":
            case "update":
            case "patch":
                break;
            case "read":
                if (options.dptId)
                    contactsService.request(options);
                else
                    contactsService.requestSearch(options);
                break;
            case "delete":
                break;
            default:
                break;
        }
    }
})

var dptCollection = Backbone.Collection.extend({
    model: dptModel,
    parse: function (resp) {
        return resp.msg;
    },
    sync: function (method, model, options) {
        this.options = options;
        switch (method) {
            case "create":
            case "update":
            case "patch":
                break;
            case "read":
                if (options.dptId)
                    contactsService.request(options);
                else
                    contactsService.requestSearch(options);
                break;
            case "delete":
                break;
            default:
                break;
        }
    }
}) 