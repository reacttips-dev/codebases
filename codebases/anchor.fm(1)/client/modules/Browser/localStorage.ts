import Promise from 'bluebird';
import LocalForage from 'localforage';
import * as ServerRenderingUtils from './../../../helpers/serverRenderingUtils.js';

let localForageInstance: any = null;

const getItem = (key: string): Promise<any> => {
  if (!localForageInstance) {
    return Promise.resolve();
  }
  return Promise.resolve() // wrap so finally is available
    .then(() => localForageInstance.getItem(key));
};

const setItem = (key: string, item: any): Promise<void> => {
  if (!localForageInstance) {
    return Promise.resolve();
  }
  return Promise.resolve() // wrap so finally is available
    .then(() => localForageInstance.setItem(key, item));
};

const init = (options: any): void => {
  const storageName: string = options.storageName;
  if (ServerRenderingUtils.windowUndefined()) {
    return;
  }
  localForageInstance = LocalForage.createInstance({
    name: storageName,
  });
};

const localStorage = {
  getItem,
  setItem,
  init,
};

export { localStorage };
