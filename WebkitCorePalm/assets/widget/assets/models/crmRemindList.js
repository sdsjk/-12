var remindModel = Backbone.Model.extend({
    service: requestService,
    parse: function (model) {
        return model;
    },
    sync: function (method, model, options) {
        switch (method) {
            case "create":
                break;
            case "update":
                this.service.request(options);
                break;
            case "patch":
            case "read":
            case "delete":
            default:
                break;
        }
    }
});

var remindCollection = Backbone.Collection.extend({
    model: remindModel, //集合对应模型
    service: requestService, //服务，负责处理数据交互
    parse: function (resp) {
        return resp.msg.list;
    },
    sync: function (method, model, options) {
        switch (method) {
            case "create":
            case "update":
                this.service.request(options);
                break;
            case "patch":
                break;
            case "read":
                this.service.request(options);
                break;
            case "delete":
            default:
                break;
        }
    }
})