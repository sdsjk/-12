var STR_SERVER_MESSAGEERROR = tools.getString("STR_SERVER_MESSAGEERROR");
var STR_NETWORDERROR = tools.getString("STR_NETWORDERROR");

var msgListViewService = {
    request: function (option) {
        var dataObj = JSON.stringify(option.param);
        var headers = JSON.parse(get_header());
        var emmToken = JSON.parse(appcan.getLocVal("emmToken"));
        headers["x-mas-app-info"] = (appId + "/" + emmToken.info.accessToken);
        appcan.request.ajax({
            url: option.url,
            headers: headers,
            data: dataObj,
            type: "POST",
            timeout: "30000",
            contentType: "application/json",
            success: function (data) {
               
                try {
                    data = JSON.parse(data);
                    if (mas_result_do(data)) {
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
};

_.extend(msgListViewService, Backbone.Events);