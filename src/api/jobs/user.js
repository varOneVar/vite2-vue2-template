/*
 * @Author: Song Qing
 * @Date: 2021-04-25 18:04:22
 * @LastEditTime: 2021-06-18 14:24:52
 * @LastEditor: Song Qing
 * @Description: 用户相关接口
 * @FilePath: \mobile-vue-vant\app-test\src\api\jobs\user.js
 */
import service from '@/api/base/api-interceptor'

const { __post } = service
const prefix = '/mock-server/user'
export const apiUseLogin = (args) =>
  __post(`${prefix}/login`, args, {
    cache: false
  })
export const apiUseLogout = (args) =>
  __post(`${prefix}/logout`, args, {
    cache: false
  })
