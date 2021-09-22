import React from 'react';
import { SvgCommentMultiple } from '@coursera/coursera-ui/svg';
import store from 'js/lib/coursera.store';
import { TagLabelType } from 'bundles/course-item-resource-panel/__components/Tag/__types__';
import 'css!./__styles__/index';
import _t from 'i18n!nls/course-item-resource-panel';
import { TagLabelDestructuring } from '../../__providers__/SuggestionsDataProvider/__types__';
import SuggestionsDataProvider from '../../__providers__/SuggestionsDataProvider';
import ForumsPanel, { ShimmerState } from './ForumsPanel';
import { ForumItemProps } from './ForumsPanel/__types__';

type ForumsTabBodyProps = {
  courseId: string;
  itemId: string;
};

export function ForumsTabBodyWithStore() {
  const { courseId, itemId } = store.get('resourcePanelContext');
  return <ForumsTabBody courseId={courseId} itemId={itemId} />;
}

function tagLabel({ isMentorReplied, isStaffReplied }: TagLabelDestructuring) {
  if (isMentorReplied) {
    return _t('mentor replied');
  }

  if (isStaffReplied) {
    return _t('staff replied');
  }

  return undefined;
}

export function ForumsTabBody({ courseId, itemId }: ForumsTabBodyProps) {
  return (
    <div className="rc-ForumsTabBody">
      <h2 className="rc-ForumsTabBody__title">Discussions</h2>
      <SuggestionsDataProvider courseId={courseId} itemId={itemId}>
        {({ loading, error, data }) => {
          if (error) return null;
          if (loading) {
            return <ShimmerState />;
          }
          if (data) {
            const mapItem: ForumItemProps[] = data.map((item) => {
              return {
                forumId: item.forumId,
                forumPostId: item.forumPostId,
                title: item.forumPostTitle,
                description: item.forumPostDescription,
                replies: item.topLevelReplyCount,
                tagLabel: tagLabel(item) as TagLabelType,
              };
            });
            return <ForumsPanel forumItems={mapItem} />;
          }
          return null;
        }}
      </SuggestionsDataProvider>
    </div>
  );
}

export default {
  icon: <SvgCommentMultiple />,
  render: ForumsTabBodyWithStore,
};
