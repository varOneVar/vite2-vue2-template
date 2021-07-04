/* eslint-disable no-param-reassign */
/*
 * @Author: Song Qing
 * @Date: 2021-04-22 15:57:28
 * @LastEditTime: 2021-04-26 15:29:01
 * @LastEditor: Song Qing
 * @Description: 取消重复请求
 * @FilePath: \app-test\src\api\base\api-cancel.js
 */
import axios from 'axios'
import { generateReqKey } from './handlers'

/**
 * 取消重复请求 OLOO
 */
const cancelRepeatRequestBase = {
  add(config) {
    const flag = generateReqKey(config)
    config.cancelToken = new axios.CancelToken((cancel) => {
      if (!this.requestPool) {
        this.requestPool = new Map()
      }
      this.requestPool.set(flag, cancel)
    })
  },
  remove(config) {
    const flag = generateReqKey(config)
    if (!this.requestPool) return
    const cancelHandler = this.requestPool.get(flag)
    if (cancelHandler) {
      cancelHandler(flag) // 可以传递message
      this.requestPool.delete(flag)
    }
  }
}
export default function cancelRepeatRequest() {
  return Object.create(cancelRepeatRequestBase)
}
