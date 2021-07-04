/*
 * @Author: Song Qing
 * @Date: 2021-06-17 16:50:53
 * @LastEditTime: 2021-06-24 09:33:57
 * @LastEditor: Song Qing
 * @Description: 接口中的用户信息
 * @FilePath: \mobile-vue-vant\app-test\src\utils\client-info.js
 */
import { v4 as uuidV4 } from 'uuid'
import { MessageBox } from 'element-ui'
import settings from '@/settings'
import store from '@/store'
import router from '@/router'
import storage from '@/utils/storage'
import { encrypt } from '@/utils/crypto'
import { SESSION_KEY } from '@/constants'

export function getClientInfo() {
  const clientInfo = {
    id: uuidV4(),
    lg: (navigator.language || navigator.browserLanguage).toLowerCase(),
    ti: new Date().getTime(),
    tz: new Date().getTimezoneOffset(),
    av: settings.appVersion,
    an: settings.appName,
    us: store.getters.userId,
    dt: store.getters.deviceType,
    do: store.getters.deviceOs
  }
  return encrypt(JSON.stringify(clientInfo), 'client')
}

// 前往统一登录页面
export const goLoginPortal = () => {
  router.push('/login')
}

// 失败重新登录处理
export function failDispose({ content, msgType = 'warning', isShowMsg = true }) {
  const fn = () => {
    store.dispatch('user/ganSuiTamen')
  }
  if (isShowMsg) {
    MessageBox.alert(content, '提示', {
      confirmButtonText: '确定',
      showClose: false,
      type: msgType,
      callback: fn
    })
  } else {
    fn()
  }
}

export const checkTimeout = async () => {
  try {
    const time = storage.get(SESSION_KEY.checkToken)
    if (!time) {
      storage.set(SESSION_KEY.checkToken, Date.now())
    } else {
      // 如果超过30分钟没调用接口，退出登录
      if (Date.now() - time >= 30 * 60 * 1000) {
        storage.remove(SESSION_KEY.checkToken)
        await store.dispatch('user/loginOutByToken')
        return
      }
      // 如果没超过，就重新设置当前时间
      storage.set(SESSION_KEY.checkToken, Date.now())
    }
  } catch (error) {
    console.log(error)
  }
}
