

const InlineDiscussion = Backbone.Model.extend({

  url: function() {
    if (this.isNew()) {
      const sectionId = SS.serverBootstrap.newDiscussionSectionId;
      const url = '/discussions/create';
      return sectionId ? `${url}?sectionId=${sectionId}` : url;
    }

    return '/discussions/' + this.get('id');
  },

  defaults: {
    notify_all_students: false,
  },

  parse: function(response) {
    if (response.discussion) {
      return response.discussion;
    }

    return response;
  },

});

export default InlineDiscussion;

