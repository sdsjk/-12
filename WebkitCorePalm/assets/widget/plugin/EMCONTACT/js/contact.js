var STR_NETWORDERROR = tools.getString("STR_NETWORDERROR");

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
function dptAndPer(dptId, callback, freshFlag) {
    var msgObj = {
        status: "000",
        msg: {
            danPersonnel: {
                list: []
            },
            personnel: {
                list: []
            }
        }
    };
    var flag = 0;
    var emmToken = JSON.parse(appcan.getLocVal("emmToken"));
    var accessToken = emmToken.info.accessToken;
    var indexInfo = JSON.parse(appcan.getLocVal("EMM_USER_INFO")  || localStorage.getItem("EMM_USER_INFO"));
    if(JSON.stringify(indexInfo.loginUser) != '{}'){
       
        var dptIds = indexInfo.loginUser.entity.department[0].dptId;
        var brcId = indexInfo.loginUser.entity.brcId;
    }
    //部门通讯录接口:返回一个部门下所有的子部门
    var url = contactUrl + 'danPersonnel?accessToken=' + accessToken + '&orgId=' + dptId + '&domainName=' + encodeURIComponent(domainName);
   
    // 神策插件记录接口请求开始时间
    uexSensorsAnalytics.trackTimerBegin(JSON.stringify(paramTrackTimerStart));
    // 神策插件接口请求结束时间参数
    var paramTrackTimerEnd = FunParamTrackTimerEnd("接口请求","通讯录","danPersonnel");
    appcan.request.ajax({
        url: url,
        type: 'GET',
        headers: getHeaders(),
        contentType: 'application/x-www-form-urlencoded',
        timeout: "30000",
        data: {},
        offline: freshFlag ? false : true,
        offlineDataPath: 'box://icache/',
        success: function (data, status, xhr) {
            // 神策插件记录接口请求结束时间
            uexSensorsAnalytics.trackTimerEnd(JSON.stringify(paramTrackTimerEnd));
           
            var data = JSON.parse(data);
            var dptArr = [];
            for (var i = 0; i < data.length; i++) {
                var id = data[i].id;
                var name = data[i].name;
                var pId = data[i].pId;//父级id
                var dptObj = {
                    entityId: id,
                    dptName: name,
                    superDptId: pId
                };
                dptArr.push(dptObj);
            }
            msgObj.msg.danPersonnel.list = dptArr;
            if (flag == 0) {
                flag = 1;
            } else {
                callback(null, msgObj);
            }
        },
        error: function (data) {
            // 神策插件记录接口请求结束时间
            uexSensorsAnalytics.trackTimerEnd(JSON.stringify(paramTrackTimerEnd));
            callback(-1000, {status: -30001, msg: {message: STR_NETWORDERROR}});
        }
    });
    var dptIdCur = dptId;
    if (brcId == dptId) {
        if (dptIds != dptIdCur) {
              dptIdCur = dptIdCur;
        } else {
            dptIdCur = dptIds
        }
    }
    var isCrypto = getIsCrypto();
    if(isCrypto == 'true'){
        //AES加密传输
        var key = CryptoJS.enc.Utf8.parse("www.myappcan.com"); 
        accessToken =CryptoJS.enc.Utf8.parse(accessToken);
        accessToken = CryptoJS.AES.encrypt(accessToken,key, {  
                mode: CryptoJS.mode.ECB,  
                padding: CryptoJS.pad.Pkcs7  
         });
        dptIdCur =CryptoJS.enc.Utf8.parse(dptIdCur);
        dptIdCur = CryptoJS.AES.encrypt(dptIdCur,key, {  
                mode: CryptoJS.mode.ECB,  
                padding: CryptoJS.pad.Pkcs7  
         });
        var domainNameByper =CryptoJS.enc.Utf8.parse(domainName);
        domainNameByper = CryptoJS.AES.encrypt(domainNameByper,key, {  
                mode: CryptoJS.mode.ECB,  
                padding: CryptoJS.pad.Pkcs7  
         });
        var personUrl = contactUrl+'getPersonnelByOrgId?accessToken='+encodeURIComponent(accessToken)+'&orgId='+encodeURIComponent(dptIdCur)+'&domainName='+encodeURIComponent(domainNameByper); 
    }else{
        var personUrl = contactUrl + 'getPersonnelByOrgId?accessToken=' + accessToken + '&orgId=' + dptIdCur + '&domainName=' + encodeURIComponent(domainName);
    } 
    
    //根据部门id获取人员，EMM3.4 MUM的接口文档里没有
    appcan.request.ajax({
        url: personUrl,
        type: 'GET',
        headers: getHeaders(),
        offline: freshFlag ? false : true,
        offlineDataPath: 'box://icache/',
        contentType: 'application/x-www-form-urlencoded',
        timeout: "30000",
        data: {},
        success: function (data, status, xhr) {
            var data = JSON.parse(data);
            if(data.length!=0){
               if(data[0].uniqueField=="ITIMADMIN"){
                   $('#perList').addClass('uhide');
               }else{
                   $('#perList').removeClass('uhide');
               } 
            }
            
            var dptPerArr = [];
            for (var j = 0; j < data.length; j++) {
                var orgName = data[j].orgName;//brcName/dptName
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
                var avatorLoc = data[j].avatorLoc
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
            msgObj.msg.personnel.list = dptPerArr;
            if (flag == 0) {
                flag = 1;
            } else {
                callback(null, msgObj);
            }
        },
        error: function (data) {
            callback(-1000, {status: -30001, msg: {message: STR_NETWORDERROR}});
        }
    });

}
function personInfoEmm(staffId, callback) {
    var msgObj = {
        msg: {
            item: {
                userId: "",
                entity: {}
            }
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
        var domainNamePer =CryptoJS.enc.Utf8.parse(domainName);
        domainNamePer = CryptoJS.AES.encrypt(domainNamePer,key, {  
                mode: CryptoJS.mode.ECB,  
                padding: CryptoJS.pad.Pkcs7  
         });
         var url = contactUrl + 'getByUniqueField?accessToken=' + encodeURIComponent(accessToken) + '&uniqueField=' + encodeURIComponent(staffId) + '&domainName=' + encodeURIComponent(domainNamePer);
    }else{
        var url = contactUrl + 'getByUniqueField?accessToken=' + accessToken + '&uniqueField=' + staffId + '&domainName=' + encodeURIComponent(domainName);
    }
    // 神策插件记录接口调用开始时间
    uexSensorsAnalytics.trackTimerBegin(JSON.stringify(paramTrackTimerStart));
    // 神策插件接口请求结束时间参数
    var paramTrackTimerEnd = FunParamTrackTimerEnd("接口请求","通讯录","getByUniqueField");
    appcan.request.ajax({
        //根据唯一标识查询接口        
        url: url,
        type: 'GET',
        headers: getHeaders(),
        contentType: 'application/x-www-form-urlencoded',
        timeout: "30000",
        data: {},
        success: function (data, status, xhr) {
            // 神策插件接口请求结束时间
            uexSensorsAnalytics.trackTimerEnd(JSON.stringify(paramTrackTimerEnd));
            var data = JSON.parse(data);
            if (data[0]) {
                var j = 0;
                var orgName = data[j].orgName;//brcName/dptName
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
                var mobileNo = data[j].mobileNo;//mobileNo手机号
                var ipPhone = data[j].ipPhone;
                var email = data[j].email;//email邮箱
                var loginName = data[j].loginName;//loginName登陆姓名
                var officePhone = data[j].officePhone;//teleNo办公电话
                var officePhone2 = data[j].field3;
                var avatorLoc = data[j].avatorLoc
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
                }
            }
            msgObj.msg.item.userId = uniqueField;
            msgObj.msg.item.entity = dptPerObj;
            callback(null, msgObj);
        },
        error: function (data) {
            // 神策插件接口请求结束时间
            uexSensorsAnalytics.trackTimerEnd(JSON.stringify(paramTrackTimerEnd));
            callback(-1000, {status: -30001, msg: {message: STR_NETWORDERROR}});
        }
    });
}
function perAllBydpt(dptId, callback) {
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
         var url = contactUrl + 'getPersonnelByOrgId?accessToken=' + encodeURIComponent(accessToken) + '&orgId=' +encodeURIComponent(dptId)+ '&domainName='+encodeURIComponent(domainNameBydpt);
    }else{
         var url = contactUrl + 'getPersonnelByOrgId?accessToken=' + accessToken + '&orgId=' + encodeURIComponent(dptId) + '&domainName=' + encodeURIComponent(domainName);
    }
    // 神策插件记录接口请求开始时间
    uexSensorsAnalytics.trackTimerBegin(JSON.stringify(paramTrackTimerStart));
    // 神策插件接口请求结束时间参数
    var paramTrackTimerEnd = FunParamTrackTimerEnd("接口请求","通讯录","getPersonnelByOrgId");
    appcan.request.ajax({        
        url : url,
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
                if (orgName) {
                    var orgNames = orgName.split(",");
                    var orgNameArr = orgNames[0].split("/");
                    var brcName = orgNameArr[0];//机构名称
                    dptName = orgNameArr[orgNameArr.length - 1]; //部门名称
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
                var avatorLoc = data[j].avatorLoc
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
                    dptName: dptName,
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
            callback(-1000, {status: -30001, msg: {message: STR_NETWORDERROR}});
        }
    });
}
function selAllPerByEmm(uname, callback) {
    var msgObj = {
        msg: [],
        status: "000"
    };
    var emmToken = JSON.parse(appcan.getLocVal("emmToken"));
    var accessToken = emmToken.info.accessToken;
    var indexInfo = JSON.parse(appcan.getLocVal("EMM_USER_INFO"));
    if(JSON.stringify(indexInfo.loginUser) != '{}'){
        var brcId = indexInfo.loginUser.entity.brcId;
    }  
    // 神策插件记录接口请求开始时间
    uexSensorsAnalytics.trackTimerBegin(JSON.stringify(paramTrackTimerStart));
    // 神策插件接口请求结束时间参数
    var paramTrackTimerEnd = FunParamTrackTimerEnd("接口请求","通讯录","getPersonnelByName");
    appcan.request.ajax({
        url : contactUrl + 'getPersonnelByName?accessToken=' + accessToken + '&userName=' + encodeURIComponent(uname) + '&domainName=' + encodeURIComponent(domainName) + "&orgId=" + encodeURIComponent(brcId)+"&pageSize=150",
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
                var orgName = data[j].orgName;//brcName/dptName
                var dptName = "";
                if (orgName) {
                    var orgNames = orgName.split(",");
                    var orgNameArr = orgNames[0].split("/");
                    var brcName = orgNameArr[0];//机构名称
                    dptName = orgNameArr[orgNameArr.length - 1]; //部门名称
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
                var officePhone2 = data[j].field3;//teleNo办公电话
                var avatorLoc = data[j].avatorLoc
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
            msgObj.msg = dptPerArr;
            callback(null, msgObj);
        },
        error: function (data) {
            // 神策插件记录接口请求结束时间
            uexSensorsAnalytics.trackTimerEnd(JSON.stringify(paramTrackTimerEnd));
            callback(-1000, {status: -30001, msg: {message: STR_NETWORDERROR}});
        }
    });
}
