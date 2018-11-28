var STR_LOADING = tools.getString("STR_LOADING");

//加载并初始化模板对象
// loadTemplate 是global.js里面封装好的处理模板文件的函数
var contactItemTemplate = loadTemplate("assets/templates/contactItem_content.tpl");
var contactView = Backbone.View.extend({//options...
    // initalize 初始化函数 创建视图时 会立即被调用
    initialize: function (option) {
        //初始化VIEW并让model与VIEW进行关联
        this.model.view = this;
        //初始化VIEW的HTMLDOM对象
        this.render();
        // 获取缓存中的用户名 login.js
        var userId = this.model.get("userId");
        if (userId) {
            // 监听change事件 用户上传头像时所做的操作 
            this.model.on("change", function () {
                appcan.setLocVal("CACHE_USERINFO_" + userId.toUpperCase(), JSON.stringify(this.toJSON()));
                localStorage.setItem("CACHE_USERINFO_" + userId.toUpperCase(), JSON.stringify(this.toJSON()));
                if (this.hasChanged("userIcon")) {
                    appcan.window.publish("IM_USER_ICON_CHANGE", {
                        userIcon: this.get("userIcon"),
                        userId: userId.toLowerCase()
                    });
                }
            });
            // 使展示头像为用户最新上传的头像
            var userInfo = appcan.getLocVal("CACHE_USERINFO_" + userId.toUpperCase())
            if (userInfo) {
                try {
                    userInfo = JSON.parse(userInfo);
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
                    errorDetail(e);
                }
            }
            appcan.setLocVal("CACHE_USERINFO_" + userId.toUpperCase(), JSON.stringify(this.model.toJSON()));
            localStorage.setItem("CACHE_USERINFO_" + userId.toUpperCase(), JSON.stringify(this.model.toJSON()));
        }

    },
    // 指定用来使用展示的模板
    template: contactItemTemplate,
    render: function () {
        var self = this;
        if (self.template) {
            var name = self.model.attributes.fullName;
            var lastName = name.substr((name.length) - 1, 1);
            var firstName = name[0];
            var lastNameSP = shouPin.getCamelChars(lastName);
            // 获取缓存中的用户账号
            var userID = appcan.getLocVal("userId");
            //使用模板+数据拼装DOM
            self.$el = $(self.template({
                data: self.model.attributes,
                isMobile: function (mobile) {
                    if (isDefine(mobile)) {
                        return "bm-phone";
                    }
                    return "";
                },
                isOneself: function (id,mobileNo) {
                    if (userID == id) {
                        //return "";
                    }
                    if(!mobileNo) return '';
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
        // 拨打电话功能
        appcan.button($("#bm-phone", self.$el), "btn-act", function () {
            var telnum = model.get("mobileNo");
            var teleNo = self.model.get("teleNo")
            if(teleNo) telnum = teleNo + ';' + telnum;
           try{ 
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
             }catch(e){
                
             }
            if(!telnum) return;
            else if(telnum.length>11){
                
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
        // 发消息功能
        appcan.button($("#bm-xxduihua", self.$el), "btn-act", function () {
            var userId = model.get("userId");
            var userIcon = model.get("userIcon");
            var sonName = model.get("fullName");
            
            appcan.setLocVal(storeKey.PERSON_ID, userId);
            localStorage.setItem(storeKey.PERSON_ID, userId);
            appcan.setLocVal(storeKey.CONTACT_ICON, userIcon);
            localStorage.setItem(storeKey.CONTACT_ICON, userIcon);
            appcan.setLocVal(storeKey.CONTACT_NAME, sonName);
            localStorage.setItem(storeKey.CONTACT_NAME, sonName);
            
            
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
            if(!telnum) return;
            else if(telnum.length>11){
                var arr = telnum.match(/\d+(\.\d+)?/g);
                uexWindow.actionSheet({
                   title:"请选择要发消息的手机号码",
                   cancel:"取消",
                   buttons: arr.toString(),
                },function(i){
                   telnum = arr[i];
                   if(telnum) uexSMS.open(""+telnum,"");
                });
                return;
            }
            uexSMS.open(""+telnum,"");
        })
        // 点击个人查看信息详情界面  手机 内线 外线 邮箱 工号 部门
        appcan.button($(".del", self.$el), "btn-act", function () {
            var userId = model.get("userId");
            var conName = model.get("fullName");
            appcan.setLocVal(storeKey.PERSON_NAME, conName);
            localStorage.setItem(storeKey.PERSON_NAME, conName);
            appcan.setLocVal(storeKey.CONTACT_NAME, conName);
            localStorage.setItem(storeKey.CONTACT_NAME, conName);
            appcan.setLocVal(storeKey.PERSON_ID, userId);
            localStorage.setItem(storeKey.PERSON_ID, userId);
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
                appcan.window.open('contactsMain', 'contactsMain.html', "10", 64);
            } else {
                appcan.window.open('contactsMain', 'contactsMain.html', "10");
            }

        })
    },
    // 更新视图
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
            } else {
                var name = model.get("fullName");
                var lastName = name.substr((name.length) - 1, 1);
                var lastNameSP = shouPin.getCamelChars(lastName);
                var lastNameStr = '<div style="line-height:2.5em;text-align:center;color:#ffffff;">' + lastName + '</div>';
                $('div.lazy', self.$el).css("background-color", generateColor(lastNameSP));
                $('div.lazy', self.$el).css('background-image', '');
                $("div.lazy", self.$el).removeAttr("data-original");
                $('div.lazy', self.$el).html(lastNameStr);

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
var contactListView = Backbone.View.extend({//options...

    initialize: function () {
        //初始化集合与VIEW自身函数的关联
        this.listenTo(this.collection, "add", this.addView);
        this.listenTo(this.collection, "change", this.updateView);
        this.listenTo(this.collection, "remove", this.removeView);
    },
    collection: new contactCollection(), //collection，用于存储和管理数据
    el: '#contactlist ul', //VIEW 对应 HTML 元素CSS选择器
    load: function (flag) {//HTML页面调用的初始化接口，由于通讯有可能依赖APPCAN组件，因此封装此接口在appcan.ready中调用
       try{ 
           var indexInfo = JSON.parse(appcan.getLocVal("EMM_USER_INFO"));
	   if(JSON.stringify(indexInfo.loginUser) != '{}'){
	        var dptId = indexInfo.loginUser.entity.department[0].dptId;
	   }else{
	        var dptId = JSON.parse(appcan.getLocVal('EPortal-UserInfo')).zzOrgId;
	   }       
       }catch(err){
       } 
        if (flag) {
            $("#remove").addClass("uhide-serach");
            $("#my_form").val("");
            this.collection.set([]);
        }
        this.collection.fetch({
            flag: flag ? flag : 0,//是否刷新数据
            dptId: dptId,
            success: function (cols, resp, options) {
                // 记录数据加载结束时间
                var paramTrackTimerHandleDataEnd = FunParamTrackTimerEnd("数据处理","通讯录","");// 数据处理结束参数
                uexSensorsAnalytics.trackTimerEnd(JSON.stringify(paramTrackTimerHandleDataEnd));
                appcan.window.closeToast();
                appcan.frame.resetBounce(0);
                $("div.lazy").lazyload({
                    cache: true,
                    callBack: function (path, s) {
                        s.dom.css('background-image', 'url("' + path + '")');
                        s.dom.empty();
                    }
                });
                try {
                    if (cols.length <= 0) {
                        $("#norecord").removeClass("uhide");
                    } else {
                        $("#norecord").addClass("uhide");
                    }
                } catch (e) {
                    ALERT_ERROR("contactListView", "load", e.message);
                }
            },
            error: function (cols, error, options) {
                
                // 记录数据加载结束时间
                var paramTrackTimerHandleDataEnd = FunParamTrackTimerEnd("数据处理","通讯录","");// 数据处理结束参数
                uexSensorsAnalytics.trackTimerEnd(JSON.stringify(paramTrackTimerHandleDataEnd));
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
    // 搜索框查询功能
    // 是请求还是第一次加载通讯录封装在models sync方法中 请求封装在services requestSearch方法中
    searchPer: function (pageNo) {
        appcan.window.openToast(STR_LOADING); // 数据加载中 请稍候...
        var fullName = $("#my_form").val();
        var codeArr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'   
        var fn = $.trim(fullName);
        var reg = /^[0-9a-zA-Z]*$/g;   // ^ 匹配一个输入或一行的开头  $ 匹配一个输入或一行的结尾  * 匹配前面元字符0次或多次
        var ari = fn.match(reg);
        if((ari) && (fn.length < 4)) {
            appcan.window.closeToast();
            appcan.window.confirm("提示","请输入至少4个字符！",['确定']);
            return;
        }
	var pageNo = pageNo;
        this.collection.fetch({
            pageNo: pageNo,
            fullName: fullName,
            success: function (cols, resp, options) {
                var event = {
                    pageNo:pageNo,
                    msgLength:resp.msg.length
                };   
                appcan.window.publish('loadingMore',JSON.stringify(event));
                appcan.window.closeToast();
                appcan.frame.resetBounce(0);
                appcan.frame.resetBounce(1);
                $("div.lazy").lazyload({
                    cache: true,
                    callBack: function (path, s) {
                        s.dom.css('background-image', 'url("' + path + '")');
                        s.dom.empty();
                    }
                });
                try {
                    // 暂无更多数据
                    if (cols.length <= 0) {
                        $("#norecord").removeClass("uhide");
                    } else {
                        $("#norecord").addClass("uhide");
                    }
                } catch (e) {
                    ALERT_ERROR("contactListView", "load", e.message);
                }
            },
            error: function (cols, error, options) {
                appcan.window.closeToast();
                appcan.frame.resetBounce(0);
                appcan.frame.resetBounce(1);
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

    searchPer2: function (pageNo) {
        appcan.window.openToast(STR_LOADING); // 数据加载中 请稍候...
        var fullName = $("#my_form").val();
        var contactlistHeight = $('#contactlist')[0].scrollHeight;
        var bodyHeight = $('body')[0].scrollHeight;
        var codeArr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        var fn = $.trim(fullName);
        var reg = /^[0-9a-zA-Z]*$/g;   // ^ 匹配一个输入或一行的开头  $ 匹配一个输入或一行的结尾  * 匹配前面元字符0次或多次
        var ari = fn.match(reg);
        if((ari) && (fn.length < 4)) {
            appcan.window.closeToast();
            appcan.window.confirm("提示","请输入至少4个字符！",['确定']);
            return;
        }
         var pageNo = pageNo;
        this.collection.fetch({
            pageNo: pageNo,
            fullName: fullName,
            success: function (cols, resp, options) {  // cols 页面展示总条数  resp 当前请求拿过来的条数 options配置参数信息
                appcan.window.closeToast();
                appcan.frame.resetBounce(0);
                appcan.frame.resetBounce(1);
                var event = {
                    pageNo:pageNo,
                    msgLength:resp.msg.length
                }
                appcan.window.publish('loadingMore',JSON.stringify(event));
                try {
                    // 暂无更多数据
                    if (resp.msg.length < 20) {
                       setTimeout(function(){
                           $('body').scrollTop(bodyHeight);
                       },0)
                    } else {
                        setTimeout(function(){
                            $('body').scrollTop(bodyHeight);
                        },0)
                    }
                } catch (e) {
                    ALERT_ERROR("contactListView", "load", e.message);
                }
            },
            error: function (cols, error, options) {
                appcan.window.closeToast();
                appcan.frame.resetBounce(0);
                appcan.frame.resetBounce(1);
                switch (error.status) {
                    default:
                        global_error(error);
                        break;
                }
            },
            add:true,
            remove:false,
            merge:true
        });
    },
    
    addView: function (model) {
        //collection中每加入一条数据都会被调用，用于创建新的商品view
        var view = new contactView({
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

var contactListViewInstance = new contactListView();
// 输入框后面的xx按钮功能
appcan.button("#remove", "ani-act ", function () {
    //取消XX按钮
    $("#remove").addClass("uhide-serach");
    $("#my_form").val("");
    contactListViewInstance.collection.set([]);
    contactListViewInstance.load();
})
appcan.button("#qunzulist ", "btn-act ", function () {
    appcan.window.open('qunzuliebiao', 'chat/qunzuliebiao.html', '10');
})
// 当input输入框失去焦点的时候 就调用查询方法来查找
function selectWho() {//根据条件来查询
    $("input").blur();
    contactListViewInstance.searchPer(1);
}
// 控制xx按钮显示与否
function OnInput() {
    var search_text = $("#my_form").val();
    var sc_userId = appcan.getLocVal("userId") || localStorage.getItem('userId');
    if (search_text != "" || search_text.length != 0) {
        //开启神策埋点事件追踪
        var param = {
                        event: 'platformClick',
                        propertieDict: {
                            userId:sc_userId,
                            module:'通讯录',
                            funcName:'关键字搜索',
                            buttonName:'搜索'                               
                        }
        };
        uexSensorsAnalytics.trackWithProperties(JSON.stringify(param));
        $("#remove").removeClass("uhide-serach");
    } else {
        $("#remove").addClass("uhide-serach");
        $("#my_form").val("");
    }
}

// 获取当前用户所有部门
function getBranch(){
    var html = '',personMark = 0;
    var EMMUSERINFO =  JSON.parse(appcan.getLocVal("EMM_USER_INFO"));
    if(JSON.stringify(EMMUSERINFO.loginUser) != '{}'){
        var personDptID  = EMMUSERINFO.loginUser.entity.brcId;
    }
    var EPortalUserInfo = JSON.parse(appcan.getLocVal("EPortal-UserInfo"));
    var orgName = EPortalUserInfo.zzFullOrgNames;
    var orgId = EPortalUserInfo.zzOrgId;
    appcan.setLocVal('personOrgName',orgName);
    localStorage.setItem('personOrgName',orgName);
    // 深航集团下的第一个子部门
    
    var data = orgName.split('/');  
    var departmentId = appcan.getLocVal("departmentId");
    var departmentId1 = departmentId.split('/');    
    var dptName = '深航集团';
    var dptId = 0;
    html += '<div onclick="openContactDpt(\''+ dptName +'\',\''+ dptId +'\')" id="dpt_0"  class="bg-wh rig-padd4 uc-a jj_marg1 jj_marg4 uba tx-color1 bder-color1">深航集团</div>'
    for(var i = 0; i < data.length; i ++){
        html += '<div onclick="openContactDpt(\''+ data[i] +'\',\''+ departmentId1[i] +'\')" id="dpt_' + departmentId1[i] +' " dptName="'+ data[i] +'" dptId=" ' + departmentId1[i] + ' " class="bg-wh rig-padd4 uc-a jj_marg1 uba tx-color1 bder-color1">'+data[i]+'</div>';
    }
    $('#get_branch').html(html);
    $("#get_branch").css('margin-right','0.5em');
}
function openContactDpt(dptName,dptId){
    appcan.setLocVal('clickDptName',dptName);
    localStorage.setItem('clickDptName',dptName);
    appcan.setLocVal('clickDptId',dptId);
    localStorage.setItem('clickDptId',dptId);
    uexWidget.startWidget('EMCONTACT', '10', '', 'contactDpt.html', '250');
}
