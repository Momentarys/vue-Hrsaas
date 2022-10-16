<template>
  <div class="dashboard-container">
    <Upload-img />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import UploadExcel from '@/components/UploadExcel'
export default {
  name: 'Dashboard',
  // components: { UploadExcel },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  methods: {
    handleSuccess(data) {
      console.log('data', data)
    },
    beforeUpload(file) {
      console.log(file)
      if (file.size > 1024) {
        this.$message.error('to Big')
        return false
      }
      return true
    }

  }

}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
