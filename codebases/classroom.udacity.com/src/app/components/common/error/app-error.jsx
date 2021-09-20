import AuthService from 'services/authentication-service';
import PropTypes from 'prop-types';
import React from 'react';
import { __ } from 'services/localization-service';
import styles from './app-error.scss';

const LINK_TO_SUPPORT = 'https://udacity.zendesk.com/hc/en-us/requests/new';
const LINK_TO_STATUS = 'https://status.udacity.com/';

// TODO: Actually localize these strings
const LOCALIZED = {
  TITLE: 'The Classroom is temporarily unavailable.',
  YOU_CAN_CHECK:
    'You can check if there is a known outage or maintenance window at <%= link %>',
  IF_NO_ISSUE:
    'If there is no issue listed, you can try refreshing your browser or contacting ',
  WE_APOLOGIZE: 'We apologize for the inconvenience.',
};

@cssModule(styles)
export default class GeneralError extends React.Component {
  static propTypes = {
    error: PropTypes.object,
  };

  _createError = (err = {}) => {
    let error = {
      explanation: __('An unrecognized error occurred.'),
      timestamp: Date(),
    };

    const status = _.get(err, 'privateDetails.status', err.status);
    if (status === 0) {
      error.explanation = __('The network request was aborted.');
      return error;
    }

    if (err instanceof Error) {
      error.explanation = err.message;
      return error;
    }

    if (err.responseJSON) {
      error.explanation = err.responseJSON.error || err.responseJSON;
      return error;
    }

    return error;
  };

  _renderSolution = () => {
    return (
      <React.Fragment>
        <p styleName="error-solution">
          {__(
            LOCALIZED.YOU_CAN_CHECK,
            {
              link: `<a target='_blank' rel='noopener noreferrer' href='${LINK_TO_STATUS}'>status.udacity.com</a>`,
            },
            { renderHTML: true }
          )}
        </p>
        <p styleName="error-solution">
          {__(LOCALIZED.IF_NO_ISSUE)}
          &nbsp;
          {__(
            '<%= linkStart %>Udacity Support<%= linkEnd%>',
            {
              linkStart: `<a target='_blank' rel='noopener noreferrer' href="${LINK_TO_SUPPORT}">`,
              linkEnd: '</a>',
            },
            { renderHTML: true }
          )}
        </p>
        <p styleName="error-solution">{__(LOCALIZED.WE_APOLOGIZE)}</p>
      </React.Fragment>
    );
  };

  _renderExplanation = (explanation) => {
    return <p styleName="error-details">{explanation}</p>;
  };

  _renderContext = (timestamp) => {
    const userId = AuthService.getCurrentUserId();
    return (
      <React.Fragment>
        <p styleName="error-details">{timestamp}</p>
        <p styleName="error-details">Student ID {userId}</p>
      </React.Fragment>
    );
  };

  render() {
    const { explanation, timestamp } = this._createError(this.props.error);
    return (
      <div styleName="error">
        <p styleName="error-title">{__(LOCALIZED.TITLE)}</p>
        <div styleName="error-explanation">
          {this._renderSolution()}
          {explanation ? this._renderExplanation(explanation) : ''}
          {timestamp ? this._renderContext(timestamp) : ''}
        </div>
      </div>
    );
  }
}
