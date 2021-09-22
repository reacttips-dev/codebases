import React from 'react';

import { color } from '@coursera/coursera-ui';
import ItemIcon from 'bundles/item/components/ItemIcon';
import { SvgCheckSolid, SvgCircleWarning, SvgLockFilled } from '@coursera/coursera-ui/svg';
import { getIsLocked } from 'bundles/learner-progress/utils/Item';

import { rtlStyle } from 'js/lib/language';

import { Item } from 'bundles/learner-progress/types/Item';
import _t from 'i18n!nls/learner-progress';

type Props = {
  computedItem: Item;
  size: number;
};

class LearnItemIcon extends React.Component<Props> {
  render() {
    const { computedItem, size } = this.props;

    const style = rtlStyle({ marginRight: 12 });

    if (computedItem.isFailed) {
      return <SvgCircleWarning title={_t('Warning')} fill={color.error} size={size} style={style} />;
    }

    if (computedItem.isCompleted || computedItem.isPassed) {
      return <SvgCheckSolid title={_t('Completed')} fill="#1F8354" size={size} style={style} />;
    }

    if (getIsLocked(computedItem)) {
      return <SvgLockFilled title={_t('Locked')} fill={color.lightGrayText} size={size} style={style} />;
    }

    return <ItemIcon size={size} type={computedItem.contentSummary.typeName} ariaHidden={true} style={style} />;
  }
}

export default LearnItemIcon;
