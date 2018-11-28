var nomore = false;
var init = true;  //是否是第一次进来
var page = 1;
var pageSize = 10;
appcan.ready(function() {
    appcan.window.openToast('正在获取数据,请稍后...');
    mScroll();
    getData();
});


function getData(){
    var biz = {
        functionName: "/moa/fileViewList_v11",
        type: 'companyDev',
        currPage: page,
        count: pageSize,
    };
    wsHTTP(g_basicURL, biz,function (data) {
        var tmpl = '';
        if(page==1){
            $('#list').html('');
             if(!init){
                appcan.window.resetBounceView(0);
                appcan.window.resetBounceView(1);
                mScroll();
             }
            $('#nomore').hide();
            nomore  = false;
        }else{
            appcan.window.resetBounceView(1)
            
        }
        
        
        for(var v in data.dataList){
           tmpl+='<div class="ub ub-ver" style="border-bottom: 1px solid #ccc;padding:1em;" onclick="openPage(\''+data.dataList[v].title+'\',\''+data.dataList[v].url+'\')">'
           tmpl+='<div class="ub">'+data.dataList[v].title+'</div>'
           tmpl+='<div class="ub ulev-2 ub-pe">'+data.dataList[v].time+'</div>'
           tmpl+='</div>'
        }
       if(page==2){
           nomore = true;
          $('#nomore').show();
          appcan.window.hiddenBounceView(1);
       }else{
          page++;
       }
       $('#list').append(tmpl);
       if(init){appcan.window.closeToast();init = false;}
    }, function (data) {
       if(init){appcan.window.closeToast();init = false;}
       appcan.window.openToast('获取数据失败,请从新获取!',2000,5,0)
    })
}

function openPage(title,url){
    appcan.locStorage.setVal('NEWS_ARGS_URL',url); 
    appcan.locStorage.setVal('NEWS_ARGS_TITLE',title);
    appcan.window.open({
        name: 'content',
        dataType: 0,
        aniId: 10,
        data: "content.html",
    });
}







