import text from './talent-text';
import effectMap from './effect';
import talentAll from '../talent';

/**
 * lua天赋格式化
 * @returns
 */
export function formatTalent() {
  let str = text.replace(/--.*/g, '');
  // 表1天赋名称，表2天赋说明，表3 1非专属 2为专属，表4为1是非门天赋为2是门派天赋，表5为天赋等级(1蓝2紫3金4红)
  str = str.replace(/CC\.PTFSM\[(\d+?)] ?= ?\{([^,]+), ?[^,]*, ?([^,]+), ?[^,]*, ?([^,]+), ?([^,]+), ?\{(.+?)}(, ?.*)?}/gi, '$1@$2@$3@$4@$5@$6');
  const list = str.split('\n');
  const rst = {};
  for (let item of list) {
    if (!item) {
      continue;
    }
    const info = item.split(/@/);
    if (info.length < 4) {
      continue;
    }
    let [id, name, type, level, score, effectIds] = info;
    if (type === '5') {
      console.log(info);
    }
    effectIds = effectIds.replace(/\s/g, '');
    const effect = effectIds.split(',').map(id => effectMap[id]);
    const fortune = talentAll[id] ? talentAll[id].fortune : [];
    rst[id] = {
      name: name.replace(/["' ]/g, ''),
      effect,
      fortune,
      level: Number(level),
      score: Number(score),
      type: Number(type),
    };
  }
  return rst;
}

const talentMap = formatTalent();

export default talentMap;