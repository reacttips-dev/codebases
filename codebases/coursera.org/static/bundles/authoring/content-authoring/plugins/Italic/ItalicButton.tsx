import React from 'react';
import cx from 'classnames';
import { SvgButton, color } from '@coursera/coursera-ui';
import { SvgItalics } from '@coursera/coursera-ui/svg';
import { italicMarkStrategy, hasMark } from './utils';
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

const ItalicButton: React.FunctionComponent<Props & Partial<PropsFromEditor>> = ({
  value,
  onChange,
  isDisabled = false,
}) => (
  <SvgButton
    rootClassName={cx('rc-ItalicButton toolbar-button', { active: !isDisabled && hasMark(value as SlateValue) })}
    type="icon"
    size="zero"
    svgElement={<SvgItalics size={16} color={color.primaryText} />}
    onClick={() => onChange && value && onChange(italicMarkStrategy(value.change()))}
    disabled={isDisabled || shouldDisableTool(value as SlateValue, MARKS.ITALIC, true)}
  />
);

export default ItalicButton;
