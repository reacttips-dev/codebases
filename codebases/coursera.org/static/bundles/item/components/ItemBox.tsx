import React from 'react';
import classNames from 'classnames';

import { Box } from '@coursera/coursera-ui';
import ItemFeedback from 'bundles/content-feedback/components/ItemFeedback';
import type { ItemType } from 'bundles/content-feedback/constants/ItemTypes';

import type { Item } from 'bundles/learner-progress/types/Item';

import 'css!./__styles__/ItemBox';

type Props = {
  className?: string;
  hideFeedback?: boolean;

  courseId?: string;
  computedItem?: Item;
  feedbackType?: ItemType;
};

const ItemBox: React.SFC<Props> = ({ className, computedItem, feedbackType, hideFeedback, children }) => (
  <div className={classNames('rc-ItemBox', className)}>
    <div className="item-box-content">
      {children}

      {!hideFeedback && computedItem && feedbackType && (
        <Box rootClassName="item-feedback-container" justifyContent="end">
          <ItemFeedback computedItem={computedItem} itemFeedbackType={feedbackType} />
        </Box>
      )}
    </div>
  </div>
);

export default ItemBox;
