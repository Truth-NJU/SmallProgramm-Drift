const cloud = require('wx-server-sdk')

cloud.init({
  env: 'cloud1-9gych8ln2673033b'
})
 
exports.main = async (event, context) => {
  const { content } = event;
  try {
    const res = await cloud.openapi.security.msgSecCheck({
      content: event.content
    })
    return res;
  } catch (err) {
    return err;
  }
}