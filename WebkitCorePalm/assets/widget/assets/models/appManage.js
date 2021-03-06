var STR_SERVER_MESSAGEERROR = tools.getString("STR_SERVER_MESSAGEERROR");

var appModel = Backbone.Model.extend({
	idAttribute: "appId"
})

var appCollection = Backbone.Collection.extend({
	initialize: function() {
		this.listenTo(this.service, "YGET_APPLIST_CB", function(list) {
			if (this.options) {
				try {
					var d = JSON.parse(list);
					if (d.status == "ok") {
						var list = d.info;
						appcan.setLocVal("CACHE_APPS_LIST", JSON.stringify(list));
						this.options.success(list);
					} else {
						this.options.error(d.info);
					}
				} catch (e) {
					this.options.error({
						status: -30000,
						msg: {
							message: STR_SERVER_MESSAGEERROR
						}
					});
				}
			} else {
				appcan.frame.resetBounce(0);
			}
		})
	},
	model: appModel,
	service: appViewService, //服务，负责处理数据交互
	parse: function(resp) {
		return resp;
	},
	sync: function(method, model, options) {

		switch (method) {
			case "create":
			case "update":
			case "patch":
				break;
			case "read":
				this.options = options;
				this.service.request({}, options);
				break;
			case "delete":
				break;
			default:
				break;
		}
	}
})