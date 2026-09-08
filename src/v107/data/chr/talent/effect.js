import text from './effect-text';

/**
 * lua词条格式化
 * @returns
 */
export function formatEffect() {
  let str = text.replace(/--.*/g, '');
  // 表1天赋名称，表2天赋说明，表3 1非专属 2为专属，表4为1是非门天赋为2是门派天赋，表5为天赋等级(1蓝2紫3金4红)
  str = str.replace(/\[(\d+?)] ?= ?\{([^,]+), ?[^,]*, ?([^,]+), ?([^,]+)}/gi, '$1,$2,$3,$4');

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
    let [id, level, score, effect] = info;
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
