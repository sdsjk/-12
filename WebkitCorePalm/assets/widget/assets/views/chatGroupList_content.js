var STR_CONTACTS_QUIT_GROUP = tools.getString("STR_CONTACTS_QUIT_GROUP");
var STR_LOCATION = tools.getString("STR_LOCATION");
var STR_NO_MORE_DATA = tools.getString("STR_NO_MORE_DATA");

//加载并初始化模板对象
var chatGroupTemplate = loadTemplate("../assets/templates/chatGroupitem.tpl");
curChatTarget = null;
var chatGroupView = Backbone.View.extend({//options...
    initialize : function(option) {
        this.model.view = this;
        this.render();
    },
    template : chatGroupTemplate, //VIEW对应的模板
    render : function() {
        var self = this;
        this.$el = $(this.template({
            data: this.model.attributes,
            dealContent: self.dealContent,
            quitGroupStr: self.quitGroupStr,
        }));
        this.bindingEvents();
        return this;
    },
    bindingEvents : function() {
        var self = this;
        appcan.button($(".scroll-bar", this.$el), "", function() {
            self.conver();
        })
        appcan.button($(".scroll-right", this.$el), "", function() {
            var groupname = self.model.get("groupname");
            var groupid = self.model.get("groupid");
            appcan.setLocVal("DELgroupid" , groupid);
            var param = {
                groupName:groupname
            };
            var params = JSON.stringify(param);
            uexIM.leaveChatGroup(params);
        })
        $(this.$el).on("touchstart", function() {
            curChatTarget = self;
        })
    },
    dealContent: function (cont) {
        if (cont.indexOf("locationhttp") == 0)
            return "[" + STR_LOCATION + "]";
        return cont;
    },
    //模板中填充'退群'字段
    quitGroupStr: function () {
        return STR_CONTACTS_QUIT_GROUP;
    },
    swipeLeft : function() {
        var width = $(".scroll-right", this.$el).width();
        $(".scroll-bar", this.$el).css("-webkit-transform", "translateX(-" + width + "px)");
    },
    swipeRight : function() {
        var width = $(".scroll-right", this.$el).width();
        $(".scroll-bar", this.$el).css("-webkit-transform", "translateX(" + 0 + "px)");
    },
    updateView : function(model) {
        var self = this;
        $(".name", self.$el).html(this.model.get("name"));
        $(".message", self.$el).html(this.model.get("message"));
    },
    conver : function() {
        try {
            var groupDes = this.model.get("name");
            var groupId = this.model.get("groupname");
            var groupObjId = this.model.get("groupid");
            appcan.setLocVal("groupObjIds",groupObjId);
            appcan.setLocVal("groupDes",groupDes);
            appcan.setLocVal("groupName",groupId);
            uexWidget.startWidget("IM","10","","huihuaqunliao.html","300");
        } catch(e) {
            errorDetail(e);
        }
    }
});

//列表容器VIEW
var chatGroupListView = Backbone.View.extend({//options...
    initialize : function() {
        this.listenTo(this.collection, "add", this.add);
        this.listenTo(this.collection, "change", this.updateView);
        this.listenTo(this.collection, "remove", this.removeView);
    },
    collection : new chatGroupCollection(), //collection，用于存储和管理数据
    el : '#datalist ul', //VIEW 对应 HTML 元素CSS选择器
    pageNo : 1,
    load : function(type) {//HTML页面调用的初始化接口，由于通讯有可能依赖APPCAN组件，因此封装此接口在appcan.ready中调用
        var self = this;
        if(parseInt(type)==0){
            self.pageNo=1;
        }
        var param = {
            page:self.pageNo,  
            count:10000
        }
        this.collection.fetch({
            params:param,
            success : function(cols, resp, options) {
                if(type == 0){
                    if (cols.length <= 0) {
                        $("#norecord").removeClass("uhide");
                    } else {
                        self.pageNo++;
                        $("#norecord").addClass("uhide");
                    }
                }else{
                    if (resp.length <= 0) {
                        appcan.window.openToast(STR_NO_MORE_DATA, 1500, 5);
                    } else {
                        self.pageNo++;
                    }
                }
                setTimeout(function () {
                        appcan.frame.resetBounce(type);
                    }, 100);
            },
            error : function(cols, error, options) {
                appcan.frame.resetBounce(type);
            },
            add:true,
            remove:(type==0)?true:false,
            merge:true
        });
    },
    add : function(model) {
        try {
            var view = new chatGroupView({
                model : model
            });

            this.$el.prepend(view.$el);
        } catch(e) {
            errorDetail(e);
        }
    },
     updateView : function(model, a) {
         var view = model.view;
         if (view) {
             view.updateView(model);
         }
     },
    removeView : function(model) {
        var view = model.view;
        view.remove();
        if(this.collection.length==0){
            $("#norecord").removeClass("uhide");
        }
    }
});

var chatGroupListViewInstance = new chatGroupListView();

appcan.ready(function(){
    try{
        var param = {
            isSupport:true
        };
        uexWindow.setIsSupportSwipeCallback(JSON.stringify(param));
    }catch(e){}
    appcan.window.swipeLeft(function(){
        curChatTarget && curChatTarget.swipeLeft();
        curChatTarget = null;
    })
    appcan.window.swipeRight(function(){
        curChatTarget && curChatTarget.swipeRight();
        curChatTarget = null;
    })
})
