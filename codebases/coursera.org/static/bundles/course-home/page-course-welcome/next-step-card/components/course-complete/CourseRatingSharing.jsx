/**
 * Copy of the file here: static/bundles/content-feedback/components/CourseRating.jsx,
 * duplicated for the ShareCertificateOnCompletion A/B experiment. Link to the experiment:
 * https://coursera.atlassian.net/browse/GR-22412
 */
import PropTypes from 'prop-types';

import React from 'react';

import userIdentity from 'bundles/phoenix/template/models/userIdentity';
import { receiveMyCourseRating } from 'bundles/content-feedback/actions/CourseRatingActions';
import CourseRatingApp from 'bundles/content-feedback/CourseRatingApp';
import Retracked from 'js/lib/retracked';
import FluxibleComponent from 'vendor/cnpm/fluxible.v0-4/addons/FluxibleComponent';
import RatingFeedback from 'bundles/content-feedback/models/RatingFeedback';
import CourseRatingContentSharing from 'bundles/course-home/page-course-welcome/next-step-card/components/course-complete/CourseRatingContentSharing';

class CourseRatingSharing extends React.Component {
  static propTypes = {
    course: PropTypes.object.isRequired,
    ratingFeedback: PropTypes.instanceOf(RatingFeedback).isRequired,
  };

  static contextTypes = {
    executeAction: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.context.executeAction(receiveMyCourseRating, {
      ratingFeedback: this.props.ratingFeedback,
    });
  }

  render() {
    if (!userIdentity.get('authenticated')) {
      return null;
    }

    return (
      <span className="rc-CourseRating">
        <CourseRatingContentSharing course={this.props.course} />
      </span>
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
    return <CourseRatingSharing {...this.props} />;
  }
}

class FluxibleCourseRating extends React.Component {
  componentWillMount() {
    this.fluxibleContext = CourseRatingApp.createContext();
  }

  render() {
    return (
      <FluxibleComponent context={this.fluxibleContext.getComponentContext()}>
        <TrackedCourseRating {...this.props} />
      </FluxibleComponent>
    );
  }
}

export default FluxibleCourseRating;
