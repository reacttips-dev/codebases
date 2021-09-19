import React from 'react';
import queryString from 'query-string';

import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import { PinterestV2 } from 'components/icons';
import useMartyContext from 'hooks/useMartyContext';

interface Props {
  className?: string;
  product: {
    link: string;
    name: string;
    style: string;
    image: string;
  };
  onClick: Function;
}

export const PinterestShareV2 = ({ product, className, onClick }: Props) => {
  const { testId } = useMartyContext();
  const pinterestLink = 'https://pinterest.com/pin/create/button/?' + queryString.stringify({
    url: product.link,
    media: product.image,
    description: product.name
  });

  const shareToPinterest = () => {
    window.open(pinterestLink, '_blank', 'noopener,noreferrer');
    onClick();
  };

  return (
    <button
      type="button"
      className={className}
      data-test-id={testId('pinterestShareIconV2')}
      onClick={shareToPinterest}
    >
      <PinterestV2 title="Share on Pinterest" size={22}/>
    </button>
  );
};

export default withErrorBoundary('PinterestShareV2', PinterestShareV2);
