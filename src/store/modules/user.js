import { loginAPI } from '@/api/login'
import { getUserInfoAPI, getUserDetailById } from '@/api/user'
export default {
  namespaced: true,
  state: {

    token: null, // 设置token为共字状态初始化vuex的时候就先从绥存中读取
    userInfo: {}, // 这里定义一个空对象，在getters.js中设置快捷变量
    hrsaasTime: 0
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token // 将数据设置给vuex
    },
    SET_USER_INFO(state, userInfo) {
      // 更新一个对象
      state.userInfo = userInfo // 这样是响应式
      // state.userInfo = { ...userInfo } // 这样也是响应式 属于浅拷贝
    },
    // 删除用户信息
    RMOVE_USER_INFO(state) {
      // 写成空对象 往后容易改动
      state.userInfo = {}
    },
    RMOVE_TOKEN(state) {
      state.token = null // 将vuex里的数据 设置为空
    },
    SET_HRSAAS_TIME(state, hrsaasTime) {
      state.hrsaasTime = hrsaasTime // 属于时间1 属于获取到token的时间
    }
  },
  actions: {
    // 设置token 监听登陆或者未登录
    async loginAction({ commit }, loginData) {
      // 接口 传参到后端
      const data = await loginAPI(loginData) // 拿到token
      // console.log(data)
      // 后端数据发送给mutations更改后的数据，在返回给state基本数据传给变量
      commit('SET_TOKEN', data) // 设置token
      commit('SET_HRSAAS_TIME', +new Date())
    },
    // 获取用户基本资料
    async getUserInfo({ commit }) {
      // 接口请求
      const res = await getUserInfoAPI()
      //  获取用户的详情 用户的详情数据   传入用户id
      const data = await getUserDetailById(res.userId)
      const result = { ...res, ...data }
      // console.log(res, data)
      commit('SET_USER_INFO', result)
      return JSON.parse(JSON.stringify(result)) // 这里为么要return呢 这里是给我们后期做权限的时侯 留下的伏笔
    },
    logout({ commit }) {
      // 清楚原来的数据 => token, userInfo
      commit('RMOVE_USER_INFO')
      commit('RMOVE_TOKEN')
    }
  }

}
