<template>
  <div class="plan-wrap">
    <div class="plan-tool">
      <v-button type="primary" @click="exportExcel">导出Excel</v-button>
      <v-button @click="clearAll">重置</v-button>
    </div>
    <div class="plan-attr">
      <div class="plan-item-title">
        <span>预估属性</span>
        <span class="title-sub">
          五系以50为基础，成长系数按1计算；规划中无极丹洗掉的武功此处不会计算属性扣除
        </span>
      </div>
      <div class="attr-list" style="--flex-basic: 150px;">
        <div class="attr-item">
          <span class="item-label">难度</span>
          <el-input-number
            v-model="attr.dfl"
            :min="1"
            :max="4"
            size="small"
          ></el-input-number>
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
      </div>
      <div class="attr-list">
        <div
          class="attr-item"
          v-for="key of attr3"
          :key="key"
        >
          <span class="item-label">{{ attrMap[key] }}</span>
          <span>
            {{ attr[key] + attr3Base + artAttr[key] + meridianAttr[key] }}
          </span>
        </div>
      </div>
      <div class="attr-list">
        <div
          class="attr-item"
          v-for="key of attr5"
          :key="key"
        >
          <span class="item-label">{{ attrMap[key] }}</span>
          <span>
            {{ attr[key] + attr.week + artAttr[key] }}
          </span>
        </div>
      </div>
    </div>
    <div class="plan-art">
      <div class="plan-item-title">
        <span>武功规划</span>
        <span class="title-sub">规划无极丹洗掉的武功不要删除</span>
      </div>
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
      <div class="plan-item-title" v-show="secretList.length > 0">激活秘技</div>
      <div class="art-list" v-show="secretList.length > 0">
        <div class="art-item" v-for="item of secretList" :key="item.id">
          <span class="color-error">{{ item.name }}</span>
        </div>
      </div>
    </div>
    <div class="plan-meridian">
      <div class="plan-item-title">
        <span>经脉规划</span>
        <span class="title-sub">
          已使用{{ meridianAttr.point }}武学点
        </span>
      </div>
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
              </v-checkbox>
            </div>
            <div class="row-td-attr color-success">
              <span v-for="(num, key) in col.base" :key="key">
                {{ attrMap[key] }}+{{ num }}
              </span>
            </div>
            <div class="row-td-effect color-error" v-if="col.acupoint">
              <div v-for="(text, i) of col.acupoint.effect" :key="i">
                {{ text }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <v-dialog
    ref="dialogRef"
    dialog-class="dialog-art"
    :width="globalState.lessWindow ? '80vw' : undefined"
  >
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
</template>
<script setup>
import {computed, onBeforeMount, ref, watch} from 'vue';
import VDialog from '@/components/dialog';
import VCheckbox from '@/components/checkbox';
import VArt from '@/v107/views/art/search';
import {Delete} from '@element-plus/icons-vue';
import {globalState} from '@/store/global';
import {attrMap} from '@/v107/data/map';
import {useArt, useMeridian} from '@/v107/views/process/hook/plan';
import {exportJsonToExcel} from '@/utils/excel';

const attr = ref({
  dfl: 1,
  week: 1,
  apt: 1,
  atk: 40,
  def: 40,
  spd: 40,
  una: 50,
  fin: 50,
  swd: 50,
  bld: 50,
  spc: 50,
});
const attr3 = ['atk', 'def', 'spd'];
const attr5 = ['una', 'fin', 'swd', 'bld', 'spc'];
const attr3Base = computed(() => {
  const base = 29;
  let per = 3;
  if (attr.value.apt > 79) {
    per = 6;
  } else if (attr.value.apt > 50) {
    per = 5;
  } else if (attr.value.apt > 30) {
    per = 4;
  }
  let rst = per * base;
  if (attr.value.dfl > 1) {
    rst += attr.value.week + Math.round(attr.value.dfl * 5 / 3);
  }
  return rst;
});

const {
  dialogRef,
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
} = useArt();

const {
  meridianMap,
  meridianData,
  meridianAttr,
  initMeridian,
  chooseMeridian,
} = useMeridian();

// 重置
function clearAll() {
  initArt();
  initMeridian();
}

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
  const attrObj = {
    title: '预估属性',
  };
  let attrIndex = 0;
  for (let key in attr.value) {
    attrObj[`col${attrIndex}`] = `${attrMap[key]}: ${attr.value[key]}`;
    attrIndex++;
  }
  const artArr = [];
  let artRowIndex = 0;
  for (let row of artList.value) {
    const item = {title: `武功${artRowIndex + 1}`};
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
  const secretObj = {title: '激活秘技'};
  for (let [index, item] of secretList.value.entries()) {
    secretObj[`col${index}`] = item.name;
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

  const tbody = [
    ...artArr,
    secretObj,
    {},
    {
      title: '经脉',
      col0: `需${meridianAttr.value.point}武学点`,
    },
    ...meridianArr,
    {},
    attrObj,
  ];
  exportJsonToExcel({
    data: tbody,
    header,
    filename: '金书武功经脉规划',
  });
}

onBeforeMount(() => {
  initArt();
  initMeridian();
});
</script>
<style lang="less">
.plan-wrap {

  .plan-item-title {
    display: flex;
    font-size: 16px;
    padding: 10px 0;

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
    z-index: 4;
    display: flex;
    padding: 0 10px;
    background: #fff;

    .v-button {
      margin-right: 10px;
    }
  }

  .plan-attr {
    padding: 5px 10px 10px;
    background: #fff;

    .attr-list {
      --flex-basic: 100px;

      display: flex;
      flex-wrap: wrap;
      align-items: center;
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

    .el-input-number {
      width: 100px;
    }
  }

  .plan-art {
    flex: 2 0 400px;
    padding: 5px 0 5px 10px;
    background: var(--color-bg);
  }

  .art-list {
    display: flex;
    flex-wrap: wrap;
  }

  .art-item {
    flex: 0 0 180px;
    padding: 5px;
    margin: 5px 10px 5px 0;
    border: 1px solid var(--color-border);
    border-radius: 2px;

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
    .plan-item-title {
      position: sticky;
      top: 32px;
      z-index: 3;
      background: #fff;
    }

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
        flex: 0 0 150px;
        margin: 0 5px 5px 0;
        padding: 5px;
        border: 1px solid var(--color-border);
        border-radius: 2px;

        &.is-acupoint {
          flex: 0 0 305px;
        }
      }

      .row-td-attr {
        span {
          margin-right: 10px;
        }
      }
    }
  }
}
</style>