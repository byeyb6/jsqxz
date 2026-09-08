import text from './state-text';

/**
 * 根据lua状态列表字符串修改状态
 * @returns
 */
export function formatState() {
  let str = text.replace(/--.*/g, '');
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
  return rst;
}

const stateMap = formatState();

export default stateMap;