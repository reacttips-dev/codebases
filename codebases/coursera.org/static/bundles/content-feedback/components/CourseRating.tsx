/**
 * Course Rating.
 */
import PropTypes from 'prop-types';

import React from 'react';

// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'bund... Remove this comment to see the full error message
import userIdentity from 'bundles/phoenix/template/models/userIdentity';
import { receiveMyCourseRating } from 'bundles/content-feedback/actions/CourseRatingActions';
import CourseRatingApp from 'bundles/content-feedback/CourseRatingApp';
import Retracked from 'js/lib/retracked';
// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'vend... Remove this comment to see the full error message
import FluxibleComponent from 'vendor/cnpm/fluxible.v0-4/addons/FluxibleComponent';
import RatingFeedback from 'bundles/content-feedback/models/RatingFeedback';
import CourseRatingContent from './rating/CourseRatingContent';
import 'css!./__styles__/CourseRating';

class CourseRating extends React.Component {
  static propTypes = {
    course: PropTypes.object.isRequired,
    ratingFeedback: PropTypes.instanceOf(RatingFeedback).isRequired,
  };

  static contextTypes = {
    executeAction: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.context.executeAction(receiveMyCourseRating, {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'ratingFeedback' does not exist on type '... Remove this comment to see the full error message
      ratingFeedback: this.props.ratingFeedback,
    });
  }

  render() {
    if (!userIdentity.get('authenticated')) {
      return null;
    }

    return (
      <div className="rc-CourseRating">
        {/* @ts-expect-error ts-migrate(2322) FIXME: Type '{ course: any; }' is not assignable to type ... Remove this comment to see the full error message */}
        <CourseRatingContent course={this.props.course} />
      </div>
    );
  }
}

class TrackedCourseRating extends React.Component {
  static propTypes = {
    course: PropTypes.object.isRequired,
    ratingFeedback: PropTypes.instanceOf(RatingFeedback).isRequired,
  };

  static childContextTypes = {
    track: PropTypes.func,
  };

  getChildContext() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'course' does not exist on type 'Readonly... Remove this comment to see the full error message
    const { course } = this.props;
    const courseId = course.get ? course.get('id') : course.id;
    return {
      // NOTE: This is a legacy usage of `makeTracker` API to support rendering this component
      // inside a Backbone view. Please do not copy this usage going forward.
      track: Retracked.makeTracker({
        namespace: 'content_learner.rating_course',
        include: {
          course_id: courseId,
        },
      }),
    };
  }

  render() {
    return <CourseRating {...this.props} />;
  }
}

class FluxibleCourseRating extends React.Component {
  componentWillMount() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'fluxibleContext' does not exist on type ... Remove this comment to see the full error message
    this.fluxibleContext = CourseRatingApp.createContext();
  }

  render() {
    return (
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'fluxibleContext' does not exist on type ... Remove this comment to see the full error message
      <FluxibleComponent context={this.fluxibleContext.getComponentContext()}>
        <TrackedCourseRating {...this.props} />
      </FluxibleComponent>
    );
  }
}

export default FluxibleCourseRating;
