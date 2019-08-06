// eslint-disable-next-line import/no-extraneous-dependencies
const { ipcMain } = require('electron');

const str = {
  req(name) {
    return 'ipc-{0}-req'.replace('{0}', name);
  },
  res(name) {
    return 'ipc-{0}-res'.replace('{0}', name);
  },
};

const funcs = {
  on(name, service) {
    ipcMain.on(str.req(name), (event, arg) => {
      service(arg).then((data) => {
        event.sender.send(str.res(name), data);
      }).catch((err) => {
        console.log(err);
        event.sender.send(str.res(name), { err: err.message || err });
      });
    });
  },
};

module.exports = funcs;
