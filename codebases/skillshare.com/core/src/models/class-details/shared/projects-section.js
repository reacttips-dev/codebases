import CollectionModel from 'core/src/models/collection';
import ProjectsCollection from 'core/src/collections/projects';
import Utils from 'core/src/base/utils';

export default CollectionModel.extend({
  constructor: function(data, options = {}) {
    options.parse = true;

    return CollectionModel.call(this, data, options);
  },

  Collection: ProjectsCollection,

  _newCollection: function(models, options = {}) {
    const sort = (models && models.sortMethod) || this.get('sortMethod');

    options.path = Utils.getPathname();
    options.parse = true;

    options.params = {
      sort: sort,
      collectionOnly: true,
    };

    return CollectionModel.prototype._newCollection.call(this, models, options);
  },
});

