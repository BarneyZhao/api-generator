const FS = require('fs');
const Mustache = require('mustache');

const API_MUSTACHE = `${__dirname}/../template/api.mustache`;

const NUMBER = '[object Number]';
const STRING = '[object String]';
const BOOLEAN = '[object Boolean]';
const ARRAY = '[object Array]';
const OBJECT = '[object Object]';
const NULL = '[object Null]';
const UNDEFINED = '[object Undefined]';

const buildInterfaceList = (obj, interfaceName, interfaceList, isExport) => {
  const resultObj = { interfaceName, fieldList: [], isExport };
  Object.entries(obj).forEach(([key, value]) => {
    const field = { key, type: '', isOptional: false };
    let arrItemType = '';
    switch (Object.prototype.toString.call(value)) {
      case NUMBER:
        field.type = 'number';
        if (value === 0) field.isOptional = true;
        break;
      case STRING:
        field.type = 'string';
        if (value === '') field.isOptional = true;
        break;
      case BOOLEAN:
        field.type = 'boolean';
        break;
      case ARRAY:
        arrItemType = Object.prototype.toString.call(value[0]);
        if (arrItemType === ARRAY) throw new Error(`暂不支持多维数组[${key}]`);

        if (arrItemType === NULL || arrItemType === UNDEFINED) {
          // throw new Error(`数组${key}为空或item为Null/Undefined`);
          field.type = 'any[]';
        } else if (arrItemType === NUMBER) {
          field.type = 'number[]';
        } else if (arrItemType === STRING) {
          field.type = 'string[]';
        } else if (arrItemType === BOOLEAN) {
          field.type = 'boolean[]';
        } else {
          field.type = `${interfaceName}$${key}[]`;
          buildInterfaceList(value[0], `${interfaceName}$${key}`, interfaceList);
        }
        break;
      case OBJECT:
        field.type = `${interfaceName}$${key}`;
        buildInterfaceList(value, field.type, interfaceList);
        break;
      default:
        // NULL 和 UNDEFINED 的情况
        field.type = 'any';
        break;
    }
    resultObj.fieldList.push(field);
  });
  interfaceList.push(resultObj);
};

exports.generateApi = (apiSettings) => {
  // eslint-disable-next-line max-len
  // const apiResultObj = JSON.parse('{"_systemTime":1564475084749,"code":"00000","test1":[1,2],"data":{"data":"6626410","message":"修改邀请信息成功","success":true,"test2":["string1","string2"]},"test3":[{"test4":1,"test5":[1,2],"test6":"123","test7":{"test8":[1,2]},"test9":[{"test10":1}]}],"isSuccess":true,"message":"返回成功","success":true,"systemTime":"2019-07-30 16:24:44"}');
  const paramsInterfaceList = [];
  const resultInterfaceList = [];
  return new Promise((resolve, reject) => {
    try {
      buildInterfaceList(apiSettings.apiParam, `${apiSettings.apiFileName}Param`, paramsInterfaceList, true);
      buildInterfaceList(apiSettings.apiResult, `${apiSettings.apiFileName}Result`, resultInterfaceList, true);

      const apiTpl = FS.readFileSync(API_MUSTACHE, { encoding: 'utf8' });
      const fileContent = Mustache.render(apiTpl, {
        paramsInterfaceList,
        resultInterfaceList,
        moreIndent: apiSettings.codeIndent === 4,
        ...apiSettings,
      });

      const jsonFile = FS.createWriteStream(`${apiSettings.outputPath}/${apiSettings.apiFileName}.ts`, {
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
