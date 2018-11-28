var pointGradeTemplate = loadTemplate("../assets/templates/pointGrade.tpl");

var pointGradeView = Backbone.View.extend({
    initialize : function(){
        this.model.view = this;
        this.render();
    },
    template : pointGradeTemplate,
    render : function(){
        this.template = pointGradeTemplate;
        if(this.template){
            this.$el = $(this.template(this.model.attributes));
        }
        return this;
    }
})

var pointGradeListView = Backbone.View.extend({
    initialize : function(){
        this.listenTo(this.collection, "add", this.add);
        this.viewCollection=this.collection;
    },
    collection : new pointGradeList(),
    el : '#list',
    doLoad : function(){
        var param = {
                "ifno": "zywx-point-0001",
                "condition": {
                },
                "content": {}
            }
        this.collection.fetch({
            param:param,
            success:function(data,resp,options){
                if (data.length <= 0) {
                    $("#norecord").removeClass("uhide");
                } else {
                    $("#norecord").addClass("uhide");
                }
            },
            error:function(errr,resp,options){
                switch(error.status)
                {
                    default:
                    global_error(error);
                    break;
                }
            }
        })
    },
    add : function(model){
        var view = new pointGradeView({
            model : model
        });
        this.$el.append(view.$el);
    },
    load:function(){
        var self = this;
        if(!pointGradeTemplate){
            loadTemplate("../assets/templates/pointGrade.tpl",function(t){
                if(!pointGradeTemplate)
                    pointGradeTemplate = t;
                self.doLoad();
            });
        }else{
            self.doLoad();
        }
    }
})

var pointGradeListViewInstance = new pointGradeListView();
