/**
 *推送封装的对象，基本各个平台都提供了类似了api，做一次封装 
 * appcan插件文档 http://newdocx.appcan.cn/newdocx/docx?type=1479_975
 */
var PUSH = {
    /**
     * 设置标签
     */
    setTags : function(tags) {
        if (!window.uexJPush) {
            
            return;
        }
        var params = {
            tags : tags.split(','),
        };
        var data = JSON.stringify(params);
        uexJPush.setTags(data);

        //设置标签的回调方法
        uexJPush.cbSetTags = function(data) {
            
            appcan.window.publish('PUSH.cbSetTags', data);
        };
    },
    /**
     * 设置别名和标签
     */
    setAliasAndTags : function(alias, tags) {
        if (!window.uexJPush) {
            
            return;
        }
        var params = {
            alias : alias,
            tags : tags.split(',')
        };
        var data = JSON.stringify(params);
        uexJPush.setAliasAndTags(data);
        uexJPush.cbSetAliasAndTags = function(data) {
            
            appcan.window.publish('PUSH.cbSetAliasAndTags', data);
        };
    },

    /**
     * 设置别名
     */
    setAlias : function(alias) {
        if (!window.uexJPush) {
            
            return;
        }
        var params = {
            alias : alias
        };
       
        var data = JSON.stringify(params);
        uexJPush.setAlias(data);
        //设置别名的回调方法
        uexJPush.cbSetAlias = function(data) {
            appcan.window.publish('PUSH.cbSetAlias', data);
            
        };
    },
    /**
     * TODO:初始化消息到来的消息，这个只有在root界面执行才有效果
     */
    init : function() {
        if (!window.uexJPush) {
           
            return;
        }
        //收到了自定义消息，这个一般不会展示在手机的通知栏
        uexJPush.onReceiveMessage = function(data) {
            
            appcan.window.publish('PUSH.onReceiveMessage', data);
        };
        //收到了通知，展示在通知栏
        uexJPush.onReceiveConnectionChange = function(data) {
            appcan.window.publish('PUSH.onReceiveConnectionChange', data);
        };
        //应用程序注册监听
        uexJPush.onReceiveRegistration = function(data) {
            appcan.window.publish('PUSH.onReceiveRegistration', data);
        };
        uexJPush.cbSetAlias = function(data) {
            
            appcan.window.publish('PUSH.cbSetAlias', data);
        };
        //设置标签的回调方法
        uexJPush.cbSetTags = function(data) {
            appcan.window.publish('PUSH.cbSetTags', data);
        };
        uexJPush.cbSetAliasAndTags = function(data) {
            appcan.window.publish('PUSH.cbSetAliasAndTags', data);
        };
        //取得应用程序对应的RegistrationID的回调方法
        uexJPush.cbGetRegistrationID = function(data) {
            
            appcan.window.publish('PUSH.cbGetRegistrationID', data);
        };
        //获取连接状态回调
        uexJPush.cbGetConnectionState = function(data) {
            
            appcan.window.publish('PUSH.cbGetConnectionState', data);
        };
    },
    /**
     * 停止推送
     */
    stopPush : function() {
        uexJPush.stopPush();
    },
    /**
     * 恢复推送服务
     */
    resumePush : function() {
        uexJPush.resumePush();
    },

    /**
     * 设置角标
     */
    setBadgeNumber : function(badgeNumber) {
        uexJPush.setBadgeNumber(badgeNumber);
    },
    /**
     * 取得应用程序对应的RegistrationID
     */
    getRegistrationID : function() {
        uexJPush.getRegistrationID();
        //取得应用程序对应的RegistrationID的回调方法
        uexJPush.cbGetRegistrationID = function(data) {
            
            appcan.window.publish('PUSH.cbGetRegistrationID', data);
        };
    },
    /**
     *  添加一个本地通知
     */
    addLocalNotification : function(data) {
        var data = JSON.stringify(data);
        uexJPush.addLocalNotification(data);
    },
    /**
     * 移除一个本地通知
     */
    removeLocalNotification : function(notificationId) {
        var params = {
            notificationId : notificationId
        };
        var data = JSON.stringify(params);
        uexJPush.removeLocalNotification(data);

    },
    /**
     * 移除本地所有的通知
     */
    clearLocalNotifications : function() {
        uexJPush.clearLocalNotifications();

    },
    /**
     * 获取连接状态
     */
    getConnectionState : function() {
        uexJPush.getConnectionState();
        //获取连接状态回调
        uexJPush.cbGetConnectionState = function(data) {
            
            appcan.window.publish('PUSH.cbGetConnectionState', data);
        };
    },

    /**
     * 根据Id清除某条通知
     */
    clearNotificationById : function(notificationId) {
        var params = {
            notificationId : notificationId,//int 通知Id
        };
        var data = JSON.stringify(params);
        uexJPush.clearNotificationById(data);
    },
    /**
     * 清除所有通知
     */
    clearAllNotifications : function() {
        uexJPush.clearAllNotifications();
    },
    /**
     * 禁止前台本地通知提示框
     */
    disableLocalNotificationAlertView : function(flag) {
        //flag 1-禁止 其他-允许
        uexJPush.disableLocalNotificationAlertView(flag);
    }
};

function pushDemo(){
     var loginNo='sz001';//登录账号
    PUSH.setAlias(loginNo);//登录成功后，设置下别名
    
}
function setAlias_user(){
    var loginNo = appcan.getLocVal("loginName");
    PUSH.setAlias(loginNo);
}
