<template>
  <div class="app-wrapper flex">
    <aside class="aside" :style="{ width: `${siderBarWidth}px` }">
      <Sidebar />
    </aside>
    <section class="container flex1">
      <header class="header">
        <navbar />
      </header>
      <app-main />
    </section>
    <el-backtop target=".app-wrapper" :right="30" :bottom="30" />
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { AppMain, Navbar, Sidebar } from './components'
import ResizeMixin from './ResizeHandler.mixin'

export default {
  name: 'Layout',
  mixins: [ResizeMixin],
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
  },
  computed: {
    siderBarWidth() {
      return this.sidebar.opened ? 210 : 60
    },
    ...mapState({
      sidebar: (state) => state.app.sidebar,
      device: (state) => state.app.device,
      needTagsView: (state) => state.settings.tagsView,
      fixedHeader: (state) => state.settings.fixedHeader
    }),
    ...mapGetters(['hiddenOther']),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  components: {
    AppMain,
    Navbar,
    Sidebar
  }
}
</script>

<style lang="scss" scoped>
.app-wrapper {
  height: 100%;
  overflow: hidden;
}

.aside {
  width: 200px;
  height: 100%;
  overflow-y: auto;
  background: $menuBg;
  transition: width 0.28s;
}

.container {
  position: relative;
  height: 100%;
  padding-top: $navBarHeight;
}

.header {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  z-index: 9;
  transition: width 0.28s;
}
</style>
