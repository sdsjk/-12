var pointRulesModel = Backbone.Model.extend({
    
})

var pointRulesList = Backbone.Collection.extend({
    model : pointRulesModel,
    service : pointRulesService,
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
            pointRulesService.request(options);
            break;
        case "delete":
            break;
        default:
            break;
        }
    } 
})
