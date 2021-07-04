<template>
  <div class="screenfull" @click="clickHandler">
    <slot></slot>
  </div>
</template>

<script>
import screenfull from 'screenfull'

export default {
  name: 'Screenfull',
  props: {
    elementFn: {
      type: Function
    }
  },
  data() {
    return {
      isFullscreen: false
    }
  },
  methods: {
    clickHandler() {
      if (!screenfull.isEnabled) return
      const element = this.elementFn && this.elementFn()
      element ? screenfull.toggle(element) : screenfull.toggle()
    },
    exit() {
      screenfull.exit()
    },
    change() {
      this.isFullscreen = screenfull.isFullscreen
      this.$emit('toggleAfter', this.isFullscreen)
    },
    init(e) {
      const key = window.event.keyCode
      if (key === 122 || key === 117) {
        // f11 或者f6
        const element = this.elementFn && this.elementFn()
        element ? screenfull.toggle(element) : screenfull.toggle()
        e.preventDefault()
      }
    },
    destroy() {
      if (screenfull.enabled) {
        screenfull.off('change', this.change)
      }
    }
  },
  mounted() {
    if (screenfull.isEnabled) {
      screenfull.on('change', this.change)
    }
    window.addEventListener('keydown', this.init, false)
    this.$once('hook:beforeDestroy', () => {
      window.removeEventListener('keydown', this.init, false)
      this.destroy()
    })
  }
}
</script>

<style lang="scss" scoped>
.screenfull {
  display: inline-block;
}
</style>
