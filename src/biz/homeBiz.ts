import eu from '../utils/platformUtils';

export function getApiInfo(wikiUrl: string, wikiCookie: string) {
  return eu.req({ name: 'getApiInfoFromWiki', params: { url: wikiUrl, cookie: wikiCookie } });
}

export function checkFile(filePath: string) {
  return eu.req({ name: 'checkFileExist', params: filePath });
}

export function generateApiFile(apiSettings: any) {
  const params = apiSettings;
  try {
    params.apiParam = JSON.parse(apiSettings.apiParam || '{}');
    params.apiResult = JSON.parse(apiSettings.apiResult);
  } catch (error) {
    return Promise.reject(new Error('JSON 格式错误'));
  }
  return eu.req({ name: 'generateApi', params });
}

export function selectFolder() {
  // to do: web端兼容
  return new Promise((resolve) => {
    eu.remote.dialog.showOpenDialog({
      properties: ['openDirectory'],
    }, resolve);
  });
}
