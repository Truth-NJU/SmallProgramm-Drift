// miniprogram/pages/createDrifter.js
const db = wx.cloud.database();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: "",
    fileIDs: [],
    fileList: [],
    autosize:{
      minHeight: 170
    }
  },


  back(){
    wx.navigateBack({
      delta: 0,
    })
  },

  setValue: function (event) {
    this.setData({
      content: event.detail
    })
  },

 
  upload: function (event) {
    var path=''
    var that=this;
    const {
      file
    } = event.detail;
    console.log(file)
    wx.compressImage({
      src: file.url, // 图片路径
      quality: 1 // 压缩质量
    }).then(res=>{
      console.log(res)
      wx.getFileSystemManager().readFile({
        filePath: res.tempFilePath,
        success: res => {
          //console.log(res.data)
          wx.cloud.callFunction({
            name: 'checkImg',
            data: {
              value: res.data
            }
          }).then(
            imgRes => {
              console.log(imgRes)
              if (imgRes.result.errCode == '87014') {
                wx.showToast({
                  title: '图片含有违法违规内容',
                  icon: 'none'
                })
                return
              } else {
                wx.cloud.uploadFile({
                  cloudPath: new Date().getTime() + '.png',
                  //上传至云端的路径（文件名称），注意要每一个都不一样
                  filePath: file.url, // 小程序临时文件路径
                }).then(res => {
                  //console.log(res)
                  // 返回文件ID
                  //console.log(res.fileID)
                  wx.cloud.getTempFileURL({
                    fileList: [res.fileID]
                  }).then(res => {
                    const { fileList = [] } = that.data;
                    fileList.push({ ...file, url: res.data });
                    that.setData({ fileList });
                    //console.log(res.fileList[0].tempFileURL)
                   // console.log(that.data.fileList)
                  })
                  that.setData({
                    fileIDs: that.data.fileIDs.concat(res.fileID)
                  })
                })
                //图片正常，do something
              }
  
            }
          ).catch(err=>{
            wx.showToast({
              title: '图片太大～',
              icon:'error'
            })
            console.log(err)
          })
        },
        fail: err => {
          console.log(err)
        }
      })
    }).catch(err=>{
      console.log(err)
    })
  },

  throw: function () {
    wx.cloud.callFunction({
      name: 'checkMsg',
      data: {
        content: this.data.content
      },
      success: function (res) {
        console.log(res)
        if (res.result.errCode == '87014') {
          wx.showToast({
            title: '输入内容含有违法违规内容,发布失败',
            icon: 'none'
          })
          return;
        }
      },
      fail: function (res) {
        console.log(res)
        return;
      }
    })
    if (getApp().globalData.randomDrifterIndex!==undefined){
    db.collection('randomDrifter').add({
      data: {
        index: ""+getApp().globalData.randomDrifterIndex,
        content: this.data.content,
        fileID: this.data.fileIDs,
        reply_num:0,
        nickName:getApp().globalData.nickName
      }
    }).then(res => {
      getApp().globalData.randomDrifterIndex++
      wx.showToast({
        title: '发布漂流瓶成功'
      })
      wx.navigateBack({
        delta: 0,
      })
    }).then(err => {    
    })
  }
 },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

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