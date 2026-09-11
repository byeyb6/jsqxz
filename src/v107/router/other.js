export default {
  path: 'other',
  component: () => import('@/views/layout/layout.vue'),
  name: 'v107other',
  redirect: {name: 'v107otherOnline'},
  meta: {
    title: '说明',
  },
  children: [
    {
      path: 'online',
      component: () => import('@/v107/views/other/online.vue'),
      name: 'v107otherOnline',
      meta: {
        title: '联网说明',
      },
    },
    {
      path: 'log',
      component: () => import('@/v107/views/other/log.vue'),
      name: 'v107otherLog',
      meta: {
        title: '更新日志',
      },
    },
    {
      path: 'system',
      component: () => import('@/v107/views/other/system.vue'),
      name: 'v107otherSystem',
      meta: {
        title: '系统说明',
      },
    },
    {
      path: 'meridian',
      component: () => import('@/v107/views/other/meridian.vue'),
      name: 'v107otherMeridian',
      meta: {
        title: '经脉',
      },
    },
    {
      path: 'state',
      component: () => import('@/v107/views/other/state.vue'),
      name: 'v107otherState',
      meta: {
        title: '状态',
      },
    },
    {
      path: 'keymap',
      component: () => import('@/v107/views/other/keymap.vue'),
      name: 'v107otherKeymap',
      meta: {
        title: '快捷键',
      },
    },
  ],
};
