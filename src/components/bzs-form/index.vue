<template>
  <el-form
    ref="form"
    :model="formData"
    v-bind="$attrs"
    :rules="rules"
    :label-width="labelWidth"
    v-on="$listeners"
  >
    <template v-for="(v, idx) of formFormat">
      <!-- 如果子项类型是对象，就对子项的children进行循环，主要是做嵌套表单 -->
      <div v-if="v.template === 'object'" :key="idx" class="flex-align-center flex-wrap">
        <ZformItem
          v-for="single of v.children"
          :key="single.value"
          :style="{ marginRight: v.marginRight || '20px' }"
          :form-model="formData"
          :v="single"
        >
          <!-- 嵌套表单带有slot，需要透传出去 -->
          <template
            v-for="slot of objectSlotList"
            v-slot:[slot.slotName||slot.suffix]="{ item: vs }"
          >
            <slot v-if="slot.value === single.value" :name="slot.slotName" :item="vs" />
          </template>
        </ZformItem>
      </div>
      <ZformItem v-else :key="idx" :form-model="formData" :v="v">
        <!-- 嵌套表单带有slot，需要透传出去 -->
        <template v-for="slot of slotList" v-slot:[slot.slotName||slot.suffix]="{ item: vs }">
          <slot v-if="slot.value === v.value" :name="slot.slotName || slot.suffix" :item="vs" />
        </template>
      </ZformItem>
    </template>
  </el-form>
</template>

<script>
import ZformItem from './formItem'

export default {
  name: 'Zform',
  props: {
    formFormat: {
      // 格式
      /**
       * label: 控件label
       * value： formData中的key，数据会根据formData[v.value]来获取
       * template：指定控件类型，默认是input，详情见formItem组件
       * width：控件宽度
       * placeholder：控件 placeholder， 默认是请输入label/请选择label
       * bind: 对象，绑定到控件上，属性就是element ui的属性
       */
      type: Array,
      default() {
        return []
      }
    },
    // 数据，因为嵌套可以很多层，就直接利用引用数据类型的特性，没有保持单向数据流
    formData: {
      type: Object,
      default() {
        return {}
      }
    },
    labelWidth: {
      type: String,
      default: '80px'
    }
  },
  methods: {
    validate(...args) {
      return this.$refs.form.validate(...args)
    },
    clearValidate(...args) {
      return this.$refs.form.clearValidate(...args)
    },
    resetFields() {
      this.$refs.form.resetFields()
    },
    inner_disposeRules(list = []) {
      let resule = {}
      list.forEach((v) => {
        const key = v.value
        if (key) {
          resule[key] = [
            {
              required: v.hidden ? false : !v.noRequired,
              message: v.message || `请输入${v.label}`,
              trigger: v.trigger || 'blur'
            }
          ]
        } else if (v.children) {
          const b = this.inner_disposeRules(v.children)
          resule = { ...b }
        }
      })
      return resule
    }
  },
  computed: {
    rules() {
      return this.inner_disposeRules(this.formFormat)
    },
    slotList() {
      if (!this.formFormat) return []
      const otherArr = []
      const mainArr = this.formFormat.filter((v) => {
        if (v.template === 'slot' && v.suffix) {
          otherArr.push({
            value: v.value,
            suffix: v.suffix
          })
        }
        return v.template === 'slot' || v.suffix
      })
      return [...mainArr, ...otherArr]
    },
    objectSlotList() {
      if (!this.formFormat) return []
      let result = []
      this.formFormat.forEach((v) => {
        if (v.children) {
          const otherArr = []
          const mainArr = v.children.filter((c) => {
            if (c.template === 'slot' && c.suffix) {
              otherArr.push({
                value: c.value,
                suffix: c.suffix
              })
            }
            return c.template === 'slot' || c.suffix
          })
          result = [...result, ...mainArr, ...otherArr]
        }
      })
      return result
    }
  },
  components: { ZformItem }
}
</script>
<style lang="scss" scoped>
.flex-align-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.flex-wrap {
  display: flex;
  flex-wrap: wrap;
}
</style>
