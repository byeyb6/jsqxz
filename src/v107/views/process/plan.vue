<template>
  <div class="plan-wrap">
    <div class="plan-tool">
      <v-button type="success" @click="exportExcel">导出Excel</v-button>
      <v-button @click="clearAll">重置</v-button>
    </div>
    <el-collapse v-model="active">
      <el-collapse-item class="plan-attr" name="attr">
        <template #title="{isActive }">
          <div class="plan-item-title" :class="{'is-active': isActive}">
            <span>预估属性</span>
            <span class="title-sub">
              五系以50为基础，成长系数按1计算；规划中无极丹洗掉的武功此处不会计算属性扣除
            </span>
          </div>
        </template>
        <div class="attr-list" style="--flex-basic: 150px;">
          <div class="attr-item">
            <span class="item-label">难度</span>
            <el-select
              v-model="attr.dfl"
              placeholder="清选择"
              size="small"
            >
              <el-option
                v-for="(name, id) in dflMap"
                :key="id"
                :label="name"
                :value="Number(id)"
              />
            </el-select>
          </div>
          <div class="attr-item">
            <span class="item-label">周目</span>
            <el-input-number
              v-model="attr.week"
              :min="1"
              :max="100"
              size="small"
            ></el-input-number>
          </div>
          <div class="attr-item">
            <span class="item-label">资质</span>
            <el-input-number
              v-model="attr.apt"
              :min="1"
              :max="100"
              size="small"
            ></el-input-number>
          </div>
          <div class="attr-item">
            <span class="item-label">境界</span>
            <el-select
              v-model="attr.rlm"
              placeholder="清选择"
              size="small"
            >
              <el-option
                v-for="(item, id) in rlmMap"
                :key="id"
                :label="item.name"
                :value="Number(id)"
              />
            </el-select>
          </div>
        </div>
        <div class="attr-list">
          <div
            class="attr-item"
            v-for="(val, key) in attr3"
            :key="key"
          >
            <span class="item-label">{{ attrMap[key] }}</span>
            <span>
              {{ attr[key] + attr3Base + artAttr[key] + meridianAttr[key] + rlmAttr[key] }}
            </span>
          </div>
          <div class="attr-item">
            <span class="item-label">三维上限</span>
            <span>
              {{ 999 + attr.week }}
            </span>
          </div>
        </div>
        <div class="attr-list">
          <div
            class="attr-item"
            v-for="(val, key) in attr5"
            :key="key"
          >
            <span class="item-label">{{ attrMap[key] }}</span>
            <span>
              {{ attr[key] + attr.week + rlmAttr[key] }}
            </span>
          </div>
          <div class="attr-item">
            <span class="item-label">五系上限</span>
            <span>
              {{ 500 + attr.week }}
            </span>
          </div>
        </div>
      </el-collapse-item>
      <el-collapse-item class="plan-tal" name="tal">
        <template #title="{isActive }">
          <div class="plan-item-title" :class="{'is-active': isActive}">
            <span>天赋规划</span>
            <span class="title-sub">畅想155点/门派205点</span>
          </div>
        </template>
        <div class="tal-button">
          <v-button size="small" type="primary" @click="openTal">选择天赋</v-button>
        </div>
        <div class="tal-list">
          <el-tag
            v-for="(id, index) of talList"
            :key="id"
            closable
            type="primary"
            :style="getTalTagStyle(talentMap[id].level)"
            @close="delTal(index)"
          >
            {{ talentMap[id].name }}({{ talentMap[id].score }}点)
          </el-tag>
        </div>
      </el-collapse-item>
      <el-collapse-item class="plan-art" name="art">
        <template #title="{isActive }">
          <div class="plan-item-title" :class="{'is-active': isActive}">
            <span>武功规划</span>
            <span class="title-sub">规划无极丹洗掉的武功不要删除，需要用于秘技计算</span>
          </div>
        </template>
        <div class="art-list">
          <div class="art-item" v-for="(row, rowIndex) of artList" :key="rowIndex">
            <div class="item-index">
              <span>第{{ rowIndex + 1 }}格武功</span>
              <a
                class="icon-add"
                href="javascript: void 0;"
                title="添加一脉"
                @click="addArt(rowIndex)"
              ></a>
            </div>
            <div
              class="item-select"
              v-for="(col, colIndex) of row"
              :key="colIndex"
            >
              <span
                :class="{[`level-${col.level}`]: col.level}"
                @click="openArt(rowIndex, colIndex)"
              >
                {{ col.name || '请选择武功' }}
              </span>
              <el-icon
                v-if="row.length > 1"
                href="javascript: void 0;"
                title="删除"
                @click="delArt(rowIndex, colIndex)"
              >
                <Delete/>
              </el-icon>
            </div>
          </div>
        </div>
        <div class="plan-item-title">
          <span>杂学</span>
          <span class="title-sub">由于中庸之道对应两个秘技，实际需根据资质自己选择</span>
        </div>
        <div class="art-list">
          <div class="art-item" v-for="(item, id) of knwAll" :key="id">
            <v-checkbox
              :value="true"
              :false-value="false"
              v-model="item.checked"
              @click="() => chooseKnw(id)"
            >
              {{ item.name }}
            </v-checkbox>
          </div>
        </div>
        <div class="plan-item-title">
          <span>激活秘技</span>
          <span class="title-sub">自动计算</span>
        </div>
        <div class="art-list" v-show="secretList.length + knwSecretList.length > 0">
          <div class="art-item" v-for="item of secretList" :key="item.id">
            <span class="color-error">{{ item.name }}</span>
          </div>
          <div class="art-item" v-for="item of knwSecretList" :key="item.id">
            <span class="color-error">{{ item.name }}</span>
          </div>
        </div>
        <div class="art-list" v-show="secretList.length + knwSecretList.length < 1">
          暂无激活的秘技
        </div>
      </el-collapse-item>
      <el-collapse-item class="plan-meridian" name="meridian">
        <template #title="{isActive }">
          <div class="plan-item-title" :class="{'is-active': isActive}">
            <span>经脉规划</span>
            <span class="title-sub">
              已使用{{ meridianAttr.point }}武学点
            </span>
          </div>
        </template>
        <div
          class="meridian-row"
          v-for="(row, id, rowIndex) in meridianData"
          :key="id"
        >
          <span class="row-label" :class="`level-${Math.floor(rowIndex / 3) + 1}`">
            {{ meridianMap[id].name }}
          </span>
          <div class="row-list">
            <div
              class="row-td"
              :class="{'is-acupoint': col.acupoint}"
              v-for="(col, colIndex) of row"
              :key="col.id"
            >
              <div class="row-td-title">
                <v-checkbox
                  :value="true"
                  :false-value="false"
                  v-model="col.checked"
                  @click="val => chooseMeridian(val, id, colIndex)"
                >
                  {{ col.name }}
                  <template v-if="col.acupoint">
                    ({{ col.acupoint.name }})
                  </template>
                </v-checkbox>
              </div>
              <div class="row-td-attr color-success">
                <span v-for="(num, key) in col.base" :key="key">
                  {{ attrMap[key] }}+{{ num }}
                </span>
              </div>
              <div class="row-td-effect color-error" v-if="col.acupoint">
                {{ col.acupoint.effect.join('；') }}
              </div>
            </div>
          </div>
        </div>
      </el-collapse-item>
      <el-collapse-item class="plan-book" name="book">
        <template #title="{isActive }">
          <div class="plan-item-title" :class="{'is-active': isActive}">
            <span>路线规划</span>
            <span class="title-sub">
              只统计天书流程获取，流程增加的属性因含有自选的，此处都不计入统计
            </span>
          </div>
        </template>
        <div class="v-table v-table-vertical">
          <div class="tr" v-for="(item, book) in rewardTextMap" :key="book">
            <div class="td">
              <div class="td-block">{{ bookMap[book] }}</div>
              <el-radio-group
                v-if="processBranch[book]!=='normal'"
                v-model="processBranch[book]"
              >
                <el-radio value="good">
                  {{ goodMap[book] ? goodMap[book] : '正线' }}
                </el-radio>
                <el-radio value="evil">
                  {{ evilMap[book] ? evilMap[book] : '邪线' }}
                </el-radio>
              </el-radio-group>
            </div>
            <div class="td">
              <div class="td-block">
                <div class="td-effect-item effect-icon-rhombus">
                  {{ item[processBranch[book]].itm.join('，') }}
                </div>
                <div
                  v-show="item[processBranch[book]].team?.length > 0"
                  class="td-effect-item effect-icon-star"
                >
                  {{ item[processBranch[book]].team.join('，') }}
                </div>
                <div
                  v-for="(text, i) of item[processBranch[book]].branch"
                  :key="i"
                  class="td-effect-item effect-icon-rhombus"
                >
                  {{ text }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
  <v-dialog ref="dialogArtRef" dialog-class="dialog-art">
    <v-art ref="artRef" :id="artId"></v-art>
    <template #header>
      <div>选择武功</div>
    </template>
    <template #footer>
      <div>
        <v-button type="primary" @click="chooseArt">确定</v-button>
        <v-button @click="closeArt">取消</v-button>
      </div>
    </template>
  </v-dialog>
  <v-dialog ref="dialogTalRef" dialog-class="dialog-art">
    <talent-check ref="talRef" :checked="talList"></talent-check>
    <template #header>
      <div>选择天赋</div>
    </template>
    <template #footer>
      <div>
        <v-button type="primary" @click="chooseTal">确定</v-button>
        <v-button @click="closeTal">取消</v-button>
      </div>
    </template>
  </v-dialog>
</template>
<script setup>
import {onBeforeMount, ref} from 'vue';
import VDialog from '@/components/dialog';
import VCheckbox from '@/components/checkbox';
import VArt from '@/v107/views/art/search';
import TalentCheck from '@/v107/views/process/talent-check';
import {Delete} from '@element-plus/icons-vue';
import {attrMap, bookMap, dflMap} from '@/v107/data/map';
import {useArt, useAttr, useMeridian, useProcess, useTal} from '@/v107/views/process/hook/plan';
import {exportJsonToExcel} from '@/utils/excel';
import talentMap from '@/v107/data/chr/talent/talent';
import {goodMap, evilMap} from '@/v107/data/process';

const active = ref(['attr']);

const {
  attr,
  attr3,
  attr5,
  attr3Base,
  rlmAttr,
  rlmMap,
} = useAttr();

const {
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
} = useArt();

const {
  meridianMap,
  meridianData,
  meridianAttr,
  initMeridian,
  chooseMeridian,
} = useMeridian();

const {
  dialogTalRef,
  talRef,
  talList,
  openTal,
  closeTal,
  chooseTal,
  delTal,
  initTal,
  getTalTagStyle,
} = useTal();

const {
  processBranch,
  rewardTextMap,
  initProcess,
} = useProcess();

// 重置
function clearAll() {
  initArt();
  initMeridian();
  initTal();
  initProcess();
  knwSecretList.value = [];
}

// 导出
function exportExcel() {
  const header = [
    {title: '名称', key: 'title'},
  ];
  for (let i = 0; i < 11; i++) {
    header.push({
      title: `列${i + 1}`,
      key: `col${i}`,
    });
  }
  const attrObj = {title: '预估属性'};
  const attrObj1 = {title: '', col3: `三维上限: ${999 + attr.value.week}`};
  const attrObj2 = {title: '', col5: `五系上限: ${500 + attr.value.week}`};
  let attrIndex = 0;
  for (let key in attr.value) {
    let num = attr.value[key];
    if (key === 'rlm') {
      num = rlmMap[attr.value[key]].name;
    } else if (key === 'dfl') {
      num = dflMap[attr.value[key]];
    }
    if (attr3[key]) {
      num += artAttr.value[key] + attr3Base.value + meridianAttr.value[key] + rlmAttr.value[key];
    } else if (attr5[key]) {
      num += attr.value.week + rlmAttr.value[key];
    }
    if (attrIndex < 4) {
      attrObj[`col${attrIndex}`] = `${attrMap[key]}: ${num}`;
    } else if (attrIndex < 7) {
      attrObj1[`col${attrIndex - 4}`] = `${attrMap[key]}: ${num}`;
    } else {
      attrObj2[`col${attrIndex - 7}`] = `${attrMap[key]}: ${num}`;
    }
    attrIndex++;
  }
  // 武功
  const artArr = [];
  let artRowIndex = 0;
  for (let row of artList.value) {
    const item = {title: `第${artRowIndex + 1}格武功`};
    artRowIndex++;
    let artColIndex = 0;
    for (let col of row) {
      if (col.id > -1) {
        item[`col${artColIndex}`] = col.name;
        artColIndex++;
      }
    }
    artArr.push(item);
  }
  // 杂学
  const knwObj = {title: '杂学'};
  let knwRowIndex = 0;
  for (let id in knwAll.value) {
    const {checked, name} = knwAll.value[id];
    if (checked) {
      knwObj[`col${knwRowIndex}`] = name;
      knwRowIndex++;
    }
  }
  // 秘技
  const secretObj = {title: '激活秘技'};
  let secretIndex = 0;
  for (let item of secretList.value) {
    secretObj[`col${secretIndex}`] = item.name;
    secretIndex++;
  }
  for (let item of knwSecretList.value) {
    secretObj[`col${secretIndex}`] = item.name;
    secretIndex++;
  }
  const meridianArr = [];
  let meridianRowIndex = 0;
  for (let id in meridianData.value) {
    const item = {title: meridianMap[id].name};
    meridianRowIndex++;
    let meridianColIndex = 0;
    for (let col of meridianData.value[id]) {
      const {name, checked, acupoint} = col;
      if (checked) {
        item[`col${meridianColIndex}`] = acupoint ? `${name}(${acupoint.name})` : name;
        meridianColIndex++;
      }
    }
    meridianArr.push(item);
  }
  const talObj = {title: '天赋'};
  for (let [index, id] of talList.value.entries()) {
    const {name, level, score} = talentMap[id];
    talObj[`col${index}`] = `${name}(${level}级${score}点)`;
  }

  // 流程规划
  const processObj = {title: '天书流程'};
  const processObj1 = {title: '上'};
  const processObj2 = {title: '下'};

  function handleName(book, key) {
    let name = '无分线';
    if (key === 'good') {
      name = goodMap[key] ? goodMap[key] : '正线';
    } else if (key === 'evil') {
      name = evilMap[key] ? evilMap[key] : '邪线';
    }
    return `${bookMap[book]}-${name}`;
  }

  let processIndex = 0;
  for (let book in processBranch.value) {
    if (processIndex < 7) {
      processObj1[`col${processIndex}`] = handleName(book, processBranch.value[book]);
    } else {
      processObj2[`col${processIndex - 7}`] = handleName(book, processBranch.value[book]);
    }
    processIndex++;
  }

  const tbody = [
    ...artArr,
    knwObj,
    secretObj,
    {},
    talObj,
    {},
    {
      title: '经脉',
      col0: `需${meridianAttr.value.point}武学点`,
    },
    ...meridianArr,
    {},
    processObj,
    processObj1,
    processObj2,
    {},
    attrObj,
    attrObj1,
    attrObj2,
  ];
  exportJsonToExcel({
    data: tbody,
    header,
    filename: '金书规划',
  });
}

onBeforeMount(() => {
  clearAll();
});
</script>
<style lang="less">
.plan-wrap {

  .plan-item-title {
    display: flex;
    padding: 10px;
    font-size: 16px;
    background: #fff;

    &.is-active {
      color: var(--color-warn);
    }

    .title-sub {
      flex: 1 0 0;
      margin-left: 15px;
      font-size: 14px;
      color: var(--color-gray);
    }
  }

  .plan-tool {
    position: sticky;
    top: 0;
    z-index: 9;
    display: flex;
    padding: 0 10px 8px;
    background: #fff;

    .v-button {
      margin-right: 10px;
    }
  }

  .el-collapse {
    --el-collapse-content-font-size: 14px;
    --el-collapse-header-height: 20px;
  }

  .el-collapse-item__header {
    position: sticky;
    top: 40px;
    z-index: 2;
    background: #fff;
  }

  .plan-attr {

    .attr-list {
      --flex-basic: 100px;

      display: flex;
      flex-wrap: wrap;
      align-items: center;
      padding: 5px 10px 10px;
    }

    .attr-item {
      flex: 0 0 var(--flex-basic);
      display: flex;
      align-items: center;
      margin: 0 5px 5px 0;
    }

    .item-label {
      margin-right: 8px;
      color: var(--color-gray);
    }

    .el-input-number, .el-select {
      width: 100px;
    }
  }

  .plan-tal {

    .tal-button {
      margin-bottom: 10px;
    }

    .el-tag {
      margin: 0 10px 5px 0;
    }
  }

  .plan-art {

    .art-list {
      display: flex;
      flex-wrap: wrap;
      padding: 5px 0 5px 10px;
      background: var(--color-bg);
    }

    .art-item {
      flex: 0 0 165px;
      padding: 5px;
      margin: 5px 10px 5px 0;
      border: 1px solid var(--color-border);
      border-radius: 2px;
    }

    .item-index {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 5px;
      padding-bottom: 5px;
      border-bottom: 1px solid var(--color-border);
    }

    .item-select {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 5px;
      color: var(--color-success);

      span {
        flex: 1 0 0;
        padding: 0 5px;
        margin-right: 10px;
        cursor: pointer;
      }

      .el-icon {
        font-size: 16px;
        color: var(--color-error);
        cursor: pointer;
      }
    }
  }

  .plan-meridian {

    .meridian-row {
      display: flex;
      padding: 10px 10px 5px;

      &:nth-child(2n) {
        background: var(--color-primary-lighter);
      }

      &:nth-child(2n + 1) {
        background: var(--color-success-lighter);
      }

      .row-label {
        flex: 0 0 70px;
      }

      .row-list {
        flex: 1 0 0;
        display: flex;
        flex-wrap: wrap;
      }

      .row-td {
        flex: 0 0 130px;
        margin: 0 5px 5px 0;
        padding: 5px;
        border: 1px solid var(--color-border);
        border-radius: 2px;

        &.is-acupoint {
          flex: 0 0 265px;
        }
      }

      .row-td-attr {
        span {
          margin-right: 10px;
        }
      }
    }
  }

  .plan-book {
    .v-table-vertical {
      .td:first-child {
        flex: 0 0 130px;
      }
    }
  }
}
</style>