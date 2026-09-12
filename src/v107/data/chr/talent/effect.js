import text from './effect-text';

/**
 * lua词条格式化
 * @returns
 */
export function formatEffect() {
  let str = text.replace(/--.*/g, '');
  // 表1为等级 表2为类型 表3为战力 表4为说明
  str = str.replace(/\[(\d+?)] ?= ?\{([^,]+),([^,]+),([^,]+),([^,]+)}/gi, '$1,$2,$3,$4,$5');

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
    let [id, level, type, score, effect] = info;
    rst[id] = {
      id: Number(id),
      desc: effect.replace(/["' ]/g, ''),
      level: Number(level),
      // score: Number(score),
    };
  }
  return rst;
}

const effectMap = formatEffect();

export default effectMap;
