<template>
  <!-- 表单上面的查询条件组件， 没有保持单向数据流原则，利用引用类型数据特性进行赋值 -->
  <!-- eslint-disable vue/no-mutating-props -->
  <div class="condition-query">
    <section
      v-for="(F, i) of conditionFormat"
      :key="i"
      class="condition-query__section inline-block"
      :style="{ marginRight: itemMarginRight, marginBottom: itemMarginBottom }"
    >
      <!-- 是否加提示 -->
      <el-tooltip v-if="F.tip" placement="top" :content="F.tip">
        <span :style="{ minWidth: F.labelWidth }" class="condition-query__span bold"
          >{{ F.label }}{{ labelFlag }}</span
        >
      </el-tooltip>
      <span v-else :style="{ minWidth: F.labelWidth }" class="condition-query__span bold"
        >{{ F.label }}{{ labelFlag }}</span
      >
      <template v-if="F.template === 'slot'">
        <slot :item="F" :name="F.slotName" />
      </template>
      <!-- 选择框 -->
      <template v-if="F.template === 'select'">
        <el-select
          v-model="conditionData[F.value]"
          :size="size || F.size"
          clearable
          :style="{ width: F.width, ...F.style }"
          :placeholder="F.placeholder ? F.placeholder : '请选择'"
          v-bind="F.bind"
        >
          <el-option
            v-for="o of F.list"
            :key="F.__value ? o[F.__value] : o.value"
            :label="F.__label ? o[F.__label] : o.label"
            :value="F.__value ? o[F.__value] : o.value"
          />
        </el-select>
      </template>
      <!-- 只支持数组的输入框 -->
      <template v-else-if="F.template === 'numberInput'">
        <el-input
          :value="conditionData[F.value]"
          class="input"
          :size="F.size"
          auto-complete="new-password"
          :type="F.type"
          :maxlength="F.maxlength"
          :show-word-limit="F.showWordLimit"
          :style="{ width: F.width, ...F.style }"
          :disabled="F.disabled"
          v-bind="F.bind"
          clearable
          :placeholder="F.placeholder || '请输入'"
          @input="handlerInputLimit($event, F.value, conditionData)"
        />
      </template>
      <!-- 日期控件 -->
      <template v-else-if="F.template === 'datePicker'">
        <el-date-picker
          v-model="conditionData[F.value]"
          :type="F.type ? F.type : 'daterange'"
          :size="size || F.size"
          clearable
          auto-complete="new-password"
          :style="{ width: F.width, ...F.style }"
          :placeholder="F.placeholder ? F.placeholder : '请选择'"
          :range-separator="F.middleStr ? F.middleStr : '至'"
          :start-placeholder="F.startStr ? F.startStr : '开始日期'"
          :end-placeholder="F.endStr ? F.endStr : '结束日期'"
          v-bind="F.bind"
        />
      </template>
      <el-input
        v-else
        v-model.trim="conditionData[F.value]"
        class="condition-query__input"
        :style="{ width: F.width }"
        :size="size || F.size"
        :type="F.type"
        :maxlength="F.maxlength"
        :placeholder="F.placeholder || '请输入'"
        :prefix-icon="F.prefixIcon"
        clearable
      />
    </section>
    <slot name="leftBtn">
      <div
        v-if="isShowleftBtn1 || isShowleftBtn2"
        class="inline-block"
        :style="{ marginRight: itemMarginRight, marginBottom: itemMarginBottom }"
      >
        <el-button
          v-if="isShowleftBtn1"
          type="primary"
          :size="size"
          @click="$emit('leftBtnHandler1')"
          >{{ leftBtnStr1 }}</el-button
        >
        <el-button
          v-if="isShowleftBtn2"
          type="primary"
          :size="size"
          @click="$emit('leftBtnHandler2')"
          >{{ leftBtnStr2 }}</el-button
        >
      </div>
    </slot>
    <div
      v-if="isShowRightBtn || $slots.rightBtn"
      class="right-wrapper"
      :style="{ marginRight: itemMarginRight, marginBottom: itemMarginBottom }"
    >
      <slot name="rightBtn">
        <el-button
          v-if="isShowRightBtn"
          type="primary"
          :size="size"
          @click="$emit('rightBtnHandler')"
          >{{ rightBtnStr }}</el-button
        >
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    // 条件数据
    conditionData: {
      type: Object,
      required: true
    },
    // 条件的格式，其实和form，table都差不多
    /**
     * label: 控件label
     * value： formData中的key，数据会根据formData[F.value]来获取
     * template：指定控件类型，默认是input，详情见formItem组件
     * width：控件宽度
     * placeholder：控件 placeholder， 默认是请输入label/请选择label
     * bind: 对象，绑定到控件上，属性就是element ui的属性
     */
    conditionFormat: {
      type: Array,
      required: true
    },
    // 距离按钮的间距
    itemMarginRight: {
      type: String,
      default: '16px'
    },
    // 距离第二排条件的底下间距
    itemMarginBottom: {
      type: String,
      default: '16px'
    },
    // 控件的size
    size: {
      type: String,
      default: 'small'
    },
    // label与控件间的符号
    labelFlag: {
      type: String,
      default: '：'
    },
    // 左边第一个按钮文字
    leftBtnStr1: {
      type: String,
      default: '查询'
    },
    // 左边第二个按钮文字
    leftBtnStr2: {
      type: String,
      default: '重置'
    },
    // 是否展示左边第一个按钮
    isShowleftBtn1: {
      type: Boolean,
      default: false
    },
    // 是否展示左边第二个按钮
    isShowleftBtn2: {
      type: Boolean,
      default: false
    },
    // 是否展示右边按钮
    isShowRightBtn: {
      type: Boolean,
      default: false
    },
    // 右边按钮的文字
    rightBtnStr: {
      type: String,
      default: '新增'
    }
  },
  methods: {
    handlerInputLimit(value, key, context) {
      // 限制输入框输入
      if (!value) {
        context[key] = ''
        return
      }
      if (/^\d+$/.test(value)) {
        context[key] = value
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.condition-query {
  margin-bottom: 10px;

  &__span {
    min-width: 40px;
    margin-right: 8px;
    white-space: nowrap;
  }

  &__select,
  &__input {
    width: 160px;
  }

  &__button {
    margin-left: 10px;
  }

  &::after {
    display: block;
    clear: both;
    content: '';
  }
}

.inline-block {
  display: inline-block;
}

.right-wrapper {
  float: right;
}
</style>
