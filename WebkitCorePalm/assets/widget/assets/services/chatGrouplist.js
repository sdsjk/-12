var chatGroupListViewService = {
    lock : false,
    request : function(data, options) {
        var self = this;
        if (self.lock) {
            self.trigger("error", "Request alreay running. Please wait");
            return;
        }
        self.lock = true; 
        appcan.window.publish("CHAT_GROUP_LIST", options.params);
        self.lock = false;
    }
};
_.extend(chatGroupListViewService, Backbone.Events);

appcan.ready(function() {
    appcan.window.subscribe("CB_GET_GROUPLIST", function(result) {
        chatGroupListViewService.trigger("CB_GET_GROUPLIST", result);
    })

})
