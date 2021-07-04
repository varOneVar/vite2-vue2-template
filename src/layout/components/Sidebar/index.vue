<template>
  <div class="menu">
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables['ex-menuBg']"
        :text-color="variables['ex-menuText']"
        :unique-opened="true"
        :active-text-color="variables['ex-menuActiveText']"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="route in accessedRoutes"
          :key="route.path"
          :is-collapse="isCollapse"
          :item="route"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import variables from '@/styles/element-variables.scss'
import SidebarItem from './SidebarItem'

export default {
  created() {
    console.log(variables, 888)
  },
  computed: {
    ...mapGetters(['accessedRoutes', 'sidebar']),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  components: { SidebarItem }
}
</script>
