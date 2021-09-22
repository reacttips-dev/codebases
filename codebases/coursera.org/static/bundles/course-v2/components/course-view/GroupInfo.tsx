import React from 'react';
import _t from 'i18n!nls/course-v2';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import GroupSummary from 'bundles/authoring/groups/models/GroupSummary';

/**
 * A component for displaying the status of a session group in the GroupSwitcher
 */

type Props = {
  group: GroupSummary;
};

const GroupInfo = ({ group }: Props) => <span className="rc-GroupInfo">{_t(group.name)}</span>;

export default GroupInfo;
