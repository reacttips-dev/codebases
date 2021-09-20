import Actions from 'actions';
import AnalyticsHelper from 'helpers/analytics-helper';
import AnalyticsMixin from 'mixins/analytics-mixin';
import BusyButton from 'components/common/busy-button';
import { Modal } from '@udacity/veritas-components';
import PropTypes from 'prop-types';
import { __ } from 'services/localization-service';
import { connect } from 'react-redux';
import createReactClass from 'create-react-class';
import styles from './_cancel-course-modal.scss';

var mapDispatchToProps = (dispatch) => ({
  onCancelCourse: (courseId) => dispatch(Actions.cancelCourse(courseId)),
});

export default connect(
  null,
  mapDispatchToProps
)(
  cssModule(
    createReactClass({
      displayName: 'settings/setting-subscriptions/_cancel-course-modal',

      propTypes: {
        show: PropTypes.bool,
        onHide: PropTypes.func,
        course: PropTypes.object,
      },

      mixins: [AnalyticsMixin],

      getDefaultProps() {
        return {
          show: false,
          onHide: _.noop,
          course: {},
        };
      },

      handleCancelClick() {
        var { course, onHide, onCancel } = this.props;

        var segmentTags = {
          category: 'Remove Course Submitted',
          label: 'Remove Course Submitted',
        };

        var courseData = _.extend(
          AnalyticsHelper.getCourseData(course, segmentTags)
        );

        return this.props
          .onCancelCourse(course.key)
          .then(() => this.track(segmentTags.label, courseData))
          .then(() => onHide())
          .then(() => onCancel());
      },

      handleModalHide() {
        var { course } = this.props;

        var segmentTags = {
          category: 'Remove Course Attempt',
          label: 'Remove Course Attempt - Dismissed',
        };

        var courseData = AnalyticsHelper.getCourseData(course, segmentTags);

        this.props.onHide();

        this.track('Remove Course Modal Dismissed', courseData);
      },

      render() {
        var { show } = this.props;

        return (
          <Modal
            open={show}
            onClose={this.handleModalHide}
            label={__('Cancel Course')}
            closeLabel={__('Close Modal')}
          >
            <div styleName="modal-container">
              <h2 styleName="header-text-ctr">{__('Remove Course?')}</h2>
              <p>{__('You will not be billed for this free course.')}</p>
              <div styleName="cancel-button">
                <BusyButton
                  className="btn-primary"
                  label={__('Remove Course')}
                  onClick={this.handleCancelClick}
                />
              </div>
              <a href="#" onClick={this.handleModalHide}>
                {__('Cancel')}
              </a>
            </div>
          </Modal>
        );
      },
    }),
    styles
  )
);
