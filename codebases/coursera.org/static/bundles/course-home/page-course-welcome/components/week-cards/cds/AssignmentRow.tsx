import React from 'react';

import type { Item } from 'bundles/course-v2/types/Item';
import type { Theme } from '@coursera/cds-core';
import { useTheme } from '@coursera/cds-core';

import AssignmentName from 'bundles/course-home/page-course-welcome/components/week-cards/cds/AssignmentName';
import AssignmentGrade from 'bundles/course-home/page-course-welcome/components/week-cards/cds/AssignmentGrade';
import AssignmentDueDate from 'bundles/course-home/page-course-welcome/components/week-cards/cds/AssignmentDueDate';

import 'css!./../__styles__/AssignmentRow';

type Props = {
  item: Item;
  theme?: Theme;
};

function AssignmentRow(props: Props) {
  const theme = useTheme();

  const { item } = props;

  return (
    <tr className="rc-AssignmentRow" role="row">
      <AssignmentName item={item} theme={theme} />
      <AssignmentGrade item={item} />
      <AssignmentDueDate item={item} />
    </tr>
  );
}

export default AssignmentRow;
