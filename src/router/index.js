import Vue from 'vue'
import Router from 'vue-router'

import err404 from '@/views/system/error-page/404'
import refresh from '@/views/system/refresh'
import redirect from '@/views/system/redirect'
import asyncRoutes from './asyncRoutes'

Vue.use(Router)

const originalPush = Router.prototype.push
Router.prototype.push = function push(location, onResolve, onReject) {
  try {
    if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
    return originalPush.call(this, location).catch((err) => err)
  } catch (e) {
    console.error(e)
    return undefined
  }
}

const originalReplace = Router.prototype.replace
Router.prototype.replace = function replace(location, onResolve, onReject) {
  try {
    if (onResolve || onReject) return originalReplace.call(this, location, onResolve, onReject)
    return originalReplace.call(this, location).catch((err) => err)
  } catch (e) {
    console.error(e)
    return undefined
  }
}

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * onlyShowFirstChild: true     if set true, only show first item, don't show itself
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/* Router Modules */
export const constantRoutes = [
  {
    path: '/404',
    name: '404',
    hidden: true,
    component: err404
  },
  // 刷新页面 必须保留
  {
    path: '/refresh',
    name: 'refresh',
    hidden: true,
    component: refresh
  },
  // 页面重定向 必须保留
  {
    path: '/redirect/:path*',
    name: 'redirect',
    hidden: true,
    component: redirect
  }
]

const createRouter = (routers = []) => {
  return new Router({
    scrollBehavior: () => ({ y: 0 }),
    routes: [...constantRoutes, ...routers]
  })
}

const router = createRouter(asyncRoutes)

export function resetRouter(routers) {
  const newRouter = createRouter(routers)
  router.matcher = newRouter.matcher
}

export default router
