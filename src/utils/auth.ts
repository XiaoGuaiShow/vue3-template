import { useUserStore } from '@/store/modules/user'

const UserStore = useUserStore()

export function getToken() {
	return UserStore.userInfo.token ? UserStore.userInfo.token : '8c6c078fa7a2c5acaf3ddec6dee99167'
}

export function getMemberId() {
	return UserStore.userInfo.memberId ? UserStore.userInfo.memberId : 'Ierx12ca+BYCzS+OB2iRSg=='
}

export function getPlatId() {
	return 1003
}

export function getRefId() {
	return UserStore.userInfo.refId !== '' ? UserStore.userInfo.refId : 0
}

export function getVersion() {
	return UserStore.userInfo.version ? UserStore.userInfo.version : '6.10.2'
}

export function getikey() {
	return ''
}

export function getEnterpriseId() {
	return UserStore.userInfo.enterpriseId ? UserStore.userInfo.enterpriseId : 11
}
