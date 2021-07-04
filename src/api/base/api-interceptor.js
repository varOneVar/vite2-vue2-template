import axios from 'axios'
import qs from 'query-string'
import { Message } from 'element-ui'

import store from '@/store'
import { getClientInfo, checkTimeout, failDispose } from '@/utils'
import { SUCCESS_CODE } from '@/constants'

import { getMessage, tokenInvalidate, tokenLoginother } from './api-error'
import retryAdapterEnhancer from './api-again'
import cacheAdapterEnhancer from './api-cache'
import cancelRepeatRequestBase from './api-cancel'
import { createAdapterMiddleareModel } from './handlers'

const APP = createAdapterMiddleareModel()
APP.use(
  // 断线重连, 延时时间每次翻倍
  retryAdapterEnhancer({
    times: 3, // 断线重连次数，最多七次，多了没必要
    delay: 1000 // 延时触发重连，2的指数性增加，1s, 2s, 4s,8s...
  })
)
APP.use(
  // 数据缓存
  cacheAdapterEnhancer({
    maxAge: 2 * 60 * 1000 // 缓冲有效期（ms）
  })
)
// 获取参数
function getParams(config) {
  const obj = {
    post: 'data',
    get: 'params'
  }
  const key = obj[config.method]
  if (config.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
    let result = {}
    const data = config[key]
    try {
      if (data) {
        result = qs.parse(data)
      }
      return result
    } catch (error) {
      return data
    }
  }
  return config[key]
}

// 创建请求实例
function createService() {
  // 取消重复请求
  const cancelRequest = cancelRepeatRequestBase()
  const adapter = APP.listen(axios.defaults.adapter)
  const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API,
    timeout: 60000 * 3,
    adapter // 适配器触发在顺序： 请求拦截器 -- 适配器 -- 响应拦截器
  })
  // 请求拦截
  service.interceptors.request.use(
    (config) => {
      checkTimeout() // 检查登录超时
      const params = getParams(config)
      const { token } = store.getters
      // header里添加权限
      if (token && !config.headers.Authorization) {
        config.headers.Authorization = JSON.stringify({ token })
        config.headers.clientInfo = getClientInfo()
      }
      // 如果参数带有noCancel则取消重复请求
      if (params.noCancel) {
        delete params.noCancel
      } else {
        cancelRequest.remove(config)
        cancelRequest.add(config)
      }
      // 加载全局loading
      if (params.noLoading) {
        store.commit('app/SET_CONTENT_LOADING', false)
        store.commit('app/SET_WHOLE_PAGE_LOADING', false)
        delete params.noLoading
      } else if (params.wholePageLoading) {
        store.commit('app/SET_WHOLE_PAGE_LOADING', true)
        delete params.wholePageLoading
      } else {
        store.commit('app/SET_CONTENT_LOADING', true)
      }
      console.log('请求拦截器')
      return config
    },
    (error) => {
      console.log('请求异常', error)
      // TODO: 错误弹窗
      Message({
        message: `请求异常 ${error.message}`,
        type: 'error',
        duration: 3 * 1000
      })
      return Promise.reject(error)
    }
  )
  // 响应拦截器
  service.interceptors.response.use(
    async (response) => {
      const {
        headers,
        data,
        config,
        data: { code, message }
      } = response
      // 取消重复请求
      cancelRequest.remove(config)
      // 处理blob数据
      if (config.responseType === 'blob' || (headers && headers['content-disposition'])) {
        if (config.filetype === 'pdf') {
          return data
        }
        return response
      }
      // token失效或者在别处登录
      if (code === tokenInvalidate || code === tokenLoginother) {
        failDispose({
          content: getMessage(code)
        })
        return data
      }
      // 异常code处理
      if (code !== SUCCESS_CODE) {
        Message({
          message: getMessage(code, message || '请求失败！'),
          type: 'error',
          duration: 3 * 1000
        })
        return data
      }
      return data
    },
    (error) => {
      console.log('响应错误', error)
      let code = ''
      if (error.response) {
        code = error.response.status
      } else if ('message' in error && !error.message) {
        console.log('取消重复请求', error)
        code = null
      } else {
        code = '网络已断开'
      }
      if (code !== null) {
        // TODO: 错误弹窗
        Message({
          message: `网络开小差(${code})`,
          type: 'error',
          duration: 3 * 1000
        })
      }
      return Promise.reject(error)
    }
  )

  return service
}

// 创建请求方法
function initServiceType(service) {
  return {
    // 常规get请求
    __get(url, args = {}, config = {}) {
      return service.get(url, { params: args, ...config })
    },
    // 常规post， json格式数据
    __post(url, args = {}, config = {}) {
      return service.post(url, args, config)
    },
    // 下载get请求
    __getExport(url, args = {}, config = {}) {
      return service.get(url, { params: args, responseType: 'blob', ...config })
    },
    // form表单请求
    __postEncode(url, args = {}, config = {}) {
      return service.post(url, qs.stringify(args), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        ...config
      })
    },
    // 上传文件
    __postUpload(url, data = new FormData(), config = {}) {
      return service.post(url, data, {
        headers: {
          'Cache-Control': 'no-cache',
          'Content-Type': 'multipart/form-data'
        },
        ...config
      })
    }
  }
}

const serviceInstance = createService()
export default initServiceType(serviceInstance)
