// pages/orientingDrifter/orientingDrifter.js
const db=wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content:[],
    originalOpenId:""
  },

  jumpToReply(event){
    var temp2=JSON.stringify(event.currentTarget.dataset.item.fileID)
    console.log(event.currentTarget.dataset.item)
    wx.navigateTo({
        url: `../replyOrientingDrifter/replyOrientingDrifter?content=${event.currentTarget.dataset.item.content}&fileId=${temp2}&index=${event.currentTarget.dataset.item.index}&origin=${event.currentTarget.dataset.item._openid}&nickName=${event.currentTarget.dataset.item.nickName}`,
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    db.collection('orientingDrifter').get().then(res=>{
      this.setData({
        content:this.data.content.concat(res.data)
      })
      //console.log(this.data.content)
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