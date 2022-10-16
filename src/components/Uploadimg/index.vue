<template>
  <div>
    <!-- :http-request  覆盖默认的上传行为，可以自定义上传的实现 -->
    <!-- :file-list="fileList"  显示图片列表 -->
    <el-upload
      v-loading="loading"
      action="#"
      class="uploadImg"
      list-type="picture-card"
      :file-list="fileList"
      :on-preview="onPreview"
      :on-remove="onRemove"
      :on-change="onChenge"
      :http-request="onHttpRequest"
      :limit="1"
      :before-upload="beforeUpload"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <!-- 点击弹出游览图片 -->
    <el-dialog
      title="图片浏览"
      :visible.sync="previewDialog"
      width="30%"
    >
      <img style="width:100%" :src="previewImgUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5'
const cos = new COS({
  SecretId: 'AKIDwiLkDOK1SghYGo8E5vYwoSr24qOq21FF',
  SecretKey: 'pVwABwSiiU1oNjsmRr2ye4E9ctvhEWZM'
})
export default {
  name: 'UploadImg',
  props: {
    // 接收子组件传值 并且监听
    defaultUrl: {
      type: String,
      default: () => ''
    }
  },
  data() {
    return {
      // 图片路径盒子
      fileList: [
        // { name: 'default', url: 'http://destiny001.gitee.io/image/cxk.gif' }
      ],
      // 点击图片预览显示弹层
      previewDialog: false,
      // 点击每项图片预览
      previewImgUrl: '',
      loading: false
    }
  },
  watch: {
    // 监听父组件传值将改动过的数据 push给原数组
    defaultUrl() {
      this.fileList.push({
        name: 'default', url: this.defaultUrl
      })
    }
  },
  methods: {
    // 点击查看图片
    onPreview(file) {
      this.previewDialog = true
      this.previewImgUrl = file.url
      console.log('点击预览')
    },
    // 点击删除图片
    onRemove(file, fileList) {
      this.fileList = fileList
    },
    // 监听图片变化
    // file 图片的本身
    onChenge(file, fileList) {
      this.fileList = fileList
      console.log(file, fileList)
    },
    // 上传图片之前验证规则
    beforeUpload(file) {
      // 1. 文件类型
      const allowTypes = ['image/jpeg', 'image/gif']
      // 循环 查我某一个数据 是否在数组中
      // 1.some()某一个数据 是否在 数组中
      // 2.find()查找，返回找到的那一项
      // 3.findIndex()查找，找到的那一项的茶引更复杂的查找
      // 4.indexof("1')查找，返回的索引[{id:1},{id:2}]用于简单类型数组
      // 5.includes查找，返回的是布尔 用于前单类型数组
      const ishas = allowTypes.includes(file.type)
      if (!ishas) {
        this.$message.error('亲,只能上传' + allowTypes.join(',') + '类型文件')
        return false
      }
      // 限制图片上传到大小
      const maxSize = 1 * 1024 * 1024
      if (file.size > maxSize) {
        this.$message.error('图片大小不能大于1MB')
        return false
      }
    },

    // 覆盖默认上传的行为
    // 1.本地选择上传原米有一个数据 + 选择的数据
    // 2.请求上传 成功/失败 原来有一个数据
    onHttpRequest({ file }) {
      // console.log(file)
      this.loading = true
      cos.putObject({
        Bucket: 'hz-zz-1314348845', /* 填入您自己的存储桶，必须字段 */
        Region: 'ap-shanghai', /* 存储桶所在地域，例如ap-beijing，必须字段 */
        Key: file.name, /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
        Body: file, /* 必须，上传文件对象，可以是input[type="file"]标签选择本地文件后得到的file对象 */
        onProgress: function(progressData) {
          console.log(JSON.stringify(progressData))
        }
      }, (err, data) => {
        // err 上传失败的信息如果上传成功err为nuLL
        // data 上传成功的信息
        // console.log(err, data)
        // 判断 提示上传失败
        if (err) return this.$message.error('上传图片失败')
        // 父级定义事件 子传父修改后发送给父级
        this.loading = false
        this.$emit('on-success', {
          imgUrl: 'https://' + data.Location
        })
        // console.log(err || data)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
    .uploadImg{
        width: 148px;
        height: 148px;
        overflow: hidden;
    }
</style>
