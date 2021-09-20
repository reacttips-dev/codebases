import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { observer } from 'mobx-react';
import onClickOutside from '@postman/react-click-outside';

import { Text } from '@postman/aether';

import { getStore } from '@postman-app-monolith/renderer/js/stores/get-store';

import { openExternalLink } from '@postman-app-monolith/renderer/js/external-navigation/ExternalNavigationService';
import { POSTMAN_AGENTS, POSTMAN_DESKTOP_AGENT_DOCS } from '@postman-app-monolith/renderer/js/constants/AppUrlConstants';
import { getBrowser } from '@postman-app-monolith/renderer/js/controllers/ShortcutsList';
import { Button } from '@postman-app-monolith/renderer/js/components/base/Buttons';
import ToggleSwitch from '@postman-app-monolith/renderer/js/components/base/ToggleSwitch';
import {
  SETTING_KEY,
  FRIENDLY_TYPES,
  AUTOMATIC_SELECTION_SETTING_KEY as AUTOMATIC_AGENT_SELECTION
} from './AgentConstants';
import { openAgentOnboardingModal } from '../_common/components/molecule';

@onClickOutside
@observer
export default class AgentSelectionContainer extends Component {
  constructor (props) {
    super(props);

    this.handleAgentSelect = this.handleAgentSelect.bind(this);
    this.handleAgentOnboardingOpen = this.handleAgentOnboardingOpen.bind(this);
    this.handleLinkClick = this.handleLinkClick.bind(this);
    this.handleDesktopAgentLinkCLick = this.handleDesktopAgentLinkCLick.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.handleAutomaticSelectToggle = this.handleAutomaticSelectToggle.bind(this);
  }

  getDescriptionForDesktopAgent (isSafari, isCloudAgentEnabled) {
    if (isSafari) {
      return 'Safari doesn\'t support the desktop agent. Try switching browsers or using the browser agent instead.';
    }

    if (!isCloudAgentEnabled) {
      return 'The Desktop Agent allows you to send requests without any hiccups.';
    }

    return (
      <Fragment>
        Send requests via the locally running Postman
        {' '}
        <span className='details__link' onClick={this.handleDesktopAgentLinkCLick}>Desktop Agent</span>
        .
      </Fragment>
    );
  }

  handleClickOutside (e) {
    e && e.stopPropagation();
    this.props.onClose();
  }

  handleLinkClick () {
    openExternalLink(POSTMAN_AGENTS, '_blank');
  }

  handleDesktopAgentLinkCLick () {
    openExternalLink(POSTMAN_DESKTOP_AGENT_DOCS, '_blank');
  }

  handleAgentOnboardingOpen () {
    this.props.onClose();
    openAgentOnboardingModal && openAgentOnboardingModal(true);
  }

  handleAutomaticSelectToggle () {
    pm.settings.setSetting(AUTOMATIC_AGENT_SELECTION, !_.get(pm.runtime, 'agent.autoMode'));
  }

  handleAgentSelect (option) {
    if (_.get(pm.runtime, 'agent.autoMode')) {
      return;
    }

    pm.settings.setSetting(SETTING_KEY, option);
  }

  renderContent (selection, hasError) {
    const isCloudAgentEnabled = getStore('FeatureFlagsStore').isEnabled('runtime:isCloudAgentEnabled'),
      isSafari = getBrowser() === 'safari',
      agents = [
        ...isCloudAgentEnabled ? [{
          label: 'Cloud Agent',
          description: (
            <Fragment>
              Send HTTP requests via Postman’s secure cloud servers.
            </Fragment>
          ),
          key: 'cloud'
        }] : [],
        {
          label: (
            <Fragment>
              Desktop Agent
              {isSafari && ' (Unsupported)'}
            </Fragment>
          ),
          description: (
            <Fragment>
              {this.getDescriptionForDesktopAgent(isSafari, isCloudAgentEnabled)}
              {hasError && (
                <Button
                  className='agent-selection-details__confirm'
                  type='primary'
                  onClick={this.handleAgentOnboardingOpen}
                >
                  Download desktop agent
                </Button>
              )}
            </Fragment>
          ),
          key: 'desktop'
        },
        {
          label: 'Browser Agent',
          description: (
            <Fragment>
              Sending your requests through your browser comes with
              {' '}
              <span className='details__link' onClick={this.handleLinkClick}>limitations</span>
              .
            </Fragment>
          ),
          key: 'browser'
        }
      ],
      AgentInfo = ({
        label, description, active, onClick, unsupported, disabled
      }) => (
        <div
          onClick={onClick}
          className={classnames({
            'agent-selection-details__wrapper': true, active, unsupported, disabled
          })}
        >
          <div className={classnames({
            'agent-selection-item__radio': true, active, unsupported, disabled
          })}
          />
          <div className='agent-selection-item__info'>
            <div className={classnames({ 'agent-selection-item__label': true, unsupported, disabled })}>
              {label}
            </div>
            <div className={classnames({ 'agent-selection-item__description': true, unsupported, disabled })}>
              {description}
            </div>
          </div>
        </div>
      );

    return (
      <div>
        {agents.map((agent) => (
          <AgentInfo
            key={agent.key}
            unsupported={isSafari && agent.key === 'desktop'}
            active={selection === agent.key}
            label={agent.label}
            description={agent.description}
            addDividerOnTop={agent.addDividerOnTop}
            onClick={() => this.handleAgentSelect(agent.key)}
            disabled={_.get(pm.runtime, 'agent.autoMode')}
          />
        ))}
      </div>
    );
  }


  render () {
    const agentTypeName = _.get(pm.runtime, 'agent.autoMode') ? AUTOMATIC_AGENT_SELECTION : FRIENDLY_TYPES[_.get(pm.runtime.agent, 'stat.type')],
      hasError = !pm.runtime.agent.isReady;

    return (
      <div className={`agent-selection-details__${agentTypeName}`}>
        <div className='details__header'>
          <Text type='label-primary-medium'>
            Select Postman Agent
          </Text>
        </div>
        <div className='agent-selection-details__wrapper auto-select'>
          <div className='agent-selection-item__info'>
            <div className='agent-selection-item__label'>
              Auto-select
            </div>
            <div className='agent-selection-item__description'>
              Postman will automatically select the best agent for your request.
            </div>
          </div>
          <ToggleSwitch
            isActive={agentTypeName === AUTOMATIC_AGENT_SELECTION}
            onClick={this.handleAutomaticSelectToggle}
            activeLabel=''
            inactiveLabel=''
          />
        </div>
        <div className='agent-selection-details__divider' />
        { this.renderContent(agentTypeName, hasError) }
      </div>
    );
  }
}

AgentSelectionContainer.defaultProps = {
  onClose: () => {}
};

AgentSelectionContainer.propTypes = {
  onClose: PropTypes.func
};
