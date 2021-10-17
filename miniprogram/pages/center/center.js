import TimeUtil from '../../util/TimeUtil'
let cache = getApp().globalData.cache
var app = getApp()
var database = wx.cloud.database()
var user = wx.cloud.database().collection('user')
let query = wx.createSelectorQuery()
var db = wx.cloud.database()
var random = []
var orienting = []
Page({
  data: {
    data1: 0,
    data2: 0,
    tips: [],
    daysInMonth: [29, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    year: TimeUtil.getFormatYear(),
    month: TimeUtil.getFormatMonth(),
    day: TimeUtil.getFormatDay(),
    days: 0,
    //普通用户100 管理员
    iwidth: 80,
    openid: "",
    identity: 0,
    id_data: "",
    like_num: 0,
    reply_num: 0,
    manager: false,
    code: '',
    get_code: false,
    if_manager_get_code: false,
    show_advice: false,
    custom_style: "height:30%",
    show_reply: false,
    show_config: false,
    page: 0,
    // random: [],
    // orienting: [],
    status: "",
    singleReply: 0,
    cede: "",
    //页面中替换图片的fileid
    fileID: "",
    imgSrc: "../../images/quhaibian.png",
    //用户是否已自定义图片
    empty: true,
    nickName: ''
  },

  gotoIntroduction() {
    wx.navigateTo({
      url: '../introduction/introduction',
    })
  },
  jumpToReplyRandom(event) {
    //console.log(random)
    if (event.currentTarget.dataset.item.singleReply != 0) {
      var num = this.data.reply_num - event.currentTarget.dataset.item.singleReply
      //console.log(event.currentTarget.dataset.item.reply_num)
      db.collection('user').where({
        _openid: getApp().globalData.openid
      }).update({
        data: {
          reply_num: num
        }
      })
      db.collection('randomDrifter').where({
        index: "" + event.currentTarget.dataset.item.index
      }).update({
        data: {
          reply_num: 0
        }
      })
    }

    var temp = JSON.stringify(event.currentTarget.dataset.item.fileID)
    const index = event.currentTarget.dataset.item.index
    db.collection('randomDrifter').where({
      index: index
    }).get().then(res => {
      // console.log(res)
      wx.navigateTo({
        url: `../reply/reply?content=${event.currentTarget.dataset.item.content}&fileId=${temp}&status=${"random"}&index=${event.currentTarget.dataset.item.index}`,
      })
    })
  },

  jumpToReplyOrienting(event) {
    console.log(random)
    if (event.currentTarget.dataset.item.singleReply != 0) {
      var num = this.data.reply_num - event.currentTarget.dataset.item.singleReply
      db.collection('user').where({
        _openid: getApp().globalData.openid
      }).update({
        data: {
          reply_num: num
        }
      })
      db.collection('orientingDrifter').where({
        index: "" + event.currentTarget.dataset.item.index
      }).update({
        data: {
          reply_num: 0
        }
      })
    }
    // console.log(event.currentTarget.dataset.item.content)
    // console.log(event.currentTarget.dataset.item)
    var temp = JSON.stringify(event.currentTarget.dataset.item.fileID)
    const index = event.currentTarget.dataset.item.index
    db.collection('orientingDrifter').where({
      index: index
    }).get().then(res => {
      // console.log(res)
      wx.navigateTo({
        url: `../reply/reply?content=${event.currentTarget.dataset.item.content}&fileId=${temp}&status=${"orienting"}&index=${event.currentTarget.dataset.item.index}`,
      })
    })
  },

  replyOrienting() {
    if (getApp().globalData.loginOrNot === 1) {
      wx.navigateTo({
        url: '../orientingDrifter/orientingDrifter',
      })
    } else {
      wx.showToast({
        title: '您未登陆～',
        icon: 'error'
      })
    }
  },

  onLoad: function () {
    this.setData({
      data1: -5 + this.ran(10),
      data2: -5 + this.ran(10)
    })
    if (this.data.year % 4 !== 0 || this.data.year % 400 === 0) {} else {
      this.data.daysInMonth[2] = 29
    }

    for (let i = 1; i < parseInt(this.data.month); i++) {
      this.data.days += this.data.daysInMonth[i]
    }
    this.data.days += (this.data.day - 1)

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

    db.collection('randomDrifter').where({
      _openid: getApp().globalData.openid
    }).get().then(res => {
      //console.log(res.data.length)
      // console.log(res)
      var array = [];
      for (var i = 0; i < res.data.length; i++) {
        array = array.concat({
          content: res.data[i].content,
          index: res.data[i].index,
          fileID: res.data[i].fileID,
          singleReply: res.data[i].reply_num,
          nickName: res.data[i].nickName
        })
      }
      random = array
      //console.log()

      // this.setData({
      //   random: array
      // })
      //console.log(this.data.random)
    })


    db.collection('orientingDrifter').where({
      _openid: getApp().globalData.openid
    }).get().then(res => {
      var array = [];
      for (var i = 0; i < res.data.length; i++) {
        array = array.concat({
          content: res.data[i].content,
          index: res.data[i].index,
          fileID: res.data[i].fileID,
          singleReply: res.data[i].reply_num,
          nickName: res.data[i].nickName
        })
      }

      orienting = array

    })

    this.setData({
      openid: app.globalData.openid,
      identity: app.globalData.identity
    })
    user.where({
        _openid: this.data.openid
      }).get()
      .then(res => {
        this.setData({
          like_num: res.data[0].like_num,
          reply_num: res.data[0].reply_num
        })
      })
    var id = app.globalData.openid
    var identity = app.globalData.identity
    if (identity === 0) {
      this.setData({
        iwidth: 100,
        id_data: "普通用户"
      })
    } else {
      this.setData({
        iwidth: 80,
        id_data: "管理者"
      })
    }

  },

  reply_page: function () {
    if (getApp().globalData.loginOrNot === 1) {
      this.data.show_reply ? this.setData({
        show_reply: false
      }) : this.setData({
        show_reply: true
      })
    } else {
      wx.showToast({
        title: '您未登陆～',
        icon: 'error'
      })
    }
  },
  be_manager: function () {
    this.setData({
      manager: true
    })
  },
  manager_back: function () {
    console.log("www")
    this.setData({
      manager: false,
      code: ''
    })
  },
  to_get_code: function () {
    this.setData({
      get_code: true
    })
  },
  get_code_back: function () {
    this.setData({
      get_code: false
    })
  },
  hhh: function () {},
  test: function () {
    this.data.page == 0 ? this.setData({
      page: 1
    }) : this.setData({
      page: 0
    })
  },
  swiper_change: function (e) {
    this.setData({
      page: e.detail.current
    })
  },
  get_code: function () {
    var date_base = database.collection('apply_date')
    var id = this.data.openid
    var date = new Date().toLocaleDateString()
    date_base.where({
        _openid: id
      }).get()
      .then(res => {
        if (res.data.length == 0) {
          date_base.add({
            data: {
              date: date
            }
          })
          this.send()
        } else {
          var now = res.data[0].date
          if (now === date) {
            wx.showToast({
              icon: 'error',
              title: '今天已经申请过啦',
            })
          } else {
            this.send()
            date_base.where({
              _openid: id
            }).update({
              data: {
                date: date
              }
            })
          }
        }
      })
  },
  send: function () {
    console.log(getApp().globalData.orientingDrifterIndex)
    if (getApp().globalData.orientingDrifterIndex !== undefined) {
      db.collection('orientingDrifter').add({
        data: {
          index: "" + getApp().globalData.orientingDrifterIndex,
          content: "我可以成为管理员吗？我有" + this.data.like_num + "赞",
          fileID: [],
          reply_num: 0,
          nickName: getApp().globalData.nickName
        }
      }).then(res => {
        getApp().globalData.orientingDrifterIndex++
        wx.showToast({
          title: '请静候佳音'
        })
      })

    }
  },
  apply_for_manager: function () {
    var that = this
    var code = this.data.code
    database.collection('manager_code').where({
        code: code
      }).get()
      .then(res => {
        if (res.data.length != 0) {
          user.where({
              _openid: this.data.openid
            })
            .update({
              data: {
                identity: 1
              }
            })
          db.collection('manager_code').where({
            code: code
          }).remove();
          app.globalData.identity = 1
          that.manager_back()
          that.onLoad()

        } else {
          wx.showToast({
            title: '邀请码错误或已失效',
            icon: 'none'
          })
        }
      })
  },

  manager_get_code: function () {
    var r;
    db.collection('manager_code').get().then(res => {
      r = res.data[this.ran(res.data.length)].code;
      this.setData({
        if_manager_get_code: true,
        code: r
      })
    })

  },

  manager_get_code_back() {
    this.setData({
      if_manager_get_code: false
    })
  },

  copy: function () {
    wx.setClipboardData({
        data: this.data.code,
      })
      .then(wx.showToast({
        title: '复制成功',
      }))
  },

  onShow() {
    db.collection('user').where({
      _openid: getApp().globalData.openid
    }).get().then(res => {
      this.setData({
        reply_num: res.data[0].reply_num,
        like_num: res.data[0].like_num
      })
    })
    db.collection('randomDrifter').where({
      _openid: getApp().globalData.openid
    }).get().then(res => {
      //console.log(res.data.length)
      var array = [];
      for (var i = 0; i < res.data.length; i++) {
        array = array.concat({
          content: res.data[i].content,
          index: res.data[i].index,
          fileID: res.data[i].fileID,
          singleReply: res.data[i].reply_num
        })
      }
      this.setData({
        random: array
      })
    })

    db.collection('orientingDrifter').where({
      _openid: getApp().globalData.openid
    }).get().then(res => {
      var array = [];
      for (var i = 0; i < res.data.length; i++) {
        array = array.concat({
          content: res.data[i].content,
          index: res.data[i].index,
          fileID: res.data[i].fileID,
          singleReply: res.data[i].reply_num
        })
      }
      this.setData({
        orienting: array
      })
    })
  },
  show_config: function () {
    this.setData({
      show_config: true
    })
  },
  show_config_back() {
    this.setData({
      show_config: false
    })
  },

  /**
   * 获取心情周报后，打开周报页面
   */
  show_emoWeek: async function (e) {
    let today = TimeUtil.getFormatDay()
    let emost = cache.get("emoWeek" + today)
    let tips = cache.get("Tips")
    let emoDetails = cache.get("emoWeekDetails" + today)
    let emoGradient = cache.get("emoWeekGradient" + today)
    let emoRate = cache.get("emoWeekRate" + today)
    let emoRateText = cache.get("emoWeekRateText" + today)
    let d = 0
    let mark = -1

    /**
     * 查询一月一来（不包括本日）的全部心情数据塞入cache的"emoWeek"+TimeUtil.getFormatDay()条目
     * 如果cache存在该条目，则使用该条目，否则进行查询
     */
    if (emost === undefined) {
      var temp;
      await db.collection("emotion" + this.data.year).where({
        _openid: getApp().globalData.openid
      }).get().then(res => {
        if (res.data.length == 0) {
          temp = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
        } else {
          var r = res.data[0].image;
          temp = r.slice(this.data.days - 30, this.data.days)
        }
        cache.update("emoWeek" + today, temp);
        emost = temp;
      })
    }
    /**
     * 根据主心情决定emoTips,
     * 建议emoTips初始文案存入数据库，使用cache优化读取速度
     * @param emoTips[text] 即给予使用者的建议文案，使用富文本
     * 
     * 根据emoRate计算emoCompare，
     * @param emoCompare  
     */
    if (tips === undefined) {
      await db.collection('tips').get().then(res => {
        cache.update("Tips", res.data)
      })
    }
    /**将emos的前七条作为数据，对emoRate,emoGradient,emoDetails进行计算
     * @param emoRate 该段时间内好/坏心情的比率，选择更高比率的心情作为这段时间的主心情
     * @param emoGradient 根据主心情的比率大小决定百分比条的颜色
     * @param emoDetails[style] 将这段时间按日分划分为N块，此处决定每块的颜色
     */

    //过去七天的心情细节
    if (emoDetails === undefined) {
      let emos = emost.slice(emost.length - 7, emost.length)
      mark = 14
      emoDetails = []
      for (var i = 0; i < 7; i++) {
        if (emos[i] === "") {
          d++;
          emoDetails.push({
            style: "background-color:#a1a3a6"
          })
          continue
        }
        if (emos[i] === "../../images/greatSun.png") {
          emoDetails.push({
            style: "background-color:#ed1941;"
          })
          mark += 2
        } else
        if (emos[i] === "../../images/sun.png") {
          emoDetails.push({
            style: "background-color:#ed1941;"
          })
          mark++
        } else
        if (emos[i] === "../../images/rain.png") {
          emoDetails.push({
            style: "background-color:#224b8f;"
          })
          mark--
        } else
        if (emos[i] === "../../images/lightRain.png") {
          emoDetails.push({
            style: "background-color:#224b8f;"
          })
          mark -= 2
        } else {
          console.log(emos[i])
        }
      }
      mark = mark / 28
      mark = Math.floor(mark * 100)
      cache.update('emoWeekDetails' + today, emoDetails)
      cache.update('emoWeekMark' + today, mark)
      cache.update('emoWeekCompare' + today, Math.max(0, Math.min(mark + this.data.data1, 100)))
    }
    //七天心情比重
    if (emoRate === undefined || emoRateText === undefined) {
      if (mark < 50) {
        emoRateText = '过去七天的坏心情比重为' + (100 - mark) + '%'
        emoRate = 100 - mark
      } else if (mark > 50) {
        emoRateText = '过去七天的好心情比重为' + mark + '%'
        emoRate = mark
      } else {
        if (d === 7) {
          emoRateText = '过去七天没有心情记录'
          emoRate = 0
        } else {
          emoRateText = '过去七天情绪较为平衡'
          emoRate = 50
        }
      }
      cache.update('emoWeekRate' + today, emoRate)
      cache.update('emoWeekRateText' + today, emoRateText)
    }
    //七天心情颜色
    if (emoGradient === undefined) {
      if (mark > 50) {
        emoGradient = {
          '0%': '#ffc20e',
          '100%': '#f15a22',
        }
      } else if (mark < 50) {
        emoGradient = {
          '0%': '#6950a1',
          '100%': '#181d4b',
        }
      } else {
        emoGradient = {
          '0%': '#a1a3a6',
          '100%': '#4f5555',
        }
      }
      cache.update('emoWeekGradient' + today, emoGradient)
    }

    /**
     * 跳转界面
     */
    wx.navigateTo({
      url: '../emoWeek/emoWeek',
    })

    d = 0;
    emoDetails = cache.get("emoMonthDetails" + today)
    emoGradient = cache.get("emoMonthGradient" + today)
    emoRate = cache.get("emoMonthRate" + today)
    emoRateText = cache.get("emoMonthRateText" + today)
    //过去一月的心情细节
    if (emoDetails === undefined) {
      let emos = emost
      mark = 60
      emoDetails = []
      for (var i = 0; i < 30; i++) {
        if (emos[i] === "") {
          d++;
          emoDetails.push({
            style: "background-color:#a1a3a6"
          })
          continue
        }
        if (emos[i] === "../../images/greatSun.png") {
          emoDetails.push({
            style: "background-color:#ed1941;"
          })
          mark += 2
        } else
        if (emos[i] === "../../images/sun.png") {
          emoDetails.push({
            style: "background-color:#ed1941;"
          })
          mark++
        } else
        if (emos[i] === "../../images/rain.png") {
          emoDetails.push({
            style: "background-color:#224b8f;"
          })
          mark--
        } else
        if (emos[i] === "../../images/lightRain.png") {
          emoDetails.push({
            style: "background-color:#224b8f;"
          })
          mark -= 2
        };
      }
      mark = mark / 120
      mark = Math.floor(mark * 100)
      cache.update('emoMonthDetails' + today, emoDetails)
      cache.update('emoMonthMark' + today, mark)
      cache.update('emoMonthCompare' + today, Math.max(0, Math.min(mark + this.data.data2, 100)))
    }
    //过去一月的心情比重
    if (emoRate === undefined || emoRateText === undefined) {
      if (mark < 50) {
        emoRateText = '过去一月的坏心情比重为' + (100 - mark) + '%'
        emoRate = 100 - mark
      } else if (mark > 50) {
        emoRateText = '过去一月的好心情比重为' + mark + '%'
        emoRate = mark
      } else {
        if (d === 30) {
          emoRateText = '过去一月没有心情记录'
          emoRate = 0
        } else {
          emoRateText = '过去一月情绪较为平衡'
          emoRate = 50
        }
        cache.update('emoMonthRate' + today, emoRate)
        cache.update('emoMonthRateText' + today, emoRateText)
      }
      this.setData({
        emoCompare: Math.max(0, Math.min(mark + this.data.data2, 100))
      })
    }
    //过去一月的心情颜色
    if (emoGradient === undefined) {
      if (mark > 50) {
        emoGradient = {
          '0%': '#ffc20e',
          '100%': '#f15a22',
        }
      } else if (mark < 50) {
        emoGradient = {
          '0%': '#6950a1',
          '100%': '#181d4b',
        }
      } else {
        emoGradient = {
          '0%': '#a1a3a6',
          '100%': '#4f5555',
        }
      }
      cache.update('emoMonthGradient' + today, emoGradient)
    }
  },

  defaultImg() {
    db.collection('image').where({
      _openid: getApp().globalData.openid
    }).update({
      data: {
        fileID: "../../images/d521199a448510bbbb2fec7182d68997-2.png"
      }
    }).then(res => {
      wx.showToast({
        title: '设置成功',
      })
    })
  },

  changeImg() {
    var that = this;
    //选择本地的图片
    wx.chooseImage({
      //count表示当前选择图片的个数
      count: 1,
      //当前是以原文件的形式上传还是以压缩的形式上传
      sizeType: ['original', 'compressed'],
      //当前文件的来源
      sourceType: ['album', 'camera'],
      //回调函数，获取到当前选择图片的临时路径
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        // tempFilePath就是当前选择图片的临时路径，可以通过该路径将图片上传到对应的云存储中
        // tempFilePaths是一个数组
        const tempFilePaths = res.tempFilePaths
        wx.cloud.uploadFile({
          cloudPath: new Date().getTime() + '.png',
          filePath: tempFilePaths[0], // 小程序临时文件路径
        }).then(res => {

          // 返回文件ID
          //console.log(res)
          //console.log(res.fileID)
          that.setData({
            imgSrc: res.fileID
          })
          //console.log(that.data.empty)
          if (that.data.empty) {
            db.collection('image').add({
              data: {
                fileID: res.fileID
              }
            }).then(res => {
              that.setData({
                empty: false
              })
              console.log(res)
              wx.showToast({
                title: '上传图片成功',
              })
            })
          }
          if (!that.data.empty) {
            db.collection('image').where({
              _openid: getApp().globalData.openid
            }).update({
              data: {
                fileID: res.fileID
              }
            }).then(res => {
              console.log(res)
              wx.showToast({
                title: '上传图片成功',
              })
            })
          }
        })
      }
    })
  },
  advice() {
    this.setData({
      show_advice: true
    })
  },
  advice_back() {
    this.setData({
      show_advice: false
    })
  },
  ran(a) {
    return Math.floor((Math.random() * a));
  },
})