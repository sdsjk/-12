function loginSilence(f) {
    // 记录登录开始逻辑(有session)
    uexSensorsAnalytics.trackTimerBegin(JSON.stringify(paramTrackTimerStart));
	var isEnabled = appcan.getLocVal("isEnabled");
    if(isEnabled==0){
        appcan.window.openToast(tools.getString("STR_DATA_GETTING"));//数据获取中
    }
    var obj = {
        "domainName": domainName,
        "loginName": appcan.getLocVal("loginName"),
        "loginPass": appcan.getLocVal("loginPass")
    };
    var ss = JSON.stringify(obj);
    
    appcan.setLocVal("EPortal-EMM-LOGIN-TIME",'');

    uexEMM.cbLogin = function (a, b, js) {
        var js = js.replace(/\r\n/g,'<br>').replace(/https:/g,'http:');
       
        var obj = JSON.parse(js);
        if (obj) {
            if (obj.status == 'ok') {//登录成功
                appcan.setLocVal("emmToken", JSON.stringify(obj));
                localStorage.setItem("emmToken", JSON.stringify(obj));
                appcan.setLocVal("emmAccessToken", obj.info.accessToken);
                localStorage.setItem("emmAccessToken", obj.info.accessToken)
                uexXmlHttpMgr.clearCookie(); //清除cookie，解决ios上重新登录mas的sid不更新问题
                
                var ts = new Date().getTime();
                appcan.setLocVal("EPortal-EMM-LOGIN-TIME",ts);
                
                 var zzFullOrgIds=obj.info.zzFullOrgIds;
                //缓存用户信息提供子应用使用
                var provideSubApplication = {
                    userId: obj.info.uniqueField,
                    persenelId:obj.info.userId,
                    userName: obj.info.username,
                    orgId: obj.info.orgId[0],    // 科室ID
                    zzOrgId:obj.info.zzOrgId, //主职部门ID
                    jzOrgIds:obj.info.jzOrgIds, //兼职部门ID
                    orgName: obj.info.orgName[0], // 科室名称
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
                var userId = obj.info.uniqueField;
                // 使用神策设置用户登录ID
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

                // 记录登录结束逻辑(有session)
                var loginParamTrackTimerEnd = FunParamTrackTimerEnd("登录","登录","","","false");
                uexSensorsAnalytics.trackTimerEnd(JSON.stringify(loginParamTrackTimerEnd));
                
                //xmas oa登录
                if (isAndroid) {
                     //没有提示页按正常加载
                      if(isEnabled==0){
                          appcan.window.open("index", "index.html", 10, '');
                    };
                    //有提示页根据LoginSkipTime判断
                     appcan.window.subscribe("LoginSkipTime", function(LoginSkipTime) {  
                             if(LoginSkipTime=="istrue"){
                                appcan.window.open("index", "index.html", 10, '');
                        };
                        });
                    
                };
                    
                xmasOALogin(function(ret){
                    var rObj = JSON.parse(ret);
                    if(rObj.result=='yes' && rObj.sessionid){
                    };
                    var flag = isAndroid?64:'';
		    flag = '';
                    if (!isAndroid && !f) {
                        //没有提示页按正常加载
                         if(isEnabled==0){
                             appcan.window.open("index", "index.html",10, flag);
                         };
                           //有提示页根据LoginSkipTime判断
                         appcan.window.subscribe("LoginSkipTime", function(LoginSkipTime) {  
                             if(LoginSkipTime=="istrue"){
                                 appcan.window.open("index", "index.html",10, flag);
                             }   
                        });
                        
                    };
                });
                      
                if (f) {
                    obj.flag = f;
                };
                
                if (!f) {
                    var userId = obj.info.uniqueField;
                    appcan.setLocVal("userId", userId);
                    localStorage.setItem("userId",userId);
                     

                    //调用root页面initIm方法，初始化IM                    
                    loginPerInfoEmm(userId, function (err, data) {
                        if (err)
                            return;                        
                        appcan.setLocVal("EMM_USER_INFO", data);
                        localStorage.setItem("EMM_USER_INFO", JSON.stringify(data));

                    });
                } else {
                    appcan.window.publish("EPORTAL_MSG_LIST_READ_UPDATE", "")
                }

            } else {
                appcan.window.openToast(obj.info, 1500, 5);
                {
                    if (!f) {
                        appcan.window.open("login", "login.html", 10);
                    } else {
                        uexWidget.startWidget('Login', '10', '', 'login.html', '250');
                    }
                }
            }
        }
    };
    uexEMM.login(ss);
}
