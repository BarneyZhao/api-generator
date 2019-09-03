/* eslint-disable import/no-dynamic-require */
// eslint-disable-next-line import/no-extraneous-dependencies
const { app } = require('electron');

const ipc = require(`${app.getAppPath()}/app/utils/ipc.js`);
const service = require(`${app.getAppPath()}/app/services/baseService.js`);

ipc.on('generateApi', service.generateApi);
ipc.on('checkFileExist', service.checkFileExist);
