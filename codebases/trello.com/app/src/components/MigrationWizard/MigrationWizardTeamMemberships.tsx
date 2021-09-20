import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Analytics } from '@trello/atlassian-analytics';
import { MigrationWizardTestIds } from '@trello/test-ids';
import { Button } from '@trello/nachos/button';
import { SubscribeIcon } from '@trello/nachos/icons/subscribe';
import { MemberAvatar } from 'app/src/components/MemberAvatar';
import { AddMemberIcon } from '@trello/nachos/icons/add-member';
import { PrivateIcon } from '@trello/nachos/icons/private';
import { AdminChevronIcon } from '@trello/nachos/icons/admin-chevron';
import styles from './MigrationWizardTeamMemberships.less';
import classNames from 'classnames';
import { useTeamGuests } from './useTeamGuests';
import { useSelectedWorkspace } from './useSelectedWorkspace';
import { MigrationWizardContext } from './MigrationWizardContext';
import { MigrationWizardSteps } from './types';
import { Spinner } from '@trello/nachos/spinner';
import { MigrationWizardMembershipDropdown } from './MigrationWizardMembershipDropdown';
import { MigrationWizardMessagePill } from './MigrationWizardMessagePill';
import { forNamespace } from '@trello/i18n';
import { ProductFeatures } from '@trello/product-features';

const formatError = forNamespace(['alerts']);
const format = forNamespace(['migration wizard']);

export const MigrationWizardTeamMemberships: React.FC = () => {
  const { org } = useSelectedWorkspace();
  const { orgId, onNext } = useContext(MigrationWizardContext);
  const { teamGuests, loading } = useTeamGuests(orgId);
  const [cachedTeamGuests, setCachedTeamGuests] = useState<typeof teamGuests>(
    teamGuests,
  );
  const isPaidProduct = ProductFeatures.hasProduct(
    org?.products?.[0] ?? undefined,
  );

  const [error, setError] = useState('');

  // We want to cache the teamGuests so they don't disappear from the guest list
  useEffect(() => {
    if (!loading && cachedTeamGuests?.length === 0) {
      setCachedTeamGuests(teamGuests);
    }
  }, [loading, teamGuests, cachedTeamGuests, setCachedTeamGuests]);

  const onClick = useCallback(() => {
    if (cachedTeamGuests?.length) {
      const memberCount = cachedTeamGuests?.length - (teamGuests?.length ?? 0);
      if (memberCount > 0) {
        Analytics.sendClickedButtonEvent({
          buttonName: 'nextButton',
          source: 'teamifyMembershipsModal',
          attributes: {
            numMembers: memberCount,
          },
          containers: {
            organization: {
              id: orgId,
            },
          },
        });
      }
    }
    onNext?.(MigrationWizardSteps.BOARD_VISIBILITY);
  }, [cachedTeamGuests, teamGuests, onNext, orgId]);

  return (
    <div className={styles.container}>
      <h2>{format('membership-title')}</h2>
      <p>{format('membership-body')}</p>
      <ul className={styles.permissionsList}>
        <li>
          <span className={classNames(styles.permissionIcon, styles.guests)}>
            <AddMemberIcon />
          </span>
          {format('membership-list1-guests')}
        </li>
        <li>
          <span className={classNames(styles.permissionIcon, styles.members)}>
            <SubscribeIcon />
          </span>
          {format('membership-list2-guest-permissions')}
        </li>
        <li>
          <span className={classNames(styles.permissionIcon, styles.private)}>
            <PrivateIcon />
          </span>
          {format('membership-list3-private-boards')}
        </li>
        <li>
          <span className={classNames(styles.permissionIcon, styles.aaua)}>
            <AdminChevronIcon />
          </span>
          {format('membership-list4-admins')}
        </li>
      </ul>
      <div className={styles.tableWrapper}>
        {loading ? (
          <Spinner centered />
        ) : (
          <table>
            <thead>
              <tr>
                <th>{format('membership-board-members')}</th>
                <th>{format('membership-permission-list')}</th>
              </tr>
            </thead>
            <tbody>
              {cachedTeamGuests?.map((member) => (
                <tr key={member.id}>
                  <td>
                    <div className={styles.member}>
                      <div className={styles.memberAvatar}>
                        <MemberAvatar
                          idMember={member.id}
                          memberData={{ ...member }}
                          size={32}
                        />
                      </div>
                      <div className={styles.memberDetails}>
                        <div className={styles.memberFullName}>
                          {member.fullName}{' '}
                        </div>
                        <div className={styles.memberUsername}>
                          @{member.username}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <MigrationWizardMembershipDropdown
                      orgId={orgId}
                      isPaidProduct={isPaidProduct}
                      memberId={member.id}
                      // eslint-disable-next-line react/jsx-no-bind
                      onError={() => {
                        setError(formatError('something-went-wrong'));
                      }}
                      // eslint-disable-next-line react/jsx-no-bind
                      onSuccess={() => {
                        setError('');
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <hr />
      {error !== '' && (
        <MigrationWizardMessagePill type="error">
          {error}
        </MigrationWizardMessagePill>
      )}
      <p className={styles.footerText}>{format('membership-footer')}</p>
      <Button
        appearance="primary"
        className={styles.nextButton}
        onClick={onClick}
        isDisabled={loading}
        testId={MigrationWizardTestIds.TeamMembershipsNextButton}
      >
        {format('create-team-move-boards-next-button')}
      </Button>
    </div>
  );
};
