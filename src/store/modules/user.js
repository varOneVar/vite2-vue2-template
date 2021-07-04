/*
 * @Author: Song Qing
 * @Date: 2021-06-17 16:30:47
 * @LastEditTime: 2021-06-22 15:42:20
 * @LastEditor: Song Qing
 * @Description: 用户登录相关
 * @FilePath: \mobile-vue-vant\app-test\src\store\modules\user.js
 */
import { apiUseLogin, apiUseLogout } from '@/api/jobs/user'
import { goLoginPortal } from '@/utils/client-info'
import { encrypt } from '@/utils/crypto'
import storage from '@/utils/storage'
import { Message } from 'element-ui'
import asyncRoutes from '@/router/asyncRoutes'
import { SESSION_KEY } from '@/constants'
// import { failDispose } from '@/utils'

const store = {
  userInfo: null, // 用户信息
  roles: [], // 权限id数组
  accessedRoutes: asyncRoutes, // 权限路由
  token: '' // token
}

const mutations = {
  CHANGE_USER_INFO(state, obj) {
    state.userInfo = obj
  },
  CHANGE_ROLES(state, arr) {
    state.roles = arr || []
  },
  CHANGE_ACCESSED_ROUTERS(state, arr) {
    state.accessedRoutes = arr || []
  },
  CHANGE_TOKEN(state, str) {
    state.token = str
  },
  CLEAR_USER_DATA(state) {
    state.token = ''
    state.userInfo = null
    state.accessedRoutes = []
    state.roles = []
  }
}
const actions = {
  // 退出登录一键三连
  ganSuiTamen({ commit }) {
    commit('CLEAR_USER_DATA')
    storage.remove(SESSION_KEY.checkToken) // 清除超时检测
    goLoginPortal() // 重新前往登录页
    Message.success('退出成功！')
  },
  // 登出
  async loginOutByToken({ dispatch, state }) {
    try {
      const { code } = await apiUseLogout({
        token: state.token
      })
      if (code === '0') {
        dispatch('ganSuiTamen')
      } else {
        Message.error('退出失败！')
      }
    } catch (error) {
      console.log(error)
    }
  },
  // 登录
  async loginByToken({ commit }, { userName, password }) {
    try {
      const { code, result, message } = await apiUseLogin({
        userName,
        password: encrypt(password)
      })
      if (code === '0') {
        commit('CHANGE_USER_INFO', result)
        commit('CHANGE_TOKEN', result.token)
      } else {
        Message.error(message || '登录失败！')
      }
    } catch (error) {
      console.log(error)
    }
  }
}

export default {
  namespaced: true,
  state: store,
  actions,
  mutations
}
