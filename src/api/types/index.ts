export interface PageVo {
	currentIndex: number
	pageSize: number
}

export interface Result {
	code: string
	message: string
	traceId: string
	data: any
}

export interface ExportRecordListItem {
	id: string
	accountPeriod: string
	createTime: string
	fileName: string
	fileUrl: string
	month: number
	startDate: string
	status: 0 | 1 | 2 | 3
}

interface ExportRecordData {
	total: number
	list: ExportRecordListItem[]
}

export interface ExportRecordResult extends Result {
	data: ExportRecordData
}

export interface DeleteRecordResult extends Result {
	data: any
}
