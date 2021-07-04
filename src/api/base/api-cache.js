/*
 * @Author: Song Qing
 * @Date: 2021-04-23 17:08:37
 * @LastEditTime: 2021-04-26 15:44:10
 * @LastEditor: Song Qing
 * @Description: 缓存请求数据
 * @FilePath: \app-test\src\api\base\api-cache.js
 */
import { generateReqKey, createMemoryCache } from './handlers'

function cacheAdapterEnhancer(options = {}) {
  const {
    maxAge, // 缓存有效期
    enabledByDefault = true, // 默认是否使用缓存
    cacheFlag = 'cache', // 通过给config设置cache调整是否使用缓存
    defaultCache = createMemoryCache() // 默认缓存对象
  } = options

  return async (config, next) => {
    const { method, forceUpdate } = config
    const useCache = config[cacheFlag] != null ? config[cacheFlag] : enabledByDefault
    // 如果是get请求且使用缓存， post请求一般是上传，不予处理
    if (method === 'get' && useCache) {
      // 如果cache是给定的对象，带有set,get,delete,clear是个函数，就使用用户定义的这个缓存对象
      const requestKey = generateReqKey(config) // 生成请求Key
      let responsePromise = defaultCache.get(requestKey) // 从缓存中获取请求key对应的响应对象
      if (!responsePromise || forceUpdate) {
        // 缓存未命中/失效或强制更新时，则重新请求数据
        responsePromise = (async () => {
          try {
            return await next(config) // 使用默认的xhrAdapter发送请求
          } catch (reason) {
            defaultCache.delete(requestKey)
            return Promise.reject(reason)
          }
        })()
        defaultCache.set(requestKey, responsePromise, maxAge) // 保存请求返回的响应对象
        return responsePromise // 返回已保存的响应对象
      }
      return responsePromise
    }
    return next(config) // 使用默认的xhrAdapter发送请求
  }
}

export default cacheAdapterEnhancer
