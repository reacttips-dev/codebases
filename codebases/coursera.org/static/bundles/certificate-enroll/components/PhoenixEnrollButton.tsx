import PropTypes from 'prop-types';
import React from 'react';
/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import LegacyCourseEnrollButton from 'bundles/enroll-course/components/LegacyCourseEnrollButton';
import { TrackedA } from 'bundles/page/components/TrackedLink2';
/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import userIdentity from 'bundles/phoenix/template/models/userIdentity';
import productOwnershipPromise from 'bundles/product/promises/productOwnership';
import _t from 'i18n!nls/certificate-enroll';
/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import Course from 'pages/open-course/common/models/course';

class PhoenixEnrollButton extends React.Component {
  static propTypes = {
    redirectUrlAfterAuth: PropTypes.string,
  };

  static contextTypes = {
    course: PropTypes.instanceOf(Course).isRequired,
  };

  state = {
    shouldShow: false,
    ownsCourse: false,
  };

  componentDidMount() {
    if (userIdentity.get('authenticated')) {
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 2.
      productOwnershipPromise(userIdentity.get('id'), this.context.course.get('id'))
        .then((productOwnership) => this.setState({ ownsCourse: productOwnership.get('owns') }))
        .finally(() => this.setState({ shouldShow: true }));
    } else {
      this.setState({ shouldShow: true });
    }
  }

  render() {
    if (!this.state.shouldShow) {
      return null;
    }

    const elClassName = 'rc-PhoenixEnrollButton';
    const { course } = this.context;

    return <LegacyCourseEnrollButton courseId={course.get('id')} className={elClassName} />;
  }
}

export default PhoenixEnrollButton;
