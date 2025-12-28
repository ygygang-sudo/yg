import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const COMPANY: AppRouteRecordRaw = {
  path: '/company',
  name: 'company',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.company',
    requiresAuth: true,
    icon: 'icon-company',
    order: 3,
  },
  children: [
    {
      path: 'list', // The midline path complies with SEO specifications
      name: 'CompanyList',
      component: () => import('@/views/company/index.vue'),
      meta: {
        locale: 'menu.company.list',
        requiresAuth: true,
        roles: ['admin', 'user'],
      },
    },
  ],
};

export default COMPANY;
