import artAll from './list';
import sectArtText from './sect-art';

export function formatArt() {
  const reg = /CC.MpKf\[(\d+)] ?= ?\{(.+)}/g;
  let str = sectArtText.replace(reg, '$1@$2');
  const list = str.split('\n');
  for (let item of list) {
    if (!item) {
      continue;
    }
    const info = item.split('@');
    if (info.length < 2) {
      continue;
    }
    let [id, artStr] = info;
    const artList = artStr.split(',');
    for (let art of artList) {
      if (artAll[art]) {
        artAll[art].sect = art === '333' ? -1 : Number(id);
      } else {
        artAll[art] = {
          id: Number(art),
          name: '',
          get: [],
          sect: Number(id),
          level: 1,
          inner: 9,
          initiative: [],
          type: -1,
        };
      }
    }
  }
  console.log(artAll);
}