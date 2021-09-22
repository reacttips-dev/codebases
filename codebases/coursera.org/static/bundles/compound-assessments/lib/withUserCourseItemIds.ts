// `withUserCourseItemIds` is HOC that injects `userId`, `courseId` and `itemId`. These props
// are commonly used to fetch data for Compound Assessments.
// It will get `itemId` from route, `userId` from logged in user and `courseId` from store.
// If these props are already passed, it will use existing props.

import React from 'react';

import { compose, branch } from 'recompose';
import user from 'js/lib/user';

import connectToRouter from 'js/lib/connectToRouter';
import connectToStores from 'vendor/cnpm/fluxible.v0-4/addons/connectToStores';

export type WithUserCourseItemIdsProps = {
  userId: number;
  itemId: string;
  courseId: string;
};

type WithUserCourseItemIdsHOC = <P extends {}>(
  component: React.ComponentType<P & WithUserCourseItemIdsProps>
) => React.ComponentClass<P & Partial<WithUserCourseItemIdsProps>>;

const withCourseIdFromCourseStore = connectToStores<WithUserCourseItemIdsProps, Partial<WithUserCourseItemIdsProps>>(
  ['CourseStore'],
  ({ CourseStore }, { courseId }) => ({
    courseId: courseId || CourseStore.getCourseId(),
  })
);

const withUserCourseItemIds = compose<WithUserCourseItemIdsProps, Partial<WithUserCourseItemIdsProps>>(
  connectToRouter<WithUserCourseItemIdsProps, Partial<WithUserCourseItemIdsProps>>(
    ({ params: { item_id: routerItemId } }, { itemId, userId }) => ({
      itemId: itemId || routerItemId,
      userId: userId || user.get().id,
    })
  ),
  branch<WithUserCourseItemIdsProps>(({ courseId }) => !courseId, withCourseIdFromCourseStore)
) as WithUserCourseItemIdsHOC;

type WithUserCourseItemIdsRenderProps = WithUserCourseItemIdsProps & {
  children: (props: WithUserCourseItemIdsProps) => React.ReactNode;
};

export const UserCourseItemIds = withUserCourseItemIds((({ children, ...props }) => children(props)) as React.SFC<
  WithUserCourseItemIdsRenderProps
>);

export default withUserCourseItemIds;
