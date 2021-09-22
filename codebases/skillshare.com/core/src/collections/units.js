import RankableCollection from 'core/src/collections/base/rankable-collection';
import Unit from 'core/src/models/unit';

const UnitCollection = RankableCollection.extend({
  model: Unit,

  initialize: function(models, options) {
    this.parentClass = options.parentClass;

    this.on('add remove', this.toggleModelDestroyable);
  },

  toggleModelDestroyable: function() {
    const destroyable = this.length > 1;
    this.invoke('toggleDestroyable', destroyable);
  },
});

export default UnitCollection;

