<template>
  <div id="root" class="kkkkk" style="color: green">填充</div>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    test() {
      fetch('/api/get', {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      })
        .then((response) => {
          console.log(response, response.json())
          return response.json()
        })
        .then((res) => {
          console.log(res, 77)
        })
    }
  },
  created() {
    this.test()
  }
}
</script>
<style lang="scss" scoped>
#root {
  display: flex;
  height: 100%;
  font-size: 14px;
  color: $color;
}
</style>
