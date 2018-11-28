var STR_SERVER_MESSAGEERROR = tools.getString("STR_SERVER_MESSAGEERROR");
var STR_NETWORDERROR = tools.getString("STR_NETWORDERROR");

var myEntService = {
    request: function (option) {
        appcan.request.ajax({
            url: option.url,
            headers: JSON.parse(get_header()),
            data: {},
            type: "POST",
            timeout: "30000",
            contentType: "application/json",
            success: function (data) {
                try {
                   
                    data = JSON.parse(data);
                    option.success(data);
                } catch (e) {
                    option.error({status: -30000, msg: {message: STR_SERVER_MESSAGEERROR}});
                }
            },
            error: function (error) {
                option.error({status: -30001, msg: {message: STR_NETWORDERROR}});
            }
        })
    }
};
_.extend(myEntService, Backbone.Events);
