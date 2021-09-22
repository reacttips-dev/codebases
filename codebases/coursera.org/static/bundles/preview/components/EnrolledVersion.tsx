import React from 'react';
import ToolbarBox from 'bundles/preview/components/ToolbarBox';
import PillPrivate from 'bundles/preview/components/pills/PillPrivate';
import BranchStatusPill from 'bundles/authoring/branches/components/BranchStatusPill';

import type AuthoringCourse from 'bundles/author-common/models/AuthoringCourse';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import type AuthoringBranchProperties from 'bundles/naptimejs/resources/authoringBranchProperties.v1';

import 'css!bundles/preview/components/__styles__/EnrolledVersion';

type Props = {
  course: AuthoringCourse;
  version: AuthoringBranchProperties;
};

const EnrolledVersion = ({ course, version }: Props) => {
  const versionName: string = version.properties.name || course.name;

  return (
    <ToolbarBox className="rc-EnrolledVersion">
      <span className="enrolled-version-name">{versionName}</span>
      {version.properties.isPrivate && <PillPrivate />}
      <BranchStatusPill status={version.properties.branchStatus} />
    </ToolbarBox>
  );
};

export default EnrolledVersion;
