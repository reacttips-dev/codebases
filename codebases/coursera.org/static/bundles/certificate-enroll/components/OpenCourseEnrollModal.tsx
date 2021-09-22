import PropTypes from 'prop-types';
import React from 'react';
import PhoenixEnrollModal from 'bundles/certificate-enroll/components/PhoenixEnrollModal';
/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import Course from 'pages/open-course/common/models/course';

class OpencourseEnrollModal extends React.Component {
  static propTypes = {
    course: PropTypes.instanceOf(Course).isRequired,
    isPreEnroll: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired,
  };

  static childContextTypes = {
    course: PropTypes.instanceOf(Course),
  };

  getChildContext() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'course' does not exist on type 'Readonly... Remove this comment to see the full error message
    const { course } = this.props;
    return { course };
  }

  render() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'isPreEnroll' does not exist on type 'Rea... Remove this comment to see the full error message
    const { isPreEnroll } = this.props;
    return (
      <div className="rc-OpencourseEnrollModal" id="OpenCourseEnrollModal">
        {/* both pre-enroll and enroll modals display cert vs free option */}
        {/* @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call. */}
        <PhoenixEnrollModal isPreEnroll={isPreEnroll}>{this.props.children}</PhoenixEnrollModal>
      </div>
    );
  }
}

export default OpencourseEnrollModal;
