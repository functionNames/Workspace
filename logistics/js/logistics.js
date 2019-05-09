define(function (require) {
    require('bootstrapValidator');
    require('messager');
    require('table');
    require('typeahead');
    require('multiselect');
    require('json-viewer');

    $.module("SYS.Logistics", function () {
        var search_aggregate_status = -1;
        var current_show_data = [];

        //取出platform，加载到下拉框中
        if(typeof(Storage) != "undefined"){
            if(localStorage.platform){
                $("#search_platform").val(localStorage.platform);
            } 
        }
        return {
            init: function () {
                this.loadData();
                this.loadEvent();
            },
            /*初始化列表数据*/
            loadData: function (pageNumber, pageSize) {
                this.divShow("main_div");
                var that = this;
                
                SYS.Core.ajaxGet({
                    url: "logistics/list",
                    data: {
                        page: pageNumber ? pageNumber : 1,
                        size: pageSize ? pageSize : 10,
                        key : $("#key").val() || null,
                    },
                    success: function (data) {
                        var obj = {
                            'pageNumber': data.data.page.current_page,
                            'pageSize': data.data.page.page_size,
                            'totalRows': data.data.page.all_count,
                            'data': data.data.list,
                        };
                        current_show_data = obj.data;
                        $("#myTable").bootstrapTable('destroy');    //销毁table
                        
                        //文档说明：
                        

                        $('#myTable').bootstrapTable({               //重新生成table
                            striped: true,      //默认false，使表格带有条纹
                            singleSelect: true, //保留
                            showColumns: true,  //默认false，是否显示内容下拉框
                            showToggle: true,   //默认false，是否显示切换视图（table/card）按钮
                            pagination: true,   //默认false，设置为 true 会在表格底部显示分页条。
                            pageNumber: obj.pageNumber, //默认1，如果设置了分页，首页页码。
                            pageSize: obj.pageSize,     //默认10，如果设置了分页，页面数据条数。
                            totalRows: obj.totalRows,
                            pageList: [8, 15, 20, 50, 100, 200], //默认[10, 25, 50, 100, All] 如果设置了分页，设置可供选择的页面数据条数。设置为 All 或者 Unlimited，则显示所有记录。
                            sidePagination: 'server', //默认'client',设置在哪里进行分页，可选值为 'client' 或者 'server'。设置 'server'时，必须设置服务器数据地址（url）或者重写ajax方法
                            clickToSelect: true,      //保留
                            idField: '_id',           //默认undefined，指定主键列。
                            data: obj.data,           //默认[],加载json格式的数据。
                            search: false,             //默认false,是否启用搜索框。
                            searchOnEnterKey: true,   //默认false,设置为 true时，按回车触发搜索方法，否则自动触发搜索方法。
                            strictSearch: true,
                            showHeader: true,
                            columns: [
                                { field: 'id', title: 'ID', align: 'center' },
                                {
                                    field: 'questionType', title: '问题类型', align: 'center', 
                                    formatter: function (questionType) {
                                        var html = '';
                                        var result = '';
                                        if(questionType == 1) {
                                            result = "咨询";
                                            html ="<span class='label label-success'>" + result +"</span>";
                                        } else if(questionType == 2) {
                                            result = "建议";
                                            html ="<span class='label label-info'>" + result +"</span>";
                                        } else if(questionType == 3) {
                                            result = "投诉";
                                            html ="<span class='label label-danger'>" + result +"</span>";
                                        }
                                        return html;
                                    }
                                },
                                { field: 'sname', title: '姓名', align: 'center' },
                                { field: 'phone', title: '手机号', align: 'center' },
                                { field: 'email', title: '邮箱', align: 'center' },
                                { field: 'logisticsNumber', title: '物流单号', align: 'center' },
                                { field: 'questionDescription', title: '问题描述', align: 'center' },
                                {
                                    field: 'state', title: '状态', align: 'center', 
                                    formatter: function (state) {
                                        var html = '';
                                        var result = '';
                                        if(state == 1) {
                                            result = "有效";
                                            html ="<span class='label label-success'>" + result +"</span>";
                                        } else if(state == 2) {
                                            result = "无效";
                                            html ="<span class='label label-danger'>" + result +"</span>";
                                        } 
                                        return html;
                                    }
                                },
                                { field: 'memo', title: '备注', align: 'center' },
                               
                                {
                                    field: 'do',
                                    title: '操作',
                                    align: 'center',
                                    formatter: function (value, row, index) {
                                            var html = '';
                                            /* html += '<a href="javascript:void(0)" onclick="SYS.Cabin.editInfo(' + index + ')">编辑</a>';
                                            html += '<span class="text-explode"> | </span>'; */
                                            html += '<a href="javascript:void(0)" onclick="SYS.Logistics.toRemove(' + row.id + ')">删除</a>';
                                            return html;
                                    }
                                }
                            ],
                            onPageChange: function (number, size) {
                                that.loadData(number, size);
                                //console.log("number:" + number + ",size:" + size);
                            },
                            onRefreshTable: function () {   //表格右侧刷新按钮
                                that.loadData(obj.pageNumber, obj.pageSize);
                            }
                        });
                    }
                });
            },
            loadEvent: function () {
                var that = this;
                $("#search-toolbar").on('click', "#btn_search", function () {
                    that.loadData();
                }).on("keydown ", "input", function (e) {
                    if (e.keyCode == 13) {
                        that.loadData();
                    }
                });
                $('#btn_add').on('click', function () {
                    $("#fm input").val('');
                    $('#fm').bootstrapValidator('resetForm', true);
                    that.divShow("add_div");
                });
                $('#backList').on('click', function () {
                    that.loadData();
                });
                
                $('#fm').bootstrapValidator({
                    feedbackIcons: {
                        valid: 'glyphicon glyphicon-ok',
                        invalid: 'glyphicon glyphicon-remove',
                        validating: 'glyphicon glyphicon-refresh'
                    },
                    fields: {
                        sname: {
                            validators: {
                                notEmpty: {
                                    message: '此项必填'
                                }
                            }
                        },
                        phone: {
                            validators: {
                                notEmpty: {
                                    message: '此项必填'
                                }
                            }
                        },
                       
                    }
                }).on('success.form.bv', function (e) { //使用此方法可以ajax
                    e.preventDefault();
                    $('#fm').bootstrapValidator('disableSubmitButtons', false);
                    //保存
                    that.savaLogistics();
                });
            },
            savaLogistics:function(){
                var id = +$("#id").val();
                var that = this;
                var state = $("#state").val();
                var questionType = $("#questionType").val();
                var sname = $("#sname").val();
                var phone = $("#phone").val();
                var email = $("#email").val();
                var logisticsNumber = $("#logisticsNumber").val();
                var questionDescription = $("#questionDescription").val();
                var memo = $("#memo").val();
                var url = '';
                if (id == '' || id == null) {
                    url = 'logistics/add';
                } 
                SYS.Core.ajaxPost({
                    url: url,
                    common: {},
                    data: {
                        id: id ? id : 0,
                        state: +state,
                        questionType: questionType,
                        sname: sname,
                        phone: phone,
                        email: email,
                        logisticsNumber: logisticsNumber,
                        questionDescription:questionDescription,
                        memo: memo,
                    },
                    success: function (data) {
                        if (data.code == 1) {
                            $.messager.popup(data.message, 'success');
                            that.clearDiv();
                            $('#fm').removeAttr('disabled');
                            that.loadData();
                        } else {
                            $('#fm').bootstrapValidator('disableSubmitButtons', false);
                            $.messager.popup(data.message, 'error');
                        }
                    }
                })

            },
           /*  editInfo:function(index){
                var obj = current_show_data[index];
                $("#state").val(obj.state);
                $("#cabinName").val(obj.cabinName);
                $("#cabinEmail").val(obj.cabinEmail);
                $("#cabinTel").val(obj.cabinTel);
                $("#memo").val(obj.memo);
                $("#id").val(obj.id);
                this.divShow("add_div");

            }, */
            toRemove: function (id) {
                var that = this;
                $.messager.confirm("确定要删除吗？", function () {
                    SYS.Core.ajaxPost({
                        url: "logistics/delete",
                        data: {
                            id: +id
                        },
                        success: function (data) {
                            if (data.code == 1) {
                                $.messager.popup('删除成功', "success");
                                that.loadData();
                            } else {
                                $.messager.popup('删除失败', 'error');
                            }
                        }
                    })
                });
            },
            clearDiv:function(){
                $("#state").val(1);
                $("#questionType").val('');
                $("#sname").val('');
                $("#phone").val('');
                $("#email").val('');
                $("#logisticsNumber").val('');
                $("#questionDescription").val('');
                $("#memo").val('');
                $("#id").val('');
            },
            divShow:function(div){
                var divs = ["main_div","add_div"];
                divs.forEach(hideShow => {
                    $("#"+hideShow).hide();
                });
                $("#"+div).show();
            }
        }
    });
    SYS.Logistics.init();
})