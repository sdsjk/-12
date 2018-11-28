var STR_CONTACTS_TIPS_CHOOSE_GROUP_MEMBER = tools.getString("STR_CONTACTS_TIPS_CHOOSE_GROUP_MEMBER");
var STR_CONTACTS_SINGLE_CHAT = tools.getString("STR_CONTACTS_SINGLE_CHAT");
var STR_CONTACTS_TIPS_INPUT_GROUP_NAME = tools.getString("STR_CONTACTS_TIPS_INPUT_GROUP_NAME");
var STR_CONTACTS_TIPS_GROUP_NAME_FORMAT = tools.getString("STR_CONTACTS_TIPS_GROUP_NAME_FORMAT");


var chatGroupAddModel = Backbone.Model.extend({
    initialize: function () {
        this.set({})
    },
    service: chatGroupAddViewService,
    parse: function (resp) {
        return resp;
    },
    //校验输入内容
    validate: function (attrs, options) {
        //校验群组名
        if ((!attrs.groupName)) {
            return STR_CONTACTS_TIPS_INPUT_GROUP_NAME;//"请输入群名称";
        }
        if (!(/^(\w|[\u4E00-\u9FA5]){1,20}$/).test(attrs.groupName)) {
            return STR_CONTACTS_TIPS_GROUP_NAME_FORMAT;//"群名称为中文、英文或数字组合1-20个字符";
        }
        //校验群成员人数
        if (attrs.perCount < 2) {//小于2，提示错误信息
            return STR_CONTACTS_TIPS_CHOOSE_GROUP_MEMBER;//"请选择群成员";
        } else if (attrs.perCount == 2) {//等于2，单聊
            var perArr = JSON.parse(appcan.getLocVal("personArr"));
            var userId = (perArr[0].userId).toLowerCase();
            var fullName = perArr[0].fullName;
            appcan.setLocVal("yghao", userId);
            appcan.setLocVal("contactsName", fullName);
            appcan.window.evaluateScript('qunzuadd', 'close()');
            uexWidget.startWidget("IM", "10", "", "huihuadanliao1.html", "300");
            return STR_CONTACTS_SINGLE_CHAT;//'单聊';
        }
    },
    sync: function (method, model, options) {
        switch (method) {
            case "create":
                options.params = {
                    data: this.toJSON()
                }
                chatGroupAddViewService.request(options);
            case "update":
            case "patch":
                break;
            case "read":
                break;
            case "delete":
                break;
            default:
                break;
        }
    }
})