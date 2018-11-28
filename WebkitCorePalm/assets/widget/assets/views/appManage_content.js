var STR_APPS_OPEN = tools.getString("STR_APPS_OPEN");
var STR_APPS_DOWNLOAD = tools.getString("STR_APPS_DOWNLOAD");
var STR_APPS_DELETE = tools.getString("STR_APPS_DELETE");
var TIP_NOTICE = tools.getString("TIP_NOTICE");
var BTN_OK = tools.getString("BTN_OK");
var STR_STORE_NORIGHT = tools.getString("STR_STORE_NORIGHT");

//加载并初始化模板对象
var appTemplate = loadTemplate("assets/templates/appitem.tpl");
var curChatTarget = null;
var longKeyTabState = false;
var touchMove = 0;
var boutiqueAppId = [];
var appView = Backbone.View.extend({
    initialize: function (option) {
        this.model.view = this;
        this.render();
    },
    template: appTemplate, //VIEW对应的模板
    render: function () {
        var self = this;
        this.$el = $(this.template({
            data: this.model.attributes,
            setState: this.setState,
            removeTip: this.removeTip,
            checkImage: this.checkImage,
        }));
        this.bindingEvents();
        return this;
    },
    removeTip: function () {
        return STR_APPS_DELETE;
    },
    setState: function (state, type) {
        var appState = '';
        if (type == "AppCanWgt" || type == "Native") {     
           appState = state?'':'uhide';
        }
        return appState;
    },
    checkImage: function(src){
        return src?'background-image: url('+src+')':'';
    },
    bindingEvents: function () {
        var self = this;
        appcan.button($(".scroll-bar", this.$el), "", function () {
            self.conver();
        });
        appcan.button($(".scroll-right", this.$el), "", function () {
            uexAppStoreMgr.cbDeleteMyApps = function (opId, dataType, data) {
                self.model.set("state", 0);
                var width = $(".scroll-right", this.$el).width();
                $(".scroll-bar", self.$el).css("-webkit-transform", "translateX(" + 0 + "px)");
            };
            var appinfo = [];
            var info = self.model.toJSON();
            appinfo.push(info);
            uexAppStoreMgr.deleteMyApps(JSON.stringify(appinfo));
        });
        $(this.$el).on("touchstart", function () {
            curChatTarget = self;
            touchMove = 0;
        });
        $(this.$el).on("longTap", function () {
            if(isAndroid && touchMove) return;
            if(!longKeyTabState)  appcan.window.publish("APP_WORK_LONGTAB", '');
            longKeyTabState = true;
            var ele = document.getElementsByClassName('uabs-r');          
            var count = 0;
            for(var i = 0; i < ele.length; i ++){    
                (function(i){
                     if(ele[i].getAttribute('great') === 'true') {
                         count ++;
                         ele[i].classList.add('uhide');
                    } else {
                        ele[i].classList.remove('uhide');
                    }
                }(i));
            }
       
        });
        $(this.$el).on("touchend", function () {
            touchMove = 0;
        });
        $(this.$el).on("touchcancel", function () {
            touchMove = 1;
        });
        $(this.$el).on("touchmove", function () {
            touchMove = 1;
        });
    },
    swipeLeft: function () {
        if (this.isCanSwipe()) {
            var width = $(".scroll-right", this.$el).width();
            $(".scroll-bar", this.$el).css("-webkit-transform", "translateX(-" + width + "px)");
        }
    },
    swipeRight: function () {
        if (this.isCanSwipe()) {
            var width = $(".scroll-right", this.$el).width();
            $(".scroll-bar", this.$el).css("-webkit-transform", "translateX(" + 0 + "px)");
        }
    },
    isCanSwipe: function () {
        var state = this.model.get("state");
        var appCategory = this.model.get("appCategoryName") || this.model.get("appCategory");
        if ((appCategory) == "AppCanWgt" && parseInt(state) == 1) {
            return true;
        }
        return false;
    },
    updateView: function (model) {
        var self = this;
        if (this.model.hasChanged("iconLoc")) {
            var imgIcon = this.model.get("iconLoc");
            if (imgIcon) {
                $(".lazy", this.$el).data("original", imgIcon);
                $("div.lazy").lazyload({
                    cache: true
                });
            }
        }
        if (this.model.hasChanged("name")) {
            var name = this.model.get("name");
            $(".name", this.$el).html(name);
        }
        if (this.model.hasChanged("curVersion")) {
            var curVersion = this.model.get("curVersion");
            $(".curVersion", this.$el).html(curVersion);
        }
        if (this.model.hasChanged("state")) {
            var state = this.model.get("state");
            var appCategory = this.model.get("appCategoryName") || this.model.get("appCategory");
            $(".state", this.$el).html(this.setState(state, appCategory));
        }
    },
    conver: function () {
        var data = this.model.toJSON(); 
        var appId = data.appId;
        var appName = data.name;
        if(longKeyTabState){
           if(!data.greatApp){
              $('#'+data.appId).addClass('uhide'); 
            }
			if(data.greatApp){
               appAddObj[data.appId] = true;
            }
            var appAdd = appcan.getLocVal("CACHE_APPS_LIST_ADD") || '{}';
            var appAddObj = JSON.parse(appAdd); //记录添加到首页的状态；
            appAddObj[data.appId] = false;
            appcan.setLocVal("CACHE_APPS_LIST_ADD", JSON.stringify(appAddObj));
            
            uexAppStoreMgr.cbDeleteMyApps = function (opId, dataType, data) {
                if(data == 1){
                    
                }
                
            };
            var appinfo = [];
            appinfo.push(data);
            uexAppStoreMgr.deleteMyApps(JSON.stringify(appinfo));
            return;
        }
        if (!isDefine(data.serviceStatus) || data.serviceStatus == 2) {
            appcan.window.publish("START_WGT", JSON.stringify(data));
        } else {
            appcan.window.alert({
                title: TIP_NOTICE,
                content: STR_STORE_NORIGHT + "：400-040-1766",
                buttons: [BTN_OK],
                callback: function (err, data1, dataType, optId) {
                }
            });
        }
    }
});

//列表容器VIEW
var appManageView = Backbone.View.extend({//options...

    initialize: function () {
        this.collection = new appCollection();
        this.listenTo(this.collection, "add", this.add);
        this.listenTo(this.collection, "change", this.updateView);
        this.listenTo(this.collection, "remove", this.removeView);
        this.showView();
    },
    el: '#applist ul', //VIEW 对应 HTML 元素CSS选择器
    load: function () {//HTML页面调用的初始化接口，由于通讯有可能依赖APPCAN组件，因此封装此接口在appcan.ready中调用
        var self = this;
        this.collection.fetch({
            success: function (cols, resp, options) {
                appcan.frame.resetBounce(0);
                //版本更新提示
                if(!longKeyTabState){
                      UpdateVersion();
                }
                $("div.lazy").lazyload({
                });
                if (self.collection.length <= 0) {
                    $("#norecord").removeClass("uhide");
                } else {
                    $("#norecord").addClass("uhide");
                }
            },
            error: function (cols, error, options) {
                appcan.frame.resetBounce(0);
            },
            add: true,
            remove: true,
            merge: true
        });
    },
    add: function (model) {
        try {
            try{
                var appAdd = appcan.getLocVal("CACHE_APPS_LIST_ADD") || '{}';
                var appAddObj = JSON.parse(appAdd);
                if(appAdd=='{}') appAddObj[model.attributes.appId]=model.attributes.greatApp;
                if(model.attributes.greatApp) model.attributes.addState=model.attributes.greatApp;       
                model.attributes.addState = appAddObj[model.attributes.appId];
                appAdd = '';
                appAddObj = null;
            }catch(e){
            }
            
            
            var view = new appView({
                model: model
            });
            this.$el.append(view.$el);
        } catch (e) {
        }
    },
    updateView: function (model, a) {
        var view = model.view;
        if (view) {
            view.updateView(model);
        }
    },
    removeView: function (model) {
        var view = model.view;
        view.remove();
    },
    showView: function () {
        var apps = appcan.getLocVal("CACHE_APPS_LIST") || '[]';
        //获取缓存中从应用列表添加的应用
        var appAdd = appcan.getLocVal("CACHE_APPS_LIST_ADD") || '{}'; 
        var appIdArr = [];
        // 上一次精品应用列表
        var GREAT_APP_COUNT = parseInt(appcan.getLocVal('GREAT_APP_COUNT')) || 1;
        var minus = 1;
        // 设置第一个精品应用列表只存一次
        var locValOnce = appcan.getLocVal('locValOnce') || false;  
        
        if (apps != '[]') {
            try {
                apps = JSON.parse(apps);
                var appAddObj = JSON.parse(appAdd) || {} ; //记录添加到首页的状态；
                var showArr = [];               
                for (var k in appAddObj) {                 
                    appIdArr.push(k);
                }           
                for (var i in apps) {
                    
                    var obj = apps[i];
                    
                    if (appAdd == '{}') {
                        appAddObj[obj.appId] = obj.greatApp;
                    }
                    var boutiqueAppIdPrev = JSON.parse(appcan.getLocVal('boutiqueAppIdPrev' + (GREAT_APP_COUNT - minus))) || boutiqueAppId;
                    for (var m in appAddObj) {          
                        if (obj.appId === m) {
                            // 新增精品应用
                            if (boutiqueAppId.indexOf(m) > -1) {
                                appAddObj[obj.appId] = true;               
                            }// 移除精品应用  && if( )
                            else if (boutiqueAppId.indexOf(m) == -1 && boutiqueAppIdPrev.indexOf(m) > -1) {
                                appAddObj[obj.appId] = false;
                                
                            } else {
                            }
                        }
                    }        
                    appcan.locStorage.remove("APPID");
                    obj.addState = appAddObj[obj.appId];
                    showArr.push(obj);
                } 
                appcan.setLocVal("CACHE_APPS_LIST_ADD", JSON.stringify(appAddObj));
                this.collection.set(showArr);
            } catch (e) {
                
            }
        }
    }
});

var appManageViewInstance = new appManageView();

appcan.ready(function () {
    appManageViewInstance.load();
    try {
        var param = {
            isSupport: true
        };
        uexWindow.setIsSupportSwipeCallback(JSON.stringify(param));
    } catch (e) {
    }
    appcan.frame.setBounce([0], null, null, function (type) {
        if (type == 0) {//下拉刷新
            appManageViewInstance.load();
        } else {
            appcan.frame.resetBounce(type);
        }
    });
  
    appcan.window.swipeLeft(function () {
        curChatTarget && curChatTarget.swipeLeft();
        curChatTarget = null;
    });
    appcan.window.swipeRight(function () {
        curChatTarget && curChatTarget.swipeRight();
        curChatTarget = null;
    });

    /**
     * 接收更新子应用状态广播
     */
    appcan.window.subscribe("UPDATE_CHILD_APP_STATUS", function () {
       
        appManageViewInstance.load();
       
    });
    appcan.window.subscribe("APP_WORK_LONGTAB_CANCEL", function() {
        longKeyTabState = false;
        $('.uabs-r').addClass('uhide');
    });
});

// 判断两个数组是否相等
function equals(arr1, arr2) {
    // 长度不相等
    if (arr1.length != arr2.length)
        return false;
    var isEquals = true;
    arr2.forEach(function(ele) {
        if (arr1.indexOf(ele) === -1) {
            isEquals = false;
            return false;
        } else {
            arr1.splice(arr1.indexOf(ele), 1);
        }
    });
    return isEquals;
}
