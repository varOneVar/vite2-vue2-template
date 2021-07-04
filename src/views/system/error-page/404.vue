<template>
  <div class="err-404">
    <h1 class="big">404</h1>
    <p class="f26">抱歉，你访问的页面不存在，请检查地址是否正确！</p>
    <!-- <el-button type="primary" size="medium" @click="$router.replace('/')">返回首页</el-button> -->
    <el-button type="primary" size="medium" @click="$router.go(-1)">返回上一页</el-button>
  </div>
</template>

<style lang="scss" scoped>
.err-404 {
  text-align: center;
}

.big {
  margin-bottom: 0;
  font-size: 200px;
  line-height: 220px;
}
</style>
