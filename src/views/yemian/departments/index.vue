<template>
  <div class="departments-container">
    <el-card>
      <!-- 组件布局 头部 -->
      <!-- 添加自定义事件布尔值为false -->
      <treeTools :tree-data="title" :is-root="false" @addDept="handleAddDept" />
    </el-card>
    <el-tree :data="departs" :props="defaultProps" :default-expand-all="true">
      <!-- 子组件 -->
      <!-- 自定义点击事件 利用父组件 修改兄弟组件的值 弹出框 -->
      <!-- data -->
      <treeTools slot-scope="{data}" :tree-data="data" @addDept="handleAddDept" />
    </el-tree>
    <!-- 父传子 点击为true 显示弹出框 -->
    <add-dept :dialog-visible.sync="dialogVisible" :tree-data="currentData" />
  </div>
</template>

<script>
import { getDepartmentsAPI } from '@/api/departments'
import treeTools from './components/trreTools.vue'
import { tranListToTreeData } from '@/utils'
import AddDept from './components/add-dept.vue'
export default {
  name: 'HrsaasIndex',
  components: { treeTools, AddDept },
  data() {
    return {
      departs: [{ name: '总裁办', manager: '曹操', children: [{ name: '董事会', manager: '曹丕' }] },
        { name: '行政部', manager: '刘备' },
        { name: '人事部', manager: '孙权' }],
      defaultProps: {
        label: 'name' // 表示 从这个属性显示内容
      },
      // 头部导航
      title: { name: '江苏传智播客教育科技股份有限公司', manager: '负责人' },
      // 添加编辑删除三项的弹出框
      dialogVisible: false,
      currentData: {}
    }
  },
  mounted() {
    this.getDepartments()
  },
  methods: {
    // 那组织架构的数据
    async getDepartments() {
      // 解构组织架构数据
      const { depts, companyName, companyManage } = await getDepartmentsAPI()
      this.departs = tranListToTreeData(depts, '')
      // 头部获取接口数据
      this.title = { name: companyName, manager: companyManage, id: '' }
      // 需要将其转化成树形结构
      // console.log(this.departs)
    },
    // 自定义事件
    handleAddDept(data) {
      // 点击为true显示弹出框
      this.dialogVisible = true
      this.currentData = data
      // console.log(this.currentData)
    }
  }
}
</script>

<style lang="scss">
.departments-container {
  width: 900px;
  margin: 20px auto;
  .el-card__body{
    padding-right: 0px;
  }
}
</style>
