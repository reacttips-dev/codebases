import React from 'react';

import ItemIcon from 'bundles/item/components/ItemIcon';
import type { Item } from 'bundles/course-v2/types/Item';

import { color } from '@coursera/coursera-ui';
import { SvgCheckSolid, SvgClockFilled, SvgCircleWarning, SvgLockFilled } from '@coursera/coursera-ui/svg';
import _t from 'i18n!nls/course-home';

import 'css!./__styles__/AssignmentProgressIcon';

type Props = {
  item: Item;
  suppressTitle?: boolean;
  size?: number;
  style?: React.CSSProperties;
};

class AssignmentProgressIcon extends React.Component<Props> {
  render() {
    const { item, size, style, suppressTitle } = this.props;
    const { isLocked, itemDeadlineStatus, computedProgressState } = item;

    if (isLocked) {
      return (
        <SvgLockFilled
          fill={color.secondaryText}
          size={size}
          style={style}
          title={_t('Locked')}
          {...(suppressTitle ? { suppressTitle: true } : {})}
        />
      );
    }

    if (computedProgressState === 'Completed') {
      if (this.props.item.computedOutcome?.isPassed === false) {
        return (
          <SvgCircleWarning
            fill={color.error}
            size={24}
            style={style}
            title={_t('Failed')}
            {...(suppressTitle ? { suppressTitle: true } : {})}
          />
        );
      }
      return (
        <SvgCheckSolid
          fill={color.success}
          size={24}
          style={style}
          title={_t('Completed')}
          {...(suppressTitle ? { suppressTitle: true } : {})}
        />
      );
    } else if (itemDeadlineStatus === 'FAILED') {
      return (
        <SvgCircleWarning
          fill={color.error}
          size={24}
          style={style}
          title={_t('Failed')}
          {...(suppressTitle ? { suppressTitle: true } : {})}
        />
      );
    } else if (itemDeadlineStatus === 'OVERDUE') {
      return (
        <SvgClockFilled
          fill="#db730a"
          size={24}
          style={style}
          title={_t('Overdue')}
          {...(suppressTitle ? { suppressTitle: true } : {})}
        />
      );
    }

    return <ItemIcon size={24} type={item.contentSummary.typeName} style={style} />;
  }
}

export default AssignmentProgressIcon;
