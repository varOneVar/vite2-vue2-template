<!-- 暂无权限 -->
<template>
  <div class="text-center">
    <h1 class="big">暂无权限</h1>
    <p class="f26">抱歉，你暂无权限访问，请重新登录更换有权限的账号访问！</p>
    <el-button type="primary" size="medium" @click="$router.go(-1)">返回上一页</el-button>
    <el-button type="primary" size="medium" @click="loginOutByToken">重新登录</el-button>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  methods: {
    ...mapActions('user', ['loginOutByToken'])
  }
}
</script>
<style lang="scss" scoped>
.big {
  margin-top: 200px;
  margin-bottom: 0;
  font-size: 50px;
}
</style>
