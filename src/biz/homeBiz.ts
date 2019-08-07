import eu from '../utils/electronUtils';

export function generateApiFile(apiSettings: any) {
  const params = apiSettings;
  try {
    debugger;
    params.apiParam = JSON.parse(apiSettings.apiParam || '{}');
    params.apiResult = JSON.parse(apiSettings.apiResult);
  } catch (error) {
    return Promise.reject(new Error('JSON 格式错误'));
  }
  return eu.req({ name: 'generateApi', params });
}

export function selectFolder() {
  return new Promise((resolve) => {
    eu.remote.dialog.showOpenDialog({
      properties: ['openDirectory'],
    }, resolve);
  });
}
