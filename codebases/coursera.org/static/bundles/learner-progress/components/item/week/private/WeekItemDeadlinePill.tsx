import React from 'react';
import { getFormattedDeadline } from 'bundles/learner-progress/utils/Item';

import { Pill, color } from '@coursera/coursera-ui';

import { Item } from 'bundles/learner-progress/types/Item';

import _t from 'i18n!nls/learner-progress';

type Props = {
  computedItem: Item;
};

const WeekItemDeadlinePill = ({ computedItem }: Props) => {
  let dueMessage;
  const isOverdue = computedItem.deadlineProgress === 'OVERDUE';

  if (isOverdue) {
    dueMessage = _t('Overdue');
  } else {
    dueMessage = _t('Due');
  }

  // Since deadline is optional in computedItem, this is to be type-safe.
  const formattedDeadline = computedItem.deadline ? getFormattedDeadline(computedItem.deadline) : '';
  const formattedMessage = _t('#{dueMessage} #{formattedDeadline}', { dueMessage, formattedDeadline });

  return (
    <div className="rc-WeekItemDeadlinePill">
      {isOverdue ? (
        <Pill
          type="outline"
          label={formattedMessage}
          fillColor={color.white}
          borderColor={color.warning}
          style={{ background: color.white }}
        />
      ) : (
        <Pill type="filled" label={formattedMessage} fillColor="#EFEFEF" style={{ color: '#5E5E5E' }} />
      )}
    </div>
  );
};

export default WeekItemDeadlinePill;
