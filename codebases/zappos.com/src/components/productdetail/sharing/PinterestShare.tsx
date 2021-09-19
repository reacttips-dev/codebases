import React from 'react';
import queryString from 'query-string';

import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import { Pinterest } from 'components/icons';
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

export const PinterestShare = ({ product, className }: Props) => {
  const { testId } = useMartyContext();
  const pinterestLink = 'https://pinterest.com/pin/create/button/?' + queryString.stringify({
    url: product.link,
    media: product.image,
    description: product.name
  });

  return (
    <a
      href={pinterestLink}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      data-test-id={testId('pinterestShareIcon')}
    >
      <Pinterest title="Share on Pinterest" size={22}/>
    </a>
  );
};

export default withErrorBoundary('PinterestShare', PinterestShare);
