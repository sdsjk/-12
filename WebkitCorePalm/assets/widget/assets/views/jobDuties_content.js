//加载并初始化模板对象
var jobDutiesTemplate = loadTemplate("../assets/templates/jobDuties_content.tpl");
var errorTemplate= loadTemplate("../assets/templates/error.tpl");
var jobDutiesView = Backbone.View.extend({//options...
    initialize : function(option) {
        //初始化
        this.model= new jobDutiesModel();//model里面默认加上加载中状态
        this.template=jobDutiesTemplate;//VIEW对应的模板
        this.errorTemplate=errorTemplate;//错误界面的模版
        this.render();
    },
    el : '#jobDutiesInfo',
    /**
     *渲染正确的结果 
     */
    render : function() {
        var self = this;
        if (self.template) {
            //使用模板+数据拼装DOM
           //把条目view的dom对象插入到listview DOM对象中
            self.$el.html($(self.template(this.model.attributes)));
        }
        //返回自身，便于promise调用
        return this;
    },
    /**
     *渲染错误的结果 
     */
    renderError:function(error){
        var self=this;
        if(self.errorTemplate){
            self.$el.html(self.errorTemplate(error))
        }
        return this;
    },
    /**
     *从服务器获取数据 
     */
    load : function() {
        var self = this;
        self.model.fetch({
            success : function(cols, resp, options) {
                //渲染页面
                self.render();
            },
            error : function(cols, error, options) {
                //渲染错误的提示
                self.renderError(error)
            }
        });
    }
});

var jobDutiesViewInstance = new jobDutiesView();
