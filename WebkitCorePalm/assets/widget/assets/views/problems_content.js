var STR_LOADING = tools.getString("STR_LOADING");

//常见问题分类数据
function problemsTabList(){
    var appId = config.appId;
    var url = config.server_emm+'issue/'+appId+'/getIssueSortList';
    // 记录神策插件开始调用时间
    uexSensorsAnalytics.trackTimerBegin(JSON.stringify(paramTrackTimerStart));
    // 神策插件结束时间参数
    var paramTrackTimerHandleDataEnd = FunParamTrackTimerEnd("接口请求","个人中心","getIssueSortList");
    appcan.request.ajax({
        url: url,
        type: 'GET',
        headers: getHeaders(),
        contentType: 'application/x-www-form-urlencoded',
        timeout: "30000",
        data: {},
        success:function(data, status, xhr){
            // 神策插件记录数据处理结束时间
            uexSensorsAnalytics.trackTimerEnd(JSON.stringify(paramTrackTimerHandleDataEnd));
            $('#tabProblems').removeClass('uhide');
            $('#searchTxt').addClass('uhide');
            
            appcan.frame.resetBounce(0);                       
            var obj = JSON.parse(data);
            if(obj.status == 0){
                if(obj.total>0){
                    $('#norecord').addClass('uhide');
                    var tabArr = obj.data;
                    tabView(tabArr);
                    var tabObj = tabArr[0];
                      problemList();                  
                    
                }else{
                    $('#norecord').removeClass('uhide');
                    $('#searchTxt').addClass('uhide');
                }
            }else{
                appcan.window.openToast('网络连接正忙，请稍后重试！',3000,5);
            }
        },
        error:function(){
            // 神策插件记录数据处理结束时间
            uexSensorsAnalytics.trackTimerEnd(JSON.stringify(paramTrackTimerHandleDataEnd));
        }
        
     });     
}
//常见问题分类view展示
function tabView(arr){
    
    var tmpHtml = $('#tabProblemsList').html();
    
    var listVeiwTmpl = appcan.view.template(tmpHtml);
    
    var $con = $('#tabProblems ul');
    $con.html('');
    for(var i in arr){
        var obj = arr[i];  
                                            
        var ele = $(listVeiwTmpl({
              data:obj
        }));
        $con.append(ele);
        appcan.button('#'+obj.id,'act-btn',function(){                   
                    if($(this).is('.tab_isCheck')){
                        $(this).removeClass('tab_isCheck');
                        problemList();
                    }else{                                           
                        $(this).addClass('tab_isCheck');
                        appcan.window.publish('PROBLEMSLIST-REQ',this.id);
                        var el = $(this).siblings();                        
                        for(var i in el){                            
                            var element = el[i];                            
                            var className = element.getAttribute('class');
                            var thisId = element.getAttribute('id');                            
                            
                            if(className.indexOf('tab_isCheck')>0){                                
                                $('#'+thisId).removeClass('tab_isCheck');                            
                            }
                        }                    
                    }
                    
        });
    } 
}
//常见问题列表数据
function problemList(id){    
    $('.load').removeClass('uhide');
    var appId = config.appId;    
    if(id){
        var url = config.server_emm+'issue/'+appId+'/getIssueList?issueSortId='+id;
    }else{
        var url = config.server_emm+'issue/'+appId+'/getIssueList';
    }    
    // 记录神策插件开始调用时间
    uexSensorsAnalytics.trackTimerBegin(JSON.stringify(paramTrackTimerStart));
    // 神策插件结束时间参数
    var paramTrackTimerHandleDataEnd = FunParamTrackTimerEnd("接口请求","个人中心","getIssueList");
    appcan.request.ajax({
        url: url,
        type: 'GET',
        headers: getHeaders(),
        contentType: 'application/x-www-form-urlencoded',
        timeout: "30000",
        data: {},
        success:function(data, status, xhr){
            appcan.frame.resetBounce(0);
            // 神策插件记录数据处理结束时间
            uexSensorsAnalytics.trackTimerEnd(JSON.stringify(paramTrackTimerHandleDataEnd));
            $('#problemslist').css('margin-top','0em');
            $('#problemslist').removeClass('uhide');
            var obj = JSON.parse(data);
            if(obj.status == 0){
                $('.load').addClass('uhide');
                if(obj.total>0){
                    var problemsArr = obj.data;
                    problemsView(problemsArr);
                }else{
                    var $con = $('#problemslist ul');
                    var content = '';
                        content ='<li class="bg">'
                                    +'<div class="ub ub-ver ub-ac ub-pc">' 
                                     +'<div class="Nodata ub-img Nodatastyle Nodatamargin"></div>' 
                                     +'<div class="Nodatafont zt-color10" data-lan="STR_NODATA">暂无数据</div>'
                                    +'</div>'
                                  +'</li>';
                    $con.html(content);
                }
            }else{
               $('.load>div>p').html('网络正在开小差,请稍后重试');
               setTimeout(function(){
                   $('.load').addClass('uhide');
               },2000);                
            }
        },
        error:function(){
            // 神策插件记录数据处理结束时间
            uexSensorsAnalytics.trackTimerEnd(JSON.stringify(paramTrackTimerHandleDataEnd));
        }
     });
    
}
//常见问题列表View
var proJson = {};
function problemsView(arr){
    
    var tmpHtml = $('#tmpProblemslist').html();
    
    var listVeiwTmpl = appcan.view.template(tmpHtml);
    
    var $con = $('#problemslist ul');
    $con.html('');
    for(var i in arr){
        var obj = arr[i];
        
        var time = obj.createdAt;               
            time = NYRHM(time);                  
            obj.createdAt = time;
        var listId = obj.id+'_p';
            obj.listId = listId;
        var ele = $(listVeiwTmpl({
              data:obj
        }));
        $con.append(ele);
        
        proJson[obj.listId] = obj;
        appcan.button('#'+obj.listId,'act-btn',function(){
            
            var id = this.id;
            
            var dataObj = proJson[id];
            
            appcan.window.open('problemsDet','problemsDet.html',10);
            appcan.setLocVal('PROBLEMSLIST-JSON',JSON.stringify(dataObj));
	    localStorage.setItem('PROBLEMSLIST-JSON',JSON.stringify(dataObj));
            problemsDetail(dataObj.id);
            
        });
    }
}

//分页展示
function problemsView2(arr){
    
    var tmpHtml = $('#tmpProblemslist').html();
    
    var listVeiwTmpl = appcan.view.template(tmpHtml);
    
    var $con = $('#problemslist ul');    
    for(var i in arr){
        var obj = arr[i];
        var time = obj.createdAt;               
            time = NYRHM(time);                  
            obj.createdAt = time;
        var listId = obj.id+'_p';
            obj.listId = listId; 
        var ele = $(listVeiwTmpl({
              data:obj
        }));
        $con.append(ele);
        proJson[obj.listId] = obj;
        appcan.button('#'+obj.listId,'act-btn',function(){
            var id = this.id;
            var dataObj = proJson[id];
            appcan.window.open('problemsDet','problemsDet.html',10);
            appcan.setLocVal('PROBLEMSLIST-JSON',JSON.stringify(dataObj));
	    localStorage.setItem('PROBLEMSLIST-JSON',JSON.stringify(dataObj));
            problemsDetail(dataObj.id);
        });
    }
}
//常见问题搜索数据
function problemsSerachList(page){
    
    var appId = config.appId;
    
    var content = $('#my_feedBack').val();
    if(!content) return;
    var url = config.server_emm+'issue/'+appId+'/getIssueList?page='+page+'&rows=10&issueName='+encodeURIComponent(content);
     // 记录神策插件开始调用时间
    uexSensorsAnalytics.trackTimerBegin(JSON.stringify(paramTrackTimerStart));
    // 神策插件结束时间参数
    var paramTrackTimerHandleDataEnd = FunParamTrackTimerEnd("接口请求","个人中心","getIssueList");
    appcan.request.ajax({
        url: url,
        type: 'GET',
        headers: getHeaders(),
        contentType: 'application/x-www-form-urlencoded',
        timeout: "30000",
        data: {},
        success:function(data, status, xhr){
            // 神策插件记录数据处理结束时间
            uexSensorsAnalytics.trackTimerEnd(JSON.stringify(paramTrackTimerHandleDataEnd));
            
            appcan.frame.resetBounce(1);
            var obj = JSON.parse(data);
            if(obj.status == 0){
                $('#tabProblems').addClass('uhide');
                $('#norecord').addClass('uhide');
                $('#problemslist').removeClass('uhide');
                $('#searchTxt').addClass('uhide');
				$('#problemslist').css('margin-top','3.2em');
                if(obj.total>0){
                    var proSerachArr = obj.data;
                    problemsView(proSerachArr);
                    var ev = {
                       page:page,
                       msgLength:proSerachArr.length
                   };
                   appcan.window.publish('PROBLEMS-SETBOUNCE',JSON.stringify(ev)); 
                   
                }else{                    
                    $('#tabProblems').addClass('uhide');
                    $('#problemslist').addClass('uhide');
                    $('#norecord').removeClass('uhide');
                    $('#searchTxt').addClass('uhide');
                }
            }else{
                appcan.window.openToast('网络连接正忙，请稍后重试！',3000,5);
            }
        },
        error:function(){
            // 神策插件记录数据处理结束时间
            uexSensorsAnalytics.trackTimerEnd(JSON.stringify(paramTrackTimerHandleDataEnd));
        }
     });
    
}
//常见问题列表分页加载
function problemsSerachList2(page){
    appcan.window.openToast(STR_LOADING,2000,5);
    var appId = config.appId;
    var problemlistHeight = $('#problemslist').height();
    var content = $('#my_feedBack').val();
    if(!content){
        appcan.window.closeToast();
        appcan.window.confirm('提示','请输入关键字进行搜索',['确定']);
        return;
    }
    var url = config.server_emm+'issue/'+appId+'/getIssueList?page='+page+'&rows=10&issueName='+encodeURIComponent(content);
    // 记录神策插件开始调用时间
    uexSensorsAnalytics.trackTimerBegin(JSON.stringify(paramTrackTimerStart));
    // 神策插件结束时间参数
    var paramTrackTimerHandleDataEnd = FunParamTrackTimerEnd("接口请求","个人中心","getIssueList");
    appcan.request.ajax({
        url: url,
        type: 'GET',
        headers: getHeaders(),
        contentType: 'application/x-www-form-urlencoded',
        timeout: "30000",
        data: {},
        success:function(data, status, xhr){
            // 神策插件记录数据处理结束时间
            uexSensorsAnalytics.trackTimerEnd(JSON.stringify(paramTrackTimerHandleDataEnd));
            
            appcan.window.closeToast();
            appcan.frame.resetBounce(1);
            var obj = JSON.parse(data);
            if(obj.status == 0){
                $('#tabProblems').addClass('uhide');
                $('#norecord').addClass('uhide');
                $('#problemslist').removeClass('uhide');
                $('#searchTxt').addClass('uhide');
                if(obj.total>0){
                    var proSerachArr = obj.data;
                    problemsView2(proSerachArr);
                    var ev = {
                       page:page,
                       msgLength:proSerachArr.length
                   };
                   appcan.window.publish('PROBLEMS-SETBOUNCE',JSON.stringify(ev)); 
                   
                   try {
                        // 暂无更多数据
                        if (proSerachArr.length < 10) {
                           setTimeout(function(){
                              
                               $('body').scrollTop(problemlistHeight);
                           },0)
                        } else {
                            setTimeout(function(){
                                
                                $('body').scrollTop(problemlistHeight);
                            },0)
                        }
                   } catch (e) {
                    
                   } 
                }else{
                    appcan.window.closeToast();                    
                    $('#tabProblems').addClass('uhide');
                    $('#problemslist').addClass('uhide');
                    $('#norecord').removeClass('uhide');
                    $('#searchTxt').addClass('uhide');
                }
            }else{
                appcan.window.openToast('网络连接正忙，请稍后重试！',3000,5);
            }
        },
        error:function(){
            // 神策插件记录数据处理结束时间
            uexSensorsAnalytics.trackTimerEnd(JSON.stringify(paramTrackTimerHandleDataEnd));
        }
     });
    
}


//常见问题详情统计接口
function problemsDetail(id){
    var appId = config.appId;
    var url = config.server_emm+'issue/'+appId+'/getIssue?issueId='+id;
    // 记录神策插件开始调用时间
    uexSensorsAnalytics.trackTimerBegin(JSON.stringify(paramTrackTimerStart));
    // 神策插件结束时间参数
    var paramTrackTimerHandleDataEnd = FunParamTrackTimerEnd("接口请求","个人中心","getIssue");
    appcan.request.ajax({
        url: url,
        type: 'GET',
        headers: getHeaders(),
        contentType: 'application/x-www-form-urlencoded',
        timeout: "30000",
        data: {},
        success:function(data, status, xhr){
            // 神策插件记录数据处理结束时间
            uexSensorsAnalytics.trackTimerEnd(JSON.stringify(paramTrackTimerHandleDataEnd));
        },
        error:function(){
            // 神策插件记录数据处理结束时间
            uexSensorsAnalytics.trackTimerEnd(JSON.stringify(paramTrackTimerHandleDataEnd));
        }
     });
}
