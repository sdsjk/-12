appcan.define("cardmgr", function($, exports, module) {

    function isWindows() {
        if (!('ontouchstart' in window))
            return true;
    }

    function CardManager(option) {
        appcan.extend(this, appcan.eventEmitter);
        var self = this;
        self.option = $.extend({
            selector : "body",
            softToken:""
        }, option, true);
        //卡片列表的包裹（父）元素
        self.ele = $(self.option.selector);
        self.cards = {};
        self.items = {};
        self.clickEvent = '_APPCAN_USECARDTIME_EVENT';
        self.addEvent = "_APPCAN_ADDCARD_EVENT";
        self.refreshtime = 60 * 1000;//每隔一分钟刷新
        self.init();
    };

    CardManager.prototype = {
        refresh : function(cardId) {
            var self = this;
            refreshFlag=true;
            self.items[cardId]._update();
            return self;
        },
        add : function(cardId) {
            var self = this;
            try{
            self.ele.append(self.cards[cardId].ele);
             
            }catch(E){
            }
            self.items[cardId] = self.cards[cardId];
            self.cards[cardId].tabviewObj.moveTo(self.cards[cardId].tabIndex);
            //重新初始化默认卡片
            var tiles = appcan.locStorage.val("TILES_WORK_DEFAULT");
            if (tiles) {
                tiles = JSON.parse(tiles);
            } else {
                tiles = [];
            }
            tiles.push(self.cards[cardId].option1);
            appcan.locStorage.val("TILES_WORK_DEFAULT", JSON.stringify(tiles));
            try{uexDataAnalysis.setEvent(self.cards[cardId].addEvent,"{"+cardId+":"+self.cards[cardId].option.param.content[self.cards[cardId].tabIndex].label+"}")}catch(e){};
            return self;
        },
        remove : function(cardId) {
            var self = this;
            self.items[cardId].ele.remove();
            delete cardManager.items[cardId];
            //重新初始化默认卡片
            var tiles = appcan.locStorage.val("TILES_WORK_DEFAULT");
            if (tiles) {
                tiles = JSON.parse(tiles);
            } else {
                tiles = [];
            }
            for (var i = tiles.length - 1; i >= 0; i--) {
                if (tiles[i].tilesList.param.cardId == cardId) {
                    tiles.splice(i, 1);
                    break;
                }
            }
            appcan.locStorage.val("TILES_WORK_DEFAULT", JSON.stringify(tiles));
            return self;
        },
        top : function(cardId) {
            var self = this;
            self.ele.prepend(self.items[cardId].ele);
            //重新初始化默认卡片
            var tiles = appcan.locStorage.val("TILES_WORK_DEFAULT");
            if (tiles) {
                tiles = JSON.parse(tiles);
            } else {
                tiles = [];
            }
            for (var i = tiles.length - 1; i >= 0; i--) {
                if (tiles[i].tilesList.param.cardId == cardId) {
                    tiles.unshift(tiles.splice(i,1)[0]);
                    break;
                }
            }
            appcan.locStorage.val("TILES_WORK_DEFAULT", JSON.stringify(tiles));
            return self;
        },
        tiles_update : function() {//离线存储更新数据
            var self = this;
            getTiles(function(data){
                appcan.locStorage.val("cache_tiles",(new Date()).valueOf())
                data = JSON.parse(data);
                //默认
                var defaultTiles = [];
                if (data.status == "ok") {
                    appcan.setLocVal("STORE_APP_INFO",JSON.stringify(data.appList));
                    var tiles = appcan.locStorage.val("TILES_WORK_DEFAULT");
                    if (tiles) {
                        tiles = JSON.parse(tiles);
                    } else {
                        tiles = [];
                    }
                    self.cards = {};
                    self.items = {};
                    self.ele.empty();
                    var appList = self.regroup(data.appList);
                    var entranceList = appcan.getLocVal("TILES_WORK_ENTRANCE")
                    appcan.window.publish("CARD_ENTRANCE_INIT",entranceList);
                    var defaultTiles = [];
                    var all = appcan.locStorage.val("TILES_WORK_ALL");
                    if (all) {
                        all = JSON.parse(all);
                    } else {
                        all = [];
                    }
                    appList.forEach(function(item) {
                        for (var i = 0,
                            len = tiles.length; i < len; i++) {
                            if (tiles[i].tilesList.param.cardId == item.tilesList.param.cardId) {
                                defaultTiles.push(item);
                                break;
                            }
                        }
                        if (i == len && item.tilesList.defaultTab) {
                            var isE = false;
                            for(var n=0,l=all.length; n<l; n++){
                                if(all[n].tilesList.param.cardId==item.tilesList.param.cardId){
                                   isE = true;
                                    break;
                                }
                            }
                            if(!isE)
                            defaultTiles.push(item);
                        }
                    });
                    tiles.forEach(function(item) {
                        for (var lenj = defaultTiles.length,j = lenj-1; j >= 0; j--) {
                            if (defaultTiles[j].tilesList.param.cardId == item.tilesList.param.cardId) {
                                defaultTiles.unshift(defaultTiles.splice(j,1)[0]);
                                break;
                            }
                        }
                        
                    });
                    defaultTiles.reverse();
                    self.buildcard(defaultTiles);

                    //所有卡片
                    appcan.locStorage.val("TILES_WORK_ALL", JSON.stringify(appList));
                    //默认卡片
                    appcan.locStorage.val("TILES_WORK_DEFAULT", JSON.stringify(defaultTiles));
                }

            });
        },
        init : function() {
            var self = this;
            var cardconfig = appcan.locStorage.val("TILES_WORK_DEFAULT");
            if (!cardconfig) {
                getTiles(function(data){
                    appcan.locStorage.val("cache_tiles",(new Date()).valueOf())
                        data = JSON.parse(data);
                        //默认
                        var defaultTiles = [];
                        if (data.status == "ok") {
                            appcan.setLocVal("STORE_APP_INFO",JSON.stringify(data.appList));
                            var appList = self.regroup(data.appList);
                            var entranceList = appcan.getLocVal("TILES_WORK_ENTRANCE")
                            appcan.window.publish("CARD_ENTRANCE_INIT",entranceList);
                            appList.forEach(function(item) {
                                if (item.tilesList.defaultTab) {
                                    defaultTiles.push(item);
                                }
                            });

                            self.buildcard(defaultTiles);

                            //所有卡片
                            appcan.locStorage.val("TILES_WORK_ALL", JSON.stringify(appList));
                            //默认卡片
                            appcan.locStorage.val("TILES_WORK_DEFAULT", JSON.stringify(defaultTiles));
                        } else {
                            
                        }
                })
            } else {
                var entranceList = appcan.getLocVal("TILES_WORK_ENTRANCE")
                appcan.window.publish("CARD_ENTRANCE_INIT",entranceList);
                var appList = self.regroup(JSON.parse( appcan.getLocVal("TILES_WORK_ALL")));
               
                self.buildcard(JSON.parse(cardconfig));
                //刷新
                var tttt = new Date();
                var data = parseInt(appcan.locStorage.val("cache_tiles") || 1);
                if(((tttt.valueOf() - data) > self.refreshtime)){
                    self.tiles_update();
                }
            }

        },
        regroup : function(appList) {
            var self = this;
            var rangeAll = [];//卡片
            var entranceList = [];//单纯入口
            for (var i = 0,
                len = appList.length; i < len; i++) {
                var app = appList[i];
                if (app.tilesList instanceof Array) {
                    if (app.tilesList.length > 0) {
                        var tilesList = app.tilesList;
                        for (var j = 0,
                            size = tilesList.length; j < size; j++) {
                                if(!tilesList[j].param) continue;
                            var tempApp = {};
                            for (var key in app) {
                                tempApp[key] = app[key];
                            }
                            if(typeof tilesList[j].param == 'string'){
                                tilesList[j].param = JSON.parse(tilesList[j].param);
                            }
                            tempApp.tilesList = tilesList[j];
                            tempApp.title=tempApp.tilesList.tilesname;
                            if(tilesList[j].param.cardType&&tilesList[j].param.cardType=="entrance"){
                                entranceList.push(tempApp);
                            }else{
                                rangeAll.push(tempApp);
                                var card = appcan.cardbase(tilesList[j], tempApp);
                                self.cards[tilesList[j].param.cardId] = card;
                            }
                        }
                        appcan.setLocVal("TILES_WORK_ENTRANCE",JSON.stringify(entranceList));
                    }
                } else if ( typeof app.tilesList == 'object') {
                    app.title=app.tilesList.tilesname;
                    rangeAll.push(app);
                    var card = appcan.cardbase(app.tilesList, app);
                    self.cards[app.tilesList.param.cardId] = card;
                }
            }
           
            return rangeAll;
        },
        buildcard : function(appList) {
            var self = this;
            try {
                appList.forEach(function(app) {
                    var cardId = app.tilesList.param.cardId;
                    if($('#'+cardId)&&$('#'+cardId)[0]) return;
                    self.ele.append(self.cards[cardId].ele);
                    self.items[cardId] = self.cards[cardId];
                    self.cards[cardId].tabviewObj.moveTo(self.cards[cardId].tabIndex);
                });
            } catch(e) {
                
            }
        }
    }
    module.exports = function(option) {
       
        return new CardManager(option);
    };
});
