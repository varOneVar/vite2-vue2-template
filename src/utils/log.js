/*
 * @Author: Song Qing
 * @Date: 2021-06-17 13:40:14
 * @LastEditTime: 2021-06-17 16:02:26
 * @LastEditor: Song Qing
 * @Description: 控制台输出
 * @FilePath: \mobile-vue-vant\app-test\src\utils\log.js
 */
import colors from '@/styles/element-variables.scss'
import { typeCheck } from './util'

function printMessage(options, ...message) {
  const paramsType = typeCheck(options)
  if (paramsType === 'Object') {
    const { msg, type = 'primary' } = options
    if (!msg) {
      console.log('%c%s%o', '看这里', options, ...message)
      return
    }
    const level = ['primary', 'success', 'warning', 'danger', 'info'].includes(type)
      ? `ex-${type}`
      : 'ex-primary'
    const style = `border-radius:4px;padding: 3px 15px; background:${colors[level]};color:#fff;font-size:12px;`
    console.log('%c%s', style, msg)
  } else {
    console.log('%c%s%o', '看这里', options, ...message)
  }
}

export default process.env.NODE_ENV === 'production' ? Function.prototype : printMessage
