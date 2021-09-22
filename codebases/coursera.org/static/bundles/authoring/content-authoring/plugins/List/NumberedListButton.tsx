import React from 'react';
import cx from 'classnames';
import { isUserRightToLeft } from 'js/lib/language';
import { SvgButton, color } from '@coursera/coursera-ui';
import { SvgNumberedList, SvgNumberedListRtl } from '@coursera/coursera-ui/svg';
import { listStrategy, isSelectionInListByType } from './utils';
import { BLOCK_TYPES } from '../../constants';
import { shouldDisableTool } from '../../utils/toolbarUtils';
import { SlateValue } from '../../types';

const { NUMBER_LIST, BULLET_LIST } = BLOCK_TYPES;

export type Props = {
  key?: string;
  isDisabled?: boolean;
};

type PropsFromEditor = {
  value: SlateValue;
  onChange: ({ value }: { value: SlateValue }) => void;
};

const NumberedListButton: React.FunctionComponent<Props & Partial<PropsFromEditor>> = ({
  value,
  onChange,
  isDisabled = false,
}) => (
  <SvgButton
    rootClassName={cx('rc-NumberedListButton toolbar-button', {
      active: !isDisabled && isSelectionInListByType(value as SlateValue, NUMBER_LIST),
    })}
    type="icon"
    size="zero"
    svgElement={
      isUserRightToLeft() ? (
        <SvgNumberedListRtl size={16} color={color.primaryText} />
      ) : (
        <SvgNumberedList size={16} color={color.primaryText} />
      )
    }
    onClick={() => onChange && value && onChange(listStrategy(value.change(), NUMBER_LIST))}
    disabled={
      isDisabled ||
      shouldDisableTool(value as SlateValue, NUMBER_LIST) ||
      isSelectionInListByType(value as SlateValue, BULLET_LIST)
    }
  />
);

export default NumberedListButton;
