import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { compose, branch, renderComponent } from 'recompose';

import Retracked from 'js/app/retracked';
import CourseraMetatags from 'bundles/seo/components/CourseraMetatags';

import {
  LearnerImpersonationBanner,
  withPartnerLearnerImpersonationSessionData,
} from 'bundles/course-staff-impersonation';
import type { ActAsLearnerSessionProps } from 'bundles/course-staff-impersonation';
import ItemHeader from 'bundles/item/components/ItemHeader';
import ItemNavigation from 'bundles/item/components/ItemNavigation';

import ItemNotFound from 'bundles/item/components/ItemNotFound';
import HonorCodeModal from 'bundles/item/components/HonorCodeModal';

import ItemLockedCover from 'bundles/learner-progress/components/item/locking/ItemLockedCover';
import LatePenaltyNotification from 'bundles/ondemand/components/common/LatePenaltyNotification';
import TrackPageViewAction from 'bundles/ui-actions/components/TrackPageViewAction';

import { PAGE_VIEW_ITEM_PAGE } from 'bundles/ui-actions/constants/actionTypes';
import type { Item } from 'bundles/learner-progress/types/Item';
import {
  getIsGradable,
  getIsLockedFully,
  getIsLockedForSessions,
  getIsLockedItemPreviewable,
  getIsLockedByResit,
} from 'bundles/learner-progress/utils/Item';

import isMobileApp from 'js/lib/isMobileApp';
import connectToRouter from 'js/lib/connectToRouter';
import connectToStores from 'vendor/cnpm/fluxible.v0-4/addons/connectToStores';
import withComputedItem from 'bundles/learner-progress/utils/withComputedItem';

import AliceItemViewEvent from 'bundles/alice/models/AliceItemViewEvent';
import AliceItemFailEvent from 'bundles/alice/models/AliceItemFailEvent';
import AliceItemSuccessEvent from 'bundles/alice/models/AliceItemSuccessEvent';
import withAliceNotification from 'bundles/alice/lib/withAliceNotification';

import type ItemMetadata from 'pages/open-course/common/models/itemMetadata';

import _t from 'i18n!nls/item';

import 'css!./__styles__/ItemPage';

type Props = {
  computedItem: Item;
  children: JSX.Element;
  itemMetadata: ItemMetadata;
  refetchLearnerGoals?: () => void;
} & ActAsLearnerSessionProps;

class ItemPage extends React.Component<Props> {
  static contextTypes = {
    getStore: PropTypes.func,
  };

  componentWillReceiveProps(props: Props) {
    const { refetchLearnerGoals } = props;

    if (refetchLearnerGoals) {
      refetchLearnerGoals();
    }
  }

  isOnMobile = () => {
    const { getStore } = this.context;
    const applicationStore = getStore('ApplicationStore');
    const userAgent = applicationStore.getUserAgent();
    const isMobileBrowser = userAgent && userAgent.isMobileBrowser;

    return isMobileApp.get() || isMobileBrowser;
  };

  render() {
    const {
      actAsLearnerSession,
      computedItem,
      computedItem: { courseId, id, name, gradingLatePenalty, weekNumber, isGraded, isSubmitted },
      children,
      itemMetadata,
    } = this.props;

    const isLocked =
      getIsLockedFully(computedItem) || getIsLockedForSessions(computedItem) || getIsLockedByResit(computedItem);
    const isLockedItemPreviewable = getIsLockedItemPreviewable(computedItem);

    return (
      <TrackPageViewAction name={PAGE_VIEW_ITEM_PAGE} itemId={id} courseId={courseId}>
        <div className="rc-ItemPage">
          <CourseraMetatags title={name} description={itemMetadata.get('lesson.module.description')} />
          {actAsLearnerSession ? (
            <LearnerImpersonationBanner actAsLearnerSession={actAsLearnerSession} />
          ) : (
            <ItemHeader />
          )}

          <ItemNavigation currentItemId={id} currentLesson={itemMetadata.get('lesson')} weekNumber={weekNumber}>
            {!!gradingLatePenalty && (
              <LatePenaltyNotification
                latePenalty={gradingLatePenalty}
                deadline={computedItem.deadline}
                deadlineProgress={computedItem.deadlineProgress}
                appliedLatePenalty={computedItem.appliedLatePenalty}
                isGraded={isGraded}
                isSubmitted={isSubmitted}
              />
            )}

            <main
              className={classNames('item-page-content', { mobile: this.isOnMobile() })}
              style={{ height: '100%' }}
              id="main"
            >
              {(!isLocked || isLockedItemPreviewable) &&
                React.cloneElement(children, {
                  computedItem,
                  itemMetadata,
                  key: id,
                })}

              {/* @ts-expect-error withCourseFullStory has wrong types */}
              {isLocked && !isLockedItemPreviewable && <ItemLockedCover computedItem={computedItem} />}
            </main>
          </ItemNavigation>

          {/* Modals */}
          {getIsGradable(computedItem) && <HonorCodeModal />}
        </div>
      </TrackPageViewAction>
    );
  }
}

/** @deprecated Private export for tests only */
export const ItemPageView = ItemPage;

export default compose(
  connectToRouter(({ params }) => ({
    itemId: params.item_id,
  })),
  // @ts-expect-error TSMIGRATION
  connectToStores(['CourseStore', 'SessionStore'], ({ CourseStore, SessionStore }, { itemId }) => {
    const courseId = CourseStore.getCourseId();
    const courseSlug = CourseStore.getCourseSlug();
    const courseName = CourseStore.getMetadata().get('name');
    const courseBranchId = SessionStore.getBranchId() || courseId;

    const itemMetadata = CourseStore.getMaterials().getItemMetadata(itemId);

    return {
      courseId,
      courseName,
      courseSlug,
      courseBranchId,
      itemMetadata,
    };
  }),
  // @ts-expect-error TSMIGRATION
  branch(({ itemMetadata }) => !itemMetadata, renderComponent(ItemNotFound)),
  withComputedItem,
  Retracked.createTrackedContainer<$TSFixMe>(({ courseId, itemId }) => {
    return {
      namespace: {
        page: 'item_layout',
      },

      // eslint-disable-next-line camelcase
      course_id: courseId,
      // eslint-disable-next-line camelcase
      item_id: itemId,
    };
  }),
  withAliceNotification(
    // @ts-expect-error ts-migrate(2345) FIXME: Argument of type '({ courseBranchId, computedItem ... Remove this comment to see the full error message
    ({ courseBranchId, computedItem }: any) => {
      const {
        contentSummary: { typeName },
      } = computedItem;

      // For item types with different status pages (i.e. quiz and exams),
      // we defer Alice events to individual item pages.
      if (['quiz', 'exam'].includes(typeName)) {
        return null;
      }

      if (computedItem.isFailed && computedItem.isSubmitted) {
        return new AliceItemFailEvent({ courseBranchId, itemId: computedItem.id });
      } else if (computedItem.isPassed && computedItem.isSubmitted) {
        return new AliceItemSuccessEvent({ courseBranchId, itemId: computedItem.id });
      } else {
        return new AliceItemViewEvent({ courseBranchId, itemId: computedItem.id });
      }
    },
    // eslint-disable-next-line camelcase
    ({ courseId }: any) => ({ course_id: courseId })
  ),
  withPartnerLearnerImpersonationSessionData
  // @ts-expect-error TSMIGRATION
)(ItemPage);
