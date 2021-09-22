import React from 'react';
import cx from 'classnames';
import { Button } from '@coursera/coursera-ui';
import _t from 'i18n!nls/authoring';
import { variableMarkStrategy, hasMark } from './utils';
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

const VariableButton: React.FunctionComponent<Props & Partial<PropsFromEditor>> = ({
  value,
  onChange,
  isDisabled = false,
}) => (
  <Button
    rootClassName={cx('rc-VariableButton toolbar-button', { active: !isDisabled && hasMark(value as SlateValue) })}
    type="icon"
    size="zero"
    label={`{ }`}
    style={{
      position: 'relative',
      top: '-2px',
    }}
    onClick={() => onChange && value && onChange(variableMarkStrategy(value.change()))}
    disabled={
      isDisabled ||
      shouldDisableTool(value as SlateValue, MARKS.VARIABLE, true) ||
      shouldDisableTool(value as SlateValue, MARKS.VARIABLE)
    }
    htmlAttributes={{ title: _t('Monospace') }} // this prop is needed as we don't have an SvgElement for this, which usually comes with a default title
  />
);

export default VariableButton;
