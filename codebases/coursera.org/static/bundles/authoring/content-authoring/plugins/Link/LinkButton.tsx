import React from 'react';
import { SvgButton, color } from '@coursera/coursera-ui';
import cx from 'classnames';
import { SvgLink } from '@coursera/coursera-ui/svg';
import { linkStrategy, hasLink } from './utils';
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

const LinkButton: React.FunctionComponent<Props & Partial<PropsFromEditor>> = ({
  value,
  onChange,
  isDisabled = false,
}) => (
  <SvgButton
    rootClassName={cx('rc-LinkButton toolbar-button', { active: hasLink(value as SlateValue) })}
    type="icon"
    size="zero"
    svgElement={<SvgLink size={16} color={color.primaryText} />}
    onClick={() => onChange && value && onChange(linkStrategy(value.change()))}
    disabled={
      isDisabled ||
      shouldDisableTool(value as SlateValue, BLOCK_TYPES.LINK) ||
      shouldDisableTool(value as SlateValue, BLOCK_TYPES.LINK, true)
    }
  />
);

export default LinkButton;
