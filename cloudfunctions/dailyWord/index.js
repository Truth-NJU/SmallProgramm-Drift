// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const axios = require('axios')

// 云函数入口函数
exports.main = async (event, context) => {
  // 云函数中引入axios，并在调用电影列表API时，增加headers对应参数（该参数一定要加，否则API会调用失败）
  try {
    const {
    data
    } = await axios({
        url: `http://sentence.iciba.com/index.php?c=dailysentence&m=getdetail&title=${event.time}`,
        method: 'GET'
    })
    console.log(data)
        return data
    } catch (e) {
    console.log(e)
    }
}