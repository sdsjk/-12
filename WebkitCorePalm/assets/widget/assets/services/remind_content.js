var STR_SERVER_MESSAGEERROR = tools.getString("STR_SERVER_MESSAGEERROR");
var STR_NETWORDERROR = tools.getString("STR_NETWORDERROR");

var remindViewService = {
    lock : false,
    request : function(option) {
        var self = this;
        if (self.lock) {
            self.trigger("error", "Request alreay running. Please wait");
            return;
        }
        self.lock = true;
        appcan.ajax({
            url : constant.APP_URL,
            headers : JSON.parse(get_header()),
            type : 'POST',
            data : JSON.stringify(option.params),
            contentType : "application/json",
            success : function(data) {
                self.lock = false;
                try {
                    data = JSON.parse(data);
                    if(mas_result_do(data)){
                        option.error(data);
                    } else if (data.status == "000") {
                        option.success(data);
                    } else {
                        option.error(data);
                    }
                } catch (e) {
                    option.error({status: -30000, msg: {message: STR_SERVER_MESSAGEERROR}});
                }
            },
            error : function(err) {
                self.lock = false;
                option.error({status: -30001, msg: {message: STR_NETWORDERROR}});
            }
        });
    }
};
_.extend(remindViewService, Backbone.Events);