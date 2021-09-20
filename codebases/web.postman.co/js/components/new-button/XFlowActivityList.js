import React, { Component } from 'react';
import { Button } from '../base/Buttons';
import DateHelper from '@postman/date-helper';
import NavigationService from '../../services/NavigationService';
import { OPEN_CREATE_NEW_IDENTIFIER } from '../../../onboarding/navigation/constants';


export default class XFlowActivityList extends Component {
  constructor (props) {
    super(props);
  }

  getTypeText (type) {
    switch (type) {
      case 'mock':
        return 'Mock created';
      case 'monitor':
        return 'Monitor created';
      case 'documentation':
        return 'Documentation created';
      case 'template':
        return 'Template imported';
    }
  }

  handleNextSteps (activityState) {

    switch (activityState.type) {
      case 'mock':
        pm.mediator.trigger('openCreateNewMockModal', {
          ...activityState.nextStepState,
          activeStep: 3
        });
        break;
      case 'monitor':
        pm.mediator.trigger('openCreateNewMonitorModal', {
          ...activityState.nextStepState,
          activeStep: 3
        });
        break;
      case 'documentation':
        pm.mediator.trigger('openCreateNewDocumentationModal', {
          ...activityState.nextStepState,
          activeStep: 3
        });
        break;
      case 'template':
        pm.mediator.trigger('showCustomizeTemplateContainer', null, activityState.nextStepState);
        break;
    }
    this.props.onClose();
  }

  render () {
    return (
      <div className='activity-feed-list'>
        <div className='timeline'>
        {
          _.isEmpty(this.props.activityList) ?
            (
              <div>
                <span>There’s nothing here. </span>
                <Button
                  type='text'
                  size='small'
                  className='learn-more-link'
                  onClick={() => {
                    NavigationService.transitionTo(OPEN_CREATE_NEW_IDENTIFIER);
                    this.props.onClose();
                  }}
                >
                  Get started with Postman
                </Button>
              </div>
            ) :
          _.map(this.props.activityList, (activity, index) => {
            return (
              <div key={index} className='activity-feed-list-item'>
                <div>
                  <div className='activity-feed-list-item--header'>
                    <span className='activity-feed-list-item--name'>{_.truncate(_.get(activity, 'nextStepState.selectedOptions.name'), { length: 30 })}</span>
                    <span>{` ${this.getTypeText(activity.type)}`}</span>
                  </div>
                  <div className='activity-feed-list-item--date'>{_.upperFirst(DateHelper.getFormattedDate(activity.createdAt))}</div>
                </div>
                <Button
                  type='primary'
                  size='small'
                  onClick={this.handleNextSteps.bind(this, activity)}
                >
                  View Next Steps
                </Button>
              </div>
            );
          })
        }
        </div>
      </div>
    );
  }
}
