import React from 'react';
import queryString from 'query-string';

import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import { FacebookV2 } from 'components/icons';
import useMartyContext from 'hooks/useMartyContext';

interface Props {
  appId: string;
  className?: string;
  product: {
    link: string;
    name: string;
    style: string;
    image: string;
  };
  onClick: () => void;
}

export const FacebookShareV2 = ({ appId, product, className, onClick }: Props) => {
  const { testId } = useMartyContext();
  const facebookLink = 'https://www.facebook.com/dialog/feed?' + queryString.stringify({
    app_id: appId,
    link: product.link,
    name: product.name,
    caption: product.style,
    description: product.name,
    picture: product.image
  });

  const shareToFacebook = () => {
    window.open(facebookLink, '_blank', 'noopener,noreferrer');
    onClick();
  };

  return (
    <button
      type="button"
      className={className}
      data-test-id={testId('facebookShareIconV2')}
      onClick={shareToFacebook}
    >
      <FacebookV2 title="Share on Facebook" size={22}/>
    </button>
  );
};

export default withErrorBoundary('FacebookShareV2', FacebookShareV2);
