import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

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
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: '首页',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },

  {
    path: '/user_manage',
    component: Layout,
    redirect: '/user_manage',
    meta: { title: '用户管理', icon: 'el-icon-user' },
    alwaysShow: true,
    children: [
      {
        path: 'user_list',
        name: '用户列表',
        component: () => import('@/views/user/list/index'),
        meta: { title: '用户列表', icon: 'el-icon-user' }
      }
    ]
  },

  {
    path: '/movie_manage',
    component: Layout,
    redirect: '/movie_manage/index',
    name: '电影信息管理',
    meta: { title: '电影信息管理', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'index',
        name: '电影基础信息',
        component: () => import('@/views/movie/list/index'),
        meta: { title: '电影基础信息管理', icon: 'table' }
      },
      {
        path: 'video',
        name: '电影视频',
        component: () => import('@/views/movie/video/index'),
        meta: { title: '电影视频管理', icon: 'el-icon-upload2' }
      },
      {
        path: 'video/addForm',
        name: '添加电影视频',
        component: () => import('@/views/movie/video/addFrom'),
        meta: { title: '电影视频添加' },
        hidden: true
      },
      {
        path: 'movie_comment',
        name: '电影评论管理',
        component: () => import('@/views/movie/comment/index'),
        meta: { title: '电影评论管理', icon: 'el-icon-chat-line-round' }
      }
    ]
  },

  {
    path: '/type_manage',
    component: Layout,
    redirect: '/type_manage',
    name: '电影分类管理',
    meta: { title: '电影分类管理', icon: 'el-icon-more' },
    alwaysShow: true,
    children: [
      {
        path: 'type_list',
        name: '分类列表',
        component: () => import('@/views/type/list/index'),
        meta: { title: '分类列表', icon: 'el-icon-more' }
      }
    ]
  },

  {
    path: '/comment_manage',
    component: Layout,
    redirect: '/comment_manage/index',
    name: '论坛管理',
    meta: { title: '论坛管理', icon: 'el-icon-chat-dot-round' },
    children: [
      {
        path: 'index',
        name: '文章管理',
        component: () => import('@/views/forum/essay/index'),
        meta: { title: '文章管理', icon: 'el-icon-notebook-1' }
      },
      {
        path: 'essay_comment',
        name: '文章评论管理',
        component: () => import('@/views/forum/comment/index'),
        meta: { title: '文章评论管理', icon: 'el-icon-chat-square' }
      },
    ]
  },

  {
    path: '/system_manage',
    component: Layout,
    redirect: '/system_manage',
    name: '系统管理',
    meta: { title: '系统管理', icon: 'el-icon-setting' },
    children: [
      {
        path: 'home',
        name: '首页管理',
        component: () => import('@/views/system/home/index'),
        meta: { title: '首页管理', icon: 'el-icon-house' },
        children: [
          {
            path: 'carousel',
            component: () => import('@/views/system/home/carousel/index'),
            name: '首页轮播设置',
            meta: { title: '轮播图设置' }
          },
          {
            path: 'recommender',
            component: () => import('@/views/system/home/recommender/index'),
            name: '系统推荐设置',
            meta: { title: '系统推荐设置' }
          }
        ]
      },
      {
        path: 'log',
        name: '日志管理',
        component: () => import('@/views/system/log/index'),
        meta: { title: '日志管理', icon: 'el-icon-document' }
      }
    ]
  },


  {
    path: '/admin_manage',
    component: Layout,
    redirect: '/admin_manage/admin_manage',
    children: [{
      path: '/admin_manage',
      name: '信息',
      component: () => import('@/views/admin/info/index'),
      meta: { title: '信息', icon: 'dashboard' },
    }],
    hidden: true
  },
  // 404 page must be placed at the end !!!
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
