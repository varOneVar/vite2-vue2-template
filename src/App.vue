<template>
  <div id="app">
    <router-view v-loading="wholePageLoading" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import device from 'current-device'

export default {
  name: 'App',
  methods: {
    initHandler() {
      this.listenerDocumentClick()
      this.getDeviceInfo()
    },
    // 获取设备信息
    getDeviceInfo() {
      console.log('', device, device.mobile())
      this.toggleDevice(device)
      device.onChangeOrientation((e) => {
        console.log('监听屏幕转向', e)
      })
    },
    // 监听docuemnt点击，记录点击路径
    listenerDocumentClick() {
      // TODO: 过滤数组，形成一个冒泡dom链条，需要记录某些点击触发，可以设定一些特殊的classname在dom，记录点击
      // 在路由守卫里可以记录时间，from - to -Date.now(),可以记录用户在页面停留时间
      // 通过轮询，对比时间，可以观察用户是否在当前页面存在操作，就像斗鱼的监测用户是否还在观看来关闭直播节流
      function documentClickHandler(e) {
        const ev = window.event || e
        const path = ev.path || (ev.composedPath && ev.composedPath())
        console.log('点击dom链条', path, typeof path)
        e.stopPropagation()
      }
      document.addEventListener('click', documentClickHandler, false)
      this.$once('hook:beforeDestroy', function beforeDestroyHandler() {
        document.removeEventListener('click', documentClickHandler, false)
      })
    },
    ...mapActions('app', ['toggleDevice'])
  },
  created() {
    this.initHandler()
  },
  computed: {
    ...mapGetters(['wholePageLoading'])
  }
}
</script>

<style lang="scss">
#app {
  height: 100%;
}

.test {
  width: 200px;
  height: 200px;
  background: $--color-primary;
}
</style>
