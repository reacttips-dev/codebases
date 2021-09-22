/**
 * Course rating UI and interface with Flux actions.
 */
import React from 'react';
import PropTypes from 'prop-types';

import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import FeedbackComplete from 'bundles/content-feedback/components/FeedbackComplete';
import { postMyCourseRating } from 'bundles/content-feedback/actions/CourseRatingActions';
import CMLUtils from 'bundles/cml/utils/CMLUtils';
import { FormattedHTMLMessage } from 'js/lib/coursera.react-intl';
import connectToStores from 'vendor/cnpm/fluxible.v0-4/addons/connectToStores';
import { Tooltip, OverlayTrigger } from 'react-bootstrap-33';
import RatingFeedback from 'bundles/content-feedback/models/RatingFeedback';
import _t from 'i18n!nls/content-feedback';
import CourseRatingModal from './CourseRatingModal';
import CourseRatingIcons from './CourseRatingIcons';
import CourseSurveyModal from './CourseSurveyModal';

class CourseRatingContent extends React.Component {
  static propTypes = {
    course: PropTypes.object.isRequired,
    ratingFeedback: PropTypes.instanceOf(RatingFeedback),
  };

  static contextTypes = {
    executeAction: PropTypes.func.isRequired,
    track: PropTypes.func.isRequired,
  };

  state = {
    showModal: false,
    showSurveyModal: false,
    showMessage: false,
    message: '',
  };

  handleClick = (evt: $TSFixMe) => {
    const { track } = this.context;

    evt.preventDefault();
    track('click.rating');

    this.setState({
      showModal: true,
    });
  };

  handleClose = () => {
    const { track } = this.context;
    track('click.cancel');

    this.setState({
      showModal: false,
    });
  };

  handleSubmit = (value: $TSFixMe, comment: $TSFixMe) => {
    const { track, executeAction } = this.context;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'course' does not exist on type 'Readonly... Remove this comment to see the full error message
    const { course } = this.props;
    const { courseId, courseName } = this.getCourseNameAndId(course);

    this.setState({
      showModal: false,
      showSurveyModal: true,
      showMessage: true,
      message: (
        <FormattedHTMLMessage
          message={_t('Your review of <strong>{courseName}</strong> has been submitted.')}
          courseName={courseName}
        />
      ),
    });

    executeAction(postMyCourseRating, {
      courseId,
      value,
      active: true,
      comment,
    });
    track('click.submit', {
      feedback_length: CMLUtils.getLength(comment),
      feedback_value: value,
    });
  };

  handleClear = () => {
    const { track, executeAction } = this.context;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'course' does not exist on type 'Readonly... Remove this comment to see the full error message
    const { course } = this.props;
    const { courseId, courseName } = this.getCourseNameAndId(course);

    this.setState({
      showModal: false,
      showMessage: true,
      message: (
        <FormattedHTMLMessage
          message={_t('Your review of <strong>{courseName}</strong> has been removed.')}
          courseName={courseName}
        />
      ),
    });

    executeAction(postMyCourseRating, {
      courseId,
      value: 0,
      active: false,
      comment: CMLUtils.create(''),
    });

    track('click.clear');
  };

  handleMessageTimeout = () => {
    this.setState({
      showMessage: false,
    });
  };

  handleSurveyContinue = () => {
    const { track } = this.context;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'user' does not exist on type 'Readonly<{... Remove this comment to see the full error message
    const { user, course } = this.props;
    const { courseId } = this.getCourseNameAndId(course);
    const surveyLink = `https://www.surveymonkey.com/r/3N5SQ3L?externalUserId=${user.external_id}&courseId=${courseId}`;

    this.setState({
      showSurveyModal: false,
    });

    window.open(surveyLink, '_blank');

    track('survey_modal.click.continue', {
      user_id: user.external_id,
    });
  };

  handleSurveyClose = () => {
    const { track } = this.context;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'user' does not exist on type 'Readonly<{... Remove this comment to see the full error message
    const { user } = this.props;

    this.setState({
      showSurveyModal: false,
    });

    track('survey_modal.click.close', {
      user_id: user.external_id,
    });
  };

  getCourseNameAndId(course: $TSFixMe) {
    const isCatalogPCourse = !!course.get;
    return {
      courseId: isCatalogPCourse ? course.get('id') : course.id,
      courseName: isCatalogPCourse ? course.get('name') : course.name,
    };
  }

  render() {
    const { showModal, showMessage, message, showSurveyModal } = this.state;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'course' does not exist on type 'Readonly... Remove this comment to see the full error message
    const { course, ratingFeedback } = this.props;
    const tooltipMessage = _t('Rate this course');
    const tooltip = <Tooltip>{tooltipMessage}</Tooltip>;
    const isGuidedProject = course?.courseTypeMetadata?.isGuidedProject;

    if (!ratingFeedback) {
      return <div />;
    }

    return (
      <div className="rc-CourseRatingContent">
        <OverlayTrigger placement="top" overlay={tooltip}>
          <button
            ref="icons"
            type="button"
            className="c-course-rating-icons-container nostyle button-link"
            onClick={this.handleClick}
            aria-label={_t('Rate this course')}
          >
            <CourseRatingIcons value={ratingFeedback.value} />
          </button>
        </OverlayTrigger>

        {showModal && (
          <CourseRatingModal
            {...this.props}
            onSubmit={this.handleSubmit}
            onClear={this.handleClear}
            onClose={this.handleClose}
          />
        )}

        {showSurveyModal && (
          <CourseSurveyModal
            onContinue={this.handleSurveyContinue}
            onClose={this.handleSurveyClose}
            shouldTakeSurvey={!isGuidedProject}
          />
        )}

        <CSSTransitionGroup transitionName="fade" transitionEnterTimeout={500} transitionLeaveTimeout={500}>
          {showMessage && (
            <FeedbackComplete key="feedback-complete" onTimeout={this.handleMessageTimeout}>
              {message}
            </FeedbackComplete>
          )}
        </CSSTransitionGroup>
      </div>
    );
  }
}

export default connectToStores(
  CourseRatingContent,
  ['ApplicationStore', 'CourseRatingStore'],
  ({ ApplicationStore, CourseRatingStore }, props) => ({
    ratingFeedback: CourseRatingStore.getMyRatingFeedback(),
    user: ApplicationStore.getUserData(),
  })
);

export const BaseComp = CourseRatingContent;
