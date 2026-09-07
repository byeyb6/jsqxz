import talentAll from '@/v107/data/chr/talent';
import talentStr from './talent';
import stateStr from './state';

/**
 * 根据lua天赋列表字符串修改天赋列表, 已有的天赋效果和福缘不会被修改, 需单独修改
 * @returns
 */
export function formatTalent() {
  let str = talentStr.replace(/--.*/g, '');
  // 表1天赋名称，表2天赋说明，表3 1非专属 2为专属，表4为1是非门天赋为2是门派天赋，表5为天赋等级(1蓝2紫3金4红)
  str = str.replace(/CC\.PTFSM\[(\d+?)] ?= ?\{([^,]+), ?([^,]+), ?([^,]+), ?[^,]*, ?([^,]+), ?([^,]+)}/gi, '$1,$2,$3,$4,$5,$6');

  const list = str.split('\n');
  const rst = {};
  for (let item of list) {
    if (!item) {
      continue;
    }
    const info = item.split(/, */);
    if (info.length < 4) {
      continue;
    }
    let [id, name, effect, type, level, score] = info;
    rst[id] = {
      name: name.replace(/["' ]/g, ''),
      effect: effect.replace(/["' ]/g, ''),
      level: Number(level),
      score: Number(score),
      type: Number(type),
    };
  }
  for (let id in rst) {
    const item = talentAll[id];
    if (item) {
      item.name = rst[id].name;
      item.level = rst[id].level;
      item.score = rst[id].score;
      item.type = rst[id].type;
      continue;
    }
    talentAll[id] = {
      id: Number(id),
      name: rst[id].name,
      effect: [rst[id].effect],
      fortune: [],
      level: rst[id].level,
      score: rst[id].score,
      type: rst[id].type,
    };
  }
  console.log(talentAll);
}

/**
 * 根据lua状态列表字符串修改状态
 * @returns
 */
export function formatState() {
  let str = stateStr.replace(/--.*/g, '');
  str = str.replace(/["' ]/g, '');
  str = str.replace(/\{([^,]+),([^,]+),([^,]+),[^,]*,[^,]*,([^,]+)}/g, '$1,$2,$3,$4');
  str = str.replace(/CC\.ZTSM\[(\d+?)] ?=/gi, '$1,');
  const list = str.split('\n');
  const rst = {};
  for (let item of list) {
    if (!item) {
      continue;
    }
    const info = item.split(/, */);
    if (info.length < 5) {
      continue;
    }
    let [id, name, effect, type, shortName] = info;
    rst[id] = {id: Number(id), name, effect: [effect], type: Number(type), shortName};
  }
  console.log(Object.values(rst));
}

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
