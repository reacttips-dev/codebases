import Backbone from 'backbone-associations';
import _ from 'underscore';
import ItemMetadata from 'pages/open-course/common/models/itemMetadata';

/*
 * ItemGroupChoice contains itemMetadatas that constitute one choice in an item group.
 */
const ItemGroupChoice = Backbone.AssociatedModel.extend({
  relations: [
    {
      type: Backbone.Associations.Many,
      key: 'elements',
      relatedModel: ItemMetadata,
    },
  ],

  initialize(options) {
    this.getItemMetadatas().invoke('set', {
      lesson: this.getLesson(),
      itemGroup: this.getItemGroup(),
      choice: this,
    });
    // Using change handlers to update references to course and courseMaterials
    // so that these can be passed in after initialization
    _(['course', 'courseMaterials', 'module', 'lesson']).each((field) => {
      this.on('change:' + field, this.passReference(field), this);
    });
  },

  passReference(field) {
    return () => {
      this.getItemMetadatas().invoke('set', field, this.get(field));
    };
  },

  getItemMetadatas() {
    return this.get('elements');
  },

  getFirstItemMetadata() {
    return this.getItemMetadatas().first();
  },

  getLastItemMetadata() {
    return this.getItemMetadatas().last();
  },

  getLesson() {
    return this.get('lesson');
  },

  getItemGroup() {
    return this.get('itemGroup');
  },

  getName() {
    return this.get('name');
  },

  getDescription() {
    return this.get('description');
  },

  getId() {
    return this.get('id');
  },

  getIndexInGroup() {
    return this.getItemGroup().getChoices().indexOf(this);
  },
});

export default ItemGroupChoice;
