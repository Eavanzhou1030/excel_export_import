<!--
  Auther:BY David Sam
  Time:2017/11/09
  ###数据流  [{"机器ID":"1","商品ID":"1"},{"机器ID":"2","商品ID":"2"}]
  列:每个对象的键,代表列,如:机器ID
  行:每个对象,代表行,关联列
  注:父组件向子组件注入控制等规则,以满足业务
-->

<template>
  <span>
    <el-button type="primary" @click="downloadExl" :type="buttonBg" :size="buttonSize">{{buttonName}}</el-button>
  </span>
</template>
<script>
import XLSX from 'xlsx';
import exportExcel from "@/utils/exportExcel";
export default {
  data() {
    return {
      buttonName: '下载EXCEL模板',
      buttonBg: "",
      buttonSize: "", //类型:large/normal/small/mini
      tmpDown: '',
      fileType: '', //上传的附件类型，默认为excel
    }
  },
  props: {
    exportData: {
      type: Array,
      default: []
    },
    exportField: {
      type: Array,
      default: []
    },
    btnName: {
      type: String,
      default: ''
    },
    btnSize: {
      type: String,
      default: ''
    },
    fileName: {
      type: String,
      default: ""
    }
  },
  mounted() {
    this.buttonName = this._props.btnName ? this._props.btnName : this.buttonName;
    this.buttonSize = (this._props.btnSize != 'normal') ? this._props.btnSize : '';
  },

  methods: {
    downloadExl() {
      var {
        exportData,
        exportField,
        fileName = ""
      } = this;

      if (!exportData.length) {
        this.$message({
          type: 'error',
          message: '没有内容可下载'
        })
        return;
      }

      exportExcel.downloadFunc(exportData, exportField, fileName);
    }
  },
}
</script>

<style lang="scss" scoped>
@import '../../style/_global';

span {
    display: inline-block;
}
</style>
