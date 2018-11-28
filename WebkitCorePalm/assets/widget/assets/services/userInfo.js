var STR_SERVER_MESSAGEERROR = tools.getString("STR_SERVER_MESSAGEERROR");
var STR_NETWORDERROR = tools.getString("STR_NETWORDERROR");

var userInfoService = {
    request : function(data, options) {
        // 记录接口开始请求时间
        uexSensorsAnalytics.trackTimerBegin(JSON.stringify(paramTrackTimerStart));
        // 接口请求结束时间参数
        var paramTrackTimerEnd = FunParamTrackTimerEnd("接口请求","通讯录","getByUniqueField");
        try{
            personInfoEmm(options.staffId,function(err,data,a,b,c){
                if(err){
                     options.error(data);
                }else{
                      options.success(data);
                }
                // 接口请求结束
                uexSensorsAnalytics.trackTimerEnd(JSON.stringify(paramTrackTimerEnd));
            })
        }catch(e){
            ALERT_ERROR("userInfoService","",e.message+'--'+e.stack);
            // 接口请求结束
            uexSensorsAnalytics.trackTimerEnd(JSON.stringify(paramTrackTimerEnd));
        }
    },
    lock:false,
    requestSubmit : function(data, options) {
        var self = this;
        if (self.lock) {
            return;
        }
        self.lock = true;
        // 记录接口请求开始时间
        uexSensorsAnalytics.trackTimerBegin(JSON.stringify(paramTrackTimerStart));
        // 接口请求结束时间参数
        var paramTrackTimerEnd = FunParamTrackTimerEnd("接口请求","通讯录","updatePersonnelById");
        editPerInfoEmm(data.userId,data,function(err,data){
            self.lock = false;
            if(!err){
                try {
                    if (data.status == "000") {
                        options.success(data);//成功
                    } else {
                        options.error(data);
                    }
                } catch (e) {
                    options.error({status: -30000, msg: {message: STR_SERVER_MESSAGEERROR}});
                }
                // 接口请求结束
                uexSensorsAnalytics.trackTimerEnd(JSON.stringify(paramTrackTimerEnd));
            } else {
                self.lock = false;
                options.error({status: -30001, msg: {message: STR_NETWORDERROR}});
                // 接口请求结束
                uexSensorsAnalytics.trackTimerEnd(JSON.stringify(paramTrackTimerEnd));
            }
        })
            
    }
};
_.extend(userInfoService, Backbone.Events);

