import {itmTypeMap} from '@/v107/data/map';
import shopMap from '@/v107/data/itm/shop';

const typeList = [
  {id: 22, key: 'pot'},
  {id: 23, key: 'thr'},
  {id: 11, key: 'eqp'},
  {id: 12, key: 'arm'},
  {id: 13, key: 'mnt'},
];
const children = [];

for (let item of typeList) {
  const {id, key} = item;
  children.push({
    path: key,
    component: () => import('@/v107/views/itm/list.vue'),
    name: 'v107itm' + key.replace(key[0], key[0].toUpperCase()),
    meta: {
      title: itmTypeMap[id],
      type: id,
    },
  });
}

const shopChildren = [];
for (let key in shopMap) {
  shopChildren.push({
    path: key,
    component: () => import('@/v107/views/itm/shop.vue'),
    name: 'v107itmShop' + key.replace(key[0], key[0].toUpperCase()),
    meta: {
      title: shopMap[key].name,
      type: key,
    },
  });
}

export default {
  path: 'itm',
  component: () => import('@/views/layout/layout.vue'),
  name: 'v107itm',
  redirect: {name: 'v107itmPot'},
  meta: {
    title: '物品',
  },
  children: [
    ...children,
    {
      path: 'shop',
      component: () => import('@/views/layout/router-view.vue'),
      name: 'v107itmShop',
      redirect: {name: 'v107itmShopXiaocun'},
      meta: {
        title: '商店',
      },
      children: shopChildren,
    },
  ],
};
