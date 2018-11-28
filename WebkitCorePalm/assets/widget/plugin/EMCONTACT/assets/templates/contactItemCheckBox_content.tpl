<li class="ub ubb bder-color ubb-cjmb del konglei bg-wh">
    <div class="ub ub-pc ub-ac gzcheckbox renwuzx_width1" >
       <input <%=setCheck(data.userId,data.fullName)%> id="<%=data.fullName%>" data-id="<%=data.userId%>" data-icon="<%=data.userIcon%>"  type="checkbox" class="che ub-img ub <%=data.fullName%>" name="glgzmb"/>
    </div>
    <div class="item ub ub-f1">
        <div class="ub ub-pc ub-ac ">
            <div class="bg-touxiang2 ub-img1 ub ub-ac ub-pc jj-magin7 bg-touxiang3 <%=setIcon(data.userIcon)%>"><%=setIconFont(data.userIcon)%></div>
        </div>
        <div class="ub ub-f1  xt-color father padding_toux ">
            <div class="ub ub-ver ub-pc ub-f2">
                <div class="zt-font4 "><%=data.fullName%></div>
                <div class="zt-font5 ub"><div class="ub-f1 ut-s"><%=data.roleName%></div></div></div>
            <div class="ub ub-pc ub-ac ub-f1"></div>
        </div>
    </div>
</li>