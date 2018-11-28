//加载并初始化模板对象
var remindNoticeTemplate = loadTemplate("../assets/templates/remind_notice_content.tpl");
var remindPersonTemplate = loadTemplate("../assets/templates/remind_person_content.tpl");
var remindReportTemplate = loadTemplate("../assets/templates/remind_report_content.tpl");
var remindTargTaskTemplate = loadTemplate("../assets/templates/remind_targTask_content.tpl");
var remindWorkPlanTemplate = loadTemplate("../assets/templates/remind_workPlan_content.tpl");
var remindView = Backbone.View.extend({//options...
    initialize : function(option) {
        //初始化VIEW并让model与VIEW进行关联
        this.model.view = this;
        this.kind = option.kind;
        //初始化VIEW的HTMLDOM对象
        this.render();
    },
    template : function(){
        var template = '';
        switch(this.kind){
            case "notice":
                template = remindNoticeTemplate; //VIEW对应的模板
            break;
            case "person":
                template = remindPersonTemplate; //VIEW对应的模板
            break;
            case "report":
                template = remindReportTemplate; //VIEW对应的模板
            break;
            case "targTask":
                template = remindTargTaskTemplate; //VIEW对应的模板
            break;
            case "workPlan":
                template = remindWorkPlanTemplate; //VIEW对应的模板
            break;
        }
        return template; //VIEW对应的模板
    },
    render : function() {
        var self = this;
        var template = self.template(); 
        if (template) {
            //使用模板+数据拼装DOM
            var info = {};
            switch(self.kind){
                case "notice":
                    info = {
                        data : self.model.attributes,
                        dateSet : self.dateSet
                    }
                break;
                case "person":
                    info = {
                        data : self.model.attributes,
                        setColor1:function(d){//0入职1调岗
                            return "text-c";
                        },setColor:function(d){//0入职1调岗
                            return "textColor18";
                        },setVal:function(d){//0入职1调岗
                           var type = d.objEntryType;
                            return parseInt(type)?"调岗":"入职";
                        }
                    }
                break;
                case "report":
                    info = {
                        data : self.model.attributes,
                        fontColor:function(d){
                            var fontColor = '';
                            
                            return fontColor;
                        },fontColor1:function(d){
                            var fontColor1 = "";
                            if(d==03){
                                fontColor1 = "textColor16";  
                            }
                            if(d==04){
                                fontColor1 = "textColor16";
                            }
                            return "textColor16";
                        },setTitle:function(d){
                           var type = d.objEntityTypeId;
                           var title = "";
                           if(type==03){
                                title = "周报";
                            }
                            if(type ==04){
                               title = "月报";
                            }
                            return title + d.title;
                        },dateSet : self.dateSet
                    }
                break;
                case "targTask":
                    info = {
                        data : self.model.attributes,
                        setValue:function(d){//0入职1调岗
                            var objAction = d.objAction;//0创建1更新2完成3审批
                            var objEntityTypeId = parseInt(d.objEntityTypeId);//01目标02任务
                            var actionVal = "";
                            if(objAction == 0){
                                actionVal = "创建";
                            }else if(objAction == 1){
                                actionVal = "更新";
                            }else if(objAction == 2){
                                actionVal = "完成";
                            }else if(objAction == 3){
                                actionVal = "审批";
                            }
                            var entityVal = "";
                            if(objEntityTypeId == 01){
                                entityVal = "目标";
                            }else if(objEntityTypeId == 02){
                                entityVal = "任务";
                            }
                            return actionVal+"了"+entityVal;
                        },
                        dateSet : self.dateSet
                    }
                break;
                case "workPlan":
                    info = {
                        data : self.model.attributes,
                        dateSet : self.dateSet
                    }
                break;
            }
            
            self.$el = $(template(info)); 
            self.bindingEvent();
        }
        //返回自身，便于promise调用
        return self;
    },
    bindingEvent : function(){
        var self = this;
        //为DOM增加点击效果
        appcan.button(this.$el, "btn-act", function() {
            var detail = self.model.toJSON();
            var info = {};
            switch(self.kind){
                case "notice":
                    info = {appId:detail.appId,param:{"name":"notice_detail","data":"notice_detail.html?noticeId="+detail.entity.objObjectId}};
                break;
                case "person":
                    info = {appId:detail.appId,param:{"name":"personnel_dynamics","data":"personnel_dynamics.html"}}
                break;
                case "report":
                    var objEntityTypeId = detail.entity.objEntityTypeId;
                    var objObjectId = detail.entity.objObjectId;
                    var objTitle = detail.entity.title;
                    var appId = detail.appId;
                    var objEntityType = {"03":"01","04":"02"}//03周报04月报
                    var reportInfo = encodeURIComponent(JSON.stringify({objectId:objObjectId,rptTtl:objTitle,type:objEntityType[objEntityTypeId],userId:detail.userId}));
                    info = {appId:appId,param:{"name":"gzbg_xiangqing","data":"gzbg_xiangqing.html?reportInfo="+reportInfo}}
                break;
                case "targTask":
                var objEntityTypeId = detail.entity.objEntityTypeId;
                var objObjectId = detail.entity.objObjectId;
                var appId = detail.appId;
                if(objEntityTypeId=="01"){//01目标
                    info = {appId:appId,param:{"name":"targetInfo","data":"targetInfo.html?targetId="+objObjectId}}
                }else{//02任务
                    info = {appId:appId,param:{"name":"taskInfo","data":"taskInfo.html?taskId="+objObjectId}}
                }
                break;
                case "workPlan":
                info = {appId:detail.appId,param:{"name":"dptPlan_detail","data":"dptPlan_detail.html?planId="+detail.entity.objObjectId}}
                break;
                default:
                break;
            }
            appcan.window.publish("EPORTAL_LOAD_APP",JSON.stringify(info));
            markRead(detail.objectId);//标记已读
        })
    },
    updateView : function(model) {
    },
    dateSet : function (d) {
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
var remindListView = Backbone.View.extend({//options...
    
    initialize : function() {
        //初始化集合与VIEW自身函数的关联
        this.listenTo(this.collection, "add", this.addView);
        this.listenTo(this.collection, "change", this.updateView);
        this.listenTo(this.collection, "remove", this.removeView);
    },
    collection : new remindCollection(), //collection，用于存储和管理数据
    el : '#remindlist',   //VIEW 对应 HTML 元素CSS选择器
    pageNo:1,
    kind:"",
    entity:{"notice":"09","person":"11","report":"03","targTask":"01","workPlan":"26"},
    load : function(type) {  //HTML页面调用的初始化接口，由于通讯有可能依赖APPCAN组件，因此封装此接口在appcan.ready中调用
        var self = this;
        type = parseInt(type);
        if(type==0){
            self.pageNo=1;
        }
        var params = {
            "ifno" : "zywx-remind-0002",
            "condition" : {
                pageNo : self.pageNo,
                rowCnt : 10,
            },
            "content" : {
                "entityTypeId" : "27",
                "objEntityTypeId" : self.entity[self.kind]
            }
        }
        
        this.collection.fetch({
            params:params,
            success : function(cols, resp, options) {
                try{
                    appcan.frame.resetBounce(type);
                    if(type == 0){
                        if (cols.length <= 0) {
                            $("#norecord").removeClass("uhide");
                        } else {
                            self.pageNo++;
                            $("#norecord").addClass("uhide");
                        }
                    }else{
                        if (resp.msg.list.length <= 0) {
                            appcan.window.openToast("暂无更多的数据",1500,5);
                        }else{
                            self.pageNo++;
                        }
                    }
                }catch(e) {
                    ALERT_ERROR("remindListView","load",e.message);
                }
            },
            error : function(cols, error, options) {
                appcan.frame.resetBounce(type);
                switch(error.status)
                {
                    default:
                    global_error(error);
                    break;
                }
            },
            add:true,
            remove:(type==0)?true:false,
            merge:true
        });
    },
    addView : function(model) {
        //collection中每加入一条数据都会被调用，用于创建新的商品view
        var view = new remindView({
            model : model,
            kind:this.kind
        });
        //把条目view的dom对象插入到listview DOM对象中
        this.$el.append(view.$el);
    },
    updateView : function(model) {
        var view = model.view;
        if (view) {
            this.$el.prepend(view.$el);
            view.updateView(model);
        }
    },
    removeView:function(model){
        var view = model.view;
        view.remove();
    }
});

var remindListViewInstance = new remindListView();
