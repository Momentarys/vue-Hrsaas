<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 遮罩层 -->
      <el-card>
        <!-- Tabs 标签页 -->
        <el-tabs v-model="activeName" @tab-click="tabClick">
          <el-tab-pane label="登录账户设置" name="first">
            <!-- 表单项 -->
            <!--
              表单添加校验：
              1. form表单组件: :model="表单数据" :rules="校验规则"
              2. form-item : prop 属性
             -->
            <el-form ref="form" :model="accountInfo" :rules="rules" label-width="80px">
              <el-form-item label="姓名" prop="username">
                <el-input v-model="accountInfo.username" />
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input v-model="accountInfo.password" type="password" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="updateEmployees">更新</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane lazy label="个人详情" name="second"><UserInfo /></el-tab-pane>
          <el-tab-pane lazy label="岗位信息" name="third"><JobInfo /></el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getUserDetailById, saveUserDetailById } from '@/api/user'
import UserInfo from './components/user-info.vue'
import JobInfo from './components/job-info.vue'
import Cookies from 'js-cookie'
export default {
  components: { UserInfo, JobInfo },
  data() {
    return {
      activeName: Cookies.get('activeName') || 'first',
      // 发送请求获取过来的数据
      accountInfo: {},
      // 表单校验
      rules: {
        username: [
          { required: true, message: '请输入员工名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入员工密码', trigger: 'blur' },
          { min: 6, message: '密码长度最小6位', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.loadEnoloyeesInfo()
  },
  methods: {
    // 调用用户的基本信息接口
    async loadEnoloyeesInfo() {
      // 传入当前点击项的id
      const res = await getUserDetailById(this.$route.params.id)
      // console.log(res)
      this.accountInfo = res
    },
    // 更新用户信息
    async updateEmployees() {
      // async 和 await 的缺点
      // 错误 必须 try catch 进行捕获
      try {
        // 表单验证节点
        await this.$refs.form.validate()
        // 调用接口保存员工信息
        await saveUserDetailById(this.accountInfo)
        this.$message.success('添加成功')
      } catch (error) {
        console.log(error)
      }
    },
    tabClick() {
      Cookies.set('activeName', this.activeName)
    }
  }
}
</script>

<style>

</style>
