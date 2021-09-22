import React from 'react';

import { Item } from 'bundles/course-v2/types/Item';
import { getFormattedDeadline, getFormattedDeadlineTime } from 'bundles/course-v2/utils/Item';
import { Caption } from '@coursera/coursera-ui';
import { Typography } from '@coursera/cds-core';

type Props = {
  item: Item;
};

class AssignmentDueDate extends React.Component<Props> {
  render() {
    const { item } = this.props;
    const formattedDeadlineDate = getFormattedDeadline(item);
    const formattedDeadlineTime = getFormattedDeadlineTime(item);

    if (!formattedDeadlineDate) {
      return null;
    }

    return (
      <td className="rc-AssignmentDueDate" role="cell">
        <Typography>{formattedDeadlineDate}</Typography>
        <Caption>{formattedDeadlineTime}</Caption>
      </td>
    );
  }
}

export default AssignmentDueDate;
