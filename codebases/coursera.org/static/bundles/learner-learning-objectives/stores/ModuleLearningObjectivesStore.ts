import _ from 'underscore';
import { SET_OBJECTIVES } from 'bundles/learner-learning-objectives/constants/ModuleLearningObjectivesActionNames';
import BaseStore from 'vendor/cnpm/fluxible.v0-4/addons/BaseStore';
import StoredLearningObjective from 'bundles/learner-learning-objectives/models/StoredLearningObjective';

const SERIALIZED_PROPS = ['isSavingObjective', 'isDeletingObjective', 'categories', 'branches'];

class ModuleLearningObjectivesStore extends BaseStore {
  static storeName = 'ModuleLearningObjectivesStore';

  isSavingObjective = false;

  isDeletingObjective = false;

  branches = {};

  static handlers = {
    // @ts-ignore ts-migrate(7031) FIXME: Binding element 'branchId' implicitly has an 'any'... Remove this comment to see the full error message
    [SET_OBJECTIVES]({ branchId, moduleId, objectives: newObjectives }) {
      // @ts-expect-error TODO: Fix
      const objectives = this.getModuleObjectivesInBranch(branchId, moduleId, true);
      objectives.splice(0, objectives.length);
      newObjectives.forEach((newObjective: $TSFixMe) => objectives.push(newObjective));
      // @ts-expect-error TODO: Fix
      this.emitChange();
    },
  };

  constructor(dispatcher: $TSFixMe) {
    super(dispatcher);

    this.isSavingObjective = false;
    this.isDeletingObjective = false;

    // Map<branchId, Map<moduleId, Array<StoredLearningObjective>>
    this.branches = {};
  }

  dehydrate() {
    // @ts-expect-error TODO: Fix
    return _(this).pick(...SERIALIZED_PROPS);
  }

  rehydrate(state: $TSFixMe) {
    Object.assign(this, _(state).pick(...SERIALIZED_PROPS));

    this.branches = _.pairs(state.branches).reduce(
      (branchAcc, [branchId, moduleToObjectives]) => ({
        ...branchAcc,
        [branchId]: {
          ..._.pairs(moduleToObjectives).reduce(
            (moduleAcc, [moduleId, objectives]) => ({
              ...moduleAcc,
              [moduleId]: objectives.map((objective: $TSFixMe) => new StoredLearningObjective(objective)),
            }),
            {}
          ),
        },
      }),
      {}
    );
  }

  getObjectivesInBranch(branchId: string) {
    // @ts-ignore ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    this.branches[branchId] = this.branches[branchId] || {};
    // @ts-ignore ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    return this.branches[branchId];
  }

  getModuleObjectivesInBranch(branchId: string, moduleId: string, createList?: boolean) {
    const branch = this.getObjectivesInBranch(branchId);
    branch[moduleId] = branch[moduleId] || (createList ? [] : undefined);
    return branch[moduleId];
  }
}

export default ModuleLearningObjectivesStore;
