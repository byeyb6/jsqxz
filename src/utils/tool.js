/**
 * 将 date 转化为指定格式的String
 * 月(M)、周(w)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 * formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss.S') ==> 2006-07-02 08:09:04.423
 * formatDate(new Date(), 'yyyy-M-d h:m:s.S')      ==> 2006-7-2 8:9:4.18
 * @param date
 * @param fmt
 * @returns String
 */
export function formatDate(date, fmt = 'yyyy-MM-dd hh:mm:ss') {
  if (Object.prototype.toString.call(date) !== '[object Date]') {
    date = new Date(date);
  }
  if (isNaN(date.getTime())) {
    date = new Date();
  }
  let obj = {
    'y+': date.getFullYear(), //年
    'M+': date.getMonth() + 1, //月份
    'd+': date.getDate(), //日
    'h+': date.getHours(), //小时
    'm+': date.getMinutes(), //分
    's+': date.getSeconds(), //秒
    'q+': Math.floor((date.getMonth() + 3) / 3), //季度
    S: date.getMilliseconds(), //毫秒
  };
  if (/w+/.test(fmt)) {
    const firstDate = new Date(obj['y+'], 0, 1);
    let firstDayWeek = firstDate.getDay() + 1;
    const firstWeekMs = (7 - firstDayWeek) * 24 * 60 * 60 * 1000;
    const ms = date.getTime() - firstDate.getTime() - firstWeekMs;
    obj['w+'] = Math.floor(ms / 604800000) + 2;
  }
  for (let k in obj) {
    const rst = new RegExp(k).exec(fmt);
    if (!rst) {
      continue;
    }
    if (k === 'S') {
      fmt = fmt.replace('S', obj.S + '');
    } else {
      const str = (obj[k] + '').padStart(4, '0');
      fmt = fmt.replace(rst[0], str.substring(4 - rst[0].length, 4));
    }
  }
  return fmt;
}

/**
 * 类型判断
 * @param val
 * @returns {string}
 */
export function typeOf(val) {
  return Object.prototype.toString.call(val).replace(/.* (.*)]/, '$1').toLowerCase();
}