import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules
import componentsRouter from './modules/components'
import chartsRouter from './modules/charts'
import tableRouter from './modules/table'
import nestedRouter from './modules/nested'
*/
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
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'dashboard', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: 'profile', icon: 'user', noCache: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/user-management',
    component: Layout,
    redirect: '/user-management/OMPUser',
    name: 'UserManagement',
    meta: {
      title: 'userManagement',
      icon: 'peoples'
    },
    children: [
      {
        path: 'OMPUser',
        component: () => import('@/views/user-management/OMPUser'),
        name: 'OMPUser',
        meta: { title: 'OMPUser', icon: 'el-icon-link', roles: ['admin'] }
      },
      {
        path: 'schoolUser',
        component: () => import('@/views/user-management/schoolUser'),
        name: 'schoolUser',
        meta: { title: 'schoolUser', icon: 'el-icon-school', roles: ['admin'] }
      },
      {
        path: 'teacherUser',
        component: () => import('@/views/user-management/teacherUser'),
        name: 'teacherUser',
        meta: { title: 'teacherUser', icon: 'el-icon-user', roles: ['admin', 'school'] }
      },
      {
        path: 'studentUser',
        component: () => import('@/views/user-management/studentUser'),
        name: 'studentUser',
        meta: { title: 'studentUser', icon: 'el-icon-s-custom', roles: ['admin', 'school', 'teacher'] }
      }
    ]
  },
  {
    path: '/device-management',
    component: Layout,
    redirect: '/device-management/device',
    name: 'DeviceManagement',
    meta: {
      title: 'deviceManagement',
      icon: 'nested'
    },
    children: [
      {
        path: 'device',
        component: () => import('@/views/device-management/device'),
        name: 'device',
        meta: { title: 'device', icon: 'el-icon-s-operation', roles: ['admin', 'OMPadmin', 'school', 'teacher'] }
      },
      {
        path: 'PublicDevice',
        component: () => import('@/views/device-management/device'),
        name: 'deviceDevice',
        meta: { title: 'deviceDevice', icon: 'el-icon-s-operation', roles: ['admin', 'OMPadmin', 'school', 'teacher'] },
      },
      {
        path: 'deviceWarning',
        component: () => import('@/views/device-management/deviceWarning'),
        name: 'deviceWarning',
        meta: { title: 'deviceWarning', icon: 'el-icon-warning-outline', roles: ['admin', 'OMPadmin', 'school'] }
      },
      {
        path: 'details',
        component: () => import('@/views/device-management/details'),
        name: 'details',
        meta: { title: 'details', icon: 'el-icon-s-operation', roles: ['admin', 'OMPadmin', 'school', 'teacher'] },
        hidden: true
      },
      {
        path: 'state',
        component: () => import('@/views/device-management/state'),
        name: 'state',
        meta: { title: 'state', icon: 'el-icon-s-operation', roles: ['admin', 'OMPadmin', 'school', 'teacher'] },
        hidden: true
      }
    ]
  },
  {
    path: '/system-management',
    component: Layout,
    redirect: '/system-management/page',
    alwaysShow: true, // will always show the root menu
    name: 'systemManagement',
    meta: {
      title: 'systemManagement',
      icon: 'el-icon-setting'
    },
    children: [
      {
        path: 'role',
        component: () => import('@/views/system-management/role'),
        name: 'RolePermission',
        meta: {
          title: 'rolePermission',
          icon: 'el-icon-set-up',
          roles: ['admin']
        }
      },
      {
        path: 'monitor',
        component: () => import('@/views/system-management/monitor'),
        name: 'monitor',
        meta: {
          title: 'monitor',
          icon: 'el-icon-aim',
          roles: ['admin']
        }
      },
      {
        path: 'operation-log',
        component: () => import('@/views/system-management/operation-log'),
        name: 'operation-log',
        meta: {
          title: 'operationLog',
          icon: 'el-icon-news',
          roles: ['admin']
        }
      },
      {
        path: '/profile',
        component: Layout,
        redirect: '/profile/index',
        children: [
          {
            path: 'index',
            component: () => import('@/views/profile/index'),
            name: 'Profile',
            meta: {
              title: 'profile',
              icon: 'el-icon-s-tools',
              noCache: true
            }
          }
        ]
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
