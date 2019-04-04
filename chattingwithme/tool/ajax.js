module.exports = {
  request: (url) => {
    return new Promise((resolve, reject) => {
      wx.request({
        url: url,
        success: (res) => {
					resolve(res)
				}
				
				
				
      })
    })
  }
}