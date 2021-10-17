// components/buble/buble.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    bubles: {
      type: Object,
      value: {
        image: ''
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    animation: [],
    flag: false,
    jia:true,
    rotate:''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    bubleClick: function (e) {
      const detail = {
        "index": e.currentTarget.dataset.index
      }
      this.triggerEvent('bubleClick', detail)
      this.back()
    },

    jia(){
      this.setData({
        jia:!this.data.jia,
      })
    },
    
    go: function () {
      if (this.data.flag === false) {
        this.out()
      } else {
        this.back()
      }
    },

    out: function () {
      var animation=wx.createAnimation({
        delay: 0,
        duration: 200
      })
      animation.rotate(-45).step()
      this.data.animation = []
      var animation1 = wx.createAnimation({
        delay: 0,
        duration: 200
      })
      animation1.top(0).left("40rpx").step();

      var animation2 = wx.createAnimation({
        delay: 0,
        duration: 200
      })
      animation2.top("80rpx").left(0).step()

      var animation3 = wx.createAnimation({
        delay: 0,
        duration: 200
      })
      animation3.top("160rpx").left("40rpx").step();

      var animation4 = wx.createAnimation({
        delay: 0,
        duration: 200
      })
      animation4.top("-40rpx").left("120rpx").step()

      var animation5 = wx.createAnimation({
        delay: 0,
        duration: 200
      })

      animation5.top("200rpx").left("120rpx").step()

      this.data.animation.push(animation1)
      this.data.animation.push(animation2)
      this.data.animation.push(animation3)
      this.data.animation.push(animation4)
      this.data.animation.push(animation5)

      this.setData({
        animation: this.data.animation,
        flag: true,
        rotate:animation.export()
      })
    },

    back: function () {
      var animation=wx.createAnimation({
        delay: 0,
        duration: 200
      })
      animation.rotate(0).step()
      this.data.animation = []
      var animation1 = wx.createAnimation({
        delay: 0,
        duration: 200
      })
      animation1.top("80rpx").left("120rpx").step();

      var animation2 = wx.createAnimation({
        delay: 0,
        duration: 200
      })
      animation2.top("80rpx").left("120rpx").step();

      var animation3 = wx.createAnimation({
        delay: 0,
        duration: 200
      })
      animation3.top("80rpx").left("120rpx").step();

      var animation4 = wx.createAnimation({
        delay: 0,
        duration: 200
      })
      animation4.top("80rpx").left("120rpx").step();

      var animation5 = wx.createAnimation({
        delay: 0,
        duration: 200
      })
      animation5.top("80rpx").left("120rpx").step();

      this.data.animation.push(animation1)
      this.data.animation.push(animation2)
      this.data.animation.push(animation3)
      this.data.animation.push(animation4)
      this.data.animation.push(animation5)


      this.setData({
        animation: this.data.animation,
        flag: false,
        rotate: animation.export()
      })
    }
  }
})