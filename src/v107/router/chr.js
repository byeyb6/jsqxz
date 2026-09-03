import {bookMap} from '@/v107/data/map';

const bookChildren = [];
for (let key in bookMap) {
  bookChildren.push({
    path: key,
    component: () => import('@/v107/views/chr/book.vue'),
    name: 'v107chrBook' + key.replace(key[0], key[0].toUpperCase()),
    meta: {
      title: bookMap[key],
      type: key,
    },
  });
}

export default {
  path: 'chr',
  component: () => import('@/views/layout/layout.vue'),
  name: 'v107chr',
  redirect: {name: 'v107chrSect'},
  meta: {
    title: '人物',
  },
  children: [
    {
      path: 'sect',
      component: () => import('@/v107/views/chr/sect.vue'),
      name: 'v107chrSect',
      meta: {
        title: '门派',
      },
    },
    {
      path: 'search',
      component: () => import('@/v107/views/chr/search.vue'),
      name: 'v107chrSearch',
      meta: {
        title: '人物查询',
      },
    },
    {
      path: 'book',
      component: () => import('@/views/layout/router-view.vue'),
      name: 'v107chrBook',
      redirect: {name: 'v107chrBookFei'},
      meta: {
        title: '畅想',
      },
      children: bookChildren,
    },
    {
      path: 'special',
      component: () => import('@/v107/views/chr/book.vue'),
      name: 'v107chrSpecial',
      meta: {
        title: '特殊',
        type: 'special',
      },
    },
    {
      path: 'talent',
      component: () => import('@/v107/views/chr/talent.vue'),
      name: 'v107chrTalent',
      meta: {
        title: '天赋',
      },
    },
    {
      path: 'bond',
      component: () => import('@/v107/views/chr/bond.vue'),
      name: 'v107chrBond',
      meta: {
        title: '羁绊',
      },
    },
  ],
};
