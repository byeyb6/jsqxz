<template>
  <div class="v-search">
    <div class="v-search-item">
      <v-input
        class="item-value"
        placeholder="效果"
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
    class="v-table-effect"
    :cols="thead"
    :data="tbody"
    :loading="globalState.loading"
  >
    <template #id="{row}">
      <span :class="{[`level-${row.level}`]: row.level < 5, 'level-5': row.level >= 5}">
        {{ row.id }}
      </span>
    </template>
  </v-table>
</template>

<script setup>
import {computed, onBeforeMount, ref} from 'vue';
import {globalState} from '@/store/global';
import effectData from '@/v107/data/chr/talent/effect';

const thead = [
  {
    key: 'id',
    name: '序号',
  },
  {
    key: 'desc',
    name: '效果',
  },
  {
    key: 'level',
    name: '等级',
  },
];
const allData = computed(() => {
  const arr = [];
  for (let id in effectData) {
    const {score} = effectData[id];
    if (score <= 0) {
      continue;
    }
    arr.push(effectData[id]);
  }
  return arr;
});
const tbody = ref([]);

const params = ref({
  keyword: '',
});

function search() {
  if (!params.value.keyword) {
    tbody.value = [...allData.value];
    return;
  }
  const reg = new RegExp(params.value.keyword, 'i');
  tbody.value = allData.value.filter(item => {
    return reg.test(item.desc);
  });
}

onBeforeMount(() => {
  search();
});
</script>

<style lang="less">
.v-table-effect {
  --height-slide: 166px;

  .td {
    &:nth-child(1) {
      flex: 0 0 100px;
    }

    &:nth-child(3) {
      flex: 0 0 80px;
    }

    &:nth-child(4) {
      flex: 0 0 80px;
    }
  }
}
</style>
