<li class="uinn ub">
    <div><div class=" ub-img remindIconSize <%=iconSet(data.remindType)%>"></div></div>
    <div class="uinn4"></div>
    <div class="left ub-img leftPosition"></div>
    <div class="uba baseBorderColor bg-wh uinnremind ub-f1 uc-a1">
        <div class=" ub-f1 break_word baseColor uinnb5 baseBottom remindTitle">
        	<%=setTitle(data.remindType, data.csmName, data.contactName, data.opptTtl, data.marketUserName, data.salesUserName)%> 
        </div>
        <div class="ub ub-f1 ub-ac ub-pc ">
            <div class="baseColor1 ulev-1 uinnt5 uinnb2 ub-f1">
            	<%=setLabel(data.remindType)%>
            </div>
        <div class="ub ub-img tagimgR tagwh3 ulev-1 "></div></div>
    </div>
    <div class="uinn ulev-1 readStatus">
    	<%=setStatus(data.ifRead)%>
    </div>
</li>