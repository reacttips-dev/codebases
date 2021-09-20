import React, { Component } from 'react';
import LoadingIndicator from '../base/LoadingIndicator';
import { Button } from '../base/Buttons';
import CollectionIcon from '../base/Icons/CollectionIcon';
import EnvironmentIcon from '../base/Icons/EnvironmentIcon';
import MonitorIcon from '../base/Icons/MonitorIcon';
import MockIcon from '../base/Icons/MockIcon';
import CreationError from './CreationError';
import { openExternalLink } from '@postman-app-monolith/renderer/js/external-navigation/ExternalNavigationService';

import {
  COLLECTION_DOCS,
  SAVE_REQUEST_DOCS,
  ENVIRONMENT_DOCS,
  MOCK_DOCS,
  MONITORING_DOCS
} from '../../constants/AppUrlConstants';

export default class FinishTemplate extends Component {
  constructor (props) {
    super(props);

    this.renderCollectionCard = this.renderCollectionCard.bind(this);
    this.renderEnvironmentCard = this.renderEnvironmentCard.bind(this);
    this.renderMonitorCard = this.renderMonitorCard.bind(this);
    this.renderMockCard = this.renderMockCard.bind(this);
  }

  openLink (url) {
    url && openExternalLink(url);
  }

  renderCollectionCard (templateData) {
    return (
      <div className='finish-template__card finish-template__card--collection'>
        <div className='finish-template__card__left'>
          <div className='finish-template__card__left__icon'>
            <CollectionIcon
              className='finish-template__card__left__icon__icon'
              size='lg'
            />
          </div>
          <div className='finish-template__card__left__text'>
            <span className='finish-template__card__left__text__title'>
              <b>{ templateData.name }</b>
              <span> collection created</span>
            </span>
            <div className='finish-template__card__left__text__text'>
              <span>A collection is a group of requests. </span>
              <Button
                className='learn-more-link'
                type='text'
                onClick={this.openLink.bind(this, COLLECTION_DOCS)}
              >
                Learn more
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderEnvironmentCard (templateData) {
    return (
      <div className='finish-template__card finish-template__card--environment'>
        <div className='finish-template__card__left'>
          <div className='finish-template__card__left__icon'>
            <EnvironmentIcon
              className='finish-template__card__left__icon__icon'
              size='lg'
            />
          </div>
          <div className='finish-template__card__left__text'>
            <span className='finish-template__card__left__text__title'>
              <b>{ templateData.name }</b>
              <span> environment created</span>
            </span>
            <div className='finish-template__card__left__text__text'>
              <span>An environment is a group of variables. </span>
              <Button
                className='learn-more-link'
                type='text'
                onClick={this.openLink.bind(this, ENVIRONMENT_DOCS)}
              >
                Learn more
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderMonitorCard (templateData) {
    return (
      <div className='finish-template__card finish-template__card--monitor'>
        <div className='finish-template__card__left'>
          <div className='finish-template__card__left__icon'>
            <MonitorIcon
              className='finish-template__card__left__icon__icon'
              size='lg'
            />
          </div>
          <div className='finish-template__card__left__text'>
            <span className='finish-template__card__left__text__title'>
              <b>{ templateData.name }</b>
              <span> monitor created</span>
            </span>
            <div className='finish-template__card__left__text__text'>
              <span>A monitor runs at a schedule to check API performance. </span>
              <Button
                className='learn-more-link'
                type='text'
                onClick={this.openLink.bind(this, MONITORING_DOCS)}
              >
                Learn more
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderMockCard (templateData) {
    return (
      <div className='finish-template__card finish-template__card--mock'>
        <div className='finish-template__card__left'>
          <div className='finish-template__card__left__icon'>
            <MockIcon
              className='finish-template__card__left__icon__icon'
              size='lg'
            />
          </div>
          <div className='finish-template__card__left__text'>
            <span className='finish-template__card__left__text__title'>
              <b>{ templateData.name }</b>
              <span> mock server created</span>
            </span>
            <div className='finish-template__card__left__text__text'>
              <span>A mock server responds with sample responses, without an actual backend </span>
              <Button
                className='learn-more-link'
                type='text'
                onClick={this.openLink.bind(this, MOCK_DOCS)}
              >
                Learn more
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderCollectionNextSteps () {
    return (
      <div className='finish-template__card__right'>
        <div className='finish-template__card__right__next'>
          <span>
            Add more requests to this collection
          </span>
        </div>

        <div className='finish-template__card__right__description'>
          <span>
            Save new requests to this collection in the Postman app.&nbsp;
          </span>
          <Button
            type='text'
            onClick={this.openLink.bind(this, SAVE_REQUEST_DOCS)}
          >
            Learn how
          </Button>
        </div>
      </div>
    );
  }

  renderEnvironmentNextSteps () {
    return (
      <div className='finish-template__card__right'>
        <div className='finish-template__card__right__next'>
          <span>
            Change the variable values
          </span>
        </div>

        <div className='finish-template__card__right__description'>
          <span>Customize the template by changing the variable values in the environment. </span>
          <Button
            type='text'
            onClick={this.openLink.bind(this, ENVIRONMENT_DOCS)}
          >
            Learn how
          </Button>
        </div>
      </div>
    );
  }

  renderMonitorNextSteps () {
    let monitorDashboardURL = `${window.postman_monitors_url}?type=private`;

    return (
      <div className='finish-template__card__right'>
        <div className='finish-template__card__right__next'>
          <span>
            Check monitor results
          </span>
        </div>

        <div className='finish-template__card__right__description'>
          <span>
            The result of your monitors can be seen at&nbsp;
          </span>
          <Button
            type='text'
            onClick={this.openLink.bind(this, monitorDashboardURL)}
          >
            <span>{ window.postman_monitors_url}</span>
          </Button>
        </div>
      </div>
    );
  }

  renderMockNextSteps () {
    return (
      <div className='finish-template__card__right'>
        <div className='finish-template__card__right__next'>
          <span>
            Send a request to this mock server
          </span>
        </div>
        <div className='finish-template__card__right__description'>
          <Button
            type='text'
            onClick={this.openLink.bind(this, MOCK_DOCS)}
          >
            <span>Learn More</span>
          </Button>
          <span>
            &nbsp;about mock servers&nbsp;
          </span>

        </div>
      </div>
    );
  }

  render () {
    let { templateData } = this.props;
    return (
      <div className='finish-template'>
        <div className='finish-template__title'>
          {
            (this.props.lifecycle === 'view' || this.props.lifecycle === 'use') &&
              <div>
                The <b>{this.props.templateData.name}</b> template is being imported. Please wait for a few seconds.
              </div>
          }
          {
            this.props.lifecycle === 'success' &&
              <div>
                The <b>{this.props.templateData.name}</b> template has been imported! As part of the template, the following things have been created.
              </div>
          }
        </div>
        {
          this.props.lifecycle === 'use' &&
            <LoadingIndicator />
        }
        {
          this.props.lifecycle === 'failure' &&
            <div className='finish-template'>
              <CreationError
                subtitle='Something went wrong while importing this template. You can try again later.'
                onRetry={this.props.onRetry}
              />
            </div>
        }
        {
          this.props.lifecycle === 'success' &&
          <div className='finish-template__cards'>
            { this.renderCollectionCard(this.props.templateData) }
            { templateData.environment && this.renderEnvironmentCard(this.props.templateData) }
            { templateData.monitor && this.renderMonitorCard(this.props.templateData) }
            { templateData.mock && this.renderMockCard(this.props.templateData) }
            <div className='separator'>
              NEXT STEPS
              <div className='separator-line' />
            </div>
            { this.renderCollectionNextSteps() }
            { templateData.environment && this.renderEnvironmentNextSteps() }
            { templateData.monitor && this.renderMonitorNextSteps() }
            { templateData.mock && this.renderMockNextSteps() }
          </div>
        }
      </div>
    );
  }
}
