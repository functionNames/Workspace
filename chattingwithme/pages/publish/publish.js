// pages/publish/publish.js
const app = getApp()
const ajax = require('./../../tool/ajax.js')

var imageUrl = '';
var clear;
Page({

  /**
   * 页面的初始数据
   */

  data: {
    select: [],
    selectPerson: true,
    firstPerson: '选择分类',
    selectArea: false,
    isSubmit: false,
    text: '',
    textarea: '',
    pay: 0,
    select: '',
    label: '',
    "value": "", // 文本的内容
    "placeholder": "请输入文本",
    "maxlength": -1, // 最大输入长度，设置为 -1 的时候不限制最大长度
    "auto-height": true, // 是否自动增高，设置auto-height时，style.height不生效
    "adjust-position": true, // 键盘弹起时，是否自动上推页面
    selectindex: '',
    select_text: '',
    pics: [],
    select: [], //分类的name
    selectAll: [], //分类所以
    uplImgeList: []

    // uplImgeListshow:[] 展示图片
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    if (wx.getStorageSync('openId')) {
      this.setData({
        openId: wx.getStorageSync('openId')
      })
    }
    var a = 0;

  },
  onShow() {
    if (wx.getStorageSync('openId')) {
      this.setData({
        openId: wx.getStorageSync('openId')
      })
    }
    // if (wx.getStorageSync("uplImgeList")) {
    //   this.setData({
    //     uplImgeList: wx.getStorageSync("uplImgeList")
    //   })
    // }

    ajax.request(`${app.globalData.baseUrl}/withme/tp/view`).then(res => {
      console.log(res.data.message);

      var data = res.data.message
      var select = []
      for (let i = 0; i < data.length; i++) {
        select.push(data[i].name)
      }
      this.setData({
        select: select,
        selectAll: data
      })

    })
  },

  formBindsubmit: function (e) {
    var that = this

    var pics = this.data.pics;
    that.setData({
      uplImgeList: []
    })
    // 上传图片
    var data = {
      url: app.globalData.baseUrl + '/withme/in/file', //这里是你图片上传的接口
      path: pics //这里是选取的图片的地址数组s
    }
    that.newPromise(data,e);
    
    //获取地址
    that.onLaunch();


  },
  formReset: function () {
    this.setData({
      title: '',
      content: '',
      label: '',
      imgUrl: '',
      price: '',
      tId: tid,
      pics: [],
      selectindex: '',
      time: '',
      uplImgeList: []
    })
  },


  clickPerson: function () {
    var selectPerson = this.data.selectPerson;
    if (selectPerson == true) {
      this.setData({
        selectArea: true,
        selectPerson: false,
      })
    } else {
      this.setData({
        selectArea: false,
        selectPerson: true,
      })
    }
  },
  mySelect: function (e) {
    this.setData({
      firstPerson: e.target.dataset.me,
      selectPerson: true,
      selectArea: false,
    })
  },

  bindChange(e) {
    let val = e.detail.value
  },

  listenerPickerSelected: function (e) {
    //改变index值，通过setData()方法重绘界面
    this.setData({
      selectindex: e.detail.value,
      select_text: this.data.select[e.detail.value]
    });
  },
  choose: function () { //这里是选取图片的方法
    var that = this,
      pics = []
    wx.chooseImage({
      count: 2 - pics.length, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        var imgsrc = res.tempFilePaths;
        pics = pics.concat(imgsrc);
        that.setData({
          pics: pics,

        });


      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })



  },
  onLaunch() {
    app.onLaunch()
  },
  uploadimg: function (data) { //这里触发图片上传的方法

    var imglist = this.data.uplImgeList;
    var that = this,
      i = data.i ? data.i : 0, //当前上传的哪张图片
      success = data.success ? data.success : 0, //上传成功的个数
      fail = data.fail ? data.fail : 0; //上传失败的个数
    wx.uploadFile({
      url: data.url,
      filePath: data.path[i],
      name: 'file', //这里根据自己的实际情况改
      formData: null, //这里是上传图片时一起上传的数据
      success: function (resp) {
        success++; //图片上传成功，图片上传成功的变量+1
        var imgJsonlist = JSON.parse(resp.data)
        if (imgJsonlist.data) {
          imglist.push(imgJsonlist)

          that.setData({
            uplImgeList: imglist
          })
          if (i + 1 == data.path.length) {

            return imglist
          }
          console.log(resp)
          console.log(i);
        } else {
          that.setData({
            uplImgeList: []
          })
        }
        return data.url;
        //这里可能有BUG，失败也会执行这里,所以这里应该是后台返回过来的状态码为成功时，这里的success才+1
      },
      fail: function (res) {
        fail++; //图片上传失败，图片上传失败的变量+1
        console.log('fail:' + i + "fail:" + fail);
        // reject(res);
        return '失败'
      },
      complete: function () {

        console.log(i);
        i++; //这个图片执行完上传后，开始上传下一张
        if (i == data.path.length) { //当图片传完时，停止调用          
          console.log('执行完毕');
          console.log('成功：' + success + " 失败：" + fail);
          console.log(data)
          imageUrl = imglist
        } else { //若图片还没有传完，则继续调用函数
          console.log(i);
          data.i = i;
          data.success = success;
          data.fail = fail;
          that.uploadimg(data);
        }

      }
    });

    // })
  },
  newPromise(data,e) {
    var that = this
    var uploadimg = that.uploadimg(data);
    clear = setInterval(function () {
      clearInterval(clear);
      var openId = that.data.openId
      if (openId != '' && openId != null && openId != undefined) {
        let {
          text,
          textarea,
          pay,
          label,
          time
        } = e.detail.value;
        //发布添加图片

        var latitude = wx.getStorageSync('latitude') //纬度
        var longitude = wx.getStorageSync('longitude') //经度

        var getuplImgeList = that.data.uplImgeList
        var uplUrlList = ''
        if (getuplImgeList) {

          if (getuplImgeList.length == 1) {
            uplUrlList = app.globalData.baseUrl + '/withme/in/download?filePath=' + getuplImgeList[0].data
          } else if (getuplImgeList.length == 2) {
            uplUrlList = app.globalData.baseUrl + '/withme/in/download?filePath=' + getuplImgeList[0].data + ';'
            uplUrlList = uplUrlList + app.globalData.baseUrl + '/withme/in/download?filePath=' + getuplImgeList[1].data
          }

        } else {
          uplImgeList = ''
          wx.showToast({
            title: '网络差,请重新上传图片',
            icon: 'none',
            duration: 2000
          })
          return;
        }

        var select_text = that.data.select_text
        var title = ''
        if (!text) {
          title = '标题'
        } else if (!textarea) {
          title = '内容'
        } else if (!label) {
          title = '标签'
        } else if (!pay) {
          title = '金额'
        } else if (!select_text) {
          title = '分类'
        } else if (!latitude) {
          title = '发布需要地址，请打开Gps在提交定位'
        } else if (!longitude) {
          title = '发布需要地址，请打开Gps在提交定位'
        } else if (text.length >= 10) {
          title = "标题不能超过十个字"
        } else if (!time) {
          title = '时长'
        }
        if (uplUrlList.length == 0) {
          title = '图片'
        }
        if (label == "" || text == "" || textarea == "" || pay == "" || select_text == "" || uplUrlList.length == 0 || latitude == "" || longitude == "" || time == "") {
          wx.showToast({
            title: title + '不能为空',
            icon: 'none',
            duration: 2000
          })
          return;
        }

        var tid = that.data.selectAll[that.data.selectindex].id
        var a = uplUrlList.length
        var data = {
          content: textarea, //内容
          title: text, //标题,
          label: label, //标签
          imgUrl: uplUrlList, //图片
          price: parseFloat(pay), //金额
          tId: tid, //类别
          issuer: that.data.openId,
          lat: latitude,
          lng: longitude,
          time: time
        }
        console.log(data)
        wx.showModal({
          title: '',
          content: '确定提交',
          success(res) {
            if (res.confirm) {
              wx.showLoading({
                title: '加载中',
              })
              
              var orderfromList = []
              wx.request({
                url: app.globalData.baseUrl + '/withme/in/save',
                method: 'GET',
                data: data,
                header: {
                  'content-type': 'application/json' // 默认值
                },
                success: function (res) {
                 
                  if (res.data.code == 200) {
                   
                    wx.showToast({
                     
                      title: '添加成功',
                      icon: 'none',
                      duration: 2000
                    })
                    that.setData({
                      title: '',
                      content: '',
                      label: '',
                      imgUrl: '',
                      price: '',
                      tId: tid,
                      pics: [],
                      selectindex: '',
                      time: '',
                      uplImgeList: []
                    })
                    wx.hideLoading();
                  } else {
                    console.log("发布添加失败")
                    wx.hideLoading();
                  }
                },
                fail(res) {
                  console.log("添加发布信息报错：" + res)
                  wx.hideLoading();
                }
              })
              wx.hideLoading();
            } else {
              console.log('用户点击取消')
            }
          }
        })
      } else {
        wx.showModal({
          title: '',
          content: '请先登录在操作!',
          success(res) {
            if (res.confirm) {
              wx.switchTab({
                url: '../../pages/user/user',
              })
            } else {
              console.log('用户点击取消')
            }
          }
        })
      }
    }, 1000)
  },
  onLoad: function (options) {

  },

})