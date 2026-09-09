import Excel from 'exceljs';
import {formatDate} from '@/utils/tool';
import {ElMessage} from 'element-plus';

/**
 * 导入Excel
 * @param {File} file
 * @param {number} [sheetIndex=1] sheet索引从1开始
 * @param {string} [encoding='gb2312'] csv文件编码
 * @returns {Promise<unknown>}
 */
export function importExcelToJson({file, sheetIndex = 1, encoding = 'gb2312'}) {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      reader.onload = async ev => {
        const data = ev.target.result;
        // csv格式
        if (/csv/i.test(file.type)) {
          const decoder = new TextDecoder(encoding);
          const text = decoder.decode(data);
          const tableData = text.split('\r\n');
          const rst = [];
          for (let [index, item] of tableData.entries()) {
            const row = item.split(',');
            const tr = [];
            for (let [cellIndex, cell] of row.entries()) {
              tr.push({row: index, col: cellIndex, value: cell});
            }
            rst.push(tr);
          }
          return resolve(rst);
        }
        // xlsx格式
        const workbook = new Excel.Workbook();
        const wb = await workbook.xlsx.load(data);
        const ws = wb.getWorksheet(sheetIndex);
        const rst = [];
        ws.eachRow({includeEmpty: false}, row => {
          const tr = [];
          row.eachCell({includeEmpty: true}, cell => {
            const {col, row, text} = cell;
            tr.push({col, row, value: text});
          });
          rst.push(tr);
        });
        resolve(rst);
      };
      reader.onerror = err => reject(err);
      reader.readAsArrayBuffer(file);
    } catch (e) {
      reject(e);
    }
  });
}

/**
 * 导出Excel
 * @param {object[]} data
 * @param {[string[]]} multiHeader
 * @param {{key: string, title: string}[]} header
 * @param {[number, number, number, number][]} merges
 * @param {string} filename
 * @param {string} ext
 * @param {boolean} [autoWidth=true]
 */
export function exportJsonToExcel({
  data = [],
  // 二维数组
  multiHeader = [],
  header = [],
  // 二维数组[rowStart, colStart, rowEnd, colEnd] / 字符串范围'A1:B2'
  merges = [],
  filename,
  ext = 'xlsx',
  autoWidth = true,
}) {
  const wb = new Excel.Workbook();//创建工作簿
  const sheet1 = wb.addWorksheet('Sheet1');
  // 表头样式
  const style = {
    font: {
      size: 12,
      color: {argb: '00000000'},
      bold: true,
    },
    fill: {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: '00EEEEEE'},
    },
    border: {
      top: {style: 'thin'},
      bottom: {style: 'thin'},
      left: {style: 'thin'},
      right: {style: 'thin'},
    },
  };
  // 单独添加表头, 以兼容多级表头
  const columns = [];
  const headerRow = [];
  for (let item of header) {
    let {title, key, width} = item;
    if (!width && autoWidth) {
      width = getWch(data, key);
    }
    // 没有header属性不会自动添加表头
    columns.push({key, width});
    headerRow.push(title);
  }
  multiHeader.push(headerRow);
  sheet1.columns = columns;
  for (let item of multiHeader) {
    sheet1.addRow(item);
  }
  // 添加数据
  sheet1.addRows(data);
  // 合并单元格
  for (let item of merges) {
    sheet1.mergeCells(item);
  }
  sheet1.eachRow({includeEmpty: true}, (row, rowNumber) => {
    row.eachCell({includeEmpty: true}, cell => {
      // cell.border = style.border;
      cell.alignment = {horizontal: 'left', vertical: 'middle', wrapText: true};
      // 表头样式
      if (rowNumber <= multiHeader.length) {
        cell.font = style.font;
        cell.fill = style.fill;
        cell.alignment = {horizontal: 'center', vertical: 'middle', wrapText: true};
      }
    });
  });
  // 固定表头
  sheet1.views = [{state: 'frozen', xSplit: 0, ySplit: multiHeader.length, activeCell: 'A1'}];
  // 页眉
  // sheet1.headerFooter.oddHeader = `&L&18&B&K000000左&R右`;
  // 导出
  wb.xlsx.writeBuffer().then(buffer => {
    downloadBlob(new Blob([buffer], {
      type: 'application/octet-stream',
    }), filename, ext);
  });
}

/**
 * 导出表格
 * @param {Object[]} columns
 * @param {Object[]} data
 * @param {string} filename
 * @param {string} ext
 * @param {[number, number, number, number][]} span
 * @returns {void}
 */
export function exportTableToExcel({
  columns = [],
  data = [],
  filename,
  ext,
  span = [],
}) {
  if (data?.length < 1) {
    return ElMessage.error(`暂无数据`);
  }
  const header = [];
  const multiHeader = [];
  const merges = [];
  let startIndex = 1;
  const hasChildren = columns.some(item => Array.isArray(item.children) && item.children.some(item => !item.downloadHidden));
  // 此处只处理二级表头, 再多需递归处理
  for (let col of columns) {
    if (col.downloadHidden) {
      continue;
    }
    const {title, children, key} = col;
    if (Array.isArray(children)) {
      multiHeader.push(title);
      for (let child of children) {
        if (!child.downloadHidden) {
          multiHeader.push('');
          header.push({
            title: child.title,
            key: child.key,
          });
        }
      }
      if (children.some(item => !item.downloadHidden)) {
        multiHeader.splice(startIndex + 1, 1);
      }
      const endIndex = startIndex + children.length - 1;
      if (children.length > 0) {
        merges.push([1, startIndex, 1, endIndex]);
      }
      startIndex = endIndex + 1;
    } else {
      if (hasChildren) {
        multiHeader.push(title);
        merges.push([1, startIndex, 2, startIndex]);
      }
      header.push({
        header: title,
        key,
      });
      startIndex++;
    }
  }
  for (let item of span) {
    const [rs, cs, re, ce] = item;
    // excel索引从1开始
    merges.push([
      rs + 1 + (hasChildren ? 2 : 1),
      cs + 1,
      re + 1 + (hasChildren ? 2 : 1),
      ce + 1,
    ]);
  }
  exportJsonToExcel({
    multiHeader: multiHeader.length > 0 ? [multiHeader] : [],
    header,
    merges,
    data,
    filename,
    ext,
  });
}

/**
 * 获取列的最大宽度
 * @param {Object[]} list
 * @param {string} key
 * @returns {number}
 */
function getWch(list, key) {
  let max = 10;
  for (let item of list) {
    if (!item[key]) {
      continue;
    }
    const val = String(item[key]);
    // 为了效率, 此处只判断第一个字符
    let wch = val.charCodeAt(0) > 255 ? val.length * 2 : val.length;
    max = Math.max(wch, 10);
  }
  return Math.min(max, 60) + 4;
}

/**
 * blob流下载
 * @param {blob} blob
 * @param {string} title
 * @param {string} ext
 */
export function downloadBlob(blob, title, ext = 'xlsx') {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${title}-${formatDate(new Date(), 'yyyyMMddhhmmss')}.${ext}`;
  link.click();
  URL.revokeObjectURL(url);
}

function formatSpan(data) {
  // 将合并单元格的数据放在一起
  const obj = {};
  for (let item of data) {
    const {xxxxx} = item;
    if (!Reflect.has(obj, xxxxx)) {
      obj[xxxxx] = [];
    }
    obj[xxxxx].push(item);
  }
  const list = Object.values(obj).flat();
  const rowspan = {};
  for (let [index, item] of list.entries()) {
    const {xxxxx} = item;
    if (!Reflect.has(rowspan, xxxxx)) {
      rowspan[xxxxx] = {rs: index, rl: 0, cs: 0, cl: 1};
    }
    rowspan[xxxxx].rl += 1;
  }
  // 导出时合并单元格格式
  const span = [];
  for (let key in rowspan) {
    const {rs, rl, cs, cl} = rowspan[key];
    span.push([rs, cs, rs + rl - 1, cs + cl - 1]);
  }

  // element合并单元格方法
  function handleSpan({row, rowIndex, columnIndex}) {
    const {xxxxx} = row;
    if (rowspan[xxxxx]?.cs === columnIndex) {
      return rowspan[xxxxx].rs === rowIndex ? {
        rowspan: rowspan[xxxxx].rl,
        colspan: rowspan[xxxxx].cl,
      } : {
        rowspan: 0,
        colspan: 0,
      };
    }
  }
}
