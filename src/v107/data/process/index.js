import fei from './fei';
import xue from './xue';
import lian from './lian';
import tian from './tian';
import she from './she';
import bai from './bai';
import lu from './lu';
import xiao from './xiao';
import shu from './shu';
import shen from './shen';
import xia from './xia';
import yi from './yi';
import bi from './bi';
import yuan from './yuan';
import start from './start';
import luk from './luk';
import huashan from './huashan';
import wudao from './wudao';
import chrAll from '@/v107/data/chr/index';
import itmAll from '@/v107/data/itm/list';
import {itmTypeMap} from '@/v107/data/map';
import {typeOf} from '@/utils/tool';

const processMap = {
  fei,
  xue,
  lian,
  tian,
  she,
  bai,
  lu,
  xiao,
  shu,
  shen,
  xia,
  yi,
  bi,
  yuan,
  start,
  luk,
  huashan,
  wudao,
};

const processAll = {};
for (let key in processMap) {
  processAll[key] = formatProcess(processMap[key]);
}

export default processAll;

const goodMap = {
  shu: '霍青桐线',
  fei: '袁紫衣线',
};
const evilMap = {
  shu: '李沅芷线',
  fei: '程灵素线',
};

function formatProcess(data) {
  const rst = JSON.parse(JSON.stringify(data));
  for (let key in rst) {
    for (let parent of rst[key]) {
      for (let item of parent.event) {
        const {reward} = item;
        if (typeOf(reward) === 'object') {
          const arr = [];
          if (reward.mor) {
            arr.push(`道德${reward.mor > 0 ? '+' : ''}${reward.mor}`);
          }
          if (reward.itm) {
            for (let k in reward.itm) {
              const {name, type} = itmAll[k];
              arr.push(`${name}[${itmTypeMap[type]}]${reward.itm[k] > 0 ? '+' : ''}${reward.itm[k]}`);
            }
          }
          if (reward.team) {
            for (let k in reward.team) {
              arr.push(`${chrAll[k].name}${reward.team[k] ? '加入' : '离开'}队伍`);
            }
          }
          if (reward.other) {
            arr.push(...reward.other);
          }
          item.reward = arr;
        }
      }
    }
  }
  return rst;
}

const rewardMap = {
  fei: {
    good: {mor: 0, itm: {}, team: {}},
    evil: {mor: 0, itm: {}, team: {}},
  },
  xue: {normal: {}},
  lian: {
    good: {mor: 0, itm: {}, team: {}},
    evil: {mor: 0, itm: {}, team: {}},
  },
  tian: {
    good: {mor: 0, itm: {}, team: {}},
    evil: {mor: 0, itm: {}, team: {}},
  },
  she: {
    good: {mor: 0, itm: {}, team: {}},
    evil: {mor: 0, itm: {}, team: {}},
  },
  bai: {
    good: {mor: 0, itm: {}, team: {}},
    evil: {mor: 0, itm: {}, team: {}},
  },
  lu: {normal: {}},
  xiao: {
    good: {mor: 0, itm: {}, team: {}},
    evil: {mor: 0, itm: {}, team: {}},
  },
  shu: {
    good: {mor: 0, itm: {}, team: {}},
    evil: {mor: 0, itm: {}, team: {}},
  },
  shen: {
    good: {mor: 0, itm: {}, team: {}},
    evil: {mor: 0, itm: {}, team: {}},
  },
  xia: {
    good: {mor: 0, itm: {}, team: {}},
    evil: {mor: 0, itm: {}, team: {}},
  },
  yi: {
    good: {mor: 0, itm: {}, team: {}},
    evil: {mor: 0, itm: {}, team: {}},
  },
  bi: {
    good: {mor: 0, itm: {}, team: {}},
    evil: {mor: 0, itm: {}, team: {}},
  },
  yuan: {normal: {}},
};

for (let id in rewardMap) {
  const onlyNormal = !!rewardMap[id].normal;
  const current = processMap[id];
  for (let key in current) {
    if (id === 'shen' && key === 'branch') {
      continue;
    }
    const rst = calcReward(current[key]);
    if (key === 'normal' || key === 'branch') {
      if (onlyNormal) {
        rewardMap[id].normal = rst;
        continue;
      }
      rewardMap[id].good.mor += rst.mor;
      rewardMap[id].evil.mor += rst.mor;
      for (let k in rst.itm) {
        if (!Reflect.has(rewardMap[id].good.itm, k)) {
          rewardMap[id].good.itm[k] = 0;
        }
        rewardMap[id].good.itm[k] += rst.itm[k];
        if (!Reflect.has(rewardMap[id].evil.itm, k)) {
          rewardMap[id].evil.itm[k] = 0;
        }
        rewardMap[id].evil.itm[k] += rst.itm[k];
      }
      for (let k in rst.team) {
        if (!Reflect.has(rewardMap[id].good.team, k)) {
          rewardMap[id].good.team[k] = 0;
        }
        rewardMap[id].good.team[k] = rst.team[k];
        if (!Reflect.has(rewardMap[id].evil.team, k)) {
          rewardMap[id].evil.team[k] = 0;
        }
        rewardMap[id].evil.team[k] = rst.team[k];
      }
      continue;
    }
    if (key === 'good') {
      rewardMap[id].good.mor += rst.mor;
      for (let k in rst.itm) {
        if (!Reflect.has(rewardMap[id].good.itm, k)) {
          rewardMap[id].good.itm[k] = 0;
        }
        rewardMap[id].good.itm[k] += rst.itm[k];
      }
      for (let k in rst.team) {
        rewardMap[id].good.team[k] = rst.team[k];
      }
      if (rst.branch) {
        rewardMap[id].good.branch = rst.branch;
      }
      continue;
    }
    if (key === 'evil') {
      rewardMap[id].evil.mor += rst.mor;
      for (let k in rst.itm) {
        if (!Reflect.has(rewardMap[id].evil.itm, k)) {
          rewardMap[id].evil.itm[k] = 0;
        }
        rewardMap[id].evil.itm[k] += rst.itm[k];
      }
      for (let k in rst.team) {
        rewardMap[id].evil.team[k] = rst.team[k];
      }
      if (rst.branch) {
        rewardMap[id].evil.branch = rst.branch;
      }
    }
  }
}

function calcReward(data) {
  const rst = {mor: 0, itm: {}, team: {}, branch: {}};
  for (let parent of data) {
    for (let item of parent.event) {
      const {reward} = item;
      if (!reward) {
        continue;
      }
      if (reward.branch) {
        const {id, name} = reward.branch;
        if (!rst.branch[id]) {
          rst.branch[id] = {};
        }
        if (!rst.branch[id][name]) {
          rst.branch[id][name] = {mor: 0, itm: {}, team: {}};
        }
        rst.branch[id][name].mor += reward.mor ?? 0;
        for (let k in reward.itm) {
          if (!Reflect.has(rst.branch[id][name].itm, k)) {
            rst.branch[id][name].itm[k] = 0;
          }
          rst.branch[id][name].itm[k] += reward.itm[k];
        }
        for (let k in reward.team) {
          rst.branch[id][name].team[k] = reward.team[k];
        }
        continue;
      }
      if (reward.mor) {
        rst.mor += reward.mor;
      }
      if (reward.itm) {
        for (let k in reward.itm) {
          if (!Reflect.has(rst.itm, k)) {
            rst.itm[k] = 0;
          }
          rst.itm[k] += reward.itm[k];
        }
      }
      if (reward.team) {
        for (let k in reward.team) {
          if (!Reflect.has(rst.team, k)) {
            rst.team[k] = false;
          }
          rst.team[k] = reward.team[k];
        }
      }
    }
  }
  return rst;
}

function formatReward(data) {
  const itmArr = [];
  const teamArr = [];
  const branchArr = [];
  const {mor, itm, team, branch} = data;
  if (mor) {
    itmArr.push(`道德${mor > 0 ? '+' : ''}${mor}`);
  }
  if (itm) {
    for (let k in itm) {
      const {name, type} = itmAll[k];
      itmArr.push(`${name}[${itmTypeMap[type]}]${itm[k] > 0 ? '+' : ''}${itm[k]}`);
    }
  }
  if (team) {
    for (let k in team) {
      if (team[k]) {
        teamArr.push(`${chrAll[k].name}加入队伍`);
      }
    }
  }
  if (branch) {
    for (let k in branch) {
      let bArr = [];
      for (name in branch[k]) {
        const cArr = [];
        const {mor, itm, team} = branch[k][name];
        if (mor) {
          cArr.push(`道德${mor > 0 ? '+' : ''}${mor}`);
        }
        if (itm) {
          for (let k in itm) {
            const {name, type} = itmAll[k];
            cArr.push(`${name}[${itmTypeMap[type]}]${itm[k] > 0 ? '+' : ''}${itm[k]}`);
          }
        }
        if (team) {
          for (let k in team) {
            cArr.push(`${chrAll[k].name}${team[k] ? '加入' : '离开'}队伍`);
          }
        }
        bArr.push(`${name}：${cArr.join('、')}`);
      }
      branchArr.push(`【分支${k}】：${bArr.join('；')}`);
    }
  }
  return {
    itm: itmArr,
    team: teamArr,
    branch: branchArr,
  };
}

const rewardTextMap = {};
for (let id in rewardMap) {
  rewardTextMap[id] = {};
  for (let k in rewardMap[id]) {
    rewardTextMap[id][k] = formatReward(rewardMap[id][k]);
  }
}

// 天龙邪线虚竹离队
const tianEvilTeamIndex = rewardTextMap.tian.evil.team.findIndex(i => /虚竹/.test(i));
if (tianEvilTeamIndex > -1) {
  rewardTextMap.tian.evil.team.splice(tianEvilTeamIndex, 1);
}

export {rewardMap, rewardTextMap, goodMap, evilMap, formatReward};
