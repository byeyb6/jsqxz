<template>
  <v-scroll class="home-wrap">
    <h4 class="home-title">金书群侠传1.08简易攻略</h4>
    <pre class="pre-log">
      开发中，敬请期待...
    </pre>
  </v-scroll>
</template>
<script setup>
import {useRouter} from 'vue-router';
import {onBeforeMount} from 'vue';

const router = useRouter();

onBeforeMount(() => {
  router.replace({name: 'v107index'});
});
</script>
<style lang="less">
.home-wrap {
  background: #fff;

  .home-title {
    padding: 30px 0 10px;
    text-align: center;
    font-size: 20px;
  }
}
</style>
