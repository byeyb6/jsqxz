<template>
  <div class="plan-wrap">
    <div class="plan-art">
      <div class="art-item"></div>
    </div>
    <div @click="openArt">232344</div>
  </div>
  <v-dialog
    ref="dialogRef"
    dialog-class="dialog-art"
    :width="globalState.lessWindow ? '80vw' : undefined"
  >
    <v-art ref="artRef" :id="artId"></v-art>
    <template #header>
      <div>选择武功</div>
    </template>
    <template #footer>
      <div>
        <v-button type="primary" @click="chooseArt">确定</v-button>
        <v-button @click="closeArt">取消</v-button>
      </div>
    </template>
  </v-dialog>
</template>
<script setup>
import {ref, useTemplateRef} from 'vue';
import VDialog from '@/components/dialog';
import VArt from '@/v107/views/art/search';
import {globalState} from '@/store/global';
import artMap from '@/v107/data/art/list';

const dialogRef = useTemplateRef('dialogRef');
const artRef = useTemplateRef('artRef');
const artId = ref(-1);

function openArt() {
  dialogRef.value.show();
}

function closeArt() {
  dialogRef.value.close();
  artId.value = -1;
}

function chooseArt() {
  const art = artRef.value.getArt();
  closeArt();
}
</script>
<style lang="less">

</style>