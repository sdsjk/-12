<li style="position: relative;border-bottom:1px solid #EEE;color: black;display: -webkit-box !important;display: box !important;-webkit-box-align: center;box-align: center; padding:0;"  >
    <div class="scroll-bar uanim" style="width: 100%;z-index:99;overflow:hidden;background-color: white;margin-left: 0px; display: -webkit-box !important;display: box !important;-webkit-box-align: center;box-align: center; ">
         <div style ="background-color:white;" class="ub ub-f1 lef-padd2 rig-padd1 bot-padd2 ubb-color top-padd3 group">
            <div class="uhide aaa"></div>
            <div class="ub ub-img ql-wh ql-img3"></div>
            <div class="ub ub-ver ub-f1 lef-padd3 ub-pc msg">
                <div class="bot-padd5 abc ut-s name"><%=data.name%></div>
                <div class="color3 ut-s message"><%=dealContent(data.message)%></div>
            </div>
        </div>
    </div>
    <div class="scroll-right ub ub-ac ub-pc" style="position: absolute;right:0;height:100%;width:4em">
        <div style="background-color:red;height:100%" class="ub-f1 ub ub-ac ub-pc">
            <div style="color: white" class="delete">
                <%=quitGroupStr()%>
            </div>
        </div>
    </div>
</li>
