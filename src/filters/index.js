/*
 * @Author: Song Qing
 * @Date: 2021-06-21 17:01:04
 * @LastEditTime: 2021-06-23 13:10:53
 * @LastEditor: Song Qing
 * @Description: 全局过滤器
 * @FilePath: \mobile-vue-vant\app-test\src\filters\index.js
 */
import dayjs from 'dayjs'

export default (Vue) => {
  Vue.filter('dateFormat', (v, format = 'YYYY-MM-DD HH:mm:ss') => {
    try {
      if (!v) return v
      return dayjs(new Date(v)).format(format)
    } catch (error) {
      return v
    }
  })
  Vue.filter('numberAddThousands', (v) => {
    if (!+v) return v
    try {
      const num = Math.floor(v)
      return num.toLocaleString(['en-US', 'en-GB'])
    } catch (error) {
      return v
    }
  })
}
