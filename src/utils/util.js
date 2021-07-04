/* eslint-disable no-unused-expressions */
/*
 * @Author: song.qing-vn0bn6u
 * @Date: 2021-04-22 15:05:40
 * @Last Modified by:   song.qing-vn0bn6u
 * @Last Modified time: 2021-04-22 15:05:40
 */
/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source 源对象
 * @returns {Object} 克隆对象
 */
export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach((keys) => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

/**
 * 检测数据类型
 * @param {any} target 目标数据
 */
export const typeCheck = (target) => Object.prototype.toString.call(target).slice(8, -1)

/**
 * settimeout定时器模拟settimeinteval
 * @param { Function } callback 执行函数
 * @param { Number } interval 时间间隔
 * @param { Boolean } async 是否异步
 */
export function simulateInterval(callback, interval, async = false) {
  let timerId = null
  async function fn() {
    // 没有返回值是常态，所以保持继续运行定时器
    let result = false
    if (async) {
      try {
        result = await callback()
      } catch (error) {
        console.error(error)
      }
    } else {
      result = callback()
    }
    // 没有返回值是常态，所以保持继续运行定时器
    if (!result) {
      const prevTimmerId = timerId
      timerId = setTimeout(fn, interval)
      clearTimeout(prevTimmerId)
    }
  }

  return setTimeout(fn, interval)
}

/**
 * 数据分块（一维数组变二维数组）
 * @param {Array} array 源数据数组
 * @param {Number} size 多少个item为一组
 */
export function arrChunk(array, size = 10) {
  return Array.from({ length: Math.ceil(array.length / size) }, (v, idx) =>
    array.slice(idx * size, (idx + 1) * size)
  )
}

/**
 * 生成指定范围内的随机数
 * @param {*} min 最小值
 * @param {*} max 最大值
 */
export function getNumberRange(min = 0, max = 1) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

/**
 * 已知 和 求因子，通过位运算获取选中的值，1， 2， 4, 8， 16这种倍数因子
 * 比如多选题，值设为1,2,4,8,16...，提交数据把选中选项的值的和提交上去，下发时，再分解就知道选中了哪些选项
 * @param {number} total 因子之和
 */
export const getCheckdOfBitOperation = (total) => {
  const result = []
  for (let i = 1; i <= total; i *= 2) {
    // eslint-disable-next-line no-bitwise
    i & total && result.push(i)
  }
  return result
}

/**
 * 对象或数据打点（方括号）调用时，获取值，防止不存在key时导致报错
 * @param {Object|Array} data 数据
 * @param {string} path 路径
 * @param {any} def 默认值，找不到key时返回的默认值，默认是undefined
 */
export const objOrArrPointPath = (data, path, def) => {
  try {
    const arr = path.split(/\.|\[|\]/).filter(Boolean)
    const result = arr.reduce((t, c) => {
      return t[c]
    }, data)
    return result
  } catch (error) {
    return def
  }
}
