var App = getApp();
const ajax = require('./../../tool/ajax.js')
var dingTime;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    "value": "", // 文本的内容
    "placeholder": "请输入文本",
    "maxlength": -1, // 最大输入长度，设置为 -1 的时候不限制最大长度
    "auto-height": true, // 是否自动增高，设置auto-height时，style.height不生效
    "adjust-position": true, // 键盘弹起时，是否自动上推页面
    evaluateContent: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    if (wx.getStorageSync("openId")) {
      this.setData({
        openId: wx.getStorageSync("openId")
      })
    }
    if (options.id) {
      this.setData({
        id: options.id
      })
    }
    var identi = ''
    if (options.identi) {
      //标识判断是提交评论还是查看评论 0为提交，1为查看
      this.setData({
        identi: 1
      })
      var identi = options.identi
    }
    if (options.img) {
      this.setData({
        img: options.img
      })
    }
    if (options.title) {
      this.setData({
        title: options.title
      })
    }
    if (options.indexs) {
      this.setData({
        indexs: options.indexs
      })
    }
    var that = this
    if (identi == 1) {
      if (this.data.indexs) {
        ajax.request(`${App.globalData.baseUrl}/withme/in/vi?id=${this.data.indexs}`).then(res => {

          var publicR = res.data.data
          if (publicR != undefined) {
            var data = res.data.data.title
            that.setData({
              evaluate: res.data.data.title
            })
          }
        })
      }

    }

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {


  },
  formSubmit(e) {

    let {
      textarea
    } = e.detail.value;

    if (textarea.length < 10) {
      wx.showToast({
        title: '评论至少10个字',
        icon: 'none',
        duration: 2000
      })
      return;
    }

    var id = this.data.id
    if (id) {
      var indexs = this.data.indexs ? this.data.indexs : 0
      var data = {
        "id": parseInt(id),
        "issuer": this.data.openId,
        "evaluate": textarea
      }
      wx.request({
        url: App.globalData.baseUrl + '/withme/in/ev',
        method: 'GET',
        data: data,
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function(res) {
          if (res.data.code == 200) {
            wx.showToast({
              title: '提交成功！',
              icon: 'none',
              duration: 2000
            })
            dingTime = setInterval(function() {
              clearInterval(dingTime)
              wx.navigateTo({
                url: '../orderform/orderform?indexs=' + indexs
              })
            }, 1000)



          } else {
            wx.showToast({
              title: '提交失败,',
              icon: 'none',
              duration: 2000
            })
            return;
          }
        },
        fail: function(res) {
          console.log('评价出错' + res)
        }
      })
    }
  }


})