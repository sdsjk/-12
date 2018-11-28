var versionService = {
    request: function (option) {
        
        appcan.window.publish("GET_STORE_APP_VERSION_INFO", {appId: appId});
    }
};
_.extend(versionService, Backbone.Events);

appcan.ready(function () {
    appcan.window.subscribe("CB_GET_STORE_APP_VERSION_INFO", function (list) {
       
        versionService.trigger("CB_GET_STORE_APP_VERSION_INFO", list);
    });
});