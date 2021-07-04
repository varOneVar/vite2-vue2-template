<!-- form item 没有保持单向数据流原则，利用引用类型数据特性对值修改 -->
<template>
  <!-- eslint-disable vue/no-mutating-props -->
  <el-form-item
    v-if="!v.hidden"
    :label="v.label"
    :prop="v.value"
    :label-width="v.labelWidth"
    :rules="v.rules"
  >
    <template v-if="v.template === 'slot'">
      <slot :name="v.slotName" :item="v" />
    </template>
    <!-- 静态文本，只做展示 -->
    <template v-else-if="v.template === 'static'">
      <span>{{ formModel[v.value] }}</span>
    </template>
    <template v-else-if="v.template === 'textarea'">
      <el-input
        v-model="formModel[v.value]"
        class="textarea"
        :size="v.size"
        :rows="v.rows || 4"
        type="textarea"
        v-bind="v.bind"
        :style="{ width: v.width, ...v.style }"
        clearable
        :placeholder="v.placeholder || `请输入${v.label}`"
      />
    </template>
    <!-- element的数字数据框 -->
    <template v-else-if="v.template === 'number'">
      <el-input-number
        v-model.trim="formModel[v.value]"
        class="number-input"
        :size="v.size"
        :style="{ width: v.width, ...v.style }"
        controls-position="right"
        :disabled="v.disabled"
        :min="v.min == null ? 1 : v.min"
        :max="v.max"
        v-bind="v.bind"
        clearable
        :placeholder="v.placeholder || `请输入${v.label}`"
      />
    </template>
    <!-- 只支持数组的输入框 -->
    <template v-else-if="v.template === 'numberInput'">
      <el-input
        :value="formModel[v.value]"
        class="input"
        :size="v.size"
        auto-complete="new-password"
        :type="v.type"
        :maxlength="v.maxlength"
        :show-word-limit="v.showWordLimit"
        :style="{ width: v.width, ...v.style }"
        :disabled="v.disabled"
        v-bind="v.bind"
        clearable
        :placeholder="v.placeholder || `请输入${v.label}`"
        @input="handlerInputLimit($event, v.value, formModel)"
      />
    </template>
    <!-- 时间 -->
    <template v-else-if="v.template === 'datePicker'">
      <el-date-picker
        v-model="formModel[v.value]"
        :type="v.type ? v.type : 'daterange'"
        :size="size || v.size"
        :style="{ width: v.width, ...v.style }"
        :range-separator="v.middleStr ? v.middleStr : '至'"
        :start-placeholder="v.startStr ? v.startStr : '开始日期'"
        :end-placeholder="v.endStr ? v.endStr : '结束日期'"
        v-bind="v.bind"
      />
    </template>
    <!-- 多选框 -->
    <template v-else-if="v.template === 'checkBox'">
      <el-checkbox-group v-model="formModel[v.value]" v-bind="v.bind">
        <el-checkbox
          v-for="check of v.list"
          :key="check.value"
          class="check"
          :class="{ block: v.isColum }"
          :disabled="check.disabled"
          :label="check.value"
          >{{ check.label }}</el-checkbox
        >
      </el-checkbox-group>
    </template>
    <!-- 选择框 -->
    <template v-else-if="v.template === 'select'">
      <el-select
        v-model="formModel[v.value]"
        :style="{ width: v.width, ...v.style }"
        v-bind="v.bind"
        :placeholder="v.placeholder || `请选择${v.label}`"
      >
        <el-option
          v-for="s of v.list"
          :disabled="
            typeof v.optionDisabled === 'function' && v.optionDisabled(s, formModel[v.value])
          "
          :key="v.__value ? s[v.__value] : s.value"
          :label="v.__label ? s[v.__label] : s.label"
          :value="v.__value ? s[v.__value] : s.value"
          class="flex-sb-center"
        >
          <span>{{ s.label }}</span>
          <span v-if="s.subLabel" class="sublabel">{{ s.subLabel }}</span>
        </el-option>
      </el-select>
    </template>
    <!-- 单选框 -->
    <template v-else-if="v.template === 'radio'">
      <el-radio-group
        v-model="formModel[v.value]"
        v-bind="v.bind"
        :placeholder="v.placeholder || `请选择${v.label}`"
      >
        <el-radio v-for="radio of v.list" :key="radio.value" :label="radio.value">{{
          radio.label
        }}</el-radio>
      </el-radio-group>
    </template>
    <!-- 带提示的输入框 -->
    <template v-else-if="v.template === 'tips'">
      <el-tooltip effect="dark" :content="v.content" :placement="v.placement || 'right'">
        <el-input
          v-model="formModel[v.value]"
          class="input"
          v-bind="v.bind"
          :size="v.size"
          auto-complete="new-password"
          :type="v.type"
          :rows="v.rows"
          :maxlength="v.maxlength"
          :show-word-limit="v.showWordLimit"
          :style="{ width: v.width, ...v.style }"
          :disabled="v.disabled"
          clearable
          :placeholder="v.placeholder || `请输入${v.label}`"
        />
      </el-tooltip>
    </template>
    <template v-else>
      <!-- 默认输入框 -->
      <el-input
        v-model.trim="formModel[v.value]"
        class="input"
        :size="v.size"
        v-bind="v.bind"
        auto-complete="new-password"
        :type="v.type"
        :maxlength="v.maxlength"
        :show-word-limit="v.showWordLimit"
        :style="{ width: v.width, ...v.style }"
        :disabled="v.disabled"
        clearable
        :placeholder="v.placeholder || `请输入${v.label}`"
      />
    </template>
    <!-- 选项的解释 -->
    <template v-if="v.suffix">
      <slot :name="v.suffix" />
    </template>
  </el-form-item>
</template>

<script>
export default {
  props: {
    formModel: {
      type: Object,
      required: true,
      default() {
        return {}
      }
    },
    v: {
      type: Object,
      default() {
        return {}
      }
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
.check {
  margin-right: 20px;
}

.block {
  display: block;
}

.flex-sb-center {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sublabel {
  margin-right: 15px;
}
</style>
