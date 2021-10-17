const db = wx.cloud.database();
const bus = getApp().globalData.bus
var util = require('../../util/TimeUtil');
Page({

  data: {
    bgColor: "#85C1E9",
    random: false, //false为定向，true为随机
    //是否已经被回复
    reply: false,
    //是否显示点击漂流瓶的弹出层
    showDaLao: false,
    //是否显示点击打捞的遮罩层
    showOverlay: false,
    columns: ['漂流瓶', '给管理员的信'],
    //数据库中的漂流瓶内容
    content: [],
    //捞上来的漂流瓶文本
    text: '',
    flag: 4,
    //捞上来的漂流瓶图片id
    fileIDs: [],
    //index
    index: 0,
    originalOpenId: "",
    //页面中替换图片的fileid
    fileID: "",
    imgSrc: "../../images/d521199a448510bbbb2fec7182d68997-2.png",
    //用户是否已自定义图片
    empty: true,
    imgStyle: "",
    dailyWord: "",
    nickName:''
  },

  onClose() {
    this.setData({
      show: false
    });
  },

  onCancel() {
    this.setData({
      show: false
    })
  },
  createDrifter: function () {
    console.log(getApp().globalData.loginOrNot)
    if (getApp().globalData.loginOrNot===1){
    this.setData({
      show: true
    });
  }else{
    wx.showToast({
      title: '您未登陆～',
      icon:'error'
    })
  }
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


  ran(a) {
    return Math.floor((Math.random() * a));
  },
  toMyReply() {
    if (getApp().globalData.loginOrNot===1){
    wx.navigateTo({
      url: '../drifter/drifter',
    })
  }else{
    wx.showToast({
      title: '您未登陆～',
      icon:'error'
    })
  }
  },
  //选择回复，进入回复页面
  reply() {
    var temp = JSON.stringify(this.data.fileIDs)
    wx.navigateTo({
      url: `../replyRandomDrifter/replyRandomDrifter?content=${this.data.text}&fileId=${temp}&index=${this.data.index}&origin=${this.data.originalOpenId}&nickName=${this.data.nickName}`
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
    if (getApp().globalData.loginOrNot===1){
    var r = this.ran(getApp().globalData.randomDrifterIndex)
    console.log(r)
    db.collection('randomDrifter').where({
      index: "" + r
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
        showOverlay: true,
        nickName:res.data[0].nickName
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
  }else{
    wx.showToast({
      title: '您未登陆～',
      icon:'error'
    })
  }
  },


  createRandom() {
    wx.navigateTo({
      url: '../createRandomDrifter/createRandomDrifter',
    })
  },

  createOrienting() {
    wx.navigateTo({
      url: '../createOrientingDrifter/createOrientingDrifter',
    })
  },

  getImgDetail(event) {
    //console.log(event)
    if (event.detail.height / event.detail.width * wx.getSystemInfoSync().windowWidth * 0.9 > wx.getSystemInfoSync().windowHeight * 0.8) {
      this.setData({
        imgStyle: "width:" + wx.getSystemInfoSync().windowWidth * 0.6 + "px;" + "height:" + event.detail.height / event.detail.width * wx.getSystemInfoSync().windowWidth * 0.6 + "px;left:20%;"
      })
    } else {
      this.setData({
        imgStyle: "width:" + wx.getSystemInfoSync().windowWidth * 0.9 + "px;" + "height:" + event.detail.height / event.detail.width * wx.getSystemInfoSync().windowWidth * 0.9 + "px;"
      })

    }
  },



  showReplyDrifter() {
    wx.navigateTo({
      url: '../replyDrifter/replyDrifter',
    })
  },


  onLoad: function (options) {
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    //获取当前时间
    var n = timestamp * 1000;
    var date = new Date(n);
    //年
    var Y = date.getFullYear();
    //月
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    //日
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    //console.log(Y+"-"+M+"-"+D)
    wx.cloud.callFunction({
      name: "dailyWord",
      data:{
        time:Y+"-"+M+"-"+D
      }
    }).then(res => {
      //console.log(res.result.note)
      this.setData({
        dailyWord: res.result.note
      })
      // console.log(res.result.newslist[0].note)
    })

    wx.stopPullDownRefresh();


    db.collection('image').where({
      _openid: getApp().globalData.openid
    }).get().then(res => {
      if (res.data.length == 0) {
        this.setData({
          empty: true
        })
      } else {
        this.setData({
          empty: false,
          imgSrc: res.data[0].fileID
        })
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
    db.collection('image').where({
      _openid: getApp().globalData.openid
    }).get().then(res => {
      if (res.data.length == 0) {
        this.setData({
          empty: true
        })
      } else {
        this.setData({
          empty: false,
          imgSrc: res.data[0].fileID
        })
      }
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
  },


  onPageScroll:function(e){
    if(e.scrollTop<0){
      wx.pageScrollTo({
        scrollTop: 0
      })
    }
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {}

})