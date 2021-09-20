import { SEND_TO_MAIN } from '../shell/shellActions';
const ipcRenderer = pm.sdk && pm.sdk.IPC;

class ShellHelper {
  sendToMain (eventName, data) {
    ipcRenderer.sendToHost('Postman_Internal_Shell', { type: SEND_TO_MAIN, name: eventName }, data);
  }
  sendToShell (typeName, data) {
    ipcRenderer.sendToHost('Postman_Internal_Shell', { type: typeName }, data);
  }
}
export default new ShellHelper();
