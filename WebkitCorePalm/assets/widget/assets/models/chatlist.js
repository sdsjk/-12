var chatModel = Backbone.Model.extend({
    idAttribute : "imId"
})

var chatCollection = Backbone.Collection.extend({
    initialize : function() {
        this.listenTo(chatListViewService, "E_XMPP_GETCHAT_RES", function(list) {
            if (this.options) {
                this.options.success(list.dataList);
            }
        })
    },
    comparator :"timestamp", 
    model : chatModel,
    service : chatListViewService, //服务，负责处理数据交互
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
            chatListViewService.request({}, options);
            break;
        case "delete":
            break;
        default:
            break;
        }
    }
})
