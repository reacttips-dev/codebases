import Backbone from 'backbone';
import _ from 'underscore';

const PartCollection = Backbone.Collection.extend({
  ordered: false,

  parse(data) {
    const partArray = _(data).map(function (partJson, id) {
      return _({}).extend(partJson.definition, {
        id,
        order: partJson.order,
        typeName: partJson.typeName,
        submissionSchemaPartId: partJson.submissionSchemaPartId,
      });
    });

    if (this.ordered) {
      return _(partArray).sortBy(function (partJson) {
        return data[partJson.id].order;
      });
    } else {
      return partArray;
    }
  },

  toJSON() {
    const idObjectPairs = this.map(function (model) {
      return [
        model.get('id'),
        {
          typeName: model.get('typeName'),
          definition: _(model.toJSON()).omit('id', 'typeName', 'order'),
        },
      ];
    });
    return _(idObjectPairs).object();
  },
});

export default PartCollection;
