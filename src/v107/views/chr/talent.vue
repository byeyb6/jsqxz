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
  <v-table
    ref="tableRef"
    class="v-table-art-talent"
    :cols="thead"
    :data="tbody"
    :y="scrollY"
    :loading="globalState.loading"
    @sort="sort"
  >
    <template #name="{row}">
      <span :class="`level-${row.level}`">
        {{ row.name }}<template v-if="row.type === 5">（定制）</template>
      </span>
    </template>
    <template #effect="{row}">
      <div class="td-block">
        <div class="td-effect-item" v-for="(item, index) of row.effect" :key="index">
          {{ item }}
        </div>
      </div>
      <div class="td-block" v-if="row.fortune.length > 0">
        <div class="color-error">[福缘际遇]</div>
        <div class="td-effect-item effect-icon-rhombus" v-for="(text, i) of row.fortune" :key="i">
          {{ text }}
        </div>
      </div>
    </template>
    <template #fortune="{row}">
      <div class="td-block">
        <div class="td-effect-item effect-icon-rhombus" v-for="(text, i) of row.fortune" :key="i">
          {{ text }}
        </div>
      </div>
    </template>
    <template #type="{row}">
      <div class="td-block">
        <span v-if="row.type > 2" class="color-error">否</span>
        <span v-else class="color-success">是</span>
      </div>
    </template>
  </v-table>
  <!-- <v-pages
    v-model:page="pageConfig.page"
    :page-size="pageConfig.pageSize"
    :total="pageConfig.total"
    @update:page="changePage"
  ></v-pages> -->
</template>

<script setup>
import {ref, computed, useTemplateRef, onMounted} from 'vue';
import data from '@/v107/data/chr/talent';
import {globalState} from '@/store/global';
// import VPages from '@/components/pages.vue';

const tableRef = useTemplateRef('tableRef');
const thead = [
  {
    key: 'name',
    name: '名称',
  },
  {
    key: 'effect',
    name: '效果',
  },
  {
    key: 'fortune',
    name: '福缘际遇',
    hidden: true,
  },
  {
    key: 'type',
    name: '可选',
  },
  {
    key: 'level',
    name: '等级',
    hidden: globalState.lessWindow,
    sort: true,
  },
  {
    key: 'score',
    name: '点数',
    hidden: globalState.lessWindow,
    sort: true,
  },
];
const params = ref({
  keyword: '',
});
const scrollY = ref(0);
const tbody = ref([]);
const allData = computed(() => {
  const arr = [];
  for (let id in data) {
    const {name, effect, fortune, level, score, type} = data[id];
    if (name === '备用' || name === '标主占用') {
      continue;
    }
    arr.push({
      id,
      name,
      effect: effect.filter(i => import.meta.env.DEV || !/#hidden#$/.test(i)),
      fortune,
      level,
      score,
      type,
    });
  }
  return arr;
});

function search() {
  tableRef.value.clearSort();
  params.value.keyword = (params.value.keyword + '').replace(/[\[\]{}"', ]/g, '');
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

function sort(key, direction) {
  scrollY.value = scrollY.value === 0 ? 1 : 0;
  if (direction === -1) {
    tbody.value.sort((a, b) => a[key] - b[key]);
    return;
  }
  if (direction === 1) {
    tbody.value.sort((a, b) => b[key] - a[key]);
    return;
  }
  tbody.value.sort((a, b) => a.id - b.id);
}

function changePage() {
  scrollY.value = scrollY.value === 0 ? 1 : 0;
}

onMounted(() => {
  search();
});
</script>
<style lang="less">
.v-table-art-talent {
  --height-slide: 166px;

  .td {
    &:nth-child(1) {
      flex: 0 0 100px;
    }

    &:nth-child(2) {
      flex: 2 0 0;
    }

    &:nth-child(3) {
      flex: 0 0 50px;
    }

    &:nth-child(4), &:nth-child(5) {
      flex: 0 0 80px;
    }
  }
}
</style>
