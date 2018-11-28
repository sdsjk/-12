var STR_SERVER_MESSAGEERROR = tools.getString("STR_SERVER_MESSAGEERROR");
var STR_NETWORDERROR = tools.getString("STR_NETWORDERROR");

var contactViewService = {
    lock : false,
    request : function(option) {
        var self = this;
        if (self.lock) {
            return;
        }
        self.lock = true;
        // 进入页面首次加载及下拉刷新时调用
        perAllBydpt(option.dptId,function(err,data){
            self.lock = false;
            if(!err){
                try {
                    if (data.status == "000") {
                        option.success(data);//成功
                    } else {
                        option.error(data);
                    }
                    // 记录通讯录界面数据处理开始时间
                    uexSensorsAnalytics.trackTimerBegin(JSON.stringify(paramTrackTimerStart));
                } catch (e) {
                    option.error({status: -30000, msg: {message: STR_SERVER_MESSAGEERROR}});
                }
            }else{
                self.lock = false;
                option.error({status: -30001, msg: {message: STR_NETWORDERROR}});
            }
        },option.flag)
    },
    requestSearch : function(option) {
        var self = this;
        if (self.lock) {
            return;
        }
        self.lock = true;
        // 通讯录搜索时调用
        selAllPerByEmm(option.fullName,option.pageNo,function(err,data){
            self.lock = false;
            if(!err){
                try {
                    if (data.status == "000") {
                        option.success(data);//成功
                    } else {
                        option.error(data);
                    }
                } catch (e) {
                    option.error({status: -30000, msg: {message: STR_SERVER_MESSAGEERROR}});
                }
            }else{
                self.lock = false;
                option.error({status: -30001, msg: {message: STR_NETWORDERROR}});
            }
        })
    }
};
_.extend(contactViewService, Backbone.Events);