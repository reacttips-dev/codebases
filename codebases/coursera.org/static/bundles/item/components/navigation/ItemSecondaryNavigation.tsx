import React from 'react';
import classNames from 'classnames';

import CollapsibleLessonList from 'bundles/item/components/navigation/CollapsibleLessonList';
import SecondaryNavTogglePanel from 'bundles/item/components/navigation/SecondaryNavTogglePanel';
import { getLessonsForWeek } from 'bundles/ondemand/stores/StoreComputationHelpers';

import { Box } from '@coursera/coursera-ui';
import epic from 'bundles/epic/client';
import store from 'js/lib/coursera.store';
/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import { isTabletOrSmaller } from 'bundles/phoenix/utils/matchMedia';

/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import type Lesson from 'pages/open-course/common/models/lesson';
/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import waitForStores from 'bundles/phoenix/lib/waitForStores';

import 'css!./__styles__/ItemSecondaryNavigation';

type Props = {
  itemId: string;
  lesson: Lesson;
  lessons: Array<Lesson>;
};

type State = {
  collapsed: boolean;
};

const NAV_COLLAPSED_KEY = 'itemSecondaryNavCollapsed';
// Epic experiment to check discoverability
// if secondary nav starts closed / open does learner behavior change?
const getInitialCollapsedState = () => {
  const collapsedStoreValue = store.get(NAV_COLLAPSED_KEY);
  if (epic.get('Flex', 'secondaryNavStartCollapsed')) {
    return collapsedStoreValue === undefined || collapsedStoreValue || isTabletOrSmaller();
  } else {
    return collapsedStoreValue || isTabletOrSmaller();
  }
};

class ItemSecondaryNavigation extends React.Component<Props, State> {
  state = {
    collapsed: getInitialCollapsedState(),
  };

  toggleCollapse = () => {
    this.setState((prevState) => {
      const newCollapsedState = !prevState.collapsed;
      store.set(NAV_COLLAPSED_KEY, newCollapsedState);
      return { collapsed: newCollapsedState };
    });
  };

  render() {
    const { lessons, lesson, itemId } = this.props;
    const { collapsed } = this.state;

    const classes = classNames('rc-ItemSecondaryNavigation', 'theme-white', 'c-item-navigation-container', {
      collapsed,
    });

    return (
      <Box rootClassName={classes} justifyContent="start" alignItems="stretch" style={{ flexGrow: 0 }}>
        <SecondaryNavTogglePanel active={!collapsed} onToggleClick={this.toggleCollapse} />
        <CollapsibleLessonList lessons={lessons} currentLesson={lesson} currentItemId={itemId} collapsed={collapsed} />
      </Box>
    );
  }
}

export default waitForStores(
  ItemSecondaryNavigation,
  // TODO fluxible stores are deprecated, so this needs to be migrated eventually
  // eslint-disable-next-line no-restricted-syntax
  ['CourseStore', 'CourseScheduleStore'],
  ({ CourseStore, CourseScheduleStore }: $TSFixMe, props: $TSFixMe) => {
    return {
      lessons: getLessonsForWeek(CourseStore, CourseScheduleStore, props.weekNumber),
    };
  }
);
