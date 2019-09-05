const FS = require('fs');
const Mustache = require('mustache');
const axios = require('axios');
const cheerio = require('cheerio');

const API_MUSTACHE = `${__dirname}/../template/api.mustache`;

const NUMBER = '[object Number]';
const STRING = '[object String]';
const BOOLEAN = '[object Boolean]';
const ARRAY = '[object Array]';
const OBJECT = '[object Object]';
const NULL = '[object Null]';
const UNDEFINED = '[object Undefined]';

const buildInterfaceList = (obj, interfaceName, interfaceList, isExport) => {
  const resultObj = {
    interfaceName, metaName: `${interfaceName}Meta`, fieldList: [], isExport,
  };
  Object.entries(obj).forEach(([key, value]) => {
    const field = {
      key, type: 'any', isOptional: false, val: 'null',
    };
    let arrItemType = '';
    switch (Object.prototype.toString.call(value)) {
      case NUMBER:
        field.type = 'number';
        field.val = '0';
        if (value === 0) field.isOptional = true;
        break;
      case STRING:
        field.type = 'string';
        field.val = '\'\'';
        if (value === '') field.isOptional = true;
        break;
      case BOOLEAN:
        field.type = 'boolean';
        field.val = 'false';
        break;
      case ARRAY:
        arrItemType = Object.prototype.toString.call(value[0]);
        if (arrItemType === ARRAY) throw new Error(`暂不支持多维数组[${key}]`);

        field.val = '[]';
        if (arrItemType === NULL || arrItemType === UNDEFINED) {
          // throw new Error(`数组${key}为空或item为Null/Undefined`);
          field.type = 'any[]';
        } else if (arrItemType === NUMBER) {
          field.type = 'number[]';
          field.val = '[0]';
        } else if (arrItemType === STRING) {
          field.type = 'string[]';
          field.val = '[\'\']';
        } else if (arrItemType === BOOLEAN) {
          field.type = 'boolean[]';
          field.val = '[false]';
        } else {
          field.type = `${interfaceName}$${key}[]`;
          field.val = `[${interfaceName}$${key}Meta]`;
          buildInterfaceList(value[0], `${interfaceName}$${key}`, interfaceList);
        }
        break;
      case OBJECT:
        field.type = `${interfaceName}$${key}`;
        field.val = `${interfaceName}$${key}Meta`;
        buildInterfaceList(value, field.type, interfaceList);
        break;
      default:
        // NULL 和 UNDEFINED 的情况
        break;
    }
    resultObj.fieldList.push(field);
  });
  interfaceList.push(resultObj);
};

exports.getApiInfoFromWiki = async ({ url, cookie }) => {
  const response = await axios({
    method: 'get',
    url,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      Origin: 'https://cf.jd.com',
      Referer: 'https://cf.jd.com/',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36',
      Cookie: `JSESSIONID=${cookie}`,
    },
  }).catch((err) => {
    console.log(err);
    return { data: { isError: true, message: 'axios 调用错误' } };
  });
  if (response.data.isError) return response.data;
  const $ = cheerio.load(response.data, { decodeEntities: false });
  console.log($('title').text());
  const apiUrl = $('h1').filter((i, el) => $(el).text() === '接口定义').next().children().text();
  console.log(apiUrl);
  return {
    apiTitle: $('title').text(),
    apiUrl: apiUrl && apiUrl.replace(/(https?:\/\/)?mac.jd.com/, ''),
  };
};

exports.checkFileExist = filePath => new Promise((resolve, reject) => {
  resolve(FS.existsSync(filePath));
});

exports.generateApi = (apiSettings) => {
  const paramsInterfaceList = [];
  const resultInterfaceList = [];
  return new Promise((resolve, reject) => {
    try {
      const paramInterface = `${apiSettings.apiFileName}Param`;
      const resultInterface = `${apiSettings.apiFileName}Result`;
      buildInterfaceList(apiSettings.apiParam, paramInterface, paramsInterfaceList, true);
      buildInterfaceList(apiSettings.apiResult, resultInterface, resultInterfaceList, true);

      const apiTpl = FS.readFileSync(API_MUSTACHE, { encoding: 'utf8' });
      const fileContent = Mustache.render(apiTpl, {
        paramsInterfaceList,
        resultInterfaceList,
        moreIndent: apiSettings.codeIndent === 4,
        paramInterface,
        resultMeta: `${resultInterface}Meta`,
        apiParamJSON: JSON.stringify(apiSettings.apiParam),
        apiResultJSON: JSON.stringify(apiSettings.apiResult),
        ...apiSettings,
      });

      const jsonFile = FS.createWriteStream(apiSettings.apiFilePath, {
        flags: 'w',
        defaultEncoding: 'utf8',
      });
      jsonFile.write(fileContent);
      jsonFile.end();
      resolve(paramsInterfaceList.concat(resultInterfaceList));
    } catch (error) {
      reject(error);
    }
  });
};
