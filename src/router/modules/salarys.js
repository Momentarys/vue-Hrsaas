import Layout from '@/layout'
export default {
  path: '/salarys',
  component: Layout,
  children: [
    {
      path: '',
      name: 'salarys',
      component: () => import('@/views/yemian/salarys'),
      meta: { title: '工资', icon: 'money' }
    }
  ]
}
