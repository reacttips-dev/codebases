import React, { useMemo } from 'react';
import DateHelper from 'helpers/date-helper';
import { Flex } from '@udacity/veritas-components';
import ProjectDeadlineTooltip from 'components/common/project-deadline-tooltip';
import PropTypes from 'prop-types';
import { __ } from 'services/localization-service';
import moment from 'moment';
import styles from './_assessment-due-date.scss';

export const ProjectDueDate = ({ dueDate }) => {
  const date = useMemo(() => moment(dueDate).format('MMMM DD, YYYY'), [
    dueDate,
  ]);
  const isPastDue = useMemo(() => DateHelper.pastToday(dueDate), [dueDate]);
  const dueDateStyleName = isPastDue ? 'due-at-past-due' : 'due-at';

  if (dueDate) {
    return (
      <Flex align="center">
        <time
          title={date}
          dateTime={dueDate}
          className={styles[dueDateStyleName]}
        >
          {__('Due <%= date %>', {
            date: DateHelper.formatRelativeDueDate(dueDate),
          })}
        </time>
        <div className={styles['deadline-info']}>
          <ProjectDeadlineTooltip />
        </div>
      </Flex>
    );
  } else {
    return null;
  }
};

ProjectDueDate.displayName = 'common/lesson-card/_assessment-due-date';
ProjectDueDate.propTypes = {
  dueDate: PropTypes.string,
};

export default ProjectDueDate;
