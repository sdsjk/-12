var STR_LOADING_SHORT = tools.getString("STR_LOADING_SHORT");
var STR_NODATA = tools.getString("STR_NODATA");

//岗位职责
var jobDutiesModel = Backbone.Model.extend({
    initialize : function(id) {
        this.set({
            "dptId": STR_LOADING_SHORT,
            "dptName": STR_LOADING_SHORT,
            "postId": STR_LOADING_SHORT,
            "postName": STR_LOADING_SHORT,
            "jobDuty": STR_LOADING_SHORT,
            "keyKpl": STR_LOADING_SHORT
        });
        this.service = jobDutiesService;
        this.listenTo(this.service, "error", function (list) {
        })
    },
    /**
     *service返回处理,为前端取值减少层级 
 * @param {Object} resp
     */
    parse : function(resp) {
        var rep;
        if(resp.msg&&resp.msg.item){
            rep=resp.msg.item;
        }else if(resp.msg){
            //如果没有职责的话，写死对象，这个service改还是model改都可以
            rep = {
                "dptId": STR_NODATA,
                "dptName": STR_NODATA,
                "postId": STR_NODATA,
                "postName": STR_NODATA,
                "jobDuty": STR_NODATA,
                "keyKpl": STR_NODATA
            }
        }
        return rep;
    },
    sync : function(method, model, options) {
        switch(method) {
        case "create":
        case "update":
        case "patch":
            break;
        case "read":
            this.service.request({}, options);
            break;
        case "delete":
            break;
        default:
            break;
        }
    }
})
