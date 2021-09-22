import _ from 'underscore';

import BaseStore from 'vendor/cnpm/fluxible.v0-4/addons/BaseStore';
import type { WorkspaceV2Launcher } from 'bundles/item-workspace/types/WorkspaceItem';
import * as UngradedLabItemActionNames from 'bundles/item-ungraded-lab/actions/UngradedLabItemActionNames';

const SERIALIZED_PROPS: Array<keyof SerializedState> = ['launcher'];

type SerializedState = {
  launcher?: WorkspaceV2Launcher;
};

class UngradedLabItemStore extends BaseStore {
  launcher?: WorkspaceV2Launcher = undefined;

  emitChange!: () => void;

  static storeName = 'UngradedLabItemStore';

  static handlers = {
    [UngradedLabItemActionNames.LoadUngradedLab]: 'setUngradedLab',
    [UngradedLabItemActionNames.ClearUngradedLab]: 'clearUngradedLab',
  };

  hasLoaded() {
    return !!this.launcher;
  }

  getState(): SerializedState {
    return _(this).pick(...SERIALIZED_PROPS);
  }

  dehydrate(): SerializedState {
    return this.getState();
  }

  rehydrate(state: SerializedState) {
    const stateObserved = _(state).pick(...SERIALIZED_PROPS);
    Object.assign(this, stateObserved);
  }

  getLauncher(): WorkspaceV2Launcher | undefined {
    return this.launcher;
  }

  setUngradedLab({ launcher }: { launcher: WorkspaceV2Launcher }): void {
    this.launcher = launcher;
    this.emitChange();
  }

  clearUngradedLab(): void {
    this.launcher = undefined;
    this.emitChange();
  }
}

export default UngradedLabItemStore;
