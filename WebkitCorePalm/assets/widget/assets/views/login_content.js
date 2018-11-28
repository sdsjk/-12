var loginView = Backbone.View.extend({//options...
    initialize: function () {
        this.stickit();
        var self = this;
        appcan.button("#btn", "btn-act", function () {
            self.$el.submit();
        });
        appcan.button(".pswCheck", "btn-act", function () {
            var isTure = $(".check2").hasClass("uhide");
            if (isTure) {
                $(".check2").removeClass("uhide");
                $(".check1").addClass("uhide");
            } else {
                $(".check1").removeClass("uhide");
                $(".check2").addClass("uhide");
            }
        });
        if (isEMM3) {
            $("#emmaddress").removeClass("uhide");
        }
        $("#change").removeClass("uhide");
    },
    model: new loginModel(),
    el: '#login',
    events: {
        'submit': 'submitLogin',
    },
    bindings: {
        "#username": {
            observe: 'loginName',
            updateModel: 'validUname'
        },
        "#password": "loginPass",
        "#domainName": {
            observe: "domainName",
        }
    },
    validUname: function (val, event, options) {
        return true;
    },
    lock: false,
    submitLogin: function () {  // 点击login_content界面登录时调用逻辑
        if (!this.model.isValid()) {
            appcan.window.openToast(this.model.validationError, 1500, 5); // 账号、密码不能为空
            return false;
        };

        var self = this;
        if (self.lock) {
            return false;
        };
        // 记录登录开始时间逻辑(无session)
        uexSensorsAnalytics.trackTimerBegin(JSON.stringify(paramTrackTimerStart));
        self.lock = true;
        $("#username")[0].blur();
        $("#password")[0].blur();
        var STR_LOGINING = tools.getString("STR_LOGINING");  // 登录中，请稍候
        appcan.window.openToast(STR_LOGINING);
        this.model.save({}, {
            success: function (model, resp, options) {
                self.lock = false;
                if (saasUrl) {
                    try{
                        var tenant = (appcan.getLocVal(storeKeys.TENTANTCOUNT)).toLowerCase();
                        setConfig({mas_emm: saasUrl + tenant + "/mobileoa/"});
                    }catch(e){
                       
                    }
                    
                }
               
                appcan.setLocVal("EMM_USER_INFO", resp);
                localStorage.setItem("EMM_USER_INFO", JSON.stringify(resp));
                if(isAndroid) appcan.window.open("index", "index.html", 10, '');
                
                //xmas oa登录
                xmasOALogin(function(ret){
                    var rObj = JSON.parse(ret);
                    if(rObj.result=='yes' && rObj.sessionid){
                        
                    }
                    
                    var flag = isAndroid?64:'';
		    		flag = '';
                    if(!isAndroid) appcan.window.open("index", "index.html", 10, flag);
                    appcan.window.closeToast();
                });
                // 神策记录登录成功逻辑时间(无session)
                var loginParamTrackTimerEnd = FunParamTrackTimerEnd("登录","登录","");
                uexSensorsAnalytics.trackTimerEnd(JSON.stringify(loginParamTrackTimerEnd));
            },
            error: function (model, error, options) {
                // 登录失败
                self.lock = false;
                appcan.window.closeToast();
                switch (error.status) {
                    default:
                        global_error(error);
                        break;
                }
                // 神策记录登录失败逻辑时间(无session)
                var loginParamTrackTimerEnd = FunParamTrackTimerEnd("登录","登录","");
                uexSensorsAnalytics.trackTimerEnd(JSON.stringify(loginParamTrackTimerEnd));
            }
        });
        return false;
    }
});

var tentantView = Backbone.View.extend({//options...
    initialize: function () {
        this.stickit();
        var self = this;
        appcan.button("#next", "btn-act", function () {
            self.$el.submit();
        })

    },

    model: new tentantModel(),
    el: '#tenantForm',
    events: {
        'submit': 'submitLogin',
    },
    bindings: {
        "#tenant": "tenantAccount"
    },
    validUname: function (val, event, options) {
        return true;
    },
    lock: false,
    submitLogin: function () {
        try {
            if (!this.model.isValid()) {
                appcan.window.openToast(this.model.validationError, 1500, 5);
                return false;
            }
            var self = this;
            if (self.lock) {
                return false;
            }
            self.lock = true;
            $("#tenant")[0].blur();
            $("#address")[0].blur();
            var STR_SUBMITING = tools.getString("STR_SUBMITING");
            appcan.window.openToast(STR_SUBMITING);
            var address = $.trim($("#address").val());
            if (address) {
                uexEMM.setEMMHost(JSON.stringify({"EMMHost": address}));
                resetConfigByReportUrl(address);
            }
            appcan.setLocVal(storeKeys.TENTANTCOUNT, this.model.get("tenantAccount"));
            uexEMM.widgetStartReport(JSON.stringify(this.model.toJSON()));
            return false;
        } catch (e) {
            errorDetail(e);
        }
    },
    initEmmApp: function () {
        try {
            var self = this;
            uexEMM.cbGetTenantAccount = function (opId, dataType, data) {
                if (data && data.indexOf("null") < 0) {
                    tenant = data;
                    appcan.setLocVal(storeKeys.TENTANTCOUNT, data);
                    $("#loginform").removeClass("uhide")
                    $("#tenantform").addClass("uhide")
                    $("#tenant").val(tenant);
                    self.model.set({"tenantAccount": tenant}, {silent: true})
                } else {
                    $("#loginform").addClass("uhide");
                    $("#tenantform").removeClass("uhide")
                }
            }
            uexEMM.getTenantAccount();

        } catch (e) {
        }
    },
    getProperty: function () {
        $("#tenantform").addClass("uhide");
        $("#loginform").removeClass("uhide");
        domainName = '深航认证'; //选取认证域
        setConfig({domainName: domainName});
        loginViewInstance.model.set("domainName", domainName);
        return;
                
        uexEMM.cbGetLoginProperty = function (opId, dataType, data) {
            var data = JSON.parse(data);
            if (data.status == "ok") {
                $("#tenantform").addClass("uhide");
                $("#loginform").removeClass("uhide");
                domainName = data.info.domains[0].domainName; //选取认证域
                setConfig({domainName: domainName});
                loginViewInstance.model.set("domainName", domainName);
            } else {
                appcan.window.openToast(data.info, 1500, 5);
            }
        }
        uexEMM.getLoginProperty();
    }
});
var loginViewInstance = new loginView();
var tentantViewInstance = new tentantView();
appcan.ready(function () {

    tentantViewInstance.initEmmApp();
    appcan.window.evaluateScript("root", "initEMM()");
    appcan.window.subscribe("indexClose", function (a) {
        loginViewInstance.model.set("loginPass", "");
    });
    document.documentElement.style.webkitTouchCallout = 'none';
    //监听返回键
    uexWindow.onKeyPressed = function (keyCode) {
        if (keyCode == '0') {
            uexWidget.finishWidget('');
        }
    };
    uexWindow.setReportKey('0', '1');
    appcan.window.subscribe("EMM_REPORT_COMPLETE", function (d) {
        appcan.window.closeToast();
        var data = JSON.parse(d);
        tentantViewInstance.lock = false;
        if ((data.status == 'ok')) {
            tentantViewInstance.getProperty();
        } else {
            if ($("#tenantform").hasClass("uhide")) {
                $("#loginform").removeClass("uhide")
            }
            var info1 = data.info && (data.info.errorInfo ? data.info.errorInfo : data.info);
            if (info1)
                appcan.window.openToast(info1, 1500, 5);
        }

    });
    appcan.button("#change", "btn-act", function () {
        $("#tenantform").removeClass("uhide");
        $("#loginform").addClass("uhide");

    })
});
function EMMAddress(emmUrl) {
    $("#address").val(emmUrl);
}
