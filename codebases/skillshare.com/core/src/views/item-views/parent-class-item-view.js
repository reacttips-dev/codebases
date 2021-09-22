import SSView from 'core/src/views/base/ss-view';
import parentClassTemplate from 'text!core/src/templates/classes/_row.mustache';
import classStatsTemplate from 'text!core/src/templates/partials/_class-stats.mustache';
import reviewStatTemplate from 'text!core/src/templates/partials/_review-stat.mustache';

const ParentClassItemView = SSView.extend({

  tagName: 'li',

  className: 'class-row clear',

  template: parentClassTemplate,

  templatePartials: {
    'partials/_class-stats': classStatsTemplate,
    'partials/_review-stat': reviewStatTemplate,
  },

  templateData: function() {
    if (!SS.serverBootstrap.classesData) {
      return this.model.attributes;
    }

    return _.extend(this.model.attributes, {
      membershipUrl: SS.serverBootstrap.classesData.membershipUrl,
      userIsSubscriber: SS.serverBootstrap.classesData.userIsSubscriber,
    });
  },

});

export default ParentClassItemView;

