// 实现axios
import store from '@/store'
import axios from 'axios'
import { Message } from 'element-ui'
import router from '@/router'
const TimeOut = 3600 // token登录一小时后过期

// 对比时间是否超时
function IsChenckTimeOut() {
  // debugger  断点测试
  const currenTime = Date.now() // 时间2 接口真正调用的时间
  const timeStamp = (currenTime - store.getters.hrsaasTime) / 1000
  return timeStamp > TimeOut // true 超时 / false
}

// 通过axios 创建 axios 实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // 基准地址
  // node.js 里的一个变量process.env来区分环境   获取当前文件所储的状态
  // 这个变量主要用于标识当前的环境（生产环境，开发环境）。默认是没有这个环境变量的，需要自己手动配置。不同系统有不同的环境变量配置方式。
  timeout: 5000
})
// 响应拦截器
service.interceptors.response.use(response => {
  // 1. 考虑把那些数据跑出去
  // 2. 接口成功 并且 业务成功
  // 3.没有成功 promise.reject 跑出错误
  const { message, data, success } = response.data
  if (success) { // 业务逻辑是成功
    return data
  }
  // 业务逻辑没有成功
  Message.error(message)
  return Promise.reject(new Error(message))
}, error => {
  Message.error(error.message)
  return Promise.reject(error)
})
//  请求拦截器
// 请求把token请求头加入
service.interceptors.request.use(config => {
  // console.log(config)
  // 在这个位置需要统一的去注入token
  // 判断 如果token
  if (store.getters.token) {
    // 时间2 - 时间1 > token 超时的时间 ==> token 登陆失败
    if (IsChenckTimeOut()) { // 超时
      store.dispatch('user/logout')
      router.push('login')
      return Promise.reject(new Error('token 超时'))
    }
    // 如果token存在 注入token
    config.headers.Authorization = `Bearer ${store.getters.token}`
  }
  return config // 必须返回配置
}, error => {
  // 如果返回的是401 那么就是token失效 需要重新登陆
  if (error.response.status === 401) {
    store.dispatch('user/logout')
    router.push('/login')
  } else {
    Message.error(error.message)
  }
  return Promise.reject(error)
})

export default service
