// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'vend... Remove this comment to see the full error message
import createStore from 'vendor/cnpm/fluxible.v0-4/addons/createStore';

const S12nStore = createStore({
  storeName: 'S12nsStore',

  handlers: {
    RECEIVED_S12N: 'handleReceivedS12n',
    RECEIVED_S12N_FROM_DJANGO: 'handleReceivedDjangoS12n',
  },

  initialize() {
    this.byId = {};
    this.byShortName = {};

    // Only necessary if we need to deal with Spark specializations for local currencies
    this.djangoS12nById = {};
  },

  handleReceivedS12n(s12n: $TSFixMe) {
    this.byId[s12n.get('id')] = s12n;
    this.byShortName[s12n.get('shortName')] = s12n;

    this.emitChange();
  },

  handleReceivedDjangoS12n(s12n: $TSFixMe) {
    this.djangoS12nById[s12n.get('id')] = s12n;

    this.emitChange();
  },

  getById(s12nId: $TSFixMe) {
    return this.byId[s12nId];
  },

  // Should only be called with a spark s12n id
  getDjangoS12nById(s12nId: $TSFixMe) {
    return this.djangoS12nById[s12nId];
  },

  getByShortname(shortName: $TSFixMe) {
    return this.byShortName[shortName];
  },

  getFirst() {
    return this.byId[Object.keys(this.byId)[0]];
  },

  getFirstFromDjango() {
    return this.djangoS12nById[Object.keys(this.djangoS12nById)[0]];
  },
});

export default S12nStore;
