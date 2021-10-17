import TimeUtil from '../../util/TimeUtil'
import Cache from '../../util/cache'
const cache = Cache.cache
Page({

  /**
   * 页面的初始数据
   */
  data: {
    emoCompare: '',
    emoRate: -1,
    emoRateText: '',
    emoGradient: {
      '0%': '#ffd01e',
      '100%': '#ee0a24',
    },
    tips: [],
    emoTips: [111, 222],
    emoDetails: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let today = TimeUtil.getFormatDay()
    let tips = cache.get("Tips")
    this.data.tips = tips
    let mark = cache.get("emoWeekMark" + today)
    this.setData({
      emoDetails: cache.get("emoWeekDetails" + today),
      emoGradient: cache.get("emoWeekGradient" + today),
      emoRate: cache.get("emoWeekRate" + today),
      emoRateText: cache.get("emoWeekRateText" + today),
      emoCompare: cache.get("emoWeekCompare" + today)
    })
    let emoTips = []
    for (var i = 0; i < tips.length; i++) {
      if (mark >= tips[i].down && mark <= tips[i].up) {
        emoTips.push({
          text: tips[i].content
        })
      }
    }
    while (emoTips.length > 2) {
      emoTips.splice(Math.floor(Math.random() * emoTips.length), 1)
    }
    this.setData({
      emoTips: emoTips
    })
  },

  tabChange: function (e) {
    let today = TimeUtil.getFormatDay()
    let mark = -1
    if (e.detail.index === 0) {
      mark = cache.get("emoWeekMark" + today)
      this.setData({
        emoDetails: cache.get("emoWeekDetails" + today),
        emoGradient: cache.get("emoWeekGradient" + today),
        emoRate: cache.get("emoWeekRate" + today),
        emoRateText: cache.get("emoWeekRateText" + today),
        emoCompare: cache.get("emoWeekCompare" + today)
      })
    } else if (e.detail.index === 1) {
      mark = cache.get("emoMonthMark" + today)
      this.setData({
        emoDetails: cache.get("emoMonthDetails" + today),
        emoGradient: cache.get("emoMonthGradient" + today),
        emoRate: cache.get("emoMonthRate" + today),
        emoRateText: cache.get("emoMonthRateText" + today),
        emoCompare: cache.get("emoMonthCompare" + today)
      })
    }
    let emoTips = []
    let tips = this.data.tips
    for (var i = 0; i < tips.length; i++) {
      if (mark >= tips[i].down && mark <= tips[i].up) {
        emoTips.push({
          text: tips[i].content
        })
      }
    }
    while (emoTips.length > 2) {
      emoTips.splice(Math.floor(Math.random() * emoTips.length), 1)
    }
    this.setData({
      emoTips: emoTips
    })
  },
  emoPage_close: function () {
    wx.navigateBack()
  }
})