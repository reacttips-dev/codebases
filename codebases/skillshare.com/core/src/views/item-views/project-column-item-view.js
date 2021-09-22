import React from 'react';
import ReactDOM from 'react-dom';
import { DefaultThemeProvider } from '@skillshare/ui-components/themes';
import { ApolloProvider, AuthenticationProvider, EnvironmentProvider } from '@skillshare/ui-components/components/providers';
import { ApolloClientManager } from '@skillshare/ui-components/shared/apollo';
import { ProjectModalWrapper as GQLProjectModalWrapper } from '@skillshare/ui-components/Project/ProjectModal/ProjectModalWrapper';

import SSView from 'core/src/views/base/ss-view';
import projectTemplate from 'text!core/src/templates/shared/_small-list-view-grid-item.mustache';
import userInformationTemplate from 'text!core/src/templates/partials/_user-information-small.mustache';
import LikeButton from 'core/src/views/modules/buttons/like-button-svg';
import ComponentInitializers from 'core/src/helpers/component-initializers';
import deepRetrieve from 'core/src/utils/deep-retrieve';
import Utils from 'core/src/base/utils';

const ProjectColumnItemView = SSView.extend({

  setElementToTemplate: true,

  template: projectTemplate,

  events: {
    'click .ss-card__thumbnail': 'onClickProjectCard',
  },

  templateData: function() {
    return _.extend({}, this.model.attributes, { clientRendered: true });
  },

  templatePartials: {
    'partials/_user-information-small': userInformationTemplate,
  },

  initialize: function() {
    _.bindAll(this, 'onChangeNumLikes');

    this.canViewProjectModal = !Utils.isTouchDevice();

    // On user profiles, we cannot rely on the `id` property as it refers to the id of the profile entity
    // and not the entity itself (which is a project in this case). Elsewhere, we correctly pass the `id`
    // of the project
    this.projectId = this.model.get('entityId') ? this.model.get('entityId') : this.model.get('id');

    SSView.prototype.initialize.apply(this, arguments);
  },

  afterRender: function() {
    ComponentInitializers.initUserPopovers(this);

    if (!SS.currentUser.isGuest()) {
      const voteData = {
        voteable_id: this.model.get('entityId') ? this.model.get('entityId') : this.model.get('id'),
        voteable_type: 'Project',
        trackingParams: { via: 'project-item' },
      };

      if (this.model.get('voteId') !== 0) {
        _.extend(voteData, {
          voteId: this.model.get('voteId'),
        });
      }

      this.likeButton = new LikeButton({
        container: this.$('.like-btn-wrapper'),
        modelData: voteData,
        parentModel: this.model,
        initialState: this.model.get('hasVoted'),
        remountProjectModal: this.canViewProjectModal ? this.remountProjectModal.bind(this) : null,
      });

      this.likeCounter = this.$('.num-likes');

      this.model.on('change:numLikes', this.onChangeNumLikes);
    }

    if (this.canViewProjectModal) {
      this.renderProjectModal();
    }

    SSView.prototype.afterRender.apply(this, arguments);
  },

  onClickProjectCard: function(e) {
    /**
     * The user has simply clicked on the project card. We prevent the default behavior of the
     * link/going to the URL, and proceed with the rest of code in this function which will open the modal
     */
    if (!e.ctrlKey && !e.metaKey) {
      e.preventDefault();
    /**
     * The user has attempted to open the project in a new tab. Instead of preventing default, we stop
     * propagation of the event which prevents it from bubbling to the click event handler of the modal
     * and open the link as is
     */
    } else {
      e.stopPropagation();

      return;
    }

    if (!this.canViewProjectModal) {
      window.location.href = `${this.model.get('url')}?via=project-details`;

      return;
    }

    this.mixpanelTrack();
    this.renderProjectModal();
  },

  remountProjectModal: function() {
    ReactDOM.unmountComponentAtNode(this.$('.project-modal-container').get(0));

    this.renderProjectModal();
  },

  renderProjectModal: function() {
      const appHost = document.location.origin;
      const isAuthenticated = !SS.currentUser.isGuest();
      const apiHost = deepRetrieve(SS, 'serverBootstrap', 'apiData', 'host');
      const client = ApolloClientManager.getClient({
        uri: `${apiHost}/api/graphql`,
      });

      ReactDOM.render(
        <ApolloProvider client={client}>
          <DefaultThemeProvider>
              <AuthenticationProvider isAuthenticated={isAuthenticated}>
                <EnvironmentProvider variables={{ appHost }}>
                  <GQLProjectModalWrapper projectKey={this.projectId.toString()}/>
                </EnvironmentProvider>
              </AuthenticationProvider>
          </DefaultThemeProvider>
        </ApolloProvider>,
        this.$('.project-modal-container').get(0)
      )
  },

  onProjectLike: function () {
    this.likeButton.onClick();
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

  mixpanelTrack: function() {
    if (this.model.get('trackingParams')) {
      SS.EventTracker.track('Viewed.Project', {}, this.model.get('trackingParams'));
    }
  },
});

export default ProjectColumnItemView;
