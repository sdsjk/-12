var STR_TIME = tools.getString("STR_TIME");
var STR_UNLIMITED = tools.getString("STR_UNLIMITED");
var STR_ACCUMULATIVE = tools.getString("STR_ACCUMULATIVE");
var STR_DAILY = tools.getString("STR_DAILY");
var STR_MONTHLY = tools.getString("STR_MONTHLY");

var pointRulesTemplate = loadTemplate("../assets/templates/pointRules.tpl");

var pointRulesView = Backbone.View.extend({
    initialize : function(){
        this.model.view = this;
        this.render();
    },
    template : pointRulesTemplate,
    render : function(){
        this.template = pointRulesTemplate;
        if(this.template){
            var gainType = this.model.attributes.gainType;
            var gainTimes = this.model.attributes.gainTimes;
            if (parseInt(gainType) == 0) {
                var gainVal = STR_UNLIMITED;
            } else if (parseInt(gainType) == 1) {
                var gainVal = STR_ACCUMULATIVE + gainTimes;
            } else if (parseInt(gainType) == 2) {
                var gainVal = STR_DAILY + gainTimes;
            } else if (parseInt(gainType) == 3) {
                var gainVal = STR_MONTHLY + gainTimes;
            }
            this.model.attributes.gainVal = gainVal;
            this.model.attributes.timeStr = STR_TIME;
            this.$el = $(this.template(this.model.attributes));
        }
        return this;
    }
})

var pointRulesListView = Backbone.View.extend({
    initialize : function(){
        this.listenTo(this.collection, "add", this.add);
        this.viewCollection=this.collection;
    },
    collection : new pointRulesList(),
    el : '#list',
    doLoad : function(){
        var param = {
                "ifno": "zywx-point-0002",
                "condition": {
                    "pageNo" : 1,
                    "rowCnt" : 10000
                },
                "content": {}
            };
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
        var view = new pointRulesView({
            model : model
        });
        this.$el.append(view.$el);
    },
    load:function(){
        var self = this;
        if(!pointRulesTemplate){
            loadTemplate("../assets/templates/pointRules.tpl",function(t){
                    if(!pointRulesTemplate)
                    pointRulesTemplate = t;
                    self.doLoad();
            });
        }else{
            self.doLoad();
        }
    }
})

var pointRulesListViewInstance = new pointRulesListView();
