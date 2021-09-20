import ClassroomPropTypes from 'components/prop-types';
import NextDialog from './_next-dialog';
import NodeHelper from 'helpers/node-helper';
import PropTypes from 'prop-types';
import RouteMixin from 'mixins/route-mixin';
import StateHelper from 'helpers/state-helper';
import { __ } from 'services/localization-service';
import { connect } from 'react-redux';
import createReactClass from 'create-react-class';

var mapStateToProps = (state, ownProps) => ({
  lesson: _.first(
    StateHelper.getLessonsByModuleKey(state, ownProps.module.key)
  ),
});

export default connect(mapStateToProps)(
  createReactClass({
    displayName: 'concepts/_next-module-dialog',

    propTypes: {
      isOpen: PropTypes.bool,
      onRequestClose: PropTypes.func,
      module: ClassroomPropTypes.module.isRequired,
      currentLesson: ClassroomPropTypes.lesson.isRequired,
    },

    mixins: [RouteMixin],

    getDefaultProps() {
      return {
        isOpen: false,
        onRequestClose: _.noop,
      };
    },

    render() {
      var {
        isOpen,
        onRequestClose,
        module,
        lesson,
        currentLesson,
        isPaidCourse,
      } = this.props;

      return lesson ? (
        <NextDialog
          isOpen={isOpen}
          onRequestClose={onRequestClose}
          title={__(NodeHelper.getTitle(currentLesson))}
          bodyTitle={__(NodeHelper.getTitle(lesson))}
          button={{
            label: __('Start Next Lesson'),
            url: isPaidCourse
              ? this.lastViewedPaidCoursesConceptPath({
                  moduleKey: module.key,
                  lessonKey: lesson.key,
                })
              : this.lastViewedConceptPath({
                  moduleKey: module.key,
                  lessonKey: lesson.key,
                }),
          }}
          currentContent={currentLesson}
        />
      ) : null;
    },
  })
);
