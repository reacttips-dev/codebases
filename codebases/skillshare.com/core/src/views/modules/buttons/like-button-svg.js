import Button from 'core/src/views/modules/button';
import Vote from 'core/src/models/vote';
import NumberHelpers from 'core/src/helpers/number-helpers';
import template from 'text!core/src/templates/modules/buttons/like-button-svg.mustache';

const LikeIcon = Button.extend({

  template: template,

  tooltips: [
    'Like this',
    'Unlike this',
  ],

  initialize: function(options) {
    const params = options || {};

    _.extend(this, _.pick(params, ['model', 'parentModel', 'remountProjectModal']));

    this.templateData = {};

    this.labels = [
      '<svg class="ss-svg-icon empty-heart"><use xlink:href="#heart--empty" /></svg>',
      '<svg class="ss-svg-icon heart-icon-filled"><use xlink:href="#heart--filled" /></svg>',
    ];

    if (params.modelData) {
      const data = {
        voteable_id: params.modelData.voteable_id,
        voteable_type: params.modelData.voteable_type,
      };

      // By passing an id other than 0, we're saying the user has already activated the button state on load
      if (params.modelData.voteId !== 0) {
        _.extend(data, {
          id: params.modelData.voteId,
        });
      }

      this.model = new Vote(data);
    }

    // Set initial state
    if (params.initialState) {
      this.initialState = params.initialState;
    } else {
      this.initialState = this.model.get('id')
        ? Button.states.ACTIVE : Button.states.INACTIVE;
    }

    if (params.styles) {
      this.templateData.styles = params.styles;
    }

    Button.prototype.initialize.apply(this, arguments);
  },

  onClick: function(event) {
    if (event) {
      event.stopPropagation();
    }

    if (this.parentModel) {
      // Ensure num is an int
      let currCount = 0;
      let newCount = 0;

      if (this.parentModel.get('numLikes')) {
        currCount = this.parentModel.get('numLikes');
      }

      currCount = NumberHelpers.stripCommas(currCount);

      if (this.determineNewState() === Button.states.ACTIVE) {
        newCount = currCount + 1;
        this.$('.empty-heart').hide();
        this.$('.filled-heart').show();
      } else {
        newCount = currCount - 1;
        this.$('.empty-heart').show();
        this.$('.filled-heart').hide();
      }

      // Update project model with new count
      // This will not be synced to the server. FE use only.
      this.parentModel.set({
        hasVoted: this.determineNewState(),
        numLikes: newCount,
        userVote: {
          value: this.determineNewState() === Button.states.ACTIVE ? 1 : 0,
        },
      });

      // After vote/like state has been updated, go ahead and remount the project modal which
      // will now be hydrated with the updated values
      if (event && this.remountProjectModal) {
        this.remountProjectModal();
      }
    }

    Button.prototype.onClick.apply(this, arguments);
  },

});

export default LikeIcon;

