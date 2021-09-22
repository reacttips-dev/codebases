

const RankableCollection = Backbone.Collection.extend({
  constructor: function() {
    this.on('add remove rerank', this.remapRanks);
    Backbone.Collection.apply(this, arguments);
    this.trigger('rerank');
  },

  comparator: function(model) {
    return parseInt(model.get('rank'), 10);
  },

  moveModelTo: function(model, toRank) {
    this.remove(model, { silent: true });
    this.add(model, { at: toRank, silent: true });
    this.trigger('rerank');
  },

  remapRanks: function() {
    this.each(function(model, i) {
      model.set('rank', i);
    });
  },
});

export default RankableCollection;

