<template>
  <!-- 新增部门的弹层 -->
  <el-dialog title="新增部门" :visible="dialogVisible">
    <!-- 表单组件  el-form   label-width设置label的宽度   -->
    <!-- 匿名插槽 -->
    <el-form ref="addDeptForm" label-width="120px" :model="formData" :rules="rules">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formData.name" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="formData.code" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select v-model="formData.manager" style="width:80%" placeholder="请选择" @focus="getEmployeeSimple">
          <el-option v-for="item in peoples" :key="item.id" :label="item.username" :value="item.username" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="formData.introduce" style="width:80%" placeholder="1-300个字符" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
    <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
    <el-row slot="footer" type="flex" justify="center">
      <!-- 列被分为24 -->
      <el-col :span="6">
        <el-button type="primary" size="small" :loading="loading">确定</el-button>
        <el-button size="small" @click="handleClose">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getDepartmentsAPI, addDepartmentsAPI } from '@/api/departments'
import { getEmployeeSimpleAPI } from '@/api/employees'
export default {
  // 通过属性控制组件显隐
  // 父子
  // 子到父用.sync在关闭弹窗的时候update:dialogVisible
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    // 父组件传参
    treeData: {
      type: Object,
      //  当前项所有数据
      default: () => ({})
    }
  },
  data() {
    // 部门编码在整个模块中都不允许重复
    // 拿到所有的部门数据一个个的比较过去如果出现重复则校验不通过否则校验通过
    const codeCheck = async(rule, value, callback) => {
      // 调用接口，获取已有的角色列表
      const { depts } = await getDepartmentsAPI()
      // 判断编码里面有没有重复的 重复返回true
      const isRepeat = depts.some((ele) => ele.code === value)
      // 有报错提示，反则
      isRepeat ? callback(new Error(`模块已经存在${value}编码`)) : callback()
    }

    // 现在定义一个函数 这个函数的目的是 去找 同级部门下 是否有重复的部门名称
    const checkNameRepeat = async(rule, value, callback) => {
      // 先要获取最新的组织架构数据
      const { depts } = await getDepartmentsAPI()
      // console.log(depts)
      // depts是所有的部门数据55555555
      // 如何去找技术部所有的子节点
      //   找同级部门
      const isRepeat = depts.filter(item => item.pid === this.treeData.id).some(item => item.name === value)
      isRepeat ? callback(new Error(`该部门下已经有${value}的部门了`)) : callback()
    }
    // 部门名称 同级部门中禁止出现重复部门
    // 重点 是同级部门
    // 如何拿统计部门把同级的节点传递过来
    // 先拿到所有 同级部门的数据 一个个的比较过去 如果出现重复则校验不通过否则校验通过
    return {
      // 通过属性控制组件显隐
      // 父子
      // 子到父用.sync 在关闭弹窗的时候 update:dialogVisible
      // 部门名称 (name) : 必填1-50个字符 / 同级部门中禁止出现重复部门
      // 部门编码(cod) ：必填1-50个字符 / 部门编码在整个模块中都不允许重复
      // 部门负责人 (manager) :必填
      // 部门介绍 (introduce) :必填1-300个字符
      formData: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      rules: {
        name: [
          { required: true, message: '部门名称必填', trigger: 'blur' },
          { min: 1, max: 50, message: '部门名称1-50个字符', trigger: 'blur' },
          { trigger: 'blur', validator: checkNameRepeat }
        ],
        code: [
          { required: true, message: '部门编码必填', trigger: 'blur' },
          { min: 1, max: 50, message: '部门编码1-50个字符', trigger: 'blur' },
          { trigger: 'blur', validator: codeCheck }
        ],
        manager: [
          { required: true, message: '部门负责人必填' }
        ],
        introduce: [
          { required: true, message: '部门介绍必填', trigger: 'blur' },
          { min: 1, max: 300, message: '部门介绍1-300个字符', trigger: 'blur' }
        ]
      },
      peoples: [],
      loading: false
    }
  },
  methods: {
    // 点击取消按钮 关闭弹窗
    handleClose() {
      this.$emit('update:dialogVisible', false)
      //  清除校验
      this.$refs.addDeptForm.resetFields()
      // 点击取消每一项内容为空
      this.formData = {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      }
    },
    // 获取员工的简单列表
    async getEmployeeSimple() {
      const res = await getEmployeeSimpleAPI()
      // console.log(res)
      this.peoples = res
    },
    async submit() {
      try {
        // 表单校验通过 validate()
        await this.$refs.addDeptForm.validate()
        // 调用接口
        this.loading = true
        // 传入部门每项资料，和父组件传来的部门id
        await addDepartmentsAPI({ ...this.formData, pid: this.treeData.id })
        // 因为是添加子部门，所以我们需要将新增的部门pid设置成当前部门的1d, 新增的部门就成了自己的子部门
        // 确定按钮的loading状态

        // 接口新增成功之后 消息提示成功
        this.$massage.success('新增成功')
        // 刷新父组件的组织架构列表
        this.$parent.getDepartmentsAPI()
        // 关闭弹窗
        this.handleClose()
        // 刷新父组件的组织架构列表思考$parent是否合适
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style>

</style>
