import { forNamespace, localizeCount } from '@trello/i18n';
import React from 'react';
import { InlineLink } from './InlineLink';

const learnMoreUrl = 'https://help.trello.com/article/1123-multi-board-guests';

interface BillableGuestsAlertProps {
  adminNames: string[];
  newBillableGuestsCount: number;
  availableLicenseCount: number;
  orgName: string;
  isOrgAdmin: boolean;
  orgUrl: string;
  isReopen: boolean;
  isDesktop: boolean;
  onCountClick: (e: React.FormEvent) => void;
}

export class BillableGuestsAlert extends React.Component<BillableGuestsAlertProps> {
  render() {
    const {
      adminNames,
      newBillableGuestsCount,
      availableLicenseCount,
      orgName,
      isOrgAdmin,
      orgUrl,
      onCountClick,
      isReopen,
      isDesktop,
    } = this.props;
    const format = forNamespace(
      isReopen
        ? 're-open billable guests alert'
        : 'add to team billable guests alert',
    );
    const others = localizeCount('others', adminNames.length - 3);
    const othersLink = (
      <InlineLink key="othersLink" href={`${orgUrl}/members`} text={others} />
    );
    const learnMoreText = format('learn more');
    const learnMoreLink = (
      <InlineLink
        key="learnMoreLink"
        href={learnMoreUrl}
        text={learnMoreText}
      />
    );

    const team = <strong key="team">{orgName}</strong>;
    const boardMembersCount = (
      <InlineLink
        key="boardMembersCount"
        onClick={onCountClick}
        text={localizeCount('board members', newBillableGuestsCount)}
      />
    );
    const boardMembersOnTeam = localizeCount(
      'board members already guests on team',
      newBillableGuestsCount,
      {
        count: boardMembersCount,
        team,
      },
    );

    if (isDesktop) {
      if (isReopen) {
        return localizeCount(
          'billable guests alert re-open desktop',
          newBillableGuestsCount,
          {
            boardMembersOnTeam,
            learnMoreLink,
          },
        );
      }

      return localizeCount(
        'billable guests alert move desktop',
        newBillableGuestsCount,
        {
          boardMembersOnTeam,
          learnMoreLink,
        },
      );
    }

    if (isOrgAdmin) {
      const namespaceFragment = isReopen ? '' : ' add to team';
      if (newBillableGuestsCount > availableLicenseCount) {
        return localizeCount(
          `text as admin max bcpo licenses reached${namespaceFragment}`,
          newBillableGuestsCount,
          {
            boardMembersOnTeam,
            learnMoreLink,
          },
        );
      } else {
        return localizeCount(
          `text as admin${namespaceFragment}`,
          newBillableGuestsCount,
          {
            boardMembersOnTeam,
            learnMoreLink,
          },
        );
      }
    } else {
      if (adminNames.length === 1) {
        return format('text with 1 admin', {
          boardMembersOnTeam,
          learnMoreLink,
          admin1: <strong key="admin1">{adminNames[0]}</strong>,
        });
      } else if (adminNames.length === 2) {
        return format('text with 2 admin', {
          boardMembersOnTeam,
          learnMoreLink,
          admin1: <strong key="admin1">{adminNames[0]}</strong>,
          admin2: <strong key="admin2">{adminNames[1]}</strong>,
        });
      } else if (adminNames.length === 3) {
        return format('text with 3 admin', {
          boardMembersOnTeam,
          learnMoreLink,
          admin1: <strong key="admin1">{adminNames[0]}</strong>,
          admin2: <strong key="admin2">{adminNames[1]}</strong>,
          admin3: <strong key="admin3">{adminNames[2]}</strong>,
        });
      } else if (adminNames.length > 3) {
        return format('text with more admins', {
          boardMembersOnTeam,
          learnMoreLink,
          othersLink,
          admin1: <strong key="admin1">{adminNames[0]}</strong>,
          admin2: <strong key="admin2">{adminNames[1]}</strong>,
          admin3: <strong key="admin3">{adminNames[2]}</strong>,
        });
      }
    }
  }
}
