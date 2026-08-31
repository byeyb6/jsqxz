import itmAll from '@/v107/data/itm/list';
// import artAll from '@/v107/data/art/list';

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

export {
  artCheatMap,
  // artNameId,
};
