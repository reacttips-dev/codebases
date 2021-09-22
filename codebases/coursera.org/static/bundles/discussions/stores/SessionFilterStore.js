import moment from 'moment';
import _ from 'underscore';
import epic from 'bundles/epic/client';
import BaseStore from 'vendor/cnpm/fluxible.v0-4/addons/BaseStore';

import _t from 'i18n!nls/discussions';

const SERIALIZED_PROPS = [
  'selectedSession',
  'onDemandSelected',
  'showAll',
  'allSessions',
  'courseBranches',
  'sessionsLoaded',
  'currentBranchId',
  'onDemandBranchId',
  'currentSessionId',
  'initialBranchId',
  'isPersistentForumsEnabled',
];

class SessionFilterStore extends BaseStore {
  static storeName = 'SessionFilterStore';

  loadSessionsHelper({ sessions, courseBranches, courseId, currentSessionId }) {
    this.courseBranches = courseBranches;

    if (!this.courseBranches || this.courseBranches.length === 0) {
      this.courseBranches = [
        {
          id: courseId,
          authoringName: _t('Original Version'),
        },
      ];
    }

    // if the session does not have a branchId, it is the courseId (default branch)
    this.allSessions = sessions
      ? sessions.map((session) => {
          if (session.branchId) {
            return session;
          }
          return Object.assign(session, { branchId: courseId });
        })
      : [];

    this.onDemandBranchId = courseId;

    const currentSession = this.allSessions.find((session) => session.id === currentSessionId);
    this.currentSessionId = currentSessionId;
    this.currentBranchId = currentSession ? currentSession.branchId : courseId;
    this.initialBranchId = this.currentBranchId;

    this.isPersistentForumsEnabled = epic.get('DiscussionsPersistentForums', 'DiscussionsPersistentForumsEnabled');

    this.sessionsLoaded = true;
  }

  static handlers = {
    LOAD_SESSIONS_DATA(payload) {
      this.loadSessionsHelper(payload);

      // start in all sessions
      this.showAll = true;

      this.emitChange();
    },

    LOAD_SESSIONS_DATA_UNPRIVILEGED(payload) {
      this.loadSessionsHelper(payload);

      if (this.isPersistentForumsEnabled && !payload.isPrivateSession) {
        this.showAll = true;
      } else if (this.currentSessionId) {
        this.selectedSession = this.currentSessionId;
      } else {
        this.onDemandSelected = true;
      }

      this.emitChange();
    },

    SELECT_SESSION({ sessionId }) {
      this.selectedSession = sessionId;
      this.onDemandSelected = false;

      const session = this.allSessions.find((potentialSesssion) => potentialSesssion.id === sessionId);
      this.currentBranchId = session && session.branchId;
      this.showAll = false;

      this.emitChange();
    },

    SELECT_ON_DEMAND() {
      this.selectedSession = null;
      this.onDemandSelected = true;
      this.currentBranchId = this.onDemandBranchId;
      this.showAll = false;

      this.emitChange();
    },

    SELECT_SHOW_ALL({ branchId }) {
      this.selectedSession = null;
      this.onDemandSelected = false;
      this.showAll = true;

      if (branchId) {
        this.currentBranchId = branchId;
      }

      this.emitChange();
    },
  };

  constructor(dispatcher) {
    super(dispatcher);

    this.selectedSession = null;
    this.onDemandSelected = false;
    this.showAll = false;

    // Store all sessions here as well. Usually we dont expose
    // all sessions to users so we should store the options here.
    this.allSessions = [];
    this.courseBranches = [];
    this.sessionsLoaded = false;
    this.currentBranchId = null;
  }

  dehydrate() {
    return _(this).pick(...SERIALIZED_PROPS);
  }

  rehydrate(state) {
    Object.assign(this, _(state).pick(...SERIALIZED_PROPS));
  }

  get activeFilter() {
    if (this.selectedSession) {
      return this.allSessions
        .map((session) => ({
          id: session.id,
          branchId: session.branchId,
          startedAt: session.startedAt,
          endedAt: session.endedAt,
        }))
        .find((session) => session.id === this.selectedSession);
    } else if (this.onDemandSelected) {
      return {
        id: 'ondemand',
        branchId: this.onDemandBranchId,
        startedAt: null,
        endedAt: null,
      };
    } else if (this.showAll) {
      return {
        id: 'all',
        branchId: this.currentBranchId,
        startedAt: null,
        endedAt: null,
      };
    } else {
      return null;
    }
  }

  get activeFilterQueryString() {
    if (this.selectedSession) {
      return `session~${this.selectedSession}`;
    } else if (this.onDemandSelected) {
      return 'ondemand';
    } else if (this.showAll) {
      return 'all';
    } else {
      return null;
    }
  }

  get filters() {
    // Add ondemand for courses with ondemand sessions
    const filters = _(this.allSessions)
      .chain()
      .sortBy((session) => session.startedAt * -1)
      .value()
      .map((session) => {
        return {
          id: session.id,
          branchId: session.branchId,
          startedAt: session.startedAt,
          endedAt: session.endedAt,
        };
      })
      .concat([
        {
          id: 'ondemand',
          branchId: this.onDemandBranchId,
          startedAt: null,
          endedAt: null,
        },
      ]);

    return filters;
  }

  get filtersLoaded() {
    return this.sessionsLoaded;
  }

  getFiltersForBranch(branchId) {
    // always show the 'all' label, but update it with the branchId that we want.
    return this.filters
      .filter((session) => session.branchId === branchId)
      .concat([
        {
          id: 'all',
          startedAt: null,
          endedAt: null,
          branchId,
        },
      ]);
  }

  get branches() {
    const filters = this.filters;
    return this.courseBranches.map((branch) => {
      return {
        id: branch.id,
        label: branch.authoringName,
        filters: filters
          .filter((filter) => filter.branchId === branch.id)
          .concat({
            id: 'all',
            startedAt: null,
            endedAt: null,
            branchId: branch.id,
          }),
      };
    });
  }

  get overrideBranchId() {
    // if we are in the users default branch, we don't need the branch filter.
    if (this.initialBranchId === this.currentBranchId) {
      return null;
    }

    return this.currentBranchId;
  }

  get containsMultipleBranches() {
    return this.courseBranches && this.courseBranches.length > 1;
  }

  getIsPersistentForumsEnabled() {
    return this.isPersistentForumsEnabled;
  }

  getSelectedSessionId() {
    return this.selectedSession;
  }
}

export default SessionFilterStore;
