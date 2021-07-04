/*
 * @Author: Song Qing
 * @Date: 2021-06-18 09:46:56
 * @LastEditTime: 2021-06-18 16:36:23
 * @LastEditor: Song Qing
 * @Description: 加密解密
 * @FilePath: \mobile-vue-vant\app-test\src\utils\crypto.js
 */

import CryptoJS from 'crypto-js'
import { CLIENT_INFO_SECRET, LOGIN_SECRET } from '@/constants'

const secretTypes = {
  login: LOGIN_SECRET,
  client: CLIENT_INFO_SECRET
}

const iv = CryptoJS.enc.Latin1.parse('NZS3AOnvhlwXIbQi')
/**
 * @param {*需要加密的字符串 注：对象转化为json字符串再加密} word
 * @param {*aes加密需要的key值，这个key值后端同学会告诉你} keyStr
 */
export function encrypt(word, type = 'login') {
  if (!word || !type) {
    throw Error(
      '【encrypt参数缺失】第一个参数为需要加密的字段，第二个参数为加密类型：client、login'
    )
  }
  if (!['client', 'login'].includes(type)) {
    throw Error('【encrypt类型不正确】加密类型支持：client、login')
  }
  const keyStr = CryptoJS.enc.Latin1.parse(secretTypes[type])
  // 加密
  const encrypted = CryptoJS.AES.encrypt(decodeURIComponent(word), keyStr, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.ZeroPadding
  })
  return encrypted.toString()
}

export function decrypt(word, type = 'login') {
  if (!word || !type) {
    throw Error('【decrypt参数缺失】第一个参数为加密字符，第二个参数为加密类型：client、login')
  }
  if (!['client', 'login'].includes(type)) {
    throw Error('【decrypt类型不正确】加密类型支持：client、login')
  }
  const keyStr = CryptoJS.enc.Latin1.parse(secretTypes[type])
  // 解密
  const decryptStr = CryptoJS.AES.decrypt(decodeURIComponent(word), keyStr, {
    iv,
    padding: CryptoJS.pad.ZeroPadding
  })
  return decryptStr.toString(CryptoJS.enc.Utf8)
}
