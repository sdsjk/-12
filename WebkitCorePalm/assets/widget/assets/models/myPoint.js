var myPointModel = Backbone.Model.extend({
    initialize : function(){
        this.set({});
    },
    parse:function(resp){
      if(resp.msg.item){
          return resp.msg.item;
      } 
      return resp; 
    },
    service : myPointService,
    sync : function(method,model,options){
        switch(method){
            case "create" :{
                break;
            }
            case 'update' : {
                break;
            }
            case "patch" : {
                break;
            }
            case "read" : {
                this.service.request(options);
                break;
            }
            case "delete" : {
                break;
            }
            default :{
                break;
            }
        }
    } 
})
