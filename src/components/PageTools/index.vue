<template>
  <div>
    <template>
      <el-card class="page-tools">
        <el-row type="flex" justify="space-between" align="middle">
          <el-col v-if="showBefore">
            <div :class="`before ${type}`">
              <i :class="`el-icon-${type}`" />
              <!-- <span>共25条记录</span> -->
              <slot name="before" aa="11" />
            </div>
          </el-col>
          <el-col>
            <el-row type="flex" justify="end">
              <!-- <el-button size="small" type="warning">导入</el-button>
              <el-button size="small" type="danger">导出</el-button> -->
              <slot name="after" />
            </el-row>
          </el-col>
        </el-row>
      </el-card>
    </template></div>
</template>

<script>
// 组件封装
// 只可以支持4种类型：info success warning error
// -4种类型样式结构0K
// type
// validator
// 前半部分(before)可以通过变量来控制显示隐藏
export default {
  name: 'PageTools',
  //  父组件传值
  props: {
    type: {
      type: String,
      default: 'info',
      // 验证传参是否是以下四个  规则判断 传来的内容是否是其中的内容不是就为flase
      validator(value) {
        if (['info', 'success', 'warning', 'error'].includes(value)) {
          return true
        }
        return false
      }
    },
    // false隐藏 当没有数据的时候让他隐藏
    showBefore: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style lang='scss'>
 .page-tools {
    margin: 10px 0;
    .before {
      line-height: 34px;
      display: inline-block;
      border-radius: 3px;
      i {
        margin-right: 5px;
      }
      &.info {
        padding: 0px 10px;
        border: 1px solid rgba(145, 213, 255, 1);
        background: rgba(230, 247, 255, 1);
        i {
          color: #409eff;
        }
      }

      &.success {
        padding: 0px 10px;
        border: 1px solid #c2e7b0;
        background: #f0f9eb;
        i {
          color: #67c23a;
        }
      }

      &.warning {
        padding: 0px 10px;
        border: 1px solid #f5dab1;
        background: #fdf6ec;
        i {
          color: #e6a23c;
        }
      }

      &.error {
        padding: 0px 10px;
        border: #fbc4c4;
        background: #fef0f0;
        i {
          color: #f56c6c;
        }
      }
  }
 }
</style>
