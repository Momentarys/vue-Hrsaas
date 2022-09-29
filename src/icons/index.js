import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon'// svg component

// register globally
Vue.component('svg-icon', SvgIcon)
// 可以给这个函数传入三个参数：一个要搜索的目录，一个标记表示是否还搜索其子目录， 以及一个匹配文件的正则表达式。
// req函数 ==> 根据路径 对应的模块 导入进来
// 函数  keys  属性 ==》方法三 ==》 数组
// console.log(req('./dashboard.svg'));
// req()
const req = require.context('./svg', false, /\.svg$/)
// console.log(req.keys())
// map返回一-个新数组
// 长度和原来的一样
// 映射
// ['./dashboard.svg'].map(requireContext) // []
// console.log(req('./dashboard.svg'))

// 通过map方法 把req返回的路径 返回一个新数组  模块id
const requireAll = requireContext => requireContext.keys().map(requireContext)
// const requireAll = item => {
//   item.keys().map((val) => {
//     return item(val)
//   })
// }
requireAll(req)
// console.log(requireAll(req))
