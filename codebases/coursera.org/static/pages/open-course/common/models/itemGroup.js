import Backbone from 'backbone-associations';
import _ from 'underscore';
import path from 'js/lib/path';
import ItemGroupChoice from 'pages/open-course/common/models/itemGroupChoice';
import { CORE_TRACK } from 'pages/open-course/common/models/tracks';

/*
 * ItemGroup contains choices among several gradable items that a user must complete.
 */
const ItemGroup = Backbone.AssociatedModel.extend({
  relations: [
    {
      type: Backbone.Associations.Many,
      key: 'choices',
      relatedModel: ItemGroupChoice,
    },
  ],

  initialize(options) {
    this.getChoices().invoke('set', {
      lesson: this.getLesson(),
      itemGroup: this,
    });

    // Using change handlers to update references to course and courseMaterials
    // so that these can be passed in after initialization
    _(['course', 'courseMaterials', 'module', 'lesson']).each((field) => {
      this.on('change:' + field, this.passReference(field), this);
    });
  },

  passReference(field) {
    return () => {
      this.getChoices().invoke('set', field, this.get(field));
    };
  },

  getLink() {
    return path.join(this.get('course').getLink(), this.getCourseRelativeLink());
  },

  getCourseRelativeLink() {
    return path.join('choices', this.getId());
  },

  getItemMetadatas() {
    const itemMetadatas = this.getChoices().chain().invoke('getItemMetadatas').invoke('toArray').flatten().value();
    return new Backbone.Collection(itemMetadatas);
  },

  getGradableItems() {
    return this.getItemMetadatas().filter((itemMetadata) => itemMetadata.isGradable());
  },

  getChoices() {
    return this.get('choices');
  },

  getChoicesCount() {
    return this.getChoices().length;
  },

  /**
   * This is only defined for item groups in the core track.
   */
  getGradingWeight() {
    return this.get('gradingWeight');
  },

  getName() {
    return this.getLesson().get('name');
  },

  getRequiredPassedCount() {
    return this.get('requiredPassedCount');
  },

  getLesson() {
    return this.get('lesson');
  },

  getModule() {
    return this.get('module');
  },

  /**
   * ItemGroups are always gradable.
   */
  isGradable() {
    return true;
  },

  getTrackId() {
    return this.get('trackId');
  },

  isCore() {
    return this.getTrackId() === CORE_TRACK;
  },

  getId() {
    return this.get('id');
  },
});

export default ItemGroup;
