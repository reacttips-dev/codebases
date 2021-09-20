import { IconCalendar, IconReviews } from '@udacity/veritas-icons';
import CourseHelper from 'helpers/course-helper';
import DueAt from './due-at';
import { Heading } from '@udacity/veritas-components';
import NanodegreeHelper from 'helpers/nanodegree-helper';
import PropTypes from 'prop-types';
import SemanticTypes from 'constants/semantic-types';
import Status from './status.jsx';
import { __ } from 'services/localization-service';
import styles from './index.scss';

const Row = ({ icon, header, children }) => {
  return (
    <div className={styles['row']}>
      <span className={styles['row-header']}>
        <Heading size="h5">
          {icon}
          &nbsp;
          {header}
        </Heading>
      </span>
      <span className={styles['row-content']}>{children}</span>
    </div>
  );
};

const InfoBox = ({ onShowCancelModal, project, root }) => {
  const dueAt = SemanticTypes.isNanodegree(root)
    ? NanodegreeHelper.getProjectDueAt(root, project)
    : CourseHelper.getProjectDueAt(root, project);

  return (
    <div className={styles['contain']}>
      <div className={styles['info-box']}>
        {dueAt && (
          <Row icon={<IconCalendar size="sm" />} header={__('due date')}>
            <DueAt dueAt={dueAt} />
          </Row>
        )}
        <Row icon={<IconReviews size="sm" />} header={__('status')}>
          <Status
            onShowCancelModal={onShowCancelModal}
            project={project}
            dueAt={dueAt}
          />
        </Row>
      </div>
    </div>
  );
};

InfoBox.displayName = 'projects/show/_project/info-box';

InfoBox.propTypes = {
  currentSubmission: PropTypes.object,
  onShowCancelModal: PropTypes.func,
};

export default cssModule(styles)(InfoBox);
