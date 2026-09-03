<template>
  <v-table
    class="v-table-bond"
    :cols="thead"
    :data="tbody"
    :loading="globalState.loading"
  >
    <template #effect="{row}">
      <div class="td-block">
        <div
          class="td-effect-item"
          v-for="(item, index) of row.effect"
          :key="index"
        >
          {{ item }}
        </div>
      </div>
    </template>
  </v-table>
</template>

<script setup>
import {onBeforeMount, ref} from 'vue';
import {globalState} from '@/store/global';
import bondData from '@/v107/data/chr/bond';
import chrAll from '@/v107/data/chr';

const thead = [
  {
    key: 'name',
    name: '名称',
  },
  {
    key: 'person',
    name: '人物',
  },
  {
    key: 'effect',
    name: '效果',
  },
];
const tbody = ref([]);

function init() {
  tbody.value = [];
  for (let item of bondData) {
    if (item.type === 0) {
      continue;
    }
    const chrArr = item.chr.map(i => chrAll[i]?.name ?? '');
    item.person = chrArr.join('+');
    tbody.value.push(item);
  }
}

onBeforeMount(() => {
  init();
});
</script>

<style lang="less">
.v-table-bond {
  .td {
    &:nth-child(1) {
      flex: 0 0 100px;
    }

    &:nth-child(3) {
      flex: 2 0 0;
    }
  }
}
</style>
