//加载并初始化模板对象
var templateHTML = loadTemplate("../assets/templates/versionList.tpl");

var versionView = Backbone.View.extend({//options...
    initialize: function (option) {
       
        //初始化VIEW并让model与VIEW进行关联
        this.model.view = this;
        //初始化VIEW的HTMLDOM对象
        this.render();
    },
    template: templateHTML, //VIEW对应的模板
    render: function () {
       
        var self = this;
        if (this.template) {
            //使用模板+数据拼装DOM
            this.$el = $(this.template({
                data: this.model.attributes,
                dateSet: self.dateSet,
                versionDeal : self.versionDeal
            }));

        }
        //返回自身，便于promise调用
        return this;
    },
    dateSet: function (d) {
       
        d = (d + '').replace(/-/g, '/');
        return NYR(d);
    },
    versionDeal : function(d){
        var s = d.split(".");
        var s1 = s[2].substr(0,2);
        return d;
    }
});

//列表容器VIEW
var versionListView = Backbone.View.extend({//options...
    initialize: function () {
        var self = this;
        //初始化集合与VIEW自身函数的关联
        this.listenTo(this.collection, "add", this.addView);
    },
    collection: new versionCollection(), //collection，用于存储和管理数据
    el: '#versionList', //VIEW 对应 HTML 元素CSS选择器
    pageNo: 1,
    load: function (type) {
       
        try {
            var emmToken = JSON.parse(appcan.getLocVal("emmToken"));
            this.tenantId = emmToken.info.tenantId || "611";
        } catch (e) {
            errorDetail(e);
        }
        var self = this;
        if (type == 0) {
            self.pageNo = 1;
        }
        this.collection.fetch({
            success: function (cols, resp, options) {
                
                try {
                    setTimeout(function () {
                        appcan.frame.resetBounce(0);
                    }, 100)

                } catch (e) {
                    errorDetail(e);
                }
            },
            error: function (cols, error, options) {
                appcan.frame.resetBounce(0);
                switch (error.status) {
                    default:
                        global_error(error);
                        break;
                }
            },
            add: true,
            remove: (type == 0) ? true : false,
            merge: true
        });
    },
    addView: function (model) {
        var view = new versionView({
            model: model
        });
        this.$el.append(view.$el);
    }
});
var versionListViewInstance = new versionListView();

