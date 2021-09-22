import PropTypes from 'prop-types';
import React from 'react';
import redirect from 'js/lib/coursera.redirect';
/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import Course from 'pages/open-course/common/models/course';

// TODO(jnam) remove this along with other old CDP files from the code-base
class PhoenixEnrollModal extends React.Component {
  static contextTypes = {
    course: PropTypes.instanceOf(Course).isRequired,
  };

  componentDidMount() {
    const { course } = this.context;
    redirect.setLocation(`/learn/${course.get('slug')}?action=enroll`);
  }

  render() {
    return false;
  }
}

export default PhoenixEnrollModal;
