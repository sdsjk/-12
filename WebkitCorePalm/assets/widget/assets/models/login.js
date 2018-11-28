var STR_ACCOUNT_EMPTY = tools.getString("STR_ACCOUNT_EMPTY");
var STR_PASSWORD_EMPTY = tools.getString("STR_PASSWORD_EMPTY");
var STR_COMPANY_EMPTY = tools.getString("STR_COMPANY_EMPTY");

var loginModel = Backbone.Model.extend({
    initialize: function () {
        var upwd = appcan.getLocVal("loginPass");
        var uname = appcan.getLocVal("loginName");
        var initData = {"domainName": domainName};
        if (uname) {
            initData.loginName = uname;
            if (isDefine(upwd)) {
                if(upwd.length===32) upwd=appcan.getLocVal("emm_orgPwd");
                initData.loginPass = upwd;
                $(".check2").removeClass("uhide");
                $(".check1").addClass("uhide");
            } else {
                initData.loginPass = '';
                $(".check1").removeClass("uhide");
                $(".check2").addClass("uhide");
            }
        }
        this.set(initData);
    },
    service: loginService,
    parse: function (resp) {
        return resp;
    },
    validate: function (attrs, options) {
        if (!attrs.loginName) {
            return STR_ACCOUNT_EMPTY; // 账号不能为空
        }
        if (!attrs.loginPass) {
            return STR_PASSWORD_EMPTY; // 密码不能为空
        }
    },
    sync: function (method, model, options) {
        switch (method) {
            case "create":
            case "update":
            case "patch":
                loginService.request(this.toJSON(), options);
                break;
            case "read":
                break;
            case "delete":
                break;
            default:
                break;
        }
    }
});

var tentantModel = Backbone.Model.extend({
    initialize: function () {
        try {
            //这里4.0线下会报错，storeKeys的值是undefine
            var tentant = appcan.getLocVal(storeKeys.TENTANTCOUNT);
        } catch (e) {
        }
        if (isDefine(tentant)) {
            this.set({tenantAccount: tentant});
        }
    },
    parse: function (resp) {
        return resp;
    },
    validate: function (attrs, options) {
        if (!attrs.tenantAccount) {
            return STR_COMPANY_EMPTY;
        }

    }
})