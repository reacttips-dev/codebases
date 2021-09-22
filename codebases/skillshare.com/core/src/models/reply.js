

const ReplyModel = Backbone.Model.extend({

  urlRoot: '/comments',

  sanitize: function(comment) {
    // Strip bad html except for hyperlinks and line breaks
    return comment.replace(/((?!<((\/)?a|br))<[^>]*>)/gi, '');
  },

  toJSON: function() {
    const data = _.clone(this.attributes);
    const comment = this.get('comment') || '';

    data.comment = this.sanitize(comment);

    return data;
  },

});

export default ReplyModel;

