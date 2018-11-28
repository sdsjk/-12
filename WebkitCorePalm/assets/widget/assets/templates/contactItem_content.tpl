<li class="ub uinn-26 ubb borderColor">
    <div class="ub del ub-f1">
         <div class="ub ub-pc ub-ac"><div class="ub ub-img1 jj-magin7 ub-pc ub-ac bg-touxiang5 <%=setIcon(data.userIcon)%>"><%=setIconFont(data.userIcon)%></div></div>
         <div class="ub ub-ver ub-pc ub-f1">
             <div class="zt-font4 name abc ygnme"><%=data.fullName%></div>
             <div class="zt-font5 ub uinn-222 ub-ac"><div class="ub-f1 ut-s roleName"><%=data.dptName2%></div></div>
         </div>
     </div>
     <div class="ub ub-pc ub-ac lef-padd2 rig-padd1" id="bm-phone">
          <div class="<%=isMobile(data.mobileNo)%> bm-phonewh ub-img"></div>
      </div>
      <div class="ub ub-pc ub-ac lef-padd2 rig-padd1" id="bm-xxduihua">
          <div class="<%=isOneself(data.userId,data.mobileNo)%> jj_l_marg5 ub-img" id="<%=data.userId%>" style="margin-left:0"></div>
      </div>
</li>     
