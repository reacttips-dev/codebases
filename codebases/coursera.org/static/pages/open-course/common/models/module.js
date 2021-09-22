/* Module contains information about a course module and its contents.
 *
 * Module's attributes are exactly the attributes returned by the course data
 * API. */

import Backbone from 'backbone-associations';

import moment from 'moment';
import _ from 'underscore';
import path from 'js/lib/path';
import Lesson from 'pages/open-course/common/models/lesson';
import { CORE_TRACK } from 'pages/open-course/common/models/tracks';

const Module = Backbone.AssociatedModel.extend({
  defaults: {
    optional: false,
  },

  relations: [
    {
      type: Backbone.Associations.Many,
      key: 'elements',
      relatedModel: Lesson,
    },
  ],

  initialize(options) {
    this.getLessons().invoke('set', 'module', this);
    // Using change handlers to update references to course and courseMaterials
    // so that these can be passed in after initialization
    _(['course', 'courseMaterials']).each((field) => {
      this.on('change:' + field, this.passReference(field), this);
    });
  },

  passReference(field) {
    return () => {
      this.getLessons().invoke('set', field, this.get(field));
    };
  },

  /**
   * @return {String}
   */
  getLink() {
    return path.join(this.get('course').getLink(), 'module', this.get('id'));
  },

  /**
   * @return {Backbone.Collection}
   */
  getLessons() {
    return this.get('elements');
  },

  getCoreLessons() {
    return this.get('elements').filter((lesson) => lesson.getTrackId() === CORE_TRACK);
  },

  getLessonsForTrackId(trackId) {
    return this.get('elements').filter((lesson) => lesson.getTrackId() === trackId);
  },

  hasContentForTrackId(trackId) {
    return this.getLessonsForTrackId(trackId).length !== 0;
  },

  /**
   * @return {Backbone.Model}
   */
  getLesson(id) {
    return this.getLessons().get(id);
  },

  /**
   * @return {Int}
   */
  getTotalItemCount() {
    return this.getLessons().reduce(function (sum, lesson) {
      return sum + lesson.getItemMetadatas().length;
    }, 0);
  },

  /**
   * @return {Backbone.Model}
   */
  getItemMetadata(id) {
    return this.getItemMetadatas().get(id);
  },

  /**
   * @return {Backbone.Collection}
   */
  getItemMetadatas() {
    if (!this.allItemMetadatas) {
      const items = this.getLessons().chain().invoke('getItemMetadatas').invoke('toArray').flatten().value();
      this.allItemMetadatas = new Backbone.Collection(items);
    }
    return this.allItemMetadatas;
  },

  isGradable() {
    return !!this.getGradables().length;
  },

  getGradables() {
    return this.getItemMetadatas().filter((itemMetadata) => itemMetadata.isGradable());
  },

  getCoreGradables() {
    return this.getItemMetadatas().filter((itemMetadata) => itemMetadata.isGradable() && itemMetadata.isCore());
  },

  getGradablesForTrackId(trackId) {
    return this.getItemMetadatas().filter(
      (itemMetadata) => itemMetadata.isGradable() && itemMetadata.getTrackId() === trackId
    );
  },

  /**
   * @return {Int}
   */
  getTotalLectureItemCount() {
    return this.getLectureItemMetadatas().length;
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

  /**
   * @return {Backbone.Collection}
   */
  getGradableItemMetadatas() {
    return new Backbone.Collection(
      this.getItemMetadatas().filter(function (itemMetadata) {
        return itemMetadata.isGradable();
      })
    );
  },

  getGradableItemMetadatasWithoutHonors() {
    return new Backbone.Collection(
      this.getItemMetadatas().filter(function (itemMetadata) {
        return itemMetadata.isGradable() && itemMetadata.get('trackId') !== 'honors';
      })
    );
  },

  getTimeCommitment() {
    return moment.duration(this.get('timeCommitment'));
  },

  getId() {
    return this.get('id');
  },
});

export default Module;
