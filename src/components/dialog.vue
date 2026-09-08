<template>
  <teleport to="body">
    <dialog class="v-dialog" :class="dialogClass" closedby="any" ref="dialogRef">
      <header class="v-dialog-header" v-show="header">
        <a href="javascript: void 0;" class="v-dialog-close icon-add" @click="close"></a>
        <slot name="header"></slot>
      </header>
      <div class="v-dialog-main">
        <slot></slot>
      </div>
      <footer class="v-dialog-footer" v-show="footer">
        <slot name="footer"></slot>
      </footer>
    </dialog>
  </teleport>
</template>
<script setup>
import {onMounted, useTemplateRef} from 'vue';
import {globalState} from '@/store/global';

const props = defineProps({
  header: {
    type: Boolean,
    default: true,
  },
  footer: {
    type: Boolean,
    default: true,
  },
  width: {
    type: [Number, String],
  },
  dialogClass: {
    type: String,
  },
});
const dialogRef = useTemplateRef('dialogRef');

function show() {
  dialogRef.value.showModal();
  dialogRef.value.scrollTop = 0;
}

function close() {
  dialogRef.value.close();
}

onMounted(() => {
  if (props.width) {
    let width = props.width;
    if (typeof props.width === 'number') {
      width += 'px';
    }
    dialogRef.value.style.setProperty('--dialog-width', width);
    return;
  }
  if (globalState.lessWindow) {
    dialogRef.value.style.setProperty('--dialog-width', '90vw');
  }
});
defineExpose({
  show,
  close,
});
</script>
<style lang="less">
.v-dialog {
  --dialog-width: auto;

  top: 50%;
  left: 50%;
  max-width: 90vw;
  width: var(--dialog-width);
  border: 0;
  border-radius: 4px;
  transform: translate(-50%, -50%);
  overflow-x: hidden;
  overflow-y: auto;

  .v-dialog-header {
    position: sticky;
    top: 0;
    z-index: 2;
    padding: 15px 10px 5px;
    background: #fff;
    font-size: 16px;
  }

  .v-dialog-main {
    padding: 10px;
  }

  .v-dialog-footer {
    position: sticky;
    bottom: 0;
    z-index: 2;
    padding: 5px 10px 10px;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;

    .v-button {
      margin: 0 5px;
    }
  }

  .v-dialog-close {
    --icon-width: 16px;
    --icon-rotate: 45deg;
    --icon-color: var(--color-error);

    position: absolute;
    top: 15px;
    right: 10px;
    z-index: 3;
  }
}
</style>