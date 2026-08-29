<template>
  <div
    class="app"
    :class="{'is-less-window': globalState.lessWindow}"
  >
    <header-nav></header-nav>
    <router-view
      class="app-view"
    ></router-view>
    <v-loading
      :loading="globalState.loading"
    ></v-loading>
  </div>
</template>

<script setup>
import {onMounted, watch} from 'vue';
import HeaderNav from '@/views/layout/header.vue';
import VLoading from '@/components/loading.vue';
import {useRoute} from 'vue-router';
import {globalState} from '@/store/global';

const route = useRoute();

onMounted(() => {
  const media = window.matchMedia(
    'screen and (max-width: 600px)',
  );
  globalState.lessWindow = media.matches;
  globalState.menuVisible = !media.matches;
  media.onchange = e => {
    globalState.lessWindow = e.matches;
    globalState.menuVisible = !e.matches;
  };
});

watch(
  () => route.name,
  val => {
    if (globalState.lessWindow) {
      globalState.menuVisible = false;
    }
    const version = val.slice(0, 4);
    if (version === globalState.version) {
      return;
    }
    globalState.version = !globalState.versionAll[version] ? globalState.versionMax : version;
  },
);

</script>

<style lang="less">
.app {
  min-width: 400px;
  height: 100vh;
  background: #f6f5f1;

  .app-view {
    height: calc(100% - var(--header-height) - 10px);
  }
}

@media screen and (max-width: 600px) {
  .app {
    .menu {
      position: absolute;
    }
  }
}
</style>
