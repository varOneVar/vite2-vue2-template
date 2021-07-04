/*
 * @Author: Song Qing
 * @Date: 2021-06-22 15:55:13
 * @LastEditTime: 2021-06-23 11:44:51
 * @LastEditor: Song Qing
 * @Description: 前端生成excel文件
 * @FilePath: \mobile-vue-vant\app-test\src\utils\xlsx.js
 */

// github地址：https://github.com/SheetJS/sheetjs
import XLSX from 'xlsx'

/**
 * 单sheet表与多sheet表，jsonArr的含义要变化，见ArrToSheet函数
 * 将对象或者对象数组转化成xlsx文件，每个iten为一行
 * @param {object|object:[]} jsonArr 需要转化的json对象或对象数组
 * @param {string} name 生成的xlsx文件名
 * @param {string} type single为单sheet表，多个表，jsonArr变为数组包含单表jsonArr
 */
export function JsonToSheet(jsonArr, name = '表名', type = 'single') {
  let sheetInfo
  // 单sheet表
  if (type === 'single') {
    // arr第一个item是表头
    const sheet1 = XLSX.utils.json_to_sheet(jsonArr)
    // 如果有多个sheet表需要额外修改
    sheetInfo = {
      SheetNames: ['sheet1'],
      Sheets: { sheet1 }
    }
  } else {
    // 多sheet表
    sheetInfo = jsonArr.reduce((t, c, i) => {
      if (!t.SheetNames) {
        t.SheetNames = []
      }
      if (!t.Sheets) {
        t.Sheets = {}
      }
      const key = `sheet${i + 1}`
      t.SheetNames.push(key)
      t.Sheets[key] = XLSX.utils.aoa_to_sheet(c)
      return t
    }, {})
  }
  const blobata = XLSX.write(sheetInfo, { bookType: 'xlsx', bookSST: true, type: 'array' })
  const url = window.URL.createObjectURL(new Blob([blobata]))
  const link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  link.setAttribute('download', `${name}.xlsx`)
  document.body.appendChild(link)
  link.click()
  URL.revokeObjectURL(link.href)
  document.body.removeChild(link)
}

/**
 * 将字符串数组转化成xlsx文件，第一个item为表头，后续为数据，注意数据顺序与表头字段一一对应
 * @param {string:[]} arr 看type是不是single，如果不是表示多表，需要用数组包含多个sheet表数组
 * @param {string} name 导出文件名
 * @param {string} type 如果类型是single，表示单表，arr不变，如果不是则为多表，arr需要一个大数组包含多个小arr，每个小arr就是一个sheet表
 */
export function ArrToSheet(arr, name = '表名', type = 'single') {
  let sheetInfo
  // 单sheet表
  if (type === 'single') {
    // arr第一个item是表头
    const sheet1 = XLSX.utils.aoa_to_sheet(arr)
    // 如果有多个sheet表需要额外修改
    sheetInfo = {
      SheetNames: ['sheet1'],
      Sheets: { sheet1 }
    }
  } else {
    // 多sheet表
    sheetInfo = arr.reduce((t, c, i) => {
      if (!t.SheetNames) {
        t.SheetNames = []
      }
      if (!t.Sheets) {
        t.Sheets = {}
      }
      const key = `sheet${i + 1}`
      t.SheetNames.push(key)
      t.Sheets[key] = XLSX.utils.aoa_to_sheet(c)
      return t
    }, {})
  }
  const blobata = XLSX.write(sheetInfo, { bookType: 'xlsx', bookSST: true, type: 'array' })
  const url = window.URL.createObjectURL(new Blob([blobata]))
  const link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  link.setAttribute('download', `${name}.xlsx`)
  document.body.appendChild(link)
  link.click()
  URL.revokeObjectURL(link.href)
  document.body.removeChild(link)
}
