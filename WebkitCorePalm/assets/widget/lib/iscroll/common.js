var g_basicURL = "http://ima.shenzhenair.com:8100";
var g_masbasicURL = "https://apps.shenzhenair.com/masIn/szair/";



function mScroll(){
    appcan.window.setBounce([0,1],null,null,function(type){
        if(type==0){
           page=1;
           getData()
       }else{
           getData()
       }
   },'rgba(0,0,0,0)',{
       "imagePath":"res://reload.png",
    "textColor":"#530606",
    "pullToReloadText":"下拉刷新",
    "releaseToReloadText":"立即刷新",
    "loadingText":"正在刷新..."
   });
   
   appcan.window.setBounce(1,null,null,function(type){
       if(type==0){
           beginpage=0;
           getData()
       }else{
           if(!nomore){
               getData();
           }else{
               appcan.window.resetBounceView(1)
               appcan.window.hiddenBounceView(1);
           }
           
       }
        
   },'rgba(0,0,0,0)',{
       "imagePath":"res://reload.png",
    "textColor":"#530606",
    "pullToReloadText":"上拉加载更多",
    "releaseToReloadText":"释放后开始加载",
    "loadingText":"加载中..."
       
   });
}



function mScroll2(){
     //准许网页弹动
    uexWindow.setBounce("1");
    //设置弹动效果（向下拉动）
    appcan.window.setBounceParams({
        position:0,
        data:{
            "imagePath":"",
            "textColor":"#aaa",
            "pullToReloadText":"下拉刷新",
            "releaseToReloadText":"释放后开始加载",
            "loadingText":"加载中，请稍等"
        }
    });
    appcan.window.showBounceView("0", '#FFF', '1');

    //设置弹动效果（向上拉动）
    
    appcan.window.setBounceParams({
        position:1,
        data:{
            "imagePath":"",
            "textColor":"#aaa",
            "pullToReloadText":"上拉加载更多",
            "releaseToReloadText":"释放后开始加载",
            "loadingText":"加载中，请稍等"
        }
    });
                
    appcan.window.showBounceView("1", '#FFF', '1');

    //注册接收弹动事件
    uexWindow.notifyBounceEvent("0", "1");
    uexWindow.notifyBounceEvent("1", "1");

    //弹动事件回调
    uexWindow.onBounceStateChange = function(type, state) {
        switch(type) {
        //顶端弹动
        case 0:
            //滑动事件开始
            if (0==state) {
                
            }
            //刷新事件开始
            else if (1==state) {
                beginpage=0;
                getData();
                
            }
            //滑动事件结束
            else if(2==state) {
                
            }
            break;
        //底部弹动
        case 1:
            //滑动事件开始
            if (0==state) {
                
            }
            //刷新事件开始
            else if (1==state) {
                 getData();
            }
            //滑动事件结束
            else if(2==state) {
                
            }
            break;
        }
    }
}



function wsHTTP(url,biz,resolve,reject){
     AppCanAjax([{
        "url": url+biz.functionName,
        "progress": true,
        "timeout": 20000,
        "isLogin": false
    }, biz], function (data) {
        resolve(JSON.parse(data));
    }, function (data) {
        reject(JSON.parse(data));
    });
}

function AppCanAjax(params, successCb, errorCb){
   var obj = params[0];
   var biz = params[1];
   
   var platformName = appcan.widgetOne.getPlatformName();
   var devicetype = platformName=='iOS'? 'iOS_phone':'android_phone';
   var dataObj = {
       "sys": {
           "deviceid": "99000558140631",
           "devicetype": devicetype,
       },
       biz:biz,
       url:obj.url,    
   };
  var url3;
  
   if(biz.functionName.indexOf("login_v11")>-1){
      url3 = g_masbasicURL+'testoa';
   }else{
      url3 = g_masbasicURL+'xmaDetails';
   }
   appcan.ajax({
        url: url3,
        type: 'POST',
        dataType: 'text',
        data: dataObj,
        success: function(data){
            appcan.window.closeToast();
            successCb(data);
            
        },
        error: function(e){
            errorCb(data);
        }
    }); 
}



