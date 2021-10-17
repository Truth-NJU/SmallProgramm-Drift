const getFormatSTime = time => {
  return new Date().getTime();
}

//当前时间 秒
const getFormatTime = time => {
  return Date.parse(new Date());
}

//获取年份
const getFormatYear = year => {
  var date = new Date(getFormatTime());
  return date.getFullYear();
}
//获取月份
const getFormatMonth = year => {
  var date = new Date(getFormatTime());
  return (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
}
//获取日期
const getFormatDay = year => {
  var date = new Date(getFormatTime());
  return date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
}

export default {
  getFormatTime,
  getFormatYear,
  getFormatMonth,
  getFormatDay,
  getFormatSTime
}