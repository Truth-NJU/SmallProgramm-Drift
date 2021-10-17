// pages/testComponents/popup/popup.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    contents: [{
      "text": "dxyyyds",
      "margin": "11%"
    }, {
      "text": "czwyyds",
      "margin": "15%"
    }, {
      "text": "tzhyyds",
      "margin": "13%"
    },{
      "text": "dxyyyds",
      "margin": "11%"
    }, {
      "text": "czwyyds",
      "margin": "15%"
    }, {
      "text": "tzhyyds",
      "margin": "13%"
    }, {
      "text": "tzhyyds",
      "margin": "13%"
    }, {
      "text": "tzhyyds",
      "margin": "13%"
    }, {
      "text": "tzhyyds",
      "margin": "13%"
    }],
    flag: true
  },
  changeRange() {
    this.popup.changeRange();

    if (this.data.flag) {
      this.data.flag = false;
      let imageWidth = []
      let imageHeight = []
      let that = this
      setTimeout(() => {
        for (let i = 0; i < that.data.contents.length; i++) {
          let query = wx.createSelectorQuery().in(that.popup)
          query.select('#text' + i).boundingClientRect()
          query.exec(function (res) {
            console.log(res)
            imageWidth.push((parseFloat(res[0].width) + 4) + 'px')
            imageHeight.push((parseFloat(res[0].height) + 6) + 'px')
          })
        }
      }, 200)
      setTimeout(() => {
        this.popup.changeSize(imageWidth, imageHeight)
      }, 300)
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.popup = this.selectComponent("#popup");
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