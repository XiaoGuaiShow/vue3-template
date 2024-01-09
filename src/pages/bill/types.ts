export interface TableItem {
	id: number
	name: string
	range: string
	needInvoiced: string
	invoiced: string
	uninvoiced: string
	status: string
	lastDay: string
	[propName: string]: any
}
