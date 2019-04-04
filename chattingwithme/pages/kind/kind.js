const app = getApp()
const ajax = require('./../../tool/ajax.js')
var dingTime;
Page({
  data: {
    nav: [],
    sort: false, //排序标识
    tabTxt: ['类型', '时间', '价格', '距离'],
    tab: [true, true, true, true],
    type_id: 0, //类型
    type_txt: '',
    time_id: 0, //时间
    time_txt: '',
    price_id: 0, //价格
    price_txt: '',
    distance_id: 0, //距离
    distance_txt: '',
    pulltime: 1 //第一页
  },
  onLoad: function(options) {
    var that = this

    if (wx.getStorageSync("openId")) {
      that.setData({
        openId: wx.getStorageSync("openId")
      })
    }
    /////////查询类别 分类
    ajax.request(`${app.globalData.baseUrl}/withme/tp/view`).then(res => {
      console.log(res.data.message);
      this.setData({
        nav: res.data.message
      })

      that.setData({
        classifyListTen: [],
        allclassifyList: []
      })
      var url = app.globalData.baseUrl + '/withme/in/view'
      wx.request({
        url: url,
        method: 'GET',
        data: {},
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function(res) {
          wx.showLoading({
            title: '加载中',
          })

          if (res.data.data != null && res.data.data.length > 0) {
            var data = res.data.data
            for (var i = 0; i < data.length; i++) {
              var imgUrl = data[i].imgUrl
              var imgUrlList = []
              if (imgUrl != null) {
                if (imgUrl.indexOf(';http') != -1) {
                  var img0ne = imgUrl.split(';')[0]
                  var imgTwo = imgUrl.split(';')[1]
                  imgUrlList.push(img0ne, imgTwo)
                } else {
                  imgUrlList.push(imgUrl)
                }
                data[i].imgUrl = imgUrlList
              }
            }
            that.setData({
              classifyListTen: data.slice(0, 10),
              allclassifyList: data
            })
          }

          wx.hideLoading()
        },
        fail: function(res) {
          console.log(res)
          wx.hideLoading()
        }
      })
    })
  },
  classifyoff(e) {
    var classify = e.currentTarget.dataset.classify
    this.setData({
      classify: classify
    })
    this.onLoad()
  },
  // 排序
  stortclick() {
    this.setData({
      sort: !this.data.sort
    })
  },
  orderChange(e) {
    //获取导航标识
    var indexs = e.currentTarget.dataset.indexs
    this.setData({
      indexs: indexs,
    })
    this.onLoad()
  },
  lookdetails(e) {
    var index = e.currentTarget.dataset.index
  },

  // 选项卡
  filterTab: function(e) {
    var data = [true, true, true, true],
      index = e.currentTarget.dataset.index;
    data[index] = !this.data.tab[index];
    this.setData({
      tab: data
    })
  },

  //筛选项点击操作
  filter: function(e) {
    var self = this,
      id = e.currentTarget.dataset.id,
      txt = e.currentTarget.dataset.txt,
      tabTxt = this.data.tabTxt;
    switch (e.currentTarget.dataset.index) {
      case '0':
        tabTxt[0] = txt;
        self.setData({
          tab: [true, true, true, true],
          tabTxt: tabTxt,
          type_id: id,
          type_txt: txt
        });
        break;
      case '1':
        // 有时间，没价格
        tabTxt[1] = txt;
        if (txt != "时间") {
          tabTxt[2] = "价格";
          tabTxt[3] = "距离";
        }
        self.setData({
          tab: [true, true, true, true],
          tabTxt: tabTxt,
          time_id: id,
          time_txt: txt
        });
        break;
      case '2':
        // 有价格，没时间
        tabTxt[2] = txt;
        if (txt != "价格") {
          tabTxt[1] = "时间";
          tabTxt[3] = "距离";
        }
        self.setData({
          tab: [true, true, true, true],
          tabTxt: tabTxt,
          price_id: id,
          price_txt: txt
        });
        break;
      case '3':
        // 有价格，没时间
        tabTxt[3] = txt;
        if (txt != "距离") {
          tabTxt[1] = "时间";
          tabTxt[2] = "价格";
        }
        self.setData({
          tab: [true, true, true, true],
          tabTxt: tabTxt,
          distance_id: id,
          distance_txt: txt
        });
        break;
    }
    //数据筛选
    self.getDataList();
    var tabTxt = this.data.tabTxt
    var type_txt = tabTxt[0]
    var time_txt = tabTxt[1]
    var price_txt = tabTxt[2]
    var distance_txt = tabTxt[3]
    var tabTxt = this.data.type_id


    var url = app.globalData.baseUrl + '/withme/in/view'
    var data = {}
    if (type_txt != "类型") {
      url = app.globalData.baseUrl + '/withme/in/tv'
      data = {
        "tId": tabTxt
      }
      if (time_txt != "时间") {
        //查类型和jia的
        url = app.globalData.baseUrl + '/withme/in/ob'
        data = {
          "tId": tabTxt,
          "field": "releaseTime"
        }
      }
      if (price_txt != "价格") {
        //查类型和价格的

        if (price_txt == "从高到低") {
          url = app.globalData.baseUrl + '/withme/in/ob'
          data = {
            "tId": tabTxt,
            "field": "price"
          }
        } else if (price_txt == "从低到高") {
          url = app.globalData.baseUrl + '/withme/in/pri'
          data = {
            "tId": tabTxt,
          }
        }

      }
      if (distance_txt != "距离") {

        var longitude = 60
        var latitude = 50

        if (wx.getStorageSync('latitude')) {
          longitude = wx.getStorageSync('longitude')
          latitude = wx.getStorageSync('latitude')
        }
        url = app.globalData.baseUrl + '/withme/in/dis'
        data = {
          "tId": tabTxt,
          "lat1": latitude,
          "lng1": longitude
        }
      }
    } else {
      // 获取全部发布信息
      var tabTxt = this.data.tabTxt;
      var type_id = this.data.type_id
      var type_txt = tabTxt[0]
      var time_txt = tabTxt[1]
      var price_txt = tabTxt[2]
      var distance_txt = tabTxt[3]
      //如果 类型没选，其他选中提示先选类型
      if (time_txt != "时间" || price_txt != "价格" || distance_txt != '距离') {

        wx.showToast({
          title: '请先选择类型，在选其他',
          icon: 'none',
          duration: 2000
        })

        self.setData({
          tab: [true, true, true, true],
          tabTxt: ["类型", "时间", "价格", "距离"],
          time_id: 0,
          time_txt: "时间",
          price_id: 0,
          price_txt: "价格",
          distance_id: 0,
          distance_txt: "距离"
        });
        return
      }
      url = app.globalData.baseUrl + '/withme/in/view'
      data = {}
    }

    wx.request({
      url: url,
      method: 'GET',
      data: data,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        wx.showLoading({
          title: '加载中',
        })
        self.setData({
          classifyListTen: [],
          allclassifyList: []
        })
        if (res.data.data != null && res.data.data.length > 0) {
          var data = res.data.data
          for (var i = 0; i < data.length; i++) {
            var imgUrl = data[i].imgUrl
            var imgUrlList = []
            if (imgUrl != null) {
              if (imgUrl.indexOf(';http') != -1) {
                var img0ne = imgUrl.split(';')[0]
                var imgTwo = imgUrl.split(';')[1]
                imgUrlList.push(img0ne, imgTwo)
              } else {
                imgUrlList.push(imgUrl)
              }
              data[i].imgUrl = imgUrlList
            }
          }
          self.setData({
            classifyListTen: data.slice(0, 10),
            allclassifyList: data
          })
        }
        wx.hideLoading()
      },
      fail: function(res) {
        console.log(res)
        wx.hideLoading()
      }
    })
  },

  //上拉加载
  onReachBottom() {
    var timeitem = (this.data.pulltime + 1) * 10;
    if (timeitem <= this.data.allclassifyList.length) {
      this.setData({
        pulltime: this.data.pulltime + 1,
        classifyListTen: this.data.allclassifyList.slice(0, timeitem),
      })
    } else if (timeitem > this.data.allclassifyList.length && this.data.lasttime == false) {
      this.setData({
        classifyListTen: this.data.allclassifyList.slice(0, this.data.allclassifyList.length),
        lasttime: true
      })
    }
  },
  takein(e) {
    var that = this
    var index = e.currentTarget.dataset.index
    var openId = that.data.openId
    if (openId) {
      var data = {
        "id": index,
        "receiver": openId
      }
      wx.request({
        url: app.globalData.baseUrl + '/withme/in/receive',
        method: 'GET',
        data: data,
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function(res) {
          if (res.data.code == 200) {

            wx.showToast({
              title: '接单成功！',
              icon: 'none',
              duration: 2000
            })
            dingTime = setInterval(function() {
              clearInterval(dingTime)
              that.onLoad();
            }, 1000)

          } else {
            wx.showToast({
              title: '接单失败',
              icon: 'none',
              duration: 2000
            })
            return;
          }


        },
        fail: function(res) {
          console.log(res)
        }
      })
    } else {
      wx.showToast({
        title: '请先登录，再填我的信息',
        icon: 'none',
        duration: 2000
      })
      dingTime = setInterval(function() {
        clearInterval(dingTime)
        wx.navigateTo({
          url: '../user/user'
        })
      }, 1000)
      return;
    }
  },
  //加载数据
  getDataList: function() {
    //调用数据接口，获取数据
  }
})