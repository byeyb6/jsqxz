<template>
  <div class="layout">
    <transition name="fade">
      <div
        class="menu-mask"
        @click="closeMenu"
        v-show="globalState.lessWindow && globalState.menuVisible"
      ></div>
    </transition>
    <transition name="fade">
      <v-menu :menu="menus" v-show="globalState.menuVisible"></v-menu>
    </transition>
    <div class="main">
      <bread-nav :nav="breads"></bread-nav>
      <v-scroll class="main-scroll" view-class="main-scroll-view" :y="y">
        <router-view></router-view>
      </v-scroll>
    </div>
  </div>
</template>

<script setup>
import {watchEffect, ref} from 'vue';
import {useRoute, onBeforeRouteUpdate} from 'vue-router';
import {routes} from '@/router';
import VMenu from './menu.vue';
import BreadNav from './bread-nav.vue';
import {globalState} from '@/store/global';

const route = useRoute();
const menus = ref([]);
const breads = ref([]);
watchEffect(() => {
  const matched = [...route.matched];
  const routeRootName = breads.value[1] ? breads.value[1].name : '';
  breads.value = matched;
  if (routeRootName === matched[1].name) {
    return;
  }
  const parentRoute = routes.find(item => item.name === globalState.version);
  if (!parentRoute) {
    return;
  }
  const currentRoute = parentRoute.children.find(item => item.name === matched[1].name);
  if (currentRoute) {
    menus.value = currentRoute.children ? currentRoute.children : [];
  }
});

function closeMenu() {
  globalState.menuVisible = false;
}

const y = ref(0);
onBeforeRouteUpdate(() => {
  y.value = y.value === 0 ? 1 : 0;
});
</script>

<style lang="less">
.layout {
  position: relative;
  display: flex;

  .main {
    flex: 1;
    background: #fff;
  }

  .main-scroll {
    height: calc(100% - 50px);
    width: 100%;
  }

  .main-scroll-view {
    padding: 0 20px 20px;
  }

  .menu-mask {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .2);
  }
}
</style>
