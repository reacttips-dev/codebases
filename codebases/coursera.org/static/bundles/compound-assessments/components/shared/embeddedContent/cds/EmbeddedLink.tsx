import React from 'react';
import initBem from 'js/lib/bem';
import { Link } from '@coursera/cds-core';
import type { EmbeddedContentProps } from 'bundles/compound-assessments/components/shared/embeddedContent/EmbeddedContent';

const bem = initBem('EmbeddedLink');

export const EmbeddedLink: React.SFC<EmbeddedContentProps> = ({ url, title }: EmbeddedContentProps) => {
  return (
    <div className={bem()}>
      <Link href={url} variant="standard" typographyVariant="body1" target="_blank" rel="noopener noreferrer">
        {title}
      </Link>
    </div>
  );
};

export default EmbeddedLink;
