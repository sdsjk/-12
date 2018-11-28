var STR_EXPERIENCE = tools.getString("STR_EXPERIENCE");
var STR_SCORE = tools.getString("STR_SCORE");

var pointRecondTemplate = loadTemplate("../assets/templates/pointRecond.tpl");

var pointRecondView = Backbone.View.extend({
    initialize : function(){
        this.model.view = this;
        this.render();
    },
    template : pointRecondTemplate,
    render : function(){
        this.template = pointRecondTemplate;
        if(this.template){
            var date = new Date();
            var curDate = NYR(date,1)
            var createdAt = this.model.attributes.createdAt;//创建时间
            var creatTime = NYR(createdAt,1);
            if(creatTime == curDate){
                var cTime = HM(createdAt)
            }else{
                var cTime = NYR(createdAt,0);
            }
            this.model.attributes.ctime = cTime;
            this.model.attributes.experienceStr = STR_EXPERIENCE;
            this.model.attributes.scoreStr = STR_SCORE;
            this.$el = $(this.template(this.model.attributes));
        }
        return this;
    }
})

var pointRecondListView = Backbone.View.extend({
    initialize : function(){
        this.listenTo(this.collection, "add", this.add);
        this.listenTo(this.collection, "remove", this.remove);
        this.viewCollection=this.collection;
    },
    collection : new pointRecondList(),
    el : "#list",
    pageNo:1,
    doLoad : function(t){
        var remove_status = (t==0)?true:false;
        var self = this;
        if(t==0){
            self.pageNo = 1;
        }
        var dataObj = 
            {
                "ifno": "zywx-point-0003",
                "condition": {
                    "pageNo" : self.pageNo,
                    "rowCnt" : 10
                },
                "content": {}
            }
        this.collection.fetch({
            param:dataObj,
            success:function(data,resp,options){
                appcan.frame.resetBounce(t);
                if (data.length <= 0) {
                    $("#norecord").removeClass("uhide");
                } else {
                    self.pageNo++;
                    $("#norecord").addClass("uhide");
                }
            },
            error:function(errr,resp,options){
                appcan.frame.resetBounce(t);
                switch(error.status)
                {
                    default:
                    global_error(error);
                    break;
                }
            },
            add:true,
            remove:remove_status,
            merge:true
        })
        
            
    },
    add : function(model){
        var view = new pointRecondView({
            model : model
        });
        this.$el.append(view.$el);
    },
    remove : function(model){
        model.view.remove();
    },
    load:function(t){
        var self = this;
        if(!pointRecondTemplate){
            loadTemplate("../assets/templates/pointRecond.tpl",function(temp){
                if(!pointRecondTemplate)
                    pointRecondTemplate = temp;
                self.doLoad(t);
            });
        }else{
            self.doLoad(t);
        }
    }
})

var pointRecondListViewInstance = new pointRecondListView();
