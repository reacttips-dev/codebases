import React, { Component } from 'react';
import { Modal, ModalContent } from '../../components/base/Modals';
import { Button } from '../../components/base/Buttons';
import XFlowGettingStarted from '../../components/new-button/XFlowGettingStarted';
import XFlowActivityList from '../../components/new-button/XFlowActivityList';
import { Tabs, Tab } from '../../components/base/Tabs';
import { openExternalLink } from '@postman-app-monolith/renderer/js/external-navigation/ExternalNavigationService';

import {
  DOCS_URL,
  DOCS_SECURITY_URL,
  SUPPORT_URL,
  TWITTER_URL
} from '../../constants/AppUrlConstants';
import CloseIcon from '../../components/base/Icons/CloseIcon';
import EditorService from '../../services/EditorService';

const TABS = {
  ACTIVITY_TAB: 'activity-feed',
  DOCS_TAB: 'docs-tab'
};


export default class ActivityFeedModalContainer extends Component {
  constructor (props) {
    super(props);

    this.state = {
      isOpen: false,
      activeTab: TABS.ACTIVITY_TAB,
      activityList: []
    };

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleTabSelect = this.handleTabSelect.bind(this);
    this.handleNewActivity = this.handleNewActivity.bind(this);
  }

  UNSAFE_componentWillMount () {
    pm.mediator.on('openXFlowActivityFeed', this.handleOpen);
    pm.mediator.on('saveXFlowActivity', this.handleNewActivity);
  }

  componentWillUnmount () {
    pm.mediator.off('openXFlowActivityFeed', this.handleOpen);
    pm.mediator.off('saveXFlowActivity', this.handleNewActivity);
  }

  getCustomStyles () {
    return { 'width': '900px' };
  }

  handleClose () {
    this.setState({ isOpen: false });
    pm.mediator.trigger('modalOpened', {
      name: 'xFlowActivityModal',
      isOpen: false
    });
  }

  handleOpen () {
    let activityString = localStorage.getItem('xFlowActivity'),
        activityList = null;

    try {
      if (!_.isEmpty(activityString)) {
        activityList = JSON.parse(activityString);
      }

    }
    catch (e) {
      pm.logger.error('Error in parsing xFlowActivity', e);
    }

    finally {
      this.setState({
        isOpen: true,
        activityList,
        activeTab: _.isEmpty(activityList) ? TABS.DOCS_TAB : TABS.ACTIVITY_TAB
      });
      pm.mediator.trigger('modalOpened', {
        name: 'xFlowActivityModal',
        isOpen: true
      });
    }
  }

  handleTabSelect (value) {
    this.setState({ activeTab: value });
  }

  handleNewActivity (type, nextStepState) {
    let activityObj = {
      type,
      nextStepState,
      createdAt: Date.now()
    };

    let activityString = localStorage.getItem('xFlowActivity'),
        acitivityList = null;

    try {
      if (!_.isEmpty(activityString)) {
        acitivityList = JSON.parse(activityString);
      }

    }
    catch (e) {
      pm.logger.error('Error in parsing xFlowActivity', e);
    }

    finally {
      let updatedActivity;
      if (!activityString) {
        updatedActivity = [activityObj];
      }
      else {
        updatedActivity = JSON.parse(activityString);
        updatedActivity = _.size(updatedActivity) < 20 ?
          _.concat(activityObj, updatedActivity) :
          _.concat(activityObj, _.dropRight(updatedActivity));
      }

      localStorage.setItem('xFlowActivity', JSON.stringify(updatedActivity));
    }
  }

  render () {
    return (
      <Modal
        className='user-welcome-modal'
        isOpen={this.state.isOpen}
        customStyles={this.getCustomStyles()}
        onRequestClose={this.handleClose}
      >
        <CloseIcon className='user-welcome-modal--dismiss-icon' onClick={this.handleClose} />
        <ModalContent>
          <div className='user-welcome__left-section'>
            <div className='section-title'>
              Welcome to Postman!
            </div>

            <div className='section-subtext intro-text'>
              <div className='section-subtext__text'>
                <span>Postman is a powerful API development environment. Postman helps you design, mock, test, document, and monitor APIs.</span>
              </div>
            </div>

            <div className='section-subtext'>
              <div className='section-subtext__text links-label'>
                <span>USEFUL LINKS</span>
              </div>
              {
                window.SDK_PLATFORM !== 'browser' &&
                  <div>
                    <Button
                      type='text'
                      className='help-link'
                      onClick={() => {
                        return EditorService.open('customview://releaseNotes')
                          .then(() => {
                            this.handleClose();
                          });
                      }}
                    >
                    Release notes
                    </Button>
                  </div>
              }
              <div>
                <Button
                  type='text'
                  className='help-link'
                  onClick={() => {
                    openExternalLink(DOCS_URL);
                  }}
                >
                  Documentation
                </Button>
              </div>
              <div>
                <Button
                  type='text'
                  className='help-link'
                  onClick={() => {
                    openExternalLink(DOCS_SECURITY_URL);
                  }}
                >
                  Security
                </Button>
              </div>
              <div>
                <Button
                  type='text'
                  className='help-link'
                  onClick={() => {
                    openExternalLink(SUPPORT_URL);
                  }}
                >
                  Support
                </Button>
              </div>
              <div>
                <Button
                  type='text'
                  className='help-link'
                  onClick={() => {
                    openExternalLink(TWITTER_URL);
                  }}
                >
                  @getpostman
                </Button>
              </div>
            </div>

          </div>

          <div className='user-welcome__right-section'>
            <Tabs
              type='primary'
              defaultActive={TABS.DOCS_TAB}
              activeRef={this.state.activeTab}
              onChange={this.handleTabSelect}
            >
              <Tab refKey={TABS.DOCS_TAB}>Create something new</Tab>
              <Tab refKey={TABS.ACTIVITY_TAB}>Continue where you left off</Tab>
            </Tabs>
            {
              this.state.activeTab === TABS.DOCS_TAB && <XFlowGettingStarted />
            }
            {
              this.state.activeTab === TABS.ACTIVITY_TAB &&
                (
                  <XFlowActivityList
                    activityList={this.state.activityList}
                    onClose={this.handleClose}
                  />
                )
            }
          </div>
        </ModalContent>
      </Modal>
    );
  }
}
