import React from 'react';
import { compose } from 'recompose';
import classNames from 'classnames';

import ItemChoiceBanner from 'bundles/item/components/ItemChoiceBanner';
import ItemViewHonorsModalContainer from 'bundles/item/components/ItemViewHonorsModalContainer';

import ItemPrimaryNavigation from 'bundles/item/components/navigation/ItemPrimaryNavigation';
import ItemSecondaryNavigation from 'bundles/item/components/navigation/ItemSecondaryNavigation';

/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import type Lesson from 'pages/open-course/common/models/lesson';
/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import type ItemGroupChoice from 'pages/open-course/common/models/itemGroupChoice';

/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import withShowEnrollmentStateBanner from 'bundles/preview/containers/withShowEnrollmentStateBanner';

import { Box } from '@coursera/coursera-ui';

/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import waitForStores from 'bundles/phoenix/lib/waitForStores';
import isMobileApp from 'js/lib/isMobileApp';

import 'css!./__styles__/ItemNavigation';
import ResourcePanel, { epics as ResourcePanelEpics } from 'bundles/course-item-resource-panel';

type Props = OuterProps & {
  showEnrollmentStateBanner: boolean;
  weekNumber: number;
  currentLesson: Lesson;
  currentItemId: string;
  currentChoice?: ItemGroupChoice;
  isInChoice: boolean;
  courseId: string;
  courseSlug: string;
  highlightSidebarExpanded: boolean;
};

type OuterProps = {
  weekNumber: number;
  currentLesson: Lesson;
  currentItemId: string;
  isItemGroupDescriptionPage?: boolean;
};

class ItemNavigation extends React.Component<Props> {
  resourcePanelEnabled: boolean;

  constructor(props: $TSFixMe) {
    super(props);
    this.resourcePanelEnabled = ResourcePanelEpics.enabledResourcePanelToPublic();
  }

  render() {
    const {
      courseSlug,
      currentLesson,
      currentItemId,
      weekNumber,
      showEnrollmentStateBanner,
      highlightSidebarExpanded,
      currentChoice,
      children,
    } = this.props;

    return (
      <Box
        rootClassName={classNames('rc-ItemNavigation', {
          showEnrollmentStateBanner,
          highlightSidebarExpanded,
        })}
        justifyContent="start"
        alignItems="stretch"
        flexDirection="column"
      >
        <ItemViewHonorsModalContainer lesson={currentLesson} />

        {/* Hide the primary nav on mobile app if embedded */}
        {/* The mobile app has its own nav */}
        {!isMobileApp.get() && (
          <ItemPrimaryNavigation
            courseSlug={courseSlug}
            lesson={currentLesson}
            itemId={currentItemId}
            weekNumber={weekNumber}
          />
        )}

        <Box
          rootClassName="item-tools-and-content-container"
          justifyContent="start"
          alignItems="stretch"
          flexDirection="row"
        >
          {/* Hide the secondary nav on mobile app if embedded */}
          {/* The mobile app has its own nav */}
          {!isMobileApp.get() && (
            <ItemSecondaryNavigation lesson={currentLesson} itemId={currentItemId} weekNumber={weekNumber} />
          )}
          <div data-id="item-scroll-container" className="item-scroll-container">
            {/* @ts-expect-error ts-migrate(2322) FIXME: Type '{ choice: any; }' is not assignable to type ... Remove this comment to see the full error message */}
            {!!currentChoice && <ItemChoiceBanner choice={currentChoice} />}
            {children}
          </div>
          {this.resourcePanelEnabled && !isMobileApp.get() && (
            <ResourcePanel courseSlug={this.props.courseSlug} courseId={this.props.courseId} itemId={currentItemId} />
          )}
        </Box>
      </Box>
    );
  }
}

export default compose<Props, OuterProps>(
  // TODO: Decouple this component's layout from enrollment state banner
  withShowEnrollmentStateBanner(),
  waitForStores(
    ['CourseStore', 'HighlightingUIPanelVisibilityPreferenceStore'],
    ({ CourseStore, HighlightingUIPanelVisibilityPreferenceStore }: $TSFixMe, { currentItemId }: $TSFixMe) => {
      const courseMaterials = CourseStore.getMaterials();
      const itemMetadata = courseMaterials && currentItemId && courseMaterials.getItemMetadata(currentItemId);
      const currentChoice = itemMetadata && itemMetadata.getChoice();
      const isLecture = itemMetadata.isLecture();

      return {
        currentChoice,
        isInChoice: !!currentChoice,
        courseId: CourseStore.getCourseId(),
        courseSlug: CourseStore.getCourseSlug(),
        highlightSidebarExpanded:
          isLecture && HighlightingUIPanelVisibilityPreferenceStore.getUIPanelVisibilityPreference(),
      };
    }
  )
)(ItemNavigation);
