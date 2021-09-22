import classNames from 'classnames';

/**
 * Course rating modal.
 */
import PropTypes from 'prop-types';

import React from 'react';
import CourseRatingIconsAccessible from 'bundles/content-feedback/components/rating/CourseRatingIconsAccessible';
import FeedbackEditor from 'bundles/content-feedback/components/FeedbackEditor';
import RatingFeedback from 'bundles/content-feedback/models/RatingFeedback';
import CMLUtils from 'bundles/cml/utils/CMLUtils';
import Modal from 'bundles/phoenix/components/Modal';
import { FormattedHTMLMessage } from 'js/lib/coursera.react-intl';
import _t from 'i18n!nls/content-feedback';
import CourseRatingHeader from './CourseRatingHeader';
import 'css!./__styles__/CourseRatingModal';

class CourseRatingModal extends React.Component {
  static propTypes = {
    course: PropTypes.object.isRequired,
    ratingFeedback: PropTypes.instanceOf(RatingFeedback).isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onClear: PropTypes.func.isRequired,
  };

  constructor(props: $TSFixMe, context: $TSFixMe) {
    super(props, context);
    const { ratingFeedback } = props;
    const { comment, value } = ratingFeedback;

    this.state = { comment: comment || CMLUtils.create(), value };
  }

  handleChange = (comment: $TSFixMe) => {
    this.setState(() => ({ comment }));
  };

  handleSubmit = () => {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'onSubmit' does not exist on type 'Readon... Remove this comment to see the full error message
    this.props.onSubmit(this.state.value, this.state.comment);
  };

  handleClear = () => {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'onClear' does not exist on type 'Readonl... Remove this comment to see the full error message
    this.props.onClear();
  };

  handleSelect = (value: $TSFixMe) => {
    this.setState(() => ({ value }));
  };

  render() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'value' does not exist on type 'Readonly<... Remove this comment to see the full error message
    const allowSubmit = this.state.value !== 0;

    const submitClasses = classNames('teach-btn', 'teach-btn-primary', 'c-course-rating-submit', {
      disabled: !allowSubmit,
    });

    const clearClasses = classNames('c-course-rating-clear', 'teach-btn', 'teach-btn-dark');

    return (
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'onClose' does not exist on type 'Readonl... Remove this comment to see the full error message
      <Modal className="rc-CourseRatingModal" modalName={_t('Rate this course')} handleClose={this.props.onClose}>
        {/* @ts-expect-error ts-migrate(2339) FIXME: Property 'course' does not exist on type 'Readonly... Remove this comment to see the full error message */}
        <CourseRatingHeader catalogPCourse={this.props.course} />

        <h3>{_t('Your review')}</h3>

        <CourseRatingIconsAccessible
          size="large"
          readOnly={false}
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'value' does not exist on type 'Readonly<... Remove this comment to see the full error message
          value={this.state.value}
          // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
          onClear={this.handleClear}
          onSelect={this.handleSelect}
          radioName="course-rating-modal"
        />

        <FeedbackEditor
          isFocused={true}
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'comment' does not exist on type 'Readonl... Remove this comment to see the full error message
          cml={this.state.comment}
          placeholder={_t('Write your review (optional)')}
          onChange={this.handleChange}
        />

        <div className="footer-container">
          <div className="body-1-text c-course-rating-disclaimer">
            <FormattedHTMLMessage
              message={_t(
                `By clicking Submit, I agree that my feedback may be viewed by the Coursera community,
                in compliance with the Coursera <a href="https://www.coursera.org/about/terms" target="_blank">
                Terms of Use</a> and My Profile privacy settings.`
              )}
            />
          </div>

          <div className="submit-container horizontal-box">
            {/* @ts-expect-error ts-migrate(2339) FIXME: Property 'ratingFeedback' does not exist on type '... Remove this comment to see the full error message */}
            {!!this.props.ratingFeedback.value && (
              <button title={_t('Remove course review')} className={clearClasses} onClick={this.handleClear}>
                {_t('Clear')}
              </button>
            )}

            <button
              title={_t('Submit course review')}
              className={submitClasses}
              onClick={this.handleSubmit}
              disabled={!allowSubmit}
            >
              {_t('Submit')}
            </button>
          </div>
        </div>
      </Modal>
    );
  }
}

export default CourseRatingModal;
