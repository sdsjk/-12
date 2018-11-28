function getHeaders() {
    var curTime = Date.now();
    var emmToken = JSON.parse(appcan.getLocVal("emmToken"));
    var accessToken = emmToken.info.accessToken;
    var tenantId = emmToken.info.tenantId || "";
    var headerParam = {
        "x-mas-app-id": appId,
        "accessToken": accessToken
    };
    if (tenantId) {
        headerParam.tenantId = tenantId + '';
    }
    return headerParam;
}
function personInfoEmm(staffId, callback) {
    var msgObj = {
        status: "000",
        msg: {
            item: {
                userId: "",
                entity: {}
            }
        }
    };
    var isCrypto = getIsCrypto();    
    if(isCrypto == 'true'){
    var emmToken = JSON.parse(appcan.getLocVal("emmToken"));
    var accessToken = emmToken.info.accessToken;
        //AES加密传输
        var key = CryptoJS.enc.Utf8.parse("www.myappcan.com");  
        var emmToken = JSON.parse(appcan.getLocVal("emmToken"));
        var accessToken = emmToken.info.accessToken;
        accessToken=CryptoJS.enc.Utf8.parse(accessToken);
        accessToken = CryptoJS.AES.encrypt(accessToken,key, {  
                mode: CryptoJS.mode.ECB,  
                padding: CryptoJS.pad.Pkcs7  
         });  
         staffId =CryptoJS.enc.Utf8.parse(staffId);
         staffId = CryptoJS.AES.encrypt(staffId,key, {  
                mode: CryptoJS.mode.ECB,  
                padding: CryptoJS.pad.Pkcs7  
         });  
        //格式转换
        var domainNamePer=CryptoJS.enc.Utf8.parse(domainName);
        //AES开始加密加密方式ECB
        domainNamePer = CryptoJS.AES.encrypt(domainNamePer,key, {  
                mode: CryptoJS.mode.ECB,  
                padding: CryptoJS.pad.Pkcs7  
         }); 
        var url = contactUrl + 'getByUniqueField?accessToken=' + encodeURIComponent(accessToken) + '&uniqueField=' + encodeURIComponent(staffId) + '&domainName=' + domainNamePer; 
    }else{
        var emmToken = JSON.parse(appcan.getLocVal("emmToken"));
        var accessToken = emmToken.info.accessToken;
        var url = contactUrl + 'getByUniqueField?accessToken=' + accessToken + '&uniqueField=' + staffId + '&domainName=' + encodeURIComponent(domainName);
    }
    // 神策插件记录接口调用开始时间(个人中心server)
    uexSensorsAnalytics.trackTimerBegin(JSON.stringify(paramTrackTimerStart));
    // 神策插件接口请求结束时间参数
    var paramTrackTimerEnd = FunParamTrackTimerEnd("接口请求","个人中心","getByUniqueField");
    appcan.request.ajax({
        url: url,
        type: 'GET',
        headers: getHeaders(),
        contentType: 'application/x-www-form-urlencoded',
        timeout: "30000",
        data: {},
        success: function (data, status, xhr) {
            // 神策插件记录接口请求结束时间
            uexSensorsAnalytics.trackTimerEnd(JSON.stringify(paramTrackTimerEnd));
            appcan.frame.resetBounce(0);
            appcan.frame.resetBounce(1);
            var data = JSON.parse(data);
            if (data[0]) {
                var j = 0;
                var orgName = data[j].orgName;
                var dptName = "";
                if (orgName) {
                    var orgNames = orgName.split(",");
                    var orgNameArr = orgNames[0].split("/");
                    var brcName = orgNameArr[0];//机构名称
                    
                }
                var personnelId = data[j].personnelId;//id
                var uniqueField = data[j].uniqueField;//userId
                var name = data[j].name;
                var userSex = data[j].userSex;
                var mobileNo = data[j].mobileNo;//mobileNo手机号
                var ipPhone = data[j].ipPhone;//集群号
                var email = data[j].email;//email邮箱
                var loginName = data[j].loginName;//loginName登陆姓名
                var officePhone = data[j].officePhone;//teleNo办公电话
                var officePhone2 = data[j].field3;
                var avatorLoc = data[j].avatorLoc;
                var jobId = data[j].jobId;//roleId
                var jobName = data[j].jobName;//roleName
                var jobName1 = '';
                if (jobName) {
                    var jobArr = jobName.split(",");
                    jobName1 = jobArr[0];
                }
                var topOrgIds = data[j].topOrgIds;//brcId
                var orgIds = data[j].orgIds;//dptId
                var higherLevelUniqueField = data[j].higherLevelUniqueField;//ldrUserId
                var higherLevelName = data[j].higherLevelName;//ldrFullName
                var leadname = "";
                if (higherLevelName) {
                    leadname = higherLevelName.split(",")[0];
                }
                var positionTypeId = data[j].positionTypeId;//positionTypeId
                var positionTypeName = data[j].positionTypeName;
                var dptPerObj = {
                    userId: uniqueField,
                    fullName: name,
                    sexId: userSex,
                    mobileNo: mobileNo,
                    jqNum:ipPhone,
                    email: email,
                    loginName: loginName,
                    mobileNo: mobileNo,
                    teleNo: officePhone2,
                    teleNo2: officePhone,
                    userIcon: avatorLoc,
                    roleId: jobId,
                    roleName: jobName1,
                    brcId: topOrgIds,
                    dptId: orgIds,
                    brcName: brcName,                    
                    dptName:orgName,
                    ldrUserId: higherLevelUniqueField,
                    ldrFullName: leadname,
                    positionTypeId: positionTypeId,
                    positionTypeName: positionTypeName
                }

            }
            var userId = appcan.getLocVal("userId");
            if (uniqueField == userId) {
                var userObj = {
                    loginUser: {
                        entity: {}
                    }
                };
                if (data[0]) {
                    var uniqueField = data[0].uniqueField;//userId
                    var name = data[0].name;//fullName
                    var avatorLoc = data[0].avatorLoc;
                    var topOrgIds = data[0].topOrgIds;//brcId
                    var orgIds = data[0].zzOrgId;//dptId
                    var personnelId = data[0].personnelId;
                    var dptPerObj1 = {
                        userId: uniqueField,
                        fullName: name,
                        userIcon: avatorLoc,
                        department: [{dptId: encodeURIComponent(orgIds)}],
                        brcId: encodeURIComponent(topOrgIds),
                        personnelId: personnelId,
                    }
                    userObj.loginUser.entity = dptPerObj1;
                    appcan.setLocVal("EMM_USER_INFO", userObj);
                    localStorage.setItem("EMM_USER_INFO", JSON.stringify(userObj));
                }
            }
            msgObj.msg.item.userId = uniqueField;
            msgObj.msg.item.entity = dptPerObj;
            callback(null, msgObj);
        },
        error: function (xhr, errorType, error, msg) {
            // 神策插件记录接口请求结束时间
            uexSensorsAnalytics.trackTimerEnd(JSON.stringify(paramTrackTimerEnd));
            appcan.frame.resetBounce(0);
            appcan.frame.resetBounce(1);
            var STR_NETWORDERROR = tools.getString("STR_NETWORDERROR");
            callback(-1000, {status: -30001, msg: {message: STR_NETWORDERROR}});
        }
    });
}
function editPerInfoEmm(staffId, infoObj, callback) {
    var dataObj = {
        status: ""
    };
    var emmToken = JSON.parse(appcan.getLocVal("emmToken"));
    var accessToken = emmToken.info.accessToken;
    var emmToken = JSON.parse(appcan.getLocVal("EMM_USER_INFO"));
    var personnelId = (emmToken.loginUser.entity.personnelId);
    var icon = '';
    if (infoObj.userIcon && infoObj.userIcon.indexOf("http") < 0)
        icon = '&avatorLoc=' + infoObj.userIcon;
    if (infoObj.userIcon == '') {
        icon = '&avatorLoc=';
    }
    if (!infoObj.mobileNo) {
        infoObj.mobileNo = '';
    }
    if (!infoObj.teleNo) {
        infoObj.teleNo = '';
    }
    if (!infoObj.email) {
        infoObj.email = '';
    }
    var url = contactUrl + 'updatePersonnelById?accessToken=' + accessToken + '&mobileNo=' + encodeURIComponent(infoObj.mobileNo) + '&officePhone=' + encodeURIComponent(infoObj.teleNo) + '&email=' + encodeURIComponent(infoObj.email) + '&userSex=' + infoObj.userSex + '&id=' + personnelId + '&domainName=' + encodeURIComponent(domainName) + icon;
    // 神策插件记录接口调用开始时间(个人中心server)
    uexSensorsAnalytics.trackTimerBegin(JSON.stringify(paramTrackTimerStart));
    // 神策插件接口请求结束时间参数
    var paramTrackTimerEnd = FunParamTrackTimerEnd("接口请求","个人中心","updatePersonnelById"); 
    appcan.request.ajax({
        url: url,
        type: 'GET',
        headers: getHeaders(),
        contentType: 'application/x-www-form-urlencoded',
        timeout: "30000",
        data: {},
        success: function (data, status, xhr) {
            // 神策插件记录接口请求结束时间
            uexSensorsAnalytics.trackTimerEnd(JSON.stringify(paramTrackTimerEnd));
            appcan.frame.resetBounce(0);
            appcan.frame.resetBounce(1);
            try {
                var data = JSON.parse(data);
                if (data.status == "ok") {
                    var status = "000";
                    dataObj.status = status;
                    callback(null, dataObj);
                } else {
                    callback(null, {status: "001", msg: {message: data.info}});
                }
            } catch (e) {
                var status = "001";
                dataObj.status = status;
                var STR_SERVER_MESSAGEERROR = tools.getString("STR_SERVER_MESSAGEERROR");
                callback(null, {status: -30001, msg: {message: STR_SERVER_MESSAGEERROR}});
            }
        },
        error: function (data) {
            // 神策插件记录接口请求结束时间
            uexSensorsAnalytics.trackTimerEnd(JSON.stringify(paramTrackTimerEnd));
            appcan.frame.resetBounce(0);
            appcan.frame.resetBounce(1);
            var status = "001";
            dataObj.status = status;
            var STR_NETWORDERROR = tools.getString("STR_NETWORDERROR");
            callback(-1000, {status: -30001, msg: {message: STR_NETWORDERROR}});
        }
    });
}
function loginPerInfoEmm(staffId, callback) {
    var msgObj = {
        loginUser: {
            entity: {}
        }
    };
    var emmToken = JSON.parse(appcan.getLocVal("emmToken"));
    var accessToken = emmToken.info.accessToken;
    var isCrypto = getIsCrypto();
    if(isCrypto == 'true'){
        //AES加密传输
        var key = CryptoJS.enc.Utf8.parse("www.myappcan.com"); 
        accessToken =CryptoJS.enc.Utf8.parse(accessToken);
        accessToken = CryptoJS.AES.encrypt(accessToken,key, {  
                mode: CryptoJS.mode.ECB,  
                padding: CryptoJS.pad.Pkcs7  
         });
        staffId =CryptoJS.enc.Utf8.parse(staffId);
        staffId = CryptoJS.AES.encrypt(staffId,key, {  
                mode: CryptoJS.mode.ECB,  
                padding: CryptoJS.pad.Pkcs7  
         });
        var domainNameLogin =CryptoJS.enc.Utf8.parse(domainName);
        domainNameLogin = CryptoJS.AES.encrypt(domainNameLogin,key, {  
                mode: CryptoJS.mode.ECB,  
                padding: CryptoJS.pad.Pkcs7  
         });
        var url = contactUrl + 'getByUniqueField?accessToken=' + encodeURIComponent(accessToken) + '&uniqueField=' + encodeURIComponent(staffId) + '&domainName=' + encodeURIComponent(domainNameLogin);
    }else{
        var url = contactUrl + 'getByUniqueField?accessToken=' + accessToken + '&uniqueField=' + staffId + '&domainName=' + encodeURIComponent(domainName);
    }
    
    // 神策插件记录接口调用开始时间(个人中心server)
    uexSensorsAnalytics.trackTimerBegin(JSON.stringify(paramTrackTimerStart));
    // 神策插件接口请求结束时间参数
    var paramTrackTimerEnd = FunParamTrackTimerEnd("接口请求","登录","getByUniqueField");
    appcan.request.ajax({
        url: url,
        type: 'GET',
        headers: getHeaders(),
        contentType: 'application/x-www-form-urlencoded',
        timeout: "30000",
        data: {},
        success: function (data, status, xhr) {
            // 神策插件记录接口请求结束时间
            uexSensorsAnalytics.trackTimerEnd(JSON.stringify(paramTrackTimerEnd));
            try {
                appcan.frame.resetBounce(0);
                appcan.frame.resetBounce(1);
                var data = JSON.parse(data);
                if (data[0]) {
                    var uniqueField = data[0].uniqueField;//userId
                    var name = data[0].name;//fullName
                    var avatorLoc = data[0].avatorLoc;
                    var topOrgIds = data[0].topOrgIds;//brcId
                    var orgIds = data[0].zzOrgId;//dptId
                    var personnelId = data[0].personnelId;
                    //当前用户部门ID
                    var bumenId=data[0].levelOrgIds;
                    var dptPerObj = {
                        userId: uniqueField,
                        fullName: name,
                        userIcon: avatorLoc,
                        department: [{dptId: encodeURIComponent(orgIds)}],
                        brcId: encodeURIComponent(topOrgIds),
                        personnelId: personnelId,
                    }
                }
                msgObj.loginUser.entity = dptPerObj;
            } catch (e) {
                errorDetail(e);
            }
            callback(null, msgObj);
        },
        error: function (data) {
            // 神策插件记录接口请求结束时间
            uexSensorsAnalytics.trackTimerEnd(JSON.stringify(paramTrackTimerEnd));
           
            appcan.frame.resetBounce(0);
            appcan.frame.resetBounce(1);
            var STR_NETWORDERROR = tools.getString("STR_NETWORDERROR");
            callback(-1000, {status: -30001, msg: {message: STR_NETWORDERROR}});
        }
    });
}

function perAllBydpt(dptId, callback, flag) {
    var msgObj = {
        msg: [],
        status: "000"
    };
    var emmToken = JSON.parse(appcan.getLocVal("emmToken"));
    var accessToken = emmToken.info.accessToken;
    var isCrypto = getIsCrypto();
    if(isCrypto == 'true'){
        //AES加密传输
        var key = CryptoJS.enc.Utf8.parse("www.myappcan.com");
        
        accessToken =CryptoJS.enc.Utf8.parse(accessToken);
        accessToken = CryptoJS.AES.encrypt(accessToken,key, {
                mode: CryptoJS.mode.ECB,  
                padding: CryptoJS.pad.Pkcs7  
         });
         
        dptId =CryptoJS.enc.Utf8.parse(dptId);
        dptId = CryptoJS.AES.encrypt(dptId,key, {  
                mode: CryptoJS.mode.ECB,  
                padding: CryptoJS.pad.Pkcs7  
         });
          
        var domainNameBydpt =CryptoJS.enc.Utf8.parse(domainName);
        domainNameBydpt = CryptoJS.AES.encrypt(domainNameBydpt,key, {
                mode: CryptoJS.mode.ECB,  
                padding: CryptoJS.pad.Pkcs7  
         });
         var url = contactUrl+'getPersonnelByOrgId?accessToken='+encodeURIComponent(accessToken)+'&orgId='+encodeURIComponent(dptId)+'&domainName='+encodeURIComponent(domainNameBydpt);
    }else{
         var url = contactUrl + 'getPersonnelByOrgId?accessToken=' + accessToken + '&orgId=' + dptId + '&domainName=' + encodeURIComponent(domainName);
    }
   
    // 神策插件记录接口调用开始时间(通讯录server)
    uexSensorsAnalytics.trackTimerBegin(JSON.stringify(paramTrackTimerStart));
    // 神策插件接口请求结束时间参数
    var paramTrackTimerEnd = FunParamTrackTimerEnd("接口请求","通讯录","getPersonnelByOrgId");
    appcan.request.ajax({
        url: url,
        type: 'GET',
        headers: getHeaders(),
        contentType: 'application/x-www-form-urlencoded',
        timeout: "30000",        
        data: {},
        success: function (data, status, xhr) {
            // 神策插件记录接口请求结束时间
            uexSensorsAnalytics.trackTimerEnd(JSON.stringify(paramTrackTimerEnd));
            
            var data = JSON.parse(data);
            var dptPerArr = [];
            for (var j = 0; j < data.length; j++) {
                var orgName = data[j].orgName;//brcName/dptName
                var dptName = "";
                //部门ID
                var  BumenId=data[j].levelOrgIds;
                if (orgName) {
                    var orgNames = orgName.split(",");
                    var orgNameArr = orgNames[0].split("/");
                    var brcName = orgNameArr[0];//机构名称
                    dptName = orgName;
                }
                var personnelId = data[j].personnelId;//id
                var uniqueField = data[j].uniqueField;//userId
                var name = data[j].name;//fullName
                var userSex = data[j].userSex;//sexId
                if (userSex == "male") {
                    var userSex = "01";
                } else if (userSex == "female") {
                    var userSex = "02";
                }
                var mobileNo = data[j].mobileNo;//mobileNo手机号
                var ipPhone = data[j].ipPhone;
                var email = data[j].email;//email邮箱
                var loginName = data[j].loginName;//loginName登陆姓名
                var officePhone = data[j].officePhone;//teleNo办公电话
                var officePhone2 = data[j].field3;
                var avatorLoc = data[j].avatorLoc;
                var jobId = data[j].jobId;//roleId
                var jobName = data[j].jobName;//roleName
                var jobName1 = "";
                if (jobName) {
                    var jobArr = jobName.split(",");
                    jobName1 = jobArr[0];
                }
                var topOrgIds = data[j].topOrgIds;//brcId
                var orgIds = data[j].orgIds;//dptId
                var higherLevelUniqueField = data[j].higherLevelUniqueField;//ldrUserId
                var higherLevelName = data[j].higherLevelName;//ldrFullName
                var leadname = "";
                if (higherLevelName) {
                    leadname = higherLevelName.split(",")[0];
                }
                var positionTypeId = data[j].positionTypeId;//positionTypeId
                var positionTypeName = data[j].positionTypeName;
                var dptPerObj = {
                    userId: uniqueField,
                    fullName: name,
                    sexId: userSex,
                    mobileNo: mobileNo,
                    jqNum: ipPhone,
                    email: email,
                    loginName: loginName,
                    mobileNo: mobileNo,
                    teleNo: officePhone2,
                    teleNo2: officePhone,
                    userIcon: avatorLoc,
                    roleId: jobId,
                    roleName: jobName1,
                    brcId: topOrgIds,
                    dptId: orgIds,
                    brcName: brcName,
                    dptName: dptName,
                    ldrUserId: higherLevelUniqueField,
                    ldrFullName: leadname,
                    positionTypeId: positionTypeId,
                    positionTypeName: positionTypeName
                };
                dptPerArr.push(dptPerObj);
            }
            var departmentId=BumenId;
            msgObj.msg = dptPerArr;
            callback(null, msgObj);
        },
        error: function (data) {
            // 神策插件记录接口请求结束时间
            uexSensorsAnalytics.trackTimerEnd(JSON.stringify(paramTrackTimerEnd));
            var STR_NETWORDERROR = tools.getString("STR_NETWORDERROR");
            callback(-1000, {status: -30001, msg: {message: STR_NETWORDERROR}});
        }
    });
}
function selAllPerByEmm(uname,pageNo,callback) {
    var msgObj = {
        msg: [],
        status: "000"
    };
    var emmToken = JSON.parse(appcan.getLocVal("emmToken"));
    var accessToken = emmToken.info.accessToken;
    
    var pageSize = 20;
    var pageNo = pageNo;
    var isCrypto = getIsCrypto();
    if(isCrypto == 'true'){
        //AES加密传输
        var key = CryptoJS.enc.Utf8.parse("www.myappcan.com");
         
        accessToken =CryptoJS.enc.Utf8.parse(accessToken);
        accessToken = CryptoJS.AES.encrypt(accessToken,key, {
                mode: CryptoJS.mode.ECB,  
                padding: CryptoJS.pad.Pkcs7  
         });
        uname = CryptoJS.enc.Utf8.parse(uname);
        uname = CryptoJS.AES.encrypt(uname,key, {
                  mode: CryptoJS.mode.ECB,  
                  padding: CryptoJS.pad.Pkcs7  
        });
        pageSize = CryptoJS.enc.Utf8.parse(pageSize);
        pageSize = CryptoJS.AES.encrypt(pageSize,key, {
                  mode: CryptoJS.mode.ECB,  
                  padding: CryptoJS.pad.Pkcs7  
        });        
        pageNo = CryptoJS.enc.Utf8.parse(pageNo);
        pageNo = CryptoJS.AES.encrypt(pageNo,key, {
                  mode: CryptoJS.mode.ECB,  
                  padding: CryptoJS.pad.Pkcs7  
        });
        var domainNameSerach =CryptoJS.enc.Utf8.parse(domainName);
        domainNameSerach = CryptoJS.AES.encrypt(domainNameSerach,key, {
                mode: CryptoJS.mode.ECB,  
                padding: CryptoJS.pad.Pkcs7  
        });
        
        var url = contactUrl + 'getPersonnelByName?accessToken=' + encodeURIComponent(accessToken) + '&userName=' + encodeURIComponent(uname) + '&domainName=' + encodeURIComponent(domainNameSerach) + "&pageSize="+ encodeURIComponent(pageSize) + "&pageNo=" + encodeURIComponent(pageNo);
    }else{
        var url = contactUrl + 'getPersonnelByName?accessToken=' + accessToken + '&userName=' + encodeURIComponent(uname) + '&domainName=' + encodeURIComponent(domainName)+"&pageSize="+ pageSize + "&pageNo=" + pageNo;
    }
    
    var flag = false;
    // 神策插件记录接口请求开始时间(通讯录server)
     uexSensorsAnalytics.trackTimerBegin(JSON.stringify(paramTrackTimerStart));
    // 神策插件接口请求结束参数
    var paramTrackTimerEnd = FunParamTrackTimerEnd("接口请求","通讯录","getPersonnelByName");
    appcan.request.ajax({
        url: url,
        type: 'get',
        headers: getHeaders(),
        contentType: 'application/x-www-form-urlencoded',
        timeout: "30000",
        data: {},
        success: function (data, status, xhr) {
            // 神策插件记录接口请求结束时间
            uexSensorsAnalytics.trackTimerEnd(JSON.stringify(paramTrackTimerEnd));
           
            var data = JSON.parse(data);
            var dptPerArr = [];
            for (var j = 0; j < data.length; j++) {
                var orgName = data[j].orgName || data[j].NAME;//brcName/dptName
                var dptName = "";
                if (orgName) {
                    var orgNames = orgName.split(",");
                    var orgNameArr = orgNames[0].split("/");
                    var brcName = orgNameArr[0];//机构名称
                    dptName = orgName;
                }
                var personnelId = data[j].personnelId;//id
                var uniqueField = data[j].uniqueField;//userId
                var name = data[j].name;//fullName
                var userSex = data[j].userSex;//sexId
                if (userSex == "male") {
                    var userSex = "01";
                } else if (userSex == "female") {
                    var userSex = "02";
                }
                var mobileNo = data[j].mobileNo ? data[j].mobileNo : "";//mobileNo手机号
                var ipPhone = data[j].ipPhone;
                var email = data[j].email ? data[j].email : "";//email邮箱
                var loginName = data[j].loginName;//loginName登陆姓名
                var officePhone = data[j].officePhone;//teleNo办公电话
                var officePhone2 = data[j].field3;
                var avatorLoc = data[j].avatorLoc;
                if(avatorLoc && avatorLoc.indexOf('https://')<0) avatorLoc='https://apps.shenzhenair.com/uploads/'+avatorLoc;
                var jobId = data[j].jobId;//roleId
                var jobName = data[j].jobName;//roleName
                var jobName1 = "";
                var dptName2 = dptName;
                if (jobName) {
                    var jobArr = jobName.split(",");
                    jobName1 = jobArr[0];
                }
                var topOrgIds = data[j].topOrgIds;//brcId
                var orgIds = data[j].orgIds;//dptId
                var higherLevelUniqueField = data[j].higherLevelUniqueField;//ldrUserId
                var higherLevelName = data[j].higherLevelName;//ldrFullName
                var leadname = "";
                if (higherLevelName) {
                    leadname = higherLevelName.split(",")[0];
                }
                var positionTypeId = data[j].positionTypeId;//positionTypeId
                var positionTypeName = data[j].positionTypeName;
                var dptPerObj = {
                    userId: uniqueField,
                    fullName: name,
                    sexId: userSex,
                    mobileNo: mobileNo,
                    jqNum: ipPhone,
                    email: email,
                    loginName: loginName,
                    mobileNo: mobileNo,
                    teleNo: officePhone2,
                    teleNo2: officePhone,
                    userIcon: avatorLoc,
                    roleId: jobId,
                    roleName: jobName1,
                    brcId: topOrgIds,
                    dptId: orgIds,
                    brcName: brcName,
                    dptName: dptName,
                    dptName2: dptName2,
                    ldrUserId: higherLevelUniqueField,
                    ldrFullName: leadname,
                    positionTypeId: positionTypeId,
                    positionTypeName: positionTypeName
                };
                dptPerArr.push(dptPerObj);
            }
            msgObj.msg = dptPerArr;
            callback(null, msgObj);
        },
        error: function (data) {
            // 神策插件记录接口请求结束时间
            uexSensorsAnalytics.trackTimerEnd(JSON.stringify(paramTrackTimerEnd));
            var STR_NETWORDERROR = tools.getString("STR_NETWORDERROR");
            callback(-1000, {status: -30001, msg: {message: STR_NETWORDERROR}});
        }
    });
}