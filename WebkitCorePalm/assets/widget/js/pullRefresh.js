/**
 * 初始化下拉刷新和上拉加载
 */
function initPullRefresh() {

    //初始化下拉刷新控件
    mui.init({
        pullRefresh: {
            container: '#pullrefresh',
            down: {
                height: 55,//可选,默认50.触发下拉刷新拖动距离,
                auto: false,//可选,默认false.自动下拉刷新一次
                contentdown: "下拉可以刷新",//可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
                contentover: "释放立即刷新",//可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
                contentrefresh: "正在刷新...",//可选，正在刷新状态时，下拉刷新控件上显示的标题内容
                callback: pulldownRefresh
            },
            up: {
                contentrefresh: '正在加载...',
                callback: pullupRefresh
            }
        }
    });

    if (mui.os.plus) {
        
        mui.plusReady(function () {
            setTimeout(function () {
                mui('#pullrefresh').pullRefresh().pullupLoading();
            }, 1000);
        });
    } else {
        
        mui.ready(function () {
            mui('#pullrefresh').pullRefresh().pullupLoading();
        });
    }

}

/**
 * 下拉刷新回调
 */
function pulldownRefresh() {
   
}

/**
 * 上拉加载回调
 */
function pullupRefresh() {
    
}

