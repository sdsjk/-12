var msgModel = Backbone.Model.extend({
     idAttribute : "header"
})

var msgCollection = Backbone.Collection.extend({
    initialize : function() {
    },
    model : msgModel,
    service : msgListViewService, //服务，负责处理数据交互
    parse : function(resp) {
        var msg = resp;
        if(msg.msg.loginUser)
        appcan.setLocVal("OA_USER_INFO", JSON.stringify({loginUser:msg.msg.loginUser,crminfo:msg.msg.crminfo}));
        return resp.msg.message;
    },
    sync : function(method, model, options) {
        this.options = options;
        switch(method) {
        case "create":
        case "update":
        case "patch":
            break;
        case "read":
            msgListViewService.request(options);
            break;
        case "delete":
            break;
        default:
            break;
        }
    }
})
