import React from 'react';

import { Tooltip, OverlayTrigger } from 'react-bootstrap-33';
import LikeContent from 'bundles/content-feedback/components/like/LikeContent';
import type { ItemType } from 'bundles/content-feedback/constants/ItemTypes';

import _t from 'i18n!nls/content-feedback';

import { color } from '@coursera/coursera-ui';
import { SvgSmile, SvgaSmileFilled } from '@coursera/coursera-ui/svg';

import type { CmlContent } from 'bundles/cml/types/Content';

type Props = {
  selected: boolean;
  tooltipPlacement: string;
  withFeedback: boolean;

  onDeselect: () => void;
  onSelect: (cml: CmlContent) => void;
  onComment: (cml: CmlContent) => void;

  comment: any;
  itemFeedbackType: ItemType;
};

const LikeV2 = (props: Props) => {
  const { selected, tooltipPlacement } = props;

  const tooltip = <Tooltip>{_t('Helpful')}</Tooltip>;

  return (
    <div className="rc-Like">
      <LikeContent {...props} placeholder={_t('This item was helpful because...')}>
        <OverlayTrigger placement={tooltipPlacement} overlay={tooltip} delayShow={300}>
          <button type="button" className="c-button-icon" aria-pressed={selected} aria-label={_t('Helpful')}>
            {selected ? <SvgaSmileFilled size={20} color={color.icon} /> : <SvgSmile size={20} color={color.icon} />}
          </button>
        </OverlayTrigger>
      </LikeContent>
    </div>
  );
};

export default LikeV2;
