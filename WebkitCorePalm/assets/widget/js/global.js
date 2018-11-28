var tplBaseUrl = "";
var eportalConfig,masUrl,constant,tenant;
appcan.ready(function(){
    eportalConfig = appcan.getLocVal("EPORTAL_CONFIG");    
eportalConfig = JSON.parse(eportalConfig);
if (eportalConfig != null) {
    var masUrl = eportalConfig.mas_emm;
    };
    constant = {
        IMG_URL: "",
        APP_URL: masUrl + "emoa/app",
        LOGIN_URL: masUrl + "emoa/appLogin",
        MSG_URL: masUrl + "emoa/message",
        CRM_URL: masUrl + "emoa/appCrm",
        CRM_APP_ID: "MOBILEOA",
        APP_ID: appId,
    };
    constant.APP_URL = masUrl + "emoa/app";
    constant.LOGIN_URL = masUrl + "emoa/appLogin";
    constant.MSG_URL = masUrl + "emoa/message";
    constant.CRM_URL = masUrl + "emoa/appCrm";   
    tenant = appcan.getLocVal(storeKey.TENTANTCOUNT);    
});

function loadTemplate(tpl, cb) {
    var template = null;
    $.ajax({
        url: tplBaseUrl + tpl,
        type: 'GET',
        data: {}, //默认从参数获取
        timeout: 10000,
        async: false,
        success: function (data) {
            template = _.template(data);
            if (cb) cb(template);
        },
        error: function (e) {
            if (cb) cb(template);
        }
    });
    return template;
}
function getEpotalConfig() {
    eportalConfig = appcan.getLocVal("EPORTAL_CONFIG");
    try{
        eportalConfig = JSON.parse(eportalConfig);
        masUrl = eportalConfig.mas_emm;
    }catch(e){
    }
}
var storeKey = {
    PERSON_INFO: "perInfo",
    PERSON_INFO_ICON: "userIconUrlIndex",
    PERSON_ID: "yghao",
    PERSON_NAME: "ygname",
    CONTACT_NAME: "contactsName",
    CONTACT_ICON: "conImg",
    TENTANTCOUNT: "tentantCount",
};
var constant = {
    IMG_URL: "",
    APP_URL: masUrl + "emoa/app",
    LOGIN_URL: masUrl + "emoa/appLogin",
    MSG_URL: masUrl + "emoa/message",
    CRM_URL: masUrl + "emoa/appCrm",
    CRM_APP_ID: "MOBILEOA",
    APP_ID: appId,
};

var toolsReg = {
    TEL_REG: /^((13[0-9])|(15([0-3]|[5-9]))|(17[6-8])|(18[0,3-9]))\d{8}$/,//手机
    EMAIL_REG: /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/,
    PHONE_REG: /^\+?\d{3,4}[ ,-]?\d{7,12}$/,//座机
};
function ALERT_ERROR(mod, fun, msg) {
}

function global_error(error) {
    appcan.window.openToast(error.msg.message, 1500, 5);
}
function getHeader() {
    return JSON.stringify({
        "x-mas-app-id": constant.APP_ID
    });

}
/**
 *service的基础对象，供其他service调用
 */
var BaseService = {
    /**
     *获取请求锁
     * @param {Object} string
     */
    getLockKey: function (string) {
        if (string) {
            //有option对象，把它变成字符串
            string = encodeURI(string);
            var md5 = appcan.crypto.md5(string);
            return md5;
        }
    },
    emmCall: function (url, type, data, option) {

    },
    /**
     *简化普通请求
     * @param {Object} url
     * @param {Object} type
     * @param {Object} data
     * @param {Object} option
     */
    ajaxCall: function (url, type, data, option) {
        var self = this;
        var lockKey = self.getLockKey(JSON.stringify(data));
        if (self[lockKey]) {
            //如果锁定请求的话，不再提交
            self.trigger("error", "Request alreay running. Please wait");
            return;
        }
        //加请求锁
        self[lockKey] = true;
        //调试的话，建议用$.ajax，生产环境可以用appcan.ajax
        appcan.request.ajax({
            url: url,
            type: type,
            data: data,
            header: getHeader(),
            contentType: "application/json",
            success: function (data) {
                data = JSON.parse(data);
                self[lockKey] = false;
                if (data.status == '000') {
                    option.success(data);
                } else {
                    option.error(new Error(data.message));
                }
            },
            error: function (e, err) {
                self[lockKey] = false;
                option.error(new Error(err));
            }
        });
    }
};
_.extend(BaseService, Backbone.Events);

