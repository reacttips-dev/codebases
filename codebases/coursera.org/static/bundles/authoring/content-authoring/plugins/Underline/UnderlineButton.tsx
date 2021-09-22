import React from 'react';
import cx from 'classnames';
import { SvgButton, color } from '@coursera/coursera-ui';
import { SvgUnderline } from '@coursera/coursera-ui/svg';
import { underlineMarkStrategy, hasMark } from './utils';
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

const UnderlineButton: React.FunctionComponent<Props & Partial<PropsFromEditor>> = ({
  value,
  onChange,
  isDisabled = false,
}) => (
  <SvgButton
    rootClassName={cx('rc-UnderlineButton toolbar-button', { active: !isDisabled && hasMark(value as SlateValue) })}
    type="icon"
    size="zero"
    svgElement={<SvgUnderline size={16} color={color.primaryText} />}
    onClick={() => onChange && value && onChange(underlineMarkStrategy(value.change()))}
    disabled={isDisabled || shouldDisableTool(value as SlateValue, MARKS.UNDERLINE, true)}
  />
);

export default UnderlineButton;
