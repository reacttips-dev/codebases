import React from 'react';
import { formatCount } from 'bundles/course-item-resource-panel/__helpers__/displayHelpers';
import { FormattedMessage } from 'js/lib/coursera.react-intl';
import _t from 'i18n!nls/course-item-resource-panel';
import { RepliesCountProps } from './__types__';
import 'css!./__styles__/index';

export default function ForumRepliesCount({ count }: RepliesCountProps) {
  const content = _t('{count, plural, =0 {0 Replies} =1 {1 Reply} other {{count} Replies}}');
  return (
    <span className="rc-ForumRepliesCount">
      <FormattedMessage message={content} count={formatCount(count)} />
    </span>
  );
}
