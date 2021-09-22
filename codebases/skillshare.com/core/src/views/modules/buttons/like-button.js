import Button from 'core/src/views/modules/button';
import Vote from 'core/src/models/vote';
import NumberHelpers from 'core/src/helpers/number-helpers';
import template from 'text!core/src/templates/modules/buttons/like-button.mustache';

const LikeButton = Button.extend({

  template: template,

  tooltips: [
    'Like this',
    'Unlike this',
  ],

  initialize: function(options = {}) {
    _.extend(this, _.pick(options, ['model', 'parentModel', 'type']));

    this.templateData = {};

    if (!_.isUndefined(options.tooltips)) {
      this.tooltips = options.tooltips;
    }

    if (options.showCounter) {
      this.showCounter = true;
      this.templateData.showCounter = true;

      if (!_.isUndefined(this.parentModel.get('numLikes'))) {
        this.templateData.numLikes = this.parentModel.get('numLikes');
      } else if (!_.isUndefined(this.parentModel.get('numVotes'))) {
        this.templateData.numLikes = this.parentModel.get('numVotes');
      } else {
        this.templateData.numLikes = 0;
      }
    }

    if (options.modelData) {
      const data = {
        voteable_id: options.modelData.voteable_id,
        voteable_type: options.modelData.voteable_type,
      };

      // By passing an id other than 0, we're saying the user has already activated the button state on load
      if (options.modelData.voteId !== 0) {
        _.extend(data, {
          id: options.modelData.voteId,
        });
      }

      this.model = new Vote(data);
    }

    // Set initial state
    if (options.initialState) {
      this.initialState = options.initialState;
    } else {
      this.initialState = !_.isUndefined(this.model.get('id'))
        ? Button.states.ACTIVE : Button.states.INACTIVE;
    }

    if (options.type === 'label') {
      if (!options.labels) {
        this.labels = [
          'Like',
          'Unlike',
        ];
      }
      this.templateData.styles = '';
    } else if (options.type === 'circle') {
      this.templateData.styles = 'circle-btn circle-like-btn ss-icon-heart';
    } else if (options.type === 'oval' && this.initialState === Button.states.INACTIVE) {
      this.templateData.styles = 'oval-btn oval-like-btn ss-icon-empty-heart';
    } else {
      this.templateData.styles = 'oval-btn oval-like-btn ss-icon-heart';
    }

    if (!_.isUndefined(options.styles)) {
      this.templateData.styles += (' ' + options.styles);
    }
    // special behavior to switch icon type when button changes state
    // eventually we'd like to do this in a different way
    const _this = this;
    this.model.on('change', function() {
      if (_this.type === 'oval') {
        if (_this.model.get('state') === Button.states.INACTIVE) {
          _this.$el.removeClass('ss-icon-heart');
          _this.$el.addClass('ss-icon-empty-heart');
        } else {
          _this.$el.removeClass('ss-icon-empty-heart');
          _this.$el.addClass('ss-icon-heart');
        }
      }
    });

    Button.prototype.initialize.apply(this, arguments);
  },

  onClick: function(event) {
    event.stopPropagation();

    if (!_.isUndefined(this.parentModel)) {
      // Ensure num is an int
      let currCount = 0;
      let newCount = 0;

      if (!_.isUndefined(this.parentModel.get('numLikes'))) {
        currCount = this.parentModel.get('numLikes');
      } else if (!_.isUndefined(this.parentModel.get('numVotes'))) {
        currCount = this.parentModel.get('numVotes');
      }

      currCount = NumberHelpers.stripCommas(currCount);

      if (this.determineNewState() === Button.states.ACTIVE) {
        newCount = currCount + 1;
      } else {
        newCount = currCount - 1;
      }

      if (this.showCounter) {
        this.$('.counter-wrapper').text(newCount);
      }

      // Update project model with new count
      // This will not be synced to the server. FE use only.
      this.parentModel.set({
        numLikes: newCount,
        userVote: {
          value: this.determineNewState() === Button.states.ACTIVE ? 1 : 0,
        },
      });
    }

    Button.prototype.onClick.apply(this, arguments);
  },

});

export default LikeButton;

