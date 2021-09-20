import React, { PureComponent } from 'react';
import { IconLightbulb } from '@udacity/veritas-icons';
import NotificationBadge from 'components/common/notification-badge';
import PropTypes from 'prop-types';
import StudentHubLinkContainer from 'components/student-hub/student-hub-link-container';
import { __ } from 'services/localization-service';
import cx from 'classnames';
import styles from './_service-links.scss';
import withAnalytics from 'decorators/analytics';

export class ServiceLinks extends PureComponent {
  static displayName = 'lesson-sidebar/service-links';

  static propTypes = {
    isStudentHubEnabled: PropTypes.bool,
    hasKnowledgeReviews: PropTypes.bool,
    nanodegreeKey: PropTypes.string,
    track: PropTypes.func.isRequired, //withAnalytics
    unreadPosts: PropTypes.number,
  };

  handleClick = (location, service) => {
    window.open(location, '_blank');
    const { track } = this.props;
    track(`${service} link clicked in concept view`);
  };

  render() {
    const {
      hasKnowledgeReviews,
      isStudentHubEnabled,
      nanodegreeKey,
      unreadPosts: unreadPostsCount,
    } = this.props;

    const knowledgeGlyphClasses = cx(styles['glyph-wrapper'], styles.knowledge);

    if (!hasKnowledgeReviews && !isStudentHubEnabled) {
      return null;
    }

    return (
      <ul className={styles['service-links']}>
        {hasKnowledgeReviews && (
          <li>
            <a
              role="link"
              tabIndex={0}
              onKeyDown={() =>
                this.handleClick(CONFIG.knowledgeWebUrl, 'knowledge')
              }
              onClick={() =>
                this.handleClick(CONFIG.knowledgeWebUrl, 'knowledge')
              }
              className={styles['service-link-item']}
            >
              <span className={knowledgeGlyphClasses}>
                <IconLightbulb size="md" color="cerulean" />
              </span>
              <div className={styles['service-header']}>
                <span className={styles['service-title']}>
                  {__('Mentor Help')}
                </span>
                {unreadPostsCount > 0 && (
                  <NotificationBadge unreadCount={unreadPostsCount} />
                )}
              </div>
              <span className={styles['service-description']}>
                {__('Ask a mentor on our Q&A platform')}
              </span>
            </a>
          </li>
        )}
        {isStudentHubEnabled && (
          <li>
            <StudentHubLinkContainer
              nanodegreeKey={nanodegreeKey}
              view={'lesson'}
            />
          </li>
        )}
      </ul>
    );
  }
}

export default withAnalytics(ServiceLinks);
