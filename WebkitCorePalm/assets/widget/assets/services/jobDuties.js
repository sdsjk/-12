
var jobDutiesService = {
    /**
     *假数据返回 
 * @param {Object} data
 * @param {Object} options
     */
    requestStub : function(data, options) {
        try
        {
            var testData={"status":"000","msg":{"item":{"dptId":"zzjg0004","dptName":"产品研发中心","postId":"zw0048","postName":"开发经理","jobDuty":"xxxxxxxxxxxxxxxx\nxxxxxxxxxxxxxxxxx\nxxxxxxxxxxxxxxxxxxxxxxxxxxx\nxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx","keyKpl":"xxxxxxxxx"}}}
            options.success(testData);
        }
        catch(e){
            options.error(e);
        }
    },
    /**
     *真接口调试 
 * @param {Object} data
 * @param {Object} options
     */
    request:function(data,options){
        var dataObj = {
            "ifno" : "zywx-duty-0001",
            "condition" : {
            },
            "content" : {
            }
        }
        dataObj=JSON.stringify(dataObj);
        try{
            this.ajaxCall(constant.APP_URL,'post',dataObj,options);
        }catch(e){
            options.error(e);
        }
        
    }
};
_.extend(jobDutiesService, BaseService);

