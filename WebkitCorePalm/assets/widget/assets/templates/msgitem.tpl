<li class="ub ub-f1 bg-wh ubb borderColor msglist">
    <div class="ub ub-pc ub-ac pian">
        <div class="hh-touxiang ub-img jj-magin1 bg-touxiang3 todo lazy"style="background-image: url(css/img/appOA.png)" data-original="<%=data.icon%>">
        	<div class="ub ub-ac ub-pe">
                <div style="margin: -.5em;"  class="redcircle ulev-2 uinn1 uc-a2 red  tx-ff ub-ac ub-pc ub  iii <%=data.isShow?'':'uhide'%>  ">
                	<div style="height: 1em" class="ub ub-pc ub-ac total">
                	</div>
                </div>
             </div>
        </div>
    </div>
    <div class="ub ub-f1  jj-magin13">
        <div class="ub ub-ver ub-pc ub-f1">
            <div class="ub ub-ac jj-padd7">
                <div class="hh-font1 jj-padd1 ub-f1 ut-s">
                    <%=data.header%>
                </div>
                <div class="zt-font8 jj-padd1 zt-color2 jjj createdAt">
                    <%=dateSet(data.createdAt)%>
                </div>
            </div>
            <div class="ub ">
                <div class="hh-font11  ub-f1  jj-padd7 zt-color2 ttt ut-s title">
                   <%=data.title%>
                </div>
            </div>
        </div>
    </div>
</li>