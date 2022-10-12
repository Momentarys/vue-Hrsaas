<template>
  <div>
    <UploadExcel :on-success="handleSuccess" />
  </div>
</template>

<script>
import { importEmployeeAPI } from '@/api/employees'
export default {
  methods: {
    // 将中问转换成英文返回给服务器
    async handleSuccess({ header, results }) {
      console.log(header, results)
      // 转换英文
      const userRelations = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber'
      }
      const arr = []
      //  遍历数组里的内容
      results.forEach(item => {
        const userinfo = {}
        // item本身的key 在参与遍历
        // item[key] 代表了数据里每一项的属性值
        Object.keys(item).forEach(key => {
          // key 中文
          // userRelations[key] 英文
          // userinfo.timeOfEntry
          // key 对应的值 item[key]
          // 中文赋值给英文 userRelations的key值
          userinfo[userRelations[key]] = item[key]
        })
        // 将修改好的数据每一项添加到arr数组里
        arr.push(userinfo)
      })
      console.log(arr)
      // 封装并调用接口 把遍历好的数据传给后端
      await importEmployeeAPI(arr)
      // 导入成功提示
      this.$message.success('批量导入成功')
      // 路由返回上层
      this.$router.back()
    }
  }
}
</script>

<style>

</style>
