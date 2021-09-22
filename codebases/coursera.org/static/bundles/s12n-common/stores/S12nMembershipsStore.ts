// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'vend... Remove this comment to see the full error message
import createStore from 'vendor/cnpm/fluxible.v0-4/addons/createStore';

const S12nMembershipsStore = createStore({
  storeName: 'S12nMembershipsStore',

  handlers: {
    RECEIVED_S12N_MEMBERSHIP: 'handleReceivedS12nMembership',
  },

  initialize() {
    this.contents = {};
  },

  handleReceivedS12nMembership({ s12nId, s12nMembership }: $TSFixMe) {
    this.contents[s12nId] = s12nMembership;
    this.emitChange();
  },

  getMembership(s12nId: $TSFixMe) {
    return this.contents[s12nId];
  },

  getFirst() {
    return this.contents[Object.keys(this.contents)[0]];
  },
});

export default S12nMembershipsStore;
