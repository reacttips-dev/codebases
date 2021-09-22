import Tags from 'core/src/collections/tags';
import Utils from 'core/src/base/utils';

const BasicParentClassModel = Backbone.Model.extend({

  initialize: function() {
    const tags = this.get('tags') || [];
    this.tags = new Tags(tags);
  },

  createRosterFromSku: function(successFn, errorFn = null, status = null, via) {
    if (this.get('userRosterId')) {
      return false;
    }

    const sku = this.get('sku');
    const url = `/classes/${sku}/roster`;
    const data = {
      last_video_index: 1,
      via: via,
    };

    if (status !== null) {
      data.roster_status = status;
    }

    const options = {
      data: data,
      type: 'POST',
      success: successFn,
    };

    if (errorFn !== null) {
      options.error = errorFn;
    }

    return Utils.ajaxRequest(url, options);
  },

});

export default BasicParentClassModel;


