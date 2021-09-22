import React from 'react';
import cx from 'classnames';
import { SvgButton, color } from '@coursera/coursera-ui';
import { SvgTable } from '@coursera/coursera-ui/svg';
import { tableStrategy, hasTable } from './utils';
import { BLOCK_TYPES } from '../../constants';
import { shouldDisableTool } from '../../utils/toolbarUtils';
import { SlateValue } from '../../types';

export type Props = {
  key?: string;
  isDisabled?: boolean;
};

type PropsFromEditor = {
  value: SlateValue;
  onChange: ({ value }: { value: SlateValue }) => void;
};

const TableButton: React.FunctionComponent<Props & Partial<PropsFromEditor>> = ({
  value,
  isDisabled = false,
  onChange,
}) => {
  const isActive = hasTable(value);
  return (
    <SvgButton
      rootClassName={cx('rc-TableButton toolbar-button', {
        active: isActive,
      })}
      type="icon"
      size="zero"
      svgElement={<SvgTable size={18} color={color.primaryText} />}
      onClick={() => onChange && value && onChange(tableStrategy(value.change()))}
      disabled={isDisabled || shouldDisableTool(value as SlateValue, BLOCK_TYPES.TABLE)}
    />
  );
};

export default TableButton;
