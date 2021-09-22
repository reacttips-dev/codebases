import React from 'react';
import TrackedButton from 'bundles/page/components/TrackedButton';
import CourseEnrollModal from 'bundles/enroll-course/components/CourseEnrollModal';

import _t from 'i18n!nls/course-home';

type Props = {
  courseId: string;
  canSubscribe: boolean;
};

type State = {
  showModal: boolean;
};

class PurchaseCourse extends React.Component<Props, State> {
  state = {
    showModal: false,
  };

  handleClick = () => {
    this.setState({ showModal: true });
  };

  handleClose = () => {
    this.setState({ showModal: false });
  };

  render() {
    const { showModal } = this.state;
    const { courseId, canSubscribe } = this.props;

    return (
      <div className="rc-PurchaseCourse">
        <TrackedButton
          onClick={this.handleClick}
          className="button-link certificate-upsell"
          trackingName="dashboard_subscription_purchase_button"
        >
          {canSubscribe ? _t('Subscribe') : _t('Purchase Course')}
        </TrackedButton>

        {showModal && <CourseEnrollModal courseId={courseId} onClose={this.handleClose} />}
      </div>
    );
  }
}

export default PurchaseCourse;
