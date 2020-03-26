/**
 * IPC: Inter-Process Communication
 */
import axios from 'axios';

let { ipcRenderer, remote, shell }: {[key:string]:any} = {};
if (window.require) {
  ({ ipcRenderer, remote, shell } = window.require('electron'));
}

const funcs = {
  req(name: string) {
    return 'ipc-{0}-req'.replace('{0}', name);
  },
  res(name: string) {
    return 'ipc-{0}-res'.replace('{0}', name);
  },
};

const platformUtils = window.require ? {
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
} : {
  req({ name, params }: { name: string, params: any }) {
    return axios({
      method: 'post',
      url: `/api/${name}`,
      data: params,
    }).then(data => data.data);
  },
};

export default platformUtils;
