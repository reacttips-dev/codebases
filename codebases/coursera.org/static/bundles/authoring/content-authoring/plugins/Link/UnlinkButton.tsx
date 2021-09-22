import React from 'react';
import cx from 'classnames';
import { SvgButton, color } from '@coursera/coursera-ui';
import { SvgUnlink } from '@coursera/coursera-ui/svg';
import _t from 'i18n!nls/authoring';
import { unlinkStrategy, hasLink } from './utils';
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

const UnlinkButton: React.FunctionComponent<Props & Partial<PropsFromEditor>> = ({
  value,
  onChange,
  isDisabled = false,
}) => (
  <SvgButton
    rootClassName={cx('rc-UnlinkButton toolbar-button')}
    type="icon"
    size="zero"
    svgElement={<SvgUnlink size={16} color={color.primaryText} title={_t('Remove link')} />}
    onClick={() => onChange && value && onChange(unlinkStrategy(value.change()))}
    disabled={isDisabled || !hasLink(value as SlateValue) || shouldDisableTool(value as SlateValue, BLOCK_TYPES.LINK)}
  />
);

export default UnlinkButton;
