var App = getApp();
Page({
  data: {
    pics: []
  },
  choose: function() { //这里是选取图片的方法
    var that = this,
      　　　　　　pics = this.data.pics;

    wx.chooseImage({
      count: 2 - pics.length, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function(res) {
        var imgsrc = res.tempFilePaths;　　　　　　　　　
        pics = pics.concat(imgsrc);
        that.setData({
          pics: pics
        });
        that.uploadimg();
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })

  },
  uploadimg: function() { //这里触发图片上传的方法
    var pics = this.data.pics;
    app.uploadimg({
      url: App.globalData.uplImg +'/withme/in/file', //这里是你图片上传的接口
      path: pics //这里是选取的图片的地址数组
    });
  },
  onLoad: function(options) {

  },
  confirm() {
    //发布添加图片
    var uplImgeList = wx.getStorageSync("uplImgeList")
    if (uplImgeList) {
      var uplImgeList = uplImgeList
      var uplUrlList = []
      for (var i = 0; i < uplImgeList.length; i++) {
        uplUrlList.push(App.globalData.baseUrl +'/withme' + uplImgeList[i].data)
      }
      var issue=[]
      issue.push({ openid: '1', "imgUrlList": uplUrlList})
    }
  }
})