import PropTypes from 'prop-types';
import React from 'react';
import _t from 'i18n!nls/discussions';
import 'css!./__styles__/Badge';

class Badge extends React.Component {
  static propTypes = {
    creator: PropTypes.object,
  };

  render() {
    const { creator } = this.props;
    const standardClasses = 'rc-Badge ';
    if (creator.isSuperuser) {
      return <span className={standardClasses + 'bgcolor-primary-light'}>{_t('Coursera Staff')}</span>;
    } else {
      const role = creator.courseRole;
      let roleString;
      switch (role) {
        case 'MENTOR':
          roleString = 'Mentor';
          break;
        case 'COURSE_ASSISTANT':
          roleString = 'Course Assistant';
          break;
        case 'INSTRUCTOR':
          roleString = 'Instructor';
          break;
        case 'TEACHING_STAFF':
          roleString = 'Teaching Staff';
          break;
        case 'UNIVERSITY_ADMIN':
          roleString = 'Staff';
          break;
        case 'DATA_COORDINATOR':
          roleString = 'Staff';
          break;
        default:
          roleString = '';
      }
      if (roleString) {
        return <span className={standardClasses + 'bgcolor-success-light'}>{roleString}</span>;
      }
    }
    return null;
  }
}

export default Badge;
