//TODO 按钮点击事件保护
//发现一个问题，点击保护之后，touch事件还是传了出去
var isButtonOnClick = true;//按钮是否可以被点击
var ONCLICK_ANIMATION_PROTECTION_TIMES = 1000;//按钮点击保护时间

//加载并初始化模板对象
var msgTemplate = loadTemplate("assets/templates/msgitem.tpl");
var elClickView = null;
var msgView = Backbone.View.extend({//options...
    initialize: function (option) {
        this.model.view = this;
        this.render();
    },
    template: msgTemplate, //VIEW对应的模板
    render: function () {
        var self = this;
        this.$el = $(this.template({data: this.model.attributes, dateSet: self.dateSet, countSize: self.countSize}));
        this.bindingEvents();
        return this;
    },
    bindingEvents: function () {
        var self = this;
        appcan.button(this.$el, "btn-act", function () {
            //这里因为快速点击会出现一些问题,所以需要在时间上做一个保护
            if (!isButtonOnClick) {
                return;
            }
            isButtonOnClick = false;
            setTimeout(function () {
                isButtonOnClick = true;//重置点击标志
            }, ONCLICK_ANIMATION_PROTECTION_TIMES);//按钮点击保护时间

            
            self.conver();
        })
    },
    countSize: function (count) {
        if (count && parseInt(count) > 99) {
            return '99+';
        }
        return count;
    },
    updateView: function (model, isShow) {
        var self = this;
        var total = (model.get("total"));
        var title = (model.get("title"));
        var createdAt = (model.get("createdAt"));
        $(".createdAt", self.$el).html(self.dateSet(createdAt));
        $(".title", self.$el).html(title);
        var unreadDom = $(".total", self.$el);
        isShow ? unreadDom.parent().removeClass("uhide") : unreadDom.parent().addClass("uhide");
    },
    conver: function () {
       
        var self = this;
        var info = self.model.get("url");
        elClickView = self;
        var unreadDom = $(".total", elClickView.$el);
        unreadDom.parent().addClass("uhide");
        var header = self.model.get("header");
        var total = self.model.get("total");
        if (parseInt(total) > 0) {
            var createdAt = self.model.get("createdAt");
            appcan.setLocVal(header, createdAt + '');
        }
        elClickView = null;
        
        if (info.action == 'openwindow') {
           
            appcan.window.open("remindwindow", "todo/" + info.param.data, 10);
            
        }
        else {
           
            appcan.window.publish("EPORTAL_LOAD_APP", JSON.stringify(info));
        }
        
    },
    dateSet: function (d) {
        var d = (d + '').replace(/-/g, '/');
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
var msgListView = Backbone.View.extend({//options...

    initialize: function () {
        this.listenTo(this.collection, "add", this.add);
        this.listenTo(this.collection, "change", this.updateView);
        this.listenTo(this.collection, "remove", this.removeView);
    },
    collection: new msgCollection(), //collection，用于存储和管理数据
    el: '#msgList ul', //VIEW 对应 HTML 元素CSS选择器
    load: function () {//HTML页面调用的初始化接口，由于通讯有可能依赖APPCAN组件，因此封装此接口在appcan.ready中调用
        var self = this;
        var param = {
            "tenantId": self.tenantId ? self.tenantId : "611",
        };
        param.accessToken = self.accessToken;
        self.doList(param, self.appList, 0);
    },
    add: function (model) {
        var header = model.get("header");
        var total = model.get("total");
        var createdAt = model.get("createdAt");
        var num = appcan.getLocVal(header);
        var isShow = false;
        if (Number(total) && (!num || (num) < (createdAt))) {
            isShow = true;
        }
        model.set({isShow: isShow}, {silent: true});
        var view = new msgView({
            model: model
        });
        this.$el.prepend(view.$el);
    },
    updateView: function (model, a) {
        var header = model.get("header");
        var total = model.get("total");
        var createdAt = model.get("createdAt");
        var num = appcan.getLocVal(header);
        var isShow = false;
        if (Number(total) && ( !num || (num) < (createdAt))) {
            isShow = true;
        }
        var view = model.view;
        if (view) {
            view.updateView(model, isShow);
        }

    },
    removeView: function (model) {
        var header = model.get("header");
        var total = model.get("total");
        appcan.setLocVal(header, 0);
        var view = model.view;
        view.remove();
    }, doList: function (param, appList, i) {
        if (i >= appList.length) {
            return;
        }
        var self = this;
        if (!isDefine(appList[i].serviceStatus) || appList[i].serviceStatus == 2) {
            if (saasUrl) {
                var tenant = appcan.getLocVal(storeKeys.TENTANTCOUNT);
                var url = saasUrl + tenant.toLowerCase() + '/' + appList[i].appId.toLowerCase() + "/emoa/message"
            } else {
                var url = loginUrl;
            }
        } else {
            self.doList(param, appList, i += 1);
            return;
        }
        this.collection.fetch({
            param: param,
            url: url,
            success: function (cols, resp, options) {
                appcan.frame.resetBounce(0);
                $("div.lazy").lazyload({
                    cache: true
                });
                self.doList(param, appList, i += 1);
            },
            error: function (cols, error, options) {
                appcan.frame.resetBounce(0);
                self.doList(param, appList, i += 1);
            },
            add: true,
            remove: true,
            merge: true
        });
    }
});

var msgListViewInstance = new msgListView();
var emmToken = JSON.parse(appcan.getLocVal("emmToken"));
try {
    msgListViewInstance.tenantId = emmToken.info.tenantId || '611';
    msgListViewInstance.accessToken = emmToken.info.accessToken;
    msgListViewInstance.appList = emmToken.info.appList ? emmToken.info.appList : [];
} catch (E) {
    msgListViewInstance.appList = [];
}
appcan.ready(function () {
    appcan.window.subscribe("EPORTAL_MSG_LIST_READ_UPDATE", function (result) {
        emmToken = JSON.parse(appcan.getLocVal("emmToken"));
        try {
            msgListViewInstance.tenantId = emmToken.info.tenantId || '611';
            msgListViewInstance.accessToken = emmToken.info.accessToken;
            msgListViewInstance.appList = emmToken.info.appList ? emmToken.info.appList : [];
        } catch (E) {
            msgListViewInstance.appList = [];
        }
        msgListViewInstance.load();
    })
});

