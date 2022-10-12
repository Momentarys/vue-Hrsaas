<template>
  <!-- visible 控制显示隐藏   close 点击后的效果发送给父组件 -->
  <el-dialog title="新增员工" :visible="dialogvisible" @close="handleClose">
    <!-- 表单 -->
    <!-- 表单校验 -->
    <el-form ref="addEmploy" label-width="120px" :model="formData" :rules="rules">
      <el-form-item label="姓名" prop="username">
        <el-input v-model="formData.username" style="width:80%" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="formData.mobile" style="width:80%" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="入职时间" prop="formOfEmployment">
        <el-date-picker v-model="formData.timeOfEntry" style="width:80%" placeholder="请选择入职时间" />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select v-model="formData.formOfEmployment" style="width:80%" placeholder="请选择">
          <el-option v-for="item in hireType" :key="item.id" :label="item.value" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="departmentName">
        <el-input v-model="formData.workNumber" style="width:80%" placeholder="请输入工号" />
      </el-form-item>
      <el-form-item label="部门" prop="timeOfEntry">
        <el-input v-model="formData.departmentName" style="width:80%" placeholder="请选择部门" @focus="getDepartments" />
        <el-tree v-show="isShow" v-loading="loading" style="width:80%" :data="treeData" :props="{label:'name'}" default-expand-all @node-click="selectNode" />
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker v-model="formData.correctionTime" style="width:80%" placeholder="请选择转正时间" />
      </el-form-item>
    </el-form>
    <!-- footer插槽 -->
    <template v-slot:footer>
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small">取消</el-button>
          <el-button type="primary" size="small" @click="addEmployee">确定</el-button>
        </el-col>
      </el-row>
    </template>
  </el-dialog>

</template>

<script>
// 实现弹窗组件的显示和隐藏
// 其实 el-dialog 组件显示隐藏 visible
// 父到子 props
// 点击关闭按钮 close $emit去改父组件里的值 (update:dialogVisible)
// handleClose 完善  //1，表单重置2.表单绑定的值从新赋值

// 表单校验
// 需求
// 用户名必填，username,长度为1-4位
// 手机号必填，mobile, 需满足正则表达式/^1[3-9]\d{9}$/
// 聘用形式必填，formofEmployment
// 工号必填，workNumber
// 部门必填，departmentName
// 入职时间必填，timeofEntry
// 转正时间可选，correctionTime

// 表单校验步骤
// eL-form配置model和rules属性
// el-form-item配置prop属性
// 表单进行v-model双向绑定
import employeesEnum from '@/api/constant/employees' // 区分正式非正式
import { getDepartmentsAPI } from '@/api/departments'
import { addEmployeeAPI } from '@/api/employees'
import { tranListToTreeData } from '@/utils'
export default {
  props: {
    dialogvisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 聘用形式 区分正式非正式
      hireType: employeesEnum.hireType,
      formData: {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      },
      rules: {
        username: [
          { required: true, message: 'Please enter a username', trigger: 'blur' },
          { min: 1, max: 4, message: 'username 1~4', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: 'Please enter a mobile', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: 'mobile 不满足格式', trigger: 'blur' }
        ],
        formOfEmployment: [
          { required: true, message: 'Please enter a formOfEmployment' }
        ],
        timeOfEntry: [
          { required: true, message: 'Please enter a timeOfEntry' }
        ],
        workNumber: [
          { required: true, message: 'Please enter a workNumber', trigger: 'blur' }
        ],
        departmentName: [
          { required: true, message: 'Please enter a departmentName' }
        ]
      },
      //   部门选择
      treeData: [{ name: '行政部', manager: '刘备' }],
      // 控制树状显示与隐藏
      isShow: false,
      //  加载
      loading: false

    }
  },
  methods: {
    handleClose() {
      this.formData = {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      }
      // refs 拿到form表单里的所有节点
      this.$refs.addEmploy.resetFields()// 重置校验结果
      this.$emit('update:dialogvisible', false)
    },
    async getDepartments() {
      // 调用数据的时候显示
      // 部门输入框点击聚焦时 显示数据
      this.isShow = true
      this.loading = true
      const { depts } = await getDepartmentsAPI()
      this.treeData = tranListToTreeData(depts, '')
      this.loading = false
    //   console.log(res)
    },
    // 点击部门框下内容 把内容赋值到输入框中
    selectNode(node) {
      console.log(node)
      //   选中树的节点 把节点对应的数据给 departmentName:这个字段
      this.formData.departmentName = node.name
      //  弹窗关闭的时候隐藏 选定数据的时候隐藏
      //   点击部门时触发，添加一个变量isShow控制树状结构的显示隐藏
      this.isShow = false
      //   细节优化
      //   el - tree生显示隐藏问题
      //   el - tree loading.状态
    },
    // 点击确认待用接口完成新增功能
    // 1. 接口封装 赋值
    // 2. 确定按钮 点击事件  from表单校验通过之后 调用接口
    async addEmployee() {
      // 表单校验通过
      try {
        // 获取form所有节点  validate 返回promise
        await this.$refs.addEmploy.validate()
        console.log(this.$refs.addEmploy)
        // 调用接口 将校验通过的form表单传回服务器
        await addEmployeeAPI(this.formData)
        // 点击确定发送数据 关闭弹窗
        this.handleClose()
        //  调用父级接口 重新渲染
        this.$parent.getEmployeeListAPI()
      } catch (error) {
        console.log(error)
      }
    }

  }
}
</script>

<style>

</style>
