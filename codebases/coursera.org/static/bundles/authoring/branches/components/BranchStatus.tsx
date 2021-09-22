import React from 'react';
import { SHORT_MONTH_DAY_DISPLAY, MED_DATE_ONLY_DISPLAY, formatDateTimeDisplay } from 'js/utils/DateTimeUtils';

// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import { getSortedSessions, associatedSessionsAreFinal } from 'bundles/authoring/branches/utils/BranchUtils';
import { branchStatus } from 'bundles/author-branches/constants';

import _t from 'i18n!nls/author-branches';
import AuthoringCourseBranch from 'bundles/author-common/models/AuthoringCourseBranch';

import Session from 'bundles/author-common/models/Session';

/**
 * A component for displaying the status of a branch in the BranchSwitcher
 */

type Props = {
  branch: AuthoringCourseBranch;
};

export default class BranchStatus extends React.Component<Props> {
  render() {
    const { branch } = this.props;
    const sessions = getSortedSessions(branch).filter((session: Session) => !session.isPreview);
    let statusDetails = '';
    if (branch.branchStatus) {
      switch (branch.branchStatus) {
        case branchStatus.NEW:
          statusDetails = _t('New');
          break;
        case branchStatus.PENDING:
          statusDetails = _t('Pending');
          break;
        case branchStatus.UPCOMING:
          statusDetails =
            sessions.length > 0
              ? _t('Upcoming, Starts ') + formatDateTimeDisplay(sessions[0].startedAt, SHORT_MONTH_DAY_DISPLAY)
              : _t('Upcoming, No Session Exists');
          break;
        case branchStatus.LIVE:
          {
            const lastSession = sessions[sessions.length - 1];
            if (lastSession) {
              const endDateText = associatedSessionsAreFinal(sessions)
                ? formatDateTimeDisplay(sessions[sessions.length - 1].endedAt, MED_DATE_ONLY_DISPLAY)
                : 'present';
              const sessionDateRangeText = `${formatDateTimeDisplay(
                sessions[0].startedAt,
                SHORT_MONTH_DAY_DISPLAY
              )} - ${endDateText}`;

              statusDetails = sessionDateRangeText;
              break;
            }
          }
          statusDetails = '';
          break;
        case branchStatus.ARCHIVED:
          statusDetails = _t('Archived');
          break;
        default:
          break;
      }
    }

    const privateLabel = branch.isPrivate && (
      <span style={{ color: '#E85628', marginLeft: '6px' }}> {_t('Private')} </span>
    );

    const branchName = <strong>{branch.name}</strong>;
    return (
      <span className="rc-BranchStatus">
        {branchName}
        {statusDetails && `: ${statusDetails}`}
        {privateLabel}
      </span>
    );
  }
}
