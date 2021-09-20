import NextDialog from './_next-dialog';
import NodeHelper from 'helpers/node-helper';
import PropTypes from 'prop-types';
import RouteMixin from 'mixins/route-mixin';
import { __ } from 'services/localization-service';
import createReactClass from 'create-react-class';

export default createReactClass({
  displayName: 'concepts/_next-lesson-dialog',

  propTypes: {
    isOpen: PropTypes.bool,
    onRequestClose: PropTypes.func,
    lesson: PropTypes.object.isRequired,
    currentLesson: PropTypes.object.isRequired,
  },

  mixins: [RouteMixin],

  getDefaultProps() {
    return {
      isOpen: false,
      onRequestClose: _.noop,
    };
  },

  render() {
    var { isOpen, currentLesson, onRequestClose, lesson, url } = this.props;

    return (
      <NextDialog
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        title={__(NodeHelper.getTitle(currentLesson))}
        bodyTitle={__(NodeHelper.getTitle(lesson))}
        duration={lesson.duration}
        bodyText={lesson.summary}
        button={{
          label: __('Start Next Lesson'),
          url,
        }}
        currentContent={currentLesson}
      />
    );
  },
});
