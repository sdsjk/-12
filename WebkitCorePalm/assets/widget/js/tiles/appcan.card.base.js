appcan.define("cardbase", function($, exports, module) {

    var model = '<div class="ub card-mar2 "><div class="ub-f1 ub"><div style="width: 100%;z-index:99;overflow:hidden;margin-left:0px; "class="scroll-bar ub  ub-ver uba card-h borderColor bg-white  " id="<%=option.param.cardId%>">'
            +'<div class="ub card-h1 xiangdui border-bottom">'
                +'<div class="ub-f1  ub">'
                    +'<div class=" tabview"></div><div class="ub-f1 "></div>'
                +'</div>'
                +'<div class="card-w "></div>'
                +'<div class="ub card-w ub-pe card-h1 juedui right btngroup ">'
                     +'<%if(option.param.cardBtn){%>' 
                     +'<%option.param.cardBtn.forEach(function(item){%>'
                     +'<%if(item.type == "btn"){%>'
                     +'<div class="ub ub-f1 ub-ac all-wh" style="padding-right:.78125em" data-operation="<%=item.operation%>">'
                     +'<div class="ub ub-f1 ub-img-r1 all-wh <%=item.operation%>-img" ></div>' 
                     +'</div>' 
                     +'<%} else if(item.type == "collapse"){%>'
                     +'<div class="ub ub-f1 ub-ac downSimg" style="padding-right:.78125em" data-operation="<%=item.operation%>">'
                     +'<div class="ub ub-f1 ub-img-r1 sheet-wh downS-img" ></div>'
                     +'</div>'
                     +'<%}%>'
                     +'<%});%>'
                     +'<%}%>' 
                +'</div>'
            +'</div>'
            +'<div class="ub ub-f1 ub-ac ub-pc cardcontent">'
            +'</div>'
        +'</div>'
        +'<div class="scroll-right ub uabs-r ub-fv"style="width:8em" ><div class="ufl uinn ub ub-ac ub-pc ub-f1"><div class="card-pad2 uc-a1  delete headColor ub ub-ac"style="background-color:red;margin-right:-.5em"><div class="delete-img-right all-wh ub-img"></div><div class="card-pad2"style="font-size:.9em;color:white">删除</div></div></div></div></div>'
        +'<div style="width:2px;height:1px"></div></div>';
    var bounceState;
    var html = appcan.view.template(model);
    //判断是否在手机端
    function isWindows() {
        if (!('ontouchstart' in window))
            return true;
    }

    function BaseCard(option,option1) {
        appcan.extend(this, appcan.eventEmitter);
        var self = this;
        self.option = $.extend({
        }, option, true);
        self.option1 = $.extend({
        }, option1, true);
        if(uexWindow.getBounce && typeof uexWindow.getBounce === 'function'){
            appcan.window.getBounceStatus(function(dt,dataType,opId){
                bounceState = dt;
            });
        }
        self.defaultView = $('<div class="ub ub-f1 ub-img load-wh loading-img ub-ac ub-pc"></div>');
        self.errorView = $('<div class="ub ub-f1 ub-img load-wh fail-img ub-ac ub-pc"></div>');
        self.init();
         
    };
    
    BaseCard.prototype = {
        init : function() {
            var self = this;
            self.tabIndex = 0;
            self.ele = $(html({
                option : self.option
            }));
            self.timeEvent = '_APPCAN_USECARDLOADTIME_EVENT';
            self.clickEvent = '_APPCAN_USECARDTIME_EVENT';
            self.addEvent = "_APPCAN_ADDCARD_EVENT";
            self.id = self.option.param.cardId;
            self.content = $(".cardcontent", self.ele);
            self.tabview = $(".tabview", self.ele);
            self.btngroup = $(".btngroup", self.ele);
            /**TAB操作************************************/
                //初始化tabview
                var tabview = appcan.tab({
                    selector : self.tabview,
                    hasIcon : false,
                    hasAnim : true,
                    hasLabel : true,
                    hasBadge : false,
                    data : self.option.param.content
                });
                tabview.on("click",function(obj, index){
                    if(self.tabIndex==index){
                        refreshFlag=true;
                    }else{
                        refreshFlag=false;
                    }
                    self.tabIndex = index;
                    self._update();
                    
                });
            self.tabviewObj = tabview;
            /**按钮操作************************************/
            appcan.button($(".downSimg", self.btngroup), "opacity ", function(){
              var keys = [];
                uexWindow.cbActionSheet = function(a, b, data) {
                  if(keys[data]) {
                    btnOperation(keys[data]);
                  }
                };
                var operation = this.getAttribute('data-operation');  
                var operations = operation.split(',');
                var opt = {
                  "top" : "置顶",
                  "delete" : "删除",
                  "refresh" : "刷新"
                };  
                var str = [];
                operations.forEach(function(item){
                  if(opt.hasOwnProperty(item)) {
                    keys.push(item);
                    str.push(opt[item]);
                  }
                });
                uexWindow.actionSheet("菜单","取消", str);
            });
            //单个按钮操作
            appcan.button($(".allwh", self.btngroup), "opacity ", function(){
              var operation = this.getAttribute('data-operation'); 
              btnOperation(operation);
            });
            //按钮具体操作
            function btnOperation(operation) {
              switch(operation) {
                case 'top' : 
                appcan.window.publish("CARD_WORK_TOP",self.id)
                  break;
                case 'delete' : 
                appcan.window.publish("CARD_WORK_DEL",self.id)
                  break;
                case 'refresh' :
                appcan.window.publish("CARD_WORK_REFRESH",self.id) 
                  break;
              }
            }
            self.ele.card = self;
            {
              self._update();
            }
            self.duration = "300ms";
            var startX = 0,startY = 0,moveX = 0,moveY = 0;
            var delWidth = $(".scroll-right").width();
            var startMarginLeft = 0;
            var scrollEnable = true;//是否允许左右滑动
            var flag = 0;//是否已经计算过角度
            var mousedown = false;
    
            //返回角度
            function angle(start, end) {
                var diff_x = end.x - start.x,
                    diff_y = end.y - start.y;
                return 360 * Math.atan(diff_y / diff_x) / (2 * Math.PI);
            }
    
            self.ele.off("touchstart", ".scroll-bar").on("touchstart", ".scroll-bar", function(evt) {
                if(bounceState == 1){
                    appcan.window.disableBounce();
                }
                scrollEnable = true;
                flag = 0;//是否已经计算角度标记
                var touch = evt.touches[0];
                startX = touch.pageX;//起始x坐标
                startY = touch.pageY;//起始Y坐标
                moveX = touch.pageX;//移动X坐标
                moveY = touch.pageY;//移动Y坐标
                startMarginLeft = parseInt($(this)[0].style.marginLeft);//起始marginLeft
                delWidth = $(this).siblings(".scroll-right").width();//
                $(".scroll-bar").css({
                    '-webkit-transition-duration' : "0s"
                });
            });
            self.ele.off("touchmove", ".scroll-bar").on("touchmove", ".scroll-bar", function(evt) {
                if (scrollEnable == false) {
                    return;
                } else {
                    var touch = evt.touches[0];
                    moveX = touch.pageX;
                    moveY = touch.pageY;
                    if (isNaN(startMarginLeft)) {
                        startMarginLeft = 0;
                    }
                    
                    var marginLeft = startMarginLeft + moveX - startX;
                    marginLeft = marginLeft<0?marginLeft:0;//不能滑动到右边界外
                    if (flag == 0) {
                        var startPoint = {
                            x : startX,
                            y : startY
                        };
                        var movePoint = {
                            x : moveX,
                            y : moveY
                        };
                        var angles = angle(startPoint, movePoint);
                        flag = 1;
                        if (parseInt(angles) < -30 || parseInt(angles) > 30) {
                            if(bounceState == 1){
                                appcan.window.enableBounce();
                            }
                            scrollEnable = false;
                        } else {
                            
                            if (parseInt($(this)[0].style.marginLeft) > 0) {
                                return;
                            }
                           
                            $(this).css({
                                '-webkit-transition-duration' : "0s",
                                marginLeft : marginLeft
                            });
                            evt.preventDefault();
                        }
                    } else {
                        if (scrollEnable == false) {
                            return;
                        }
                        if (parseInt($(this)[0].style.marginLeft) > 0) {
                            return;
                        }
                        $(this).css({
                            '-webkit-transition-duration' : "0s",
                            marginLeft : marginLeft
                        });
                    }
                }
    
            });
            self.ele.off("touchend", ".scroll-bar").on("touchend", ".scroll-bar", function(evt) {
                if(bounceState == 1){
                    appcan.window.enableBounce();
                }
                if (!scrollEnable)
                    return;
                if (!this.cancelClick) {
                    this.cancelClick = true;
                    this.addEventListener('tap', function() {
                        if(startMarginLeft==0&&(startX - moveX)==0){
                        
                        }else{
                            event.stopPropagation();
                        }
                    }, true);
                }
                if ((startX - moveX) > delWidth / 2) {
                    $(this).css({
                        '-webkit-transition-duration' : self.duration,
                        marginLeft : -delWidth
    
                    }); 
                } else {
                    $(this).css({
                        '-webkit-transition-duration' : self.duration,
                        marginLeft : 0
                    });
                }
            });
            self.ele.off("touchcancel", ".scroll-bar").on("touchcancel", ".scroll-bar", function(evt) {
                if(bounceState == 1){
                    appcan.window.enableBounce();
                }
                if (!scrollEnable)
                    return;
                if (!this.cancelClick) {
                    this.cancelClick = true;
                    this.addEventListener('tap', function() {
                        if(startMarginLeft==0&&(startX - moveX)==0){
                        
                        }else{
                            event.stopPropagation();
                        }
                    }, true);
                }
                if ((startX - moveX) > delWidth / 2) {
                    $(this).css({
                        '-webkit-transition-duration' : self.duration,
                        marginLeft : -delWidth
                    });
                } else {
                    $(this).css({
                        '-webkit-transition-duration' : self.duration,
                        marginLeft : 0
                    });
                }
            });    

            self.ele.off("mousedown", ".scroll-bar").on("mousedown", ".scroll-bar", function(evt) {
                var that = this;
                
                mousedown = true;
                scrollEnable = true;
                flag = 0;
                var touch = evt.touches ? evt.touches[0]:evt;
                startX = touch.pageX;
                startY = touch.pageY;
                moveX = touch.pageX;
                moveY = touch.pageY;
                startMarginLeft = parseInt($(this)[0].style.marginLeft);
                delWidth = $(this).siblings(".scroll-right").width();
            });
            self.ele.off("mousemove", ".scroll-bar").on("mousemove", ".scroll-bar", function(evt) {
                
                if(!mousedown)
                    return;
                if (scrollEnable == false) {
                    return;
                } else {
                    var touch = evt.touches ? evt.touches[0]:evt;
                    moveX = touch.pageX;
                    moveY = touch.pageY;
                    if (isNaN(startMarginLeft)) {
                        startMarginLeft = 0;
                    }
                    var marginLeft = startMarginLeft + moveX - startX;
                    marginLeft = marginLeft<0?marginLeft:0;//不能滑动到右边界外
                    if (flag == 0) {
                        var startPoint = {
                            x : startX,
                            y : startY
                        };
                        var movePoint = {
                            x : moveX,
                            y : moveY
                        };
                        var angles = angle(startPoint, movePoint);
                        flag = 1;
                        if (parseInt(angles) < -30 || parseInt(angles) > 30) {
                            scrollEnable = false;
                        } else {
                            if (parseInt($(this)[0].style.marginLeft) > 0) {
                                return;
                            } 
                           
                            $(this).css({
                                '-webkit-transition-duration' : "0s",
                                marginLeft : marginLeft
                            });
                            
                        }
                    } else {
                        if (scrollEnable == false) {
                            return true;
                        }
                        if (parseInt($(this)[0].style.marginLeft) > 0) {
                            return;
                        } 
                        $(this).css({
                            '-webkit-transition-duration' : "0s",
                            marginLeft : marginLeft
                        });
                        
                    }
                }
               
    
            });
            self.ele.off("mouseup", ".scroll-bar").on("mouseup", ".scroll-bar", function(evt) {
                mousedown = false;
                if (!scrollEnable)
                    return;
                
                if (!this.cancelClick) {
                    this.cancelClick = true;
                    this.addEventListener('click', function() {
                        if(startMarginLeft==0&&(startX - moveX)==0){
                        
                        }else{
                            event.stopPropagation();
                            event.preventDefault();
                        }
                    }, true);
                }
                
                if ((startX - moveX) > delWidth / 2) {
                    $(this).css({
                        '-webkit-transition-duration' : self.duration,
                        marginLeft : -delWidth
    
                    }); 
                } else {
                    $(this).css({
                        '-webkit-transition-duration' : self.duration,
                        marginLeft : 0
                    });
                }
            });
            
             appcan.button($(".delete",self.ele),'btn-act',function(t){
                
                $(".scroll-bar",self.ele).css({
                    '-webkit-transition-duration' : self.duration,
                    marginLeft : 0
                });
                
                 btnOperation("delete");
             })
        },
        _update : function() {
           var self = this;
            self._defaultView();
            var cardurl = self.option.param.content[self.tabIndex].url;
            var card = self.option.param.content[self.tabIndex].url;;
            var cardTitle = self.option.param.content[self.tabIndex].label;
            var httpType = self.option.param.content[self.tabIndex].httpType;
            var data = parseInt(appcan.locStorage.val("cache"+self.id+cardTitle) || 1);
            var tttt = new Date();//每隔五分钟刷新
            var refreshtime = self.option.param.content[self.tabIndex].refresh|| 300000;
            if(cardurl.indexOf('http')<0) cardurl='';
            cardurl = cardurl?cardurl:urlHomePage;
            if(((tttt.valueOf() - data) < refreshtime) && refreshFlag != true){
                 var data = appcan.locStorage.val('TILES_'+self.id+cardTitle);
                  self._buildView && self._buildView(data);
            }
           else{
                   var userId = appcan.getLocVal("userId");
                   if(!httpType){
                       httpType = 'post';
                   }
                   try{uexDataAnalysis.beginEvent(self.timeEvent,cardTitle,"{"+self.id+":"+cardTitle+"}")}catch(e){};
                    appcan.request.ajax({
                        url : cardurl,//cardurl
                        headers : JSON.parse(get_header()),
                        data : {
                            "ifno" : "zywx-homePage-0001",
                            "condition" : {
                                "card":card
                            },
                            "content" : {
                            }
                        },
                        type : httpType,
                        timeout : "30000",
                        contentType : "application/json",
                        success : function(data) {
                            try{uexDataAnalysis.endEvent(self.timeEvent,cardTitle)}catch(e){};
                           
                            try {
                                //正常数据html代码，非json数据
                                var data1 = JSON.parse(data);
                                mas_result_do(data1);
                                 self._errorView();
                            } catch(e) {
                                appcan.locStorage.val('TILES_'+self.id+cardTitle,data);
                                appcan.locStorage.val("cache"+self.id+cardTitle,(new Date()).valueOf())
                                self._buildView && self._buildView(data);
                             
                            }
                            
                        },
                        error : function() {
                           try{uexDataAnalysis.endEvent(self.timeEvent,cardTitle)}catch(e){};
                           self._errorView();
                        }
                    }); 
                
            }
            
        },
         _buildView : function(data) {
            var self = this;
            self.content.empty();
            self.content.append(data);
        },
        _defaultView : function() {
            var self = this;
            self.content.empty();
            self.content.append(self.defaultView);
        },
        _errorView : function(data){
            var self = this;
            self.content.empty();
            self.content.append(self.errorView);
            appcan.button(self.errorView, "ani-act", function() {
               refreshFlag=true;
               self._update();
           });
        },
        _action:function(action,param){
            var self = this;
            var cardId = self.id;
            var cardName = self.option.param.content[self.tabIndex].label;
            try{uexDataAnalysis.setEvent(self.clickEvent,"{"+cardId+":"+cardName+"}")}catch(e){};
            switch(action.type){
                case "openNatvie":
                    getNativeApp(action.cardId,param);
                break;
                case "openWEB":
                    appcan.setLocVal("CARD_PARAM",param);
                    appcan.window.open("webWind","webWind.html",10);
                break;
                case "openWindow":
                    appcan.setLocVal("CARD_PARAM",param);
                    appcan.window.open(action.window);
                break;
                case "startWgt":
                 getapp(action.widget.appId,param); //调用插件打开子应用
                 break;
            }
        }
    }
    module.exports = function(option,option1) {
        return new BaseCard(option,option1);
    };
});
