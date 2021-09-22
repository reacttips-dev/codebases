import React from 'react';
import classNames from 'classnames';
import type { BranchStatusValues } from 'bundles/author-branches/constants';
import { branchStatus } from 'bundles/author-branches/constants';
import _t from 'i18n!nls/authoring';
import { Pill, color } from '@coursera/coursera-ui';
import getStatusPillStyle from 'bundles/authoring/common/constants/statusPillStyle';

/**
 * A pill for displaying the status of a branch
 */

const StatusColorMap = {
  new: color.black,
  live: color.primary,
  archived: color.bgDarkGray,
  upcoming: color.success,
  pending: color.success,
  creating: undefined,
};

type Props = {
  status: BranchStatusValues;
  className?: string;
};

class BranchStatusPill extends React.Component<Props> {
  static getStatusString(status: string): string {
    switch (status) {
      case branchStatus.NEW:
        return _t('New');
      case branchStatus.PENDING:
        return _t('Pending');
      case branchStatus.UPCOMING:
        return _t('Upcoming');
      case branchStatus.LIVE:
        return _t('Live');
      case branchStatus.ARCHIVED:
        return _t('Archived');
      default:
        return '';
    }
  }

  render() {
    const { status, className } = this.props;
    const classes = classNames('rc-BranchStatusPill', status, className);

    return (
      <Pill
        type="filled"
        rootClassName={classes}
        fillColor={StatusColorMap[status]}
        label={BranchStatusPill.getStatusString(status)}
        style={getStatusPillStyle()}
      />
    );
  }
}

export default BranchStatusPill;
