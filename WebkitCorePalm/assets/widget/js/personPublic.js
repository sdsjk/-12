//搜索框输入触发事件
function OnInput(){          
       var search_text = $('#my_feedBack').val();  
        
       if(search_text != "" || search_text.length != 0){
           isProSearch =true;
           $('#remove').removeClass('uhide-serach');
           $('#cancelBtn').removeClass('uhide');
           $('#tabProblems').addClass('uhide');
           $('#problemslist').addClass('uhide');
           $('#searchTxt').removeClass('uhide');
       }else{
           
           $('#remove').addClass('uhide-serach');
       }
       
}
function OnTextarea(){
    var liuyneir = $('#liuyneir').val();
    if(liuyneir == "" || liuyneir.length == 0){
        $('#contentNum').html('0/200');
    }else{
        $('#contentNum').html(liuyneir.length+'/200');
    }
}
//获取年份//获取月份//获取日期
function NYRHM(date, flag) {               
        if (date) {
            var da = new Date(date);
            
        } else {
            var da = new Date();
        }
        if (isDefine(flag)) {
            if (flag == 1) {
                return da.getFullYear() + "-" + ((da.getMonth() + 1) < 10 ? "0" + (da.getMonth() + 1) : (da.getMonth() + 1)) + "-" + (da.getDate() < 10 ? "0" + da.getDate() : da.getDate());
            } else {
                return ((da.getMonth() + 1) < 10 ? "0" + (da.getMonth() + 1) : (da.getMonth() + 1)) + "-" + (da.getDate() < 10 ? "0" + da.getDate() : da.getDate());
            }

        } else {
            var year = da.getFullYear();
            var month = (da.getMonth() + 1) < 10 ? "0" + (da.getMonth() + 1) : (da.getMonth() + 1);
            var day = da.getDate() < 10 ? "0" + da.getDate() : da.getDate();
            var hours = da.getHours() < 10 ? " 0" + da.getHours() : da.getHours();            
            var minutes = da.getMinutes() < 10 ? "0" + da.getMinutes() : da.getMinutes();    
            var seconds = da.getSeconds() < 10 ? "0" + da.getSeconds() : da.getSeconds();    
            
             return year+"."+month+"."+day+" "+hours+":"+minutes+":"+seconds;
        }
}

function getHeaders() {
    var curTime = Date.now();
    var emmToken = JSON.parse(appcan.getLocVal("emmToken"));
    var accessToken = emmToken.info.accessToken;
    var tenantId = emmToken.info.tenantId || "";
    var headerParam = {
        "x-mas-app-id": appId,
        "accessToken": accessToken
    };
    if (tenantId) {
        headerParam.tenantId = tenantId + '';
    }
    return headerParam;
}
//过滤文本输入框中的表情符号
function isEmojiCharacter(substring) {  
    for ( var i = 0; i < substring.length; i++) {  
        var hs = substring.charCodeAt(i);  
        if (0xd800 <= hs && hs <= 0xdbff) {  
            if (substring.length > 1) {  
                var ls = substring.charCodeAt(i + 1);  
                var uc = ((hs - 0xd800) * 0x400) + (ls - 0xdc00) + 0x10000;  
                if (0x1d000 <= uc && uc <= 0x1f77f) {  
                    return true;  
                }  
            }  
        } else if (substring.length > 1) {  
            var ls = substring.charCodeAt(i + 1);  
            if (ls == 0x20e3) {  
                return true;  
            }  
        } else {  
            if (0x2100 <= hs && hs <= 0x27ff) {  
                return true;  
            } else if (0x2B05 <= hs && hs <= 0x2b07) {  
                return true;  
            } else if (0x2934 <= hs && hs <= 0x2935) {  
                return true;  
            } else if (0x3297 <= hs && hs <= 0x3299) {  
                return true;  
            } else if (hs == 0xa9 || hs == 0xae || hs == 0x303d || hs == 0x3030  
                    || hs == 0x2b55 || hs == 0x2b1c || hs == 0x2b1b  
                    || hs == 0x2b50) {  
                return true;  
            }  
        }  
    }  
} 