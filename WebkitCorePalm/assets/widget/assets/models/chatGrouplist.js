var chatGroupModel = Backbone.Model.extend({
    idAttribute : "groupid"
})

var chatGroupCollection = Backbone.Collection.extend({
    initialize : function() {
        this.listenTo(chatGroupListViewService, "CB_GET_GROUPLIST", function(result) {
            if (this.options) {
                this.options.success(result.msg.grouplist);
            }
        })
    },
    model : chatGroupModel,
    service : chatGroupListViewService, //服务，负责处理数据交互
    parse : function(resp) {
        return resp;
    },
    sync : function(method, model, options) {
        this.options = options;
        switch(method) {
        case "create":
        case "update":
        case "patch":
            break;
        case "read":
            chatGroupListViewService.request({}, options);
            break;
        case "delete":
            break;
        default:
            break;
        }
    }
})
