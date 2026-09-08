<template>
  <div class="v-search">
    <div class="v-search-item" style="flex: 0 0 100px;">
      <v-select
        placeholder="分类"
        :options="typeOptions"
        v-model="params.type"
      ></v-select>
    </div>
    <div class="v-search-item">
      <v-input
        class="item-value"
        placeholder="关键词"
        v-model="params.keyword"
        @keydown.enter="search"
        @clear="search"
      ></v-input>
    </div>
    <div class="v-search-item">
      <v-button type="primary" @click="search">查询</v-button>
      <!--      <v-button @click="clear" style="margin-left: 5px;">重置</v-button>-->
    </div>
  </div>
  <div class="v-tabs v-tabs-dialog-talent" style="--tab-width: 120px;">
    <div class="checked-list">
      <el-tag
        v-for="id of checkedIds"
        :key="id"
        closable
        type="primary"
        size="small"
        @close="delChecked(id)"
      >
        {{ data[id].name }}
      </el-tag>
    </div>
    <div class="tabs">
      <div
        class="tab is-flex"
        v-for="(item, index) of art"
        :key="item.id"
        :class="{'is-active': active === index}"
        @click="handleClick(index)"
      >
        <v-checkbox
          :value="true"
          :disabled="!checkedArt[item.id] && checkedIds.length > 10"
          v-model="checkedArt[item.id]"
        >
          &nbsp;
        </v-checkbox>
        <p
          :class="{
            [`level-${item.level}`]: item.level,
            [`inner-${item.inner}`]: item.inner === 1 || item.inner === 2,
          }"
        >
          {{ item.name }}
        </p>
      </div>
    </div>
    <h5 class="tabs-content-title" v-if="info.name">
      <span
        :class="[
          `level-${info.level}`,
          {[`inner-${info.inner}`]: info.inner === 1 || info.inner === 2},
        ]"
      >
        {{ info.name }}
      </span>
    </h5>
    <art-item v-if="info.id" :item="info" :key="info.id"></art-item>
  </div>
</template>
<script setup>
import {computed, ref, onBeforeMount, watch} from 'vue';
import artMap from '@/v107/data/art/list';
import ArtItem from '@/v107/views/art/item';
import VSelect from '@/components/select';
import {storageSession} from '@/utils/storage';
import {formatArt} from '@/v107/data/art/effect/attr';
import {globalState} from '@/store/global';
import {itmTypeMap} from '@/v107/data/map';
import data from '@/v107/data/chr/talent/talent';
import VCheckbox from '@/components/checkbox';

const props = defineProps({
  checked: {
    type: Array,
    default: () => [],
  },
});
const artAll = ref([]);
const art = ref([]);
const active = ref(0);
const checkedArt = ref({});
const checkedIds = computed(() => {
  const arr = [];
  for (let id in checkedArt.value) {
    if (checkedArt.value[id]) {
      arr.push(id);
    }
  }
  return arr;
});

function delChecked(id) {
  checkedArt.value[id] = false;
}

watch(props.checked, val => {
  const obj = {};
  for (let id of val) {
    obj[id] = true;
  }
  checkedArt.value = obj;
}, {immediate: true});

const info = computed(() => art.value[active.value]);

// 点击显示详情
function handleClick(index) {
  active.value = index;
}

// 初始化武功列表
function init() {
  globalState.loading = true;
  artAll.value = [];
  for (let id in artMap) {
    if (artMap[id].type < 1) {
      continue;
    }
    artAll.value.push(handleArtInfo(artMap[id]));
  }
  artAll.value.sort((a, b) => {
    let aIn = a.inner ? a.inner : 9;
    let bIn = b.inner ? b.inner : 9;
    if (a.level === b.level) {
      if (aIn === bIn) {
        return a.sect - b.sect;
      }
      return aIn - bIn;
    }
    return b.level - a.level;
  });
  active.value = 0;
  art.value = [...artAll.value];
  globalState.loading = false;
}

function handleArtInfo(info = {}) {
  const cacheKey = `${globalState.version}_art_${info.id}`;
  const cacheInfo = storageSession.get(cacheKey);
  if (cacheInfo) {
    return cacheInfo;
  }
  const item = formatArt(info);
  storageSession.set(cacheKey, item, {day: 1});
  return item;
}

const params = ref({
  keyword: '',
  type: -1,
});

const typeOptions = computed(() => {
  const list = [{value: -1, label: '全部'}];
  for (let key in itmTypeMap) {
    if (key < 1 || key > 7) {
      continue;
    }
    list.push({value: key, label: itmTypeMap[key]});
  }
  return list;
});

function search() {
  let {keyword, type} = params.value;
  keyword = (keyword + '').replace(/[\[\]{}"', ]/g, '');
  type = Number(type);
  if (!keyword && type < 1) {
    art.value = [...artAll.value];
    active.value = art.value[0].id;
    return;
  }
  art.value = artAll.value.filter(item => {
    if (type > 0 && item.type !== type) {
      return false;
    }
    if (keyword) {
      const reg = new RegExp(keyword, 'i');
      const keyType = {
        name: 'string',
        sectName: 'string',
        inherit: 'object',
        tra: 'object',
        move: 'object',
        initiative: 'object',
      };
      let itemStr = '';
      for (let key in keyType) {
        itemStr += keyType[key] === 'object' ? JSON.stringify(item[key]) : item[key];
      }
      return reg.test(itemStr);
    }
    return true;
  });
  active.value = 0;
}

function clear() {
  params.value = {
    keyword: '',
    type: -1,
  };
  art.value = [...artAll.value];
  active.value = 0;
}

onBeforeMount(() => {
  init();
});

function getArt() {
  return checkedIds;
}

defineExpose({
  getArt,
  clear,
});
</script>
<style lang="less">

</style>