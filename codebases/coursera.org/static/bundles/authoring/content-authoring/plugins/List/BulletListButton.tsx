import React from 'react';
import cx from 'classnames';
import { isUserRightToLeft } from 'js/lib/language';
import { SvgButton, color } from '@coursera/coursera-ui';
import { SvgBulletList } from '@coursera/coursera-ui/svg';
import { listStrategy, isSelectionInListByType } from './utils';
import { BLOCK_TYPES } from '../../constants';
import { shouldDisableTool } from '../../utils/toolbarUtils';
import { SlateValue } from '../../types';

const { BULLET_LIST, NUMBER_LIST } = BLOCK_TYPES;

export type Props = {
  key?: string;
  isDisabled?: boolean;
};

type PropsFromEditor = {
  value: SlateValue;
  onChange: ({ value }: { value: SlateValue }) => void;
};

const BulletListButton: React.FunctionComponent<Props & Partial<PropsFromEditor>> = ({
  value,
  onChange,
  isDisabled = false,
}) => (
  <SvgButton
    rootClassName={cx('rc-BulletListButton toolbar-button', {
      // TODO (jcheung) replace icon (see https://coursera.atlassian.net/browse/LP-1315)
      'toolbar-button--rtl': isUserRightToLeft(),
      active: !isDisabled && isSelectionInListByType(value as SlateValue, BULLET_LIST),
    })}
    type="icon"
    size="zero"
    svgElement={<SvgBulletList size={16} color={color.primaryText} />}
    onClick={() => onChange && value && onChange(listStrategy(value.change(), BULLET_LIST))}
    disabled={
      isDisabled ||
      shouldDisableTool(value as SlateValue, BULLET_LIST) ||
      isSelectionInListByType(value as SlateValue, NUMBER_LIST)
    }
  />
);

export default BulletListButton;
