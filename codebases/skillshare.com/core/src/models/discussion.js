import NumberHelpers from 'core/src/helpers/number-helpers';

const DiscussionModel = Backbone.Model.extend({

  urlRoot: '/discussions',

  initialize: function() {},

  parse: function(response) {
    if (!response.discussion) {return response;} // if parsing the collection

    this.content = response.content;
    delete response.content;

    // save the comment sort type on the model if we're fetching the model
    response.discussion.commentSort = response.commentSort;
    response.discussion.lastFetchTime = (new Date()).getTime();

    return response.discussion;
  },

  sync: function(method, model, options) {
    options.data = options.data || {};

    _.extend(options.data, {
      commentSort: this.get('commentSort'),
      type: this.get('sectionType'),
    });

    return Backbone.sync.apply(this, arguments);
  },

  numVotesAsInt: function() {
    return NumberHelpers.stripCommas(this.get('numVotes'));
  },

  formatVotesWithCommas: function() {
    return NumberHelpers.formatWithCommas(this.get('numVotes'));
  },

  numVotesWithString: function() {
    const punc = this.numVotesAsInt() === 1 ? 'Like' : 'Likes';
    // Format to commas if needed
    const num = this.formatVotesWithCommas();

    return num + ' ' + punc;
  },

}, {
  DISCUSSABLE_TYPES: {
    WORKSHOP: 'Workshop',
    USER: 'Users',
    AMA: 'AMA',
    PARENT_CLASS: 'ParentClasses',
  },
});

export default DiscussionModel;

