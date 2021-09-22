import _ from 'lodash';
import BaseStore from 'vendor/cnpm/fluxible.v0-4/addons/BaseStore';

const SERIALIZED_PROPS = ['seoRules'];

class SeoRulesStore extends BaseStore {
  static storeName = 'SeoRulesStore';

  static handlers = {
    UPDATE_SEO_RULES(data) {
      this.seoRules = data;
      this.emitChange();
    },
  };

  constructor(dispatcher) {
    super(dispatcher);
    this.seoRules = null;
  }

  dehydrate() {
    return _.pick(this, ...SERIALIZED_PROPS);
  }

  rehydrate(state) {
    Object.assign(this, _.pick(state, ...SERIALIZED_PROPS));
  }

  hasLoaded() {
    return !!this.seoRules;
  }

  getData() {
    return this.seoRules;
  }
}

export default SeoRulesStore;
