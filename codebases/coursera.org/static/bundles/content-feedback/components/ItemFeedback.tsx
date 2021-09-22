import type { Item } from 'bundles/learner-progress/types/Item';

import React from 'react';
import PropTypes from 'prop-types';

import _ from 'underscore';
import { compose } from 'recompose';

import user from 'js/lib/user';
import Retracked from 'js/lib/retracked';
// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'js/l... Remove this comment to see the full error message
import provideFluxibleAppContext from 'js/lib/provideFluxibleAppContext';
import connectToStores from 'vendor/cnpm/fluxible.v0-4/addons/connectToStores';
// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'page... Remove this comment to see the full error message
import { isBlacklistedInEpic } from 'pages/open-course/common/utils/experiment';

import ItemFeedbackContent from 'bundles/content-feedback/components/item-feedback/ItemFeedbackContent';

import ItemTypes from 'bundles/content-feedback/constants/ItemTypes';
import type { ItemType } from 'bundles/content-feedback/constants/ItemTypes';
import itemFeedbackApp from 'bundles/content-feedback/itemFeedbackApp';

import 'css!./__styles__/ItemFeedback';

type InputProps = {
  courseId?: string;
  computedItem: Item;
  itemFeedbackType: ItemType;
};

type PropsToComponent = InputProps & {
  courseId: string;
  // TODO tighten
  // NOTE tooltipPlacement is actually an optional type for the caller
  // there is a default prop
  tooltipPlacement: string;
  subItemId?: string;
};

class ItemFeedback extends React.Component<PropsToComponent> {
  static contextTypes = {
    track: PropTypes.func.isRequired,
  };

  static defaultProps = {
    tooltipPlacement: 'bottom',
  };

  render() {
    const { computedItem, itemFeedbackType, courseId, subItemId, tooltipPlacement } = this.props;
    const { id: itemId } = computedItem;

    const isInvalidItemType = _(ItemTypes).values().indexOf(itemFeedbackType) === -1;

    const isBlacklistedCourse = isBlacklistedInEpic('featureBlacklist', 'itemFeedback', courseId);

    if (!user.isAuthenticatedUser() || isInvalidItemType || isBlacklistedCourse) {
      return null;
    }

    return (
      <div className="rc-ItemFeedback">
        <ItemFeedbackContent
          key={itemId}
          computedItem={computedItem}
          itemFeedbackType={itemFeedbackType}
          courseId={courseId}
          subItemId={subItemId}
          tooltipPlacement={tooltipPlacement}
        />
      </div>
    );
  }
}

class TrackedItemFeedback extends React.Component<PropsToComponent> {
  static childContextTypes = {
    track: PropTypes.func,
  };

  getChildContext() {
    const { courseId, computedItem } = this.props;
    const { id: itemId } = computedItem;

    return {
      // NOTE: This is a legacy usage of `makeTracker` API to support its child being rendered inside a Backbone view.
      // Please do not copy this usage going forwards.
      track: Retracked.makeTracker({
        namespace: 'content_learner.rating_items',
        include: {
          bucket_id: 'A2',
          item_id: itemId,
          course_id: courseId,
        },
      }),
    };
  }

  render() {
    const { courseId, computedItem, itemFeedbackType, subItemId, tooltipPlacement } = this.props;

    return (
      <ItemFeedback
        computedItem={computedItem}
        itemFeedbackType={itemFeedbackType}
        courseId={courseId}
        subItemId={subItemId}
        tooltipPlacement={tooltipPlacement}
      />
    );
  }
}

const FluxibleItemFeedback = compose<PropsToComponent, InputProps>(
  provideFluxibleAppContext(itemFeedbackApp),
  // NOTE: this is only here because quiz views still use Backbone code
  connectToStores<PropsToComponent, Omit<PropsToComponent, 'courseId'>>(['CourseStore'], ({ CourseStore }) => ({
    courseId: CourseStore.getCourseId(),
  }))
)(TrackedItemFeedback);

export default FluxibleItemFeedback;
export const BaseComp = ItemFeedback;
