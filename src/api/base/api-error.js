/*
 * @Author: Song Qing
 * @Date: 2021-04-22 15:50:04
 * @LastEditTime: 2021-06-18 13:16:56
 * @LastEditor: Song Qing
 * @Description: 错误代码
 * @FilePath: \mobile-vue-vant\app-test\src\api\base\api-error.js
 */
export const tokenInvalidate = '-401'
export const tokenLoginother = '-402'
export const errors = [
  { code: '-1', message: '服务器系统异常' },
  { code: '-201', message: '账号或者密码错误' },
  { code: '-202', message: '无法找到该用户' },
  { code: tokenInvalidate, message: 'Token已失效或不存在' },
  { code: tokenLoginother, message: '账号已在其他地方登陆，请重新登录' }
]
export const getMessage = (code, msg) => {
  const one = errors.find((v) => v.code === code)
  return one.message || msg
}
