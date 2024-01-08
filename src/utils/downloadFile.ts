interface DownloadOptions {
	fileName?: string
	contentType?: string
}

export default (res: any, options?: DownloadOptions) => {
	try {
		let fileName = 'downloaded_file' // 默认文件名
		let contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' // 默认文件类型

		// 获取Content-Disposition标头
		const contentDisposition = res.headers['content-disposition']

		if (contentDisposition) {
			// 从Content-Disposition标头中提取文件名
			const fileNameMatch = /filename=([^;]+)/.exec(contentDisposition)
			fileName = fileNameMatch ? fileNameMatch[1] : 'downloaded_file'
		}

		if (options?.fileName) {
			fileName = options.fileName
		}

		if (options?.contentType) {
			contentType = options.contentType
		} else {
			// 推断文件类型
			const contentTypeHeader = res.headers['content-type']
			if (contentTypeHeader) {
				contentType = contentTypeHeader.split(';')[0]
			}
		}

		// 创建一个Blob对象来存储文件数据流
		const blob = new Blob([res.data], {
			type: contentType
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
		console.error('下载文件时出错：', error)
	}
}
