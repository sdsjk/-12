var STR_CRM_REMIND_TITLE_0_1 = tools.getString("STR_CRM_REMIND_TITLE_0_1");
var STR_CRM_REMIND_TITLE_0_2 = tools.getString("STR_CRM_REMIND_TITLE_0_2");
var STR_CRM_REMIND_TITLE_1_1 = tools.getString("STR_CRM_REMIND_TITLE_1_1");
var STR_CRM_REMIND_TITLE_1_2 = tools.getString("STR_CRM_REMIND_TITLE_1_2");
var STR_CRM_REMIND_TITLE_2_1 = tools.getString("STR_CRM_REMIND_TITLE_2_1");
var STR_CRM_REMIND_TITLE_2_2 = tools.getString("STR_CRM_REMIND_TITLE_2_2");
var STR_CRM_REMIND_TITLE_3_1 = tools.getString("STR_CRM_REMIND_TITLE_3_1");
var STR_CRM_REMIND_TITLE_3_2 = tools.getString("STR_CRM_REMIND_TITLE_3_2");
var STR_CRM_REMIND_TITLE_4_1 = tools.getString("STR_CRM_REMIND_TITLE_4_1");
var STR_CRM_REMIND_TITLE_4_2 = tools.getString("STR_CRM_REMIND_TITLE_4_2");
var STR_CRM_REMIND_TITLE_4_3 = tools.getString("STR_CRM_REMIND_TITLE_4_3");
var STR_CRM_REMIND_TITLE_5_1 = tools.getString("STR_CRM_REMIND_TITLE_5_1");
var STR_CRM_REMIND_TITLE_5_2 = tools.getString("STR_CRM_REMIND_TITLE_5_2");
var STR_CRM_REMIND_TITLE_5_3 = tools.getString("STR_CRM_REMIND_TITLE_5_3");
var STR_CRM_CLEW = tools.getString("STR_CRM_CLEW");
var STR_CRM_BUSINESS_REVIEW = tools.getString("STR_CRM_BUSINESS_REVIEW");
var STR_TODO_NOT_READ = tools.getString("STR_TODO_NOT_READ");
var STR_TODO_ALRAEDY_READ = tools.getString("STR_TODO_ALRAEDY_READ");
var STR_NO_MORE_DATA = tools.getString("STR_NO_MORE_DATA");

//TODO 按钮点击事件保护
//发现一个问题，点击保护之后，touch事件还是传了出去
var isButtonOnClick = true;//按钮是否可以被点击
var ONCLICK_ANIMATION_PROTECTION_TIMES = 1000;//按钮点击保护时间


//加载并初始化模板对象
var templateHTML = loadTemplate("../assets/templates/remindCrmList.tpl");

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
                iconSet: self.iconSet,
                setTitle: self.setTitle,
                setLabel: self.setLabel,
                setStatus: self.setStatus
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

                var attributes = self.model.attributes,
                        type = self.model.attributes.remindType,
                        appId = constant.CRM_APP_ID,
                        oppInfoData;
                appcan.locStorage.setVal("clueId", attributes.clueId);
                switch (type) {
                    case 1:
                        //商机审核详情（待审核）
                        oppInfoData = {
                            "id": attributes.objEntityId,
                            "opptTtl": attributes.opptTtl,
                            "csmName": attributes.csmName,
                            "clueId": attributes.clueId
                        };
                        appcan.setLocVal("oppInfoData", oppInfoData);
                        info = {
                            appId: appId,
                            param: {
                                "name": "opportInfoMyPublish",
                                "data": "opportInfoMyPublish.html?openType=6&source=1"
                            }
                        };
                        break;
                    case 2:
                        //我负责的商机详情（通过）
                        oppInfoData = {
                            "id": attributes.objEntityId,
                            "opptTtl": attributes.opptTtl,
                            "csmName": attributes.csmName,
                            "clueId": attributes.clueId
                        };
                        appcan.setLocVal("oppInfoData", oppInfoData);
                        info = {
                            appId: appId,
                            param: {
                                "name": "opportInfo",
                                "data": "opportInfo.html?source=1"
                            }
                        };
                        break;
                    case 3:
                        //我上报的商机详情（驳回）
                        oppInfoData = {
                            "id": attributes.objEntityId,
                            "opptTtl": attributes.opptTtl,
                            "csmName": attributes.csmName,
                            "clueId": attributes.clueId
                        };
                        appcan.setLocVal("oppInfoData", oppInfoData);
                        info = {
                            appId: appId,
                            param: {
                                "name": "opportInfoMyPublish",
                                "data": "opportInfoMyPublish.html?openType=4&source=1"
                            }
                        };
                        break;
                    case 4:
                        //我负责的商机详情（分配到的商机）
                        oppInfoData = {
                            "id": attributes.objEntityId,
                            "opptTtl": attributes.opptTtl,
                            "csmName": attributes.csmName,
                            "clueId": attributes.clueId
                        };
                        appcan.setLocVal("oppInfoData", oppInfoData);
                        info = {
                            appId: appId, 
                            param: {
                                "name": "opportInfo", 
                                "data": "opportInfo.html?source=1"
                            }
                        };
                        break;
                    default:
                        break;
                }
                appcan.window.publish("EPORTAL_LOAD_APP", JSON.stringify(info));
                self.remindRead(attributes.id);
            });
        }
        //返回自身，便于promise调用
        return this;
    },
    iconSet: function (type) {
        if (type == 0) {
            return 'remindNotice'
        } else {
            return 'remindNotice'
        }
    },
    setTitle: function (remindType, csmName, contactName, opptTtl, marketUserName, salesUserName) {
        var title;
        switch (remindType) {
            case 0:
                title = STR_CRM_REMIND_TITLE_0_1 + contactName + STR_CRM_REMIND_TITLE_0_2 + csmName;
                break;
            case 1:
                title = STR_CRM_REMIND_TITLE_1_1 + opptTtl + STR_CRM_REMIND_TITLE_1_2 + marketUserName;
                break;
            case 2:
                title = STR_CRM_REMIND_TITLE_2_1 + opptTtl + STR_CRM_REMIND_TITLE_2_2;
                break;
            case 3:
                title = STR_CRM_REMIND_TITLE_3_1 + opptTtl + STR_CRM_REMIND_TITLE_3_2;
                break;
            case 4:
                title = STR_CRM_REMIND_TITLE_4_1 + marketUserName + STR_CRM_REMIND_TITLE_4_2 + opptTtl + STR_CRM_REMIND_TITLE_4_3;
                break;
            case 5:
                title = STR_CRM_REMIND_TITLE_5_1 + opptTtl + STR_CRM_REMIND_TITLE_5_2 + salesUserName + STR_CRM_REMIND_TITLE_5_3;
                break;
            default:
                break;
        }
        return title;
    },
    setLabel: function (type) {
        if (type == 0) {
            return STR_CRM_CLEW;
        } else {
            return STR_CRM_BUSINESS_REVIEW;
        }
    },
    setStatus: function (type) {
        if (type == 0) {
            return '<div class="baseColor2">' + STR_TODO_NOT_READ + '</div>'
        } else {
            return '<div class="baseColor1">' + STR_TODO_ALRAEDY_READ + '</div>'
        }
    },
    updateView: function (model) {
        model = model.attributes;
        $(".readStatus", this.$el).html(this.setStatus(model.remindType));
        $(".remindTitle", this.$el).html(this.setTitle(model.remindType, model.csmName, model.contactName, model.opptTtl, model.marketUserName, model.salesUserName));
    },
    /**
     * 阅读某条信息
     */
    remindRead: function (id) {
        var data = {
            "condition": {
                "url": '/crm/app/remind/edit'
            },
            "content": {
                "id": id,
                "ifRead": 1
            }
        };
        this.model.save({}, {
            params: {
                data: data,
                url: constant.CRM_URL
            },
            success: function (cols, resp, options) {
            },
            error: function (error, resp, options) {
                global_error(error);
            }
        });
    }
});

//列表容器VIEW
var remindListView = Backbone.View.extend({//options...
    initialize: function () {
        //初始化集合与VIEW自身函数的关联
        this.listenTo(this.collection, "add", this.addView);
        this.listenTo(this.collection, "change", this.updateView);
        this.listenTo(this.collection, "remove", this.removeView);
    },
    service: requestService,
    collection: new remindCollection(), //collection，用于存储和管理数据
    el: '#remindList ul', //VIEW 对应 HTML 元素CSS选择器
    pageNo: 1,
    /**
     * 加载CRM提醒列表
     */
    load: function (type) {
        try {
            var emmToken = JSON.parse(appcan.getLocVal("emmToken"));
            this.tenantId = emmToken.info.tenantId || "611";
        } catch (e) {
        }

        var self = this;
        if (type == 0) {
            self.pageNo = 1;
        }

        var data = {
            "condition": {
                "url": '/crm/app/remind/page'
            },
            "content": {
                "pageNo": self.pageNo,
                "pageSize": 10,
                "ifRead": 0
            }
        };

        this.collection.fetch({
            params: {
                data: data,
                url: constant.CRM_URL
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
            remove: (type == 0) ? true : false,
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
    },
    remindReadAll: function () {
        var data = {
            "condition": {
                "url": '/crm/app/remind/batchEdit'
            },
            "content": {
                "ifRead": 1
            }
        };

        this.collection.fetch({
            params: {
                data: data,
                url: constant.CRM_URL
            },
            success: function (cols, resp, options) {
                uexWindow.topBounceViewRefresh();
            },
            error: function (error, resp, options) {
                global_error(error);
            }
        });
    }
});
var remindListViewInstance = new remindListView();