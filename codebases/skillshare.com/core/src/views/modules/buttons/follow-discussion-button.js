import Button from 'core/src/views/modules/button';
import URLHelpers from 'core/src/helpers/url-helpers';
import Utils from 'core/src/base/utils';

const FollowDiscussionButton = Button.extend({

  urlRoot: window.location.protocol + '//' + window.location.host + '/discussions/',
  followUrl: 'follow',
  unfollowUrl: 'unfollow',

  requiresLogin: true,

  tooltips: [
    'Follow this',
    'Unfollow this',
  ],

  labels: [
    'Follow Thread',
    'Unfollow',
  ],

  initialize: function(options = {}) {
    _.extend(this, _.pick(options, ['model', 'parentModel']));

    this.initialState = !_.isNull(this.model.get('id')) ? Button.states.ACTIVE : Button.states.INACTIVE;

    Button.prototype.initialize.apply(this, arguments);
  },

  onClick: function(event) {
    event.stopPropagation();

    // the follow/unfollow discussion endpoints are, unfortunately
    // not set up as a single path, so we have to dynamically change it
    this.endpoint = this.constructEndpoint(this.determineNewState());

    Button.prototype.onClick.apply(this, arguments);
  },

  sync: function() {
    Utils.ajaxRequest(this.endpoint, {
      type: 'GET',
      success: () => {
        let numFollowers = parseInt(this.parentModel.get('numFollowers'), 10);
        const isActive = this.model.get('state') === Button.states.ACTIVE;
        const diff = isActive ? 1 : -1;
        numFollowers += diff;

        if (!isActive) {
          this.parentModel.set({ userFollow: null });
        }

        this.parentModel.set({ numFollowers: numFollowers });
      },
    });
  },

  constructEndpoint: function(newState) {
    const path = newState === Button.states.ACTIVE ? this.followUrl : this.unfollowUrl;
    return URLHelpers.addParams(this.urlRoot + path, { id: this.model.get('discussion') });
  },
});

export default FollowDiscussionButton;

