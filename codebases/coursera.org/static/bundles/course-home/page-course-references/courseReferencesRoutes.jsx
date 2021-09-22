import React from 'react';
import { Route } from 'react-router';
import loadOnRoute from 'bundles/common/components/loadOnRoute';

const CourseReferencesPage = loadOnRoute(() =>
  import('bundles/course-home/page-course-references/components/CourseReferencesPage')
);

export default [
  <Route path="resources" getComponent={CourseReferencesPage} name="resources" />,
  <Route path="resources/:reference_id" getComponent={CourseReferencesPage} name="resourcesWithRefId" />,
  <Route
    path="resources/:reference_id/:short_slug"
    getComponent={CourseReferencesPage}
    name="resourcesWithRefIdAndSlug"
  />,
];
