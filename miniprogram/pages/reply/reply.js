// pages/reply/reply.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: "",
    fileID: [],
    status: "",
    reply: [],
    hideImg: false,
    ifhidden: false,
    index: '',
    likeNum: 0,
    img: "",
    nickName:''
  },

  like(event) {
    var c = event.currentTarget.dataset.item.haoma;
    var r = this.data.reply;
    r[c].like = !r[c].like;
    this.setData({
      reply: r
    })
    console.log(this.data.reply)
    db.collection('user').where({
      _openid: r[c].openid
    }).get().then(res => {
      var temp = res.data[0].like_num
      if (r[c].like) {
        temp++
      } else {
        temp--
      }
      console.log(temp)
      db.collection('user').where({
        _openid:r[c].openid
      }).update({
        data: {
          like_num: temp
        }
      }).then(res1 => {
        //console.log(res1)
      }).then(err => {
        //console.log(err)
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      content: options.content,
      index: options.index,
      fileID:JSON.parse(options.fileId),
      status: options.status,
      
    })
    if (this.data.status == "random") {
      db.collection('randomDrifterReply').where({
        index: this.data.index
      }).get().then(res => {
        var count = -1;
        console.log(res)
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i].reply != [] && res.data[i].reply != null && res.data[i].reply != "")
            for (var j = 0; j < res.data[i].reply.length; j++) {
              count++;
              this.setData({
                reply: this.data.reply.concat({
                  content: res.data[i].reply[j].content,
                  like: res.data[i].reply[j].like,
                  openid: res.data[i]._openid,
                  index: res.data[i].index,
                  number: i,
                  haoma: count,
                  nickName:res.data[i].nickName
                })
              })
            }
        }
        //console.log(this.data.reply)
      })
    } else { 
      db.collection('orientingDrifterReply').where({
      index: this.data.index
        }).get().then(res => {
        var count = -1;
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i].reply != [] && res.data[i].reply != null && res.data[i].reply != "")
            for (var j = 0; j < res.data[i].reply.length; j++) {
              count++;
              this.setData({
                reply: this.data.reply.concat({
                  content: res.data[i].reply[j].content,
                  like: res.data[i].reply[j].like,
                  openid: res.data[i]._openid,
                  index: res.data[i].index,
                  number: i,
                  haoma: count,
                  nickName:res.data[i].nickName
                })
              })
            }
        }



        if (this.data.fileID == null || this.data.fileID == [] || this.data.fileID == "") {
          this.setData({
            hideImg: true
          })
        } else {
          this.setData({
            hideImg: false
          })
        }
        //console.log(this.data.content)

        this.setData({
          img: "../../images/zan.png"
        })
      })
    }
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

    if (this.data.status == "random") {
      var r = [];
      for (var i = 0; i < this.data.reply.length; i++) {
        if (i == this.data.reply.length - 1 || this.data.reply[i].number != this.data.reply[i + 1].number) {
          r = r.concat({
            content: this.data.reply[i].content,
            like: this.data.reply[i].like
          })
          db.collection("randomDrifterReply").where({
            index: this.data.reply[i].index,
            _openid: this.data.reply[i].openid
          }).update({
            data: {
              reply: r
            }
          })
          r = [];
        } else {
          r = r.concat({
            content: this.data.reply[i].content,
            like: this.data.reply[i].like
          })
        }
      }
    } else {
      var r = [];
      for (var i = 0; i < this.data.reply.length; i++) {
        if (i == this.data.reply.length - 1 || this.data.reply[i].number != this.data.reply[i + 1].number) {
          r = r.concat({
            content: this.data.reply[i].content,
            like: this.data.reply[i].like
          })
          db.collection("orientingDrifterReply").where({
            index: this.data.reply[i].index,
            _openid: this.data.reply[i].openid
          }).update({
            data: {
              reply: r
            }
          })
          r = [];
        } else {
          r = r.concat({
            content: this.data.reply[i].content,
            like: this.data.reply[i].like
          })
        }
      }
    }
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