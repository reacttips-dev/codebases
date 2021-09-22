import BasicParentClassModel from 'core/src/models/basic-parent-class';

const BasicParentClassesCollection = Backbone.Collection.extend({
  model: BasicParentClassModel,
});

export default BasicParentClassesCollection;

