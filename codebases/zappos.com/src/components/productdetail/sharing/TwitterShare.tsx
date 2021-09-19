import React from 'react';
import queryString from 'query-string';

import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import { Twitter } from 'components/icons';
import useMartyContext from 'hooks/useMartyContext';

interface Props {
  className?: string;
  product: {
    link: string;
    name: string;
    style: string;
    image: string;
  };
}

export const TwitterShare = ({ product, className }: Props) => {
  const { testId } = useMartyContext();
  const twitterLink = `https://twitter.com/share?${queryString.stringify({ text: product.name, url: product.link })}`;

  return (
    <a
      href={twitterLink}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      data-test-id={testId('twitterShareIcon')}>
      <Twitter title="Share on Twitter" size={22}/>
    </a>
  );
};

export default withErrorBoundary('TwitterShare', TwitterShare);
