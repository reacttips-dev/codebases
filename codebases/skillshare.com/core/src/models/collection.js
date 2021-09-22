
function overrideInSubclass() {
  throw new Error('Override this in a subclass.');
}

const CollectionModel = Backbone.Model.extend({

  constructor: function(data, opts = {}) {
    _.extend(this, _.pick(opts, 'Collection', 'urlRoot'));

    Backbone.Model.apply(this, arguments);

    if (!this.collection) {
      this.collection = this._newCollection();
    }
  },

  Collection: overrideInSubclass,

  parse: function(resp) {
    const collection = resp.collection;
    this.collection = this._newCollection(collection);

    delete resp.collection;
    resp.collection_cid = this.collection.cid || _.uniqueId('collection_');

    return Backbone.Model.prototype.parse.apply(this, arguments);
  },

  // Override this if you'd like to provide custom options, etc...
  _newCollection: function(collection, options) {
    return new this.Collection(collection, options);
  },
});

export default CollectionModel;

