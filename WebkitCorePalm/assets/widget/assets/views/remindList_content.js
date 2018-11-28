var STR_TODO_ALRAEDY_SEND_BACK = tools.getString("STR_TODO_ALRAEDY_SEND_BACK");
var STR_TODO_APPROVAL_SEND_BACK = tools.getString("STR_TODO_APPROVAL_SEND_BACK");
var STR_TODO_APPRAISE_SEND_BACK = tools.getString("STR_TODO_APPRAISE_SEND_BACK");
var STR_NO_MORE_DATA = tools.getString("STR_NO_MORE_DATA");
var STR_TODO_ALRAEDY_READ = tools.getString("STR_TODO_ALRAEDY_READ");
var STR_TODO_NOT_READ = tools.getString("STR_TODO_NOT_READ");

//加载并初始化模板对象
var templateHTML = loadTemplate("../assets/templates/remindList.tpl");
var userInfo = JSON.parse(appcan.getLocVal("EMM_USER_INFO"));
var userId = userInfo.loginUser.entity.userId;
var allRead = 0;
var info = "";

//TODO 按钮点击事件保护
//发现一个问题，点击保护之后，touch事件还是传了出去
var isButtonOnClick = true;//按钮是否可以被点击
var ONCLICK_ANIMATION_PROTECTION_TIMES = 1000;//按钮点击保护时间

var remindView = Backbone.View.extend({//options...
    initialize: function (option) {
        //初始化VIEW并让model与VIEW进行关联
        this.model.view = this;
        //初始化VIEW的HTMLDOM对象
        this.render();
    },
    template: templateHTML, //VIEW对应的模板
    render: function () {
        var self = this;
        if (this.template) {
            //使用模板+数据拼装DOM
            this.$el = $(this.template({
                data: this.model.attributes,
                dateSet: self.dateSet,
                setStatus: self.setStatus,
                titstatus: self.titstatus,
                iconSet: self.iconSet
            }));

            //为DOM增加点击效果
            appcan.button(this.$el, "btn-act", function () {

               

                //这里因为快速点击会出现一些问题,所以需要在时间上做一个保护
                if (!isButtonOnClick) {
                   
                    return;
                }
                isButtonOnClick = false;
                setTimeout(function () {
                    isButtonOnClick = true;//重置点击标志
                }, ONCLICK_ANIMATION_PROTECTION_TIMES);//按钮点击保护时间

               
                var entity = self.model.toJSON().entity;
                var entityTypeId = entity.objEntityTypeId;
               
                var objectId;
                if (entityTypeId == "24") {
                    objectId = self.model.toJSON().objectId;
                } else {
                    objectId = entity.objObjectId;
                }
                var appId = self.model.get("appId");
                switch (entityTypeId) {
                    case "09"://公告
                        appcan.setLocVal('NOTICE-ID', objectId);
                        info = {
                            appId: appId,
                            param: {"name": "notice_detail", "data": "notice_detail.html?noticeId=" + objectId}
                        };
                        break;
                    case "24"://工单
                        appcan.setLocVal('WORKFLOW-STATE', '传阅');
                        appcan.setLocVal('WORKFLOW-TITLE', entity.title);
                        var obj1 = self.model.toJSON().workFlowInfo;
                        appcan.setLocVal('WORKFLOW-DATA', JSON.stringify(obj1));
                        info = {
                            appId: appId,
                            param: {"name": "workFlowDetail", "data": "workFlowDetail.html?closeWgt=1"}
                        };
                        break;
                    case 24://工单
                        appcan.setLocVal('WORKFLOW-STATE', '传阅');
                        appcan.setLocVal('WORKFLOW-TITLE', entity.title);
                        var obj2 = self.model.toJSON().workFlowInfo;
                        appcan.setLocVal('WORKFLOW-DATA', JSON.stringify(obj2));
                        info = {
                            appId: appId,
                            param: {"name": "workFlowDetail", "data": "workFlowDetail.html?closeWgt=1"}
                        };
                        break;
                    case "26"://计划
                        appcan.setLocVal('PLAN-ID', objectId);
                        appcan.setLocVal("PLAN-FROM-OPEN", "");
                        info = {
                            appId: appId,
                            param: {"name": "dptPlan_detail", "data": "dptPlan_detail.html?closeWgt=1"}
                        };
                        break;
                    default://先放线索在这里
                        break;

                }
                appcan.window.publish("EPORTAL_LOAD_APP", JSON.stringify(info));
                remindListViewInstance.remindread(self.model.get("objectId"), self.model.get("entity").objEntityTypeId);
            })
        }
        //返回自身，便于promise调用
        return this;
    },
    dateSet: function (d) {
        var date = (d + '').replace(/-/g, '/');
        var time = NYR(date, 1);
        var nyr = NYR('', 1);
        var cTime;
        if (time == nyr) {
            cTime = HM(date);
        } else {
            cTime = NYR(date, 0);
        }
        return cTime;
    },
    setStatus: function (s) {
        if (s) {
            return '<div class="baseColor1" >' + STR_TODO_ALRAEDY_READ + '</div>'
        } else {
            return '<div class="baseColor2" >' + STR_TODO_NOT_READ + '</div>'
        }
    },
    titstatus: function (title, objEntityTypeId) {
        if (objEntityTypeId == '24') {
            return title + STR_TODO_APPROVAL_SEND_BACK;
        } else if (objEntityTypeId == '26') {
            return title + STR_TODO_APPRAISE_SEND_BACK;
        } else {
            return title;
        }
    },
    updateView: function (model) {
        $(".readStatus", this.$el).html(this.setStatus(model.toJSON().read))
        $(".remindTitle", this.$el).html(model.toJSON().entity.title);
    },
    iconSet: function (entityType) {
        var icon = "";
        switch (entityType) {
            case "09"://公告
                icon = "remindNotice";
                break;
            case "24"://工单
                icon = "remindFlowicon";
                break;
            case "26"://计划
                icon = "remindPlan";
                break;
            default:
                icon = "remindFlowicon";
                break;
        }
        return icon;
    }
});

//列表容器VIEW
var remindListView = Backbone.View.extend({//options...
    initialize: function () {
        var self = this;
        //初始化集合与VIEW自身函数的关联
        this.listenTo(this.collection, "add", this.addView);
        this.listenTo(this.collection, "change", this.updateView);
        this.listenTo(this.collection, "remove", this.removeView);
        this.listenTo(this.service, "fresh", function (data) {
            if (allRead) {
                var model = self.collection.get(data.objectId);
                model.attributes.read = true;
                model.view.updateView(model)
            } else {
                $(".readStatus").html('<div class="baseColor1">已读</div>')
            }
        });
    },
    service: requestService,
    collection: new remindCollection(), //collection，用于存储和管理数据
    el: '#remindList ul', //VIEW 对应 HTML 元素CSS选择器
    pageNo: 1,
    load: function (type) {
        try {
            var emmToken = JSON.parse(appcan.getLocVal("emmToken"));
            this.tenantId = emmToken.info.tenantId || "611";
        } catch (E) {
        }
        var self = this;
        if (type == 0) {
            self.pageNo = 1;
        }
        var data = {
            "ifno": "zywx-message-0003",
            "condition": {
                "pageNo": self.pageNo,
                "rowCnt": 10
            },
            "content": {
                "entityTypeId": 27
            }
        };
        this.collection.fetch({
            params: {
                data: data
            },
            success: function (cols, resp, options) {
                try {

                    if (type == 0) {
                        if (cols.length <= 0) {
                            $("#norecord").removeClass("uhide");
                        } else {
                            self.pageNo++;
                            $("#norecord").addClass("uhide");
                        }
                    } else {
                        if (resp.msg.list.length <= 0) {
                            appcan.window.openToast(STR_NO_MORE_DATA, 1500, 5);
                        } else {
                            self.pageNo++;
                        }
                    }
                    setTimeout(function () {
                        appcan.frame.resetBounce(type);
                    }, 100)

                } catch (e) {
                    ALERT_ERROR("remindListView", "load", e.message);
                }
            },
            error: function (cols, error, options) {
                appcan.frame.resetBounce(type);
                switch (error.status) {
                    default:
                        global_error(error);
                        break;
                }
            },
            add: true,
            remove: type == 0,//简化代码，原代码为(type == 0) ? true : false
            merge: true
        });
    },
    addView: function (model) {
        var view = new remindView({
            model: model
        });
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
    }, remindread: function (objectId, entityType) {
        allRead = 0;
        var obj = {
            param: {
                "ifno": "zywx-message-0008",
                "condition": {},
                "content": {
                    "entityTypeId": "27"
                }
            }
        };
        if (objectId) {
            if (entityType == "24") {
                obj = {
                    param: {
                        "ifno": "zywx-workFlow-0012",
                        "condition": {
                            "url": "/appdo-web-flow/doProcessUserTaskAction/action/P0013"
                        },
                        "content": {
                            "remindUser": userId,
                            "isALL": "0",
                            "id": objectId
                        }
                    }
                }
            } else {
                obj.param.ifno = "zywx-message-0007";
                obj.param.content.objectId = objectId;
            }
            allRead = 1;
        }
        this.service.readRequest(obj, entityType);
    }
});
var remindListViewInstance = new remindListView();
