var chatGroupAddViewService = {
    lock : false,
    request : function(data, options) {
        var self = this;
        if (self.lock) {
            self.trigger("error", "Request alreay running. Please wait");
            return;
        }
        self.lock = true; 
        var param = {
            description : data.params.data.groupName  
        }  
        var params=JSON.stringify(param);
        appcan.window.publishForJson("CREAT_GROUP_CHAT",params);
        
        self.lock = false;
    }
};
_.extend(chatGroupAddViewService, Backbone.Events);
