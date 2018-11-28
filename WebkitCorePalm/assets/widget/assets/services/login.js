var STR_SERVER_MESSAGEERROR = tools.getString("STR_SERVER_MESSAGEERROR");
var STR_NETWORDERROR = tools.getString("STR_NETWORDERROR");
var STR_ACCESS_TO_INFOR = tools.getString("STR_ACCESS_TO_INFOR");

var loginService = {
    lock: false,
    loginData: {},
    request: function (data, option) {
        var self = this;
        if (self.lock) {
            return false;
        }
        self.loginData = data;
        //密码aes加密
        var key = CryptoJS.enc.Utf8.parse("www.myappcan.com");
        var orgPwd = self.loginData.loginPass;
        orgPwd = CryptoJS.enc.Utf8.parse(orgPwd);
        orgPwd = CryptoJS.AES.encrypt(orgPwd,key, {  
            mode: CryptoJS.mode.ECB,  
            padding: CryptoJS.pad.Pkcs7  
        });
        orgPwd = orgPwd.ciphertext.toString();        
        self.loginData.loginPass = Trims(hex_md5(self.loginData.loginPass));
        self.loginData.loginName = Trims(self.loginData.loginName.toUpperCase());
        self.lock = true;
        if(self.loginData.loginUser) delete self.loginData.loginUser;
        
        uexEMM.cbLogin = function (a, b, js) {
            var js = js.replace(/\r\n/g,'<br>').replace(/https:/g,'http:');
            appcan.window.closeToast();
            try {
                 
                var obj = JSON.parse(js);
              
                if (obj.status == 'ok') {//登录成功
                    try {
                        appcan.setLocVal("emmToken", JSON.stringify(obj));
                        localStorage.setItem("emmToken", JSON.stringify(obj));
                        appcan.setLocVal("emmAccessToken", obj.info.accessToken);
                        localStorage.setItem("emmAccessToken", obj.info.accessToken);
                        uexXmlHttpMgr.clearCookie(); //清除cookie，解决ios上重新登录mas的sid不更新问题
                        uexEMM.cbGetSoftToken = function(id, type, data) {
                            if (data) {
                               appcan.setLocVal("emmSoftToken",data);//标志是否登录
                              
                            } else {
                               
                            }
                        }
                        uexEMM.getSoftToken();
                        var ts = new Date().getTime();
                        appcan.setLocVal("EPortal-EMM-LOGIN-TIME",ts);
                        
                        getEpotalConfig();
                        try {
                            appcan.setLocVal("loginName", self.loginData.loginName);
                            if ($(".check1").hasClass("uhide")) {
                                appcan.setLocVal("loginPass", self.loginData.loginPass);
                            } else {
                                appcan.setLocVal("loginPass", '');
                            }
                            var userId = obj.info.uniqueField;
                            //使用神策设置用户登录ID
                            var param = {
                                 user: userId
                            };
                            uexSensorsAnalytics.login(JSON.stringify(param));                         
                            //  使用神策设置公共事件属性
                            var publicEventParam = {
                                propertieDict:{
                                    userId:userId, // 用户工号
                                    username:obj.info.username, // 用户姓名
                                    sex:obj.info.userSex,  // 用户性别
                                    orgId:obj.info.orgId[0],  // 科室ID
                                    orgName:obj.info.orgName[0] // 科室名称
                                }
                            };
                            uexSensorsAnalytics.profileSet(JSON.stringify(publicEventParam));

                            //缓存用户工号
                            appcan.setLocVal("userId", userId);
                            localStorage.setItem("userId",userId);
                            appcan.setLocVal("emm_orgPwd", orgPwd);
                            var zzFullOrgIds=obj.info.zzFullOrgIds;
                            //缓存用户信息提供子应用使用
                            var provideSubApplication = {
                                userId: obj.info.uniqueField,
                                userName: obj.info.username,
                                persenelId:obj.info.userId,
                                orgId: obj.info.orgId[0],
                                orgName: obj.info.orgName[0],
                                zzOrgId:obj.info.zzOrgId, //主职部门ID
                                jzOrgIds:obj.info.jzOrgIds, //兼职部门ID
                                //组织部门名称
                                zzFullOrgNames:obj.info.zzFullOrgNames,
                                //组织部门Id
                                zzFullOrgIds:obj.info.zzFullOrgIds,
                                mobileNo: obj.info.mobileNo,
                                email: obj.info.email,
                                position: obj.info.field5,
                                userSex:obj.info.userSex, // 性别
                                domianName:obj.info.domainName // 深航认证
                            };
                            appcan.setLocVal("EPortal-UserInfo",provideSubApplication);
                            localStorage.setItem("EPortal-UserInfo",JSON.stringify(provideSubApplication));
                            //缓存组织部门ID
                           appcan.setLocVal("departmentId",zzFullOrgIds); 
                           localStorage.setItem("departmentId",zzFullOrgIds);
                            // 听云相关  userId

                            var jsonObj = {userId:userId}; 
                            uexNBSAppAgent.setOptions(JSON.stringify(jsonObj));

                            appcan.window.openToast(STR_ACCESS_TO_INFOR);//获取信息中
                            loginPerInfoEmm(userId, function (err, data) {
                                self.lock = false;
                                if (!err) {
                                    option.success(data);
                                    //成功
                                } else {
                                    option.error({
                                        status: -30001,
                                        msg: {
                                            message: STR_NETWORDERROR
                                        }
                                    });
                                }
                                return false;
                            })
                        } catch (e) {
                            self.lock = false;
                            option.error({
                                status: -30001,
                                msg: {
                                    message: STR_NETWORDERROR
                                }
                            });
                            return false;
                        }

                    } catch (e) {
                        self.lock = false;
                        option.error({
                            status: -30000,
                            msg: {
                                message: STR_SERVER_MESSAGEERROR
                            }
                        });
                        return false;
                    }
                } else {
                    self.lock = false;
                    option.error({
                        status: obj.status,
                        msg: {
                            message: obj.info
                        }
                    });
                    return false;
                }
            } catch (e) {
                self.lock = false;
                option.error({
                    status: -30000,
                    msg: {
                        message: STR_SERVER_MESSAGEERROR
                    }
                });
                return false;
            }
        };
        uexEMM.login(JSON.stringify(self.loginData));
    }
};
_.extend(loginService, Backbone.Events);

