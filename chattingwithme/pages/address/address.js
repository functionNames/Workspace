// pages/address/address.js
var amapFile = require('../../libs/amap-wx.js');//如：..­/..­/libs/amap-wx.js	
Page({

  /**
   * 页面的初始数据
   */
  data: {
	
	city: '',
	cityData: '',
	
	weather: '',
	weatherData: '',
	
	temperature: '',
	temperatureData: '',
	
	winddirection: '',
	windpower: '',
	
	humidity: '',
	humidityData: ''
	
	
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
	var that = this;
    var myAmapFun = new amapFile.AMapWX({key:'39eaba29c701c081d4561e7a0d886b8f'});
    myAmapFun.getWeather({
      success: function(data){
		 console.log(data)
		 console.log(data.city)
        //成功回调
		that.setData({
			//城市
			city: data.city.text,
			cityData: data.city.data,
			
			//天气
			weather: data.weather.text,
			weatherData: data.weather.data,
			
			//温度
			temperature: data.temperature.text,
			temperatureData: data.temperature.data,
			
			//风向
			winddirection: data.winddirection.data,
			//风力
			windpower: data.windpower.data,
			
			//湿度
			
			humidity: data.humidity.text,
			humidityData: data.humidity.data
			
		});
		
      },
      fail: function(info){
        //失败回调
        console.log(info)
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
	
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
	
  }
})