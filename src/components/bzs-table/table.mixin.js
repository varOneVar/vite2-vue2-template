/*
 * @Author: Song Qing
 * @Date: 2021-06-23 13:39:02
 * @LastEditTime: 2021-06-23 18:43:51
 * @LastEditor: Song Qing
 * @Description: 分页功能mixin
 * @FilePath: \mobile-vue-vant\app-test\src\components\bzs-table\table.mixin.js
 */

const tableName = 'getTableData' // 获取表单数据的函数名，推荐所有获取table数据的函数名都统一一下
export default {
  data() {
    return {
      paginationObj: {
        // 分页数据
        total: 0,
        pageSize: 10,
        pageNumber: 1
      }
    }
  },
  methods: {
    // 查询
    resetPageNumSearch() {
      this.paginationObj.pageNumber = 1
      this[tableName]()
    },
    // 每页展示数量修改
    sizeChange(size) {
      this.paginationObj.pageNumber = 1
      this.paginationObj.pageSize = size
      this[tableName]()
    },
    // 页面修改
    currentChange(page) {
      this.paginationObj.pageNumber = page
      this[tableName]()
    }
  }
}
