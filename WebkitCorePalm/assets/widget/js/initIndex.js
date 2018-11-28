var TIP_IM_LOGIN_FAIL = tools.getString("TIP_IM_LOGIN_FAIL");

appcan.ready(function () {
    imLogin();
    appcan.window.subscribe("IM-LOGIN", function (result) {
        imLogin();
    });
    appcan.window.subscribe("CB_GET_GROUPLIST", function (result) {
        return;
        var data = result;
        var groupArr = data.msg.grouplist;
        var arr = [];
        for (var i = 0; i < groupArr.length; i++) {
            var groupId = groupArr[i].groupname;
            arr.push(groupId);
        }
        var param = {
            groupList: arr
        }
    });
    appcan.window.subscribe("E_XMPP_CBJOINGROUPCHAT", function (result) {
        var data = result;
        if (data.errorCode == 0) {
            uexIM.getUserAndGroupAllMsgUnreadCount();
        }
    });
    appcan.window.subscribe("E_XMPP_LOGIN_RES", function (result) {
        if (result == 0) {
            //获取所有加入过的群进行加入
            var param = {
                page: 1,
                count: 1000
            }
            var params = JSON.stringify(param);
            appcan.window.publish("CHAT_GROUP_LIST", params);
            uexIM.getUserAndGroupAllMsgUnreadCount();
        } else {
            appcan.window.openToast(TIP_IM_LOGIN_FAIL, 3500, 5);
        }
    });
    appcan.window.subscribe("TOKENOUTOFFLOGIN", function () {
        uexWidget.startWidget('Login', '10', '', 'login1.html', '250');
    });

    appcan.window.subscribe("APORTAL_PUSH_DATA_SHOW", function (d) {
        getPushInfo(d)
    });
    appcan.window.evaluateScript("root", 'pushInit()');
    appcan.window.evaluateScript("login", 'uexWindow.close(0)');

});

function imLogin() {
    try {
       
        var userId = appcan.getLocVal("userId");
        var emmToken = JSON.parse(appcan.getLocVal("emmToken"));
        var domainId = emmToken.info.domainId;
        var pwdId = emmToken.info.accessToken + "emoa" + domainId;
        var loginInfo = {
            imId: userId.toLowerCase(),
            imPassword: pwdId
        };
        appcan.window.publish("E_XMPP_LOGIN", loginInfo);
    } catch (e) {
        errorDetail(e);
    }
}

function getPushInfo(info) {
    try {
        var pushString = JSON.parse(info);
        var param1 = pushString.behavior.param[0];
        switch (param1.type) {
            case '09':
                //公告
                var param = {
                    "name": "notice_detail",
                    "data": "notice_detail.html?noticeId=" + param1.objectId
                }
                break;
            case '25':
                //日程
                var param = {
                    "name": "sched_detail",
                    "data": "sched_detail.html?schedId=" + param1.objectId
                }
                break;
            case 'GDSP':
                //工单审批
                var param = {
                    "name": "workFlowDetail",
                    "data": "workFlowDetail.html?pushComing=" + encodeURIComponent(JSON.stringify(param1.workFlow))
                };
                break;

            default:
                break;
        }
        if (param) {
            var param2 = {
                appId: param1.appId,
                param: param
            }
            appcan.window.publish("EPORTAL_LOAD_APP", param2);
        }

    } catch (e) {
        
    }

}