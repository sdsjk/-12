var remindModel = Backbone.Model.extend({
    idAttribute: "objectId",
    service: requestService,
    parse: function (model) {
        var obj = {};
        return model;
    },
    sync: function (method, model, options) {
        switch (method) {
            case "create":
            case "update":
            case "patch":
                break;
            case "read":
                this.service.request(options);
                break;
            case "delete":
                break;
            default:
                break;
        }
    }
});

var remindCollection = Backbone.Collection.extend({
    model: remindModel, //集合对应模型
    service: requestService, //服务，负责处理数据交互
    parse: function (resp) {
        if (resp.msg.loginUser)
            appcan.setLocVal("OA_USER_INFO", JSON.stringify({
                loginUser: resp.msg.loginUser,
                crminfo: resp.msg.crminfo
            }));
        return resp.msg.list;
    },
    sync: function (method, model, options) {
        switch (method) {
            case "create":
            case "update":
            case "patch":
                break;
            case "read":
                this.service.request(options);
                break;
            case "delete":
                break;
            default:
                break;
        }
    }
});