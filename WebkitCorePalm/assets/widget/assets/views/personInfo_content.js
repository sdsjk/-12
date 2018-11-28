var personInfoView = Backbone.View.extend({//options...
    initialize : function() {
        try{
            var staffId = appcan.getLocVal("userId");
            this.model = new userInfoModel({}, {
                    userId : staffId
                });
            this.listenTo(this.model, "change", this.updateData);
            this.updateData();
         }catch(e){
            ALERT_ERROR("personInfoView","initialize",e.message+'--'+e.stack)
        }
    },
    el : '#userInfo',
    load : function() {
        try{
        var staffId = appcan.getLocVal("userId");
        this.model.fetch({
            success : function(model, resp, options) {
                appcan.frame.resetBounce(0);
            },
            error : function(model, error, options) {
                appcan.frame.resetBounce(0);
            },staffId:staffId
        });
        }catch(e){
            ALERT_ERROR("personInfoView","load",e.message+'--'+e.stack)
        }
    },
    updateData : function(){
        try{
        var  info = this.model.toJSON();
        appcan.setLocVal(storeKey.PERSON_INFO, JSON.stringify(info));
        var imgIcon = info.userIcon;
        var uname = info.fullName;
        var department=info.department&&info.department[0]&&info.department[0].dptName || info.dptName || "";//职位
        var roleName=info.position&&info.position[0]&&info.position[0].roleName || info.roleName || "";//职位
        var leader=info.leader&&info.leader[0]&&info.leader[0].ldrFullName || info.ldrFullName || "";//上级
        if(imgIcon){
            $("div.lazy").data("original", constant.IMG_URL + imgIcon)
             appcan.ready(function(){
                $("div.lazy").lazyload({
                     cache : true
                 }); 
             })
             
        }
        $("#fullName").html(uname);
        $('#sex').html(sex[info.sexId]);
        $("#position1").html(roleName);
        $("#roleName").html(roleName);
        $('#department').html(department);
        $('#mobileNo').html(info.mobileNo);
        $('#teleNo').html(info.teleNo);
        $('#email').html(info.email);
        }catch(e){
            ALERT_ERROR("personInfoView","updateData",e.message+'--'+e.stack)
        }
    }
});
var personInfoViewInstance = new personInfoView();
