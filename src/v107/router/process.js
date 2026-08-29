import {bookMap} from '@/v107/data/map';
const bookChildren = [];

for (let key in bookMap) {
  bookChildren.push({
    path: key,
    component: () => import('@/v107/views/process/table.vue'),
    name: 'v107processBook' + key.replace(key[0], key[0].toUpperCase()),
    meta: {
      title: bookMap[key],
      type: key,
    },
  });
}

export default {
  path: 'process',
  component: () => import('@/views/layout/layout.vue'),
  name: 'v107process',
  redirect: {name: 'v107processStart'},
  meta: {
    title: '流程',
  },
  children: [
    {
      path: 'record',
      component: () => import('@/v107/views/process/record.vue'),
      name: 'v107processRecord',
      meta: {
        title: '战报',
        type: 'record',
      },
    },
    {
      path: 'start',
      component: () => import('@/v107/views/process/table.vue'),
      name: 'v107processStart',
      meta: {
        title: '开局搜刮',
        type: 'start',
      },
    },
    {
      path: 'luk',
      component: () => import('@/v107/views/process/table.vue'),
      name: 'v107processLuk',
      meta: {
        title: '江湖轶事',
        type: 'luk',
      },
    },
    {
      path: 'book',
      component: () => import('@/views/layout/router-view.vue'),
      name: 'v107processBook',
      redirect: {name: 'v107processBookFei'},
      meta: {
        title: '天书流程',
      },
      children: bookChildren,
    },
    {
      path: 'huashan',
      component: () => import('@/v107/views/process/table.vue'),
      name: 'v107processHuashan',
      meta: {
        title: '华山论剑',
        type: 'huashan',
      },
    },
    {
      path: 'wudao',
      component: () => import('@/v107/views/process/table.vue'),
      name: 'v107processWudao',
      meta: {
        title: '武道大会',
        type: 'wudao',
      },
    },
  ],
};
