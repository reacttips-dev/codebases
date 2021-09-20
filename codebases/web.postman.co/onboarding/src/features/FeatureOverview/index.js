import React, { Component } from 'react';
import { observer } from 'mobx-react';
import VideoOverview from './VideoOverview';
import GifOverview from './GifOverview';
import { launchDarkly } from '../../common/LaunchDarkly';
import NavigationService from '../../../../js/services/NavigationService';
import { getUrlParts, _getQueryStringParams } from '../../../../js/utils/NavigationUtil';
import { TEAM_FEATURE_OVERVIEW_KEY } from './Constants';
import { getStore } from '../../common/dependencies';

@observer
export class TeamFeatureOverviewModal extends Component {
  constructor (props) {
    super(props);

    this.handleToggle = this.handleToggle.bind(this);
  }

  handleToggle ({ isOpen = true, modalClosed = false }) {
    // if user closes the modal then fire the ld event
    modalClosed && launchDarkly.trackAndFlush('team_feature_overview_modal_closed');

    // Raised a ticket for this https://postmanlabs.atlassian.net/browse/CFSUP-226
    const currentURL = NavigationService.getCurrentURL(),
      { pathUrl, queryString } = getUrlParts(currentURL),
      route = NavigationService.getRoutesForURL(pathUrl),
      queryParams = _getQueryStringParams(queryString);

    delete queryParams[TEAM_FEATURE_OVERVIEW_KEY];

    if (route.length) {
      NavigationService.transitionTo(route[route.length - 1].name, NavigationService.getCurrentRouteParams(), queryParams);
    }

    getStore('GrowthExperimentStore').update('isTeamFeatureOverviewModalOpen', isOpen);
  }

  render () {
    if (!getStore('GrowthExperimentStore').isTeamFeatureOverviewModalOpen) {
      return null;
    }

    const isTeamFeatureOverviewEnabled = getStore('GrowthExperimentStore').isTeamFeatureOverviewEnabled,
    teamFeatureOverviewNudges = getStore('GrowthExperimentStore').teamFeatureOverviewNudges;

    if (!isTeamFeatureOverviewEnabled) {
      return null;
    }

    return (
      <div>
      {
        teamFeatureOverviewNudges.videoVariant ?
        <VideoOverview
          handleToggle={this.handleToggle}
        /> :
        <GifOverview
          handleToggle={this.handleToggle}
        />
      }
      </div>
    );
  }
}
