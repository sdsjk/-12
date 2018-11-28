var STR_NO_MORE_DATA = tools.getString("STR_NO_MORE_DATA");

//TODO 按钮点击事件保护
//发现一个问题，点击保护之后，touch事件还是传了出去
var isButtonOnClick = true;//按钮是否可以被点击
var ONCLICK_ANIMATION_PROTECTION_TIMES = 1000;//按钮点击保护时间

//加载并初始化模板对象
var templateHTML = loadTemplate("../assets/templates/todoList.tpl");

var todoView = Backbone.View.extend({//options...
    initialize : function(option) {
        //初始化VIEW并让model与VIEW进行关联
        this.model.view = this;
        //初始化VIEW的HTMLDOM对象
        this.render();
    },
    template : templateHTML, //VIEW对应的模板
    render : function() {
        var self = this;
        if (this.template) {
            //使用模板+数据拼装DOM
            this.$el=$(this.template({
                data:this.model.attributes,
                setIcon:self.setIcon,
                dateSet:self.dateSet
            })); 
            
            //为DOM增加点击效果
            appcan.button(this.$el,"btn-act",function(){
                //这里因为快速点击会出现一些问题,所以需要在时间上做一个保护
                if (!isButtonOnClick) {
                    return;
                }
                isButtonOnClick = false;
                setTimeout(function () {
                    isButtonOnClick = true;//重置点击标志
                }, ONCLICK_ANIMATION_PROTECTION_TIMES);//按钮点击保护时间

                var entityTypeId = self.model.get("entityTypeId");
                var objectId = self.model.get("objectId");
                var appId = self.model.get("appId") || "EMOA";
                switch(entityTypeId){
                    case "01"://目标
                    appcan.setLocVal('TARGET-ID',objectId);
                    appcan.setLocVal('TARGET-DATA','');
                    info = {appId:appId,param:{"name":"targetInfo","data":"targetInfo.html?targetId="+objectId}}
                    break;
                    case "02"://任务
                    appcan.setLocVal('TASK-ID',objectId);
                    info = {appId:appId,param:{"name":"taskInfo","data":"taskInfo.html?taskId="+objectId}}
                    break;
                    default://先放线索在这里
                    break;
                    
                }
                appcan.window.publish("EPORTAL_LOAD_APP",JSON.stringify(info));
            })
        }
        //返回自身，便于promise调用
        return this;
    },setIcon:function(entityTypeId){
        var className = '';
        switch(entityTypeId){
            case "01"://目标
            className = "toTarget";
            break;
            case "02"://任务
            className = "toTask";
            break;
            default://先放线索在这里
            className = "toCule";
            break;
            
        }
        return className;
    },
    dateSet : function(d) {
        var d = (d+'').replace(/-/g,'/');
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
var todoListView = Backbone.View.extend({//options...
    initialize : function() {
        //初始化集合与VIEW自身函数的关联
        this.listenTo(this.collection, "add", this.addView);
        this.listenTo(this.collection, "change", this.updateView);
        this.listenTo(this.collection, "remove", this.removeView);
    },
    collection : new todoCollection(), //collection，用于存储和管理数据
    el : '#toDoList ul', //VIEW 对应 HTML 元素CSS选择器
    pageNo:1,
    load : function(type) {
        try{
        var emmToken = JSON.parse(appcan.getLocVal("emmToken"));
        this.tenantId = emmToken.info.tenantId || "611";
        }catch(E){}
        var self = this;
        if(type == 0){
            self.pageNo = 1;
        }
        var data= {
                    "ifno" : "zywx-message-0001",
                    "condition" : {
                        "pageNo" : self.pageNo,
                        "rowCnt" : 12
                    },
                    "content" : {
                    }
                }
        this.collection.fetch({
            params : {
                data : data
            },
            success : function(cols, resp, options) {
                try {
                    if(type == 0){
                        if (cols.length <= 0) {
                            $("#norecord").removeClass("uhide");
                        } else {
                            self.pageNo++;
                            $("#norecord").addClass("uhide");
                        }
                    }else{
                        if (resp.msg.list.length <= 0) {
                            appcan.window.openToast(STR_NO_MORE_DATA, 1500, 5);
                        } else {
                            self.pageNo++;
                        }
                    }
                    setTimeout(function(){appcan.frame.resetBounce(type);},100);
                } catch(e) {
                    ALERT_ERROR("todoListView", "load", e.message);
                }
            },
            error : function(cols, error, options) {
                appcan.frame.resetBounce(type);
                switch(error.status) {
                default:
                    global_error(error);
                    break;
                }
            },
            add : true,
            remove : (type == 0) ? true : false,
            merge : (type == 0) ? false : true
        });
    },
    addView : function(model) {
        var view = new todoView({
            model : model
        });
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
var todoListViewInstance = new todoListView();
appcan.ready(function() {
     appcan.window.subscribe("EPORTAL_TODOLIST_READ_UPDATE",function(result){
         var collect = todoListViewInstance.collection;
         if(result)
        collect.remove(collect.get(result));
     })
})
