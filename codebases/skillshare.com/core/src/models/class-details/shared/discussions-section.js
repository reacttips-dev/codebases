import CollectionModel from 'core/src/models/collection';
import CommunityDiscussionsCollection from 'core/src/collections/community-discussions';
import Utils from 'core/src/base/utils';

export default CollectionModel.extend({
  constructor: function(data, options = {}) {
    options.parse = true;

    return CollectionModel.call(this, data, options);
  },

  Collection: CommunityDiscussionsCollection,

  _newCollection: function(models, options = {}) {
    const sort = (models && models.sortMethod) || this.get('sortMethod');
    const postedByTeacher = (models && models.postedByTeacher) || this.get('postedByTeacher');

    options.path = Utils.getPathname();
    options.parse = true;

    options.params = {
      postedByTeacher: postedByTeacher,
      sort: sort,
      collectionOnly: true,
    };

    return CollectionModel.prototype._newCollection.call(this, models, options);
  },
});

