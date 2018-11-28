var versionModel = Backbone.Model.extend({
    idAttribute: "sortVersion"
});

var versionCollection = Backbone.Collection.extend({
    initialize: function () {
        
        this.listenTo(versionService, "CB_GET_STORE_APP_VERSION_INFO", function (list) {
            
            if (this.options) {
                if (list.status == "ok") {
                    var arr = [list.info.appPkgInfo[0]];
                    var platform = isAndroid?'android':'iphone';
                    for(var i=0; i<list.info.appPkgInfo.length; i++){
                        if(list.info.appPkgInfo[i].platform==platform){
                            arr = list.info.appPkgInfo[i];
                            break;
                        }
                    }
                    this.options.success(arr);
                } else {
                    this.options.error({status: -30002, msg: {message: list.info}});
                }
            }
        })
    },
    model: versionModel,
    parse: function (resp) {
       
        return resp;
    },
    sync: function (method, model, options) {
       
        this.options = options;
        switch (method) {
            case "create":
            case "update":
            case "patch":
                break;
            case "read":
                versionService.request(options);
                break;
            case "delete":
                break;
            default:
                break;
        }
    }
});