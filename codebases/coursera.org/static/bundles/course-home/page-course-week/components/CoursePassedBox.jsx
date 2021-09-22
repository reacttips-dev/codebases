import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';
import { compose, mapProps } from 'recompose';
import path from 'js/lib/path';
import Imgix from 'js/components/Imgix';
import { assets } from 'pages/open-course/common/constants';

import HonorsBanner from 'bundles/ondemand/components/HonorsBanner';
import withComputedCourseProgress from 'bundles/learner-progress/utils/withComputedCourseProgress';
import _t from 'i18n!nls/ondemand';
import { FormattedMessage } from 'js/lib/coursera.react-intl';
import 'css!./__styles__/CoursePassedBox';

const assetPath = assets.rootPath;

class CoursePassedBox extends React.Component {
  static propTypes = {
    hasPassedHonorsTrack: PropTypes.bool,
    courseCompletionTime: PropTypes.number,
  };

  render() {
    return (
      <div className="rc-CoursePassedBox rc-EnrollBox vertical-box align-items-vertical-center od-container styleguide">
        <Imgix
          className="badge"
          alt="VC Image"
          src={path.join(assetPath, 'bundles/ondemand/assets/images/infinity_badge.png')}
        />
        <h5>{_t("You've completed this course")}</h5>
        {this.props.courseCompletionTime && (
          <span className="caption-text passed-session-dates">
            <FormattedMessage
              message={_t('Completed on {date}')}
              date={moment(this.props.courseCompletionTime).format('l')}
            />
          </span>
        )}
        {this.props.hasPassedHonorsTrack && <HonorsBanner />}
      </div>
    );
  }
}

export default compose(
  withComputedCourseProgress(),
  mapProps(({ computedCourseProgress }) => ({
    courseCompletionTime: computedCourseProgress.completionTime,
    hasPassedHonorsTrack: computedCourseProgress.hasPassedHonorsTrack,
  }))
)(CoursePassedBox);

export const baseComp = CoursePassedBox;
