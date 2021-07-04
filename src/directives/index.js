/*
 * @Author: Song Qing
 * @Date: 2021-06-21 16:15:43
 * @LastEditTime: 2021-06-21 16:56:20
 * @LastEditor: Song Qing
 * @Description: 全局指令注册
 * @FilePath: \mobile-vue-vant\app-test\src\directives\index.js
 */

// 监听的mousedown和mouseup事件，所以鼠标右键也会触发，需要改就自行复制代码改动
import Clickoutside from 'element-ui/src/utils/clickoutside'
import permission from './permission'

export default (Vue) => {
  Vue.directive('clickoutside', Clickoutside)
  Vue.directive('permission', permission)
}
