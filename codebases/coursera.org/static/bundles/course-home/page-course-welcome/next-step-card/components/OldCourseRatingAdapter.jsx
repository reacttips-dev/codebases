import PropTypes from 'prop-types';
import React from 'react';
import { compose } from 'recompose';
import deferToClientSideRender from 'js/lib/deferToClientSideRender';
import RatingFeedback from 'bundles/content-feedback/models/RatingFeedback';
import CoursesV1 from 'bundles/naptimejs/resources/courses.v1';
import MyFeedbackV1 from 'bundles/naptimejs/resources/myFeedback.v1';
import Naptime from 'bundles/naptimejs';
import _ from 'underscore';
import 'css!./__styles__/OldAccomplishmentsAdapter';

const loadOldCourseRating = () => import('bundles/content-feedback/components/CourseRating');

class OldCourseRatingAdapter extends React.Component {
  static propTypes = {
    course: PropTypes.instanceOf(CoursesV1),
    myRatingFeedback: PropTypes.arrayOf(PropTypes.instanceOf(MyFeedbackV1)),
    enrolledCourseIds: PropTypes.arrayOf(PropTypes.string),
  };

  state = {
    CourseRating: undefined,
    ratingFeedback: undefined,
  };

  componentDidMount() {
    const { myRatingFeedback } = this.props;

    this.setState({
      ratingFeedback:
        _(myRatingFeedback).isEmpty() || myRatingFeedback === undefined
          ? new RatingFeedback(0, false)
          : new RatingFeedback(
              myRatingFeedback[0].rating.value,
              myRatingFeedback[0].rating.active,
              myRatingFeedback[0].comments.generic,
              myRatingFeedback[0].timestamp,
              myRatingFeedback[0].id
            ),
    });

    loadOldCourseRating().then((CourseRatingModule) => {
      this.setState({ CourseRating: CourseRatingModule.default });
    });
  }

  render() {
    const { course, enrolledCourseIds } = this.props;

    const { CourseRating, ratingFeedback } = this.state;

    if (enrolledCourseIds && enrolledCourseIds.indexOf(course.id) < 0) {
      return null;
    }

    return (
      <div className="rc-OldCourseRatingAdapter">
        {CourseRating && ratingFeedback && <CourseRating course={course} ratingFeedback={ratingFeedback} />}
      </div>
    );
  }
}

export default compose(
  deferToClientSideRender,
  Naptime.createContainer((props) => {
    if (
      props.enrolledCourseIds &&
      props.enrolledCourseIds.find((enrolledCourseId) => enrolledCourseId === props.course.id)
    ) {
      return {
        myRatingFeedback: MyFeedbackV1.finder('byCourseAndFeedback', {
          params: {
            courseIds: [props.course.id],
            feedbackSystem: 'STAR',
          },
        }),
      };
    } else {
      return {
        myRatingFeedback: [],
      };
    }
  })
)(OldCourseRatingAdapter);
