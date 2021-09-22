// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'vend... Remove this comment to see the full error message
import createStore from 'vendor/cnpm/fluxible.v0-4/addons/createStore';

const S12nOwnershipsStore = createStore({
  storeName: 'S12nOwnershipsStore',

  handlers: {
    RECEIVED_S12N_OWNERSHIP: 'handleReceivedS12nOwnership',
  },

  initialize() {
    this.contents = {};
  },

  handleReceivedS12nOwnership({ s12nId, s12nOwnership }: $TSFixMe) {
    this.contents[s12nId] = s12nOwnership;
    this.emitChange();
  },

  getOwnership(s12nId: $TSFixMe) {
    return this.contents[s12nId];
  },

  getFirst() {
    return this.contents[Object.keys(this.contents)[0]];
  },
});

export default S12nOwnershipsStore;
