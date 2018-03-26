import XLSX from 'xlsx';

var wopts = {
  bookType: 'xlsx',
  bookSST: false,
  type: 'binary'
};

const exportDownloadUtil = {
  downloadFunc(exportData, exportField, fileName = "") {
    const wb = {
      SheetNames: ['Sheet1'],
      Sheets: {},
      Props: {}
    };

  // exportField是一个数组，存放表头中的标签和对应的索引，比如[{label: 'name', index: 0}, {label: 'city', index: 1}]

  // exportData是一个二维数组，存放数据，比如
  // [
  //   ['Alice', 'Beijing'],
  //   ['Bob', 'Tianjin']
  // ]

  //xItem会变成这样 {name: 'Alice', city: 'Beijing'}
 
  //data的数值会变成这样
  // [
  //   {name: 'Alice', city: 'Beijing'},
  //   {name: 'Bob', city: 'Tianjin'}
  // ]
    var data = exportData.map((item, index) => {
      return exportField.reduce((xItem, fieldItem, fieldIndex) => {
        xItem[fieldItem.label] = item[fieldItem.index];
        return xItem;
      }, {});
    });

    wb.Sheets['Sheet1'] = XLSX.utils.json_to_sheet(data); //通过json_to_sheet转成单页(Sheet)数据
    this.saveAs(new Blob(
      [this.s2ab(XLSX.write(wb, wopts))], {
        type: "application/octet-stream"
      }
    ), (fileName ? fileName : Date.now()) + '.' + (wopts.bookType == "biff2" ? "xls" : wopts.bookType));
  },
  s2ab(s) {
    if (typeof ArrayBuffer !== 'undefined') {
      var buf = new ArrayBuffer(s.length);
      var view = new Uint8Array(buf);
      for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
      return buf;
    } else {
      var buf = new Array(s.length);
      for (var i = 0; i != s.length; ++i) buf[i] = s.charCodeAt(i) & 0xFF;
      return buf;
    }
  },
  saveAs(obj, fileName) { //当然可以自定义简单的下载文件实现方式
    var tmpa = document.createElement("a");
    tmpa.download = fileName || "下载";
    tmpa.href = URL.createObjectURL(obj); //绑定a标签
    tmpa.click(); //模拟点击实现下载
    setTimeout(function() { //延时释放
      URL.revokeObjectURL(obj); //用URL.revokeObjectURL()来释放这个object URL
    }, 100);
  }
};

export default exportDownloadUtil;
