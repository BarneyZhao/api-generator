// eslint-disable-next-line import/no-extraneous-dependencies
const { app } = require('electron');

const config = {
  WINDOW_OPS: {
    width: 1280,
    height: 806,
    minWidth: 1280,
    minHeight: 806,
    title: 'api-generator',
    webPreferences: {
      nodeIntegration: true,
    },
  },
  DEV_URL: 'http://localhost:8888',
  PROD_URL: 'file://{0}/dist/index.html',
  APP_MENUS: [
    {
      label: '窗口',
      role: 'window',
      submenu: [
        { label: '开启/关闭全屏', role: 'togglefullscreen' },
        { label: '重新加载', role: 'reload' },
        { label: '最小化', role: 'minimize' },
        { label: '关闭', role: 'close' },
      ],
    },
    {
      label: '编辑',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'delete' },
        { type: 'separator' },
        { role: 'selectAll' },
      ],
    },
    {
      label: '帮助',
      role: 'help',
      submenu: [
        { label: '开启/关闭开发者模式', role: 'toggledevtools' },
      ],
    },
  ],
  MAC_MENUS: {
    label: app.getName(),
    submenu: [
      { label: `关于 ${app.getName()}`, role: 'about' },
      { type: 'separator' },
      { label: '服务', role: 'services', submenu: [] },
      { type: 'separator' },
      { label: `退出 ${app.getName()}`, role: 'quit' },
    ],
  },
};

module.exports = config;
