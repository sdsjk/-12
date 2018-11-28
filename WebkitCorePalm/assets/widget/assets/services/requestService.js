var STR_SERVER_MESSAGEERROR = tools.getString("STR_SERVER_MESSAGEERROR");
var STR_NETWORDERROR = tools.getString("STR_NETWORDERROR");

var requestService = {
    lock : false,
    request : function(options) {
        var self = this;
        if (self.lock) {
            self.trigger("error", "Request alreay running. Please wait");
            return;
        }
        var _url = options.params.url || url;
        self.lock = true;
        appcan.request.ajax({
            url : _url,
            headers : JSON.parse(get_header()),
            data : JSON.stringify(options.params.data),
            type : "POST",
            timeout : "30000",
            contentType : "application/json",
            dataType:"json",
            success : function(data) {
                self.lock = false;
                try {
                    if(typeof data === 'string'){
                        data = JSON.parse(data);
                    }
                    
                    if(mas_result_do(data)){
                        options.error(data);
                    } else if (data.status == "000") {
                        options.success(data);
                    } else {
                        options.error(data);
                    }
                } catch(e) {
                    options.error({status: -30000, msg: {message: STR_SERVER_MESSAGEERROR}});
                }
            },
            error : function(XMLHttpRequest, textStatus, errorThrown) {
                self.lock = false;
                options.error({status: -30001, msg: {message: STR_NETWORDERROR}});
            }
        });

    },readRequest:function(param,type){
        var self = this;
        if (isDefine(type)&&type =="24") {
            var _url = workFlowUrl;
        } else{
            var _url = url;
        };
        
         appcan.request.ajax({
            url : _url,
            headers : JSON.parse(get_header()),
            data : JSON.stringify(param.param),
            type : "POST",
            timeout : "30000",
            contentType : "application/json",
            dataType:"json",
            success : function(data) {
                if(typeof data === 'string'){
                    data = JSON.parse(data);
                }
                if (data.status == "000") {
                    if(param.param.content.id||param.param.content.objectId){
                        data.objectId = param.param.content.id||param.param.content.objectId;
                    }
                    self.trigger("fresh", data);
                }
            },
            error:function(err){
            }
            })
    }
};

var multiRequestService = {
    request : function(options) {
        var self = this;
        var _url = options.params.url || url;
        $.ajax({
            url : _url,
            headers : JSON.parse(get_header()),
            data : JSON.stringify(options.params.data),
            type : "POST",
            timeout : "30000",
            contentType : "application/json",
            success : function(data) {
                try {
                    if(typeof data === 'string'){
                        data = JSON.parse(data);
                    }
                    if(mas_result_do(data)){
                        options.error(data);
                    } else if (data.status == "000") {
                        options.success(data);
                    } else {
                        options.error(data);
                    }
                } catch(e) {
                    options.error({status: -30000, msg: {message: STR_SERVER_MESSAGEERROR}});
                }
            },
            error : function(err) {
                options.error({status: -30001, msg: {message: STR_NETWORDERROR}});
            }
        });

    }
};

_.extend(requestService, Backbone.Events);

