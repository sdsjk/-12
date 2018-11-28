var STR_SERVER_MESSAGEERROR = tools.getString("STR_SERVER_MESSAGEERROR");
var STR_NETWORDERROR = tools.getString("STR_NETWORDERROR");


var contactsService = {
    lock : false,
    request : function(option) {
        var self = this;
        if (self.lock) {
            return;
        }
        self.lock = true;
        
        perAllBydpt(option.dptId,function(err,data){
            self.lock = false;
            if(!err){
                try {
                    if (data.status == "000") {
                        option.success(data);//成功
                    } else {
                        option.error(data);
                    }
                } catch(e) {
                    option.error({status: -30000, msg: {message: STR_SERVER_MESSAGEERROR}});
                }
            }else{
                self.lock = false;
                option.error({status: -30001, msg: {message: STR_NETWORDERROR}});
            }
        })
    },
    requestSearch : function(option) {
        var self = this;
        if (self.lock) {
            return;
        }
        self.lock = true;
        
        selAllPerByEmm(option.fullName,function(err,data){
            self.lock = false;
            if(!err){
                try {
                    if (data.status == "000") {
                        option.success(data);//成功
                    } else {
                        option.error(data);
                    }
                } catch(e) {
                    option.error({status: -30000, msg: {message: STR_SERVER_MESSAGEERROR}});
                }
            }else{
                self.lock = false;
                option.error({status: -30001, msg: {message: STR_NETWORDERROR}});
            }
        })
    },
    requestDptAndPer : function(option) {
        var self = this;
        dptAndPer(option.dptId,function(err,data){
            if(!err){
                try {
                    if (data.status == "000") {
                        option.success(data);//成功
                    } else {
                        option.error(data);
                    }
                } catch (e) {
                    option.error({status: -30000, msg: {message: STR_SERVER_MESSAGEERROR}});
                };
            } else {
                option.error({status: -30001, msg: {message: STR_NETWORDERROR}});
            }
        },option.flag)
    }
};
_.extend(contactsService, Backbone.Events);