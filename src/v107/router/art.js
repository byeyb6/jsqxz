import {artTypeMap} from '@/v107/data/map';

const artList = [
  {id: 6, key: 'inn'},
  {id: 7, key: 'dod'},
  {id: 1, key: 'una'},
  {id: 2, key: 'fin'},
  {id: 3, key: 'swd'},
  {id: 4, key: 'bld'},
  {id: 5, key: 'spc'},
];
const children = [];

for (let item of artList) {
  const {id, key} = item;
  const child = {
    path: key,
    name: 'v107art' + key.replace(key[0], key[0].toUpperCase()),
    meta: {
      title: artTypeMap[id],
      type: id,
    },
  };
  children.push({
    ...child,
    component: () => import('@/v107/views/art/index.vue'),
  });
}

export default {
  path: 'art',
  component: () => import('@/views/layout/layout.vue'),
  name: 'v107art',
  redirect: {name: 'v107artInn'},
  meta: {
    title: '武功',
  },
  children: [
    {
      path: 'search',
      component: () => import('@/v107/views/art/search.vue'),
      name: 'v107artSearch',
      meta: {
        title: '武功查询',
        type: 'search',
      },
    },
    ...children,
    {
      path: 'knw',
      component: () => import('@/v107/views/art/knw.vue'),
      name: 'v107artKnw',
      meta: {
        title: '杂学',
        type: 8,
      },
    },
    {
      path: 'inherit',
      component: () => import('@/v107/views/art/inherit.vue'),
      name: 'v107artInherit',
      meta: {
        title: '一脉相承',
        type: 'inherit',
      },
    },
    {
      path: 'secret',
      component: () => import('@/v107/views/art/secret.vue'),
      name: 'v107artSecret',
      meta: {
        title: '秘技',
        type: 'secret',
      },
    },
  ],
};
