var App = getApp();
Page({
  data: {
    indexs: 0, //导航标识
    pulltime: 1, //上啦加载 第一页
    lasttime: false, //控制是否继续加载
  },

  onLoad: function (options) {
    var that = this
    var indexs = this.data.indexs

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
      url = App.globalData.baseUrl + '/withme/in/ge'
    } else if (indexs == 1) {
      // 进行中
      url = App.globalData.baseUrl + '/withme/in/fr'
    } else if (indexs == 2) {
      // 已完成
      url = App.globalData.baseUrl + '/withme/in/rf'
    }

    if (this.data.openId != null && this.data.openId != '' && this.data.openId != undefined) {
      var data = {
        "receiver": this.data.openId
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
        success: function (res) {
          if (res.data.code == 200) {
            if (res.data.data != null && res.data.data.length > 0) {
              var orderfromList = res.data.data;
             
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
        fail: function (res) {
          wx.hideLoading();
          console.log(res)
        }
      })
    }
    else{
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
  lookdetails(e) {
    var index = e.currentTarget.dataset.index

    var img = e.currentTarget.dataset.img
    var title = e.currentTarget.dataset.title
    wx.navigateTo({
      url: '../evaluate/evaluate?id=' + index + '&img=' + img + '&title=' + title + '&indexs=' + this.data.indexs+'&identi='+1,
    })
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