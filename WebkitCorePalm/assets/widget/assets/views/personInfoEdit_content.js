var STR_MALE = tools.getString("STR_MALE"),
    STR_FEMALE = tools.getString("STR_FEMALE"),
    STR_TAKE_PICTURES = tools.getString("STR_TAKE_PICTURES"),
    STR_PHOTOS = tools.getString("STR_PHOTOS"),
    STR_RESTORE_HEAD_ICON = tools.getString("STR_RESTORE_HEAD_ICON"),
    STR_MENU = tools.getString("STR_MENU"),
    BTN_CANCEL = tools.getString("BTN_CANCEL"),
    STR_SUBMITTING = tools.getString("STR_SUBMITTING"),
    STR_INFO_UPDATED = tools.getString("STR_INFO_UPDATED");

var personInfoView = Backbone.View.extend({//options...
    initialize: function () {
        try {
            var staffId = appcan.getLocVal("userId")  || localStorage.getItem("userId");            
            this.model = new userInfoModel({}, {
                userId: staffId
            });
            this.updateData();
            this.listenTo(this.model, "change", this.updateData);
            this.stickit();
        } catch (e) {
        }
    },
    el: '#userInfo',
    bindings: {
        "#tel": "teleNo2",
        "#tel2": "teleNo",
        "#phone": "mobileNo",
        "#email": "email",
        "#userSex": "userSex"
    },
    sexSet: function (type) {
        var sexType = {"male": STR_MALE, "female": STR_FEMALE};
        return sexType[type];
    },
    modelSet: function () {
        this.bindingEvents();
    },
    updateData: function () {
        var info = this.model.toJSON();
        if(this.model.hasChanged("userIcon")) {
            var imgIcon = info.userIcon;
            var fullName = info.fullName;
            var lastNameStr = '';
            var lastName = fullName.substring((fullName.length) - 1, fullName.length);
            var lastNameSP = shouPin.getCamelChars(lastName);
            var firstName = fullName[0];
            lastNameStr = '<div style="font-size:1.5em;text-align:center;color:#ffffff;">' + firstName + '</div>';
            $('div.lazy').css("background-color", generateColor(lastNameSP));
            var img = $("div.lazy").css("background-image");
            if (imgIcon) {
                $("div.lazy").data("original", constant.IMG_URL + imgIcon)
                appcan.ready(function () {
                    $("div.lazy").lazyload({
                        cache: true,
                        callBack: function (path, s) {
                            s.dom.css('background-image', 'url("' + path + '")');
                            s.dom.empty();
                        }
                    });
                })
    
            }
        }

        info.userSex = info.sexId == "女" ? "female" : "male";
        this.model.set({"userSex": info.userSex}, {silent: true})
        this.model.set({"email": ($.trim(info.email))}, {silent: true});
        $('#userSex').val(info.userSex);
        $('#sexN').html(this.sexSet(info.userSex)+' . ');
    },
    bindingEvents: function () {
        var self = this;
        appcan.button("#imgurl", "btn-act", function () {
            uexWindow.cbActionSheet = function (a, b, data) {
                switch (parseInt(data)) {
                    case 0:
                        self.getCam();
                        break;
                    case 1:
                        self.selPic();
                        break;
                    case 2:
                        self.model.set({"userIcon": ""}, {silent: true});
                        var info = self.model.toJSON();
                        var fullName = info.fullName;
                        var lastNameStr = '';
                        var lastName = fullName.substring((fullName.length) - 1, fullName.length);
                        var lastNameSP = shouPin.getCamelChars(lastName);
                        lastNameStr = '<div style="font-size:1.5em;text-align:center;color:#ffffff;">' + lastName + '</div>';
                        $("div.lazy").css("background-image", "url('../css/icons/crmtouxiang.png')");
                        break;
                }
            };
            var str = [STR_TAKE_PICTURES, STR_PHOTOS, STR_RESTORE_HEAD_ICON];
            uexWindow.actionSheet(STR_MENU, BTN_CANCEL, str);
        })
    },
    getCam: function () {
        var self = this;
        uexCamera.open(0, 30, function(data){
            var param = {
                src: data
            };
            param = JSON.stringify(param);
            uexImage.openCropper(param);
            uexImage.onCropperClosed = function (info) {
                info = JSON.parse(info);
                self.addPic(info.data);
            }
        })
    }, selPic: function () {
        var self = this;
        uexImage.onPickerClosed = function (data) {
            data = JSON.parse(data);
            if (data.isCancelled == false) {
                var param = {
                    src: data.data[0]
                };
                param = JSON.stringify(param);
                uexImage.openCropper(param);
                uexImage.onCropperClosed = function (info) {
                    info = JSON.parse(info);
                    self.addPic(info.data);
                }
            }
            self.showBar();
        };

        var sData = {
            min: 1,
            max: 1
        };
        var json = JSON.stringify(sData);
        uexImage.openPicker(json);
    },
    picNum: 0,
    isUpload:false,
    addPic: function (data) {
        if (data) {
            var self = this;
            this.picNum++;
            self.isUpload = true;
            uploadFileEMM(data, function (serverUrl) {
                $("#imgurl").css("background-image", "url('" + data + '?' + this.picNum + "')!important").empty();
                $('#imgurl').html("");
                self.model.set({"userIcon": serverUrl}, {silent: true});
                self.isUpload = false;
            },function(){
                self.isUpload = false;
            });
        }
        this.showBar();
    }, showBar: function () {
        if (uexWindow.showStatusBar) uexWindow.showStatusBar();
    },
    submitInfo: function () {
        var self = this;
        if (!this.model.isValid()) {
            appcan.window.openToast(this.model.validationError, 1500, 5);
            return false;
        }
        if(self.isUpload){
            return false;
        }

        appcan.window.openToast(STR_SUBMITTING);
        var userSex = $('#userSex').val();
        var sexId = userSex == 'female' ? "02" : "01";
        this.model.set({"userSex": $('#userSex').val()}, {silent: true})
        this.model.set({"sexId": sexId}, {silent: true});
        this.model.save({}, {
            success: function (model, resp, options) {
                appcan.window.closeToast();
                appcan.window.openToast(STR_INFO_UPDATED, 1500, 5);
                appcan.window.publish("PERSONINFO_EDIT", "PERSONINFO_EDIT");
            },
            error: function (model, error, options) {
                appcan.window.closeToast();
                switch (error.status) {
                    case "000":

                        break;
                    default:
                        global_error(error);
                        break;
                }
            }
        });
        return false;
    }
});
var personInfoViewInstance = new personInfoView();
function submitInfo() {
    personInfoViewInstance.submitInfo();
}

appcan.select(".select", function (ele, value) {
    var sexId = value == 'female' ? "02" : "01";
    personInfoViewInstance.model.set({"sexId": sexId});
});