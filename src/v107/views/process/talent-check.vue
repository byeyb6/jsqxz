<template>
  <div class="v-search">
    <div class="v-search-item">
      <v-input
        class="item-value"
        placeholder="名称/效果/福缘际遇查询"
        v-model="params.keyword"
        @keydown.enter="search"
        @clear="search"
      ></v-input>
    </div>
    <div class="v-search-item">
      <v-button type="primary" @click="search">查询</v-button>
    </div>
  </div>
  <div class="v-tabs v-tabs-dialog-talent" style="--tab-width: 160px;">
    <div class="checked-list">
      <el-tag
        v-for="id of checkedIds"
        :key="id"
        closable
        type="primary"
        size="small"
        @close="delChecked(id)"
      >
        {{ data[id].name }}({{ data[id].score }}点)
      </el-tag>
    </div>
    <div class="tabs">
      <div
        class="tab is-flex"
        v-for="(item, index) of tbody"
        :key="item.id"
        :class="{'is-active': active === index}"
        @click="handleClick(index)"
      >
        <v-checkbox
          :value="true"
          :disabled="!checkedTal[item.id] && checkedIds.length > 10"
          v-model="checkedTal[item.id]"
        >
          &nbsp;
        </v-checkbox>
        <p :class="{[`level-${item.level}`]: item.level < 5, 'level-5': item.level >= 5}">
          {{ item.name }}({{ item.score }}点)
        </p>
      </div>
    </div>
    <h5 class="tabs-content-title" v-if="info.name">
      <span :class="{[`level-${info.level}`]: info.level < 5, 'level-5': info.level >= 5}">
        {{ info.name }}
      </span>
    </h5>
    <div class="v-table v-table-vertical">
      <div class="tr">
        <div class="td">效果</div>
        <div class="td">
          <div class="td-block" v-for="item of info.effect" :key="item.id">
            <div class="td-effect-item effect-icon-star">
              {{ item.desc }}
            </div>
          </div>
        </div>
      </div>
      <div class="tr">
        <div class="td">福缘际遇</div>
        <div class="td">
          <div class="td-block" v-for="(item, index) of info.fortune" :key="index">
            <div class="td-effect-item effect-icon-rhombus">
              {{ item }}
            </div>
          </div>
        </div>
      </div>
      <div class="tr">
        <div class="td">等级</div>
        <div class="td">
          {{ info.level }}
        </div>
      </div>
      <div class="tr">
        <div class="td">点数</div>
        <div class="td">
          <span>{{ info.score }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, onMounted, watch} from 'vue';
import data from '@/v107/data/chr/talent/talent';
import VCheckbox from '@/components/checkbox.vue';
import talentMap from '@/v107/data/chr/talent/talent';

const props = defineProps({
  checked: {
    type: Array,
    default: () => [],
  },
});

const checkedTal = ref({});
const checkedIds = computed(() => {
  const arr = [];
  for (let id in checkedTal.value) {
    if (checkedTal.value[id]) {
      arr.push(id);
    }
  }
  return arr;
});

function delChecked(id) {
  checkedTal.value[id] = false;
}

const params = ref({
  keyword: '',
});
// 显示数据
const tbody = ref([]);
// 所有数据
const allData = computed(() => {
  const arr = [];
  for (let id in data) {
    const {name, effect, fortune, level, score, type} = data[id];
    if (name === '备用' || name === '标主占用' || type > 2) {
      continue;
    }
    arr.push({
      id,
      name,
      effect,
      fortune,
      level,
      score,
      type,
    });
  }
  return arr.sort((a, b) => {
    if (a.level === b.level) {
      return b.score - a.score;
    }
    return b.level - a.level;
  });
});
// 当前索引
const active = ref(0);
// 详情
const info = computed(() => tbody.value[active.value] ?? {});

// 点击显示详情
function handleClick(index) {
  active.value = index;
}

// 搜索
function search() {
  active.value = 0;
  params.value.keyword = params.value.keyword.replace(/[\[\]{}"', ]/g, '');
  if (!params.value.keyword) {
    tbody.value = [...allData.value];
    return;
  }
  const reg = new RegExp(params.value.keyword, 'i');
  tbody.value = allData.value.filter(item => {
    const keyType = {
      name: 'string',
      effect: 'object',
      fortune: 'object',
    };
    let itemStr = '';
    for (let key in keyType) {
      itemStr += keyType[key] === 'object' ? JSON.stringify(item[key]) : item[key];
    }
    return reg.test(itemStr);
  });
}

function init() {
  params.value = {
    keyword: '',
  };
  active.value = 0;
  tbody.value = [...allData.value];
  checkedTal.value = {};
  for (let id of props.checked) {
    checkedTal.value[id] = true;
  }
}

onMounted(() => {
  init();
});

function getTalent() {
  return checkedIds.value.sort((a, b) => {
    const aInfo = talentMap[a];
    const bInfo = talentMap[b];
    if (bInfo.level === aInfo.level) {
      return bInfo.score - aInfo.score;
    }
    return bInfo.level - aInfo.level;
  });
}

defineExpose({
  getTalent,
  init,
});
</script>
<style lang="less">
.v-tabs-dialog-talent {
  .tab {
    &.is-active {
      background: var(--color-success-lighter);
    }
  }

  .checked-list {
    margin-bottom: 10px;

    .el-tag {
      margin-right: 10px;
    }
  }
}
</style>
