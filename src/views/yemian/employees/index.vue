<template>
  <div class="app-container">
    <!-- 公共组件 -->
    <!-- 给公共组件传入布尔值 用于判断显示隐藏 -->
    <PageTools type="success" :show-before="true">
      <!-- 插值 -->
      <template #before>
        <span>共166条记录</span>
      </template>
      <template #after>
        <el-button size="small" type="warning" @click="$router.push('/import')">导入</el-button>
        <el-button size="small" type="danger" @click="exportExcel">导出</el-button>
        <el-button size="small" type="primary" @click="handleEmploy">新增员工</el-button>
      </template>
    </PageTools>
    <!-- 放置表格和分页 -->
    <el-card>
      <el-table v-loading="loading" border :data="list">
        <el-table-column label="序号" sortable="" width="80" type="index" />
        <el-table-column label="姓名" prop="username" />
        <el-table-column label="工号" prop="workNumber" />
        <el-table-column label="聘用形式" prop="formOfEmployment" :formatter="formatEmployment">
          <!-- 过滤器 -->
        </el-table-column>
        <el-table-column label="部门" prop="departmentName" />
        <el-table-column label="入职时间" sortable="" prop="timeOfEntry">
          <!-- 作用域插槽 -->
          <template slot-scope="{row}">
            {{ row.timeOfEntry | formatDate }}
          </template>
        </el-table-column>
        <el-table-column label="账户状态" prop="hireType">
          <template slot-scope="{row}">
            <el-switch
              :value="row.enableState === 1"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="280">
          <template slot-scope="{row}">
            <el-button type="text" size="small" @click="goDetail(row)">查看</el-button>
            <el-button type="text" size="small">转正</el-button>
            <el-button type="text" size="small">调岗</el-button>
            <el-button type="text" size="small">离职</el-button>
            <el-button type="text" size="small">角色</el-button>
            <el-button type="text" size="small" @click="del(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <el-row type="flex" justify="end" align="middle" style="height: 60px">
        <!-- total总条目数   	page-size每页显示条目个数，支持 .sync 修饰符 -->
        <!-- layout	组件布局，子组件名用逗号分隔 -->
        <!-- current-page	当前页数 -->
        <!-- :page-sizes="[2,5,10]"  设置页数有几条数据 -->
        <!--  @current-chenge, @size-change 改变时触发 -->
        <el-pagination
          layout="prev, pager, next, sizes, total"
          :total="total"
          :current-page.sync="page.page"
          :page-size.sync="page.size"
          :page-sizes="[2,5,10]"
          @current-change="getEmployeeList"
          @size-change="getEmployeeList"
        />
      </el-row>
    </el-card>
    <addEmployee :dialogvisible.sync="dialogvisible" />
  </div>

</template>

<script>
import addEmployee from './components/add-employee.vue'
// 引入正式非正式
import EnumHireType from '@/api/constant/employees'
import { delEmployee } from '@/api/employees'
// import PageTools from '@/components/PageTools/index.vue
// 把结构复制进来 => slot的l旧语法新语法
// 把接口封装复制进来
// 引入接口
// 调用接口
import { getEmployeeListAPI } from '@/api/employees'
export default {
  name: 'HrsaasIndex',
  components: { addEmployee },
  data() {
    return {
      // 定义 一页 十条数据
      page: {
        page: 1,
        size: 10
      },
      // 每条内容
      list: [],
      // 总数据多少条
      total: 0,
      loading: false,
      // 接收账户状态的对象
      hireType: EnumHireType.hireType,
      // 新增弹出框显示与隐藏
      dialogvisible: false
    }
  },

  mounted() {
    this.getEmployeeList()
  },

  methods: {
    // 调用接口  获取员工列表数据
    async getEmployeeList() {
      try {
        this.loading = true
        const { rows, total } = await getEmployeeListAPI(this.page)
        // 赋值 渲染
        this.list = rows
        this.total = total
      } finally {
        this.loading = false
      }
    },
    // row一行的内容  绑定当前的每一列 column一列的内容 cellValue每一列的单元格
    formatEmployment(row, column, cellValue) {
      // console.log(cellValue)
      const res = this.hireType.find(ele => ele.id === parseInt(cellValue))
      // 三元表达式
      return res ? res.value : '非正式'
      // 运算符
      // return res && res.value || '非正式'
    },
    // 点击的时候需要弹出新增员工的弹窗
    handleEmploy() {
      // 新增员工的弹窗抽成一个组件
      // 实现弹窗组件的显示和隐藏
      this.dialogvisible = true
    },
    // 删除绑定点击事件
    // 二次确认
    // 调用删除接口
    // 需要刷新页面
    async del(id) {
      try {
        // 排序 防止异步操作
        await this.$confirm('确定删除该员工嘛', '提示', {
          type: 'warning'
        })
        // 调用删除接口
        await delEmployee(id)
        // 需要刷新页面列表
        this.getEmployeeList()
        this.$message.success('删除成功')
      } catch (error) {
        console.log(error)
      }
    },
    // 点击导出功能
    async exportExcel() {
      // 调用接口 获取数据进行渲染
      const { rows } = await getEmployeeListAPI({
        page: 1,
        size: this.total
      })
      console.log(rows)

      const { export_json_to_excel } = await import('@/vendor/Export2Excel')
      // 表头的数据
      // 表内容的数据
      // [[],[]]
      // 表内容的数据和员工列表是相同的，所以根据员工列表生成
      const exportExcelMapPath = {
        '手机号': 'mobile',
        '姓名': 'username',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      // 二维数组内部的数据结构：每一行的数据，顺序和表头保持一致
      // const header = ['姓名', '手机号', '入职日期', '聘用形式', '转正日期', '工号', '部门']
      const header = Object.keys(exportExcelMapPath)
      // 将对象转换成数组
      const data = rows.map(item => {
        // []
        // 表头数据
        // 循环表头是手机号
        // item.mobile
        // exportExcelMapPath[h] 取到表头里的表头
        return header.map(h => {
          // 如果表头的聘用形式模块  取js文件定义的属性
          if (h === '聘用形式') {
            // 查找以下hireType id
            const find = this.hireType.find(hire => {
              // 取到id 0正式 1非正式
              return hire.id === parseInt(item[exportExcelMapPath[h]])
            })
            return find ? find.value : '未知'
          }
          return item[exportExcelMapPath[h]]
        })
      })
      console.log(data)

      // console.log('导出')
      // 文件懒加载
      // import { export_json_to_excel } from '@/vendor/Export2Excel'
      export_json_to_excel({
        header, // 表头 必填
        // data里面的二维数组，每一个数组是一行数据
        data, // 具体数据，必填
        filename: '33期员工', // 非必填
        autoWidth: true, // 宽度自适应
        bookType: 'xlsx' // 文件类型
      })
    },
    // 点击查看
    goDetail(row) {
      // 查看路由的路径
      this.$router.push('/employees/detail/' + row.id)
    }
  }
}
</script>

<style lang='scss'>
</style>
