<template>
  <div class="v-search">
    <div v-show="false" class="v-search-item" style="flex: 0 0 100px;">
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
    </div>
  </div>
  <v-tabs :list="art" key-name="id" v-model="active">
    <template #tab="{tab}">
      <span
        :class="{
            [`level-${tab.level}`]: tab.level,
            [`inner-${tab.inner}`]: tab.inner === 1 || tab.inner === 2,
          }"
      >
          {{ tab.name }}
        </span>
    </template>
    <template #title="{info}">
      <span
        :class="[
          `level-${info.level}`,
          {[`inner-${info.inner}`]: info.inner === 1 || info.inner === 2},
        ]"
      >
        {{ info.name }}
      </span>
    </template>
    <art-item v-if="info.id" :item="info" :key="info.id"></art-item>
  </v-tabs>
</template>
<script setup>
import {computed, ref, onBeforeMount, watch} from 'vue';
import artMap from '@/v107/data/art/list';
import ArtItem from './item';
import VSelect from '@/components/select';
import {storageSession} from '@/utils/storage';
import {formatArt} from '@/v107/data/art/effect/attr';
import {globalState} from '@/store/global';
import {itmTypeMap} from '@/v107/data/map';

const props = defineProps({
  id: {
    type: Number,
  },
});
const artAll = ref([]);
const art = ref([]);
const active = ref(1);

watch(() => props.id, id => {
  if (typeof id === 'number' && id > 0) {
    active.value = id;
  }
}, {immediate: true});

const info = computed(() => {
  if (artMap[active.value]) {
    return artMap[active.value];
  }
  return {};
});

// 初始化武功列表
function init() {
  globalState.loading = true;
  artAll.value = [];
  for (let id in artMap) {
    artAll.value.push(handleArtInfo(artMap[id]));
  }
  if (artAll.value.length > 0 && active.value < 1) {
    active.value = artAll.value[0].id;
  }
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
  active.value = art.value.length > 0 ? art.value[0].id : -1;
}

onBeforeMount(() => {
  init();
});

function getArt() {
  return info.value;
}

defineExpose({
  getArt,
});
</script>
<style lang="less">

</style>