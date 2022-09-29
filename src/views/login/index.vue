<template>
  <div class="login-container">
    <el-form ref="loginForm" class="login-form" auto-complete="on" label-position="left" :model="loginForm" :rules="rules">

      <div class="title-container">
        <h3 class="title">
          <img src="@/assets/common/login-logo.png" alt="">
        </h3>
      </div>
      <!-- 账户登录框 -->
      <el-form-item prop="mobile">
        <span class="svg-container el-icon-user-solid" />
        <el-input v-model="loginForm.mobile" placeholder="请输入内容" />
      </el-form-item>
      <!-- 登陆密码 -->
      <el-form-item prop="password">
        <!-- 密码锁 -->
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input ref="pwd" v-model="loginForm.password" :type="passwordType" placeholder="请输入内容" />
        <!-- 密码显示与隐藏 -->
        <span class="svg-container" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-button class="loginBtn" :loading="loading" @click="login">登录</el-button>

      <div class="tips">
        <span style="margin-right:20px;">账号: 13800000002</span>
        <span> 密码: 123456</span>
      </div>

    </el-form>
  </div>
</template>

<script>
/* 环境变量的作用
1.正常公司中 有四个环境 开发 dev 测试 test 预发 uat 线上 pro
2.在项目如何配置这几个环境 通过 .env 配置 base api
  开发环境的接口前缀 /api
  线上环境的接口前缀 /prod-api
*/

// 实现密码盒子的切换
// 1,点击闭上眼睛的图片=》睁开type text图片变成睁开眼睛
// 2,图片睁开眼睛=》闭上type password图片变成上眼睛

// El-form-item绑定对应的属性，El-input绑定对应的值
// 手机号必填格式按照国家要求来
// 密码 必填 程度6,16
import { validPhone } from '@/utils/validate'
// import { loginAPI } from '@/api/login'
export default {
  name: 'Login',
  data() {
    const phoneValid = (rule, value, callback) => {
    // rule 验证规则
    // value 正在验证的属性 对应 值
    // callback 验证完成时调用的回调函数
    // 不管是对的还是错的 都会推出去
      if (!validPhone(value)) {
        callback(new Error('格式不正确'))
      } else {
        callback()
      }
    }
    return {
      // 定义密码初始值
      passwordType: 'password',
      // 登录账户与密码
      loginForm: {
        mobile: '13800000002',
        password: '123456'
      },
      // 账户和密码 正则
      rules: {
        mobile: [
          { required: true, message: '手机号码必填', trigger: 'blur' },
          // validator验证器 函数验证
          { validator: phoneValid, massage: '手机号码格式不对', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码必填', trigger: 'blur' },
          { min: 6, max: 16, message: '密码格式不对', trigger: 'blur' }
        ]
      },
      loading: false
    }
  },
  methods: {
    // 判断 passwordType等于'password'  点击把text复制给passwordType 然后循环
    showPwd() {
      this.passwordType === 'password' ? this.passwordType = 'text' : this.passwordType = 'password'
      this.$nextTick(() => {
        this.$refs.pwd.focus()
      })
    },
    // 点击登录按钮 表单验证
    async login() {
      try {
        // 表达自带方法验证表单 validate()
        await this.$refs.loginForm.validate()
        this.loading = true
        // 异步传参方法
        await this.$store.dispatch('user/loginAction', this.loginForm)
        this.$router.push('/')
      } finally {
        this.logding = false
      }
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#68b0fe;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  background-image: url('~@/assets/common/login.jpg'); // 设置背景图片
  background-position: center; // 将图片位置设置为充满整个屏幕
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    // background: rgba(0, 0, 0, 0.1);
    background: rgba(255, 255, 255, 0.7); // 输入登录表单的背景色
    border-radius: 5px;
    color: #454545;
  }
  .el-form-item__error {
    color: #fff
  }
  .loginBtn {
  background: #407ffe;
  height: 64px;
  line-height: 32px;
  font-size: 24px;
  width: 100%;
  margin-bottom: 30px;
  border: none;
  color: #fff;
}
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#68b0fe;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
