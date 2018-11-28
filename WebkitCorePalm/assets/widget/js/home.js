var TIT_CONTACT = tools.getString("TIT_CONTACT");
var TIT_MESSAGE = tools.getString("TIT_MESSAGE");
var STR_MINE = tools.getString("STR_MINE");
var STR_APPS = tools.getString("STR_APPS");
var TIT_HOME = tools.getString("TIT_HOME");

/**
 *主页界面控制对象
 */
var home = {
    /**
     *当前的浮动窗口
     */
    curContentIndex: null,
    /**
     *底部导航对象
     */
    tabView: null,
    /**
     *窗口列表
     */
    contentList: [{
        label: "<div style='width:5em'>" + TIT_HOME + "</div>",
        "icon": "home ub-img",
        isPopover: true, //是否是浮动窗口
        url: "index_content.html"
    }, {
        label: "<div style='width:5em'>" + STR_APPS + "</div>",
        "icon": "yingyong ub-img",
        isPopover: true, //是否是浮动窗口
        url: "appManage_content.html"
    },{
        label: "<div style='width:5em'>" + TIT_CONTACT + "</div>",
        "icon": "tongxunlu ub-img",
        isPopover: true, //是否是浮动窗口
        url: "contacts_content.html"
    }, {
        label: "<div style='width:5em'>" + STR_MINE + "</div>",
        "icon": "center ub-img",
        isPopover: true, //是否是浮动窗口
        url: "personCenter_content.html"
    }],
    /**
     *初始化界面
     */
    initPage: function (defIndex) {
        var self = this;
        //初始化底部导航
        self.initTab();
        //初始化事件
        self.initEvent();
        //默认触发菜单
        self.clickTabView(defIndex);
        //预加载
        
    },
    /**
     *点击tabview
     */
    clickTabView: function (curIndex) {
        $('div[data-index="' + curIndex + '"]').trigger("tap");
    },
    /**
     *初始化tab
     */
    initTab: function () {
        var self = this;
        self.tabView = appcan.tab({
            selector: "#tabview",
            hasIcon: true,
            hasAnim: false,
            hasLabel: true,
            hasBadge: true,
            index: 3,
            //复用定义的列表
            data: self.contentList
        });
    },

    /**
     *重置当前窗口位置
     */
    resizeCurrentPop: function () {
        var self = this;
        var curContentIndex = self.curContentIndex;
        var curContentName = "content" + curContentIndex;
        var titHeight = $('#header' + curContentIndex).offset().height;
        //重置当前页的高度和宽度
        appcan.window.resizePopoverByEle("content", 0, titHeight, curContentName);
    },
    countTimer: null,
    count: 0,
    /**
     *初始化事件
     */
    initEvent: function () {
        var self = this;
        window.onorientationchange = window.onresize = function () {
            self.resizeCurrentPop();
            //重置当前窗口位置
        };
        //菜单的点击事件
        self.tabView.on("click", function (obj, curIndex) {
            var userId = appcan.getLocVal('userId');
            //神策追踪菜单点击事件
            if(curIndex == 0){
                var param = {
                        event: 'platformClick',
                     propertieDict: {
                            userId:userId,
                            module:'掌上深航',
                            funcName:'掌上深航页面',
                            buttonName:'掌上深航'                               
                     }
                };
                uexSensorsAnalytics.trackWithProperties(JSON.stringify(param));
                var customListCache = appcan.getLocVal('submitAppCenterList');                
                var emmMyAppList = appcan.getLocVal('EMM-MYAPPLIST');               
                if(customListCache){
                    appcan.window.publish('MY-APP-LIST',customListCache);
                }else{
                    appcan.window.publish('MY-APP-LIST',emmMyAppList);
                };
                // 更新首页消息未阅数量
                appcan.window.publish("CHANGE_NO_READ_MESSAGE_ITEM","");
                //更新首页邮箱未阅数量
                appcan.window.publish("APP-EMAIL-NUM","");
            }else if(curIndex == 1){
                var param = {
                        event: 'platformClick',
                     propertieDict: {
                            userId:userId,
                            module:'应用中心',
                            funcName:'应用中心页面',
                            buttonName:'应用中心'                               
                     }
                };
                uexSensorsAnalytics.trackWithProperties(JSON.stringify(param));
            }else if(curIndex == 2){
                var param = {
                        event: 'platformClick',
                     propertieDict: {
                            userId:userId,
                            module:'通讯录',
                            funcName:'通讯录页面',
                            buttonName:'通讯录'                               
                     }
                };
                uexSensorsAnalytics.trackWithProperties(JSON.stringify(param));
            }else {
                var param = {
                        event: 'platformClick',
                     propertieDict: {
                            userId:userId,
                            module:'个人中心',
                            funcName:'个人中心页面',
                            buttonName:'个人中心'                               
                     }
                };
                uexSensorsAnalytics.trackWithProperties(JSON.stringify(param));
            }
            //打开对应的界面
            self.openContent(curIndex);
        });
        appcan.window.subscribe("CB_ALL_UNREAD_COUNT", function (result) {
            self.count = result;
            if (!self.countTimer) {
                var cont = parseInt(self.count);
                if (cont > 99) {
                    cont = "99+";
                }
                self.tabView.badge(0, cont);//会话显示条数
                self.countTimer = setTimeout(function () {
                    cont = parseInt(self.count);
                    if (cont > 99) {
                        cont = "99+";
                    }
                    self.tabView.badge(0, cont);//会话显示条数
                    clearTimeout(self.countTimer);
                    self.countTimer = null;
                }, 2000);
            }

        });
    },

    /**
     *打开窗口
     */
    openContent: function (curIndex) {
        var self = this;
        //缓存旧的当前页
        var oldContentIndex = self.curContentIndex;
        var oldContentName = 'content' + oldContentIndex;
        var newContentName = "content" + curIndex;
        if (newContentName == oldContentName) {
            //如果还是当前的索引，不动
            return;
        }
        //给当前页重新赋值
        self.curContentIndex = curIndex;
        var contentObj = self.contentList[curIndex];
        var oldContentObj = self.contentList[oldContentIndex];
        if (contentObj.url == "chatList_content.html") {
            appcan.window.publish("EPORTAL_MSG_LIST_READ_UPDATE", "");
        }
        if (contentObj.isPopover == false) {
            //说明不是pop页面，直接打开新窗口
            appcan.openWinWithUrl(contentObj.url, contentObj.url);
            //因为浮动窗口未变，所以但是样式改变了，要还原到上一个状态
            self.clickTabView(oldContentIndex);
            return;
        }
        //另外如果header高度为0，会出现切换回来后，头部导航被遮罩了，所以要把老的浮动窗口设置到窗口外部
        if (oldContentObj && oldContentObj.isOpen) {
            //TODO:如果旧窗口已经打开，改变旧窗口大小，位置移出到屏幕外围，因为无法通过设置底层的方法来达到目的
            appcan.window.resizePopoverByEle("content", 0, -9999, oldContentName);
        }
        //基本的处理，打开浮动窗口，设置窗口大小
        for (var i = 0; i < self.contentList.length; i++) {
            //处理头部的多个标题隐藏和显示
            if (i == curIndex) {
                $("#header" + curIndex).removeClass("uhide");
            } else {
                $("#header" + i).addClass("uhide");
            }
        }
        var titHeight = $('#header' + curIndex).offset().height;

        if (contentObj && contentObj.isOpen) {
            //如果已经打开，重置设置窗口大小
            appcan.window.resizePopoverByEle("content", 0, titHeight, newContentName);
            //把新窗口置顶
            appcan.frame.bringToFront(newContentName);
        } else {
            var extraInfo = JSON.stringify({
                "extraInfo": {
                    "opaque": "true",
                    "bgColor": "#ecf3f7",
                    "delayTime": "100"
                }
            });
            contentObj.isOpen = true;
            //执行打开
            appcan.window.preOpenStart();
            appcan.frame.open("content", contentObj.url, 0, titHeight, newContentName, "", "", extraInfo);
            appcan.window.preOpenFinish();
        }

    },
    /**
     *预加载
     */
    preOpen: function () {
        {
            try {
                var self = this;
                var firstIndex = self.curContentIndex;
                var extraInfo = JSON.stringify({
                    "extraInfo": {
                        "opaque": "true",
                        "bgColor": "#ecf3f7",
                        "delayTime": "250"
                    }
                });
                var list = self.contentList;
                for (var i in list) {
                    //排除第一个页面，只预加载其他页面
                    if (i != firstIndex) {
                        list[i].isOpen = true;
                        //执行打开
                        appcan.frame.open("content", list[i].url, 0, -9999, "content" + i, "", "", extraInfo);
                    }
                }
            } catch (e) {
                errorDetail(e);
            }
        }
    }
};