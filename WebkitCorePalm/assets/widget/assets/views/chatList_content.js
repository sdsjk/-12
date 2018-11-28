var STR_LOCATION = tools.getString("STR_LOCATION");
var STR_APPS_DELETE = tools.getString("STR_APPS_DELETE");
var STR_DELETE_SUCCESS = tools.getString("STR_DELETE_SUCCESS");
var STR_NETWORDERROR = tools.getString("STR_NETWORDERROR");

//加载并初始化模板对象
var chatTemplate = loadTemplate("assets/templates/chatitem.tpl");
var curChatTarget = null;
var deleteId = '';
var chatView = Backbone.View.extend({//options...
    initialize: function (option) {
        if (this.model.get("chatType") == 1) {
            this.userModel = new userInfoModel({}, {
                userId: this.model.get("imId")
            });
        }
        this.model.view = this;
        this.render();
        if (this.model.get("chatType") == 1) {
            this.updateUserInfo();
            this.listenTo(this.userModel, "change", this.updateUserInfo);
        }
    },
    template: chatTemplate, //VIEW对应的模板
    render: function () {
        var self = this;
        this.$el = $(this.template({
            data: this.model.attributes,
            dateSet: self.dateSet,
            dealIconChat: self.dealIconChat,
            countSize: self.countSize,
            dealContent: self.dealContent,
            deleteButtonStr: self.deleteButtonStr,
        }));
        this.bindingEvents();
        return this;
    },
    countSize: function (count) {
        if (count && parseInt(count) > 99) {
            return '99+';
        }
        return count;
    },
    dealContent: function (cont) {
        if (cont.indexOf("locationhttp") == 0)
            return "[" + STR_LOCATION + "]";
        return cont;
    },
    dealIconChat: function (chatType) {
        if (Number(chatType) == 1) {
            return 'lazy';
        }
        return "";
    },
    deleteButtonStr: function () {
        return STR_APPS_DELETE;
    },
    bindingEvents: function () {
        var self = this;
        appcan.button($(".wrapper", this.$el), "btn-act", function () {
           
            self.conver();
        });
        appcan.button($(".scroll-right", this.$el), "", function () {
            var chatType = self.model.get("chatType");
            var imId = self.model.get("imId");
            deleteId = imId;
            if (parseInt(chatType) == 1) {//1 单聊
                var param = {
                    imId: imId.toLowerCase()
                };
                var params = JSON.stringify(param);
                uexIM.deleteUserChatRecord(params);
            } else {
                var param = {
                    groupName: imId
                };
                var params = JSON.stringify(param);
                uexIM.deleteChatGroupRecord(params);
            }
        });
        $(this.$el).on("touchstart", function () {
           
            curChatTarget = self;
        });
        $(this.$el).on("touchend", function () {
            
        });
    },
    swipeLeft: function () {
        try {
            var width = $(".scroll-right", this.$el).width();
            $(".scroll-bar", this.$el).css("-webkit-transform", "translateX(-" + width + "px)");
        } catch (e) {
            errorDetail(e)
        }
    },
    swipeRight: function () {
        var width = $(".scroll-right", this.$el).width();
        $(".scroll-bar", this.$el).css("-webkit-transform", "translateX(" + 0 + "px)");
    },
    updateView: function (model) {
        var self = this;
        try {
            var chatType = Number(model.get("chatType"));
            var timestamp = (model.get("timestamp"));
            var content = (model.get("content"));
            var unreadCount = (model.get("unreadCount"));

            if (chatType == 2)
                $(".fullName", self.$el).html(model.get("groupDes"));
            else {
                $(".fullName", self.$el).html(self.userModel.get("fullName"));
            }
            $(".timestamp", self.$el).html(self.dateSet(timestamp));
            $(".content", self.$el).html(self.dealContent(content));
            var unreadDom = $(".unreadCount", self.$el);
            if (unreadCount && parseInt(unreadCount) > 99) {
                unreadCount = "99+";
            }
            unreadCount ? unreadDom.html(unreadCount).parent().removeClass("uhide") : unreadDom.parent().addClass("uhide");
            if (chatType == 1) {
                var icon = self.userModel.get("userIcon");
                if (icon) {
                    $("div.lazy", self.$el).data("original", constant.IMG_URL + icon);
                    $("div.lazy", self.$el).lazyload({
                        cache: true,
                        callBack: function (path, s) {
                            s.dom.css('background-image', 'url("' + path + '")');
                            if (s.dom.children().length > 1)
                                s.dom.children().last().first().empty();
                        }
                    });
                }
            }
        } catch (e) {
            errorDetail(e);
        }
    },
    loadUserInfo: function () {
        var self = this;
        self.userModel.fetch({
            success: function (cols, resp, options) {
                self.updateUserInfo();
            },
            error: function (cols, error, options) {
            },
            staffId: self.model.get("imId")
        });
    },
    updateUserInfo: function () {
        var self = this;
        try {

            if (this.model.get("chatType") == 1) {
                self.setUserIcon();
                $(".fullName", self.$el).html(self.userModel.get("fullName"));
            }
        } catch (e) {
        }
    },
    setUserIcon: function () {
        try {
            var self = this;
            var icon = self.userModel.get("userIcon");
            var fullName = self.userModel.get("fullName");
            var lastNameStr = '';
            var lastName = fullName.substring((fullName.length) - 1, fullName.length);
            var lastNameSP = shouPin.getCamelChars(lastName);
            lastNameStr = '<div style="text-align:center;color:#ffffff;">' + lastName + '</div>';
            $('div.lazy', self.$el).css("background-color", generateColor(lastNameSP));
            $('div.lazy', self.$el).children().last().first().html(lastNameStr);
            if (icon) {
                $("div.lazy", self.$el).data("original", constant.IMG_URL + icon)
                $("div.lazy", self.$el).lazyload({
                    cache: true,
                    callBack: function (path, s) {
                        s.dom.css('background-image', 'url("' + path + '")');
                        if (s.dom.children().length > 1)
                            s.dom.children().last().first().empty();
                    }
                });
            }
        } catch (e) {
        }
    },
    conver: function () {
        try {
           
            var self = this;
            var chatType = Number(this.model.get("chatType"));
            if (chatType == 1) {//单聊
                var conName = (chatType == 1 ? this.userModel.get("fullName") : this.model.get("groupDes"));
                var lastMsg = this.model.get("content");
                var unreadDom = $(".unreadCount", this.$el);
                unreadDom.html("0").parent().addClass("uhide");
                var params = {
                    imId: this.model.get("imId").toLowerCase(),
                    type: "all"
                };
                var params1 = JSON.stringify(params);
                appcan.setLocVal("yghao", this.model.get("imId").toLowerCase());
                appcan.setLocVal("contactsName", conName);
                appcan.setLocVal("lastMsg", lastMsg);
                appcan.setLocVal("conImg", this.userModel.get("userIcon"));
                uexWidget.startWidget("IM", "10", "", "huihuadanliao1.html", "300");
                uexIM.setMarkMsgRead(params1);
            } else {
                var groupDes = (chatType == 1 ? this.userModel.get("fullName") : this.model.get("groupDes"));
                var unreadDom = $(".unreadCount", this.$el);
                unreadDom.html("0").parent().addClass("uhide");
                var params = {
                    groupName: this.model.get("imId").toLowerCase(),
                    type: "all"
                };
                var params1 = JSON.stringify(params);
                appcan.setLocVal("groupObjIds", "");
                appcan.setLocVal("groupName", this.model.get("imId"));
                appcan.setLocVal("groupDes", groupDes);
                uexWidget.startWidget("IM", "10", "", "huihuaqunliao.html", "300");
                uexIM.setMarkGroupMsgRead(params1);
            }
            self.swipeRight();
        } catch (e) {
            errorDetail(e);
        }
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
var chatListView = Backbone.View.extend({//options...

    initialize: function () {
        this.listenTo(this.collection, "add", this.add);
        this.listenTo(this.collection, 'sort', this.sort);
        this.listenTo(this.collection, "change", this.updateView);
        this.listenTo(this.collection, "remove", this.removeView);
    },
    collection: new chatCollection(), //collection，用于存储和管理数据
    el: '#chatlist ul', //VIEW 对应 HTML 元素CSS选择器
    load: function (f) {//HTML页面调用的初始化接口，由于通讯有可能依赖APPCAN组件，因此封装此接口在appcan.ready中调用
        var self = this;
        this.collection.fetch({
            success: function (cols, resp, options) {
                $('.fullName').each(function (index, item) {
                    var curEle = $(item);
                    if (curEle.html == "　") {
                        self.collection.get($(item).data("imid")).view.loadUserInfo();
                    }
                });
                $("div.lazy").lazyload({
                    cache: true,
                    callBack: function (path, s) {
                        s.dom.css('background-image', 'url("' + path + '")');
                        if (s.dom.children().length > 1)
                            s.dom.children().last().first().empty();
                    }
                });
                if(!f)
                appcan.frame.resetBounce(0);
                if (self.collection.length <= 0) {
                    $("#norecord").removeClass("uhide");
                } else {
                    $("#norecord").addClass("uhide");
                }
            },
            error: function (cols, error, options) {
                if(!f)
                appcan.frame.resetBounce(0);
            },
            add: true,
            remove: true,
            merge: true
        });
    },
    add: function (model) {
        try {
            model.set("unreadCount", model.get("unreadCount") || 0);
            var view = new chatView({
                model: model
            });
            this.$el.prepend(view.$el);
            if (model.get("chatType") == 1)
                view.loadUserInfo();
        } catch (e) {
            errorDetail(e);
        }
    },
    updateView: function (model, a) {
        var view = model.view;
        if (view) {
            if (model.hasChanged("content")) {
                this.$el.prepend(view.$el);
            }
            view.updateView(model);
        }
    },
    sort: function () {
        //按照collection中的数据顺序，变更model相关view在listview中的排序
        for (var i = 0; i < this.collection.length; i++) {
            var model = this.collection.models[i];
            if (model.view) {
                this.$el.prepend(model.view.$el);
            }
        }
    },
    removeView: function (model) {
        var view = model.view;
        view.remove();
    }
});

var chatListViewInstance = new chatListView();

appcan.ready(function () {
    try {
        var param = {
            isSupport: true
        };
        uexWindow.setIsSupportSwipeCallback(JSON.stringify(param));
    } catch (e) {
    }
    appcan.window.subscribe("CB_DEL_RECORD", function (result) {
        if (result == 1) {
            appcan.window.openToast(STR_DELETE_SUCCESS, 1500, 5);
            uexIM.getUserAndGroupAllMsgUnreadCount();
            if (deleteId) {
                var col = chatListViewInstance.collection;
                col.remove(col.get(deleteId));
                deleteId = '';
            }
        } else {
            appcan.window.openToast(STR_NETWORDERROR, 1500, 5);
        }
    });
    //当人员头像变更，更换头像
    appcan.window.subscribe("IM_USER_ICON_CHANGE", function (m) {
        var user = JSON.parse(m);
        var userId = user.userId;
        var userIcon = user.userIcon;
        if (!isDefine(userIcon)) {
            userIcon = '';
        }
        var curmodel = chatListViewInstance.collection.get(userId);
        if (curmodel) {
            curmodel.view.userModel.set({"userIcon": userIcon}, {silent: true});
            curmodel.view.setUserIcon();
        }
    });

    appcan.window.subscribe("E_XMPP_ZUMSG", function (aa) {
        
        chatListViewInstance.load(1);
    });
    appcan.window.subscribe("E_XMPP_NEWMSG", function (list) {
        
        chatListViewInstance.load(1);
    });
    appcan.window.subscribe("E_XMPP_SHUXINMSG", function (list) {
        
        chatListViewInstance.load(1);
    });
    appcan.window.subscribe("E_XMPP_NEWMSGCOMING", function (param) {
        
        chatListViewInstance.load(1);
    });
    appcan.window.subscribe("CB_LEAVE_CHATGROUP", function (result) {
        chatListViewInstance.load(1);
    });
    appcan.window.swipeLeft(function () {
       
        curChatTarget && curChatTarget.swipeLeft();
        curChatTarget = null;
    });
    appcan.window.swipeRight(function () {
        
        curChatTarget && curChatTarget.swipeRight();
        curChatTarget = null;
    });
    appcan.window.subscribe("E_XMPP_LOGIN_RES", function (result) {
        if (result == 0) {
            chatListViewInstance.load(1);
        }
    });
});

