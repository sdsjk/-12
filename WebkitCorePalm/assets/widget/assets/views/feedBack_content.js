var STR_TIPS_STRING_MIN_AND_MAX = tools.getString("STR_TIPS_STRING_MIN_AND_MAX");
var STR_FEEDBACK_SUCCESS = tools.getString("STR_FEEDBACK_SUCCESS");
var STR_SUBMITTING = tools.getString("STR_SUBMITTING");
var STR_SERVER_MESSAGEERROR = tools.getString("STR_SERVER_MESSAGEERROR");
var STR_NETWORDERROR = tools.getString("STR_NETWORDERROR");
var imagePathArr = [];

//图片上传
var dirPathArr = [];
var numArr = [];
var isNum = 0;
function uploadImgEMM(dirPath, cb, err) {
            
            if(isAndroid){
                
                dirPathArr.push(dirPath);
            }
                    
            var num = appcan.getOptionId();//生成随机数   
            if(isAndroid){
                
                numArr.push(num);
            } 
            
            var lastPercent = -1;            
            uexUploaderMgr.onStatus = function (opCode, fileSize, percent, serverPath, status) {
                switch (status) {
                    case 0:
                    if (lastPercent != parseInt(percent) && (parseInt(percent) - lastPercent) >= 5) {
                        //上传中
                        
                        $('.failIcon').addClass('uhide'); 
                        $('.percentage').html(percent+'%');                       
                        lastPercent = percent;
                        
                    }

                    break;
                    case 1:
                    var data = eval('(' + serverPath + ')');                                        
                    if (data.status == 'ok') {
                         
                        $('.percentage').addClass('uhide');                      
                        cb(data.imagePath);
                    } else {
                        
                         $('.failIcon').removeClass('uhide'); 
                         $('.percentage').addClass('uhide');                                                                                                                                             
                        if(err){err()}
                    }
                    uexUploaderMgr.closeUploader(num);
                    lastPercent = -1;
                    break;
                    case 2:
                                                                  
                    $('.failIcon').removeClass('uhide');
                    $('.percentage').addClass('uhide');
                    if(err){err()}
                    uexUploaderMgr.closeUploader(num);
                    lastPercent = -1;
                    break;
            }
        };
        uexUploaderMgr.cbCreateUploader = function (opCode, dataType, data) {            
            
            if (data == 0) {
                lastPercent = -1;
                
                isNum++;
                var emmToken = JSON.parse(appcan.getLocVal("emmToken"));
                var tenantId = emmToken.info.tenantId || "";
                var headerParam = {
                    "x-mas-app-id": appId,
                    tenantId: tenantId + ''
                };   
                uexUploaderMgr.setHeaders(num,get_header());
                 
                if(isAndroid){
                    
                    uexUploaderMgr.uploadFile(numArr[isNum-1], dirPathArr[isNum-1], 'image', 1);
                } else {
                    
                    uexUploaderMgr.uploadFile(num, dirPath, 'image', 1);
                }              
                
            } else {
                var STR_FILE_UPLOAD_FAIL = tools.getString("STR_FILE_UPLOAD_FAIL");
                appcan.window.openToast(STR_FILE_UPLOAD_FAIL, 3000, 5);
                if(err){err()}
                    lastPercent = -1;
            }
        };
        
        
        var uploadHttpEMM = config.server_emm+'suggestion/saveThumbImage';
        uexUploaderMgr.createUploader(num, uploadHttpEMM);
}

//拍照
function getCam(){
    uexCamera.open(0, 30, function(data){
            var pathArr = [];
            var param = {
                src: data
            };
            param = JSON.stringify(param);
            uexImage.openCropper(param);
            uexImage.onCropperClosed = function (info) {
                
                info = JSON.parse(info);
                pathArr.push(info.data);                                
                self.addPic(pathArr);
            }
    })
}

//相册

function selPic(){
    uexImage.onPickerClosed = function (data) {
            var pathArr = [];            
            data = JSON.parse(data);
            var arr = data.data;
            if (data.isCancelled == false) {
                
                if(arr.length>=1){
                    
                    for(var i in arr){
                           
                         pathArr.push(arr[i]);
                        
                    }
                    
                    
                    addPic(pathArr); 
                   
                                                                                                    
                }
                
            }
            self.showBar();
        };

        var sData = {
            min: 1,
            max: 3
        };
        var json = JSON.stringify(sData);
        uexImage.openPicker(json);
}

//添加图片
var picNum = 0;
var isUpload = false;
var uploadArr = [];
var addNum=0;
function addPic(data){
   
    var arr = data;
    
    uploadArr = uploadArr.concat(data);
    if(uploadArr.length<=3){       
           if (data && 0<data.length<3) {
                var self = this;
                picNum++;                
                for(var i in data){
                    
                    self.isUpload = true;
                    var id = '';
                    
                    var n = i;
                        n = parseFloat(n);
                    
                    var num = '';
                    if(data.length == 1){
                         
                         id = picNum+'_uploads_1';
                         
                    }else if(data.length == 2){
                         num = parseInt(n+1);
                         id = num+'_uploads_2';
                         
                    }else{
                         num = parseInt(n+1);
                         id = num+'_uploads_3';
                         
                    }
                    
                    var content = '';
                        content+='<div style="position: relative" class="umar-r uploadImg">'
                                        +'<div class="umh6 umw4 feedbackImgbg  ub-img4" style="background-image:url("")" data-original="" id="'+id+'">'                                                    
                                          +'<p class="percentage bc-text-head ulev-4"></p>'
                                          +'<div class="umh3 umw1-5 failIcon_position ub-img uhide failIcon"></div>'
                                        +'</div>'
                                        +'<span class="uabs-r delBtn ub-img delIcon uhide" ></span>' 
                                  +'</div>';
                     $('#imgShow').append(content); 
                    uploadImgEMM(data[i], function (serverUrl) {
                         
                        setTimeout(function(){
                             if(serverUrl){                            
                                var imgIcon = config.imgUrl_service+serverUrl;
                                
                                    var imgId = '';
                                    
                                    if(data.length == 1){
                                                                             
                                         imgId = picNum+'_uploads_1';
                                         
                                         $('#'+imgId).css('background-image','url("'+imgIcon+'")');
                                         $('#'+imgId).data('original',imgIcon);
                                    }else if(data.length == 2){
                                         addNum++;
                                         
                                         imgId = addNum+'_uploads_2';
                                         
                                         $('#'+imgId).css('background-image','url("'+imgIcon+'")');
                                         $('#'+imgId).data('original',imgIcon);
                                         
                                    }else{
                                         addNum++;
                                         imgId= addNum+'_uploads_3';
                                         
                                         $('#'+imgId).css('background-image','url("'+imgIcon+'")');
                                         $('#'+imgId).data('original',imgIcon);
                                                                             
                                    }                                                            
                             } 
                         },200);                      
                                                                                                                                 
                        if(imgIcon){
                            appcan.ready(function(){
                                $("#imgShow>div>.feedbackImgbg").lazyload({
                                     cache : true,
                                    callBack : function(path,s){
                                        s.dom.css('background-image','url("' + path + '")');
                                        s.dom.empty();
                                    }
                                 });
                            })
                        }
                                                              
                        isUpload = false;
                      
                    },function(){
                        isUpload = false;
                    });
                }                                    
            }
            this.showBar();
     }else{
         appcan.window.alert({
                title:'提示',
                content:'只允许上传3张图片',
                buttons:['确定'],
                callback:function (err, data, dataType, optId) {
                    if(!err){
                        for(var i in arr){
                            var index = uploadArr.indexOf(arr[i]);
                            uploadArr.splice(index,1);
                        }
                    }
                }
         });
     }
}
function showBar(){
    if (uexWindow.showStatusBar) uexWindow.showStatusBar();
}

function feedBackSubit(){
    var liuyNeiR=$("#liuyneir").val();//留言内容      
    var isEmoji = isEmojiCharacter(liuyNeiR);
    if(isEmoji){
        appcan.window.alert({
                 title:'提示',
                 content:'提交的内容不能包含表情符号！',
                 buttons:['确定'],
                 callback:function (err, data, dataType, optId) {
                        if(!err){
                         }
                 }
        });
        isClick = true;
        return;
    }   
    var ele = document.getElementsByClassName('feedbackImgbg');
    if(!isDefine(liuyNeiR)||liuyNeiR.length<10||liuyNeiR.length>200){
          isClick = true;
          appcan.window.openToast(STR_TIPS_STRING_MIN_AND_MAX, 1500, 5);
          return;
    }
    appcan.window.openToast(STR_SUBMITTING);
    if(ele){
        try{
            for(var i=0;i<ele.length;i++){
                   
                    
                    var imgPath = ele[i].getAttribute('data-original');                                        
                    imagePathArr.push(imgPath);
            }
            imagePathArr = imagePathArr.join(',');
        }catch(error){
            
        } 
    }
    
    var persenelId= JSON.parse(appcan.getLocVal('EPortal-UserInfo')).persenelId;    
    var appId = config.appId;    
    var themeContent = liuyNeiR;           
    var url = config.server_emm+'suggestion/saveSuggestionAndImage';  
    if(imagePathArr){
        var data = {                                 
               appId: appId,
               themeContent:themeContent,
               personId: persenelId,
               imagePath: imagePathArr                     
        };
    }else{
        var data = {                                 
               appId: appId,
               themeContent:themeContent,
               personId: persenelId                                                       
        };
    }
    // 神策插件记录接口请求开始时间
    uexSensorsAnalytics.trackTimerBegin(JSON.stringify(paramTrackTimerStart));
    // 数据处理结束时间参数
    var paramTrackTimerHandleDataEnd = FunParamTrackTimerEnd("接口请求","个人中心","saveSuggestionAndImage");
     
     appcan.request.ajax({
              url:url,
              type : 'POST',
              dataType : 'json',
              data: data,
              success:function(data){
                   // 神策插件记录数据处理结束时间
                    uexSensorsAnalytics.trackTimerEnd(JSON.stringify(paramTrackTimerHandleDataEnd));
                   
                  try{
                     
                     if(data.status=="ok"){
                          
                          appcan.window.openToast(STR_FEEDBACK_SUCCESS, 1500, 5);
                          appcan.window.publish("fankuiSucc","");
                     }else{
                          
                          isClick = true;
                          appcan.window.openToast('提交失败，请稍后重试！',1500,5); 
                     }
                 }catch(error){
                     appcan.window.closeToast();
                     appcan.window.openToast(STR_NETWORDERROR, 1500, 5);
                 }          
              },
              error:function(error){
                    
                    isClick = true;
                    appcan.window.closeToast();
                    appcan.window.openToast(STR_NETWORDERROR, 1500, 5); 
                    // 神策插件记录数据处理结束时间
                    uexSensorsAnalytics.trackTimerEnd(JSON.stringify(paramTrackTimerHandleDataEnd));       
              }
     });
}
