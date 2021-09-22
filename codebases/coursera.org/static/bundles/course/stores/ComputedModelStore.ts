import _ from 'lodash';
import BaseStore from 'vendor/cnpm/fluxible.v0-4/addons/BaseStore';

const SERIALIZED_PROPS: (keyof ComputedModelStore$DehydratedState)[] = ['loaded'];

type ComputedModelStore$DehydratedState = {
  loaded: boolean;
};

class ComputedModelStore extends BaseStore implements ComputedModelStore$DehydratedState {
  static storeName = 'ComputedModelStore';

  static handlers = {
    LOAD_COMPUTED_MODELS: 'onLoadedComputedModels',
  };

  onLoadedComputedModels() {
    this.loaded = true;
    this.emitChange();
  }

  loaded = false;

  emitChange!: () => void;

  dehydrate(): ComputedModelStore$DehydratedState {
    return _.pick(this, ...SERIALIZED_PROPS);
  }

  rehydrate(state: ComputedModelStore$DehydratedState) {
    Object.assign(this, _.pick(state, ...SERIALIZED_PROPS));
  }

  hasLoaded() {
    return this.loaded;
  }
}

export default ComputedModelStore;
