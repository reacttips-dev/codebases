import React from 'react';
import classNames from 'classnames';
import _t from 'i18n!nls/authoring';
import { Pill, color } from '@coursera/coursera-ui';
import ContextStatusStates from 'bundles/authoring/course-level/constants/ContextStatusStates';
import type { ContextStatusState } from 'bundles/authoring/course-level/constants/ContextStatusStates';
import getStatusPillStyle from 'bundles/authoring/common/constants/statusPillStyle';

const StatusColorMap = {
  [ContextStatusStates.NEW]: color.black,
  [ContextStatusStates.UPCOMING]: color.success,
  [ContextStatusStates.PENDING]: color.success,
  [ContextStatusStates.LIVE]: color.primary,
  [ContextStatusStates.RUNNING]: color.primary,
  [ContextStatusStates.OPEN]: color.primary,
  [ContextStatusStates.ARCHIVED]: color.bgDarkGray,
  [ContextStatusStates.ENDED]: color.bgDarkGray,
  [ContextStatusStates.CREATING]: color.black,
  [ContextStatusStates.FAILED]: color.error,
};

const getTranslatedStatusString = (status: ContextStatusState) => {
  const statusStringMap = {
    [ContextStatusStates.NEW]: _t('New'),
    [ContextStatusStates.UPCOMING]: _t('Upcoming'),
    [ContextStatusStates.LIVE]: _t('Live'),
    [ContextStatusStates.ARCHIVED]: _t('Archived'),
    // TODO: [be-code-debt] see if BE can map these to the correct one above
    [ContextStatusStates.RUNNING]: _t('Live'),
    [ContextStatusStates.ENDED]: _t('Archived'),
    [ContextStatusStates.PENDING]: _t('Upcoming'),
    [ContextStatusStates.OPEN]: _t('Live'),
    [ContextStatusStates.CREATING]: _t('Creating...'),
    [ContextStatusStates.FAILED]: _t('Error'),
  };

  return statusStringMap[status];
};

type Props = {
  status: string;
  noMinWidth?: boolean;
};

const ContextStatusPill = ({ status, noMinWidth }: Props) => {
  const classes = classNames('rc-ContextStatusPill', status, 'context-status');

  return (
    <Pill
      type="filled"
      rootClassName={classes}
      fillColor={StatusColorMap[status as ContextStatusState]}
      label={getTranslatedStatusString(status as ContextStatusState)}
      style={{
        ...getStatusPillStyle(),
        minWidth: noMinWidth ? undefined : '95px',
      }}
    />
  );
};

export default ContextStatusPill;
