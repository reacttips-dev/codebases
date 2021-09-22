import React from 'react';
import _t from 'i18n!nls/course-item-resource-panel';
import 'css!./__styles__/index';
import { TagProps } from './__types__';

export function tagLabels() {
  return {
    'mentor replied': _t('Mentor Replied'),
    'staff replied': _t('Staff Replied'),
  };
}

export default function Tag({ label }: TagProps) {
  const tagLabel = tagLabels();

  return <span className="rc-Tag">{tagLabel[label]}</span>;
}
