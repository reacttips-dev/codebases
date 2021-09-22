import React from 'react';
import cx from 'classnames';
import { Button } from '@coursera/coursera-ui';
import _t from 'i18n!nls/authoring';
import { headingStrategy, hasHeadingByLevel } from './utils';
import { BLOCK_TYPES } from '../../constants';
import { shouldDisableTool } from '../../utils/toolbarUtils';
import { SlateValue } from '../../types';

export type Props = {
  level: string;
  key?: string;
  isDisabled?: boolean;
};

type PropsFromEditor = {
  value: SlateValue;
  onChange: ({ value }: { value: SlateValue }) => void;
};

const HeadingButton: React.FunctionComponent<Props & Partial<PropsFromEditor>> = ({
  value,
  onChange,
  level = '1',
  isDisabled = false,
}) => (
  <Button
    rootClassName={cx('rc-HeadingButton toolbar-button', {
      active: !isDisabled && hasHeadingByLevel(value as SlateValue, level),
    })}
    type="icon"
    size="zero"
    label={`H${level}`}
    onClick={() => onChange && value && onChange(headingStrategy(value.change(), level))}
    disabled={isDisabled || shouldDisableTool(value as SlateValue, BLOCK_TYPES.HEADING)}
    htmlAttributes={{ title: _t('Heading #{level}', { level }) }}
  />
);

export default HeadingButton;
