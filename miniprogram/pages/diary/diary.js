import TimeUtil from "../../util/TimeUtil.js"
const db = wx.cloud.database()
const cache = getApp().globalData.cache
Page({

  /**
   * 页面的初始数据
   */
  data: {
    year: TimeUtil.getFormatYear(),
    month: TimeUtil.getFormatMonth(),
    day: TimeUtil.getFormatDay(),
    days: 0,
    /*season: 'spring/summer/autumn/winter',
    seasons: ['', 'winter', 'winter', 'spring', 'spring', 'spring', 'summer', 'summer', 'summer', 'autumn', 'autumn', 'autumn', 'winter'],*/
    title: "",
    daysInWeek: ["日", "一", "二", "三", "四", "五", "六"],
    daysInMonth: [29, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    daysOnShow: [],
    lastDay: -1,
    emotion: [''],
    popupContents: [],
    image: [],
    imageHeight: [],
    imageWidth: [],
    buttonNames: ["增加",
      "修改"
    ],
    buttonMode: 0,
    fixIndex: -1,
    bubles: [{
      "image": "../../images/sun.png",
    }, {
      "image": "",
      "text": "今",
      "style": "background-color:#2A97FF;color:#FFFFFF"
    }, {
      "image": "../../images/rain.png",
      "imgStyle":"position:relative;width:80%;height:80%;left:20%:"
    }, {
      "image": "../../images/greatSun.png",
    }, {
      "image": "../../images/lightRain.png",
    }]
  },

  /**
   * 点击buble设置今日心情
   * @param {*} e 
   */
  bubleClick: function (e) {
    if (e.detail.index === 1) {
      this.openDetail({
        "target": {
          "dataset": {
            "day": this.data.day
          }
        }
      })
    } else {
      /**
       * TODO 增加对用户的emotion数据库的修改
       * emotion数据结构
       * 用户第一次查询时，若表内无数据，则给它在emotion20XX表里创建一个这样的记录
       * emotion {
       *    _open_id:xxx,
       *    image:['','',''...]，共365/366个数据
       * }
       * 设置心情，即根据年份，查询相应的数据库，得到记录中的image数组，然后调整相应index的数据
       */
      var r = []
      db.collection('emotion' + this.data.year).where({
        _openid: getApp().globalData.openid
      }).get().then(res => {

        if (res.data.length === 0) {

          for (var i = 0; i < 366; i++) {
            r = r.concat('');
          }
          r[this.data.days] = this.data.bubles[e.detail.index].image;
          db.collection('emotion' + this.data.year).add({
            data: {
              image: r
            }
          })
        } else {
          r = res.data[0].image;
          r[this.data.days] = this.data.bubles[e.detail.index].image;
          db.collection('emotion' + this.data.year).where({
            _openid: getApp().globalData.openid
          }).update({
            data: {
              image: r
            }
          })
        }
      })

      this.data.emotion[this.data.day] = this.data.bubles[e.detail.index].image
      this.setData({
        emotion: this.data.emotion
      })

    }
  },

  /**
   * 处理手账的长按事件，
   * 将按钮改为"修改"，同时dairy.js变为修改模式
   * 下一次对手账记录的变更将变为修改
   * @param {*} e 
   */
  dealLongPress: function (e) {
    this.data.buttonMode = 1
    this.setPopupButton()
    this.popup.setText(this.data.popupContents[e.detail.index].text)
    this.data.fixIndex = e.detail.index
  },

  /**
   * 保存上一次移动的位置偏移量x
   * TODO 加入对dairy20XX数据库的修改
   * diary数据结构
   * 用户第一次查询时，若表内无数据，则给它在dairy20XX表里创建一个这样的记录
   * dairy {
   *    _open_id:xxx,
   *    contents:[['',''...],[],[]...]，共365/366个数据，contents里存放每一天的所有手账
   *    margins:['','',''...]，共365/366个数据，margins里存放每一天的所有手账的margins，此条数据一经过生成不再会修改
   *    left:['','',''...]，共365/366个数据，lefts里存放每一天的所有手账的位置偏移量
   * }
   * dairy
   * @param {*} e 
   */
  saveLeft: function (e) {
    for (let key in e.detail.lefts) {
      this.data.popupContents[key].left = e.detail.lefts[key]
    }
    this.setData({
      popupContents: this.data.popupContents
    })
    var t = 0;
    for (var i = 1; i < parseInt(this.data.month); i++) {
      t = t + this.data.daysInMonth[i];
    }
    t = t + this.data.lastDay - 1;
    this.updatediary(t);
  },

  updatediary: function (t) {
    var r = []
    db.collection('dairy' + this.data.year).where({
      _openid: getApp().globalData.openid
    }).get().then(res => {
      if (res.data.length === 0) {
        for (var i = 0; i < 366; i++) {
          r.push([]);
        }
        r[this.data.days] = this.data.popupContents;
        db.collection('dairy' + this.data.year).add({
          data: {
            shouzhang: r
          }
        })
      } else {
        r = res.data[0].shouzhang;
        r[t] = this.data.popupContents;
        db.collection('dairy' + this.data.year).where({
          _openid: getApp().globalData.openid
        }).update({
          data: {
            shouzhang: r
          }
        })
      }
    })
  },
  /**
   * 点击增加更新contents
   * TODO 加入对数据库dairy20XX的修改
   * buttonMode为0，为增加模式，在当日的手账记录后push新的内容
   * buttonMode为1，为修改模式，对当日的第'this.data.fixIndex'条数据进行修改
   */
  updateContents: function (e) {
    if (this.data.buttonMode === 0) {
      this.data.popupContents.push({
        "text": e.detail.text,
        "margin": Math.random() * 15 + '%'
      })
      this.setData({
        popupContents: this.data.popupContents
      })
      this.changeSize('add')
    } else if (this.data.buttonMode === 1) {
      this.data.buttonMode = 0
      this.setPopupButton()
      this.popup.setText('')
      this.data.popupContents[this.data.fixIndex].text = e.detail.text
      this.setData({
        popupContents: this.data.popupContents
      })
      this.changeSize('fix', this.data.fixIndex)
    }
    this.updatediary()
  },

  /**
   * 删除某条手账记录
   * TODO 加入对数据库dairy20XX的修改
   * 删除当日手账的第'e.detail.delIndex'条数据
   * @param {*} e
   */
  deleteContents: function (e) {
    //bug2->删除正在修改的手账，删除正在修改的手账之前的手账导致fixIndex错误
    if (e.detail.delIndex === this.data.fixIndex) {
      return
    } else if (e.detail.delIndex < this.data.fixIndex) {
      this.data.fixIndex--
    }
    this.data.popupContents.splice(e.detail.delIndex, 1)
    this.data.image.splice(e.detail.delIndex, 1)
    this.data.imageHeight.splice(e.detail.delIndex, 1)
    this.data.imageWidth.splice(e.detail.delIndex, 1)
    this.setData({
      popupContents: this.data.popupContents
    })
    //this.changeSize('delete')
    this.popup.deleteLeft(e.detail.delIndex)
    this.popup.changeSize(this.data.imageWidth, this.data.imageHeight, this.data.image)
    setTimeout(() => {
      this.popup.deleteReadyRecover()
    }, 1000)
    this.updatediary();
  },

  /**
   * 打开详情界面
   * @param {*} e 
   */
  openDetail: function (e) {
    /**
     * 获得日期，从后台拿到数据，填充popup
     * 根据日期，确定手掌数据是否可修改
     * TODO 增加对数据库dairy20XX的查询操作
     * 获取'e.target.dataset.day'的手账数据，填入this.data.popupContents
     */

    var t = 0;
    for (var i = 1; i < parseInt(this.data.month); i++) {
      t = t + this.data.daysInMonth[i];
    }
    t = t + e.target.dataset.day - 1;

    if (e.target.dataset.day === this.data.day) {
      this.setPopupButton()
    } else {
      this.popup.setButton([])
    }

    if (this.data.lastDay !== -1) {
      cache.update('popContent' + this.data.lastDay, this.data.popupContents)
    }
    if (cache.get('popContent' + t) !== undefined) {
      this.setData({
        popupContents: cache.get('popContent' + t)
      })
      //打开手账详情界面
      this.popup.changeRange();
      /**
       * 每日第一次打开详情界面，根据手账文字多少渲染气泡大小
       */
      if (this.data.lastDay !== e.target.dataset.day) {
        this.data.lastDay = e.target.dataset.day;
        this.changeSize('search')
      }
    } else {
      db.collection('dairy' + this.data.year).where({
        _openid: getApp().globalData.openid
      }).get().then(res => {
        //console.log('查询')
        var r = []
        if (res.data.length === 0) {
          for (var i = 0; i < 366; i++) {
            r.push([]);
          }
          db.collection('dairy' + this.data.year).add({
            data: {
              shouzhang: r
            }
          })
          this.setData({
            popupContents:[]
          })
        } else {
          //console.log(res)
          this.setData({
            popupContents: res.data[0].shouzhang[t]
          })
        }
        cache.update('popContent' + t, this.data.popupContents)

        //打开手账详情界面
        this.popup.changeRange();
        /**
         * 每日第一次打开详情界面，根据手账文字多少渲染气泡大小
         */
        if (this.data.lastDay !== e.target.dataset.day) {
          this.data.lastDay = e.target.dataset.day;
          this.changeSize('search')
        }
      })
    }
  },

  /**
   * 修改popup中button的属性
   */
  setPopupButton: function () {
    this.popup.setButton([{
      "id": "button1",
      "name": this.data.buttonNames[this.data.buttonMode]
    }])
  },

  /**
   * 根据不同模式，采用不同的策略动态修改气泡大小
   * @param {*} options 模式
   * @param {*} index 修改模式，修改对象的index
   */
  changeSize: function (options, index) {
    let imageWidth = []
    let imageHeight = []
    let image = []
    let dtime = 250
    setTimeout(() => {
      if (options === 'search') {
        for (let i = 0; i < this.data.popupContents.length; i++) {
          let query = wx.createSelectorQuery().in(this.popup)
          query.select('#text' + i).boundingClientRect()
          query.exec(function (res) {
            imageWidth.push((parseFloat(res[0].width) + 30) + 'px')
            imageHeight.push((parseFloat(res[0].height) + 5) + 'px')
            image.push('../../images/dialog' + Math.ceil(Math.random() * 4) + '.png')
          })
        }
        this.data.image = image
        this.data.imageHeight = imageHeight
        this.data.imageWidth = imageWidth
      } else if (options === 'add') {
        imageWidth = this.data.imageWidth
        imageHeight = this.data.imageHeight
        image = this.data.image
        let query = wx.createSelectorQuery().in(this.popup)
        query.select('#text' + (this.data.popupContents.length - 1)).boundingClientRect()
        query.exec(function (res) {
          imageWidth.push((parseFloat(res[0].width) + 30) + 'px')
          imageHeight.push((parseFloat(res[0].height) + 5) + 'px')
          image.push('../../images/dialog' + Math.ceil(Math.random() * 4) + '.png')
        })
      } else if (options === 'fix') {
        imageWidth = this.data.imageWidth
        imageHeight = this.data.imageHeight
        image = this.data.image
        let query = wx.createSelectorQuery().in(this.popup)
        query.select('#text' + index).boundingClientRect()
        query.exec(function (res) {
          imageWidth[index] = (parseFloat(res[0].width) + 30) + 'px'
          imageHeight[index] = (parseFloat(res[0].height) + 5) + 'px'
        })
      }
    }, dtime)
    setTimeout(() => {
      this.popup.changeSize(imageWidth, imageHeight, image)
    }, dtime + 50)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /**
     * 初始化title
     */
    this.setData({
      title: this.data.year + "年" + this.data.month + "月"
    })
    /**
     * 根据当前毫秒数，2021.1.1 周五 算出本月一日 到 2021.1.1 之间一共有多少天
     * 再依此算出本月一日为周几
     * 初始化出daysOnShow
     * daysOnShow包含{
     *  day:  今天是几号,
     *  isEnable: 决定这个日期能否被点击
     * }
     */
    let daysThisMonth = 0
    let daysFromStart = Math.floor(((TimeUtil.getFormatTime()) / 1000 / 3600 + 8) / 24 - 18627 - this.data.day)
    let daysOnShow = []
    const month = this.data.month
    const daysInMonth = this.data.daysInMonth
    //设置季节
    /*this.setData({
      season: this.data.seasons[parseInt(month)]
    })*/
    /** 
     * 确定daysInMonth
     * 如果是闰年修改daysInMonth 
     */
    if (month !== 2 || this.data.year % 4 !== 0 || this.data.year % 400 === 0) {
      daysThisMonth = daysInMonth[parseInt(month)]
    } else {
      daysThisMonth = 29
      this.data.daysInMonth[2] = 29
    }

    for (let i = 0; i < (daysFromStart % 7 + 5) % 7; i++) {
      daysOnShow.push({
        "day": ' ',
        "isEnable": false
      })
    }
    for (let i = 1; i <= daysThisMonth; i++) {
      daysOnShow.push({
        "day": i,
        "isEnable": true
      })
    }
    while (daysOnShow.length % 7 !== 0) {
      daysOnShow.push({
        "day": ' ',
        "isEnable": false
      })
    }

    /**
     * 修改days
     */
    for (let i = 1; i < parseInt(this.data.month); i++) {
      this.data.days += this.data.daysInMonth[i]
    }
    this.data.days += (this.data.day - 1)
    /**
     * 初始化daysOnShow
     */
    this.setData({
      daysOnShow: daysOnShow
    })
    /**
     * 初始化emotion
     * 增加对数据emotion20XX的查询
     * 将本月的所有emotion数据填入this.data.emotion
     */
    db.collection('emotion' + this.data.year).where({
      _openid: getApp().globalData.openid
    }).get().then(res => {
      if (res.data.length!=0){
      var r = res.data[0].image;
      var min = 0;
      var max = 0;
      for (var i = 1; i < parseInt(this.data.month); i++) {
        min = min + daysInMonth[i];
      }
      max = min + this.data.daysInMonth[parseInt(this.data.month)] - 1;
      for (var i = min; i <= max; i++) {
        this.data.emotion.push(r[i]);
      }
      this.setData({
        emotion: this.data.emotion
      })}else{
        var temp=[]
        for (var i=1;i<=this.data.daysInMonth[parseInt(this.data.month)];i++){
          temp.push("")
        }
        this.setData({
          emotion:temp
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.popup = this.selectComponent("#popup");
    this.buble = this.selectComponent("#buble")
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