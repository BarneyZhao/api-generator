export const urlReg = /\{(.+?)\}/g;

export function getFileNameByUrl(url: string) {
  let pureUrl = url;
  if (url.includes('?')) pureUrl = url.slice(0, url.lastIndexOf('?'));
  pureUrl = pureUrl.replace(urlReg, ''); // 大括号
  const strArr = pureUrl.split('/').filter(Boolean);
  const resultArr: string[] = [];
  strArr.forEach((s) => {
    if (s) resultArr.push(s.slice(0, 1).toUpperCase() + s.slice(1, s.length));
  });
  return resultArr.join('');
}

export function isJSON(str: string) {
  if (typeof str === 'string') {
    try {
      const obj = JSON.parse(str);
      if (typeof obj === 'object' && obj) {
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }
  return false;
}
