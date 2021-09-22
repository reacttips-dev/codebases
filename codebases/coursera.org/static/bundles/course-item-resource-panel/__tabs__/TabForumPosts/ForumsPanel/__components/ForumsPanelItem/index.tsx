import React from 'react';
import CML from 'bundles/cml/components/CML';
import ForumRepliesCount from 'bundles/course-item-resource-panel/__components/ForumRepliesCount';
import Tag from 'bundles/course-item-resource-panel/__components/Tag';
import { ForumItemProps } from 'bundles/course-item-resource-panel/__tabs__/TabForumPosts/ForumsPanel/__types__';
import { ShimmerSentence } from 'bundles/course-item-resource-panel/__components/ShimmerLib';

import 'css!./__styles__/ForumsPanelItem';

export function ShimmerState() {
  return (
    <div className="rc-ForumsPanelItem rc-ForumsPanelItem__shimmer">
      <h3 className="rc-ForumsPanelItem__title">
        <ShimmerSentence width="66%" />
      </h3>
      <div className="rc-ForumsPanelItem__description">
        <ShimmerSentence width="90%" />
        <ShimmerSentence width="90%" />
        <ShimmerSentence width="30%" />
      </div>
    </div>
  );
}

export default function ForumsPanelItem({ title, description, replies, tagLabel }: ForumItemProps) {
  return (
    <div className="rc-ForumsPanelItem">
      <h3 className="rc-ForumsPanelItem__title">{title}</h3>
      <div className="rc-ForumsPanelItem__description">
        <CML cml={description} />
      </div>
      <div>
        {replies !== undefined && <ForumRepliesCount count={replies} />}
        {tagLabel && replies !== undefined && <span className="rc-ForumsPanelItem__spacer" />}
        {tagLabel && <Tag label={tagLabel} />}
      </div>
    </div>
  );
}
