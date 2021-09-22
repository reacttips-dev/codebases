import RankableCollection from 'core/src/collections/base/rankable-collection';
import Session from 'core/src/models/session';

const SessionsCollection = RankableCollection.extend({
  model: Session,

  initialize: function(models, options) {
    this.parentClass = options.parentClass;
    this.unit = options.unit;
  },
});

export default SessionsCollection;

