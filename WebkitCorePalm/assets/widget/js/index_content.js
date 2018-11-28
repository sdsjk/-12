//待办 、已办数据交互
var sessionid = '';
var todoListObj = {};
function getTodoList(functionName,flag){
        
        if(functionName == "moa/oa2TaskList_v11"){
            var dbListId = $('#dbList');
            loadHtml(dbListId);
        }else if(functionName == "moa/finishList_v11"){
            var ybListId = $('#ybList');
            loadHtml(ybListId);
        }
               
        
                
        var token = appcan.getLocVal("emmAccessToken"); 
	var uid = appcan.getLocVal("loginName");
        var pwd = '';
         try{
             pwd = appcan.getLocVal("emm_orgPwd");
         }catch(e){}
        var form = {
            functionName:functionName,
	    uid:uid,
            pwd:pwd
        }
        
        var todoId = $('#todoList');
        var havetodoId = $('#havetodoList');

        allMasIsCrypto("szair","oaTodo2","POST",JSON.stringify(form),"","掌上深航",config.appId).then(function(data){
            // 神策插件方法记录数据开始处理时间
            uexSensorsAnalytics.trackTimerBegin(JSON.stringify(paramTrackTimerStart));
            
            var obj = data;
            
            if(functionName == "moa/oa2TaskList_v11"){
            if(obj && obj.result=='yes'){
                    dbListId.children('.jiazai').remove();                    
                    sessionid = obj.sessionid;
                    todoListObj.RET = 1;
                    $('#count').html('('+obj.dateMap.total+')');
                    var note = obj.dateMap.note;
                    if(note!= ''){
                    var reg = /\d+/g;
                    var preApp = note.split(',')[0];
                    var nextWeb = note.split(',')[1];
                    var preAppNum = preApp.match(reg)[0];
                    var nextWebNum = nextWeb.match(reg)[0];
                    } 
                    if(obj.dateMap.total>0 && preAppNum !=0){
                        var taskList =obj.dateMap.taskList;
                            taskList.splice(3);
                        
                        showView(taskList,functionName);
                        
                        if(parseInt(preAppNum)<3){
                            var html = "";
                                html = '<li class="ub ub-ac  bc-border oa_title ulev-1">'   
                                            +'<div class="ub-f1 uinn_9">'
                                               + '<p class="line-h6 ut-s c2-notes tx-c ">'+note+'</p>'
                                            +'</div>'  
                                         +'</li>';                               
                               $('#todoList li:last-child').prepend(html);
                        }else{
                            todoId.children('.oa_title').remove();
                        }
                        todoId.children('.web_title').remove();
                        todoId.children('.w_title').remove();   
                    }else if(preAppNum == 0 && nextWebNum != 0){
						todoId.html('');
                        todoId.children('.w_title').remove();
                        todoId.children('.oa_title').remove();
                        var webTitle = "";
                            webTitle = '<li class="ub ub-ac web_title ulev-1">'   
                                            +'<div class="ub-f1 uinn">'
                                               + '<p class="line-h6 ut-s c2-notes tx-c ">'+note+'</p>'
                                            +'</div>'  
                                         +'</li>';
                        var domWebTitle = $('.web_title');
                        if(domWebTitle.length <= 0){
                            todoId.append(webTitle);
                    }
                                   
                    
                }else{
                        todoId.html('');   
                        var html = "";
                            html = '<li class="ub ub-ac ub-pc w_title">'
                                        +'<div class=" ub  ub-ac ub-pc uinn_13 ulev-1">'
                                           +'<div>'
                                              +'<p class="tx-c c1-notes">恭喜您</p>'
                                              +'<p class="tx-c c2-notes">您所有待办已处理完成!</p>'
                                           +'</div>'
                                        +'</div>'
                                      +'</li>';
                     
                        var domWtitle = $('.w_title');                        
                        if(domWtitle.length <=0){
                            todoId.append(html);
                        }
                        todoId.children('.web_title').remove();
			            $('#count').html('');
                    }
                    
                }else{
                    todoId.children('.w_title').remove();
                    todoId.children('.web_title').remove();
                    dbListId.children('.jiazai').remove();                    
                    if(!flag && obj.code=='4003' && obj.name=='SessionNotFound'){
                       appcan.window.publish('TODO-ERROR-REFRESH',functionName);
                    }else {
                        catchHtml(todoId);
                    }
                }
            }else if(functionName == "moa/finishList_v11"){
                if(obj && obj.result == 'yes' ){
                
                    ybListId.children('.jiazai').remove();                    
                    if(JSON.stringify(obj.dateMap.taskList) != '[]'){
                        havetodoId.children('.havetodo_title').remove;
                        var taskList =obj.dateMap.taskList;
                            taskList.splice(3); 
                        showView(taskList,functionName);
                    }else {
                        havetodoId.html('');
                        var html = "";
                            html = '<li class="ub ub-ac ub-pc havetodo_title">'
                                        +'<div class=" ub  ub-ac ub-pc uinn_13 ulev-1">'
                                           +'<div>'
                                              +'<p class="tx-c c1-notes">很遗憾！</p>'
                                              +'<p class="tx-c c2-notes">您的待办还未处理!</p>'
                                           +'</div>'
                                        +'</div>'
                                      +'</li>';
                        var domHaveTitle = $('.havetodo_title');
                        if(domHaveTitle.length <= 0){
                            havetodoId.append(html);
                        }
                   
               }
            }else{
                   havetodoId.children('.havetodo_title').remove;
                   ybListId.children('.jiazai').remove();                                    
                   if(!flag && obj.code=='4003' && obj.name=='SessionNotFound'){
                       appcan.window.publish('TODO-ERROR-REFRESH',functionName);    
                    
                }else {
                        catchHtml(todoId);
                }
                
                }
                
            };
            // 数据处理结束时间参数
            var paramTrackTimerHandleDataEnd = FunParamTrackTimerEnd("数据处理","掌上深航","","","false");
            // 神策插件方法记录数据处理结束时间
            uexSensorsAnalytics.trackTimerEnd(JSON.stringify(paramTrackTimerHandleDataEnd));
        },function(error){
			
            if(!flag && error.status == '504'){                
                    if(functionName == 'moa/oa2TaskList_v11'){
                        todoId.children('.w_title').remove();
                        todoId.children('.web_title').remove();
                        dbListId.children('.jiazai').remove();
                        appcan.window.publish('TODO-ERROR-REFRESH',functionName);
                    }else if(functionName == 'moa/finishList_v11'){
                        havetodoId.children('.havetodo_title').remove;
                        ybListId.children('.jiazai').remove();
                        appcan.window.publish('TODO-ERROR-REFRESH',functionName);
                    }                
            }else{
                if(functionName == 'moa/oa2TaskList_v11'){                
                    todoId.children('.w_title').remove();
                    todoId.children('.web_title').remove();
                    dbListId.children('.jiazai').remove();                    
                    catchHtml(todoId);
                }else if(functionName == 'moa/finishList_v11'){
                    havetodoId.children('.havetodo_title').remove;
                    ybListId.children('.jiazai').remove();                                    
                    catchHtml(havetodoId);
                }
            }
        }).catch(function(err){
            
        });
}

//页面拼装展示
function showView(arr,functionName){
        
        if(functionName == 'moa/oa2TaskList_v11'){
            
            var tmpHtml = $('#tmplTodo').html(); //获取模板html字符串
            var listVeiwTmpl = appcan.view.template(tmpHtml);  //生成模板
            var $con = $('#todoList');
            $con.html('');
        }else {
            
            var tmpHtml = $('#tmplHaveTodo').html(); //获取模板html字符串
            
            var listVeiwTmpl = appcan.view.template(tmpHtml);  //生成模板
            
            var $con = $('#havetodoList');
            $con.html('');
        }
        //按时间排序
        for(var i=0; i<arr.length;i++){
            
            var obj = arr[i];
            
            var time = obj.time;
            
            var time = /\d{4}-\d{1,2}-\d{1,2}/g.exec(time);
            
            obj.time = time;
            
            obj.listId = hex_md5(obj.detailUrl);
            var ele = $(listVeiwTmpl({
                data : obj,
            }));
            
            $con.append(ele);
            
            todoListObj[obj.listId] = obj;
            todoListObj.hasList = 1;
            
            //绑定点击事件，进行页面跳转
            appcan.button("#"+obj.listId, "btn-act", function() { 
                     
                
                if(functionName == 'moa/oa2TaskList_v11'){
                //开启神策埋点事件追踪
                 var param = {
                            event: 'platformClick',
                            propertieDict: {
                                userId:userId,
                                module:'待办模块',
                                funcName:'查看待办详情',
                                buttonName:'首页'                               
                            }
                  };
                  uexSensorsAnalytics.trackWithProperties(JSON.stringify(param));
                }else if(functionName == 'moa/finishList_v11'){
                    //开启神策埋点事件追踪
                    var param = {
                            event: 'platformClick',
                            propertieDict: {
                                userId:userId,
                                module:'已办模块',
                                funcName:'查看已办详情',
                                buttonName:'首页'                               
                            }
                  };
                  uexSensorsAnalytics.trackWithProperties(JSON.stringify(param));
                }
                var id = this.id;
                var dataObj = todoListObj[id];
             if(dataObj.functionName == "BPM"){
                  var flag = checkLoginStatus();
                  
                  var useId = JSON.parse(appcan.getLocVal("EPortal-UserInfo")).userId;
                  detailUrl=dataObj.detailUrl.replace(/\/bpm/,"/todobpm/")+"&userId="+useId+"&loginStates="+flag;
                  
                  appcan.window.open("BPM",detailUrl,10,'');
              }else if(dataObj.functionName == "EASHRJXKH"){
 
	         var jsonStr = {};
	         var easDetailUrl=unescape(dataObj.detailUrl); 
	         if(dataObj.currentState == '10'){
                      jsonStr.manage =0;
                      jsonStr.easDetailUrl=easDetailUrl;
                  }else if(dataObj.currentState == '12'){
                      jsonStr.manage =1;
                      jsonStr.easDetailUrl=easDetailUrl;
                  }
                  appcan.window.publish('PERFORMANCE-START',JSON.stringify(jsonStr));
              }else{
                    uexWidget.cbStartWidget = function (opId, dataType, data) {
                    };
                
                    var widgetParam = {
                        bizSystem: dataObj.bizSystem, 
                        functionName:dataObj.functionName, 
                        actInstID: dataObj.actInstID,
                        detailUrl: dataObj.detailUrl, 
                        sessionid: sessionid
                    };
                    
                    dataObj.sessionid = sessionid;
                    var str = JSON.stringify(dataObj);
                    
                    if(functionName == 'moa/oa2TaskList_v11'){
                        appcan.window.publish("EPORTAL_TODO_START", str);
                        appcan.setLocVal("EPORTAL_TODO_PARAM", str); //缓存待办参数
                        localStorage.setItem("EPORTAL_TODO_PARAM",str);
                    }else {
                        appcan.window.publish("EPORTAL_HAVETODO_START", str);
                        appcan.setLocVal("EPORTAL_HAVETODO_PARAM", str); //缓存已办参数
                        localStorage.setItem("EPORTAL_HAVETODO_PARAM",str);
                    }
                      
              }
            });
        }
        if(functionName == 'moa/oa2TaskList_v11'){
            var html = "";
            html = '<li class="uinn_more">'
                      +'<div>'
                          +'<p class="ub ub-pe lookMore " id="db_more" >查看更多></p>'
                      +'</div>'
                   '</li>';
           $con.append(html);
           $('#db_more').click(function(){
               //开启神策埋点事件追踪
               var param = {
                            event: 'platformClick',
                            propertieDict: {
                                userId:userId,
                                module:'待办模块',
                                funcName:'查看更多',
                                buttonName:'首页'                               
                            }
               };
               uexSensorsAnalytics.trackWithProperties(JSON.stringify(param));
               appcan.window.open("oaTodo", "oaTodo.html", 10, '');
           });
        }else if(functionName == 'moa/finishList_v11'){
            var html = "";
            html = '<li class="uinn_more">'
                      +'<div>'
                          +'<p class="ub ub-pe lookMore " id="yb_more" >查看更多></p>'
                      +'</div>'
                   '</li>';
           $con.append(html);
           $('#yb_more').click(function(){
               //开启神策埋点事件追踪
               var param = {
                            event: 'platformClick',
                            propertieDict: {
                                userId:userId,
                                module:'已办模块',
                                funcName:'查看更多',
                                buttonName:'首页'                               
                            }
               };
               uexSensorsAnalytics.trackWithProperties(JSON.stringify(param));
               appcan.window.evaluateScript('index','startYb()');
           });
        }
}
    
//新闻、行政文件数据获取
var listObj = {};
function getNewsList (type,flag) {
        
        var news = $('#NEWS');
        var file = $('#FILE');
        var fileList = $('#filesList');
        var newsList = $('#newsList');
        if(type == 'companyDocPublish'){
            loadHtml(file);            
        }else if(type == 'companyDev'){
            loadHtml(news);            
        }
        var sessionid = appcan.getLocVal('XMAS-SESSIONID') || localStorage.getItem("XMAS-SESSIONID");         
		var token = appcan.getLocVal("emmAccessToken");
        var biz = {
            funtionName:"/moa/fileViewList_v11",
            type:type,
            currPage:1,
            count:3
            
        };
        var biz = JSON.stringify(biz);     
        var params = {
               sys : '{"deviceid":"99000558140631","devicetype":"iOS_phone"}',
               biz : biz,
               url : 'http://ima.shenzhenair.com:8100/moa/fileViewList_v11',
               sessionid:sessionid
        };
        
        
		

        allMasIsCrypto("szair","xmaDetails","POST",JSON.stringify(params),"","掌上深航",config.appId).then(function(data){
            
            // 神策记录数据开始处理时间
            uexSensorsAnalytics.trackTimerBegin(JSON.stringify(paramTrackTimerStart)); 
            
             var obj = data;
             if(obj && obj.result == 'yes' && obj.dataList != ''){    
                 if(type == 'companyDev'){
                     news.children('.jiazai').remove();
                     $('#news_more').removeClass('uhide');
                 }else if(type == 'companyDocPublish'){
                     file.children('.jiazai').remove();
                     $('#file_more').removeClass('uhide');
                 }          
                 showViewList(obj.dataList,type);
             }else if(obj && obj.result == 'yes' && obj.dataList == ''){
                 if(type == 'companyDev'){                     
                     news.children('.jiazai').remove();
                     $('#news_more').addClass('uhide');
                     $('#newsList').html('<p class="tx-c" style="font-size:0.875em;">暂无数据！</p>');
                 }else if(type == 'companyDocPublish'){                     
                     file.children('.jiazai').remove();
                     $('#file_more').addClass('uhide');
                     $('#filesList').html('<p class="tx-c" style="font-size:0.875em;">暂无数据！</p>');
                 } 
                 
             }else {
                 if(!flag && obj.code=='4003' && obj.name=='SessionNotFound'){                     
                     if(type == 'companyDocPublish'){                         
                         file.children('.jiazai').remove();
                         $('#file_more').addClass('uhide');
                         appcan.window.publish('NWE-FILE-REFRESH',type);
                     }else if(type == 'companyDev'){
                         news.children('.jiazai').remove();
                         $('#news_more').addClass('uhide');
                         appcan.window.publish('NWE-FILE-REFRESH',type);
                     }
                 }else{
                     if(type == 'companyDocPublish'){
                         file.children('.jiazai').remove();
                         $('#file_more').addClass('uhide');
                         catchHtml(fileList);
                     }else if(type == 'companyDev'){
                         news.children('.jiazai').remove();
                         $('#news_more').addClass('uhide');
                         catchHtml(newsList);
                     }
                 }
             }
            /// 数据处理结束时间参数
            var paramTrackTimerHandleDataEnd = FunParamTrackTimerEnd("数据处理","掌上深航","","","false");
            // 记录数据处理结束时间
            uexSensorsAnalytics.trackTimerEnd(JSON.stringify(paramTrackTimerHandleDataEnd));
        },function(error){
            if(!flag && error.status == '504'){
                 if(type == 'companyDocPublish'){
                     file.children('.jiazai').remove();
                     $('#file_more').addClass('uhide');
                     appcan.window.publish('NWE-FILE-REFRESH',type);
                 }else if(type == 'companyDev'){
                     news.children('.jiazai').remove();
                     $('#news_more').addClass('uhide');
                     appcan.window.publish('NWE-FILE-REFRESH',type);
                 }                
             }else{
                 if(type == 'companyDocPublish'){
                     file.children('.jiazai').remove();
                     $('#file_more').addClass('uhide');
                     catchHtml(fileList);
                 }else if(type == 'companyDev'){
                     news.children('.jiazai').remove();
                     $('#news_more').addClass('uhide');
                     catchHtml(newsList);
                 }
             }
        }).catch(function(err){
            
        });
        
 }
    
    
function showViewList(arr,type){
    
    if(type == "companyDev"){
        var key = 'EPORTAL_NEWS_START';
        var tmpHtml = $('#tmplNews').html();
        
        var listViewTmpl = appcan.view.template(tmpHtml);
       
        var $con = $('#newsList');
    }else if(type == 'companyDocPublish'){
        
        var key = "EPORTAL_FILES_START";
        var tmpHtml = $('#tmplFiles').html();
        
        var listViewTmpl = appcan.view.template(tmpHtml);
       
        var $con = $('#filesList');
    }
    
    $con.html('');
        //按时间排序
    for(var i=0; i<arr.length;i++){
         var obj = arr[i];
         
         var time = obj.time;
         var time = /\d{4}-\d{1,2}-\d{1,2}/g.exec(time);
         obj.time = time;
         obj.listId = hex_md5(obj.url);
         
         var ele = $(listViewTmpl({
              data : obj
         }));
         
         $con.append(ele);
         listObj[obj.listId] = obj;
         
         appcan.button('#'+obj.listId,'btn-act',function(){
             
             var id = this.id;
             var dataObj = listObj[id];
             var str = JSON.stringify(dataObj);
             
             appcan.window.publish(key,str);
             
             appcan.setLocVal('EPORTAL_NEWS',JSON.stringify({type:type,url:dataObj.url,title:dataObj.title}));
             localStorage.setItem('EPORTAL_NEWS',JSON.stringify({type:type,url:dataObj.url,title:dataObj.title}));
         });
    }
}

//获取值班信息数据
function dutyList(){
    var duty = $('#DUTY');
    loadHtml(duty);
    duty.children('.catch').remove();
    var userId = JSON.parse(appcan.getLocVal('EPortal-UserInfo')).userId;
    var orgId = JSON.parse(appcan.getLocVal('EPortal-UserInfo')).zzOrgId;
    var currrentDate = NYR();
    var currrentDate = currrentDate.replace('年','-').replace('月','-').replace('日','');
    var token = appcan.getLocVal("emmAccessToken");
    var params = {userid:userId,orgid:orgId,currrentDate:currrentDate};    
        
    allMasIsCrypto("oa","getDutyInformation","POST",JSON.stringify(params),"","掌上深航",config.appId).then(function(data){
       
         // 神策记录数据开始处理时间
        uexSensorsAnalytics.trackTimerBegin(JSON.stringify(paramTrackTimerStart));
        
        var data = data;
        if(data.result == 'success' && data.data != ''){
            duty.children('.jiazai').remove();
            var dutyList = data.data;
            
            dutyList.sort(compare('deptId')); 
            if(dutyList.length<3){
				$('#dbm').addClass('uhide');
			}else{
				$('#dbm').removeClass('uhide');
			}
            showDuty(dutyList);
        }else if(data.result == 'success' && data.data == ''){
            duty.children('.jiazai').remove();
            $('#dutyBtn').addClass('uhide');
            $('#duty_more').addClass('uhide');
            $('#dutyNotes').removeClass('uhide');
            
        }else {
            duty.children('.jiazai').remove();
            $('#dutyBtn').addClass('uhide');
            $('#duty_more').addClass('uhide');
            catchHtml(duty);
        }
        // 数据处理结束时间参数
        var paramTrackTimerHandleDataEnd = FunParamTrackTimerEnd("数据处理","掌上深航","","","false");
        // 记录数据处理结束时间
        uexSensorsAnalytics.trackTimerEnd(JSON.stringify(paramTrackTimerHandleDataEnd));
    },function(error){
        duty.children('.jiazai').remove();
        $('#dutyBtn').addClass('uhide');
        $('#duty_more').addClass('uhide');
        catchHtml(duty); 
    }).catch(function(err){
        
    });
}
function showDuty(arr){
    var tmpHtml = $('#tmpDuty').html();
    var listViewTmpl = appcan.view.template(tmpHtml); 
    var $con = $('#dutyList');
    $con.html('');
    for(var i in arr){
        var obj = arr[i];
        var dateDay = obj.fullDate;
        var today = obj.dutyDate;
        if(obj.dutyOtel == 'null'){
            obj.dutyOtel = '';
        }else if(obj.dutyOtel.length > 5){   // 内线超过5位只展示5位
            obj.dutyOtel = obj.dutyOtel.substr(obj.dutyOtel.length - 5,obj.dutyOtel.length)
        }
        if(obj.dutyMobile == 'null'){
            obj.dutyMobile = '';
        }else if(obj.dutyMobile.length>11){
            
            var dutyMobile = obj.dutyMobile.match(/\d+/g);
            
            obj.dutyMobile = dutyMobile;
            
            
        }
        if(obj.dutyEmpname == 'null'){
            obj.dutyEmpname = '';
        }
        
        var ele = $(listViewTmpl({
              data : obj
         }));
         $con.append(ele);
    }
    var today = today.slice(2);
    
    var week = new Date(dateDay).getDay();
    
    if(week == 0){
        str = '星期日/SUN';
    }else if (week == 6){
        str = '星期六/SAT';
    }else if (week == 5){
        str = '星期五/FRI';
    }else if (week == 4){
        str = '星期四/THU';
    }else if (week == 3){
        str = '星期三/WED';
    }else if (week == 2){
        str = '星期二/THE';
    }else if (week == 1){
        str = '星期一/MON';
    }
    $("#week").html(str);
    $('#d_num').html(today);
}
//数组对象的排序
var compare = function (prop) {
    return function (obj1, obj2) {
        var val1 = obj1[prop];
        var val2 = obj2[prop];
        if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
            val1 = Number(val1);
            val2 = Number(val2);
        }
        if (val1 < val2) {
            return -1;
        } else if (val1 > val2) {
            return 1;
        } else {
            return 0;
        }            
    } 
}

//检查账号是否过期失效
function checkLoginStatus(str){
        var loginInfo = str || appcan.getLocVal("EPortal-XOA-LOGIN-RET");
        
        var ret = 0; 
        if(loginInfo) {
            var obj = JSON.parse(loginInfo);
            if(obj.result!='yes' || loginInfo.indexOf('OA密码过期')>=0){
                ret = 1;
                $('#todoList').html('');
                var eTodoNote = $('#todoNote');
                eTodoNote.removeClass('ubb');
                eTodoNote.html('');
                var eNotes = $('#notes');
                eNotes.html('<p class="tx-c" style="font-weight:bold">'+obj.message+'</p>');
                eNotes.removeClass('uhide');
            }
        }
        return ret;
}

function loadHtml(id){
    var html = '';
    var html = '<div class="uinn jiazai ub ub-ac ub-pc "  style="background-color: #FFFFFF;opacity: 0.8;">'
                      +'<div class="ub ub-ac ub-pc " >'
                           +'<div class="umw2 umh4 ub-img jiazai_gif"></div>'
                      +'</div>'
                +'</div>';
       
    id.append(html);
}

function catchHtml(id){
    id.html('');
    var html = '';
    var html = '<li>'
                  +'<div class="ub ub-ac ub-pc uinn2 catch">'
                    + '<div>'
                         +'<div class="umw2 umh3 ub-img catch_icon"></div>'
                         +'<p class="catch_font">数据飞走了,请刷新</p>'
                     +'</div>'                                
                  +'</div>'
                +'</li>';    
    id.html(html);
}
//邮箱角标
function emailNum(){
    var emmToken = JSON.parse(appcan.getLocVal('emmToken'));
    var eipInfo = emmToken.info.returnInfo;            
    var eipToken = eipInfo.eipToken;
    var loginName = eipInfo.loginName;
    var loginPass = eipInfo.loginPass;
    var params = {
           token:eipToken,
           userId:loginName,
           passwd:loginPass
    };
    allMasIsCrypto("szair","email","GET",JSON.stringify(params),"","掌上深航",config.appId).then(function(data){
        var obj = data;
        if(obj.status == 'ok' && obj.total > 0){
            var num = obj.total;
            $('#aaamu10023_em').removeClass('uhide');
            $('#aaamu10023_em').html(num);
        }else{
            $('#aaamu10023_em').addClass('uhide');
        }
    },function(err){
    }).catch(function(err){
    });
}
