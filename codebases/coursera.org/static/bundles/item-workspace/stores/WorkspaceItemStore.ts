import _ from 'underscore';

import BaseStore from 'vendor/cnpm/fluxible.v0-4/addons/BaseStore';

import type { WorkspaceV1Launcher } from 'bundles/item-workspace/types/WorkspaceItem';

const SERIALIZED_PROPS: Array<keyof SerializedState> = ['workspace'];

type SerializedState = {
  workspace?: WorkspaceV1Launcher;
};

class WorkspaceItemStore extends BaseStore {
  workspace?: WorkspaceV1Launcher = undefined;

  emitChange!: () => void;

  static storeName = 'WorkspaceItemStore';

  static handlers = {
    WORKSPACE_ITEM_RECEIVE_WORKSPACE: 'setWorkspace',
  };

  hasLoaded() {
    return !!this.workspace;
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

  getWorkspace(): WorkspaceV1Launcher | undefined {
    return this.workspace;
  }

  setWorkspace({ workspace }: { workspace: WorkspaceV1Launcher }): void {
    this.workspace = workspace;
    this.emitChange();
  }
}

export default WorkspaceItemStore;
