

        <li style="position: relative;border-bottom:1px solid #EEE;color: black;display: -webkit-box !important;display: box !important;-webkit-box-align: center;box-align: center; padding:0;">
            <div class="scroll-bar uanim"
                 style="width: 100%;z-index:99;overflow:hidden;background-color: white;margin-left: 0px; display: -webkit-box !important;display: box !important;-webkit-box-align: center;box-align: center; ">
                <div class=" ub ub-f1 bg-wh wrapper">
                    <div class="ub ub-f1 bg-wh huihuaren abc">
                        <div class="uhide imgtm">
                            <!-- friendImg -->
                        </div>
                        <div class="ub ub-pc ub-ac pian">
                            <div class="hh-touxiang ub-img1 jj-magin1 bg-touxiang3 <%=dealIconChat(data.chatType)%>"
                                 data-original=""
                                 style="<%if(data.chatType!=1) print('background-image:url(css/img/qltx3.png)')%>">
                                <div class="ub ub-ac ub-pe">
                                    <div class="redcircle ulev-2 uinn1 uc-a2 red  tx-ff ub-ac ub-pc ub  iii <%=data.unreadCount?'':'uhide'%>  ">
                                        <div style="height: 1.6em" class="ub ub-pc ub-ac total unreadCount">
                                            <%=countSize(data.unreadCount)%>
                                        </div>
                                    </div>
                                </div>
                                <div class="ub ub-pc ub-ac uabs ub-con">
                                    <div class="ub ub-pc ub-ac "></div>
                                </div>
                            </div>
                        </div>
                        <div class="ub ub-f1  jj-magin13">
                            <div class="ub ub-ver ub-pc ub-f1">
                                <div class="ub ub-ac jj-padd7">
                                    <div class="hh-font1 jj-padd1 ub-f1 ddd chat_title ut-s fullName <%=(data.chatType==1?'':'groupDes')%>"
                                         data-imid="<%=data.imId%>">
                                        <%=data.chatType==1?"　":data.groupDes%>
                                    </div>
                                    <div class="zt-font8 jj-padd1 zt-color2 jjj timestamp">
                                        <%print(dateSet(data.timestamp))%>
                                    </div>
                                </div>
                                <div class="ub weidu">
                                    <div class="hh-font11  ub-f1  jj-padd7 ut-s zt-color2 ttt content">
                                        <%-dealContent(data.content)%>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="scroll-right ub ub-ac ub-pc" style="position: absolute;right:0;height:100%;width:4em">
                <div style="background-color:red;height:100%" class="ub-f1 ub ub-ac ub-pc">
                    <div style="color: white" class="delete">
                        <%=deleteButtonStr()%>
                    </div>
                </div>
            </div>
        </li>
