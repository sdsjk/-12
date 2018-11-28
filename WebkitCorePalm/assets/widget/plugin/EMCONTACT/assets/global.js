var tplBaseUrl = "";
var config = appcan.getLocVal("EPORTAL_CONFIG");
config = JSON.parse(config);
var masUrl = config.mas_emm;
function loadTemplate(tpl) {
    var template = null;
    $.ajax({
        url : tplBaseUrl + tpl,
        type : 'GET',
        data : {}, //默认从参数获取
        timeout : 10000,
        async : false,
        success : function(data) {
            template = _.template(data);
        },
        error : function(e) {
        }
    });
    return template;
}

var constant = {
    IMG_URL : "",
    APP_URL : masUrl + "emoa/app",
    LOGIN_URL : masUrl + "emoa/appLogin",
    APP_ID : config.appId
}
var storeKey = {
    PERSON_INFO:"perInfo",
    PERSON_INFO_ICON:"userIconUrlIndex",
    PERSON_ID:"yghao",
    PERSON_NAME:"ygname",
    CONTACT_NAME:"contactsName",
    CONTACT_ICON:"conImg",
    DPT_NAME:"bmName",
    SUPERDPT_ID:"superDptId"
}
var toolsReg = {
    TEL_REG : /^1[3|4|5|7|8][0-9]\d{4,8}$/,//手机
    EMAIL_REG :  /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/,
    PHONE_REG : /^([0-9]{3,4}-)?[0-9]{7,8}$/,//座机
}
function ALERT_ERROR(mod, fun, msg) {
}

function global_error(error) {
    appcan.window.openToast(error.msg.message, 1500, 5);
}
function getHeader() {
    return JSON.stringify({
        "x-mas-app-id" : constant.APP_ID
    });

}
