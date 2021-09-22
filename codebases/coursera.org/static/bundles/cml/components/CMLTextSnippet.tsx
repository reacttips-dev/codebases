/* @jsx jsx */
import React from 'react';
import { Typography } from '@coursera/cds-core';
import { jsx, css } from '@emotion/react';
import type { CmlContent } from 'bundles/cml/types/Content';
import CMLUtils, { isCML } from 'bundles/cml/utils/CMLUtils';
import Tex from 'bundles/phoenix/components/Tex';
import { truncate } from 'lodash';

// this component renders text only snippets of CML for a specific number of lines which is responsive to container width;
export function CMLTextSnippet({ cml, contentLineCountMax }: { cml: CmlContent; contentLineCountMax: number }) {
  if (!isCML(cml) || !contentLineCountMax || contentLineCountMax === 0) {
    return null;
  }
  const text = CMLUtils.getInnerText(cml);
  const trimmed = text.replace(/\n$/, ''); // CMLParser adds a trailing carriage return. we want to remove that.

  return (
    <Typography
      component="div"
      css={css`
        font-size: 1.1em;
      `}
    >
      {/* 165 was passed to truncate to display the text result as multiLine in just 2 paragraphs. */}
      <Tex>{truncate(trimmed, { length: 165 })}</Tex>
    </Typography>
  );
}
