/* CourseMaterials is the root model that contains all the course materials.
 *
 * CourseMaterial's attributes are exactly the attributed returned by the
 * course data API. */

import Backbone from 'backbone-associations';

import _ from 'underscore';
import ItemMetadata from 'pages/open-course/common/models/itemMetadata';
import Lesson from 'pages/open-course/common/models/lesson';
import Module from 'pages/open-course/common/models/module';
import { CORE_TRACK, HONORS_TRACK } from 'pages/open-course/common/models/tracks';

const CourseMaterials = Backbone.AssociatedModel.extend({
  parse(courseMaterialsData, options) {
    return courseMaterialsData;
  },

  initialize(attributes, options) {
    if (!(options && options.course)) {
      throw new Error('Please pass in a reference to course to CourseMaterials during initialization');
    }

    this.getModules().each(function (module, index) {
      // Set reference to course and courseMaterials on each of the modules,
      // which in turn pass them down to lessons and items
      module.set({
        index: index + 1,
        course: options.course,
        courseMaterials: this,
      });
    }, this);

    this.getRequiredModules().each(function (module, index) {
      module.set({
        requiredIndex: index + 1,
      });
    });

    this.set('course', options.course);

    if (attributes) {
      this.set('gradePolicy', attributes.gradePolicy && attributes.gradePolicy[0]);
    }
  },

  relations: [
    {
      type: Backbone.Associations.Many,
      key: 'elements',
      relatedModel: Module,
    },
  ],

  findItemIndex(item, items) {
    let index = -1;
    if (item && items) {
      items.some((elem, i) => {
        if (elem.get('id') && item.get('id') && elem.get('id') === item.get('id')) {
          index = i;
          return true;
        }
        return false;
      });
    }
    return index;
  },

  getModules() {
    return this.get('elements') || new Backbone.Collection();
  },

  getRequiredModules() {
    return new Backbone.Collection(this.getModules().where({ optional: false }), {
      model: Module,
    });
  },

  getLesson(id) {
    const candidates = this.getModules().invoke('getLesson', id);
    return _(candidates).compact()[0];
  },

  getModuleCount() {
    return this.get('elements').length;
  },

  getItemGroup(itemGroupId) {
    return this.getModules()
      .chain()
      .invoke('getLessons')
      .invoke('toArray')
      .flatten()
      .invoke('getItemGroups')
      .invoke('toArray')
      .flatten()
      .findWhere({ id: itemGroupId })
      .value();
  },

  getItemMetadata(id) {
    return this.getItemMetadatas().findWhere({ id });
  },

  getItemMetadatas() {
    if (!this.allItemMetadatas) {
      const items = this.getModules().chain().invoke('getItemMetadatas').invoke('toArray').flatten().value();
      this.allItemMetadatas = new Backbone.Collection(items, {
        model: ItemMetadata,
      });
    }

    return this.allItemMetadatas;
  },

  /**
   * @return {Backbone.Collection}
   */
  getLectureItemMetadatas() {
    return new Backbone.Collection(
      this.getItemMetadatas().filter(function (itemMetadata) {
        return itemMetadata.isLecture();
      })
    );
  },

  getPeerReviewItemMetadatas() {
    return new Backbone.Collection(
      this.getItemMetadatas().filter(function (itemMetadata) {
        return itemMetadata.isPeerReview();
      })
    );
  },

  getProgrammingItemMetadatas() {
    return new Backbone.Collection(
      this.getItemMetadatas().filter(function (itemMetadata) {
        return itemMetadata.isProgrammingAssignment();
      })
    );
  },

  getModulesWithGradableItems() {
    return this.getModules().filter((module) => {
      return module.isGradable();
    });
  },

  getGradableItemMetadatas() {
    return this.getItemMetadatas().filter(function (itemMetadata) {
      return itemMetadata.isGradable();
    });
  },

  getTeamAssignmentMetadata() {
    return new Backbone.Collection(
      this.getItemMetadatas().filter(function (itemMetadata) {
        return itemMetadata.isTeamAssignment();
      })
    );
  },

  getItemMetadataAt(n) {
    return this.getItemMetadatas().at(n);
  },

  getNeighboringItemMetadata(itemMetadata) {
    const items = this.getItemMetadatas();
    const index = this.findItemIndex(itemMetadata, items);
    let previous;
    let next;
    if (index > 0) {
      previous = this.getItemMetadataAt(index - 1);
    }

    if (index >= 0 && index < items.length - 1) {
      next = this.getItemMetadataAt(index + 1);
    }

    return {
      previous,
      next,
    };
  },

  getNavigationItems() {
    if (!this.navigationItems) {
      this.navigationItems = [];
      this.getModules().forEach((module) => {
        module.getLessons().forEach((lesson) => {
          const itemGroups = lesson.getItemGroups();
          this.navigationItems = this.navigationItems
            .concat(itemGroups ? itemGroups.models : [])
            .concat(lesson.getItemMetadatas().models);
        });
      });
    }

    return this.navigationItems;
  },

  /**
   * This will return item metadatas or groups.
   */
  getNeighboringNavigationItems(item) {
    const items = this.getNavigationItems();
    const index = this.findItemIndex(item, items);

    return {
      previous: index > 0 ? items[index - 1] : undefined,
      next: index >= 0 && index < items.length - 1 ? items[index + 1] : undefined,
    };
  },

  getNeighbors(itemMetadata) {
    const { previous, next } = this.getNeighboringItemMetadata(itemMetadata);

    const previousItemChoice = previous && previous.getChoice();
    const previousIsItemGroup = previousItemChoice && previous === previousItemChoice.getLastItemMetadata();

    const nextItemChoice = next && next.getChoice();
    const nextIsItemGroup = nextItemChoice && next === nextItemChoice.getFirstItemMetadata();

    return {
      previousItemMetadata: previous,
      nextItemMetadata: next,
      previousItemMetadataOrItemGroup: previousIsItemGroup ? previousItemChoice.getItemGroup() : previous,
      nextItemMetadataOrItemGroup: nextIsItemGroup ? nextItemChoice.getItemGroup() : next,
    };
  },

  getLessons() {
    if (!this.allLessons) {
      const lessons = this.get('elements').chain().invoke('getLessons').invoke('toArray').flatten().value();
      this.allLessons = new Backbone.Collection(lessons, {
        model: Lesson,
      });
    }

    return this.allLessons;
  },

  getLessonAt(n) {
    return this.getLessons().at(n);
  },

  getNeighboringLessons(lesson) {
    const lessons = this.getLessons();
    const index = lessons.indexOf(lesson);
    let previous;
    let next;
    if (index > 0) {
      previous = this.getLessonAt(index - 1);
    }

    if (index < lessons.length - 1) {
      next = this.getLessonAt(index + 1);
    }

    return {
      previous,
      next,
    };
  },

  getModuleForItem(itemId) {
    return this.getItemMetadata(itemId).get('lesson').get('module');
  },

  getFirstLectureId() {
    const firstLectureItem = this.getItemMetadatas().find((item) => item.isLecture());
    return firstLectureItem.get('id');
  },

  getCorePassablesCount() {
    return this.get('tracks') && this.get('tracks')[CORE_TRACK] && this.get('tracks')[CORE_TRACK].passablesCount;
  },

  honorsTrackEnabled() {
    return !!(this.get('tracks') && this.get('tracks')[HONORS_TRACK]);
  },
});

export default CourseMaterials;
