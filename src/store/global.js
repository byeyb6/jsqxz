import {reactive} from 'vue';

export const globalState = reactive({
  loading: false,
  menuVisible: true,
  lessWindow: false,
  version: 'v107',
  versionMax: 'v107',
  versionAll: {
    // v108: 'v1.08',
    v107: 'v1.07',
  },
});