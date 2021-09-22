import React from 'react';
import ToolbarBox from 'bundles/preview/components/ToolbarBox';

// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import Groups from 'bundles/naptimejs/resources/groups.v1';

import 'css!bundles/preview/components/__styles__/EnrolledGroups';

type Props = {
  enrolledGroups: Array<Groups>;
};

const Label: React.SFC<Props> = ({ enrolledGroups }) => {
  const firstGroup: Groups = enrolledGroups[0];
  const groupName: string | undefined = firstGroup && firstGroup.definition.name;

  if (enrolledGroups.length > 1) {
    return (
      <span>
        {groupName} +{enrolledGroups.length - 1}
      </span>
    );
  } else {
    return <span>{groupName}</span>;
  }
};

const EnrolledGroups: React.SFC<Props> = ({ enrolledGroups }) =>
  enrolledGroups.length > 0 ? (
    <ToolbarBox className="rc-EnrolledGroups">
      <Label enrolledGroups={enrolledGroups} />
    </ToolbarBox>
  ) : null;

export default EnrolledGroups;
