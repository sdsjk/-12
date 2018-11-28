if (UNIT_TEST) {
    var testcases = {
        "loginCase" : function() {
            loginService.request({
                username : "zhangsan",
                password : "111111"
            }, {
                success : function(data) {
                    UNIT_TEST.assertEqual(data.status, 0);
                },
                error : function(err) {
                    UNIT_TEST.assert(false, err);
                }
            })
        }
    };
    UNIT_TEST.addCase("loginService", testcases);
}