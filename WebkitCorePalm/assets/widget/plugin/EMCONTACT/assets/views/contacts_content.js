var STR_LOADING_SHORT = tools.getString("STR_LOADING_SHORT");

//加载并初始化模板对象
var contactItemTemplate = loadTemplate("assets/templates/contactItem_content.tpl");
var contactItemRadioTemplate = loadTemplate("assets/templates/contactItemRadio_content.tpl");
var contactItemCheckBoxTemplate = loadTemplate("assets/templates/contactItemCheckBox_content.tpl");
var contactView = Backbone.View.extend({//options...
    initialize: function (option) {
        //初始化VIEW并让model与VIEW进行关联
        this.model.view = this;
        this.kind = option.kind;
        this.defaultData = option.defaultData;
        var userId = this.model.get("userId");
        if (userId) {
            this.model.on("change", function () {
                appcan.setLocVal("CACHE_USERINFO_" + userId.toUpperCase(), JSON.stringify(this.toJSON()))
            })
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
                isOneself : function(id) {
                    if (userID == id) {
                        return "";
                    }
                    return "bm-xxduihua";
                },
                setIcon: function (icon) {
                    if (icon)
                        return 'lazy" data-original="' + constant.IMG_URL + icon;
                    return "";
                }, setCheck: function (userId, fullName) {
                    for (var i in self.defaultData) {
                        if (self.defaultData[i].userId == userId || self.defaultData[i].fullName == fullName)
                            return "checked";
                    }
                    if (contactListViewInstance && contactListViewInstance.defaultIM)
                        for (var i in contactListViewInstance.defaultIM) {
                            if (contactListViewInstance.defaultIM[i] == userId.toLowerCase())
                                return "checked disabled";
                        }
                    return '';
                }
            }));
            self.bindingEvent(self.model);
            $("div.lazy").lazyload({
                cache: true
            });
        }
        //返回自身，便于promise调用
        return self;
    },
    bindingEvent: function (model) {
        var self = this;
        switch (self.kind) {
            case "radio": {
                appcan.button(self.$el, "btn-act", function () {
                    if ($(this).hasClass("hyxq"))return;
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
            }
                break;
            case "checkbox": {
                $('input', self.$el).click(function (e) {
                    if ($(this).hasClass("hyxq"))return;
                    e.stopPropagation();
                    var isDisabled = String($(this).attr("disabled"));
                    if (isDisabled == "false") {
                        self.setData(self.model);
                    }
                })
                self.$el.click(function (e) {
                    if ($(this).hasClass("hyxq"))return;
                    var isDisabled = String($(this).find("input").attr("disabled"));
                    if (isDisabled == "true")return;
                    var flag = String($(this).find("input").attr("checked"));
                    if (flag == 'false') {
                        $(this).find("input").prop("checked", true);
                    } else {
                        $(this).find("input").prop("checked", false);
                    }
                    self.setData(self.model);
                })
            }
                break;
            default: {
                appcan.button($("#bm-phone", self.$el), "btn-act", function () {
                    var telnum = model.get("mobileNo");
                    if(telnum.length>11){
                        var arr = telnum.match(/\d+(\.\d+)?/g);
                        uexWindow.actionSheet({
                           title:"请选择要拨打的手机号码",
                           cancel:"取消",
                           buttons:JSON.stringify(arr),
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
            if(telnum.length>11){
                var arr = telnum.match(/\d+(\.\d+)?/g);
                uexWindow.actionSheet({
                   title:"请选择要发消息的手机号码",
                   cancel:"取消",
                   buttons:JSON.stringify(arr),
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
    updateView: function (model) {
        var self = this;
        var imgIcon = '';
        if (model.hasChanged("userIcon")) {
            imgIcon = model.get("userIcon");
            if (imgIcon) {
                $("div.lazy", self.$el).data("original", constant.IMG_URL + imgIcon)
                $("div.lazy").lazyload({
                    cache: true
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
        appcan.window.publish("CHANGE_STATE_PERSON", fullName);
        appcan.window.publish("gsbumenfuxuan", JSON.stringify([menu]));
    }

});

//列表容器VIEW
var contactListView = Backbone.View.extend({//options...

    initialize: function () {
        //初始化集合与VIEW自身函数的关联
        this.listenTo(this.collection, "add", this.addView);
        this.listenTo(this.collection, "change", this.updateView);
        this.listenTo(this.collection, "remove", this.removeView);
    },
    collection: new perCollection(), //collection，用于存储和管理数据
    el: '#contactlist ul', //VIEW 对应 HTML 元素CSS选择器
    pageNo: 1,
    kind: "",
    load: function (dptId) {//HTML页面调用的初始化接口，由于通讯有可能依赖APPCAN组件，因此封装此接口在appcan.ready中调用
        appcan.window.openToast(STR_LOADING_SHORT);
        if (!dptId) {
            var dptId = appcan.getLocVal(storeKey.SUPERDPT_ID);
        }
        this.collection.fetch({
            dptId: dptId,
            success: function (cols, resp, options) {
                appcan.window.closeToast();
                appcan.frame.resetBounce(0);
                $("div.lazy").lazyload({
                    cache: true
                });
                if (cols.length <= 0) {
                    $("#norecord").removeClass("uhide");
                } else {
                    self.pageNo++;
                    $("#norecord").addClass("uhide");
                }
            },
            error: function (cols, error, options) {
                appcan.window.closeToast();
                appcan.frame.resetBounce(0);
                switch (error.status) {
                    default:
                        global_error(error);
                        break;
                }
            },
            add: true,
            remove: true,
            merge: true
        });
    },
    searchPer: function () {
        appcan.window.openToast(STR_LOADING_SHORT);
        var fullName = $("#my_form").val();
        var self = this;
        this.collection.fetch({
            fullName: fullName,
            success: function (cols, resp, options) {
                appcan.window.closeToast();
                appcan.frame.resetBounce(0);
                self.stateChange();
                $("div.lazy").lazyload({
                    cache: true
                });
                if (cols.length <= 0) {
                    $("#norecord").removeClass("uhide");
                } else {
                    $("#norecord").addClass("uhide");
                }

            },
            error: function (cols, error, options) {
                appcan.window.closeToast();
                appcan.frame.resetBounce(0);
                switch (error.status) {
                    default:
                        global_error(error);
                        break;
                }
            },
            add: true,
            remove: true,
            merge: true
        });
    },
    addView: function (model) {
        //collection中每加入一条数据都会被调用，用于创建新的商品view
        var view = new contactView({
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
    }, stateChange: function () {
        var isAll = true;
        var input = this.$el.find("input");
        $.each(input, function (index, item) {
            if (!item.checked) {
                isAll = false;
            }
        })
        isAll == true && $(".check2").removeClass("uhide") && $(".check1").addClass("uhide");
    }

});

var contactListViewInstance = new contactListView();

appcan.button("#remove", "ani-act ", function () {
    //取消XX按钮
    $("#remove").addClass("uhide-serach");
    $("#my_form").val("");
    var defaultD = JSON.parse(appcan.getLocVal("_toXzPage") || "[]");
    contactListViewInstance.defaultData = defaultD;
    contactListViewInstance.load();
})

function selectWho() {//根据条件来查询
    var defaultD = JSON.parse(appcan.getLocVal("_toXzPage") || "[]");
    contactListViewInstance.defaultData = defaultD;
    $("input").blur();
    contactListViewInstance.searchPer();
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
function setDataDOM(item) {
    var userId = $(item).data("id");
    var fullName = item.id;
    var userIcon = $(item).data("icon");
    var menu = {
        "userId": userId,
        "fullName": fullName,
        "userIcon": userIcon
    };
    appcan.window.publish("CHANGE_STATE_PERSON", fullName);
    appcan.window.publish("gsbumenfuxuan", JSON.stringify([menu]));
}

function changeState() {

    var input = $("#contactlist").find("input");
    var isTure = $(".check2").hasClass("uhide");
    if (isTure) {
        $(".check2").removeClass("uhide");
        $(".check1").addClass("uhide");
    } else {
        $(".check1").removeClass("uhide");
        $(".check2").addClass("uhide");
    }
    $.each(input, function (index, item) {
        var isDisabled = item.disabled;
        if (!isDisabled) {
            if (isTure && !item.checked) {
                item.checked = true;
                setDataDOM(item);
            }
            if (!isTure && item.checked) {
                item.checked = false;
                setDataDOM(item);
            }
        }

    })
}