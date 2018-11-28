var STR_CONTACTS_SINGLE_CHAT = tools.getString("STR_CONTACTS_SINGLE_CHAT");
var STR_UPLOADING = tools.getString("STR_UPLOADING");
var STR_CONTACTS_ERROR_CREATE_GROUP_FAIL = tools.getString("STR_CONTACTS_ERROR_CREATE_GROUP_FAIL");

var ChatGroupAddView = Backbone.View.extend({
    initialize: function () {
        this.stickit();
    },
    model: new chatGroupAddModel({perCount: '1'}),
    el: 'body',
    bindings: {
        "#groupName": {
            observe: 'groupName',
            getVal: function ($el, event, options) {
                return $el.val();
            }
        },
        "#perCount": {
            observe: 'perCount',
            getVal: function ($el, event, options) {
                return $el.val();
            }
        }
    },
    submit: function () {
        var self = this;
        if (!this.model.isValid()) {
            if (this.model.validationError != STR_CONTACTS_SINGLE_CHAT)
                appcan.window.openToast(this.model.validationError, 1500, 5);
            return false;
        }
        appcan.window.openToast(STR_UPLOADING);
        this.model.save({}, {
            success: function (cols, resp, options) {

            },
            error: function (cols, error, options) {
                appcan.window.closeToast();
                switch (error.status) {
                    default:
                        global_error(error);
                        break;
                }
            }
        });
    },
    openType: 0
});

var chatGroupAddView;

appcan.ready(function () {
    chatGroupAddView = new ChatGroupAddView();

    appcan.window.subscribe("CB_GET_GROUPIDBYNAME", function (result) {
        if(result!='-1'){
            appcan.setLocVal("groupObjIds", result);
        }
    });
    appcan.window.subscribe("qunliaochengyuan", function (result) {
        var data = JSON.parse(result);
        var count = data.length + 1;
        $("#perCount").html(count);
        chatGroupAddView.model.set({
            perCount: count,
        });
    });

    appcan.window.subscribe("E_XMPP_CBCREATEGROUPCHAT", function (result) {//创建群聊回调的返回结果
        var result1 = result;
        var groupId = result1.groupName;
        if (result1.errorCode == 0) {
            appcan.setLocVal("groupObjIds", '');
            var objParam = {
                groupName: groupId
            };
            var objParams = JSON.stringify(objParam);
            uexIM.getGroupidByName(objParams);
            var imId = [];
            var infoArr = JSON.parse(appcan.getLocVal("personArr"));
            for (var i = 0; i < infoArr.length; i++) {
                var userId = (infoArr[i].userId).toLowerCase();
                imId.push(userId);
            }
            var param = {
                groupName: groupId,
                dataList: imId,
                reason: ""
            };
            var params = JSON.stringify(param);
            uexIM.inviteToChatGroup(params);
        } else {
            appcan.window.openToast(STR_CONTACTS_ERROR_CREATE_GROUP_FAIL, 3000, 5);
        }
    });
    appcan.window.subscribe("E_XMPP_CBJOINGROUPCHAT", function (result) {
        var data = result;
        var groupDes = data.groupdes;
        var groupId = data.groupName;
        if (data.errorCode == 0) {
            appcan.setLocVal("groupName", groupId);
            appcan.setLocVal("groupDes", groupDes);
            appcan.window.evaluateScript('qunzuadd', 'close()');
            uexWidget.startWidget("IM", "10", "", "huihuaqunliao.html", "300");
        }
    });
});

appcan.button("#selPerson", "ani-act", function () {
    appcan.setLocVal("openType", "");
    var num = $("#perCount").html();
    var data = appcan.getLocVal("personArr");
    if (isDefine(data) && Number(num) > 1){
        appcan.setLocVal("_toXzPage", data);
    }else{
        appcan.locStorage.remove('personArr');
    }
        
    uexWidget.startWidget("EMCONTACT", "10", "", "gsbumenfuxuan1.html", "300");
});
