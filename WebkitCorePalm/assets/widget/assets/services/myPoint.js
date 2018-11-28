var STR_SERVER_MESSAGEERROR = tools.getString("STR_SERVER_MESSAGEERROR");
var STR_NETWORDERROR = tools.getString("STR_NETWORDERROR");

var myPointService = {
    request : function(option){
        
        var dataObj = JSON.stringify(option.param);
        appcan.request.ajax({
            url : constant.APP_URL,
            headers : JSON.parse(get_header()),
            data : dataObj,
            type : "POST",
            timeout : "30000",
            contentType : "application/json",
            success : function(data){
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
            error: function (err) {
                option.error({status: -30001, msg: {message: STR_NETWORDERROR}});
            }
        })
    }
}

_.extend(myPointService, Backbone.Events);
