//
import { Route, Redirect, IndexRoute } from 'react-router';
import React from 'react';
import loadOnRoute from 'bundles/common/components/loadOnRoute';
import path from 'js/lib/path';
import { getDiscussionsPersonalizationVariant } from 'bundles/course-v2/featureFlags';

const CourseHomeDiscussionsPage = loadOnRoute(
  () => import('bundles/course-home/page-discussion-forums/components/cds/CourseHomeDiscussionsPage')
);

// Switch on the new forum redesign to A/B test it, and allow for feature toggling.
// only lazy load the one that is required.
const ThreadsView = loadOnRoute(() => {
  if (getDiscussionsPersonalizationVariant() === 'control') {
    return import('bundles/discussions/components/forumsV2/ThreadsView');
  } else {
    return import('bundles/discussions/components/personalization/ThreadsView');
  }
});

const ModuleToWeekRedirect = loadOnRoute(() => import('bundles/discussions/components/ModuleToWeekRedirect'));

const DiscussionsLandingPage = loadOnRoute(() =>
  getDiscussionsPersonalizationVariant() === 'control'
    ? import('bundles/course-home/page-discussion-forums/components/cds/DiscussionsLandingPage')
    : import('bundles/course-home/page-discussion-forums/components/personalization/DiscussionsLandingPage')
);

const AllThreadsGoToPage = loadOnRoute(() => {
  if (getDiscussionsPersonalizationVariant() === 'control') {
    return import('bundles/course-home/page-discussion-forums/components/cds/DiscussionsLandingPage');
  } else {
    return import('bundles/discussions/components/personalization/ThreadsView');
  }
});

const DiscussionsSearchPage = loadOnRoute(
  () => import('bundles/course-home/page-discussion-forums/components/personalization/DiscussionsSearchPage')
);

const generateRedirect = (oldPrefix, newPrefix, id) => {
  const key = 'redirectDiscussions_' + oldPrefix + '_to_' + newPrefix;
  return [
    <Redirect from={path.join(oldPrefix, id, 'discussions')} to={path.join('discussions', newPrefix, id)} key={key} />,
    <Redirect
      from={path.join(oldPrefix, id, 'discussions', '*')}
      to={path.join('discussions', newPrefix, id, 'threads', '*')}
      key={key}
    />,
  ];
};

const generateRoute = (name, prefix, id, component) => {
  return (
    <Route
      name={`${name}`}
      path={`${prefix}/${id}(/threads/:question_id(/replies/:answer_id(/comments/:comment_id)))`}
      getComponent={component}
    />
  );
};

export default [
  // main discussions route
  <Route name="discussions" path="discussions" getComponent={CourseHomeDiscussionsPage}>
    <IndexRoute getComponent={DiscussionsLandingPage} />
    <Route name="all-discussions" path="all" getComponent={DiscussionsLandingPage} />
    <Route
      name="all-threads-discussions"
      path="all/threads/:question_id(/replies/:answer_id(/comments/:comment_id))"
      getComponent={AllThreadsGoToPage}
    />
    <Route name="tab-allforums-discussions" path="tab/all" getComponent={DiscussionsLandingPage} />
    <Route name="tab-foryou-discussions" path="tab/foryou" getComponent={DiscussionsLandingPage} />
    <Route name="tab-activity-discussions" path="tab/activity" getComponent={DiscussionsLandingPage} />
    <Route name="search-discussions" path="search" getComponent={DiscussionsSearchPage} />,
    {generateRoute('forum-discussions', 'forums', ':forum_id', ThreadsView)}
    {generateRoute('group-discussions', 'groups', ':group_id', ThreadsView)}
    {generateRoute('week-discussions', 'weeks', ':week_number', ThreadsView)}
    {/* These redirects need to be separate because react-router regex doesn't give us enough flexibility. */}
    <Redirect from=":question_id" to="all/threads/:question_id" />
    <Redirect from=":question_id/replies/:answer_id" to="all/threads/:question_id/replies/:answer_id" />
    <Redirect
      from=":question_id/replies/:answer_id/comments/:comment_id"
      to="all/threads/:question_id/replies/:answer_id/comments/:comment_id"
    />
  </Route>,
  // redirects from old forum, week, group routes to new ones and from old module to new week routes.
  // these redirects must stay in place because users may have deep links to discussions that we want to rewrite.
  <Route
    name="module-discussions"
    path="module/:module_id/discussions(/:question_id(/replies/:answer_id(/comments/:comment_id)))"
    getComponent={ModuleToWeekRedirect}
    key="ModuleToWeekRedirect"
  />,
  ...generateRedirect('forum', 'forums', ':forum_id'),
  ...generateRedirect('week', 'weeks', ':week_number'),
  ...generateRedirect('group', 'groups', ':group_id'),
];
