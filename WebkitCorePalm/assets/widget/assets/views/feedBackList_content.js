var STR_LOADING = tools.getString("STR_LOADING");

//意见反馈列表数据
function feedBackList(page){ 
       
    var appId = config.appId;
    var persenelId = JSON.parse(appcan.getLocVal('EPortal-UserInfo')).persenelId;
    var url = config.server_emm+'suggestion/'+appId+'/getSuggestionList?page='+page+'&rows=10&'+'author='+persenelId;
    // 神策插件记录接口请求开始时间
    uexSensorsAnalytics.trackTimerBegin(JSON.stringify(paramTrackTimerStart));
    // 神策插件接口结束时间参数
    var paramTrackTimerHandleDataEnd = FunParamTrackTimerEnd("接口请求","个人中心","getSuggestionList");
    appcan.request.ajax({
        url: url,
        type: 'GET',
        headers: getHeaders(),
        contentType: 'application/x-www-form-urlencoded',
        timeout: "30000",
        data: {},
        success:function(data, status, xhr){
            // 神策插件记录接口请求结束时间
            uexSensorsAnalytics.trackTimerEnd(JSON.stringify(paramTrackTimerHandleDataEnd));
            $('#feedBacklist').removeClass('uhide');            
            appcan.frame.resetBounce(0);
            appcan.frame.resetBounce(1);
            var isSearch = false;           
            var obj = JSON.parse(data);            
            if(obj.status == "0"){
                if(obj.total > 0){
                   var arr = obj.data;                   
                   tabView(arr); 
                   var ev = {
                       page:page,
                       msgLength:arr.length
                   };
                   $('#norecord').addClass('uhide');
                   appcan.window.publish('FEEDBAC-SETBOUNCE',JSON.stringify(ev));
                }else{
                    $('#norecord').removeClass('uhide');
                } 
            }else{
                appcan.window.openToast('网络连接正忙，请稍后重试！',2000,5);
            }
        },
        error:function(data){
            // 神策插件记录接口请求结束时间
            uexSensorsAnalytics.trackTimerEnd(JSON.stringify(paramTrackTimerHandleDataEnd));
        }
    });
}

//意见反馈列表数据-加载更多
function feedBackList2(page){ 
    appcan.window.openToast(STR_LOADING,2000,5);  
    var appId = config.appId;
    var persenelId = JSON.parse(appcan.getLocVal('EPortal-UserInfo')).persenelId;
    var feedBacklistHeight = $('#feedBacklist').height();
    var url = config.server_emm+'suggestion/'+appId+'/getSuggestionList?page='+page+'&rows=10&'+'author='+persenelId;
    // 神策插件记录接口请求开始时间
    uexSensorsAnalytics.trackTimerBegin(JSON.stringify(paramTrackTimerStart));
    // 神策插件接口结束时间参数
    var paramTrackTimerHandleDataEnd = FunParamTrackTimerEnd("接口请求","个人中心","getSuggestionList");
    appcan.request.ajax({
        url: url,
        type: 'GET',
        headers: getHeaders(),
        contentType: 'application/x-www-form-urlencoded',
        timeout: "30000",
        data: {},
        success:function(data, status, xhr){
            // 神策插件记录接口请求结束时间
            uexSensorsAnalytics.trackTimerEnd(JSON.stringify(paramTrackTimerHandleDataEnd));
            appcan.window.closeToast();
            appcan.frame.resetBounce(0);
            appcan.frame.resetBounce(1);           
            var obj = JSON.parse(data);                        
            if(obj.status == "0"){
                if(obj.total > 0){
                   var arr = obj.data;                   
                   tabView2(arr);
                   var ev = {
                       page:page,
                       msgLength:arr.length
                   };
                   appcan.window.publish('FEEDBAC-SETBOUNCE',JSON.stringify(ev)); 
                   
                   try {
                        // 暂无更多数据
                        if (arr.length < 10) {
                           setTimeout(function(){
                               
                               $('body').scrollTop(feedBacklistHeight);
                           },0)
                        } else {
                            setTimeout(function(){
                               
                                $('body').scrollTop(feedBacklistHeight);
                            },0)
                        }
                   } catch (e) {
                    
                   } 
                }else{
                    appcan.window.closeToast();
                    $('#norecord').removeClass('uhide');
                } 
            }else{
                appcan.window.closeToast();
                appcan.window.openToast('网络连接正忙，请稍后重试！',2000,5);
            }
        },
        error:function(data){
            appcan.window.closeToast();
            // 神策插件记录接口请求结束时间
            uexSensorsAnalytics.trackTimerEnd(JSON.stringify(paramTrackTimerHandleDataEnd));
        }
    });
}

//意见反馈列表view
var jsonObj = {};
function tabView(arr){           
       var json = arr;
       var tmpHtml = $('#tmpFeedBacklist').html();
       var listVeiwTmpl = appcan.view.template(tmpHtml);
       var $con = $('#feedBacklist ul');
       $con.html('');
       for(var i in json){
            var obj = json[i];
            var time = obj.createdAt;
                
            time = NYRHM(time);
                  
            obj.createdAt = time;                              
            var ele = $(listVeiwTmpl({
                  data:obj
            }));
            $con.append(ele);            
            jsonObj[obj.id] = obj;
            appcan.button('#'+obj.id,'act-btn',function(){
                    
                 var id = this.id;
                 var dataObj = jsonObj[id];
                 appcan.window.open('feedBackDetail','feedBackDetail.html',10);
                    
                  appcan.setLocVal('FEEDBACKDETAIL-JSON',JSON.stringify(dataObj));
		  localStorage.setItem('FEEDBACKDETAIL-JSON',JSON.stringify(dataObj));
            });
       } 
}

var jsonObj = {};
function tabView2(arr){           
       var json = arr;
       var tmpHtml = $('#tmpFeedBacklist').html();
       var listVeiwTmpl = appcan.view.template(tmpHtml);
       var $con = $('#feedBacklist ul');
       
       for(var i in json){
            var obj = json[i];
            var time = obj.createdAt;
                
            time = NYRHM(time);
                  
            obj.createdAt = time;                              
            var ele = $(listVeiwTmpl({
                  data:obj
            }));
            $con.append(ele);            
            jsonObj[obj.id] = obj;
            appcan.button('#'+obj.id,'act-btn',function(){
                    
                 var id = this.id;
                 var dataObj = jsonObj[id];
                 appcan.window.open('feedBackDetail','feedBackDetail.html',10);
                    
                  appcan.setLocVal('FEEDBACKDETAIL-JSON',JSON.stringify(dataObj));
		  localStorage.setItem('FEEDBACKDETAIL-JSON',JSON.stringify(dataObj));
            });
       } 
}

//意见反馈搜索数据
function FeedBackSearch(page){
    
    appcan.window.openToast(STR_LOADING,2000,5);
    var appId = config.appId;
    var persenelId = JSON.parse(appcan.getLocVal('EPortal-UserInfo')).persenelId;
    var content = $('#my_feedBack').val();    
    var url = config.server_emm+'suggestion/'+appId+'/getSuggestionList?content='+encodeURIComponent(content)+'&page='+page+'&rows=10&author='+persenelId;    
    // 神策插件记录接口请求开始时间
    uexSensorsAnalytics.trackTimerBegin(JSON.stringify(paramTrackTimerStart));
    // 神策插件接口结束时间参数
    var paramTrackTimerHandleDataEnd = FunParamTrackTimerEnd("接口请求","个人中心","getSuggestionList");
    appcan.request.ajax({
        url: url,
        type: 'GET',
        headers: getHeaders(),
        contentType: 'application/x-www-form-urlencoded',
        timeout: "30000",
        data: {},
        success:function(data, status, xhr){
            // 神策插件记录接口请求结束时间
            uexSensorsAnalytics.trackTimerEnd(JSON.stringify(paramTrackTimerHandleDataEnd));
            var obj = JSON.parse(data);
            if(obj.status == "0"){
                if(obj.total > 0){
                   var isSearch = true;
                   var arr = obj.data;                   
                   tabView(arr);
                   var ev = {
                       page:page,
                       msgLength:arr.length
                   };
                   appcan.window.publish('FEEDBAC-SETBOUNCE',JSON.stringify(ev)); 
                   appcan.window.closeToast();
                }else{
                    appcan.window.closeToast();
                    appcan.window.disableBounce();
                    $('#feedBacklist').addClass('uhide');
                    $('#norecord').removeClass('uhide');
                } 
            }else{
                appcan.window.closeToast();
                $('#feedBacklist').addClass('uhide');
                appcan.window.openToast('网络连接正忙，请稍后重试！',2000,5);
            }
        },
        error:function(data){
            appcan.window.closeToast();
            // 神策插件记录接口请求结束时间
            uexSensorsAnalytics.trackTimerEnd(JSON.stringify(paramTrackTimerHandleDataEnd));
        }
    });
}

//意见反馈搜索数据
function FeedBackSearch2(page){
    
    appcan.window.openToast(STR_LOADING,2000,5);
    var appId = config.appId;
    var persenelId = JSON.parse(appcan.getLocVal('EPortal-UserInfo')).persenelId;
    var content = $('#my_feedBack').val();      
    
    var feedBacklistHeight = $('#feedBacklist').height();  
    var url = config.server_emm+'suggestion/'+appId+'/getSuggestionList?content='+encodeURIComponent(content)+'&page='+page+'&rows=10&author='+persenelId;    
    // 神策插件记录接口请求开始时间
    uexSensorsAnalytics.trackTimerBegin(JSON.stringify(paramTrackTimerStart));
    // 神策插件接口结束时间参数
    var paramTrackTimerHandleDataEnd = FunParamTrackTimerEnd("接口请求","个人中心","getSuggestionList");
    appcan.request.ajax({
        url: url,
        type: 'GET',
        headers: getHeaders(),
        contentType: 'application/x-www-form-urlencoded',
        timeout: "30000",
        data: {},
        success:function(data, status, xhr){
            // 神策插件记录接口请求结束时间
            uexSensorsAnalytics.trackTimerEnd(JSON.stringify(paramTrackTimerHandleDataEnd));
            appcan.window.closeToast();
            appcan.frame.resetBounce(0);
            appcan.frame.resetBounce(1);
            var obj = JSON.parse(data);
            
            if(obj.status == "0"){
                if(obj.total > 0){
                   var isSearch = true;
                   var arr = obj.data;                   
                   tabView2(arr);
                   var ev = {
                       page:page,
                       msgLength:arr.length
                   };
                   appcan.window.publish('FEEDBAC-SETBOUNCE',JSON.stringify(ev)); 
                   
                   try {
                        // 暂无更多数据
                        if (arr.length < 10) {
                           setTimeout(function(){
                               
                               $('body').scrollTop(feedBacklistHeight);
                           },0)
                        } else {
                            setTimeout(function(){
                                
                                $('body').scrollTop(feedBacklistHeight);
                            },0)
                        }
                   } catch (e) {
                    
                   }
                }else{
                    appcan.window.closeToast();
                    $('#norecord').removeClass('uhide');
                } 
            }else{
                appcan.window.closeToast();
                appcan.window.openToast('网络连接正忙，请稍后重试！',2000,5);
            }
        },
        error:function(data){
            appcan.window.closeToast();
            // 神策插件记录接口请求结束时间
            uexSensorsAnalytics.trackTimerEnd(JSON.stringify(paramTrackTimerHandleDataEnd));
        }
    });
}


