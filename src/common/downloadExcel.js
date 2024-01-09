export default (res) => {
  try {
    // 获取Content-Disposition标头
    const contentDisposition = res.headers['content-disposition']

    // 从Content-Disposition标头中提取文件名
    const fileNameMatch = /filename=([^;]+)/.exec(contentDisposition)
    const fileName = fileNameMatch ? fileNameMatch[1] : 'excel_file.xlsx'

    // 创建一个Blob对象来存储Excel数据流
    const blob = new Blob([res.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    })

    // 创建一个下载链接
    const url = window.URL.createObjectURL(blob)

    // 创建一个<a>标签并设置其属性，然后模拟点击以触发下载
    const link = document.createElement('a')
    link.href = url
    link.download = decodeURIComponent(fileName)
    link.click()

    // 释放Blob对象和URL对象
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('下载Excel文件时出错：', error)
  }
}
