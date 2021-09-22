/* eslint-disable complexity */
/**
 * Store managing state for Course Authoring.
 */
import $ from 'jquery';

import _ from 'underscore';
import AuthoringState from 'bundles/author-common/constants/AuthoringState';
import CourseDispatcher from 'bundles/author-course/CourseDispatcher';
import CourseConstants from 'bundles/author-course/constants/CourseConstants';
import EventEmitter from 'js/vendor/EventEmitter';

const CHANGE_EVENT = 'change';
const PUBLISHED_TO_IDLE_TIME = 1000;

const { Actions } = CourseConstants;

let _courseId;
let _course = {};
let _courseMetaData = {};
let _saveState = AuthoringState.Idle;

const CourseStore = _.extend({}, EventEmitter.prototype, {
  getCourseId() {
    return _courseId;
  },

  getCourse() {
    return _course;
  },

  getCourseMetaData() {
    return _courseMetaData;
  },

  getAuthoringState() {
    return _saveState;
  },

  deleteSessionSchedule() {
    _course = _(_course).omit('sessionSchedule');
  },

  updateSessionSchedule(sessionSchedule) {
    _course.sessionSchedule = sessionSchedule;
  },

  emitChange() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },
});

// Copy the `id` attributed from serverEntity data, if it is undefined
// TODO: Eliminate merging data here by generating the ID on the frontend.
const _mergeData = function (clientEntity, serverEntity) {
  if (!clientEntity || !serverEntity) {
    return clientEntity;
  }

  // Don't merge un-related nodes.
  if (clientEntity && clientEntity.id && clientEntity.id !== serverEntity.id) {
    return clientEntity;
  }

  if (!clientEntity.id && serverEntity) {
    clientEntity.id = serverEntity.id;
  }

  for (const clientProperty in clientEntity) {
    // If it is an object or array, call recursively
    if (_(clientEntity[clientProperty]).isObject() || _(clientEntity[clientProperty]).isArray()) {
      clientEntity[clientProperty] = _mergeData(_.clone(clientEntity[clientProperty]), serverEntity[clientProperty]);
    }
  }

  return clientEntity;
};

CourseStore.dispatchToken = CourseDispatcher.register((payload) => {
  const { action } = payload;

  switch (action.type) {
    case Actions.DELETE_SESSION_SCHEDULE:
      _course = $.extend(true, {}, _course);
      CourseStore.deleteSessionSchedule();
      CourseStore.emitChange();
      break;

    case Actions.UPDATE_SESSION_SCHEDULE:
      _course = $.extend(true, {}, _course);
      CourseStore.updateSessionSchedule(action.sessionSchedule);
      CourseStore.emitChange();
      break;

    case Actions.RECEIVE_COURSE:
      _courseId = action.courseId;
      _course = Object.assign({}, action.course);
      _courseMetaData = action.metaData;

      CourseStore.emitChange();
      break;

    case Actions.SAVED_COURSE:
      _course = _mergeData(_course, action.course);
      _courseMetaData = action.metaData;
      _saveState = AuthoringState.Success;
      CourseStore.emitChange();
      break;

    case Actions.PUBLISHED_COURSE:
      _courseMetaData = action.metaData;
      _saveState = AuthoringState.Published;
      CourseStore.emitChange();

      setTimeout(() => {
        _saveState = AuthoringState.Idle;
        CourseStore.emitChange();
      }, PUBLISHED_TO_IDLE_TIME);

      break;

    case Actions.UPDATE_SAVE_STATE:
      _saveState = action.state;
      CourseStore.emitChange();
      break;

    // Error State
    case Actions.RECEIVE_SAVE_ERROR:
      _saveState = AuthoringState.Error;
      CourseStore.emitChange();
      break;

    case Actions.RECEIVE_CONFLICT_ERROR:
      _saveState = AuthoringState.Conflict;
      CourseStore.emitChange();
      break;
  }
});

export default CourseStore;
