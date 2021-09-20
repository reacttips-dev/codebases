import React, { Component } from 'react';
import styled from 'styled-components';
import { launchDarkly } from '../../common/LaunchDarkly';
import { Modal, ModalHeader, ModalContent, ModalFooter, Button, Flex, Text } from '@postman/aether';
import {
  openExternalLink
} from '../../../../js/external-navigation/ExternalNavigationService';
import AnalyticsService from '../../../../js/modules/services/AnalyticsService';
import NavigationService from '../../../../js/services/NavigationService';
import { OPEN_WORKSPACES_HOME_IDENTIFIER } from '../../../navigation/constants';
import { OPEN_WORKSPACE_IDENTIFIER } from '../../../../collaboration/navigation/constants';

const VIDEO_SRC = 'https://skills-assets.pstmn.io/onboarding/GROWTH-43/welcom+to+postman+team+video+v4.mp4#t=1.5',
  LEARNING_CENTER_URL = 'https://learning.postman.com/docs/collaborating-in-postman/collaboration-intro/',
  INFO_TEXT = `Collaborate in team workspaces. Contribute through forks and pull requests. Have conversations in comments.
      Create your own Private API Network. And do a lot more.`;

const OverviewSubtext = styled.span`
  .team-feature-video {
    display: block;
    margin-top: var(--spacing-xl);
  }
`;

export default class VideoOverview extends Component {
  constructor (props) {
    super(props);

    this.handlePrimaryAction = this.handlePrimaryAction.bind(this);
  }

  componentDidMount () {
    launchDarkly.track('team_feature_overview_modal_shown');
  }

  handlePrimaryAction () {
    const currentURL = NavigationService.getCurrentURL(),
    routesForCurrentUrl = NavigationService.getRoutesForURL(currentURL);

    AnalyticsService.addEventV2AndPublish({
      category: 'team_feature_overview',
      action: 'click',
      label: 'video_lets_go'
    });

     if (!_.size(routesForCurrentUrl) || !routesForCurrentUrl.find((match) => match.name == OPEN_WORKSPACE_IDENTIFIER)) {
      NavigationService.transitionTo(OPEN_WORKSPACES_HOME_IDENTIFIER);
    }

    this.props.handleToggle({ isOpen: false });
  }

  render () {
    let currentURL = NavigationService.getCurrentURL(),
    routesForCurrentUrl = NavigationService.getRoutesForURL(currentURL),
     primaryText = 'Explore team workspaces';

     if (routesForCurrentUrl.length && routesForCurrentUrl.find((match) => match.name === OPEN_WORKSPACE_IDENTIFIER)) {
       primaryText = 'Got it';
     }

    return (
      <Modal
        isOpen
        size='medium'
        onClose={() => {
          this.props.handleToggle({ isOpen: false, modalClosed: true });
        }}
      >
        <ModalHeader
          heading='Welcome to the realm of collaborative API development'
        />
        <ModalContent>
          <video
            width='600'
            onPlay={() => {
              launchDarkly.track('team_feature_overview_initiated');

              AnalyticsService.addEventV2AndPublish({
                category: 'team_feature_overview',
                action: 'played',
                label: 'video'
              });
            }}
            onEnded={() => {
              launchDarkly.track('team_feature_overview_completed');
            }}
            height='353'
            controls
            preload='metadata'
          >
            <source src={VIDEO_SRC} type='video/mp4' />
              Your browser does not support the video tag.
          </video>
          <OverviewSubtext>
            <Text className='team-feature-video' type='body-large'>{INFO_TEXT}</Text>
          </OverviewSubtext>
        </ModalContent>
        <ModalFooter>
          <Flex grow={1} shrink={1} justifyContent='flex-end' gap='spacing-s'>
            <Button
              type='secondary'
              text='Learn more about collaboration'
              onClick={() => {
                AnalyticsService.addEventV2AndPublish({
                  category: 'team_feature_overview',
                  action: 'click',
                  label: 'video_learn_more'
                });

                openExternalLink(LEARNING_CENTER_URL, '_blank');
              }}
            />
            <Button
              type='primary'
              text={primaryText}
              onClick={this.handlePrimaryAction}
            />
          </Flex>
        </ModalFooter>
      </Modal>
    );
  }
}

