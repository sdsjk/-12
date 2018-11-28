var STR_ERROR_TIPS_MOBILE_PHONE_NUMBER = tools.getString("STR_ERROR_TIPS_MOBILE_PHONE_NUMBER");
var STR_ERROR_TIPS_TELEPHONE_NUMBER = tools.getString("STR_ERROR_TIPS_TELEPHONE_NUMBER");
var STR_ERROR_TIPS_EMAIL = tools.getString("STR_ERROR_TIPS_EMAIL");

var userInfoModel = Backbone.Model.extend({
    initialize: function(model,option) {
        if(option){
            var userInfo = appcan.getLocVal("CACHE_USERINFO_"+option.userId.toUpperCase()) || '{}';
            this.set(JSON.parse(userInfo));
            this.on("change",function(){
                appcan.setLocVal("CACHE_USERINFO_"+option.userId.toUpperCase(),JSON.stringify(this.toJSON()))
                if(userInfo && this.hasChanged("userIcon")){
                     appcan.window.publish("IM_USER_ICON_CHANGE",{userIcon:this.get("userIcon"),userId:option.userId.toLowerCase()});
                }
            })
            
        }  
    },
    parse : function(resp) {
        try{
        if(resp.msg){
            return resp.msg.item.entity;
        }else{
            return resp;
        }
        }catch(e){
            ALERT_ERROR("userInfoModel","parse",e.message+'--'+e.stack)
        }
    },
    validate: function (attrs, options) {
        try {
            if (attrs.mobileNo && !toolsReg.TEL_REG.test(attrs.mobileNo)) {
                return STR_ERROR_TIPS_MOBILE_PHONE_NUMBER;
            }
            if (attrs.teleNo && !toolsReg.PHONE_REG.test(attrs.teleNo)) {
                return STR_ERROR_TIPS_TELEPHONE_NUMBER;
            }
            if (attrs.email && !toolsReg.EMAIL_REG.test(attrs.email)) {
                return STR_ERROR_TIPS_EMAIL;
            }
        } catch (e) {
            ALERT_ERROR("userInfoModel", "validate", e.message + '--' + e.stack)
        }
    },
    sync : function(method, model, options) {
        try{
        switch(method) {
        case "create":
        case "update":
        case "patch":
        
            userInfoService.requestSubmit(this.toJSON(), options);
           
            break;
        case "read":
            userInfoService.request({}, options);
            break;
        case "delete":
            break;
        default:
            break;
        }
        }catch(e){
            ALERT_ERROR("userInfoModel","sync",e.message+'--'+e.stack)
        }
    }
})
