<template>
  <div>
    <el-dialog
      :title="title"
      width="50%"
      :visible.sync="dialogVisible"
      :before-close="handleclpse"
    >
      <el-form
        ref="roleDialogForm"
        :model="formData"
        label-width="80px"
      >
        <el-form-item
          prop="name"
          label="角色"
          :rules="[{required:true,message:'角色必填',trigger:'blur'}]"
        >
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="formData.description" type="textarea" row="3" />
        </el-form-item>
      </el-form>
      <el-row slot="footer" type="flex" justify="center" align="middle" class="dialog-footer">
        <el-button @click="handleclpse">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { addRoleAPI, updateRoleAPI } from '@/api/satting'
export default {
  name: 'HrsaasDddRole',
  props: {
    // 接收父级传参 Boolean 类型
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 表单校验
      formData: {
        name: '',
        description: ''
      },
      loading: false
    }
  },
  computed: {
    title() {
      return this.formData.id ? '编辑角色' : '新增角色'
    }
  },
  mounted() {},
  methods: {
    // 点击取消
    handleclpse() {
      // 父组件传值
      this.$emit('update:dialogVisible', false)
      this.$refs.roleDialogForm.validate()
      // 点击关闭时窗口 数据清空
      this.formData = {
        name: '',
        description: ''
      }
    },
    // 点击确认新增角色信息
    async submit() {
      try {
        // 调用验证器  验证成功或者失败
        this.$refs.roleDialogForm.validate()
        // 接口
        this.loading = true
        this.formData.id ? await updateRoleAPI(this.formData) : await addRoleAPI(this.formData)
        // 实现编辑功能
        // 1,编辑接口封装
        // 2,formData.id存在与否判断当前是处于编辑状态还是新增状态
        // 3。编辑模式调用编辑的接口新增模式调用新增接口

        // 把输入框内容发送个后端
        await addRoleAPI(this.formData)
        // 自定义事件 父传子
        // 调用渲染列表
        this.$emit('refreshList')
        // 成功提示  有id 就是编辑成功  没有id就是新增
        this.$message.success(this.formData.id ? '编辑成功' : '新增成功')
        // 优化点：
        // 1,当打开新增的时候1d是否会混乱（数据清楚）
        // 2,dialog标题显示
        // 成功后跳转
        this.handleclpse()
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
