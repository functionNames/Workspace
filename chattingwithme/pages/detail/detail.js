// pages/detail/detail.js
const App = getApp()
const ajax = require('./../../tool/ajax.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgurl: '',
    title: '',
    outline: '', //gaiyao
    content: '',
    name: '',
    tel: '',
    price: '',
    personalizedSignature: '',
    hasUserInfo: false, //显示用户名和头像
    canIUse: wx.canIUse('button.open-type.getUserInfo')

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //获取登录用户信息
    if (App.globalData.userInfo) {
      this.setData({
        userInfo: App.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      App.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      wx.getUserInfo({
        success: res => {
          App.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }

    console.log(options.id)
    wx.showLoading({
      title: '加载中...',
    })
    const {
      id,
      title
    } = options;

    ajax.request(`${App.globalData.baseUrl}/withme/in/vi?id=${id}`).then(res => {
      console.log(res.data.data)
      var publicR = res.data.data
      var data = res.data.data

      var imgUrl = data.imgUrl
      var imgUrlList = []
      if (imgUrl != null) {
        if (imgUrl.indexOf(',http') != -1) {
          var img0ne = imgUrl.split(';')[0]
          var imgTwo = imgUrl.split(';')[1]
          imgUrlList.push(img0ne, imgTwo)
        } else {
          imgUrlList.push(imgUrl)
        }
        data.imgUrl = imgUrlList
      }



      var publicR = data
      var imgurl = ''
      if (publicR.imgUrl != null) {
        if (publicR.imgUrl.length == 2) {
          imgurl = publicR.imgUrl[1]
        } else {
          imgurl = publicR.imgUrl[0]
        }
      }
      this.setData({
        imgurl: imgurl,
        content: publicR.content,
        name: publicR.tbUser.name,
        tel: publicR.tbUser.tel,
        price: publicR.price,
        age: publicR.tbUser.age,
        personalizedSignature: publicR.tbUser.personalizedSignature
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    wx.hideLoading();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})