const service = require('../app/services/baseService');

service.generateApi({
  apiFileName: 'AppTest',
  apiParam: {
    test1: 1, test2: 0, test3: 'str', test4: '',
  },
  apiResult: {
    test1: 1, test2: 0, test3: 'str', test4: '',
  },
  outputPath: __dirname,
  method: 'POST',
  url: '/app/test',
});
