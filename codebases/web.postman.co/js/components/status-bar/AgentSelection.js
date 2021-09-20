import React from 'react';
import classnames from 'classnames';
import { observer } from 'mobx-react';
import { Icon } from '@postman/aether';

import RunIcon from '../../components/base/Icons/RunIcon';
import XPath from '../../components/base/XPaths/XPath';
import { Tooltip } from '../base/Tooltips';
import AgentSelectionContainer from '@@runtime-repl/agent/AgentSelectionContainer';
import {
  SETTING_VALUES,
  FRIENDLY_TYPES,
  AUTOMATIC_SELECTION_SETTING_KEY
} from '@@runtime-repl/agent/AgentConstants';

@observer
export default {
  name: 'AgentSelection',
  position: 'right',

  getComponent: function ({
    React,
    PluginInterface,
    StatusBarComponents
  }) {
    return class AgentSelection extends React.Component {
      constructor (props) {
        super(props);

        this.state = {
          isOpen: false
        };

        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleClick = this.handleClick.bind(this);
      }

      handleOpen () {
        this.setState({ isOpen: true });
      }

      handleClose () {
        this.setState({ isOpen: false });
      }

      handleClick () {
        this.setState(({ isOpen }) => ({ isOpen: !isOpen }));
      }

      UNSAFE_componentWillMount () {
        pm.mediator.on('showAgentSelectionPopover', this.handleOpen);
      }

      componentWillUnmount () {
        pm.mediator.off('showAgentSelectionPopover', this.handleOpen);
      }

      render () {
        if (!(window.SDK_PLATFORM === 'browser')) {
          return null;
        }

        let { Item, Text } = StatusBarComponents;
        const { type: agentType } = pm.runtime.agent.stat,
          agentTypeName = FRIENDLY_TYPES[agentType],
          hasError = !pm.runtime.agent.isReady,
          agentLabel = pm.runtime.agent.autoMode ?
            'Auto-select agent' :
            SETTING_VALUES[agentTypeName.toUpperCase()].label + ' Agent';

        return (
          <XPath identifier='runtime-agent'>
            <div ref={(ref) => { this.containerRef = ref; }}>
              <Item
                className='plugin__agent-selection-shortcut'
              >
                <Text
                  render={() => {
                  return (
                    <div
                      className='agent-selection-icon'
                      onClick={this.handleClick}
                    >
                      {hasError ?
                        <Icon
                          className='agent-selection-icon-error'
                          name='icon-state-error-stroke'
                          color='content-color-error'
                          size='small'
                        />
                        :
                        <Icon
                          className='agent-selection-icon-success'
                          name='icon-state-success-stroke'
                          color='content-color-success'
                          size='small'
                        />
                      }
                      <span className='agent-selection-label'>
                        { agentLabel }
                      </span>
                    </div>
                  );
                }}
                />
              </Item>
              <Tooltip
                className={`agent-selection-details__${pm.runtime.agent.autoMode ? AUTOMATIC_SELECTION_SETTING_KEY : agentTypeName}`}
                show={this.state.isOpen}
                target={this.containerRef}
                placement='top-right'
                immediate
              >
                <AgentSelectionContainer onClose={this.handleClose} />
              </Tooltip>

            </div>
          </XPath>
        );
      }
    };
  }
};
