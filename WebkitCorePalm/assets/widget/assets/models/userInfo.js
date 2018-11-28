var STR_ERROR_TIPS_MOBILE_PHONE_NUMBER = tools.getString("STR_ERROR_TIPS_MOBILE_PHONE_NUMBER");
var STR_ERROR_TIPS_TELEPHONE_NUMBER = tools.getString("STR_ERROR_TIPS_TELEPHONE_NUMBER");
var STR_ERROR_TIPS_EMAIL = tools.getString("STR_ERROR_TIPS_EMAIL");

var userInfoModel = Backbone.Model.extend({
    initialize: function(model,option) {
        if(option){
            var userInfo = appcan.getLocVal("CACHE_USERINFO_"+option.userId.toUpperCase()) || localStorage.getItem("CACHE_USERINFO_"+option.userId.toUpperCase()) || '{}';            
            this.set(JSON.parse(userInfo));
             this.on("change",function(){
                 if(userInfo && this.hasChanged("userIcon")){
                     appcan.window.publish("IM_USER_ICON_CHANGE",{userIcon:this.get("userIcon"),userId:option.userId.toLowerCase()});
                 }
             })
            
        }  
    },
    parse : function(resp) {
        try{
        if(resp.msg){
            appcan.setLocVal("CACHE_USERINFO_"+resp.msg.item.userId.toUpperCase(),JSON.stringify(resp.msg.item.entity))
            localStorage.setItem("CACHE_USERINFO_"+resp.msg.item.userId.toUpperCase(),JSON.stringify(resp.msg.item.entity));
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
                return '';
            }
            if (attrs.teleNo && !toolsReg.PHONE_REG.test(attrs.teleNo)) {
                return '';
            }
            if (attrs.email && !toolsReg.EMAIL_REG.test(attrs.email)) {
                return STR_ERROR_TIPS_EMAIL;//"请输入正确的邮箱";
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
