var chatListViewService = {
    lock: false,
    request: function (data, options) {
        var self = this;
        if (self.lock) {
            self.trigger("error", "Request alreay running. Please wait");
            return;
        }
        self.lock = true;
        appcan.window.publish("E_XMPP_GETCHATLISTMSG", "");
        self.lock = false;
    }
};
_.extend(chatListViewService, Backbone.Events);

appcan.ready(function () {
    appcan.window.subscribe("E_XMPP_GETCHAT_RES", function (list) {
        chatListViewService.trigger("E_XMPP_GETCHAT_RES", list);
    });
});
