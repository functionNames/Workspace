// pages/nav/nav.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: ["搜索", "我的", "分类", "陪我聊天", "陪我玩游戏", "刷新", "发布", "分类", "我的"]
  },
  onLoad() {

  },
  navclick(e) {
    var index = e.currentTarget.dataset.index
    var url = '../home/home'
    if (index == 0) {
      url = '../home/home'
    } else if (index == 1) {
      url = '../user/user'

    } else if (index == 2) {
      url = '../kind/kind'

    } else if (index == 3) {
      url = '../home/home'
    } else if (index == 4) {
      url = '../home/home'
    } else if (index == 5) {
      url = '../home/home'
    } else if (index == 6) {
      url = '../publish/publish'

    } else if (index == 7) {
      url = '../kind/kind'

    } else if (index == 8) {
      url = '../user/user'

    }
    wx.switchTab({
      url: url
    })
  }
})