const db = wx.cloud.database();
const bus = getApp().globalData.bus
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: '',
    fileIDs: [],
    reply: [],
    newReply: [],
    //回复内容
    text: '',
    ifhidden: true,
    index: 0,
    origin: '',
    reply_num: 0, //总的回复数
    singleDrifterReplyNum: 0, //单个漂流瓶的回复数
    nickName:''
  },

  send() {
    //console.log(this.data.text.length===0)
    if (this.data.text.length===0){
      wx.showToast({
        title: '内容不能为空哦',
        icon: 'error'
      })
      this.setData({
        text: "",
      })
      return
    }
    var count = 0;
    for (var i = 0; i < this.data.text.length; i++) {
      if (this.data.text[i] === ' ') {
        count++
      }
    }
    if (count == this.data.text.length) {
      wx.showToast({
        title: '内容不能为空哦',
        icon: 'error'
      })
      this.setData({
        text: "",
      })
      return
    }
    else if (this.data.text != '') {
      wx.cloud.callFunction({
        name: 'checkMsg',
        data: {
          content: this.data.text
        }
      }).then(res=>{
          console.log(res)
          if (res.result.errCode == '87014') {
            wx.showToast({
              title: '输入内容含有违法违规内容,发送失败',
              icon: 'none'
            })
          } else {
            var temp = this.data.reply_num + 1
            var temp2 = this.data.singleDrifterReplyNum + 1
            this.setData({
              reply: this.data.reply.concat({
                content: this.data.text,
                like: false
              }),
              text: "",
              ifhidden: false,
              hideImg: false,
              reply_num: temp,
              singleDrifterReplyNum: temp2
            })
          }
        }).catch(err=>{
          console.log(err)
        })
      }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //console.log(options.nickName)
    this.setData({
      index: options.index,
      content: options.content,
      fileIDs: JSON.parse(options.fileId),
      origin: options.origin,
      nickName:options.nickName
    })

    db.collection('orientingDrifterReply').where({
      _openid: getApp().globalData.openid,
      index: this.data.index
    }).get().then(res => {
      if (res.data.length > 0) {
        this.setData({
          reply: res.data[0].reply
        })
      } else {
        this.setData({
          reply: []
        })
      }
      if (this.data.reply === null || this.data.reply === [] || this.data.reply === "") {
        this.setData({
          ifhidden: true
        })
      } else {
        this.setData({
          ifhidden: false
        })
      }
      if (this.data.fileIDs === null || this.data.fileIDs === [] || this.data.fileIDs === "") {
        this.setData({
          hideImg: true
        })
      } else {
        this.setData({
          hideImg: false
        })
      }
    })

    db.collection('user').where({
      _openid: this.data.origin
    }).get().then(res => {
      this.setData({
        reply_num: res.data[0].reply_num
      })
    })



    db.collection('orientingDrifter').where({
      index: "" + this.data.index
    }).get().then(res => {
      this.setData({
        singleDrifterReplyNum: res.data[0].reply_num
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
    db.collection('orientingDrifterReply').where({
      index: this.data.index,
      _openid: getApp().globalData.openid
    }).get().then(res => {
      //如果不是新打捞上来的就更新数据库中的数据
      if (res.data.length > 0) {
        //将回复存到数据库中,更新回复
        db.collection('orientingDrifterReply').where({
          index: this.data.index,
          _openid: getApp().globalData.openid
        }).update({
          data: {
            reply: this.data.reply
          }
        }).then(() => {}).catch(err => {
          console.log(err)
          wx.showToast({
            title: '回复失败，请稍后重试',
          })
        })
      } else {
        // 新打捞上来的在数据库中新建
        db.collection('orientingDrifterReply').add({
          data: {
            index: this.data.index,
            content: this.data.content,
            fileID: this.data.fileIDs,
            reply: this.data.reply,
            originalOpenId: this.data.origin,
            nickName:getApp().globalData.nickName
          }
        }).then(() => {
          bus.emit('driftRefresh')
        })
      }
    }).catch(err => {
      console.log(err);
    })


    db.collection('user').where({
      _openid: this.data.origin
    }).update({
      data: {
        reply_num: this.data.reply_num
      }
    })

    db.collection('orientingDrifter').where({
      index: "" + this.data.index
    }).update({
      data: {
        reply_num: this.data.singleDrifterReplyNum
      }
    })

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