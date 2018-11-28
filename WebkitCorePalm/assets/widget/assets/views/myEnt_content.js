var STR_START_USING = tools.getString("STR_START_USING");
var STR_NODATA = tools.getString("STR_NODATA");
var STR_LOADING_SHORT = tools.getString("STR_LOADING_SHORT");
var STR_AUTHORIZED = tools.getString("STR_AUTHORIZED");
var STR_UNAUTHORIZED = tools.getString("STR_UNAUTHORIZED");

var myEntView = Backbone.Epoxy.View.extend({//options...
    initialize: function (option) {
        //初始化VIEW并让model与VIEW进行关联
        this.model.view = this;
    },
    computeds: {
        setStatus: {
            deps: ["status"],
            get: function (v) {
                if (v) {
                    if (v == STR_START_USING) {
                        return '<div class="entSta entStaSize ub-img"></div><div class="fontSize9375 ">' + STR_AUTHORIZED + '</div>';
                    } else if (v == STR_START_USING) {
                        return STR_START_USING;
                    } else if (v == STR_LOADING_SHORT) {
                        return STR_LOADING_SHORT;
                    } else {
                        return '<div class="fontSize9375 baseColor1">' + STR_UNAUTHORIZED + '</div>';
                    }
                } else {
                    return ""
                }
            }
        }
    },
    el: "#myEnt",
    model: new myEntModel(),
    load: function () {
        var self = this;
        appcan.window.openToast(STR_LOADING_SHORT);
        var tenant = appcan.getLocVal(storeKeys.TENTANTCOUNT).toLowerCase();
        ;
        this.model.fetch({
            url: contactUrl + "getEntInfo?shortName=" + tenant,
            success: function (model, resp, options) {
                appcan.window.closeToast();
                appcan.frame.resetBounce(0);
            },
            error: function (model, error, options) {
                appcan.window.closeToast();
                appcan.frame.resetBounce(0);
                switch (error.status) {
                    default:
                        global_error(error);
                        break;
                }
            }
        });
    }
});


var myEntViewInstance = new myEntView();

