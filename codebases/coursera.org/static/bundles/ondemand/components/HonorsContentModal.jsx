import PropTypes from 'prop-types';
import React from 'react';
import { setHonorsUserPreferences } from 'bundles/ondemand/actions/HonorsUserPreferencesActions';
import HonorsModal from 'bundles/ondemand/components/HonorsModal';
import waitForStores from 'bundles/phoenix/lib/waitForStores';
import { Checkbox } from '@coursera/coursera-ui';
import _t from 'i18n!nls/ondemand';
import 'css!bundles/ondemand/components/__styles__/HonorsContentModal';

/**
 * Modal for accessing an Honors item.
 * Can be hidden permanently through user preferences.
 */
class HonorsContentModal extends React.Component {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    onContinue: PropTypes.func.isRequired,
    authenticated: PropTypes.bool,
    honorsUserPreferencesWithThisCourseSkipped: PropTypes.object,
    onLeave: PropTypes.func,
  };

  static contextTypes = {
    executeAction: PropTypes.func.isRequired,
  };

  state = {
    disableModalChecked: false,
  };

  handleContinue = () => {
    const { authenticated, onContinue } = this.props;

    if (this.state.disableModalChecked) {
      const updatedHonorsUserPreferences = this.props.honorsUserPreferencesWithThisCourseSkipped;
      this.context.executeAction(setHonorsUserPreferences, {
        authenticated,
        updatedHonorsUserPreferences,
      });
    }

    onContinue();
  };

  handleCloseModal = () => {
    this.props.onClose();
  };

  handleLeave = () => {
    this.props.onLeave();
  };

  handleCheckboxChange = () => {
    this.setState(({ disableModalChecked }) => ({ disableModalChecked: !disableModalChecked }));
  };

  render() {
    const modalContent = (
      <div className="rc-HonorsContentModal body-1-text vertical-box">
        <p>{_t("You're accessing Honors content. Here's what you need to know:")}</p>
        <ol>
          <li>
            {_t(
              `
              You can earn Honors Recognition by completing all required assignments in the course and all Honors
              assignments.
            `
            )}
          </li>
          <li>{_t('Honors assignments are not required to pass the course.')}</li>
          <li>{_t('Your performance on Honors assignments will not affect your course grade.')}</li>
        </ol>
        <div className="horizontal-box honors-buttons">
          <div className="flex-1 align-self-center horizontal-box align-items-vertical-center">
            <Checkbox
              checked={this.state.disableModalChecked}
              id="disable-modal"
              onChange={this.handleCheckboxChange}
              ariaLabel={_t('Disable Honors Content modal? I understand. Please don’t show again.')}
            />
            <span className="caption-text color-secondary-text checkbox-label">
              {_t("I understand. Please don't show again.")}
            </span>
          </div>
          {!!this.props.onLeave && (
            <button type="button" className="secondary cozy" onClick={this.handleLeave}>
              {_t('Leave Honors Content')}
            </button>
          )}
          <button type="button" className="primary cozy" onClick={this.handleContinue}>
            {_t('Continue')}
          </button>
        </div>
      </div>
    );

    return <HonorsModal onClose={this.handleCloseModal} title={_t('Honors Content')} content={modalContent} />;
  }
}

export default waitForStores(
  HonorsContentModal,
  ['ApplicationStore', 'CourseStore', 'HonorsUserPreferencesStore'],
  ({ ApplicationStore, CourseStore, HonorsUserPreferencesStore }, props) => {
    const courseId = CourseStore.getCourseId();

    return {
      honorsUserPreferencesWithThisCourseSkipped: HonorsUserPreferencesStore.getUserPreferencesWithSkippedCourseId(
        courseId
      ),
      authenticated: ApplicationStore.isAuthenticatedUser(),
    };
  }
);
