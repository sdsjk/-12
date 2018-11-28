var widgetId = null,
	appKey = null,
	uploadWgt = {},
	opening = 0,
	hasInit = null,
	initErro = null,
	refreshFlag = null,
	widgetParam = null,
	isIOS = false,
	srcType = "install";
appcan.ready(function() {
	var dd_token = appcan.getLocVal('emmAccessToken');
	var dd_softToken = appcan.getLocVal('emmSoftToken');
	var ip = "apps.shenzhenair.com";
	var port = "";
	isIOS = uexWidgetOne.platformName == 'iOS' ? true : false;
	if (!isSML) { //手机上
		loadAppStore();
		getAppList()
	}
	uexEMM.cbUpdateParams = cbUpdateParams;
	uexEMM.updateParams();

	appcan.window.subscribe("GET_STORE_APP_VERSION_INFO", function(m) {
		uexAppStoreMgr.getAppVersionInfo(m);
	});
	appcan.window.subscribe("EPORTAL_LOAD_APP", function(m) {
		if (m) {
			var appInfo = JSON.parse(m);
			var action = m.action ? m.action : null;
			startAppFromStore(appInfo.appId, appInfo.param, action);
		}
	});
	appcan.window.subscribe("GET_APPLIST", function() {
		var dataJson = {
			"type": "installAppFromAllList",
			"key": "",
			"pageSize": "200"
		};
		srcType = "install";
		uexAppStoreMgr.getAppList(JSON.stringify(dataJson));
	});
	appcan.window.subscribe("YGET_APPLIST", function() {
		var dataJson = {
			"type": "searchAppList",
			"key": "",
			"pageSize": "200"
		};
		srcType = "search";
		uexAppStoreMgr.getAppList(JSON.stringify(dataJson));
	});
	appcan.window.subscribe("START_WGT", function(data) {
		var data = JSON.parse(decodeURIComponent(data));
		var appId = data.appId;
		var pkgName = data.pkgName;
		var json = JSON.stringify({
			appData: pkgName
		});
		var appCategory = data.appCategoryName ? data.appCategoryName : data.appCategory;
		var url = "fms://" + ip + "/SplashActivity?softToken=" + dd_softToken + "&accessToken=" + dd_token + "&appId=" + appId;
		var add = '{"category":["android.intent.category.BROWSABLE","android.intent.category.DEFAULT"],"data":{"scheme":"' + url + '"}}';
		switch (appCategory) {
			case "AppCanNative":
				startWgt(data);
				break;
			case "AppCanWgt":
				widgetParam = '';
				startWgt(data);
				break;
			case "Web":
				var json = {
					name: data.name,
					url: data.pkgUrl,
		                        appId:appId,
                                        "extraInfo": {"opaque": "true", "bgColor": "#ecf3f7", "delayTime": "250"}
			        }
				appcan.setLocVal("CARD_PARAM", json);
				appcan.window.open("webWind", "webWind.html", 10)
				break;
			case "Native":
				if (!uexWidget.isAppInstalled(json)) {
					startWgt(data);
				} else {
					if (isAndroid) {
						uexWidget.startApp(1, 'android.intent.action.VIEW', add);
					} else if (isIOS) {
						uexWidget.loadApp(pkgName + ip + "/SplashActivity?softToken=" + dd_softToken + "&accessToken=" + dd_token + "&appId=" + appId);
					}

				}
				break;

		}
	})

	//启动待办子应用，打开待办详情
	appcan.window.subscribe("EPORTAL_TODO_START", function(str) {
		widgetParam = str;
		var obj = JSON.parse(str);
		var key = 'CACHE_APPS_TODO';
		if (obj.bizSystem == 'OIE') {
			key = 'CACHE_APPS_TODO_OIE';
		} else if (obj.bizSystem == 'CSM') {
			key = 'CACHE_APPS_TODO_CSM';
		}
		var data = appcan.getLocVal(key);
		data = JSON.parse(data);
		startWgt(data);
	});
	//启动绩效考核子应用
    appcan.window.subscribe('PERFORMANCE-START',function(str){
		widgetParam = str;
        var data = appcan.getLocVal('CACHE_APPS_PERFORMANCE');
        data = JSON.parse(data);
        startWgt(data);
    });
	//启动公司新闻子应用
	appcan.window.subscribe("EPORTAL_NEWS_START", function(str) {

		widgetParam = str;
		var data = appcan.getLocVal('CACHE_APPS_NEWS');

		data = JSON.parse(data);
		startWgt(data);
	});
	//启动公司文件子应用
	appcan.window.subscribe("EPORTAL_FILES_START", function(str) {

		widgetParam = str;
		var data = appcan.getLocVal('CACHE_APPS_CAM_FILE');

		data = JSON.parse(data);
		startWgt(data);
	});
	//启动值班信息子应用
	appcan.window.subscribe("EPORTA_DUTY_START", function() {

		var data = appcan.getLocVal('CACHE_APPS_DUTY');

		data = JSON.parse(data);
		startWgt(data);
	});
	//启动已办事项子应用
	appcan.window.subscribe("EPORTAL_HAVETODO_START", function(str) {
		widgetParam = str;

		var data = appcan.getLocVal('CACHE_APPS_HAVETODO');

		data = JSON.parse(data);
		startWgt(data);
	});
	//删除子应用通道，子应用打开失败时
	appcan.window.subscribe('DELETE-APP',function(data){
		try{
			var obj = JSON.parse(data);
			var widgetInfo = obj.data;
			var widgetInfoArr = new Array(widgetInfo);
			uexAppStoreMgr.cbDeleteMyApps = function (opId, dataType, data) {
				if(data == 1){
					appcan.locStorage.remove('isAppInstall-'+widgetInfo.appId);
				}
			}
			uexAppStoreMgr.deleteMyApps(JSON.stringify(widgetInfoArr));
		}catch(e){
		}
	});
});
var quandian = '';

function cbUpdateParams(opId, dataType, data) {}

function getTiles(cb) {
	uexAppStoreMgr.cbGetTiles = function(a, b, c) {
		cb(c);
	};
	uexAppStoreMgr.getTiles();
}


/**下载子应用**/
function loadAppStore() {
	var userId = appcan.getLocVal('userId');
	var toastopen = 0;
	var storeIp = server_emm;
	try {
		var percents = -1;
		uexAppStoreMgr.cbLoadWidget = function(a, b, c) {
			
			percents = -1;
			var obj = JSON.parse(c);
			var status = obj.status;
			var appId = obj.data.appId;
			var name = obj.data.name;
			var typeName = obj.data.appTypeName;
			if (status == 0) {
				uexToast.close();
			} else if (status == 1) {
				uexToast.close();
				//发送更新子应用状态广播
				appcan.window.publish("UPDATE_CHILD_APP_STATUS");
				if (opening == 1)
					return;

				opening = 1;
				if (typeof(widgetParam) != "string") {
					widgetParam = JSON.stringify(widgetParam);
				}
				//打开AppCanWgt子应用的回调
				uexWidget.cbStartWidget = function(opId, dataType, data) {
					
					//开启神策追踪事件
					var param = {
						event: 'lightApp',
						propertieDict: {
							userId: userId,
							lightAppId: appId,
							lightAppName: name ,
							lightAppType: typeName,
							operator: 'appStart'
							
						}
					};
					uexSensorsAnalytics.trackWithProperties(JSON.stringify(param));
		                    	var jsonObj = {leaveBreadcrumb:'启动子应用'};
		                    	uexNBSAppAgent.leaveBreadcrumb(JSON.stringify(jsonObj)); 
                                        opening = 0;
					if(!isAndroid){
						if(data == 0){
							//关闭加载提示
							setTimeout(function() {
								appcan.window.evaluateScript('appLoad', 'appcan.window.close(5)');
							}, 1200);
							appcan.setLocVal('isAppInstall-' + appId, 1);
							//单点登录，尊鹏之音

							var url = "https://cdms-mobile.shenzhenair.com:8082/cdms-mobile/ws/depart/shenHangSSOLogin ?softToken=" + dd_softToken + "&accessToken=" + dd_token + "&ip=" + ip + "&appId=" + appId;
							appcan.request.post(url, function(data, status, xhr) {
							});
						}else if(data == 3 || data == 1){
						       appcan.window.publish('DELETE-APP',JSON.stringify(obj));
						}
					}else{
					        //关闭加载提示
						setTimeout(function() {
							appcan.window.evaluateScript('appLoad', 'appcan.window.close(5)');
						}, 1200);
						appcan.setLocVal('isAppInstall-' + appId, 1);
								
						//单点登录，尊鹏之音

						var url = "https://cdms-mobile.shenzhenair.com:8082/cdms-mobile/ws/depart/shenHangSSOLogin ?softToken=" + dd_softToken + "&accessToken=" + dd_token + "&ip=" + ip + "&appId=" + appId;
						appcan.request.post(url, function(data, status, xhr) {

						});
					}
				};
				uexWindow.closeToast();
				// //绑定子应用，实现灰度发布

				uexEMM.setSubWidgetIsBindDevice(JSON.stringify({
					"appId": obj.data.appId,
					"isBindDevice": "true"
				}));
				//打开AppCanWgt子应用
				uexWidget.startWidget(obj.data.appId, '10', '', widgetParam, '250', obj.data.appKey);
			} else if (status == 2) {
				uexWindow.closeToast();
				uexToast.close();
				//发送更新子应用状态广播
				appcan.window.publish("UPDATE_CHILD_APP_STATUS");
				if (opening == 1)
					return;

				opening = 1;
				//判断是更新进入则不执行打开应用操作
				var appUpdate = appcan.getLocVal('APP-UPDATE-CLOSE');
				if (appUpdate == 1) {

					appcan.locStorage.remove('APP-UPDATE-CLOSE');
					opening = 0;
					appcan.window.publish("YGET_APPLIST", '');
				} else {
					if (typeof(widgetParam) != "string") {
						widgetParam = JSON.stringify(widgetParam);
					}

					//打开AppCanWgt子应用的回调
					uexWidget.cbStartWidget = function(opId, dataType, data) {


						//开启神策追踪事件
			                        var param = {
			                            event: 'lightApp',
			                            propertieDict: {
			                                userId: userId,
			                                lightAppId: appId,
			                                lightAppName: name ,
			                                lightAppType: typeName,
			                                operator: 'appStart'
                                
			                            }
			                        };
			                        uexSensorsAnalytics.trackWithProperties(JSON.stringify(param));
			                        var jsonObj = {leaveBreadcrumb:'启动子应用'};
			                        uexNBSAppAgent.leaveBreadcrumb(JSON.stringify(jsonObj));
			                        opening = 0;
						if(!isAndroid){
							if(data == 0){
								//关闭加载提示
								setTimeout(function() {
									appcan.window.evaluateScript('appLoad', 'appcan.window.close(5)');
								}, 1200);
								appcan.setLocVal('isAppInstall-' + appId, 1);
								//单点登录，尊鹏之音

								var url = "https://cdms-mobile.shenzhenair.com:8082/cdms-mobile/ws/depart/shenHangSSOLogin ?softToken=" + dd_softToken + "&accessToken=" + dd_token + "&ip=" + ip + "&appId=" + appId;
								appcan.request.post(url, function(data, status, xhr) {
								});
							}else if(data == 3 || data == 1){
							    appcan.window.publish('DELETE-APP',JSON.stringify(obj));
							}
						}else{
						        //关闭加载提示
							setTimeout(function() {
								appcan.window.evaluateScript('appLoad', 'appcan.window.close(5)');
							}, 1200);
							appcan.setLocVal('isAppInstall-' + appId, 1);
								
							//单点登录，尊鹏之音

							var url = "https://cdms-mobile.shenzhenair.com:8082/cdms-mobile/ws/depart/shenHangSSOLogin ?softToken=" + dd_softToken + "&accessToken=" + dd_token + "&ip=" + ip + "&appId=" + appId;
							appcan.request.post(url, function(data, status, xhr) {

							});
						}

					};
					uexWindow.closeToast();
					// //绑定子应用，实现灰度发布

					uexEMM.setSubWidgetIsBindDevice(JSON.stringify({
						"appId": obj.data.appId,
						"isBindDevice": "true"
					}));
					//打开AppCanWgt子应用
					uexWidget.startWidget(obj.data.appId, '10', '', widgetParam, '250', obj.data.appKey);
					appcan.window.publish("YGET_APPLIST", '');
				}
			} else if (status == 4) {
				uexWindow.closeToast();
				uexToast.close();
			} else if (status == 5) {

				//开启神策追踪事件
		                var param = {
		                    event: 'lightApp',
		                    propertieDict: {
		                        userId: userId,
		                        lightAppId: appId,
		                        lightAppName: name ,
		                        lightAppType: typeName,
		                        operator: 'appInstall'
                        
		                    }
		                };
                uexSensorsAnalytics.trackWithProperties(JSON.stringify(param));
				
			} else if (status == 6) {

			}
		};
		//退出按钮点击状态回调
		uexToast.cbExitBtnOnClick = function() {};
		uexToast.onOutOfViewTouch = function() {};
		uexAppStoreMgr.onStartDownload = function() {
			percents = -1;
			uexWindow.closeToast();

			var tostname = true;
			uexAppStoreMgr.cbGetProgress = function(a, b, c) {
				uexWindow.closeToast();
				if (tostname && c > 0) {

					var isAppId = appcan.getLocVal('APPID-INSTALL');
					var isAppInstall = appcan.getLocVal('isAppInstall-' + isAppId);
					if (isAppInstall) {
						appcan.setLocVal('APP-UPDATE-CLOSE', 1);
					}
					tostname = false;
				}

				if (c - percents >= 2) {
					
					percents = c;
				}

				if (c >= 100) {
					
					percents = -1;
					appcan.window.publish("YGET_APPLIST", '');
					tostname = true;
				}
			}
		};


		try {
			uexAppStoreMgr.cbGetAppVersionInfo = function(opId, dataType, data) {
				var data = data.replace(/\r\n/g, '<br>');
				appcan.window.publishForJson("CB_GET_STORE_APP_VERSION_INFO", data)
			}
		} catch (e) {}
		try {
			uexAppStoreMgr.open(storeIp);
			cardInit();
		} catch (e) {
			errorDetail(e);
		}
	} catch (e) {
		errorDetail(e);
	}
}

function getApps() {
	getTiles(function(data) {
		data = JSON.parse(data);
		//默认
		if (data.status == "ok") {
			appcan.setLocVal("STORE_APP_INFO", JSON.stringify(data.appList));
		} else {
			appcan.setLocVal("STORE_APP_INFO", '[]');
		}

	})
}

function startWgt(appInfo) {
	
	widgetId = appInfo.appId;
	appKey = appInfo.appKey;
	var appName = appInfo.name;
	appcan.setLocVal('APPID-INSTALL', widgetId);
	appcan.setLocVal('APP-NAME', appName);
	var json = JSON.stringify(appInfo);
    appcan.window.open('appLoad','appLoad.html',10);    
	if (!isDefine(appInfo.serviceStatus) || appInfo.serviceStatus == 2) {
		
		uexAppStoreMgr.loadWidget(json);

		
	} else {
		var TIP_NOTICE = tools.getString("TIP_NOTICE");
		var BTN_OK = tools.getString("BTN_OK");
		var STR_STORE_NORIGHT = tools.getString("STR_STORE_NORIGHT");
		appcan.window.alert({
			title: TIP_NOTICE,
			content: STR_STORE_NORIGHT + "：400-040-1766",
			buttons: [BTN_OK],
			callback: function(err, data1, dataType, optId) {

			}
		});
	}

}

function getapp(appId, param) {
	var data = appcan.getLocVal("CACHE_APPS_LIST") || appcan.locStorage.val("TILES_WORK_ALL");
	var data = JSON.parse(data);
	widgetParam = param;
	for (var i in data) {
		if (data[i].appId == appId) {
			startWgt(data[i]);
			break;
		}
	}
}

function getEntranceApp(data, param) {
	widgetParam = param;
	startWgt(data);
}

function startAppFromStore(appId, param, action) {
	
	var data = appcan.getLocVal("CACHE_APPS_LIST");
	
	data = JSON.parse(data);
	widgetParam = param;
	for (var i in data) {
		if (data[i].appId == appId) {
			if (!isDefine(data[i].serviceStatus) || data[i].serviceStatus == 2) {
				if (action == "Web") {
					var json = {
						name: data[i].name,
						url: data[i].pkgUrl,
						"extraInfo": {
							"opaque": "true",
							"bgColor": "#ecf3f7",
							"delayTime": "250"
						}
					};
					appcan.setLocVal("CARD_PARAM", json);
					appcan.window.open("webWind", "webWind.html", 10)
				} else
					startWgt(data[i]);
				break;
			} else {
				var TIP_NOTICE = tools.getString("TIP_NOTICE");
				var BTN_OK = tools.getString("BTN_OK");
				var STR_STORE_NORIGHT = tools.getString("STR_STORE_NORIGHT");
				appcan.window.alert({
					title: TIP_NOTICE,
					content: STR_STORE_NORIGHT + "：400-040-1766",
					buttons: [BTN_OK],
					callback: function(err, data1, dataType, optId) {}
				});
			}
		}
	}
}

function getNativeApp(cardId, param) {
	try {
		uexWidget.cbIsAppInstalled = function() {
			var result = JSON.parse(info);
			if (result.installed == 0) {
				if (isIOS) {
					uexWidget.loadApp(param.iosMainInfo + '://' + param.iosOptInfo);
				} else {
					uexWidget.startApp(param.startMode, param.androidMainInfo, param.addInfo, param.androidOptInfo);
				}
			} else {
				var data = appcan.locStorage.val("TILES_WORK_ALL");
				var data = JSON.parse(data);
				for (var i in data) {
					if (data[i].tilesList.param.cardId == cardId) {
						if (!isIOS) {
							uexWidget.startApp("1", "android.intent.action.VIEW", JSON.stringify({
								"data": {
									"mimeType": "text/html",
									"scheme": data[i].pkgUrl
								}
							}));
						} else {
							uexWidget.loadApp(data[i].pkgUrl);
						}
						break;
					}
				}
			}
		}
		uexWidget.isAppInstalled({
			appData: param.mainInfo
		});

	} catch (e) {
		
	}
}

//获取应用列表
function getAppList() {
	var dataJson = {
		"type": "searchAppList",
		"key": "",
		"pageSize": "200"
	};
	srcType = "search";
	uexAppStoreMgr.cbGetAppList = function(mid, type, data) {
		var data = data.replace(/\r\n/g, '<br>');
		if (srcType == "search") {
                        appcan.setLocVal("CACHE_APPS_CENTER_LIST", data);
			appcan.window.publish("YGET_APPLIST_CB", data);
			

		} else {
			appcan.window.publish("GET_APPLIST_CB", data);
		}
	};

	uexAppStoreMgr.getAppList(JSON.stringify(dataJson));
}