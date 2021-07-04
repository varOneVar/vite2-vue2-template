/*
 * @Author: Song Qing
 * @Date: 2021-06-17 16:05:16
 * @LastEditTime: 2021-06-21 15:55:33
 * @LastEditor: Song Qing
 * @Description: 统一管理storage的名称
 * @FilePath: \mobile-vue-vant\app-test\src\utils\storage.js
 */

//  https://github.com/ustbhuangyi/storage
import storage from 'good-storage'
import settings from '@/settings'

export function createStorageInstance({ key = settings.appName, method = 'session' } = {}) {
  const store = method === 'session' ? storage.session : storage
  return {
    set(k, v) {
      store.set(`${key}__${k}`, v)
    },
    get(k) {
      return store.get(`${key}__${k}`)
    },
    remove(k) {
      store.remove(`${key}__${k}`)
    },
    clear() {
      store.clear()
    }
  }
}

const instance = createStorageInstance()

export default instance
