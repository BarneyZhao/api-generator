// const axios = require('axios');
// const cheerio = require('cheerio');

const service = require('../app/services/baseService');

service.generateApi({
  apiFileName: 'AppTest',
  apiParam: {
    test1: 1, test2: 0, test3: 'str', test4: '',
  },
  // apiResult: {
  //   _systemTime: 1564475084749,
  //   code: '00000',
  //   test1: [1, 2],
  //   data: {
  //     data: '6626410', message: '修改邀请信息成功', success: true, test2: ['string1', 'string2'],
  //   },
  //   test3: [{
  //     test4: 1, test5: [1, 2], test6: '123', test7: { test8: [1, 2] }, test9: [{ test10: 1 }],
  //   }],
  //   isSuccess: true,
  //   message: '返回成功',
  //   success: true,
  //   systemTime: '2019-07-30 16:24:44',
  // },
  apiResult: {
    _systemTime: 3214250,
    code: '',
    data: [{
      activityType: 'dfsaewqa',
      createPin: 'teqwfdsa',
      id: 44340,
      name: 'rewqgbfsd',
      innerData: { i: 0, j: 45320 },
      innerList: [1],
    }, {
      activityType: '',
      createPin: 'teqwfdsa',
      id: 0,
      name: 'rewqgbfsd',
      innerData: { i: 0, j: 45320 },
      innerList: [],
    }],
    isSuccess: false,
    message: 'fdsaghda',
    success: false,
    systemTime: '',
  },
  outputPath: __dirname,
  method: 'POST',
  url: '/app/test',
}).then((data) => {
  console.log(JSON.stringify(data));
});
