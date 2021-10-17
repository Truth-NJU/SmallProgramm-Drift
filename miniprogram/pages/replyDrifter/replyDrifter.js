// pages/replyDrifter/replyDrifter.js
const db=wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    random:[],  //original drifters
    orientingDrifter:[], //original drifters
    status:"",
    orientingIndex:[]
  },

  jumpToReplyRandom(event){

    var temp=JSON.stringify(event.currentTarget.dataset.item.fileID)
    wx.navigateTo({
      url: `../reply/reply?content=${event.currentTarget.dataset.item.content}&fileId=${temp}&status=${"random"}&index=${event.currentTarget.dataset.item.index}`,
    })
  },


  jumpToReplyOrienting(event){
    // console.log(event.currentTarget.dataset.item.content)
    var temp=JSON.stringify(event.currentTarget.dataset.item.fileID)
    wx.navigateTo({
      url: `../reply/reply?content=${event.currentTarget.dataset.item.content}&fileId=${temp}&status=${"orienting"}&index=${event.currentTarget.dataset.item.index}`,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    db.collection('randomDrifter').where({
      _openid:getApp().globalData.openid
    }).get().then(res=>{
      var array=[];
      for (var i=0;i<res.data.length;i++){
        array=array.concat( {content:res.data[i].content,index:res.data[i].index,fileID:res.data[i].fileID} )
      }
      this.setData({
        random:array
      })
    })
   /* db.collection('randomDrifterReply').get().then(res=>{
      for(var i=0;i<res.data.length;i++){
        this.setData({
          randomIndex:this.data.randomIndex.concat(res.data[i].index)
        })
      }
    })
    db.collection('orientingDrifterReply').get().then(res=>{
      console.log(res.data)
      for(var i=0;i<res.data.length;i++){
        this.setData({
          orientingIndex:this.data.orientingIndex.concat(res.data[i].index)
        })
      }
    })
    db.collection('randomDrifter').where({
      _openid:getApp().globalData.openid
    }).get().then(res=>{
      console.log(res.data)
      for(var i=0;i<res.data.length;i++){
        for(var j=0;j<this.data.randomIndex.length;j++){
          if(this.data.randomIndex[j]-"0"==res.data[i].index){
            this.setData({
              randomContent:this.data.randomContent.concat(res.data[i])
            })
            break;
          }
        }
      }
      console.log(this.data.randomContent)
    });

    db.collection('orientingDrifter').where({
      _openid:getApp().globalData.openid
    }).get().then(res=>{
      for(var i=0;i<res.data.length;i++){
        for(var j=0;j<this.data.orientingIndex.length;j++){
          if(this.data.orientingIndex[j]-"0"==res.data[i].index){
            this.setData({
              orientingContent:this.data.orientingContent.concat(res.data[i])
            })
            break;
          }
        }
      }
    });*/
   
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