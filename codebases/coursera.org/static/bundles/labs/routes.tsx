import React from 'react';
import { Route } from 'react-router';
import loadOnRoute from 'bundles/common/components/loadOnRoute';
import { LAB_SANDBOX_PATH_PART_NAME } from 'bundles/labs-common/utils/LabSandboxUtils';
import { isCdsProgrammingAssignmentPageEnabled } from 'bundles/course-v2/featureFlags';

const LabSandboxPage = loadOnRoute(() =>
  isCdsProgrammingAssignmentPageEnabled()
    ? import('bundles/labs/components/cds/LabSandboxPage')
    : import('bundles/labs/components/LabSandboxPage')
);

export default (
  <Route>
    <Route path={LAB_SANDBOX_PATH_PART_NAME} name="labSandbox" getComponent={LabSandboxPage} />
  </Route>
);
