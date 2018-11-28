var STR_MALE = tools.getString("STR_MALE"),
    STR_FEMALE = tools.getString("STR_FEMALE"),
    STR_TAKE_PICTURES = tools.getString("STR_TAKE_PICTURES"),
    STR_PHOTOS = tools.getString("STR_PHOTOS"),
    STR_RESTORE_HEAD_ICON = tools.getString("STR_RESTORE_HEAD_ICON"),
    STR_MENU = tools.getString("STR_MENU"),
    BTN_CANCEL = tools.getString("BTN_CANCEL"),
    STR_SUBMITTING = tools.getString("STR_SUBMITTING"),
    STR_INFO_UPDATED = tools.getString("STR_INFO_UPDATED");
var dptNameId = $('#dptName'),
    phoneId = $('#phone');
var personCenterView = Backbone.View.extend({//options...
    initialize : function() {
        try{
            var staffId = appcan.getLocVal("userId") || localStorage.getItem('userId');            
            this.model = new userInfoModel({}, {
                        userId : staffId
                    });
            this.updateData();
            this.listenTo(this.model, "change", this.updateData);
        }catch(e){
            ALERT_ERROR("personCenterView","initialize",e.message+'--'+e.stack)
        }
    },
    el : '#userInfo',
    load : function() {
        var staffId = appcan.getLocVal("userId");
        var self = this;
       self.model.fetch({
            success : function(model, resp, options) {
                self.updateData()
                appcan.window.closeToast();
                appcan.frame.resetBounce(0);
                // 神策插件记录数据处理结束时间
                var paramTrackTimerHandleDataEnd = FunParamTrackTimerEnd("数据处理","个人中心","","","false");
                uexSensorsAnalytics.trackTimerEnd(JSON.stringify(paramTrackTimerHandleDataEnd));
            },
            error : function(model, error, options) {
                appcan.frame.resetBounce(0);
                appcan.window.closeToast();
            },staffId:staffId
        });
    },
    modelSet: function () {
        this.bindingEvents();
    },
    updateData : function(){
        var  info = this.model.toJSON();
        if(JSON.stringify(info) == "{}"){
            appcan.window.publish('PERSONINFO-ANGIN','');
            return;
        }
        
        appcan.setLocVal(storeKey.PERSON_INFO, JSON.stringify(info));
        var imgIcon = info.userIcon;
        var uname = info.fullName;
        var roleName = info.roleName;
        var orgName = info.dptName;
        var mobileNo = info.mobileNo;
        var teleNo2 = info.teleNo2; //外线
        var teleNo = info.teleNo; //内线
        var jqNum = info.jqNum;//集群号
        var email = info.email;
        var userSex = info.sexId;
        var myReg = /\d+|\-+/g;
        var dptName = '';        
        if(orgName){
            //var orgName = '营销服务支持室,管理决策支持室,安全运行室';
            var content = '';
            var orgNames = orgName.split(",");            
            if(orgNames.length<2){
                 var orgNameArr = orgNames[0].split("/");
                    dptName = orgNameArr[orgNameArr.length - 1];                    
                    content = '<p>'+dptName+'</p>';  
                    dptNameId.html(content);
            }else{               
               for(var i=0;i<orgNames.length;i++){
                    var dptNameArr = orgNames[i].split("/");                                            
                    dptName = dptNameArr[dptNameArr.length-1];
                    content+= '<p>'+dptName+'</p>';
               } 
               dptNameId.html(content);              
            }
        }else{
            appcan.window.alert({
                title:'提示',
                content:'登录已失效，请重新登录！',
                buttons:['确定'],
                callback:function (err, data, dataType, optId) {
                    var rootCheck = appcan.getLocVal("rootCheck") || '';
                    var indexList = appcan.getLocVal('CUSTOM-INDEX') || '';//置顶后位置缓存
                    var delList = appcan.getLocVal('DEL-MODULE') || '';
                        appcan.locStorage.remove();
                    appcan.setLocVal("rootCheck",rootCheck); //不清除记录首次检测越狱设备
                    appcan.setLocVal('CUSTOM-INDEX',indexList);//不清除置顶后的位置变化数据
                    appcan.setLocVal('DEL-MODULE',delList); //不清除删除后元素ID数据
                    uexEMM.logout();
                    uexXmlHttpMgr.clearCookie(); //清除cookie，解决ios上重新登录mas的sid不更新问题
                }
            });
        }        
        if(mobileNo){
            
            var content = '';
            var reg = /\d+/g;
            mobileNoArr = mobileNo.split(' ');
            for(var i in mobileNoArr){
                mobileNo = mobileNoArr[i].match(reg)[0];                
                content+= '<p>'+mobileNo+'</p>';
            }
            phoneId.html(content);  
        }else{
            phoneId.html('--');
        }
        if(teleNo){                        
            teleNo = teleNo.match(myReg);
            teleNo = teleNo.join('');            
            if(teleNo.length>18){
                teleNo =teleNo.slice(0,18);
            }            
           $('#tel2').html(teleNo); 
        }else{
            $('#tel2').html('--');
        }
        if(teleNo2){
            
            teleNo2 = teleNo2.match(myReg);
            teleNo2 = teleNo2.join('');            
            if(teleNo2.length>18){
                teleNo2 =teleNo.slice(0,18);
            } 
            $('#tel').html(teleNo2);
        }else{
            $('#tel').html('--');
        }
        if(jqNum){
            $('#jqNum').html(jqNum);
        }else{
            $('#jqNum').html('--');
        }
        if(email){
            $('#email').html(email);
        }else{
            $('#email').html(info.userId+'@shenzhenair.com');
        }        
        var lastNameStr = '';
        var backImg = $('div.lazy').css('background-image');
        if(!backImg || backImg=='none' || !imgIcon){
           $('div.lazy').css('background-image','url("css/icons/crmtouxiang.png")');
        }
        if(imgIcon){
            appcan.setLocVal(storeKey.PERSON_INFO_ICON, constant.IMG_URL + imgIcon);
            $("div.lazy").data("original", constant.IMG_URL + imgIcon)
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
    },
    bindingEvents: function () {
        var userId = appcan.getLocVal('userId');
        var self = this;
        appcan.button("#imgurl", "btn-act", function () {
            uexWindow.cbActionSheet = function (a, b, data) {                
                switch (parseInt(data)) {
                    case 0:
                        self.getCam();
                        break;
                    case 1:
                        self.selPic();
                        break;
                }
            };
            var str = [STR_TAKE_PICTURES, STR_PHOTOS];
            uexWindow.actionSheet(STR_MENU, BTN_CANCEL, str);
            //开启神策埋点事件追踪
             var param = {
                        event: 'platformClick',
                        propertieDict: {
                            userId:userId,
                            module:'个人中心',
                            funcName:'头像上传',
                            buttonName:'头像'                               
                        }
              };
              uexSensorsAnalytics.trackWithProperties(JSON.stringify(param));
        })
    },
    getCam: function () {
        var self = this;
        uexCamera.open(0, 30, function(data){
            var param = {
                src: data
            };
            param = JSON.stringify(param);
            uexImage.openCropper(param);
            uexImage.onCropperClosed = function (info) {
                info = JSON.parse(info);
                self.addPic(info.data);
            }
        })
    }, selPic: function () {
        var self = this;
        uexImage.onPickerClosed = function (data) {
            data = JSON.parse(data);
            if (data.isCancelled == false) {
                var param = {
                    src: data.data[0]
                };
                param = JSON.stringify(param);
                uexImage.openCropper(param);
                uexImage.onCropperClosed = function (info) {
                    info = JSON.parse(info);
                    self.addPic(info.data);
                }
            }
            self.showBar();
        };
        var sData = {
            min: 1,
            max: 1
        };
        var json = JSON.stringify(sData);
        uexImage.openPicker(json);
    },
    picNum: 0,
    isUpload:false,
    addPic: function (data) {
        if (data) {
            var self = this;
            this.picNum++;
            self.isUpload = true;
            uploadFileEMM(data, function (serverUrl) {                
                $("#imgurl").css("background-image", "url('" + data + '?' + this.picNum + "')!important").empty();
                $('#imgurl').html("");
                self.model.set({"userIcon": serverUrl}, {silent: true});
                self.isUpload = false;
            },function(){
                self.isUpload = false;
            });
        }
        this.showBar();
    }, showBar: function () {
        if (uexWindow.showStatusBar) uexWindow.showStatusBar();
    }
});
var personCenterViewInstance = new personCenterView();
