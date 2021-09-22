import React from 'react';
import classNames from 'classnames';
import 'css!./__styles__/index';

export type TagType = 'person' | 'info';

export type PillTagProps = { label: string; type: TagType };

export default function PillTag({ label, type }: PillTagProps) {
  return <span className={classNames('rc-PillTag', type)}>{label}</span>;
}
