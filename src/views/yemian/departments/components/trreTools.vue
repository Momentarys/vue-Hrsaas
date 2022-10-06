<template>
  <el-row
    type="flex"
    justify="space-between"
    align="middle"
    style="height: 40px; width: 100%;"
  >
    <!-- 头部名称 -->
    <el-col>
      <span>
        {{ treeData.name }}
      </span>
    </el-col>
    <!-- 操作 -->
    <el-col :span="4">
      <el-row type="flex">
        <el-col>
          <span style="margin-right:16px">{{ treeData.manager }}</span>
        </el-col>
        <el-col>
          <el-dropdown @command="handleCommand">
            <span> 操作<i class="el-icon-arrow-down el-icon--right" /> </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add">添加子部门</el-dropdown-item>
              <!-- 编辑部门和删除部门只会在子节点上显示 -->
              <el-dropdown-item v-if="isRoot" command="edit">编辑部门</el-dropdown-item>
              <el-dropdown-item v-if="isRoot" command="del">删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'HRsaasTerrTools',
  props: {
    // 父组件自定义
    treeData: {
      type: Object, // 设置当前数据为必填
      required: true // 类型是Object
    },
    // 父组件定义，布尔值为false
    isRoot: { // isRoot 来控制 编辑部门 和 删除部门 的 显示 隐藏
      // 加变量控制
      type: Boolean,
      default: true // 默认显示
    }
  },
  data() {
    return {

    }
  },
  methods: {
    handleCommand(type) {
      console.log(type)
      if (type === 'add') {
      // 添加
      // 新增
        // 现在treeTools和addDept是兄弟组件，在treeTools.里控制 addDept 的显示隐藏不方便
        // 父组件传参 自定义事件 并点击触发弹出框
        // 点击添加子部门拿到当前这个节点  对应数据 this.treeData
        this.$emit('addDept', this.treeData)
      } else if (type === 'edit') {
      // 编辑
      } else {
      // 删除
      }
    }
  }

}
</script>

<style></style>
