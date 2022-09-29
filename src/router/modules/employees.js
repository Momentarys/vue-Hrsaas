import Layout from '@/layout'
export default {
  path: '/employees',
  component: Layout,
  children: [
    {
      path: '',
      name: 'employees',
      component: () => import('@/views/yemian/employees'),
      meta: { title: '员工', icon: 'people' }
    }
  ]
}
