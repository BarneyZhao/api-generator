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
