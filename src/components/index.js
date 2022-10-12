
// 引入要注册的组件
// 公共组件
// import PageTools from './PageTools/index.vue'
// 把组件用数组收集起来
// const arr = [PageTools]

// 实现组件的自动注册
// require.context() 查找路径  函数参数
// 1.路径
// 2.是否查找组件路径   是否查看子目录
// 3.正则表达式 查找路径的要求
const fn = require.context('./', true, /\.vue$/)
console.log(fn.keys()) // 路径
console.log(fn('./PageTools/index.vue')) // 根据路径查找模块
// 注册自定义指令
import * as directives from '@/directives'
// 注册全局过滤器
import * as filters from '@/filters'

// 一次性导入所有的模块
const arr1 = fn.keys().map(ele => {
  return fn(ele)
})

export default (Vue) => {
  arr1.forEach(ele => {
    Vue.component(ele.default.name, ele.default)
    // 自定义指令
    Object.keys(directives).forEach(ele => {
      Vue.directive(ele, directives[ele])
    })
    // 全局过滤器
    Object.keys(filters).forEach(item => {
      // Vue.filter('过滤器名称', 过滤器方法)
      Vue.filter(item, filters[item])
    })
  })
}
