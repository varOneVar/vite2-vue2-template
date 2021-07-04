<!-- 封装echarts -->
<template>
  <div ref="charts" class="my-chart"></div>
</template>

<script>
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from 'echarts/core'
// 引入柱状图图表，图表后缀都为 Chart
import { BarChart, PieChart } from 'echarts/charts'
// 引入提示框，标题，直角坐标系组件，组件后缀都为 Component
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  LegendComponent
} from 'echarts/components'
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers'

// 注册必须的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DatasetComponent,
  BarChart,
  PieChart,
  CanvasRenderer
])

export default {
  props: {
    type: String,
    initOptions: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      timer: null,
      myChart: null
    }
  },
  methods: {
    updateChart(optins) {
      if (this.myChart) {
        this.myChart.setOption(optins)
        this.$nextTick(() => {
          this.myChart.resize()
        })
      }
    },
    getChartInstance() {
      return this.myChart
    }
  },
  mounted() {
    this.$nextTick(() => {
      const myChart = echarts.init(this.$refs.charts)
      this.myChart = myChart
      myChart.showLoading()
      myChart.setOption(this.initOptions)
      myChart.hideLoading()
      const fn = () => {
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          myChart.resize()
        }, 500)
      }
      window.addEventListener('resize', fn, false)
      this.$once('hook:beforeDestory', () => {
        window.removeEventListener('resize', fn)
        clearTimeout(this.timer)
        this.timer = null
      })
    })
  }
}
</script>
<style lang="scss" scoped>
.my-chart {
  width: 100%;
  height: 100%;
}
</style>
