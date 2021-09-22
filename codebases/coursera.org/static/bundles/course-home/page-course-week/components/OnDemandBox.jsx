import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import EnrollButton from 'bundles/ondemand/components/enrollButton/EnrollButton';
import S12n from 'bundles/ondemand/models/S12n';
import areDeadlinesBlacklisted from 'bundles/ondemand/utils/areDeadlinesBlacklisted';
import { getPriceForVC } from 'bundles/payments/promises/productPrices';
import ReactPriceDisplay from 'bundles/payments-common/components/ReactPriceDisplay';
import _t from 'i18n!nls/ondemand';
import connectToStores from 'vendor/cnpm/fluxible.v0-4/addons/connectToStores';

class OnDemandBox extends React.Component {
  static propTypes = {
    hasS12nLoaded: PropTypes.bool.isRequired,
    s12n: PropTypes.instanceOf(S12n),
    courseId: PropTypes.string,
    isTakingS12n: PropTypes.bool,
    isEnrolled: PropTypes.bool,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  state = {
    price: null,
  };

  componentDidMount() {
    if (this.props.isTakingS12n && !this.props.s12n.ownsCourse(this.props.courseId)) {
      this.loadPrice();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isTakingS12n && !nextProps.s12n.ownsCourse(this.props.courseId)) {
      this.loadPrice();
    }
  }

  loadPrice = () => {
    getPriceForVC({ courseId: this.props.courseId })
      .then((price) => this.setState({ price }))
      .done();
  };

  render() {
    if (!this.props.hasS12nLoaded) {
      return null;
    }

    const boxClassnames = classNames('rc-EnrollBox', 'rc-OnDemandBox', 'cozy', 'od-container', {
      'theme-dark': !this.props.isEnrolled,
      'card-rich-interaction': this.props.isEnrolled,
    });

    return (
      <div>
        <div className={boxClassnames}>
          <div className="vertical-box styleguide">
            <h3 className="color-primary-text">
              {this.props.isEnrolled ? _t("You're enrolled in this course") : _t('Start learning now')}
            </h3>
            {!areDeadlinesBlacklisted(this.props.courseId) && (
              <p className="color-primary-text">
                {_t('This course is self-paced, with suggested deadlines to help you keep on track.')}
              </p>
            )}
            {this.state.price && (
              <h3 className="price color-primary-text">
                <ReactPriceDisplay
                  value={this.state.price.getDisplayAmount()}
                  currency={this.state.price.getDisplayCurrencyCode()}
                />
              </h3>
            )}
            <div className="horizontal-box align-items-right">
              <EnrollButton />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connectToStores(
  OnDemandBox,
  ['CourseStore', 'S12nStore', 'CourseMembershipStore'],
  ({ CourseStore, S12nStore, CourseMembershipStore }, props) => {
    const s12n = S12nStore.getS12n();
    const courseId = CourseStore.getCourseId();
    return {
      hasS12nLoaded: S12nStore.hasLoaded(),
      courseId,
      s12n,
      isTakingS12n: s12n && s12n.isTakingS12n(),
      isEnrolled: CourseMembershipStore.isEnrolled(),
    };
  }
);

export const BaseComp = OnDemandBox;
