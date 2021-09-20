import React, { useCallback } from 'react';
import { forTemplate } from '@trello/i18n';
import { Lozenge } from 'app/src/components/Lozenge';
import styles from './ViewsFeedbackHeader.less';
import { useViewsFeedbackHeaderQuery } from './ViewsFeedbackHeaderQuery.generated';
import { getOrgPaidStatus } from '@trello/organizations';
import { memberId } from '@trello/session-cookie';
import { BetaPhase } from './types';

const format = forTemplate('board-views');

interface ViewsFeedbackHeaderProps {
  feedbackLink: string;
  orgId?: string | null;
  betaPhase?: BetaPhase;
}

export const ViewsFeedbackHeader: React.FC<ViewsFeedbackHeaderProps> = ({
  feedbackLink,
  orgId,
  betaPhase,
}) => {
  const { data } = useViewsFeedbackHeaderQuery(
    orgId ? { variables: { orgId: orgId } } : { skip: true },
  );

  const linkWithParameters = useCallback(() => {
    const url = new URL(feedbackLink);
    const organization = data?.organization;
    const idEnterprise = data?.organization?.idEnterprise;

    url.searchParams.append(
      'team_status',
      orgId ? getOrgPaidStatus(organization) : 'NO_TEAM',
    );

    memberId && url.searchParams.append('memberid', memberId);
    orgId && url.searchParams.append('orgid', orgId);
    idEnterprise && url.searchParams.append('enterpriseid', idEnterprise);

    return url.href;
  }, [data, orgId, feedbackLink]);

  return (
    <div className={styles.feedbackHeaderSection}>
      {betaPhase === BetaPhase.LATE ? (
        <span className={styles.lozenge}>
          <Lozenge color="blue">{format('beta')}</Lozenge>
        </span>
      ) : null}
      <span>
        <a key="feedback-link" target="_blank" href={linkWithParameters()}>
          {format('feedback-request')}
        </a>
      </span>
    </div>
  );
};
