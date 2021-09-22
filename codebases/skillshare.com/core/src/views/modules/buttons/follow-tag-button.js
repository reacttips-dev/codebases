import Button from 'core/src/views/modules/button';
import Utils from 'core/src/base/utils';
import template from 'text!core/src/templates/modules/buttons/follow-tag-button.mustache';

const FollowTagButton = Button.extend({

  template: template,

  tooltips: [
    'Follow',
    'Unfollow',
    'Unfollow',
  ],

  labels: [
    'Follow',
    'Following',
    'Following',
  ],

  requiresLogin: true,

  initialize: function(options = {}) {
    _.extend(this, _.pick(options, ['tagId', 'userIsFollowingTag', 'classes']));

    const data = {
      tagId: this.tagId,
      id: this.userIsFollowingTag ? this.tagId : undefined,
    };

    const { pageData } = SS.serverBootstrap;
    let via = '';
    if (pageData && pageData.pageName) {
      via = pageData.pageName;
    }

    this.model = new Backbone.Model(data);
    this.model.url = function() {
      if (this.id) {
        return '/tags/' + this.get('tagId') + '/unfollow';
      } else {
        return '/tags/' + this.get('tagId') + '/follow';
      }
    };
    // Button.js relies on Backbone sync to update the model state.
    // Unfortunately, sync expects the endpoints to be setup
    // using PUTs and DELETEs. Our follow tag endpoints do not currently
    // follow this format, so overriding sync to be able to use
    // POSTs and handle the response from follow tag.
    // TODO: update the follow tag endpoints
    this.model.sync = function(method, model, opts) {
      Utils.ajaxRequest(model.url(), _.extend({}, opts, {
        type: 'POST',
        data: { 'via': via },
        success: function(response) {
          if (response.following) {
            model.id = model.get('tagId');
          } else {
            model.id = undefined;
          }
        },
      }));
    };

    this.initialState = data.id ? Button.states.ACTIVE : Button.states.INACTIVE;

    Button.prototype.initialize.apply(this, arguments);
  },

  render: function() {
    Button.prototype.render.apply(this, arguments);
    this.$el.addClass(this.classes);
  },

});

export default FollowTagButton;

