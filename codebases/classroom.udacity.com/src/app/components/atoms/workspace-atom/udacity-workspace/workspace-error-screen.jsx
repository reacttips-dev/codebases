import {
  isBounceRedirectError,
  isPollingTimeoutError,
  isTooManyStarsError,
  isWorkspaceError,
} from 'errors/workspace-error';

import AuthService from 'services/authentication-service';
import { IconWarning } from '@udacity/veritas-icons';
import PropTypes from 'prop-types';
import React from 'react';
import { __ } from 'services/localization-service';
import styles from './workspace-error-screen.scss';

const CONTACT_SUPPORT = 'CONTACT_SUPPORT';
const REFRESH_BROWSER = 'REFRESH_BROWSER';
const ENABLE_COOKIES = 'ENABLE_COOKIES';
const SUPPORT_REQ_LINK = 'https://udacity.zendesk.com/hc/en-us/requests/new';
const HOW_TO_ENABLE_COOKIES_LINK =
  'https://udacity.zendesk.com/hc/en-us/articles/115004653246';

@cssModule(styles)
export default class WorkspaceErrorScreen extends React.Component {
  static propTypes = {
    error: PropTypes.object.isRequired,
  };

  _fixByRefreshBrowser = () => {
    return (
      <span>
        {__(
          'Please refresh the page. If the problem persists, then contact support.'
        )}
        &nbsp;
        {__(
          '<%= linkStart %>Udacity Support<%= linkEnd%>',
          { linkStart: `<a href="${SUPPORT_REQ_LINK}">`, linkEnd: '</a>' },
          { renderHTML: true }
        )}
      </span>
    );
  };

  _fixByContactSupport = () => {
    return (
      <span>
        {__('Please contact support and try again at a later time.')}
        &nbsp;
        {__(
          '<%= linkStart %>Udacity Support<%= linkEnd%>',
          { linkStart: `<a href="${SUPPORT_REQ_LINK}">`, linkEnd: '</a>' },
          { renderHTML: true }
        )}
      </span>
    );
  };

  _fixByEnableCookies = () => {
    return (
      <span>
        {__(
          'This can occur if you have blocked third party cookies in your browser. For detailed instructions on how to fix this error follow the link below.'
        )}
        &nbsp;
        {__(
          '<%= linkStart %>How To Enable Third Party Cookies For Workspaces<%= linkEnd%>',
          {
            linkStart: `<a href="${HOW_TO_ENABLE_COOKIES_LINK}">`,
            linkEnd: '</a>',
          },
          { renderHTML: true }
        )}
      </span>
    );
  };

  _createError = (resp = {}) => {
    let error = {
      solution: REFRESH_BROWSER,
      explanation: __('An unrecognized error occurred.'),
      timestamp: Date(),
    };

    const status = _.get(resp, 'privateDetails.status', resp.status);
    if (status === 0) {
      error.explanation = __('The network request was aborted.');
      return error;
    }

    if (isWorkspaceError(resp)) {
      const { timestamp, message } = resp;
      error.timestamp = timestamp;
      error.explanation = message;

      if (isPollingTimeoutError(resp)) {
        error.solution = CONTACT_SUPPORT;
      }
      if (isBounceRedirectError(resp)) {
        error.solution = ENABLE_COOKIES;
      }
      if (isTooManyStarsError(resp)) {
        error.solution = REFRESH_BROWSER;
      }
      return error;
    }

    if (resp instanceof Error) {
      error.explanation = resp.message;
      return error;
    }

    if (resp.responseJSON) {
      error.explanation = resp.responseJSON.error || resp.responseJSON;
      return error;
    }

    return error;
  };

  _getSolution = (solution) => {
    switch (solution) {
      case CONTACT_SUPPORT:
        return this._fixByContactSupport();
      case ENABLE_COOKIES:
        return this._fixByEnableCookies();
      case REFRESH_BROWSER:
      default:
        return this._fixByRefreshBrowser();
    }
  };

  _renderSolution = (solution) => {
    return <p styleName="error-solution">{this._getSolution(solution)}</p>;
  };

  _renderExplanation = (explanation) => {
    return <p styleName="error-details">{explanation}</p>;
  };

  _renderContext = (timestamp) => {
    const userId = AuthService.getCurrentUserId();
    return (
      <p styleName="error-details">
        {timestamp} {userId}
      </p>
    );
  };

  render() {
    const { solution, explanation, timestamp } = this._createError(
      this.props.error
    );
    return (
      <div styleName="error">
        <IconWarning size="md" title={__('Oops!')} color="red" />
        <p styleName="error-title">
          {__('We are unable to load your Workspace.')}
        </p>
        <div styleName="error-explanation">
          {solution ? this._renderSolution(solution) : ''}
          {explanation ? this._renderExplanation(explanation) : ''}
          {timestamp ? this._renderContext(timestamp) : ''}
        </div>
      </div>
    );
  }
}
