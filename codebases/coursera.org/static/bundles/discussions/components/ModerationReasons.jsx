import _t from 'i18n!nls/discussions';
import PropTypes from 'prop-types';
import React from 'react';
import 'css!bundles/discussions/components/__styles__/ModerationReasons';

class ModerationReasons extends React.Component {
  static propTypes = {
    handleSelect: PropTypes.func.isRequired,
  };

  render() {
    return (
      <div className="rc-ModerationReasons">
        <ul className="c-radio-group">
          <li>
            <input
              id="honorCodeViolation"
              type="radio"
              value="honorCodeViolation"
              name="reason"
              ref="firstOption"
              onClick={this.props.handleSelect}
            />
            <label htmlFor="honorCodeViolation" className="c-radio-label">
              {_t('Removing an ')}
              <a target="_blank" href="https://learner.coursera.help/hc/articles/208280036">
                {_t('Honor Code')}
              </a>
              {_t(' violation (e.g., problem solutions)')}
            </label>
          </li>
          <li>
            <input
              id="inappropriate"
              type="radio"
              value="inappropriate"
              name="reason"
              onClick={this.props.handleSelect}
            />
            <label htmlFor="inappropriate" className="c-radio-label">
              {_t('Removing ')}
              <a target="_blank" href="https://learner.coursera.help/hc/articles/209818863">
                {_t('Inappropriate Content')}
              </a>
              {_t(' violation (e.g., obscenities or mature content)')}
            </label>
          </li>
          <li>
            <input
              id="copyrightViolation"
              type="radio"
              value="copyrightViolation"
              name="reason"
              onClick={this.props.handleSelect}
            />
            <label htmlFor="copyrightViolation" className="c-radio-label">
              {_t('Removing a copyright violation')}
            </label>
          </li>
          <li>
            <input id="spam" type="radio" value="spam" name="reason" onClick={this.props.handleSelect} />
            <label htmlFor="spam" className="c-radio-label">
              {_t('Removing spam (e.g. unintelligible content or advertisements)')}
            </label>
          </li>
          <li>
            <input id="clarity" type="radio" value="clarity" name="reason" onClick={this.props.handleSelect} />
            <label htmlFor="clarity" className="c-radio-label">
              {_t('Editing for clarity')}
            </label>
          </li>
        </ul>
      </div>
    );
  }
}

export default ModerationReasons;
