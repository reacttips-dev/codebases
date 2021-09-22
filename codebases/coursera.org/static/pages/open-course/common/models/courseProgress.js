/* Singleton CourseProgress contains all progress information for a given course
 *
 * CourseProgress's attributes are exactly the attributes returned by the
 * course progress API. */

import Backbone from 'backbone-associations';

import _ from 'underscore';
import constants from 'pages/open-course/common/constants';
import { memoizedCourseProgressPromise } from 'pages/open-course/common/data/courseProgress';
import Progress from 'pages/open-course/common/models/progress';
import multitracker from 'js/app/multitrackerSingleton';

const CourseProgress = Backbone.AssociatedModel.extend({
  resourceName: 'onDemandCoursesProgress.v1',

  defaults: {
    items: {},
    lessons: {},
  },

  initialize() {
    this.progressMapping = {};
    this.completedLessons = this.calculateCompletedLessons();
    this.completedModules = this.calculateCompletedModules();
    this.on('refresh', this.refresh, this);
  },

  hasStarted() {
    return this.get('overall') > 0;
  },

  checkLessonCompletion() {
    const updateCompletedLessons = this.calculateCompletedLessons();
    const newCompletedLessons = _.difference(updateCompletedLessons, this.completedLessons);

    if (newCompletedLessons.length !== 0) {
      this.completedLessons = updateCompletedLessons;
      multitracker.pushV2([
        'open_course.lesson.complete',
        {
          lesson_id: newCompletedLessons[0],
          open_course_slug: constants.courseSlug,
        },
      ]);
    }
  },

  checkModuleCompletion() {
    const updateCompletedModules = this.calculateCompletedModules();
    const newCompletedModules = _.difference(updateCompletedModules, this.completedModules);

    if (newCompletedModules.length !== 0) {
      this.completedModules = updateCompletedModules;
      multitracker.pushV2([
        'open_course.module.complete',
        {
          module_id: newCompletedModules[0],
          open_course_slug: constants.courseSlug,
        },
      ]);
    }
  },

  _calculateCompleted(itemType) {
    return _(this.get(itemType))
      .chain()
      .pairs()
      .filter(function (item) {
        return item[1] === 100;
      })
      .map(function (item) {
        return item[0];
      })
      .value();
  },

  calculateCompletedLessons() {
    return this._calculateCompleted('lessons');
  },

  calculateCompletedModules() {
    return this._calculateCompleted('modules');
  },

  refresh() {
    const promise = memoizedCourseProgressPromise.force(constants.courseSlug).then(
      function (newCourseProgress) {
        this.set(newCourseProgress);
        this.updateItemProgresses();
        this.checkLessonCompletion();
        this.checkModuleCompletion();
        this.trigger('refreshed');
        return this;
      }.bind(this)
    );
    promise.done();
    return promise;
  },

  getNextUpItem() {
    return this.get('nextItem');
  },

  hasItem(id) {
    return _(this.get('items')).has(id);
  },

  getItem(id) {
    return this.get('items')[id];
  },

  /**
   * Get the attributes for `itemId`'s progress. Returns a new copy of the
   * attributes every time you call it, and the returned attributes do not
   * change when the item's progress changes.
   */
  getItemProgressAttributes(itemId) {
    const progressAttributes = {
      id: itemId,
      timestamp: Date.now(),
      progressState: constants.progressNotStarted,
    };
    if (this.hasItem(itemId)) {
      _(progressAttributes).extend(this.getItem(itemId));
    }
    return progressAttributes;
  },

  /**
   * Get an `ItemProgress` model for `itemId`. You are guaranteed to get the
   * same model every time you call this, and that model is guaranteed to
   * change whenever the item's progress changes.
   */
  getItemProgress(itemId) {
    if (!this.progressMapping[itemId]) {
      const progressAttributes = this.getItemProgressAttributes(itemId);
      const progress = new Progress(progressAttributes);
      this.listenTo(
        progress,
        'change:progressState',
        function (progressModel, newState, options) {
          if (options.refreshCourseProgress) {
            this.trigger('refresh');
          }
        }.bind(this)
      );
      this.progressMapping[itemId] = progress;
    }

    return this.progressMapping[itemId];
  },

  getGradedAssignmentGroupProgress(groupId) {
    const gradedAssignmentGroupProgresses = this.get('gradedAssignmentGroupProgress');
    return gradedAssignmentGroupProgresses[groupId] && gradedAssignmentGroupProgresses[groupId].state;
  },

  /**
   * Call this if `this.get('items')` has changed and you want all the
   * `ItemProgress`es returned by `getItemProgress` to change to correspond.
   */
  updateItemProgresses() {
    _(this.progressMapping).each(
      function (itemProgress, itemId) {
        const attrs = this.getItemProgressAttributes(itemId);
        itemProgress.setState(attrs.progressState, {
          refreshCourseProgress: false,
        });

        // Update all of the content of a progress item.
        if (this.hasItem(itemId)) {
          itemProgress.set(this.getItem(itemId));
        }
      }.bind(this)
    );
  },

  hasModule(id) {
    return _(this.get('modules')).has(id);
  },

  getModuleCompletionPercent(id) {
    return this.get('modules')[id];
  },

  getModuleProgress(id) {
    let completionPercent = 0;
    if (this.hasModule(id)) {
      completionPercent = this.getModuleCompletionPercent(id);
    }
    return new Progress({
      id,
      timestamp: Date.now(),
      completionPercent,
    });
  },

  getOverallProgressPercent() {
    const numModules = _(this.get('modules')).keys().length;
    if (numModules) {
      return (
        _(this.get('modules')).reduce(function (sum, percent, id) {
          return sum + percent;
        }, 0) / numModules
      );
    } else {
      return 0;
    }
  },

  getProgressForLesson(lessonId) {
    const completionPercent = this.get('lessons')[lessonId];
    let progressState;

    if (completionPercent === 100) {
      progressState = 'Completed';
    } else if (completionPercent > 0) {
      progressState = 'Started';
    } else {
      progressState = 'NotStarted';
    }

    return {
      completionPercent,
      progressState,
    };
  },

  getItemProgressesForLesson(lesson) {
    const progresses = lesson.getItemMetadatas().map((item) => {
      const progress = this.getItemProgress(item.get('id'));
      return {
        item,
        progress,
      };
    });

    return progresses;
  },
});

/** mock of the progress object for no progress */
const nullOverrides = {
  // if there is no courseProgress, nothing is started.
  hasNotStarted() {
    return true;
  },
  // no item id will match
  getNextUpItem() {
    return false;
  },
  getItemProgress(id) {
    return new Progress({
      id,
      timestamp: Date.now(),
      progressState: constants.progressNotStarted,
    });
  },
  getModuleProgress(id) {
    return new Progress({
      id,
      timestamp: Date.now(),
      completionPercent: 0,
    });
  },
};

CourseProgress.nullProgressSingleton = Object.freeze(_({}).extend(new CourseProgress(), nullOverrides));

export default CourseProgress;
