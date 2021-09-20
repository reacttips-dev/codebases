import React, { Component } from 'react';
import { Button } from '../base/Buttons';
import AnalyticsService from '../../modules/services/AnalyticsService';
import { openExternalLink } from '@postman-app-monolith/renderer/js/external-navigation/ExternalNavigationService';

import {
  COLLECTION_DOCS,
  SHARING_LINK,
  DOCUMENTATION_LINK,
  PUBLISHING_DOCS,
  TESTING_DOCS,
  MONITORING_DOCS,
  MOCK_DOCS
} from '../../constants/AppUrlConstants';

export default class XFlowGettingStarted extends Component {
  constructor (props) {
    super(props);
  }

  handleLink (link, action) {
    openExternalLink(link);
    AnalyticsService.addEvent('onboarding', 'view_documentation_' + action, 'welcome_popup');
  }

  render () {
    return (
      <div className='section__cards'>
        <div className='section__card section__card--collections'>
          <div className='section__card__illustration-container'>
            <div className='section__card__illustration' />
          </div>
          <div className='section__card__text'>
            <span>Organize your API requests into </span>
            <Button
              type='text'
              onClick={this.handleLink.bind(this, COLLECTION_DOCS, 'collections')}
            >
              Collections
            </Button>
            .
          </div>
        </div>

        <div className='section__card section__card--sharing'>
          <div className='section__card__illustration-container'>
            <div className='section__card__illustration' />
          </div>
          <div className='section__card__text'>
            <Button
              type='text'
              onClick={this.handleLink.bind(this, SHARING_LINK, 'sharing')}
            >
              Share your API requests
            </Button>
            <span> with your entire team.</span>
          </div>
        </div>

        <div className='section__card section__card--docs'>
          <div className='section__card__illustration-container'>
            <div className='section__card__illustration' />
          </div>
          <div className='section__card__text'>
            <Button
              type='text'
              onClick={this.handleLink.bind(this, DOCUMENTATION_LINK, 'intro_documentation')}
            >
              Add detailed documentation
            </Button>
            <span> to your APIs and </span>
            <Button
              type='text'
              onClick={this.handleLink.bind(this, PUBLISHING_DOCS, 'public_documentation')}
            >
              publish
            </Button>
            <span> them.</span>
          </div>
        </div>

        <div className='section__card section__card--monitors'>
          <div className='section__card__illustration-container'>
            <div className='section__card__illustration' />
          </div>
          <div className='section__card__text'>
            <Button
              type='text'
              onClick={this.handleLink.bind(this, TESTING_DOCS, 'intro_scripts')}
            >
              Write tests
            </Button>
            <span> for individual requests and </span>
            <Button
              type='text'
              onClick={this.handleLink.bind(this, MONITORING_DOCS, 'intro_monitors')}
            >
              monitor
            </Button>
            <span> their performance.</span>
          </div>
        </div>

        <div className='section__card section__card--mocks'>
          <div className='section__card__illustration-container'>
            <div className='section__card__illustration' />
          </div>
          <div className='section__card__text'>
            <Button
              type='text'
              onClick={this.handleLink.bind(this, MOCK_DOCS, 'intro_mock')}
            >
              Mock your requests
            </Button>
            <span> to simulate endpoints and view potential responses without spinning up a back end.</span>
          </div>
        </div>
      </div>
    );
  }
}
