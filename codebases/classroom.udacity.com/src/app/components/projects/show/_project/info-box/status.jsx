import { Flex, Text } from '@udacity/veritas-components';
import {
  IconChecked,
  IconCircleEmpty,
  IconCircleFull,
  IconCloseCircled,
  IconSubtractCircled,
  IconWarning,
} from '@udacity/veritas-icons';
import DateHelper from 'helpers/date-helper';
import ProjectHelper from 'helpers/project-helper';
import PropTypes from 'prop-types';
import { __ } from 'services/localization-service';
import styles from './status.scss';

const Status = ({ onShowCancelModal, project, dueAt }) => {
  const getStatusCopy = () => {
    let header, content, icon;
    switch (true) {
      case ProjectHelper.isPastDue(project):
        header = __('Unsubmitted');
        content = __('Project past due', {
          due_at: DateHelper.formatShortWithDayOfWeekAndTime(dueAt),
        });
        icon = <IconCircleFull color="orange" size="sm" />;
        break;

      case ProjectHelper.isCanceled(project):
        header = __('Canceled');
        content = __('Canceled on: <%= canceled_on %>', {
          canceled_on: DateHelper.formatShortWithDayOfWeekAndTime(
            ProjectHelper.getReviewedOrCanceledAtDate(project)
          ),
        });
        icon = <IconSubtractCircled color="slate" size="sm" />;
        break;

      case ProjectHelper.isUnsubmitted(project):
        header = __('Not submitted');
        content = __('Due at: <%= due_at %>', {
          due_at: DateHelper.formatShortWithDayOfWeekAndTime(dueAt),
        });
        icon = <IconCircleEmpty color="silver" size="sm" />;
        break;

      case ProjectHelper.isFailed(project):
        if (ProjectHelper.isFlaggedForPlagiarism(project)) {
          // plagiarism copy
          header = __('Pending');
          content = __(
            '<%= supportLink %> with any questions',
            {
              supportLink:
                '<a href="mailto:review-support@udacity.com">Contact support</a>',
            },
            { renderHTML: true }
          );
          icon = <IconCloseCircled color="red" size="sm" />;
        } else {
          // other ungradeable copy
          header = ProjectHelper.isUngradeable(project)
            ? __('Ungradable')
            : __('Not passed');
          content = ProjectHelper.isUngradeable(project)
            ? __('Missing requirement. Please resubmit.')
            : __('Reviewed on: <%= reviewed_on %>', {
                reviewed_on: DateHelper.formatShortWithDayOfWeekAndTime(
                  ProjectHelper.getReviewedOrCanceledAtDate(project)
                ),
              });
          icon = <IconCloseCircled color="red" size="sm" />;
        }
        break;

      case ProjectHelper.isCompleted(project):
        header = __('Passed');
        content = __('Reviewed on: <%= reviewed_on %>', {
          reviewed_on: DateHelper.formatShortWithDayOfWeekAndTime(
            ProjectHelper.getReviewedOrCanceledAtDate(project)
          ),
        });
        icon = <IconChecked color="green" size="sm" />;
        break;

      case ProjectHelper.isErred(project):
        header = __('Submission error');
        content = __('Please resubmit');
        icon = <IconWarning color="red" size="sm" />;
        break;

      case ProjectHelper.isSubmitted(project):
        header = __('In review');
        content = __('Submitted on: <%= submitted_on %>', {
          submitted_on: DateHelper.formatShortWithDayOfWeekAndTime(
            ProjectHelper.getSubmittedAtDate(project)
          ),
        });
        icon = <IconCircleFull color="yellow" size="sm" />;
        break;

      default:
        header = null;
        content = null;
        icon = null;
        break;
    }

    return { header, content, icon };
  };

  const renderStatus = () => {
    const { icon, header, content } = getStatusCopy();
    return (
      <div>
        <Flex spacing="1x">
          {icon}
          <div>
            <span className={styles['bold']}>
              <Text size="sm" spacing="none">
                {header}
                {ProjectHelper.canCancel(project) && (
                  <a
                    href="#"
                    className={styles['cancellation']}
                    onClick={onShowCancelModal}
                  >
                    {__('Cancel Submission')}
                  </a>
                )}
              </Text>
            </span>
            <Text size="sm" spacing="1x">
              {content}
            </Text>
          </div>
        </Flex>
      </div>
    );
  };

  return <div className="status-bar">{renderStatus()}</div>;
};

Status.displayName = 'projects/show/_project/info-box/status';
Status.propTypes = {
  project: PropTypes.object,
  onShowCancelModal: PropTypes.func,
  dueAt: PropTypes.string,
};
Status.defaultProps = {
  project: {},
  onShowCancelModal: _.noop,
  dueAt: '',
};

export default cssModule(styles)(Status);
