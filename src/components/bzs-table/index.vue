<template>
  <div class="z-table">
    <el-table ref="tabel" v-bind="$attrs" :data="tableData" class="tabel" v-on="$listeners">
      <el-table-column v-if="isShowIndexCol" align="center" label="编号" type="index" width="50" />
      <el-table-column
        v-if="isShowCheck"
        :is-show-check="isShowCheck"
        align="center"
        :selectable="selectable"
        type="selection"
        width="55"
      />
      <template v-for="(column, idx) in tableFormat">
        <el-table-column
          v-if="!column.hidden"
          :key="idx"
          :align="column.align || 'center'"
          :prop="column.value"
          :header-align="column.headerAlign"
          :show-overflow-tooltip="column.showTooltip != null ? column.showTooltip : true"
          :label="column.label"
          :min-width="column.minWidth"
          :width="column.width"
          v-bind="column.other"
        >
          <!-- slot -->
          <template v-if="column.template === 'slot'" #default="{ row, column: col }">
            <slot :name="column.slotName" :row="row" :column="col" />
          </template>
          <!-- 配置key：value对照表，根据key展示value，比如status，数据经常是012数字，实际含义需要中文，就使用这个类型 -->
          <template v-else-if="column.template === 'statusMap'" #default="{ row, column: col }">
            <span>{{
              typeof column.statusMap[row[col.property]] === 'function'
                ? column.statusMap[row[col.property]](row)
                : column.statusMap[row[col.property]]
            }}</span>
          </template>
          <!-- time -->
          <template v-else-if="column.template === 'time'" #default="{ row, column: col }">
            <span>{{ row[col.property] | dateFormat(column.timeFormat) }}</span>
          </template>
          <!-- html -->
          <template v-else-if="column.template === 'html'" #default="{ row, column: col }">
            <span v-html="row[col.property]" />
          </template>
          <!-- 默认 -->
          <template v-else #default="{ row, column: col }">
            <svg-icon v-if="column.svg" :icon-class="column.svg" classs="table-item-icon" />
            <i v-if="column.iconfont" :class="column.iconfont" classs="table-item-icon" />
            <span>{{ column.prefix }}{{ row[col.property] }}{{ column.suffix }}</span>
          </template>
        </el-table-column>
      </template>
      <!-- 操作 -->
      <el-table-column
        v-if="isShowOpions"
        :label="optionsLabel"
        header-align="center"
        align="center"
        fixed="right"
        class="options-col"
        :width="optionsWidth"
      >
        <template #default="{ row, column }">
          <slot name="options" :row="row" :column="column" />
        </template>
      </el-table-column>
    </el-table>
    <div v-if="isShowPagination" class="pagination flex-align-center">
      <el-pagination
        v-if="isShowPagination"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :page-size="paginationObj.pageSize"
        :current-page="paginationObj.pageNumber"
        :page-sizes="pageSizes"
        :total="paginationObj.total"
        @size-change="sizeChange"
        @current-change="currentChange"
      />
    </div>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    tableData: {
      // table数据
      type: Array,
      required: true
    },
    /**
     * label: 控件label
     * value： formData中的key，数据会根据formData[v.value]来获取
     * template：指定控件类型，默认是input，详情见formItem组件
     * width：控件宽度
     * placeholder：控件 placeholder， 默认是请输入label/请选择label
     * bind: 对象，绑定到控件上，属性就是element ui的属性
     */
    tableFormat: {
      // table格式
      type: Array,
      required: true
    },
    isShowIndexCol: {
      // 是否显示编号列
      type: Boolean,
      default: false
    },
    isShowOpions: {
      // 是否显示操作列
      type: Boolean,
      default: true
    },
    optionsLabel: {
      // 操作的label
      type: String,
      default: '操作'
    },
    optionsWidth: {
      // 操作的宽度
      type: [String, Number],
      default: '160'
    },
    isDisableAllCheck: {
      // 禁止全选
      type: Boolean,
      default: false
    },
    isShowCheck: {
      // 是否显示多选
      type: Boolean,
      default: false
    },
    // eslint-disable-next-line vue/require-default-prop
    selectable: {
      // 决定是否可以勾选，函数接受row和index作为参数
      type: Function
    },
    isShowPagination: {
      // 是否显示分页
      type: Boolean,
      default: false
    },
    pageSizes: {
      type: Array,
      default() {
        return [10, 20, 30, 40, 50, 80, 100]
      }
    },
    // 对象必须包含total, pageSize、pageNumber参数
    paginationObj: {
      type: Object,
      default() {
        return {
          total: 0,
          pageSize: 10,
          pageNumber: 1
        }
      },
      validator(v) {
        if (v === null) throw Error('传参错误，不能为null，需传入对象')
        const keys = Object.keys(v)
        return ['total', 'pageSize', 'pageNumber'].every((key) => keys.includes(key))
      }
    }
  },
  methods: {
    toggleSelection(...arg) {
      this.tableData.forEach((row) => {
        this.$refs.tabel.toggleRowSelection(row, ...arg)
      })
    },
    toggleRowSelection(...arg) {
      this.$refs.tabel.toggleRowSelection(...arg)
    },
    clearSelection() {
      this.$refs.tabel.clearSelection()
    },
    sizeChange(page) {
      this.$emit('sizeChange', page)
    },
    currentChange(page) {
      this.$emit('currentChange', page)
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.isShowCheck && this.isDisableAllCheck) {
        document.querySelector(
          '.el-table__header-wrapper .el-table-column--selection .el-checkbox'
        ).style.display = 'none'
      }
    })
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .el-table .el-table__header th {
    color: #282828;
    background-color: #efefef;
  }
}
// .tabel {
//   width: 100%;
// }
.pagination {
  justify-content: flex-end;
  padding: 16px 0;
}

.flex-align-center {
  display: flex;
  align-items: c;
}
</style>
