export function GetBaseAPIURL() {
  const baseUrl = process.env.VUE_APP_BASE_API
  let temp = ''
  const url = window.location.host
  if (url.indexOf('maiwei') >= 0) {
    temp = baseUrl + 'maiwei/'
  } else if (url.indexOf('mingzhe') >= 0) {
    temp = baseUrl + 'mingzhe/'
  } else if (url.indexOf('ruipai') >= 0) {
    temp = baseUrl + 'ruipai/'
  } else {
    temp = baseUrl + 'tripwise/'
  }
  return temp
}
