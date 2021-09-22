import BaseStore from 'vendor/cnpm/fluxible.v0-4/addons/BaseStore';

/**
 * Store for managing branch, session, group data for view as learner.
 *
 * @type {FluxibleStore}
 */
class ChangeViewSettingsModalStore extends BaseStore {
  static storeName = 'ChangeViewSettingsModalStore';

  initialize() {
    this.branchesSessionsGroups = [];
    this.groups = [];
    this.sessions = [];
    this.selectedBranchId = null;
    this.selectedGroupId = null;
    this.selectedSessionId = null;
    this.selectedContextId = null;
    this.loaded = false;
    this.emptyGroup = { id: null, isEmptyGroup: true, name: 'No group selected', isArchived: false };
  }

  getGroups() {
    return this.groups;
  }

  getSessions() {
    return this.sessions;
  }

  getBranches() {
    return this.branchesSessionsGroups;
  }

  getSelectedSessionId() {
    return this.selectedSessionId;
  }

  getSelectedBranchId() {
    return this.selectedBranchId;
  }

  getSelectedGroupId() {
    return this.selectedGroupId;
  }

  getSelectedContextId() {
    return this.selectedContextId;
  }

  hasLoaded() {
    return this.loaded;
  }

  refreshGroups() {
    if (this.selectedSessionId) {
      const selectedSession = this.sessions.find((session) => session.id === this.selectedSessionId);

      if (selectedSession) {
        this.groups = selectedSession.groups.filter((group) => group.isArchived === false);
      } else {
        this.groups = [];
      }
    } else {
      this.groups = [];
    }

    this.selectedGroupId = null;
  }

  static handlers = {
    RECEIVE_BRANCHES_SESSIONS_GROUPS_FOR_COURSE({ branchesSessionsGroups, excludeEmptyGroup = false }) {
      this.branchesSessionsGroups = branchesSessionsGroups;
      this.branchesSessionsGroups.forEach((branch) => {
        branch.associatedSessionsList.forEach((session) => {
          if (!excludeEmptyGroup && session.groups.length > 0) {
            session.groups.unshift(this.emptyGroup);
          }
        });
        return branch;
      });
      this.loaded = true;
      this.emitChange();
    },
    RECEIVE_BRANCH_SELECTION(selectedBranchId) {
      this.selectedBranchId = selectedBranchId;

      this.sessions = this.branchesSessionsGroups.find(
        (branch) => branch.id === selectedBranchId
      ).associatedSessionsList;
      this.selectedSessionId = this.sessions.length > 0 ? this.sessions[0].id : null;

      this.refreshGroups();

      this.emitChange();
    },
    RECEIVE_SESSION_SELECTION(selectedSessionId) {
      if (selectedSessionId) {
        this.selectedSessionId = selectedSessionId;
      } else {
        this.selectedSessionId = this.sessions.length > 0 ? this.sessions[0].id : null;
      }

      this.refreshGroups();

      this.emitChange();
    },
    RECEIVE_GROUP_SELECTION(selectedGroupId) {
      this.selectedGroupId = selectedGroupId;
      this.emitChange();
    },
    RECEIVE_CONTEXT_SELECTION(selectedContextId) {
      this.selectedContextId = selectedContextId;
      this.emitChange();
    },
  };
}

export default ChangeViewSettingsModalStore;
