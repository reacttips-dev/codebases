import React, { useCallback } from 'react';
import { forTemplate } from '@trello/i18n';
import { Analytics } from '@trello/atlassian-analytics';
import styles from './TrelloEnterpriseLearnMore.less';
import { useTrelloEnterpriseLearnMoreMemberIdQuery } from './TrelloEnterpriseLearnMoreMemberIdQuery.generated';

const format = forTemplate('mini_plan_comparison');

export const TrelloEnterpriseLearnMore: React.FC = () => {
  const { data } = useTrelloEnterpriseLearnMoreMemberIdQuery();
  const trackLearnMoreClick = useCallback(() => {
    Analytics.sendClickedLinkEvent({
      linkName: 'learnMoreLink',
      source: 'planSelectionModal',
      attributes: {
        memberId: data?.member?.id,
        organizationIds: data?.member?.idOrganizations,
      },
    });
  }, [data?.member?.idOrganizations, data?.member?.id]);

  return (
    <div className={styles.checkoutEnterprise}>
      <p className={styles.content}>
        {format('check-out-trello-enterprise')}{' '}
        <a
          href="https://trello.com/enterprise"
          target="_blank"
          className={styles.enterpriseLink}
          onClick={trackLearnMoreClick}
        >
          {format('enterprise-learn-more')}
        </a>
      </p>
    </div>
  );
};
