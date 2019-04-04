// pages/user/user.js
var App = getApp();
Page({
  data: {
    hasUserInfo: false, //显示用户名和头像
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    pages: [{
      value: "我的信息",
      pages: 'myprofile/myprofile'
    }, {
      value: "我的订单",
      pages: 'index/index'
    }, {
      value: "陪玩订单",
      pages: 'withsomeone/withsomeone'
    }],
  },

  onLoad: function(options) {
    if (wx.getStorageSync("openId")) {
      this.setData({
        openId: wx.getStorageSync("openId")
      })
    }
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
  },
  // 登录
  getUserInfo(e) {
    var that = this
    if (e.detail.errMsg == 'getUserInfo:fail auth deny') {

    } else {
      // 登录
      wx.login({
        success: res => {

          var code = res.code
          wx.getUserInfo({
            withCredentials: true,
            success: function(res_user) {
              var data = {
                "iv": res_user.iv,
                "codeId": code,
                "encryptedData": res_user.encryptedData
              }
              wx.request({
                url: App.globalData.baseUrl + '/withme/user/op',
                method: "GET",
                data: data,
                success: function(res) {
                  if (res.data != null) {
                    //获取openid 当用户标识
                    wx.setStorageSync('openId', res.data.openId)
                    var openId = res.data.openId
                    var gender = res.data.gender
                    var nickName = res.data.nickName
                    var province = res.data.province

                    App.globalData.userInfo = e.detail.userInfo
                    that.setData({
                      userInfo: e.detail.userInfo,
                      hasUserInfo: true
                    })

                    if (openId != undefined || openId != '') {

                      var obj = {
                        "openId": openId
                      }
                      that.setData({
                        "openId": openId
                      })
                      //withme/user/save 存用户openid
                      wx.request({
                        url: App.globalData.baseUrl + '/withme/user/save',
                        method: 'GET',
                        data: obj,
                        header: {
                          'content-type': 'application/json' // 默认值
                        },
                        success: function(res) {
                          if (res.data.code == 200) {
                            // 存openid 成功
                            //withme/user/view 查询用户
                            wx.request({
                              url: App.globalData.baseUrl + '/withme/user/view',
                              method: 'GET',
                              data: obj,
                              header: {
                                'content-type': 'application/json' // 默认值
                              },
                              success: function(res) {
                                if (res.data.code == 200) {
                                  //不完整 跳转到个人信息页面进行编辑
                                  wx.showModal({
                                    title: '',
                                    content: '登录成功，请先完善个人资料',
                                    success(res) {
                                      if (res.confirm) {
                                        wx.navigateTo({
                                          url: '../myprofile/myprofile?gender=' + gender + '&nickName=' + nickName,
                                        })
                                      } else {
                                        console.log('用户点击取消')
                                      }
                                    }
                                  })

                                } else if (res.data.code == 204) {
                                  console.log('用户不存在！')
                                }
                              }
                            })
                          } else if (res.data.code == 201) {
                            //用户已存在,查到该用户信息并存到缓存
                            wx.request({
                              url: App.globalData.baseUrl + '/withme/user/view',
                              method: 'GET',
                              data: obj,
                              header: {
                                'content-type': 'application/json' // 默认值
                              },
                              success: function(res) {
                                if (res.data.code == 200) {
                                  if (res.data.data.tel != null && res.data.data.tel != '') {
                                    //完整 存个人资料到缓存
                                    wx.setStorageSync('personalDetails', res.data.data)
                                  } else {
                                    wx.showModal({
                                      title: '',
                                      content: '登录成功，请先完善个人资料',
                                      success(res) {
                                        if (res.confirm) {
                                          wx.navigateTo({
                                            url: '../myprofile/myprofile?gender=' + gender + '&nickName=' + nickName,
                                          })
                                        } else {
                                          console.log('用户点击取消')
                                        }
                                      }
                                    })
                                  }
                                } else if (res.data.code == 204) {
                                  console.log('用户不存在！')
                                }
                              }
                            })
                            console.log('用户已存在！')
                          }
                        }
                      })
                    }
                  } else {
                    console.log(res.errMsg)
                  }
                }
              })
            }
          })
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
        },
        fail(res) {
          console.log(res)
        }
      })

    }
  },

  // 我的列表事件
  userChange(e) {
    var index = e.currentTarget.dataset.index
    var url = ''
    if (index == 0) {
      if (this.data.openId) {
        url = '../myprofile/myprofile'
      } else {
        wx.showToast({
          title: '请先登录，再填我的信息',
          icon: 'none',
          duration: 2000
        })
        return;
      }

    } else if (index == 1) {
      url = '../orderform/orderform'
    } else if (index == 2) {
      url = '../withsomeone/withsomeone'
    }
    if (url != '') {
      wx.navigateTo({
        url: url,
      })
    }
  }
})