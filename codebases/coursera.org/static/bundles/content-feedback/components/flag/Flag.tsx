import React from 'react';

import { Tooltip, OverlayTrigger } from 'react-bootstrap-33';

import FlagContent from 'bundles/content-feedback/components/flag/FlagContent';
import type { ItemType } from 'bundles/content-feedback/constants/ItemTypes';

import _t from 'i18n!nls/content-feedback';

import type { Item } from 'bundles/learner-progress/types/Item';

import { color } from '@coursera/coursera-ui';
import { SvgFlagSquare, SvgFlagSquareFilled } from '@coursera/coursera-ui/svg';

type Props = {
  computedItem: Item;
  selected: boolean;
  onSelect: () => void;

  // TODO tighten up these types
  itemFeedbackType: ItemType;
  tooltipPlacement: string;
  comments: any;
  onSubmit: (comments: any) => void;
  onRemove: (comments: any) => void;
};

class Flag extends React.Component<Props> {
  render() {
    const {
      selected,
      tooltipPlacement,
      computedItem,
      itemFeedbackType,
      comments,
      onSelect,
      onSubmit,
      onRemove,
    } = this.props;

    const tooltip = <Tooltip>{_t('Report problem')}</Tooltip>;

    return (
      <div className="rc-Flag">
        <FlagContent
          computedItem={computedItem}
          itemFeedbackType={itemFeedbackType}
          comments={comments}
          onSelect={onSelect}
          onSubmit={onSubmit}
          onRemove={onRemove}
        >
          <OverlayTrigger placement={tooltipPlacement} overlay={tooltip} delayShow={300}>
            <button type="button" className="c-button-icon" aria-pressed={selected} aria-label={_t('Report problem')}>
              {selected ? (
                <SvgFlagSquareFilled size={20} color={color.icon} suppressTitle={true} />
              ) : (
                <SvgFlagSquare size={20} color={color.icon} suppressTitle={true} />
              )}
            </button>
          </OverlayTrigger>
        </FlagContent>
      </div>
    );
  }
}

export default Flag;
