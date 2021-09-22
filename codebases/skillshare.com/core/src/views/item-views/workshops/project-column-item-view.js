import SSView from 'core/src/views/base/ss-view';
import projectTemplate from 'text!core/src/templates/shared/_small-list-view-grid-item.mustache';
import emptyProjectTemplate from 'text!core/src/templates/partials/workshops/_empty-project-grid-item.mustache';
import userInformationTemplate from 'text!core/src/templates/partials/_user-information-small.mustache';
import LikeIcon from 'core/src/views/modules/buttons/like-button-svg';
import ComponentInitializers from 'core/src/helpers/component-initializers';

const ProjectColumnItemView = SSView.extend({

  setElementToTemplate: true,

  template: function() {
    return this.model.get('id') ? projectTemplate : emptyProjectTemplate;
  },

  templateData: function() {
    return _.extend({}, this.model.attributes, { clientRendered: true });
  },

  templatePartials: {
    'partials/_user-information-small': userInformationTemplate,
  },

  initialize: function() {
    _.bindAll(this, 'onChangeNumLikes');
    SSView.prototype.initialize.apply(this, arguments);
  },

  afterRender: function() {
    ComponentInitializers.initUserPopovers(this);
    if (!SS.currentUser.isGuest()) {
      const voteData = {
        voteable_id: this.model.get('id'),
        voteable_type: 'Project',
        trackingParams: { via: 'project-item' },
      };

      if (this.model.get('voteId') !== 0) {
        _.extend(voteData, {
          voteId: this.model.get('voteId'),
        });
      }

      new LikeIcon({
        container: this.$('.like-btn-wrapper'),
        modelData: voteData,
        parentModel: this.model,
        initialState: this.model.get('hasVoted'),
      });

      this.likeCounter = this.$('.num-likes');
      this.model.on('change:numLikes', this.onChangeNumLikes);
    }

    SSView.prototype.afterRender.apply(this, arguments);
  },

  onChangeNumLikes: function() {
    let likeText = '';

    if (this.model.get('numLikes') === 1) {
      likeText = this.model.get('numLikes') + ' like';
    } else if (this.model.get('numLikes') > 1) {
      likeText = this.model.get('numLikes') + ' likes';
    }

    this.likeCounter.text(likeText);
  },
});

export default ProjectColumnItemView;

