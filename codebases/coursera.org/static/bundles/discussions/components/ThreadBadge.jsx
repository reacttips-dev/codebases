import PropTypes from 'prop-types';
import React from 'react';
import areHighlightedPostsEnabled from 'bundles/discussions/utils/areHighlightedPostsEnabled';
import connectToStores from 'vendor/cnpm/fluxible.v0-4/addons/connectToStores';
import _t from 'i18n!nls/discussions';
import 'css!./__styles__/ThreadBadge';

function getTranslations() {
  return {
    INSTRUCTOR_CREATED: _t('Instructor Created'),
    STAFF_CREATED: _t('Staff Created'),
    INSTRUCTOR_RESPONDED: _t('Instructor Replied'),
    MENTOR_CREATED: _t('Mentor Created'),
    STAFF_RESPONDED: _t('Staff Replied'),
    MENTOR_RESPONDED: _t('Mentor Replied'),
    HIGHLIGHTED: _t('Highlighted'),
  };
}

class ThreadBadge extends React.Component {
  static propTypes = {
    badge: PropTypes.string,
    courseId: PropTypes.string,
  };

  render() {
    const { badge, courseId } = this.props;
    const translations = getTranslations();

    let text = '';
    if (areHighlightedPostsEnabled(courseId) && badge === 'HIGHLIGHTED') {
      text = translations.HIGHLIGHTED;
    } else {
      text = translations[badge];
    }

    if (!text) {
      return null;
    }

    return (
      <span className="rc-ThreadBadge bgcolor-accent-brown-light" aria-label={text}>
        {text}
      </span>
    );
  }
}

export default connectToStores(ThreadBadge, ['CourseStore'], ({ CourseStore }) => ({
  courseId: CourseStore.getCourseId(),
}));
