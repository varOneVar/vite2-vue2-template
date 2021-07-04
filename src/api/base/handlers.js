/* eslint-disable no-param-reassign */
/*
 * @Author: Song Qing
 * @Date: 2021-04-25 15:53:17
 * @LastEditTime: 2021-04-26 15:42:21
 * @LastEditor: Song Qing
 * @Description: 接口的辅助函数
 * @FilePath: \app-test\src\api\base\handlers.js
 */

/**
 * 生成请求的key，来判断是否重复请求或者数据缓存
 * @param {objecy} config axios的config
 */

export function generateReqKey(config) {
  const { method, url, params, data } = config
  return [method, url, JSON.stringify(params), JSON.stringify(data)].join('&')
}

/**
 * 洋葱模型
 * @param {function} middleware 中间件
 */
export function compose(middleware, adapter) {
  // 校验middleware 是数组和数组每一项都是函数的校验
  if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!')
  if (middleware.some((fn) => typeof fn !== 'function')) {
    throw new TypeError('Middleware must be composed of functions!')
  }
  return function composeExec(context, next) {
    // last called middleware #
    let index = -1
    function dispatch(i) {
      console.log(i, index, middleware.length, 'composeExec')
      if (i <= index) return Promise.reject(new Error('next() called multiple times'))
      index = i
      let fn = middleware[i]
      if (i === middleware.length) {
        index = -1 // 不重置会影响断线重连逻辑
        fn = next
      }
      if (!fn) return adapter(context)
      try {
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)))
      } catch (err) {
        return Promise.reject(err)
      }
    }
    return dispatch(0)
  }
}
/**
 * 收集触发适配器 OLOO
 */
const adapterMiddleareModel = {
  use(fn) {
    if (!this.middleware) {
      this.middleware = []
    }
    this.middleware.push(fn)
    return this
  },
  listen(adapter) {
    const fnMiddleware = compose(this.middleware, adapter)
    return async function finalAdapter(config) {
      try {
        return await fnMiddleware(config)
      } catch (error) {
        console.error(error)
        return Promise.reject(error)
      }
    }
  }
}
export function createAdapterMiddleareModel() {
  return Object.create(adapterMiddleareModel)
}

/**
 * 数据缓存 OLOO
 */
const MemoryCache = {
  set(key, value, maxAge) {
    if (!this.data) {
      this.data = {}
    }
    // 保存数据
    this.data[key] = {
      maxAge: maxAge || 0,
      value,
      now: Date.now()
    }
  },
  get(key) {
    if (!this.data) return null
    // 从缓存中获取指定 key 对应的值。
    const cachedItem = this.data[key]
    if (!cachedItem) return null
    const isExpired = Date.now() - cachedItem.now > cachedItem.maxAge
    if (isExpired) {
      this.delete(key)
      return null
    }
    return cachedItem.value
  },
  delete(key) {
    // 从缓存中删除指定 key 对应的值。
    return delete this.data[key]
  },
  clear() {
    // 清空已缓存的数据。
    this.data = {}
  }
}
export function createMemoryCache() {
  return Object.create(MemoryCache)
}
