import itmAll from '@/v107/data/itm/list';
// import artAll from '@/v107/data/art/list';
import secretAll from '@/v107/data/art/secret';

// 武功对应的秘籍
const artCheatMap = {};

for (let id in itmAll) {
  const {art} = itmAll[id];
  if (typeof art === 'number') {
    artCheatMap[art] = Number(id);
  }
}

// const artNameId = {};
//
// for (let id in artAll) {
//   artNameId[artAll[id].name] = id;
// }

// 杂学对应的秘技
const knwSecret = {};

for (let id in secretAll) {
  const {cheat, type} = secretAll[id];
  if (type !== 1) {
    continue;
  }
  for (let k in cheat) {
    if (k === 'other') {
      continue;
    }
    if (itmAll[k]?.type === 8) {
      knwSecret[k] = secretAll[id];
      break;
    }
  }
}

export {
  artCheatMap,
  // artNameId,
  knwSecret,
};
