const db = wx.cloud.database();
const bus = getApp().globalData.bus

Page({

  data: {
    bgColor: "#85C1E9",
    random: false, //false为定向，true为随机
    //是否已经被回复
    reply: false,
    //是否显示点击漂流瓶的弹出层
    show: false,
    showDaLao: false,
    //是否显示点击打捞的遮罩层
    showOverlay: false,
    columns: ['random漂流瓶', '定向漂流瓶'],
    flag: 4,
    //数据库中的漂流瓶内容
    content: [],
    //捞上来的漂流瓶文本
    text: '',
    //捞上来的漂流瓶图片id
    fileIDs: [],
    //index
    index: 0,
    originalOpenId: "",
    nickName:''
  },
  
  onClose() {
    this.setData({
      show: false
    });
  },

  ran(a) {
    return Math.floor((Math.random() * a));
  },

  //选择回复，进入回复页面
  reply() {
    var temp = JSON.stringify(this.data.fileIDs)
    wx.navigateTo({
      url: `../replyRandomDrifter/replyRandomDrifter?content=${this.data.text}&fileId=${temp}&index=${this.data.index}&origin=${this.data.originalOpenId}`
    })
    this.setData({
      showOverlay: false
    })
  },

  giveup() {
    this.setData({
      showOverlay: false
    })
  },

  dalao() {
    db.collection('randomDrifter').where({
      index: ""+this.ran(getApp().globalData.randomDrifterIndex)
    }).get().then(res => {
      wx.showToast({
        title: '打捞瓶子成功',
      })
      this.setData({
        text: res.data[0].content,
        fileIDs: res.data[0].fileID,
        index: res.data[0].index,
        random: true,
        originalOpenId: res.data[0]._openid,
        showOverlay: true
      })
    }).catch(err => {
      wx.hideToast({
        success: (res) => {
          console.log(res)
        },
      })
      wx.showModal({
        title: '打捞瓶子失败，请稍后重试',
      })
    })
    this.setData({
      flag: 4,
      showDaLao: false
    })
  },

  onCancel() {
    this.setData({
      show: false
    })
  },

  onConfirm(event) {
    const {
      picker,
      value,
      index
    } = event.detail;
    this.setData({
      flag: index
    })
    // 0则进入随机漂流瓶页面
    if (this.data.flag === 0) {
      wx.navigateTo({
        url: '../createRandomDrifter/createRandomDrifter',
      })
    } else {
      //否则进入定向漂流瓶页面
      wx.navigateTo({
        url: '../createOrientingDrifter/createOrientingDrifter',
      })
    }
    this.setData({
      flag: 4,
      show: false
    })
  },


  //跳转到回复页面
  jumpToReply(event) {
    var temp2 = JSON.stringify(event.currentTarget.dataset.item.fileID)
    const index=event.currentTarget.dataset.item.index
    db.collection('randomDrifter').where({
      index:index
    }).get().then(res=>{
      // console.log(res)
      wx.navigateTo({
        url: `../replyRandomDrifter/replyRandomDrifter?content=${event.currentTarget.dataset.item.content}&fileId=${temp2}&index=${event.currentTarget.dataset.item.index}&origin=${event.currentTarget.dataset.item.originalOpenId}&nickName=${res.data[0].nickName}`,
      })
    })
  },

  createDrifter: function () {
    this.setData({
      show: true
    });
  },


  showReplyDrifter() {
    wx.navigateTo({
      url: '../replyDrifter/replyDrifter',
    })
  },


  onLoad: function (options) {
    db.collection('randomDrifter').get().then(res => {
      getApp().globalData.randomDrifterIndex = res.data.length;
      console.log(res)
    })
    db.collection('orientingDrifter').get().then(res => {
      getApp().globalData.orientingDrifterIndex = res.data.length;
    })
    //wx.stopPullDownRefresh();

    //查询匹配的数据
    db.collection('randomDrifterReply').where({
      _openid: getApp().globalData.openid
    }).get().then(res2 => {
      this.setData({
        content: this.data.content.concat(res2.data)
      })
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
    bus.on('driftRefresh', (model) => {
      this.onPullDownRefresh();
    })
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
    查询匹配的数据
    db.collection('randomDrifterReply').where({
      _openid: getApp().globalData.openid
    }).get().then(res => {
      this.setData({
        content: res.data
      })
    })
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

  },
  
  onPageScroll:function(e){
    if(e.scrollTop<0){
      wx.pageScrollTo({
        scrollTop: 0
      })
    }
  }
})