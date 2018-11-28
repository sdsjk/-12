//扫码登录
function scannerLogin(data){
    var loginName = appcan.getLocVal('loginName');
    var mobileNo = JSON.parse(appcan.getLocVal("emmToken")).info.mobileNo;
    var email = JSON.parse(appcan.getLocVal("emmToken")).info.email;
    var AccessToken = appcan.getLocVal("emmAccessToken");
    var SoftToken = appcan.getLocVal("emmSoftToken"); 
    var code = data.code;
    var url = config.server_emm+'appqr/eipLogin';
    appcan.request.post(url,{jsonObj:{
        "loginName": loginName,
        "mobileNo": mobileNo,
        "email":email,
        "accessToken":AccessToken,
        "softToken":SoftToken,
        "qrNum":code,
        "epsessionId":code}},function(data, status, xhr){ 
            var data = JSON.parse(data);
            if(data.status === "ok"){
                      appcan.window.confirm({
                           title: "提示",
                           content: "登录成功",
                           buttons: ['确认']
                      });
            }else if(data.status === "fail"){
                      appcan.window.confirm({
                           title: "提示",
                           content: data.info,
                           buttons: ['确认']
                      });
            }
        });
}
