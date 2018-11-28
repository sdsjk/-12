var STR_LOADING_SHORT = tools.getString("STR_LOADING_SHORT");

//加载并初始化模板对象
var contactItemTemplate = loadTemplate("assets/templates/contactItem_content.tpl");
var contactItemRadioTemplate = loadTemplate("assets/templates/contactItemRadio_content.tpl");
var contactItemCheckBoxTemplate = loadTemplate("assets/templates/contactItemCheckBox_content.tpl");
var dptItemTemplate = loadTemplate("assets/templates/dptItem_content.tpl");
var perView = Backbone.View.extend({//options...
    initialize: function (option) {
        //初始化VIEW并让model与VIEW进行关联
        this.model.view = this;
        this.kind = option.kind;
        this.defaultData = option.defaultData;
        var userId = this.model.get("userId");
        if (userId) {
            this.model.on("change", function () {
                appcan.setLocVal("CACHE_USERINFO_" + userId.toUpperCase(), JSON.stringify(this.toJSON()))
                if (this.hasChanged("userIcon")) {
                    appcan.window.publish("IM_USER_ICON_CHANGE", {
                        userIcon: this.get("userIcon"),
                        userId: userId.toLowerCase()
                    });
                }
            });
            var userInfo = appcan.getLocVal("CACHE_USERINFO_" + userId.toUpperCase()) || localStorage.getItem("CACHE_USERINFO_" + userId.toUpperCase());            
            if (userInfo) {
                try {
                    var userInfo = JSON.parse(userInfo);
                    var oldUserIcon = userInfo.userIcon;
                    var newUserIcon = this.model.toJSON().userIcon;
                    if (!isDefine(oldUserIcon)) {
                        oldUserIcon = '';
                    }
                    if (!isDefine(newUserIcon)) {
                        newUserIcon = '';
                    }
                    if (oldUserIcon != newUserIcon) {
                        appcan.window.publish("IM_USER_ICON_CHANGE", {
                            userIcon: newUserIcon,
                            userId: userId.toLowerCase()
                        });
                    }
                } catch (e) {

                }
            }
            appcan.setLocVal("CACHE_USERINFO_" + userId.toUpperCase(), JSON.stringify(this.model.toJSON()))
        }
        //初始化VIEW的HTMLDOM对象
        this.render();
    },
    template: function () {
        switch (this.kind) {
            case "radio":
                return contactItemRadioTemplate;
                break;
            case "checkbox":
                return contactItemCheckBoxTemplate;
                break;
            default:
                return contactItemTemplate;
                break;
        }

    },
    render: function () {
        var self = this;
        var template = self.template();
        if (template) {
            var name = self.model.attributes.fullName;
            var lastName = name.substr((name.length) - 1, 1);
            var firstName = name[0];
            var lastNameSP = shouPin.getCamelChars(lastName);
            var userID = appcan.getLocVal("userId");
            //使用模板+数据拼装DOM
            self.$el = $(template({
                data: self.model.attributes,
                isMobile: function (mobile) {
                    if (isDefine(mobile)) {
                        return "bm-phone";
                    }
                    return "";
                },
                isOneself : function(id,mobile) {
                    if (userID == id) {
                    }
                    if(!mobile) return '';
                    return "bm-xxduihua";
                },
                setIcon: function (icon) {
                    if (icon)
                        return 'lazy" data-original="' + constant.IMG_URL + icon + '" style="background-color:' + generateColor(lastNameSP);
                    return ' lazy" style="background-color:' + generateColor(lastNameSP);
                },
                setIconFont: function (icon) {
                    var lastNameStr = '<div style="line-height:2.5em; text-align:center;color:#ffffff;">' + firstName + '</div>';
                    return lastNameStr;
                },
                 setCheck: function (userId, fullName) {
                    for (var i in self.defaultData) {
                        if (self.defaultData[i].userId == userId || self.defaultData[i].fullName == fullName)
                            return "checked";
                    }
                    if (contactDptListViewInstance && contactDptListViewInstance.defaultIM)
                        for (var i in contactDptListViewInstance.defaultIM) {
                            if (contactDptListViewInstance.defaultIM[i] == userId.toLowerCase())
                                return "checked disabled";
                        }
                    return '';
                }
            }));
            self.bindingEvent(self.model);
        }

        //返回自身，便于promise调用
        return self;
    },
    bindingEvent: function (model) {
        var sc_userId = appcan.getLocVal("userId");
        var self = this;
        switch (self.kind) {
            case "radio": {
                appcan.button(self.$el, "btn-act", function () {
                    if ($(this).hasClass("hyxq"))return;
                    event.stopPropagation();
                    var flag = String($(this).find("input").attr("checked"));
                    if (flag == "false") {
                        $(this).find("input").prop("checked", true);
                        var userId = self.model.get("userId");
                        var fullName = self.model.get("fullName");
                        var userIcon = self.model.get("userIcon");
                        var globeMenu = [];
                        var menu = {
                            "userId": userId,
                            "fullName": fullName,
                            "userIcon": userIcon
                        }
                        globeMenu.push(menu);
                        appcan.window.publish("danxuan", JSON.stringify(globeMenu));
                        uexWidget.finishWidget("", "EMCONTACT", "0");
                    } else {
                        $(this).find("input").prop("checked", false);
                    }
                })
                $('input').click(function (e) {
                    if ($(this).hasClass("hyxq"))return;
                    e.stopPropagation();
                })

            }
                break;
            case "checkbox": {
                $('input', self.$el).click(function (e) {
                    e.stopPropagation();
                    if ($(this).hasClass("hyxq"))return;
                    var isDisabled = String($(this).attr("disabled"));
                    if (isDisabled == "false") {
                        self.setData(self.model);
                        var flag = String($(this).attr("checked"));
                        if (flag == 'false') {
                            $("." + self.model.get("fullName")).prop("checked", false);
                        } else {
                            $("." + self.model.get("fullName")).prop("checked", true);
                        }
                    }
                })
                appcan.button($(".item", self.$el), "btn-act", function () {
                    event.stopPropagation();
                    if ($(this).hasClass("hyxq"))return;
                    var isDisabled = String($(this).parent().find("input").attr("disabled"));
                    if (isDisabled == "true") {
                        return;
                    }
                    var flag = String($(this).parent().find("input").attr("checked"));
                    if (flag == 'false') {
                        $("." + self.model.get("fullName")).prop("checked", true);
                    } else {
                        $("." + self.model.get("fullName")).prop("checked", false);
                    }
                    self.setData(self.model);
                })
            }
                break;
            default: {
                appcan.button($("#bm-phone", self.$el), "btn-act", function () {
                    var telnum = model.get("mobileNo");
                    var teleNo = self.model.get("teleNo")
                    if(teleNo) telnum = teleNo + ';' + telnum;
                    //开启神策埋点事件追踪
                     var param = {
                                event: 'platformClick',
                                propertieDict: {
                                    userId:sc_userId,
                                    module:'通讯录',
                                    funcName:'拨打电话',
                                    buttonName:'电话'                               
                                }
                      };
                      uexSensorsAnalytics.trackWithProperties(JSON.stringify(param));
                    if(telnum.length>11){
                        var arr = telnum.match(/\d+(\.\d+)?/g);
                        uexWindow.actionSheet({
                           title:"请选择要拨打的电话号码",
                           cancel:"取消",
                           buttons:arr.toString(),
                        },function(i){
                           telnum = arr[i];
                           if(telnum) uexCall.dial(telnum);
                        });
                        return;
                    }
                    uexCall.dial(telnum);
                })
                appcan.button($("#bm-xxduihua", self.$el), "btn-act", function () {
                    var userId = model.get("userId");
                    var userIcon = model.get("userIcon");
                    var sonName = model.get("fullName");
                    appcan.setLocVal(storeKey.PERSON_ID, userId);
                    appcan.setLocVal(storeKey.CONTACT_ICON, userIcon);
                    appcan.setLocVal(storeKey.CONTACT_NAME, sonName);
                    var telnum = model.get("mobileNo");
                    //开启神策埋点事件追踪
                     var param = {
                                event: 'platformClick',
                                propertieDict: {
                                    userId:sc_userId,
                                    module:'通讯录',
                                    funcName:'发送短信',
                                    buttonName:'短信'                               
                                }
                      };
                      uexSensorsAnalytics.trackWithProperties(JSON.stringify(param));
                    if(telnum.length>11){
                        var arr = telnum.match(/\d+(\.\d+)?/g);
                        uexWindow.actionSheet({
                           title:"请选择要发消息的手机号码",
                           cancel:"取消",
                           buttons:arr.toString(),
                        },function(i){
                           telnum = arr[i];
                           if(telnum) uexSMS.open(""+telnum,"");
                        });
                        return;
                    }
                    uexSMS.open(""+telnum,"");
                })
                appcan.button($(".del", self.$el), "btn-act", function () {
                    var userId = model.get("userId");
                    var conName = model.get("fullName");
                    appcan.setLocVal(storeKey.PERSON_NAME, conName);
                    appcan.setLocVal(storeKey.CONTACT_NAME, conName);
                    appcan.setLocVal(storeKey.PERSON_ID, userId);
                    //开启神策埋点事件追踪
                     var param = {
                                event: 'platformClick',
                                propertieDict: {
                                    userId:sc_userId,
                                    module:'通讯录',
                                    funcName:'个人信息',
                                    buttonName:'个人信息'                               
                                }
                      };
                      uexSensorsAnalytics.trackWithProperties(JSON.stringify(param));
                    if (isAndroid) {
                        appcan.window.open("contactsMain", "contactsMain.html", 10, 64);
                    } else {
                        appcan.window.open("contactsMain", "contactsMain.html", 10);
                    }
                })
            }
                break;
        }

    },
    setData: function (model) {
        var userId = model.get("userId");
        var fullName = model.get("fullName");
        var userIcon = model.get("userIcon");
        var menu = {
            "userId": userId,
            "fullName": fullName,
            "userIcon": userIcon
        };

        appcan.window.publish("gsbumenfuxuan", JSON.stringify([menu]));
    },
    updateView: function (model) {
        var self = this;
        var imgIcon = '';
        if (model.hasChanged("userIcon")) {
            imgIcon = model.get("userIcon");
            if (imgIcon) {
                $("div.lazy", self.$el).data("original", constant.IMG_URL + imgIcon)
                $("div.lazy").lazyload({
                    cache: true,
                    callBack: function (path, s) {
                        s.dom.css('background-image', 'url("' + path + '")');
                        s.dom.empty();
                    }
                });
            }
        }
        if (model.hasChanged("fullName"))
            $(".ygnme", this.$el).html(model.get("fullName"));
        if (model.hasChanged("roleName"))
            $(".roleName", this.$el).html(model.get("roleName"));
        if (this.model.hasChanged("mobileNo")) {
            var phone = model.get("mobileNo");
            if (isDefine(phone)) {
                $(".bm-phonewh", this.$el).addClass("bm-phone")
            } else {
                $(".bm-phonewh", this.$el).removeClass("bm-phone")
            }
        }
        ;
    },
    dateSet: function (d) {
        var time = NYR(d, 1);
        var nyr = NYR('', 1);
        if (time == nyr) {
            var cTime = HM(d);
        } else {
            var cTime = NYR(d, 0);
        }
        return cTime;
    }
});

//列表容器VIEW
var perListView = Backbone.View.extend({//options...

    initialize: function () {
        //初始化集合与VIEW自身函数的关联
        this.listenTo(this.collection, "add", this.addView);
        this.listenTo(this.collection, "change", this.updateView);
        this.listenTo(this.collection, "remove", this.removeView);
    },
    collection: new perCollection(), //collection，用于存储和管理数据
    el: '#perList ul', //VIEW 对应 HTML 元素CSS选择器
    elTemp: $('<ul></ul>'),
    kind: "",
    addView: function (model, res) {
        var view = new perView({
            model: model,
            kind: this.kind,
            defaultData: this.defaultData
        });
        //把条目view的dom对象插入到listview DOM对象中
        this.elTemp.append(view.$el);
        var total = res.toJSON();
        //最后一条消息统一加到页面
        if (total[total.length - 1].userId == model.get("userId")) {
            this.$el.append(this.elTemp);
            $("div.lazy").lazyload({
                cache: true,
                callBack: function (path, s) {
                    s.dom.css('background-image', 'url("' + path + '")');
                    s.dom.empty();
                }
            });
        }

    },
    updateView: function (model) {
        var view = model.view;
        if (view) {
            view.updateView(model);
        }
    },
    removeView: function (model) {
        var view = model.view;
        view.remove();
    }
});

var dptView = Backbone.View.extend({//options...
    initialize: function (option) {
        //初始化VIEW并让model与VIEW进行关联
        this.model.view = this;
        //初始化VIEW的HTMLDOM对象
        this.render();
    },
    template: dptItemTemplate,
    render: function () {
        var self = this;
        if (self.template) {
            if(self.model.attributes.entityId=='0') return self;
            //使用模板+数据拼装DOM
            self.$el = $(self.template(self.model.attributes));
            self.bindingEvent(self.model);
        }
        //返回自身，便于promise调用
        return self;
    },
    bindingEvent: function (model) {
        var self = this;
        appcan.button(self.$el, "btn-act", function () {
            var dptName = model.get("dptName");
            var entityId = model.get("entityId");
            var superDptId = model.get("superDptId");
            contactDptListViewInstance.load(dptName, entityId);
            event.stopPropagation();
        })

    }
});

//列表容器VIEW
var dptListView = Backbone.View.extend({//options...

    initialize: function () {
        //初始化集合与VIEW自身函数的关联
        this.listenTo(this.collection, "add", this.addView);
        this.listenTo(this.collection, "change", this.updateView);
        this.listenTo(this.collection, "remove", this.removeView);
    },
    collection: new dptCollection(), //collection，用于存储和管理数据
    el: '#dptList ul', //VIEW 对应 HTML 元素CSS选择器
    addView: function (model) {
        var view = new dptView({
            model: model
        });
        //把条目view的dom对象插入到listview DOM对象中
        this.$el.append(view.$el);
    },
    updateView: function (model) {
        var view = model.view;
        if (view) {
            view.updateView(model);
        }
    },
    removeView: function (model) {
        var view = model.view;
        view.remove();
    }
});

var contactView = Backbone.View.extend({//options...

    initialize: function () {
    },
    service: contactsService, //collection，用于存储和管理数据
    el: '#list', //VIEW 对应 HTML 元素CSS选择器
    lock: false,
    dptName: "",
    dptId: "",
    kind: "",
    defaultData: [],
    load: function (dptName, dptId, arrName,arrId,flag) {//HTML页面调用的初始化接口，由于通讯有可能依赖APPCAN组件，因此封装此接口在appcan.ready中调用
        var self = this;
        if (flag) {
            dptName = self.dptName;
            dptId = self.dptId;
            $("#remove").addClass("uhide-serach");
            $("#my_form").val("");
        }
        if (self.lock) {
            if (dptName != self.dptName) {
                self.lock = false;
                appcan.window.closeToast();
            }
            return;
        }
        try {
            self.lock = true;
            $("#dpt").removeClass("uhide");
            $("#searchList").addClass("uhide");
            appcan.window.openToast(STR_LOADING_SHORT);
            $("#norecord").addClass("uhide");
            {
                if (!dptName) {
                    self.dptName = "";
                    self.dptId = "";                    
                    var dptId = '0'; //取最根部门
                } else {
                    self.dptName = dptName;
                    self.dptId = dptId;
                }
            }
            if(!isAndroid) flag = 1;   //ios数据缓存有时取不到。
            this.service.requestDptAndPer({
                flag: flag ? flag : 0,//是否刷新数据
                dptId: dptId,
                success: function (data) {
                    appcan.window.closeToast();
                    appcan.frame.resetBounce(0);
                    var dataDpt = data.msg.danPersonnel.list;
                    if (isDefine(dptName)) {
                        {
                            if (!$("#DPT_" + self.dptId)[0]) {
                                if(arrName != undefined && arrName != ""){
                                      for(var i = 0; i < arrName.length; i ++){
                                         var bumen = $('<div class="bg-wh rig-padd4 uc-a jj_marg1 uba tx-color1 bder-color1" data-dpt="' + arrId[i] + '" id="DPT_' + arrId[i] + '">' +arrName[i] + '</div>')
                                                             $("#zibumen").append(bumen); 
                                        appcan.button(bumen, "btn-act", function () {
                                            var eee = $(this);
                                            self.load(eee.html(), eee.data("dpt"));
                                            var next = eee.next();
                                            while (next[0]) {
                                                next.remove();
                                                next = eee.next();
                                            }
                                        });                    
                                      };
                                }else{
                                var bumen = $('<div class="bg-wh rig-padd4 uc-a jj_marg1 uba tx-color1 bder-color1" data-dpt="' + self.dptId + '" id="DPT_' + self.dptId + '">' + self.dptName + '</div>')
                                $("#zibumen").append(bumen);
                                };                      
                                $("#zibumen").scrollLeft($("#zibumen")[0].scrollWidth);
                                appcan.button(bumen, "btn-act", function () {
                                    var eee = $(this);
                                    self.load(eee.html(), eee.data("dpt"));
                                    var next = eee.next();
                                    while (next[0]) {
                                        next.remove();
                                        next = eee.next();
                                    }
                                });
                            }
                        }
                    }
                    {
                        var defaultD = JSON.parse(appcan.getLocVal("_toXzPage") || "[]");
                        var dataPer = data.msg.personnel.list;
                        dptListViewInstance.collection.set(dataDpt);
                        perListViewInstance.kind = self.kind;
                        perListViewInstance.defaultData = defaultD;
                        $("#dev").empty();
                        if (dataPer.length > 0) {
                            $("#dev").append($('<div class="paddTB2 bc-ecf ubb bder-color"></div>'));
                        }
                        perListViewInstance.collection.set(dataPer);

                    }
                    self.lock = false;
                    appcan.window.publish('personAllDepartment');
                },
                error: function (data) {
                    self.lock = false;
                    appcan.window.closeToast();
                    appcan.frame.resetBounce(0);
                    global_error(data);
                }
            })
        } catch (e) {
            self.lock = false;
            appcan.window.closeToast();
            ALERT_ERROR("contactView", "load", e.message)
        }
    }
});
//列表容器VIEW
var searchListView = Backbone.View.extend({//options...

    initialize: function () {
        this.collection = new perCollection(); //collection，用于存储和管理数据
        //初始化集合与VIEW自身函数的关联
        this.listenTo(this.collection, "add", this.addView);
        this.listenTo(this.collection, "change", this.updateView);
        this.listenTo(this.collection, "remove", this.removeView);
    },
    el: '#searchList ul', //VIEW 对应 HTML 元素CSS选择器
    kind: "",
    addView: function (model) {
        var view = new perView({
            model: model,
            kind: this.kind,
            defaultData: this.defaultData
        });
        //把条目view的dom对象插入到listview DOM对象中
        this.$el.append(view.$el);

    },
    updateView: function (model) {
        var view = model.view;
        if (view) {
            view.updateView(model);
        }
    },
    removeView: function (model) {
        var view = model.view;
        view.remove();
    },
    searchPer: function () {
        appcan.window.openToast(STR_LOADING_SHORT);
        var fullName = $("#my_form").val();
        var self = this;
        $("#dpt").addClass("uhide");
        $("#searchList").removeClass("uhide");
        this.collection.fetch({
            fullName: fullName,
            success: function (cols, resp, options) {
                appcan.window.closeToast();
                $("div.lazy").lazyload({
                    cache: true,
                    callBack: function (path, s) {
                        s.dom.css('background-image', 'url("' + path + '")');
                        s.dom.empty();
                    }
                });
                if (cols.length <= 0) {
                    $("#norecord").removeClass("uhide");
                } else {
                    $("#norecord").addClass("uhide");
                }

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
    }
});
var dptListViewInstance = new dptListView();
var perListViewInstance = new perListView();
var searchListViewInstance = new searchListView();
var contactDptListViewInstance = new contactView();
appcan.ready(function () {
    appcan.window.subscribe("DELETE_PERSON", function (result) {
        $("." + result).prop("checked", false);
    });

    appcan.window.subscribe("CHANGE_STATE_PERSON", function (result) {
        var ee = $("." + result);
        var flag = String(ee.attr("checked"));
        if (flag == "true") {
            $("." + result).prop("checked", false);
        } else {
            $("." + result).prop("checked", true);
        }

    });
})
appcan.button("#remove", "ani-act ", function () {
    //取消XX按钮
    $("#remove").addClass("uhide-serach");
    $("#my_form").val("");
    var defaultD = JSON.parse(appcan.getLocVal("_toXzPage") || "[]");
    contactDptListViewInstance.defaultData = defaultD;
    searchListViewInstance.collection.set();
    $("#dpt").removeClass("uhide");
    $("#searchList").addClass("uhide");
    $("#norecord").addClass("uhide");
})

function selectWho() {//根据条件来查询
    var defaultD = JSON.parse(appcan.getLocVal("_toXzPage") || "[]");
    searchListViewInstance.defaultData = defaultD;
    $("input").blur();
    searchListViewInstance.searchPer();
}

function OnInput() {
    var search_text = $("#my_form").val();
    if (search_text != "" || search_text.length != 0) {
        $("#remove").removeClass("uhide-serach");
    } else {
        $("#remove").addClass("uhide-serach");
        $("#my_form").val("");
    }
}