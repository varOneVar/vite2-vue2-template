<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <div class="wrapper">
        <div class="wrapper__div">
          <router-view v-loading="contentLoading" />
        </div>
      </div>
    </transition>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'AppMain',
  computed: {
    ...mapGetters(['hiddenOther']),
    contentLoading() {
      return this.$store.state.app.contentLoading
    }
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  position: relative;
  width: 100%;
  height: calc(100vh - #{$navBarHeight});
  overflow-x: auto;

  @include scrollBar;
}

.wrapper {
  overflow: hidden;

  &__div {
    padding: 16px;
    margin: 16px;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  }
}
</style>
