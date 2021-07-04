<template>
  <div v-if="!item.hidden" class="menu-wrapper">
    <el-submenu
      v-if="item.children && !item.onlyShowFirstChild"
      ref="subMenu"
      :index="resolvePath(item.path)"
      :data-set="resolvePath(item.path)"
      popper-append-to-body
    >
      <template slot="title">
        <p v-if="isCollapse" class="pp">{{ item.meta.title && item.meta.title.slice(0, 2) }}</p>
        <item v-if="item.meta" :title="item.meta.title" />
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(item.path)"
        class="nest-menu"
      />
    </el-submenu>
    <template v-else>
      <app-link
        v-if="firstChild.meta"
        :to="resolvePath(firstChild.path)"
        :data-set="resolvePath(firstChild.path)"
      >
        <el-menu-item
          :index="resolvePath(firstChild.path)"
          :class="{ 'submenu-title-noDropdown': !isNest }"
        >
          <p v-if="isCollapse" class="pp">
            {{ firstChild.meta.title && firstChild.meta.title.slice(0, 2) }}
          </p>
          <item :title="firstChild.meta.title" />
        </el-menu-item>
      </app-link>
    </template>
  </div>
</template>

<script>
import path from 'path'
import { isExternal } from '@/utils/validate'
import Item from './Item'
import AppLink from './Link'
import FixiOSBug from './FixiOSBug'

export default {
  name: 'SidebarItem',
  mixins: [FixiOSBug],
  props: {
    // route object
    isCollapse: {
      type: Boolean
    },
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data() {
    // To fix https://github.com/PanJiaChen/vue-admin-template/issues/237
    // TODO: refactor with render function
    this.onlyOneChild = null
    return {}
  },
  methods: {
    hasOneShowingChild(children = [], parent) {
      const showingChildren = children.filter((item) => {
        if (item.hidden) {
          return false
        }
        // Temp set(will be used if only has one showing child)
        this.onlyOneChild = item
        return true
      })

      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return true
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ...parent, path: '', noShowingChildren: true }
        return true
      }

      return false
    },
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(this.basePath)) {
        return this.basePath
      }
      return path.resolve(this.basePath, routePath)
    }
  },
  computed: {
    firstChild() {
      if (this.item.children && this.item.onlyShowFirstChild) this.item.children[0]
      return this.item
    }
  },
  components: { Item, AppLink }
}
</script>
<style lang="scss" scoped>
.pp {
  margin: 0;
  text-align: center;
}
</style>
