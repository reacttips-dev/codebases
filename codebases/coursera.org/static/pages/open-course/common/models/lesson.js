/* Lesson contains data about a course lesson and its contents.
 *
 * Lesson's attributes are exactly the attributes returned by the course data
 * API, plus an attribute called `module` that refers to the parent module that
 * contains this lesson.
 */

import Backbone from 'backbone-associations';

import moment from 'moment';
import React from 'react';
import _ from 'underscore';
import { FormattedMessage } from 'js/lib/coursera.react-intl';
import path from 'js/lib/path';
import _t from 'i18n!nls/ondemand';
import ItemMetadata from 'pages/open-course/common/models/itemMetadata';
import ItemGroup from 'pages/open-course/common/models/itemGroup';

const Lesson = Backbone.AssociatedModel.extend({
  initialize(options) {
    if (!this.getItemGroups()) {
      this.set('itemGroups', new Backbone.Collection());
    }

    if (this.getDirectlyContainedItemMetadatas().length > 0 && this.getItemGroups().length > 0) {
      throw new Error('We do not support lessons containing items and item groups.');
    }

    if (this.getItemGroups().length > 1) {
      throw new Error('We do not support lessons containing more than one item group.');
    }

    this.getDirectlyContainedItemMetadatas().invoke('set', {
      lesson: this,
    });
    this.getItemGroups().invoke('set', {
      lesson: this,
    });

    // Using change handlers to update references to course and courseMaterials
    // so that these can be passed in after initialization
    _(['course', 'courseMaterials', 'module']).each((field) => {
      this.on('change:' + field, this.passReference(field), this);
    });
  },

  passReference(field) {
    return () => {
      this.getDirectlyContainedItemMetadatas().invoke('set', field, this.get(field));
      this.getItemGroups().invoke('set', field, this.get(field));
    };
  },

  relations: [
    // The items in this lesson are called `elements` for backwards compatibility with code that calls them `elements`,
    // even though a name like `items` would distinguish them more from the item groups in the lesson.
    {
      type: Backbone.Associations.Many,
      key: 'elements',
      relatedModel: ItemMetadata,
    },
    {
      type: Backbone.Associations.Many,
      key: 'itemGroups',
      relatedModel: ItemGroup,
    },
  ],

  getDirectlyContainedItemMetadatas() {
    return this.get('elements');
  },

  getLink(id) {
    return path.join(this.get('course').getLink(), 'lesson', this.get('id'));
  },

  getItemGroups() {
    return this.get('itemGroups');
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
    if (this.getDirectlyContainedItemMetadatas().length > 0) {
      return this.getDirectlyContainedItemMetadatas();
    } else if (this.getItemGroups().length > 0) {
      return this.getItemGroups().at(0).getItemMetadatas();
    } else {
      return new Backbone.Collection();
    }
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
  getAssessmentItemMetadatas() {
    return new Backbone.Collection(
      this.getItemMetadatas().filter(function (itemMetadata) {
        return itemMetadata.isAssessment();
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

  getModule() {
    return this.get('module');
  },

  getName() {
    return this.get('name');
  },

  getTimeCommitment() {
    return moment.duration(this.get('timeCommitment'));
  },

  getTrackId() {
    return this.get('trackId');
  },

  isItemGroupLesson() {
    return this.getItemGroups().length > 0;
  },

  getId() {
    return this.get('id');
  },
});

export default Lesson;
