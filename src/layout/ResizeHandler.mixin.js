import { mapActions, mapMutations } from 'vuex'
import device from 'current-device'
import { MIN_SCREEN } from '@/constants'

export default {
  watch: {
    $route() {
      // 切换路由，如果是小屏幕的，需要关闭侧边栏
      if (this.$_isMinScreen() && this.sidebar.opened) {
        this.closeSideBar({ withoutAnimation: false })
      }
    }
  },
  mounted() {
    this.initHandler()
  },
  methods: {
    initHandler() {
      this.toggleDevice(device) // 保存设备信息
      // 监听屏幕转向， to do something
      // device.onChangeOrientation((e) => {
      //   console.log('监听屏幕转向', e)
      // })
      this.modifiedSomeInfo()
      let timer = null
      const resizeHandler = () => {
        clearTimeout(timer)
        timer = setTimeout(() => {
          if (!document.hidden) {
            this.modifiedSomeInfo()
          }
        }, 200)
      }
      window.addEventListener('resize', resizeHandler)
      this.$once('hook:beforeDestroy', () => {
        window.removeEventListener('resize', resizeHandler)
      })
    },
    modifiedSomeInfo() {
      // 小屏收缩侧边栏
      const isMinScreen = this.$_isMinScreen()
      this.TOGGLE_MIN_SCREENT(isMinScreen)
      if (isMinScreen) {
        this.closeSideBar({ withoutAnimation: true })
      }
    },
    // use $_ for mixins properties
    // https://vuejs.org/v2/style-guide/index.html#Private-property-names-essential
    $_isMinScreen() {
      const isDesktop = device.desktop() // 桌面
      const rect = document.body.getBoundingClientRect()
      return rect.width - 1 < MIN_SCREEN || !isDesktop
    },
    ...mapMutations('app', ['TOGGLE_MIN_SCREENT']),
    ...mapActions('app', ['toggleDevice', 'closeSideBar'])
  }
}
