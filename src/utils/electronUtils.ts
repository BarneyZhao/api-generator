/**
 * IPC: Inter-Process Communication
 */

const { ipcRenderer, remote, shell } = (window as any).require('electron');

const funcs = {
  req(name: string) {
    return 'ipc-{0}-req'.replace('{0}', name);
  },
  res(name: string) {
    return 'ipc-{0}-res'.replace('{0}', name);
  },
};

const electronUtils = {
  req({ name, params }: { name: string, params: any }) {
    return new Promise((resolve) => {
      ipcRenderer.once(funcs.res(name), (evt: any, arg: any) => {
        console.log('res:', name, arg);
        resolve(arg);
      });
      console.log('req:', name, params);
      ipcRenderer.send(funcs.req(name), params);
    });
  },
  remote,
  shell,
};

export default electronUtils;
