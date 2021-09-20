import Card from 'components/common/card';
import ClassroomPropTypes from 'components/prop-types';
import LessonCollapsed from './_lesson-collapsed';
import LessonExpanded from './_lesson-expanded';
import LessonHelper from 'helpers/lesson-helper';
import { Link } from 'react-router';
import NodeHelper from 'helpers/node-helper';
import PropTypes from 'prop-types';
import { __ } from 'services/localization-service';
import { scrollTargetId } from './_helpers';
import styles from './index.scss';

export { scrollTargetId };

@cssModule(styles)
export default class LessonCard extends React.Component {
  static displayName = 'common/lesson-card';

  static propTypes = {
    defaultExpanded: PropTypes.bool,
    disabled: PropTypes.bool,
    lesson: ClassroomPropTypes.lesson.isRequired,
    path: PropTypes.string.isRequired,
    tag: PropTypes.string,
    isStatic: PropTypes.bool,
  };

  static defaultProps = {
    defaultExpanded: true,
    disabled: false,
    isStatic: false,
  };

  state = {
    isExpanded: this.props.defaultExpanded,
  };

  handleToggleExpand = (evt) => {
    evt.preventDefault();
    this.setState({
      isExpanded: !this.state.isExpanded,
    });
  };

  _getButtonActionLabel({ hasStarted, isCompleted }) {
    if (isCompleted) {
      return __('View');
    } else {
      return hasStarted ? __('Continue') : __('Start');
    }
  }

  _getActionLabel() {
    const { lesson } = this.props;
    const hasStarted = NodeHelper.hasStarted(lesson);
    return this._getButtonActionLabel({
      isCompleted: LessonHelper.isCompleted(lesson),
      hasStarted,
    });
  }

  render() {
    const { disabled, lesson, path, tag, isStatic } = this.props;
    const { isExpanded } = this.state;
    const actionLabel = this._getActionLabel();

    return (
      <Card styleName="lesson-card" interactive={isExpanded && !disabled}>
        {isExpanded && !disabled && (
          <Link to={path} styleName="curtain">
            {actionLabel}
          </Link>
        )}
        <div styleName="container">
          <span id={scrollTargetId(lesson)} styleName="scroll-target" />
          {isExpanded ? (
            <LessonExpanded
              disabled={disabled}
              lesson={lesson}
              path={path}
              onCollapse={this.handleToggleExpand}
              tag={tag}
              isStatic={isStatic}
            />
          ) : (
            <LessonCollapsed
              lesson={lesson}
              onClick={this.handleToggleExpand}
            />
          )}
        </div>
      </Card>
    );
  }
}
