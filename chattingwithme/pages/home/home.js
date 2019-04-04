// pages/home/home.js
const app = getApp()
const ajax = require('./../../tool/ajax.js')
var amapFile = require('../../libs/amap-wx.js'); //如：..­/..­/libs/amap-wx.js	
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: [],
    city: '',
    prolist: [],
    pulltime: 1 //第一页


  },
  /**
   * goaddress事件
   */




  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options);
    wx.showLoading({
      title: '加载中...',
    })

    //  // 清除自己发布的数据缓存
    //   if (wx.getStorageSync('orderfromList')) {
    //     wx.removeStorageSync('orderfromList')
    //   }

    var that = this;
    var myAmapFun = new amapFile.AMapWX({
      key: '39eaba29c701c081d4561e7a0d886b8f'
    });
    myAmapFun.getWeather({
      success: function(data) {
        //成功回调
        that.setData({
          //城市
          city: data.city.data

        });
        wx.hideLoading()
      },
      fail: function(info) {
        //失败回调
        wx.hideLoading()
        console.log(info)
      }
    })

    /**
     * 轮播图  
     */
    ajax.request(`${app.globalData.baseUrl}/withme/ba/view`).then(res => {

      console.log(res.data.data);
      wx.hideLoading();
      this.setData({
        imgUrl: res.data.data
      })
    })
  },
  onShow() {
    /**
     * 发布信息列表  
     */
    ajax.request(`${app.globalData.baseUrl}/withme/in/view`).then(res => {
      // console.log(res.data.data.list)
      console.log(res.data.data)
      var data = res.data.data
      var prolist = []
      for (var i = 0; i < data.length; i++) {
        var imgUrl = data[i].imgUrl
        var imgUrlList = []

        if (imgUrl!=null) {
          if (imgUrl.indexOf(';http') != -1 ){
            var img0ne = imgUrl.split(';')[0]
            var imgTwo = imgUrl.split(';')[1]
            imgUrlList.push(img0ne, imgTwo)
          }
          else {
            imgUrlList.push(imgUrl)
          }
          data[i].imgUrl = imgUrlList
        } 
        
      }
      this.setData({
        prolist: data,
        prolistTen: data.slice(0,10)
      })

    })
  },

  switchProlistDetail(e) {
    var index = e.currentTarget.dataset.index
    if (index != null || index != '') {
      wx.navigateTo({
        url: '../detail/detail?id=' + this.data.prolist[index].id + '&title=' + this.data.prolist[index].title ,
      })
    }

  },

  //上拉加载
  onReachBottom() {
    var timeitem = (this.data.pulltime + 1) * 10;
    if (timeitem <= this.data.prolist.length) {
      this.setData({
        pulltime: this.data.pulltime + 1,
        prolistTen: this.data.prolist.slice(0, timeitem),
      })
    } else if (timeitem > this.data.prolist.length && this.data.lasttime == false) {
      this.setData({
        prolistTen: this.data.prolist.slice(0, this.data.prolist.length),
        lasttime: true
      })
    }
  },
  onShareAppMessage: function() {

  }
})