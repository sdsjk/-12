var zdList = [];
var customAppList = [];
var zhidingList = {};
var customObj = {};//获取精品应用
function greatAppList(){

        var zdListCache = appcan.getLocVal('ZHIDING-APPS');
        var zdListCache = JSON.parse(zdListCache);
        var customGreatApp = appcan.getLocVal('CUSTOM-GREATAPPS');
		var customGreatApp = JSON.parse(customGreatApp);       
        var softToken = appcan.getLocVal('emmSoftToken');
        var accessToken = appcan.getLocVal('emmAccessToken'); 
        var url = config.server_emm+'store/greatAppList';
    // 神策插件记录接口请求调用开始时间
    uexSensorsAnalytics.trackTimerBegin(JSON.stringify(paramTrackTimerStart));
        appcan.request.post(url,{jsonObj:{   
             "softToken": softToken,
             "accessToken": accessToken,
             "pageSize": 200,
             "pageNo": 1}},function(data, status, xhr){    
                // 神策插件记录接口请求调用结束时间
                var portParamTrackTimerEnd = FunParamTrackTimerEnd("接口请求","掌上深航","greatAppList");
                uexSensorsAnalytics.trackTimerEnd(JSON.stringify(portParamTrackTimerEnd));
                var data = JSON.parse(data);
                if(data.ret == 0){
                    var greatAppList=data.data.appList;
                   
                    for(var i in greatAppList){
                        var obj = greatAppList[i];
                        if(obj.tag == '置顶应用'){
                           
                            zdList.push(obj);
                        }else {
                            
                            customAppList.push(obj);
                        } 
                    }
                    
                    showApps(zdList);
                    if(customAppList.length>7){
                        customAppList = customAppList.splice(0,7);
                    }
                                   
                    getMyAppList(customAppList);
                    
                    appcan.setLocVal('ZHIDING-APPS',JSON.stringify(zdList));
                    appcan.setLocVal('CUSTOM-GREATAPPS',JSON.stringify(customAppList));               
                    
                }else {
                         
                    showApps(zdListCache);
                    getMyAppList(customGreatApp);         
                }
                
                   
        });
}

//置顶应用页面展示
function showApps(arr){
    
    var tmplHtml = $('#zdList').html(); //获取模板html字符串   
    var listVeiwTmpl = appcan.view.template(tmplHtml);   //生成模版   
    
    var $con = $('#zhidingList');
    $con.html('');
    for(var i in arr){
        var obj = arr[i]; 
               
        var customId = obj.appId+'_zd';
        obj.customId = customId;
        var emailNumId = obj.appId+'_em';
        obj.emailNumId = emailNumId;        
        var ele = $(listVeiwTmpl({
                      data : obj,
        }));             
        $con.append(ele);
        
        zhidingList[obj.customId] = obj;
        appcan.button('#'+obj.customId,'btn-act',function(){
               var id = this.id;
               var zdObj = zhidingList[id];
               appcan.window.publish('START_WGT',JSON.stringify(zdObj));
        });     
    }
    $('#zhidingList').find('[data-original]').each(function () {    
              var $el = $(this);
              var url = $el.attr('data-original');
              if (url) {
                     lazyLoadImage(url, $el);
              }
    });
    //调用emailNum方法
    emailNum();
    
}
//自定义应用页面展示
function customShow(arr){
    
    var tmplHtml = $('#tmplCustom').html();
    
    var listVeiwTmpl = appcan.view.template(tmplHtml);
    
    var $con = $('#customAppList');
    $con.html('');
    for(var i in arr){
        var obj = arr[i]; 
                
        var ele = $(listVeiwTmpl({
                      data : obj,
        }));             
        $con.append(ele);
        
        customObj[obj.appId] = obj;
        appcan.button('#'+obj.appId,'btn-act',function(){
               var id = this.id;
               var zdObj = customObj[id];
               appcan.window.publish('START_WGT',JSON.stringify(zdObj));
        });     
    }
	var html = '';
    html  = '<li class="li-item ub-f1 yincang " id="appMore">'
                   +'<div class="uinn5 ub ub-ver ub-f1 ub-ac ub-pc ">'
                    + '<div class="ub-img4 li-img lazy appMore"></div>'
                    + '<p class="ub-f1 ulev-1 p-padt ut-s2 tx-c name ub-fh">更多</p>'            
                  +'</div>'
                +'</li>';
    $con.append(html);
    $('#appMore').click(function(){                
        appcan.window.evaluateScript('index','home.initPage(1)');
    });
    $('#customAppList').find('[data-original]').each(function () {    
                  var $el = $(this);
                  var url = $el.attr('data-original');
                  if (url) {
                         lazyLoadImage(url, $el);
                  }
    });
}

//获取我的应用数据
    function getMyAppList(list){      
                //用户信息   
                 var userInfodata = JSON.parse(appcan.getLocVal("EPortal-UserInfo"));
                 var personEmmId=userInfodata.userId;
                 var SoftToken = appcan.getLocVal("emmSoftToken");
                 var myAppCache = JSON.parse(appcan.getLocVal('submitAppCenterList'));
                 // 神策插件记录接口请求调用开始时间
                 uexSensorsAnalytics.trackTimerBegin(JSON.stringify(paramTrackTimerStart));
                 appcan.request.ajax({
                        
                        url:config.server_emm+'userHomeConfig/getUserHomeConfig?personId='+personEmmId,
                        type : 'GET',
                        dataType : 'json',
                        data: {},
                        success:function(data){
                            // 神策插件记录接口请求调用结束时间
                            var portParamTrackTimerEnd = FunParamTrackTimerEnd("接口请求","掌上深航","getUserHomeConfig");
                            uexSensorsAnalytics.trackTimerEnd(JSON.stringify(portParamTrackTimerEnd));
                            if(data.length>0){
                                var myAppList = data[0].configValue;
                                    myAppList = JSON.parse(myAppList);
					if(myAppList.length>7){
						myAppList = myAppList.splice(0,7);
                                        };
                                appcan.setLocVal('EMM-MYAPPLIST',JSON.stringify(myAppList));
                                customShow(myAppList);
                            }else {                               
                                customShow(list);                                
                            }
                            
                        },
                        error:function(error){
            // 神策插件记录接口请求调用结束时间
            var portParamTrackTimerEnd = FunParamTrackTimerEnd("接口请求","掌上深航","getUserHomeConfig");
            uexSensorsAnalytics.trackTimerEnd(JSON.stringify(portParamTrackTimerEnd));
                        }
                });
    }