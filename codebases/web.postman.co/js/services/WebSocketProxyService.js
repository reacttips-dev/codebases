import CurrentUserController from '../modules/controllers/CurrentUserController';

const MATRIX = {
  name: 'Matrix',
  url: 'https://matrix.postman-beta.co:4000'
};
const BIFROST = {
  name: 'Bifrost'
};

const WebSocketProxyService = {
  async getProxies () {
    const user = await CurrentUserController.get();

    if (!BIFROST.url && window.WEBSOCKET_URL !== MATRIX.url) {
      BIFROST.url = window.WEBSOCKET_URL || user.syncserver_url || 'https://bifrost-https-v4.gw.postman-beta.co';
    }

    return [
      MATRIX,
      BIFROST
    ];
  },

  getCurrentProxy () {
    if (window.WEBSOCKET_URL === MATRIX.url) {
      return MATRIX;
    }

    return BIFROST;
  },

  isValidWebSocketProxy (serverConfig) {
    return [MATRIX, BIFROST]
      .map((config) => config.url)
      .includes(serverConfig && serverConfig.url);
  },

  switchWebSocketProxy (serverConfig) {
    if (!serverConfig.url) {
      serverConfig = BIFROST;
    }

    window.WEBSOCKET_URL = serverConfig.url;
    window.pm.syncManager.destroySocket();
    window.pm.syncManager.createSocket({ forceConnect: true });

    pm.windowEvents.emit('dev-settings-websocket-proxy-update', {});
  }
};

export default WebSocketProxyService;
