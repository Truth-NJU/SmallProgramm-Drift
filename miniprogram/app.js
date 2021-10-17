//app.js
import EventBus from 'util/EventBus.js'
import Cache from 'util/cache.js'

App({
  globalData: {
    openid: "",
    loginOrNot:0,
    //0为普通用户 1为管理员
    identity: 0,
    randomDrifterIndex: 0,
    orientingDrifterIndex: 0,
    bus: EventBus.eventBus,
    cache: Cache.cache,
    nickName:''
  },
  onLaunch: async function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        env: 'cloud1-9gych8ln2673033b',
        traceUser: true,
      })
    }
    var that=this
    var tzh= wx.showModal({
      title: '温馨提示',
      content: '正在请求您的个人信息',
      success(res) {
        if (res.confirm) {
          wx.getUserProfile({
          desc: "获取你的昵称、头像、地区及性别",
          success: res => {
            console.log(res)
            let wxUserInfo = res.userInfo;
            that.globalData.nickName=res.userInfo.nickName
            that.globalData.loginOrNot=1
          },
          fail: res => {
             wx.showToast({
               title: '您拒绝了请求',
               icon:'error'
             })
             that.globalData.loginOrNot=0
            return;
          }
        })} else if (res.cancel) {
          wx.showToast({
            title: '您拒绝了请求',
            icon:'error'
          })
          that.globalData.loginOrNot=0
          return;
        }
      }
   
    })

    const database = wx.cloud.database()
    var id;
    var b = wx.cloud.callFunction({
        name: 'login',
      })
      .then(
        res => {
          id = res.result.openid
        }
      )
    await b
    var user = database.collection('user')
    user.where({
        _openid: id
      }).get()
      .then(res => {
        if (res.data.length === 0) {
          user.add({
            data: {
              identity: 0,
              like_num: 0,
              reply_num: 0
            }
          })
          this.globalData.openid = id
        } else {
          this.globalData.openid =res.data[0]._openid;
          this.globalData.identity= res.data[0].identity;
          }
        })
        database.collection('randomDrifter').get().then(res => {
          this.globalData.randomDrifterIndex = res.data.length;
        })
        database.collection('orientingDrifter').get().then(res => {
         this.globalData.orientingDrifterIndex = res.data.length;
        })
      }
  })