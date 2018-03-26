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
        <slot v-if="!uploadFile">
          <el-upload
                  ref="import"
                  action=""
                  :show-file-list="false"
                  :on-change="xlsxImport"
                  :auto-upload="false">
              <el-button slot="trigger" :type="buttonBg" :size="buttonSize">{{buttonName}}</el-button>
          </el-upload>
        </slot>
        <slot v-if="!!uploadFile">
          <el-button :size="buttonSize" type="primary" @click="unSelect">{{uploadFile.name}}</el-button>
        </slot>
    </span>
</template>
<script>
import XLSX from 'xlsx';
export default {
  data() {
    return {
      uploadFile: "",
      buttonName: '导入EXCEL模板',
      buttonBg: "",
      buttonSize: "", //类型:large/normal/small/mini
      sendParentData: [],
      wb: null, //读取完成的数据
      rABS: false, //是否将文件读取为二进制字符串
    }
  },
  props: {
    btnName: {
      type: String,
      default: ''
    },
    btnSize: {
      type: String,
      default: ''
    },
  },
  mounted() {
    this.buttonName = this._props.btnName ? this._props.btnName : this.buttonName;
    this.buttonSize = (this._props.btnSize != 'normal') ? this._props.btnSize : '';
  },
  components: {},
  methods: {
    unSelect() {
      this.uploadFile = "";
      // this.$emit('exportNewExcelData', []);
    },
    xlsxImport(file, fileList) {
      console.log(file);
      this.uploadFile = file;
      let inputFiles = fileList[0].raw;
      let that = this;
      let reader = new FileReader();
      if (!inputFiles) return;

      if (this.rABS) {
         reader.readAsBinaryString(inputFiles); //将文件读取为二进制字符串
      } else {
        reader.readAsArrayBuffer(inputFiles); //读取结果是一个 ArrayBuffer 对象        
      }
      reader.onload = function(e) {
        let data = e.target.result;
        if (that.rABS) {
          that.wb = XLSX.read(data, {
            type: 'binary'
          });
        } else {
          console.log(data);
          var arr=that.fixdata(data);
          console.log(arr);
          that.wb = XLSX.read(btoa(arr), { //手动转化
            type: 'base64'
          });
        }
        console.log(data);
        //wb.SheetNames[0]是获取Sheets中第一个Sheet的名字
        //wb.Sheets[Sheet名]获取第一个Sheet的数据
        // let resultData=JSON.stringify( XLSX.utils.sheet_to_json(this.wb.Sheets[this.wb.SheetNames[0]]) );
        let resultData = XLSX.utils.sheet_to_json(that.wb.Sheets[that.wb.SheetNames[0]]);
        console.log("导入的是");
        console.log(resultData);
        // that.$emit('exportNewExcelData', resultData); //把结果通知给父级组件
      };
    },
    //文件流转BinaryString
    fixdata:function(data) {
      var o = "",
        l = 0,
        w = 10240;
      for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));
      o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
      return o;
    }
  },
}
</script>

<style>

</style>
