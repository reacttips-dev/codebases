import ClassroomPropTypes from 'components/prop-types';
import { IconCheck } from '@udacity/veritas-icons';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import { __ } from 'services/localization-service';
import styles from './_lesson-collapsed.scss';

@cssModule(styles)
export default class LessonCollapsed extends React.Component {
  static displayName = 'common/lesson-card/_lesson-collapsed';

  static propTypes = {
    lesson: ClassroomPropTypes.lesson.isRequired,
    onClick: PropTypes.func.isRequired,
  };

  render() {
    const { lesson, onClick } = this.props;

    return (
      <div styleName="lesson-collapsed">
        <Link to="#" styleName="curtain" onClick={onClick}>
          {__('View <%= lessonTitle %>', { lessonTitle: lesson.title })}
        </Link>
        <div styleName="details">
          <h3>{lesson.title}</h3>
        </div>
        <h4 styleName="complete">
          <IconCheck color="green" size="sm" text={__('Check mark')} />{' '}
          <span styleName="complete-text">{__('Completed')}</span>
        </h4>
      </div>
    );
  }
}
