import {
  IconCareers,
  IconClose,
  IconStarEmpty,
  IconStudentHub,
  IconUser,
} from '@udacity/veritas-icons';
import { Loading, RoundButton } from '@udacity/veritas-components';
import PropTypes from 'prop-types';
import React from 'react';
import ServiceLinkCard from 'components/common/service-link-card';
import { __ } from 'services/localization-service';
import styles from './service-links.scss';

function getHelpServices(
  hasEnterprise,
  hasUnreads,
  mentionsCount,
  unreadPostsCount
) {
  return {
    mentorHelp: {
      url: CONFIG.knowledgeWebUrl,
      header: __('Mentor Help'),
      icon: <IconUser title="Mentor Help" color="cerulean" size="sm" />,
      text: __(
        'Ask a technical mentor or search for answers on our Q&A platform.'
      ),
      hasUnreads: unreadPostsCount > 0,
      unreadCount: unreadPostsCount,
    },

    peerChat: {
      url: CONFIG.studentHubWebUrl,
      header: __('Peer Chat'),
      icon: <IconStudentHub title="Peer Chat" color="purple" size="sm" />,
      text: __('Collaborate in project channels with peers and alumni.'),
      hasUnreads: hasUnreads,
      unreadCount: mentionsCount,
    },

    careers: {
      url: CONFIG.careerPortalUrl,
      header: __('Career Services'),
      icon: <IconCareers title="Career Services" color="orange" size="sm" />,
      text: __(
        'Get personalized feedback on your resume and GitHub or explore career resources.'
      ),
    },

    accountHelp: {
      url: CONFIG.zendeskSsoUrl,
      header: __('Account Help'),
      icon: <IconStarEmpty title="Account Help" color="teal" size="sm" />,
      text: __('Question about your account? Check the FAQ or file a ticket.'),
    },
  };
}

export default function ServiceLinks({
  hasKnowledgeReviews,
  isStudentHubEnabled,
  isCareerPortalEnabled,
  onCloseHelpSidebar,
  hasEnterprise,
  hasUnreads,
  mentionsCount,
  isBusy,
  unreadPosts: unreadPostsCount,
}) {
  const helpServices = getHelpServices(
    hasEnterprise,
    hasUnreads,
    mentionsCount,
    unreadPostsCount
  );

  return (
    <div className={styles.sidebar}>
      <div className={styles.close}>
        <RoundButton
          label="Close"
          onClick={onCloseHelpSidebar}
          variant="minimal"
          icon={<IconClose />}
        />
      </div>
      <Loading busy={isBusy}>
        <ul className={styles.serviceLinksList}>
          {hasKnowledgeReviews && (
            <ServiceLinkCard {...helpServices.mentorHelp} />
          )}
          {isStudentHubEnabled && (
            <ServiceLinkCard {...helpServices.peerChat} />
          )}
          {isCareerPortalEnabled && (
            <ServiceLinkCard {...helpServices.careers} />
          )}
          <ServiceLinkCard {...helpServices.accountHelp} />
        </ul>
      </Loading>
    </div>
  );
}

ServiceLinks.displayName = 'common/service-links-list';

ServiceLinks.propTypes = {
  hasUnreads: PropTypes.bool,
  mentionsCount: PropTypes.number,
  hasKnowledgeReviews: PropTypes.bool.isRequired,
  isStudentHubEnabled: PropTypes.bool.isRequired,
  isCareerPortalEnabled: PropTypes.bool,
};

ServiceLinks.defaultProps = {
  isCareerPortalEnabled: false,
};
