import React from 'react';
import classNames from 'classnames';

import LessonItems from 'bundles/item/components/LessonItems';
/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import type Lesson from 'pages/open-course/common/models/lesson';

import 'css!./__styles__/CollapsibleLesson';

type Props = {
  lesson: Lesson;
  currentItemId?: string;
  isInitiallyCollapsed: boolean;
};

type State = {
  isCollapsed: boolean;
};

class CollapsibleLesson extends React.Component<Props, State> {
  static defaultProps = {
    isInitiallyCollapsed: true,
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      isCollapsed: props.isInitiallyCollapsed,
    };
  }

  toggleItems = () => {
    const { isCollapsed } = this.state;

    this.setState({ isCollapsed: !isCollapsed });
  };

  componentDidUpdate(prevProps: Props) {
    const { lesson, currentItemId } = this.props;
    if (prevProps.currentItemId !== this.props.currentItemId && lesson.getItemMetadata(currentItemId) !== undefined) {
      this.setState({ isCollapsed: false });
    }
  }

  render() {
    const { lesson, currentItemId } = this.props;
    const { isCollapsed } = this.state;
    const highlighted = lesson.getItemMetadata(currentItemId) !== undefined;
    const lessonName = lesson.get('name');

    return (
      <div className="rc-CollapsibleLesson">
        <button type="button" className="nostyle link-button" onClick={this.toggleItems} aria-expanded={!isCollapsed}>
          <h2 className={classNames('lesson-name', 'headline-1-text', 'color-primary-text', { highlighted })}>
            {lessonName}
          </h2>
        </button>

        {!isCollapsed && (
          <div className="item-list">
            <LessonItems items={lesson.getItemMetadatas().toArray()} currentItemId={currentItemId} />
          </div>
        )}
      </div>
    );
  }
}

export default CollapsibleLesson;
