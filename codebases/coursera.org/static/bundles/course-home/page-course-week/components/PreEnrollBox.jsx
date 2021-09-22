import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import EnrollButton from 'bundles/ondemand/components/enrollButton/EnrollButton';
import ReactPriceDisplay from 'bundles/payments-common/components/ReactPriceDisplay';
import Course from 'pages/open-course/common/models/course';
import { getPriceForVC } from 'bundles/payments/promises/productPrices';
import connectToStores from 'vendor/cnpm/fluxible.v0-4/addons/connectToStores';
import _t from 'i18n!nls/course-home';
import 'css!./__styles__/PreEnrollBox';

class PreEnrollBox extends React.Component {
  static propTypes = {
    courseId: PropTypes.string.isRequired,
    course: PropTypes.instanceOf(Course).isRequired,
    hasS12nLoaded: PropTypes.bool.isRequired,
    isCapstone: PropTypes.bool,
    isEligibleForCapstone: PropTypes.bool,
    isTakingS12n: PropTypes.bool,
    ownsS12nCourse: PropTypes.bool,
    isEnrolled: PropTypes.bool,
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      price: null,
    };
  }

  componentDidMount() {
    if (this.props.isTakingS12n && !this.props.ownsS12nCourse) {
      this.loadPrice();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isTakingS12n && !nextProps.ownsS12nCourse) {
      this.loadPrice();
    }
  }

  loadPrice() {
    const { courseId } = this.props;

    getPriceForVC({ courseId })
      .then((price) => this.setState({ price }))
      .done();
  }

  render() {
    if (!this.props.hasS12nLoaded) {
      return null;
    }

    const { isCapstone, isEligibleForCapstone, ownsS12nCourse, course } = this.props;
    const canEnroll = !this.props.isEnrolled && (!isCapstone || (isEligibleForCapstone && ownsS12nCourse));

    const boxClassnames = classNames('cozy', 'od-container', 'styleguide', {
      'theme-dark': canEnroll,
      'card-rich-interaction': !canEnroll,
    });

    return (
      <div>
        <div className="rc-EnrollBox rc-PreEnrollBox">
          <div className={boxClassnames}>
            <p className="color-primary-text">{_t('Course start date:')}</p>
            <h3 className="headline-2-text upcoming-session-dates color-primary-text">
              <span className="start-date">{this.props.course.get('plannedLaunchDate')}</span>
            </h3>
            {this.state.price && !this.props.isEnrolled && (
              <h3 className="price color-primary-text">
                <ReactPriceDisplay
                  value={this.state.price.getDisplayAmount()}
                  currency={this.state.price.getDisplayCurrencyCode()}
                />
              </h3>
            )}
            {(canEnroll || this.props.isEnrolled) && (
              <div className="align-right button-container">
                <EnrollButton course={course} />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default connectToStores(
  PreEnrollBox,
  ['S12nStore', 'CourseStore', 'CourseMembershipStore'],
  ({ S12nStore, CourseStore, CourseMembershipStore }, props) => {
    const s12n = S12nStore.getS12n();
    const courseId = CourseStore.getCourseId();

    return {
      courseId,
      course: CourseStore.getMetadata(),
      hasS12nLoaded: S12nStore.hasLoaded(),
      isCapstone: s12n && s12n.isCapstone(courseId),
      isEligibleForCapstone: s12n && s12n.isEligibleForCapstone(),
      isTakingS12n: s12n && s12n.isTakingS12n(),
      ownsS12nCourse: s12n && s12n.ownsCourse(courseId),
      isEnrolled: CourseMembershipStore.isPreEnrolled() || CourseMembershipStore.isEnrolled(),
    };
  }
);

export const BaseComp = PreEnrollBox;
