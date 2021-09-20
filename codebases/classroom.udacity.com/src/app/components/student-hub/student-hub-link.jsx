import React, { PureComponent } from 'react';
import { IconStudentHub } from '@udacity/veritas-icons';
import NotificationBadge from 'components/common/notification-badge';
import PropTypes from 'prop-types';
import StudentHubTooltip from './student-hub-tooltip';
import { __ } from 'services/localization-service';
import classNames from 'classnames';
import styles from './index.scss';
import withAnalytics from 'decorators/analytics';

@cssModule(styles, { allowMultiple: true })
class StudentHubLink extends PureComponent {
  static displayName = 'components/student-hub-link';

  static propTypes = {
    hasUnreads: PropTypes.bool,
    mentionsCount: PropTypes.number,
    url: PropTypes.string.isRequired,
  };

  handleClick = (location, service) => {
    window.open(location, '_target');
    const { track } = this.props;
    track(`${service} link clicked in concept view`);
  };

  renderLink(view) {
    const { hasUnreads, mentionsCount } = this.props;

    const studentHubGlyphClasses = classNames(
      styles['glyph-wrapper'],
      styles['student-hub'],
      styles['studenthub-btn'],
      view
    );
    switch (view) {
      case 'lesson':
        return (
          <a
            role="link"
            tabIndex={0}
            onKeyDown={() =>
              this.handleClick(CONFIG.studentHubWebUrl, 'student-hub')
            }
            onClick={() =>
              this.handleClick(CONFIG.studentHubWebUrl, 'student-hub')
            }
            className={styles['service-link-item']}
          >
            <span className={studentHubGlyphClasses}>
              <IconStudentHub size="md" id="sh-icon" color="purple" />
            </span>
            <div className={styles['service-title-container']}>
              <span className={styles['service-title']}>{__('Peer Chat')}</span>
              {hasUnreads && <NotificationBadge unreadCount={mentionsCount} />}
            </div>
            <span className={styles['service-description']}>
              {__('Chat with peers and alumni')}
            </span>
          </a>
        );
        break;
      case 'dashboard':
        return (
          <a
            href={CONFIG.studentHubWebUrl}
            className={studentHubGlyphClasses}
            data-ref="studyhall-a"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className={styles['_badge-container']}>
              <IconStudentHub size="md" id="sh-icon" color="white" />
              {hasUnreads && (
                <div styleName="dashboard">
                  <NotificationBadge unreadCount={mentionsCount} />
                </div>
              )}
            </div>
          </a>
        );
        break;
    }
  }

  render() {
    const { view } = this.props;

    const isLessonView = view === 'lesson';
    return (
      <div className={styles['studenthub-link-wrapper']}>
        <StudentHubTooltip shouldRender={!isLessonView}>
          {this.renderLink(view)}
        </StudentHubTooltip>
      </div>
    );
  }
}

export default withAnalytics(StudentHubLink);
