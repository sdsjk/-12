var STR_LOADING_SHORT = tools.getString("STR_LOADING_SHORT");
var STR_NODATA = tools.getString("STR_NODATA");

//我的企业
var myEntModel = Backbone.Model.extend({
    defaults: {
        "corpUrl": STR_LOADING_SHORT,
        "address": STR_LOADING_SHORT,
        "status": STR_LOADING_SHORT,
        "telNum": STR_LOADING_SHORT,
        "fullName": STR_LOADING_SHORT,
        "shortName": STR_LOADING_SHORT
    },
    /**
     *
     * @param {Object} resp
     */
    parse: function (resp) {
        if (!resp.shortName) {
            resp = {
                "corpUrl": STR_NODATA,
                "address": STR_NODATA,
                "status": STR_NODATA,
                "telNum": STR_NODATA,
                "fullName": STR_NODATA,
                "shortName": STR_NODATA
            }
        }
        return resp;
    },
    sync: function (method, model, options) {
        switch (method) {
            case "create":
            case "update":
            case "patch":
                break;
            case "read":
                myEntService.request(options);
                break;
            case "delete":
                break;
            default:
                break;
        }
    }
})