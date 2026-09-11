<template>
  <div class="markdown-wrap" v-html="html"></div>
</template>
<script setup>
import {onBeforeMount, ref} from 'vue';
import {marked} from 'marked';

const props = defineProps({
  text: {
    type: String,
    default: '',
  },
});
const html = ref('');

onBeforeMount(() => {
  html.value = marked.parse(props.text);
});
</script>