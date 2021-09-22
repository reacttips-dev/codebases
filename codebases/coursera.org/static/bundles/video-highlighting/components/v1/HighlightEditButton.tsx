import React from 'react';
import classNames from 'classnames';

import { color } from '@coursera/coursera-ui';
import { SvgEdit } from '@coursera/coursera-ui/svg';

import a11yKeyPress from 'js/lib/a11yKeyPress';

import _t from 'i18n!nls/video-highlighting';

import 'css!./__styles__/HighlightEditButton';

type Props = {
  onClick: () => void;
  isLabel?: boolean;
  disabled: boolean;
  hasComment: boolean;
  ariaLabelledBy: string;
};

const HighlightEditButton = ({ disabled, onClick, ariaLabelledBy, hasComment, isLabel = false }: Props) => {
  const className = classNames('rc-HighlightEditButton', 'nostyle', {
    isLabel,
  });

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={className}
      aria-labelledby={ariaLabelledBy}
      onKeyPress={(event) => a11yKeyPress(event, onClick)}
    >
      <SvgEdit
        color={disabled ? color.secondaryText : color.primaryText}
        size={isLabel ? 10 : 15}
        suppressTitle={true}
      />
      {isLabel && (
        <span>
          &nbsp;
          {hasComment ? _t('Edit your thoughts') : _t('Add your thoughts')}
        </span>
      )}
    </button>
  );
};

export default HighlightEditButton;
