import tool from '../common/tool';

let userInfo = tool.getLocalStorage('_User_Info_');
let baseApiUrl = '';

const baseUrl = process.env.VUE_APP_BASE_API;

export function getApiConfig(module) {
  if (!baseApiUrl) {
    baseApiUrl = GetBaseAPIURL();
  }
  return baseApiUrl + module.module + '/';
}

export function GetBaseAPIURL() {
  let temp = '';
  let url = window.location.host;
  if (url.indexOf('maiwei') >= 0) {
    temp = baseUrl + 'maiwei/';
  } else if (url.indexOf('mingzhe') >= 0) {
    temp = baseUrl + 'mingzhe/';
  } else if (url.indexOf('ruipai') >= 0) {
    temp = baseUrl + 'ruipai/';
  } else {
    temp = baseUrl + 'tripwise/';
  }

  return temp;
}

export function getUUId() {
  let s = [];
  let hexDigits = '0123456789abcdef';
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = '4'; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = '-';

  var uuid = s.join('');
  return uuid;
}

export function getToken() {
  let token = '';
  if (!userInfo || !userInfo.Token) {
    userInfo = tool.getLocalStorage('_User_Info_');
  }
  if (userInfo) token = userInfo['Token'];
  return token;
}

export function getMemberId() {
  let memberId = '';
  if (!userInfo || !userInfo['MemberId']) {
    userInfo = tool.getLocalStorage('_User_Info_');
  }

  if (userInfo) memberId = userInfo['MemberId'];
  return memberId;
}

export function getPlatId() {
  return tool.getLocalStorage('PlatId') || '1003';
}

export function getRefId() {
  return tool.getLocalStorage('RefId');
}

export function getikey() {
  let ikey = tool.getLocalStorage('EnterpriseKey');
  return ikey || '';
}

export function getVersion() {
  return '6.40.1';
}
