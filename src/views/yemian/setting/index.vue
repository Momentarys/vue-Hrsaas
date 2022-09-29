<template>
  <div class="app-container">
    <el-card shadow="always">

      <el-tabs v-model="activeName">
        <!-- 角色管理 -->
        <el-tab-pane
          label="角色管理"
          name="first"
        ><el-row>
           <el-col :span="24" /><el-button
             type="primary"
             style="margin-left: 10px"
             size="small"
             icon="el-icon-plus"
             @click="handleAdd"
           >新增角色</el-button>
         </el-row>
          <!-- Table 表单 -->
          <!-- 第一页数据 -->
          <el-table v-loading="loading" border="" :data="roleList">
            <el-table-column
              align="center"
              type="index"
              label="序号"
              width="120"
            />
            <el-table-column
              align="center"
              prop="name"
              label="名称"
              width="240"
            />
            <el-table-column align="center" prop="description" label="描述" />
            <el-table-column align="center" label="操作">
              <!-- 插值语法 row -->
              <template slot-scope="{row}">
                <el-button size="small" type="success">分配权限</el-button>
                <el-button size="small" type="primary" @click="editRole(row)">编辑</el-button>
                <el-button size="small" type="danger" @click="delRow(row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-row type="flex" align="middle" justify="end" style="height: 60px">
            <el-pagination
              background
              layout="prev, pager, next ,sizes"
              :total="total"
              :current-page.sync="page.page"
              :page-size.sync="page.pagesize"
              :page-sizes="[2, 5, 10, 20]"
              @current-change="getRoleList"
              @size-change="getRoleList"
            />
          </el-row>
        </el-tab-pane>
        <!-- 公司信息 -->
        <el-tab-pane label="公司信息" name="second">
          <!-- 头部 -->
          <el-alert
            title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
            type="info"
            show-icon
            :closable="false"
          />
          <!-- 表单内容 -->
          <el-form :model="companyInfo" label-width="120px" style="margin-top:50px">
            <el-form-item label="公司名称">
              <el-input v-model="companyInfo.name" disabled style="width:400px" />
            </el-form-item>
            <el-form-item label="公司地址">
              <el-input v-model="companyInfo.companyAddress" disabled style="width:400px" />
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="companyInfo.mailbox" disabled style="width:400px" />
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="companyInfo.remarks" type="textarea" :rows="3" disabled style="width:400px" />
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>

    </el-card>
    <!-- 子组件 -->
    <addRole ref="addRole" :dialog-visible.sync="dialogVisible" @refreshList="getRoleList" />
  </div>
</template>

<script>
import { getRoleListAPI, deleteRoleAPI, getCompanyInfoAPI } from '@/api/satting'
import addRole from './components/addRole.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'HrsaasIndex',
  components: { addRole },

  data() {
    return {
      // 控制新增角色弹出框
      loading: false,
      // 子组件修改 传给父组件 点击弹出框
      dialogVisible: false,
      // 第一位高亮
      activeName: 'first',
      // 获取角色列表接口 定义数据传给后端
      page: {
        page: 1,
        pagesize: 10
      },
      // 接口角色列表数据
      total: 0,
      roleList: [],
      // 公司信息
      companyInfo: {}
    }
  },
  computed: {
    ...mapGetters(['companyId'])
  },
  mounted() {
    this.getRoleList()
    this.getCompanyInfo()
  },

  methods: {
    // 获取角色信息
    async getRoleList() {
      try {
        // 获取角色信息 结构里面两项
        const { rows, total } = await getRoleListAPI(this.page)
        // 接口数据赋值给变量
        this.roleList = rows
        this.total = total
        // total大于0并且rows的length===0这种情况并不是正在的没有数据是有的，要重新发起请求
        // 当一页数据清除完后 数据跳转到上一页
        if (total > 0 && rows.length === 0) {
          this.page.page = this.page.page - 1
          this.getRoleList()
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    },
    // 点击新增 弹出列表
    handleAdd() {
      this.dialogVisible = true
    },
    // 点击传入实参
    editRole(row) {
      // 绑定点击事件
      // 拿到当前行这条数据
      // 回显再新增角色的组件上

      // 浅拷贝 修改时页面数据不会同步变动  点击确认时才会
      this.$refs.addRole.formData = { ...row }
      // row 直接赋值给 addRole 的 自定义名称
      // 地址一样 指的是同一个对象

      // 点击弹出框
      this.dialogVisible = true
      // 优化 数据是引用类型 带来的问题
    },
    // 点击删除
    async delRow(id) {
      try {
        await this.$confirm('确定要删除该角色吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        // console.log('success')
        // 删除接口封装
        // 调用删除接口
        await deleteRoleAPI(id)
        // 刷新列表
        this.getRoleList()
      } catch (error) {
        console.log('取消删除')
      }
    },
    async getCompanyInfo() {
      this.companyInfo = await getCompanyInfoAPI(this.companyId)
      console.log(this.companyInfo)
    }
    // 获取公司接口封装好
    // 拿到companyId
    // this.$store.state.user.userInfo.companyId
    // this.sstore,getters.companyId
    // 调用 获取公司接口
    // 渲染页面
  }
}
</script>
