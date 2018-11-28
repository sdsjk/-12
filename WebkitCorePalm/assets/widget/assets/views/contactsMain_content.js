var STR_CONTACTS_MESSAGE_TO = tools.getString("STR_CONTACTS_MESSAGE_TO");
var STR_CONTACTS_CALL_TO = tools.getString("STR_CONTACTS_CALL_TO");
var STR_MENU = tools.getString("STR_MENU");
var BTN_CANCEL = tools.getString("BTN_CANCEL");


var contactsInfoView = Backbone.View.extend({//options...
    initialize : function() {
        try{
        this.model = new userInfoModel({}, {
                    userId : appcan.getLocVal(storeKey.PERSON_ID) || localStorage.getItem(storeKey.PERSON_ID)
                });
        this.updateData();
        this.listenTo(this.model, "change", this.updateData);
        }catch(e){errorDetail(e)}
        return this;
    },
    el : '#userInfo',
    load : function() {
        appcan.frame.resetBounce(0);
        return;
        var staffId = appcan.getLocVal(storeKey.PERSON_ID);
        this.model.fetch({
            success : function(model, resp, options) {
                appcan.frame.resetBounce(0);
            },
            error : function(model, error, options) {
                appcan.frame.resetBounce(0);
            },staffId:staffId
        });
    },
    updateData : function(a,b){
        try{
        var  info = this.model.toJSON();
        var imgIcon = info.userIcon;
        var fullName = info.fullName;
        var department=info.department&&info.department[0]&&info.department[0].dptName || info.dptName || "";//职位
        var roleName=info.position&&info.position[0]&&info.position[0].roleName || info.roleName || "";//职位
        var leader=info.leader&&info.leader[0]&&info.leader[0].ldrFullName || info.ldrFullName || "";//上级
        appcan.setLocVal(storeKey.CONTACT_ICON, imgIcon);
        var lastNameStr = '';
        var lastName = fullName.substring((fullName.length)-1,fullName.length);
        var firstName = fullName[0];
        var lastNameSP = shouPin.getCamelChars(lastName);
        lastNameStr = '<div style="font-size:1.5em;text-align:center;color:#ffffff;">'+firstName+'</div>';
        $('div.lazy').css("background-color",generateColor(lastNameSP));
        $('div.lazy').html(lastNameStr);
        if(imgIcon){
            $("div.lazy").data("original", constant.IMG_URL + imgIcon);
             appcan.ready(function(){
                 $("div.lazy").lazyload({
                    cache : true,
                    callBack : function(path,s){
                        s.dom.css('background-image','url("' + path + '")');
                        s.dom.empty();
                    }
                 });  
             })
        }
        appcan.setLocVal(storeKey.CONTACT_NAME, fullName);
        $("#fullName").html(fullName);
        var userId = info.userId;
        appcan.setLocVal(storeKey.PERSON_ID, userId);
        $("#userId").html(userId);
        $("#roleName").html(roleName);
        department =department.split(',');
         var conment='';
         for(var i=0;i<department.length;i++){
             conment+='<p>'+department[i]+'</p>'
         }
        $('#department').html(conment);
        if(!isDefine(info.teleNo)){
           $("#teleNo").html("　"); 
        }else{
          $("#teleNo").html(info.teleNo);  
        }
        if(isDefine(info.teleNo2)){
            $("#teleNo2").html(info.teleNo2);  
        }
        if(!isDefine(info.mobileNo)){
           $("#mobileNo").html("　"); 
        }else{
           $("#mobileNo").html(info.mobileNo); 
        }
        if(!isDefine(info.jqNum)){
            $('#jqNum').html(" ");
        }else{
            $('#jqNum').html(info.jqNum);
        }
        if(!isDefine(info.email)){
           $("#email").html("　"); 
        }else{
           $("#email").html(info.email); 
        }
        $("#leader").html(leader);
        this.bindingEvent();
        }catch(e){
            errorDetail(e);
        }
    },
    bindingEvent:function(){
        var self = this;
        
        appcan.button("#mobile", "btn-act", function() {
            var phone = self.model.get("mobileNo");
            if (isDefine(phone)) {
                uexWindow.cbActionSheet = function(a, b, data) {
                    if(phone.length>11){
                        var arr = phone.match(/\d+(\.\d+)?/g);
                        var phone1 = arr[0];
                        var phone2 = arr[1];
                        if (data == "0" ) {//发短信
                            uexSMS.open(phone1, "");
                        } else if (data == "1") {//发短信
                            uexSMS.open(phone2, "");
                        }else if (data == "2") {//打电话
                            uexCall.dial(phone1);
                        }else if (data == "3") {//打电话
                            uexCall.dial(phone2);
                        }
                    }else{
                        if (data == "0") {//发短信
                            uexSMS.open(phone, "");
                        } else if (data == "1") {//打电话
                            uexCall.dial(phone);
                        }
                    }
                };
                var str = [STR_CONTACTS_MESSAGE_TO + phone + "", STR_CONTACTS_CALL_TO + phone + ""];
                if(phone.length>11){
                    var arr = phone.match(/\d+(\.\d+)?/g);
                    str = [
                        STR_CONTACTS_MESSAGE_TO + arr[0] + "",
                        STR_CONTACTS_MESSAGE_TO + arr[1] + "",
                        STR_CONTACTS_CALL_TO + arr[0] + "",
                        STR_CONTACTS_CALL_TO + arr[1] + ""
                    ];
                }
                uexWindow.actionSheet(STR_MENU, BTN_CANCEL, str);
            }
        })

        appcan.button("#youxiang","btn-act",function(){
            var email = self.model.get("email")
            if (isDefine(email)) {
                uexEmail.open(email,"","",""); 
            }
        })
        appcan.button("#phone","btn-act",function(){
            var teleNo = self.model.get("teleNo2")
            if (isDefine(teleNo)) {
                uexCall.dial(teleNo);
            }
        })
        appcan.button("#phone2","btn-act",function(){
            var teleNo = self.model.get("teleNo")
            if (isDefine(teleNo)) {
                uexCall.dial(teleNo);
            }
        })
        
        appcan.button("#gerenxinxi","btn-act",function(){
            var info = self.model.toJSON();
            var imgIcon = info.userIcon;
            if(imgIcon){
                var param = {
                    displayActionButton: false,
                    displayNavArrows: false,
                    enableGrid: false,
                    startIndex: 0,
                    data: [{
                        src:imgIcon
                    }]
                };
                var data=JSON.stringify(param);
                uexImage.openBrowser(data);
            }
        })
    }
});
var contactsInfoViewInstance = new contactsInfoView();
