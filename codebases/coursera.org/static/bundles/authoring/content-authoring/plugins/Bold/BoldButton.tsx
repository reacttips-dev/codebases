import React from 'react';
import cx from 'classnames';
import { SvgButton, color } from '@coursera/coursera-ui';
import { SvgBold } from '@coursera/coursera-ui/svg';
import { boldMarkStrategy, hasMark } from './utils';
import { MARKS } from '../../constants';
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

const BoldButton: React.FunctionComponent<Props & Partial<PropsFromEditor>> = ({
  value,
  onChange,
  isDisabled = false,
}) => (
  <SvgButton
    rootClassName={cx('rc-BoldButton toolbar-button', { active: !isDisabled && hasMark(value as SlateValue) })}
    type="icon"
    size="zero"
    svgElement={<SvgBold size={16} color={color.primaryText} />}
    onClick={() => onChange && value && onChange(boldMarkStrategy(value.change()))}
    disabled={isDisabled || shouldDisableTool(value as SlateValue, MARKS.BOLD, true)}
  />
);

export default BoldButton;
