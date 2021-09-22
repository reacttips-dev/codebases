import _ from 'lodash';
import BaseStore from 'vendor/cnpm/fluxible.v0-4/addons/BaseStore';

const SERIALIZED_PROPS = ['loaded', 'showingMobileMenu'];

class MenuStore extends BaseStore {
  static storeName = 'MenuStore';

  static handlers = {
    TOGGLE_MOBILE_MENU() {
      this.showingMobileMenu = !this.showingMobileMenu;
      this.emitChange();
    },
  };

  constructor(dispatcher) {
    super(dispatcher);
    this.showingMobileMenu = false;
  }

  dehydrate() {
    return _.pick(this, ...SERIALIZED_PROPS);
  }

  rehydrate(state) {
    Object.assign(this, _.pick(state, ...SERIALIZED_PROPS));
  }

  hasLoaded() {
    return true;
  }

  getShowingMobileMenu() {
    return this.showingMobileMenu;
  }
}

export default MenuStore;
