import React from 'react';
import CollapsibleLesson from 'bundles/item/components/navigation/CollapsibleLesson';
/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import type Lesson from 'pages/open-course/common/models/lesson';

import 'css!./__styles__/CollapsibleLessonList';

type Props = {
  lessons: Array<Lesson>;
  currentLesson: Lesson;
  currentItemId?: string;
  collapsed?: boolean;
};

const CollapsibleLessonList: React.SFC<Props> = ({ lessons, currentLesson, currentItemId, collapsed }) => (
  <ul className="rc-CollapsibleLessonList nostyle" aria-hidden={collapsed}>
    {lessons.map((lesson) => (
      <li key={lesson.get('id')}>
        <CollapsibleLesson
          lesson={lesson}
          currentItemId={currentItemId}
          isInitiallyCollapsed={lesson.get('id') !== currentLesson.get('id')}
        />
      </li>
    ))}
  </ul>
);

export default CollapsibleLessonList;
