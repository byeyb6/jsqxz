import {computed, ref, useTemplateRef} from 'vue';
import {artCheatMap, knwSecret} from '@/v107/data/art/map';
import secretData from '@/v107/data/art/secret';
import itmAll from '@/v107/data/itm/list';
import {getAttr} from '@/v107/data/art/effect/attr';
import {acupointMap, meridianMap} from '@/v107/data/other/meridian';

export function useTal() {
  const dialogTalRef = useTemplateRef('dialogTalRef');
  const talRef = useTemplateRef('talRef');
  const talList = ref([]);

  // 打开选择天赋
  function openTal() {
    dialogTalRef.value.show();
    if (talRef.value) {
      talRef.value.init();
    }
  }

  // 关闭选择天赋
  function closeTal() {
    dialogTalRef.value.close();
  }

  // 选择天赋
  function chooseTal() {
    const ids = talRef.value.getTalent();
    talList.value = [...ids];
    closeTal();
  }

  // 删除天赋
  function delTal(index) {
    talList.value.splice(index, 1);
  }

  // 初始化天赋
  function initTal() {
    talList.value = [];
  }

  // 获取tag标签颜色
  function getTalTagStyle(level) {
    let color = 'var(--el-color-primary)';
    if (level > 0 && level < 5) {
      color = `var(--color-level-${level})`;
    } else {
      color = `var(--color-level-5)`;
    }
    return {'--el-tag-text-color': color};
  }

  return {
    dialogTalRef,
    talRef,
    talList,
    openTal,
    closeTal,
    chooseTal,
    delTal,
    initTal,
    getTalTagStyle,
  };
}

export function useArt() {
  const dialogArtRef = useTemplateRef('dialogArtRef');
  const artRef = useTemplateRef('artRef');
  const artId = ref(-1);
  const artList = ref([]);
  const artIndex = ref({row: -1, col: -1});
  const artAttr = ref({});

  // 初始化
  function initArt() {
    artList.value = [];
    artAttr.value = {
      atk: 0,
      def: 0,
      spd: 0,
      una: 0,
      fin: 0,
      swd: 0,
      bld: 0,
      spc: 0,
    };
    for (let i = 1; i < 16; i++) {
      artList.value.push([{id: -1}]);
    }
  }

  // 打开选择武功
  function openArt(row, col) {
    artIndex.value = {row, col};
    artId.value = artList.value[row][col]?.id ?? -1;
    dialogArtRef.value.show();
    if (artRef.value) {
      artRef.value.clear();
    }
  }

  // 关闭选择武功
  function closeArt() {
    dialogArtRef.value.close();
    artId.value = -1;
  }

  // 选择武功
  function chooseArt() {
    const art = artRef.value.getArt();
    const {row, col} = artIndex.value;
    const oldArt = artList.value[row][col];
    let {
      id,
      inner,
      level,
      name,
      addition,
      sect,
      type,
    } = art;
    addition = getAttr({
      inner,
      level,
      other: addition,
      type,
    });
    const newArt = {
      id,
      inner,
      level,
      name,
      sect,
      type,
      addition,
    };
    artList.value[row][col] = newArt;
    getSecret();
    closeArt();
    calcArtAttr(newArt, oldArt);
  }

  // 添加一脉
  function addArt(row) {
    artList.value[row].push({id: -1});
  }

  // 删除一脉
  function delArt(row, col) {
    const oldArt = artList.value[row][col];
    artList.value[row].splice(col, 1);
    calcArtAttr(undefined, oldArt);
  }

  // 计算武功增减属性
  function calcArtAttr(newArt, oldArt) {
    // 增加新属性
    if (newArt && newArt.id > 0) {
      const {addition} = newArt;
      for (let key in addition) {
        if (typeof artAttr.value[key] !== 'number') {
          artAttr.value[key] = 0;
        }
        artAttr.value[key] += addition[key] * 10;
      }
    }
    // 扣除旧属性
    if (oldArt && oldArt.id > 0) {
      const {addition} = oldArt;
      for (let key in addition) {
        if (typeof artAttr.value[key] !== 'number') {
          artAttr.value[key] = 0;
        }
        artAttr.value[key] -= addition[key] * 10;
      }
    }
  }

  // 杂学
  const knwAll = computed(() => {
    const obj = {};
    for (let id in knwSecret) {
      const item = itmAll[id];
      obj[id] = {
        id,
        name: item.name,
        checked: false,
      };
    }
    return obj;
  });

  // 杂学秘技
  const knwSecretList = ref([]);

  // 选择杂学
  function chooseKnw(id) {
    const secret = knwSecret[id];
    if (!secret) {
      return;
    }
    if (knwAll.value[id].checked) {
      const artLength = secretList.value.length;
      if (artLength + knwSecretList.value.length < 10) {
        knwSecretList.value.push(secret);
      }
    } else {
      const index = knwSecretList.value.findIndex(i => i.id === knwSecret[id].id);
      if (index > -1) {
        knwSecretList.value.splice(index, 1);
      }
    }
  }

  // 秘技列表
  const secretList = ref([]);

  function getSecret() {
    const artIds = {};
    for (let item of artList.value) {
      for (let art of item) {
        if (art.id > 0) {
          artIds[artCheatMap[art.id]] = true;
        }
      }
    }
    const knwLength = knwSecretList.value.length;
    secretList.value = [];
    for (let key in secretData) {
      if (secretList.value.length + knwLength > 9) {
        break;
      }
      let {id, name, type, condition, effect, cheat} = secretData[key];
      if (type !== 1 || typeof condition === 'string') {
        continue;
      }
      let flag = false;
      for (let k in cheat) {
        if (k === 'other') {
          continue;
        }
        // 武功
        if (!artIds[k]) {
          const isArrCheat = Array.isArray(cheat[k]);
          if (isArrCheat) {
            for (let i of cheat[k]) {
              if (artIds[i]) {
                flag = false;
                break;
              }
            }
          } else {
            flag = true;
          }
          if (flag) {
            break;
          }
        }
      }
      if (flag) {
        continue;
      }
      const arr = [];
      let other = '';
      for (let k in cheat) {
        if (k === 'other') {
          other = cheat[k];
          continue;
        }
        const isArrCheat = Array.isArray(cheat[k]);
        arr.push({
          ...itmAll[k],
          isCheat: true,
          symbol: '+',
        });
        if (isArrCheat) {
          for (let j of cheat[k]) {
            arr.push({
              ...itmAll[j],
              isCheat: true,
              symbol: '/',
            });
          }
        }
      }
      if (other && arr.length > 0) {
        other = `，${other}`;
      }
      secretList.value.push({
        id,
        name,
        condition: other,
        cheatList: arr,
        effect,
        type,
      });
    }
  }

  return {
    dialogArtRef,
    artRef,
    artId,
    artList,
    artAttr,
    initArt,
    openArt,
    closeArt,
    chooseArt,
    addArt,
    delArt,
    secretList,
    knwAll,
    knwSecretList,
    chooseKnw,
  };
}

export function useMeridian() {
  // 总经脉
  const meridianData = ref({});
  // 每一条经脉属性
  const meridianRowAttr = ref({});

  function initMeridian() {
    meridianData.value = {};
    meridianRowAttr.value = {};
    for (let id in meridianMap) {
      const {
        name,
        base,
        point,
        pid,
        level,
      } = meridianMap[id];
      if (level !== 3) {
        continue;
      }
      if (!Array.isArray(meridianData.value[pid])) {
        meridianData.value[pid] = [];
      }
      const item = {
        id,
        name,
        base,
        point,
        pid,
        level,
        checked: false,
      };
      if (acupointMap[id]) {
        item.acupoint = acupointMap[id];
      }
      meridianData.value[pid].push(item);
      meridianRowAttr.value[pid] = {atk: 0, def: 0, spd: 0, point: 0};
    }
  }

  // 经脉属性
  const meridianAttr = computed(() => {
    let total = {atk: 0, def: 0, spd: 0, point: 0};
    for (let id in meridianRowAttr.value) {
      for (let key in meridianRowAttr.value[id]) {
        total[key] += meridianRowAttr.value[id][key];
      }
    }
    return total;
  });

  // 选择经脉节点
  function chooseMeridian(checked, pid, colIndex) {
    meridianRowAttr.value[pid] = {atk: 0, def: 0, spd: 0, point: 0};
    for (let [index, item] of meridianData.value[pid].entries()) {
      item.checked = index < colIndex || checked && index === colIndex;
      if (checked && !item.checked) {
        continue;
      }
      if (item.checked) {
        const {base, point} = item;
        for (let key in base) {
          meridianRowAttr.value[pid][key] += base[key];
        }
        meridianRowAttr.value[pid].point += point;
      }
    }
  }

  return {
    meridianMap,
    meridianData,
    meridianAttr,
    initMeridian,
    chooseMeridian,
  };
}