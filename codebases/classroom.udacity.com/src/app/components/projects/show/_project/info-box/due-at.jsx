import { Flex, Text } from '@udacity/veritas-components';
import ProjectDeadlineTooltip from 'components/common/project-deadline-tooltip';
import PropTypes from 'prop-types';
import StaticContentPlaceholder from 'components/common/static-content-placeholder';
import moment from 'moment';
import styles from './due-at.scss';
import { useMemo } from 'react';

const DueAt = ({ dueAt, isCompleted }) => {
  const dueDate = useMemo(() => moment(dueAt).format('l'), [dueAt]);

  return (
    <StaticContentPlaceholder placeholder={null}>
      {isCompleted && (
        <div className={styles['due-at-completed']}>
          <Text size="sm">{dueDate}</Text>
        </div>
      )}
      {!isCompleted && (
        <div className={styles['due-at']}>
          <Flex spacing="1x">
            <Text size="sm">{dueDate}</Text>
            <ProjectDeadlineTooltip />
          </Flex>
        </div>
      )}
    </StaticContentPlaceholder>
  );
};

DueAt.displayName = 'projects/show/_project/info-box/due-at';
DueAt.propTypes = {
  dueAt: PropTypes.instanceOf(Date),
  isCompleted: PropTypes.bool,
};
DueAt.defaultProps = {
  dueAt: null,
  isCompleted: false,
};
export default cssModule(styles)(DueAt);
