/*
 * @Author: Song Qing
 * @Date: 2021-06-17 11:10:36
 * @LastEditTime: 2021-06-24 13:29:11
 * @LastEditor: Song Qing
 * @Description: 权限路由，根据接口返回的角色做处理
 * @FilePath: \mobile-vue-vant\app-test\src\router\asyncRoutes.js
 */

import Layout from '@/layout'
// import emptyPage from '@/views/system/emptyPage'

export default [
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    name: 'home',
    children: [
      {
        path: 'home',
        component: () => import('@/views/workbench/FChanrts')
      }
    ]
  }
]
