import AnalyticsHelper from 'helpers/analytics-helper';
import AnalyticsMixin from 'mixins/analytics-mixin';
import CancelCourseModal from './_cancel-course-modal';
import Card from './card';
import LinkList from './link-list';
import PropTypes from 'prop-types';
import { __ } from 'services/localization-service';
import createReactClass from 'create-react-class';
import styles from './_course-card.scss';

export default cssModule(
  createReactClass({
    displayName: 'settings/setting-courses/_course-card',

    propTypes: {
      course: PropTypes.shape({
        title: PropTypes.string.isRequired,
      }).isRequired,
      onCancelCourse: PropTypes.func,
    },

    mixins: [AnalyticsMixin],

    handleOpenCancelModal() {
      const courseData = AnalyticsHelper.getSubscriptionData(
        this.props.course,
        {
          category: 'Cancel Subscription Attempt',
          label: 'Cancel Subscription Attempt - Clicked',
        }
      );

      this.track('Clicked Cancel Subscription', courseData);
    },

    _getFooterItems() {
      const { course, onCancelCourse: onCancel } = this.props;
      return [
        {
          content: __('Remove Course'),
          modal: CancelCourseModal,
          onShowModal: this.handleOpenCancelModal,
          modalProps: { course, onCancel },
        },
      ];
    },

    render() {
      const { course } = this.props;

      return (
        <Card title={course.title}>
          <p>{__('You will not be billed for this free course.')}</p>
          <LinkList links={this._getFooterItems()} />
        </Card>
      );
    },
  }),
  styles
);
