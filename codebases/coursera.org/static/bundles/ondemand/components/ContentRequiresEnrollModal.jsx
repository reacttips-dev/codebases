import PropTypes from 'prop-types';
import React from 'react';
import PhoenixEnrollButton from 'bundles/certificate-enroll/components/PhoenixEnrollButton';
import Modal from 'bundles/phoenix/components/Modal';
import Course from 'pages/open-course/common/models/course';
import { FormattedMessage } from 'js/lib/coursera.react-intl';
import _t from 'i18n!nls/ondemand';

class ContentRequiresEnrollModal extends React.Component {
  static propTypes = {
    course: PropTypes.instanceOf(Course).isRequired,
    onClose: PropTypes.func.isRequired,
  };

  static childContextTypes = {
    course: PropTypes.instanceOf(Course),
  };

  getChildContext() {
    const { course } = this.props;
    return {
      course,
    };
  }

  handleClose = () => {
    this.props.onClose();
  };

  render() {
    return (
      <div className="rc-ContentRequiresEnrollModal">
        <Modal
          type="layer"
          key="ContentRequiresEnrollModal"
          modalName="Join to access course content"
          handleClose={this.handleClose}
        >
          <h1>
            <FormattedMessage message={_t('Join {courseName}.')} courseName={this.props.course.get('name')} />
          </h1>
          <p>{_t('Enroll to access this course content.')}</p>
          <PhoenixEnrollButton />
        </Modal>
      </div>
    );
  }
}

export default ContentRequiresEnrollModal;
