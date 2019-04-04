var App = getApp();
Page({
  data: {
    indexs: 0, //导航标识
    pulltime: 1, //上啦加载 第一页
    lasttime: false, //控制是否继续加载
  },

  onLoad: function(options) {
    var that = this
    if (wx.getStorageSync("openId")) {
      this.setData({
        openId: wx.getStorageSync("openId")
      })
    }

    var indexs = this.data.indexs
    if (options != undefined) {
      if (options.indexs) {
        this.setData({
          indexs: options.indexs
        })
        indexs = options.indexs
      }

    }

    this.setData({
      orderfromListTen: [],
      orderfromList: [],
      pulltime: 1,
      lasttime: false,
    })
    if (wx.getStorageSync('openId')) {
      this.setData({
        openId: wx.getStorageSync('openId')
      })
    }

    //查询到总共数据内容
    var orderfromList = []
    //初始化 所有数据中的前十条
    var orderfromListTen = []
    var url = '';
    if (indexs == 0) {
      // 待进行
      url = App.globalData.baseUrl + '/withme/in/dai'
    } else if (indexs == 1) {
      // 进行中
      url = App.globalData.baseUrl + '/withme/in/being'
    } else if (indexs == 2) {
      // 已完成
      url = App.globalData.baseUrl + '/withme/in/ifi'
    } else if (indexs == 3) {
      // 待评价
      url = App.globalData.baseUrl + '/withme/in/de'
    }

    if (this.data.openId != null && this.data.openId != '' && this.data.openId != undefined) {
      var data = {
        "issuer": this.data.openId
      }

      wx.showLoading({
        title: '加载中',
      })

      var orderfromList = []
      wx.request({
        url: url,
        method: 'GET',
        data: data,
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function(res) {
          if (res.data.code == 200) {
            if (res.data.data != null && res.data.data.length > 0) {
              var orderfromList = res.data.data;
              wx.hideLoading()
              if (orderfromList != undefined) {
                if (orderfromList.length > 0) {
                  var orderfromListTen = orderfromList.slice(0, 10)
                  that.setData({
                    orderfromListTen: orderfromListTen,
                    orderfromList: orderfromList,
                    pulltime: 1
                  })
                } else {
                  console.log(a)
                }
              } else {
                console.log(a)
              }
            }
          } else {
            console.log('有错误')
          }
        },
        fail: function(res) {
          wx.hideLoading();
          console.log(res)
        }
      })
    } else {
      this.setData({
        orderfromListTen: []
      })
    }
    wx.hideLoading();
  },

  orderChange(e) {
    //获取导航标识
    var indexs = e.currentTarget.dataset.indexs
    this.setData({
      indexs: indexs,
    })
    this.onLoad()
  },
  //评价
  lookdetails(e) {
    var index = e.currentTarget.dataset.index
    var img = e.currentTarget.dataset.img
    var title = e.currentTarget.dataset.title
    wx.navigateTo({
      url: '../evaluate/evaluate?id=' + index + '&img=' + img + '&title=' + title + '&indexs=' + this.data.indexs + '&identi=' + 1,
    })
  },
  //把进行中改变为已完成
  complete(e) {
    var index = e.currentTarget.dataset.index

    if (index) {
      var data = {
        "id": index,
        "issuer": this.data.openId
      }
      wx.request({
        url: App.globalData.baseUrl + '/withme/in/fi',
        method: 'GET',
        data: data,
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function(res) {
          if (res.data.code == 200) {
            wx.navigateTo({
              url: '../orderform/orderform?indexs=' + 1
            })
            // wx.showToast({
            //   title: '提交成功！',
            //   icon: 'none',
            //   duration: 2000
            // })
            // dingTime = setInterval(function() {
            //   clearInterval(dingTime)
             
            // }, 1000)
          }
        },
        fail: function(res) {

        }
      })
    }

  },
  //上拉加载
  onReachBottom() {
    var timeitem = (this.data.pulltime + 1) * 10;
    if (timeitem <= this.data.orderfromList.length) {
      this.setData({
        pulltime: this.data.pulltime + 1,
        orderfromListTen: this.data.orderfromList.slice(0, timeitem),
      })
    } else if (timeitem > this.data.orderfromList.length && this.data.lasttime == false) {
      this.setData({
        orderfromListTen: this.data.orderfromList.slice(0, this.data.orderfromList.length),
        lasttime: true
      })
    }
  },
})