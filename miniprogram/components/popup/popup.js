import TimeUtil from '../../util/TimeUtil'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: ''
    },
    contents: {
      type: Object,
      value: [{
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
      }]
    },
    buttons: {
      type: Object,
      value: [{
        "id": "button1",
        "name": "增加"
      }]
    },
    popupBackground: {
      type: String,
      value: '../../images/spring.jfif'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    //弹窗显示控制 
    showModalStatus: false,
    lineJust: ["flex-start", "flex-end"],
    lineMargin: ["margin-left:", "margin-right"],
    imageWidth: [],
    imageHeight: [],
    image: [],
    buttonIsNull: false,
    buttons: [],
    //fieldStyle: 'background-color: #EAEDF4;padding:0;position:absolute;bottom:0;height:100%;',
    line: -1,
    text: '',
    leftHeight: 10,
    scrollHeight: 37,
    fieldMaxHeight: true,
    deleteReady: true,
    deletePreReady: false,
    preReadyStartTime: 0,
    lineHeight: -1,
    maxLine: -1,
    lineHeightVH: -1,
    templeft: {}
  },
  /**
   * 组件的方法列表
   */
  methods: {

    deleteReadyRecover: function () {
      this.setData({
        deleteReady: true
      })
    },

    /*getFinalLeft: function () {
      if (this.data.templeft !== undefined) {
        this.triggerEvent("getLeft", this.data.templeft)
        this.data.templeft = undefined
      }
    },*/

    longPress: function (e) {
      const detail = {
        "index": e.currentTarget.dataset.index
      }
      this.triggerEvent('longPress', detail)
    },

    /*test: function (e) {
      console.log(e)
    },*/

    itemMove: function (e) {

      //记录偏移量
      this.data.templeft[e.currentTarget.dataset.index] = e.detail.x
      //是当天！
      if (!this.data.buttonIsNull) {
        //如果检测到出框，且已经readyToDelete那么preReady
        if (e.detail.source === 'touch-out-of-bounds' && this.data.deleteReady && !this.data.deletePreReady) {
          this.data.deletePreReady = true
          this.data.preReadyStartTime = TimeUtil.getFormatSTime()
        }
        //如果检测到出框，且已经readyToDelete且preReady，那么检测是否preReady足够长的时间
        else if (e.detail.source === 'touch-out-of-bounds' && this.data.deleteReady && this.data.deletePreReady) {
          //preReady时间超过1s,触发delete方法
          //console.log(TimeUtil.getFormatSTime() - this.data.preReadyStartTime)
          if (TimeUtil.getFormatSTime() - this.data.preReadyStartTime >= 1500) {
            wx.vibrateShort()
            this.data.deletePreReady = false
            this.setData({
              deleteReady: false
            })
            const detail = {
              "delIndex": e.currentTarget.dataset.index
            }
            this.triggerEvent('deleteItem', detail)
          }
        }
        //如果已经回框或正在返回，或者已经触发了delete，那么preReady置为false
        else {
          this.data.deletePreReady = false
        }
      }
    },

    /**
     * 按钮触发方法
     */
    onButton: function () {
      if (this.data.text === '')
        return
      const detail = {
        "text": this.data.text
      }
      this.setData({
        text: ''
      })
      this.triggerEvent('onButton', detail)
    },

    /**
     * 检测到换行
     * @param {*} e 
     */
    linechange: function (e) {
      if (this.data.line === -1) {
        this.data.line = e.detail.lineCount
        this.data.lineHeight = Math.floor(e.detail.height)
        this.data.maxLine = this.data.line + 4
        this.data.lineHeightVH = 100 * this.data.lineHeight / wx.getSystemInfoSync().windowHeight
        this.setData({
          fieldMaxHeight: {
            maxHeight: 5 * this.data.lineHeight
          }
        })
        return
      }

      if (e.detail.lineCount > this.data.maxLine) {
        this.setData({
          leftHeight: 10 + this.data.lineHeightVH * 4,
          scrollHeight: 37 - this.data.lineHeightVH * 4,
        })
        this.data.line = this.data.maxLine
        return
      }

      if (e.detail.lineCount > this.data.line) {
        this.setData({
          leftHeight: this.data.leftHeight + this.data.lineHeightVH * (e.detail.lineCount - this.data.line),
          scrollHeight: this.data.scrollHeight - this.data.lineHeightVH * (e.detail.lineCount - this.data.line),
        })
      } else if (e.detail.lineCount < this.data.line) {
        this.setData({
          leftHeight: this.data.leftHeight - this.data.lineHeightVH * (this.data.line - e.detail.lineCount),
          scrollHeight: this.data.scrollHeight + this.data.lineHeightVH * (this.data.line - e.detail.lineCount),
        })
      }
      this.data.line = e.detail.lineCount
    },

    //改变气泡大小
    changeSize: function (w, h, i) {
      this.setData({
        imageWidth: w,
        imageHeight: h,
        image: i
      })
    },

    //设置button
    setButton: function (buttons) {
      if (buttons.length === 0) {
        this.setData({
          buttonIsNull: true
        })
      } else {
        this.setData({
          buttons: buttons,
          buttonIsNull: false
        })
      }
    },

    //bug1->删除手账时导致保存的templeft的index错误
    deleteLeft: function (index) {
      delete this.data.templeft[index]
      let tempLeft = {}
      for (let key in this.data.templeft) {
        if (key > index) {
          tempLeft[key - 1] = this.data.templeft[key]
          delete this.data.templeft[key]
        }
      }
      for (let key in tempLeft) {
        this.data.templeft[key] = tempLeft[key]
      }
    },

    //设置textarea value
    setText: function (text) {
      this.setData({
        text: text
      })
    },

    //点击显示底部弹出
    changeRange: function () {
      this.showModal();
    },

    //底部弹出框
    showModal: function () {
      // 背景遮罩层
      var animation = wx.createAnimation({
        duration: 200,
        timingFunction: "linear",
        delay: 0
      })
      //this.animation = animation
      animation.translateY(300).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: true
      })
      setTimeout(function () {
        animation.translateY(0).step()
        this.setData({
          animationData: animation.export()
        })
      }.bind(this), 200)
    },

    //点击背景面任意一处时，弹出框隐藏
    hideModal: function () {
      //弹出框消失动画
      var animation = wx.createAnimation({
        duration: 200,
        timingFunction: "linear",
        delay: 0
      })
      //this.animation = animation
      animation.translateY(300).step()
      this.setData({
        animationData: animation.export(),
      })
      setTimeout(function () {
        animation.translateY(0).step()
        this.setData({
          animationData: animation.export(),
          showModalStatus: false
        })
      }.bind(this), 200)
      const detail = {
        "lefts": this.data.templeft,
      }
      //console.log(detail)
      this.triggerEvent('getLeft', detail)
      this.data.templeft = {}
    }
  },
  observers: {
    /*"imageWidth": function () {
      this.changeSize()
    }*/
  }
})