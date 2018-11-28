var pointGradeModel = Backbone.Model.extend({
    
})

var pointGradeList = Backbone.Collection.extend({
    model : pointGradeModel,
    service : pointGradeService,
    parse : function(resp) {
        return resp.msg.list;
    },
    sync : function(method, model, options) {
        switch(method) {
        case "create":
            break;
        case "update":
            break;
        case "patch":
            break;
        case "read":
            this.service.request(options);
            break;
        case "delete":
            break;
        default:
            break;
        }
    } 
})
