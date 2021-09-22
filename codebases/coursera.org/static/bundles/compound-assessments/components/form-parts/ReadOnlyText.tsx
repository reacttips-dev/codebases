import React from 'react';
import initBem from 'js/lib/bem';
import 'css!./__styles__/ReadOnlyText';
import _t from 'i18n!nls/compound-assessments';

const bem = initBem('ReadOnlyText');

type Props = {
  isMultiLine?: boolean;
  children?: React.ReactNode;
};

const ReadOnlyText = ({ isMultiLine = false, children }: Props) => (
  <div className={bem(undefined, { isMultiLine, isEmpty: !children })}>{children || _t('No answer')}</div>
);

export default ReadOnlyText;
