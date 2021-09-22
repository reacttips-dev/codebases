import React from 'react';
import Icon from 'bundles/iconfont/Icon';

import { TrackedA } from 'bundles/page/components/TrackedLink2';
/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import { getWeekDiscussionsUrl } from 'bundles/discussions/utils/discussionsUrl';

import _t from 'i18n!nls/item-lecture';

type Props = {
  weekNumber: number;
};

const DiscussionPromotionCard = ({ weekNumber }: Props) => (
  <TrackedA className="nostyle" trackingName="week_forums" href={getWeekDiscussionsUrl(weekNumber)}>
    <div className="card-one-clicker cozy week-link-card body-1-text horizontal-box align-items-spacebetween">
      {_t('Have a question? Discuss this lecture in the week forums.')}
      <Icon name="chevron-right-thin" size="lg" />
    </div>
  </TrackedA>
);

export default DiscussionPromotionCard;
