<template>
<div class="markdown-wrap" v-html="html"></div>
</template>
<script setup>
import {onBeforeMount, ref} from 'vue';
import {marked} from 'marked';
import text from '@/v107/data/other/network';

const html = ref('');

onBeforeMount(() => {
  html.value = marked.parse(text);
});
</script>