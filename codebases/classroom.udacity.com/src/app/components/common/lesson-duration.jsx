import ClassroomPropTypes from 'components/prop-types';
import Duration from 'components/common/duration';
import LabHelper from 'helpers/lab-helper';
import NodeHelper from 'helpers/node-helper';
import ProjectHelper from 'helpers/project-helper';

export function calculateLessonDuration(lesson) {
  const { project, lab } = lesson;

  if (project) {
    return ProjectHelper.isSubmitted(project) ? 0 : project.duration;
  }

  if (lab) {
    return LabHelper.isPassed(lab) ? 0 : lab.duration;
  }

  const lessonCompletion = NodeHelper.getCompletionPercentage(lesson);
  return (1 - lessonCompletion / 100) * lesson.duration;
}

export default class LessonDuration extends React.Component {
  static propTypes = {
    lesson: ClassroomPropTypes.lesson.isRequired,
  };

  _showAsRemainder() {
    const {
      lesson,
      lesson: { project, lab },
    } = this.props;

    if (project || lab) {
      return false;
    } else {
      return NodeHelper.getCompletionPercentage(lesson) > 0;
    }
  }

  render() {
    const { lesson } = this.props;
    const duration = calculateLessonDuration(lesson);

    return (
      <Duration duration={duration} showAsRemainder={this._showAsRemainder()} />
    );
  }
}
