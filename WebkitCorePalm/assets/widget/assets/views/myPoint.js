var myPointView = Backbone.View.extend({
    initialize : function(){
        this.listenTo(this.model, "change", this.updateData);
    },
    model : new myPointModel(),
    load : function(){
        var self = this;
        var param = {
            "ifno": "zywx-point-0004",
            "condition": {
            },
            "content": {}
        };
        this.model.fetch({
            param:param,
            success:function(data,resp,options){
                
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
    updateData : function(data){
        var data = data.toJSON();
        var score = data.score;//积分
        var grade = data.grade;//等级
        var gradesName = data.gradesName;//头衔
        var empiric = data.empiric;//经验
        var upperEmpiric = data.upperEmpiric;//积分上限
        var imgurl = data.userIcon;//头像
        var scaleVal = Math.round((empiric/upperEmpiric)*100)+"%";
        $("#scaleVal").css("width",scaleVal);
        $("#score").html(score);
        $("#score1").html(empiric);
        $("#grade").html("Lv."+grade);
        $("#gradesName").html(gradesName);
        $("#upperEmpiric").html(upperEmpiric);
        if(imgurl){
            $("div.lazy").data("original", constant.IMG_URL + imgurl)
             $("div.lazy").lazyload({
                 cache : true,
                callBack : function(path,s){
                    s.dom.css('background-image','url("' + path + '")');
                    s.dom.empty();
                }
             });
        }
    }
})

var myPointViewInstance = new myPointView;
