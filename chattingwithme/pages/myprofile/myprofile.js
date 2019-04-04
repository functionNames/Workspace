var App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sexList: [{
      value: 'man',
      text: '男',

    }, {
      value: 'women',
      text: '女'
    }],
    indexColor: 0,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var personalDetails = {}
    // 授权性别
    if (options.gender != undefined && options.gender != '') {
      var sexList = this.data.sexList
      if (options.gender == 1) {
        sexList[0].checked = true
      } else {
        sexList[1].checked = true
      }
      this.setData({
        sexList: sexList,
        personalList: personalDetails
      })
    }

    //授权昵称
    if (options.nickName != undefined && options.nickName != '') {
      var personalDetails = {
        "userName": options.nickName
      }
      this.setData({
        personalList: personalDetails
      })
    }


    // 有资料的话性别赋值
    if (wx.getStorageSync('personalDetails')) {
      var personalDetails = wx.getStorageSync('personalDetails')
      var sexList = this.data.sexList
      if (personalDetails.sex == '男') {
        sexList[0].checked = true
      } else {
        sexList[1].checked = true
      }
      this.setData({
        sexList: sexList,
        personalList: wx.getStorageSync('personalDetails')
      })
    }
    var openId = wx.getStorageSync('openId')
    if (openId != undefined || openId != '') {
      this.setData({
        openId: openId
      })
    }
  },
  //我的资料提交
  formSubmit(e) {
    var a = e.detail.value;
    var that = this
    let {
      personalized_signature,//个签
      userName, //用户名字
      name, //姓名
      age, //年龄
      sex, //性别
      height, //身高
      tel, //电话
      characters, //性格
      personalizedSignature, //爱好
      education, //学历
      speciality, //专长
      idCard, //身份证
    } = e.detail.value;

    var title = ''
    if (!userName) {
      title = '用户名字'
    } else if (!name) {
      title = '姓名'
    } else if (!age) {
      title = '年龄'
    } else if (!sex) {
      title = '性别'
    } else if (!height) {
      title = '身高'
    } else if (!tel) {
      title = '电话'
    } else if (!idCard) {
      title = '身份证'
    }

    // 效验
    if (!userName || !name || !age || !sex || !height || !tel || !idCard) {
      wx.showToast({
        title: title + '不能为空',
        icon: 'none',
        duration: 2000
      })
      return;
    }

    //openId(Integer),userName(String),age(Integer),sex(String),height(String),education(String),speciality(String),characters(String)，tel(String）,name(String)
    var obj = {
      "openId": this.data.openId,
      "userName": userName,
      "name": name,
      "age": parseInt(age),
      "sex": sex,
      "height": height,
      "tel": tel,
      "characters": characters, //性格
      "education": education, //学历
      "speciality": speciality, //特长
      "idCard": idCard,
      "personalized_signature": personalized_signature
    }
    wx.request({
      url: App.globalData.baseUrl + '/withme/user/update',
      method: 'GET',
      data: obj,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        if (res.data.code == 200) {
          wx.showToast({
            title: '信息编辑成功',
            icon: 'none',
            duration: 2000
          })
          wx.switchTab({
            url: '../user/user',
          })
          that.setData({
            personalList: obj
          })
          wx.setStorageSync('personalDetails', obj)
        } else {

        }
      }
    })
  },
  
  // 我的资料触发模块事件
  mypftrigger(e) {
    // index 触发模块的标识
    var index = e.currentTarget.dataset.index
    this.setData({
      indexColor: index
    })
  }
})