import React from 'react';
import queryString from 'query-string';

import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import { Facebook } from 'components/icons';
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
}

export const FacebookShare = ({ appId, product, className }: Props) => {
  const { testId } = useMartyContext();
  const facebookLink = 'https://www.facebook.com/dialog/feed?' + queryString.stringify({
    app_id: appId,
    link: product.link,
    name: product.name,
    caption: product.style,
    description: product.name,
    picture: product.image
  });

  return (
    <a
      href={facebookLink}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      data-test-id={testId('facebookShareIcon')}
    >
      <Facebook title="Share on Facebook" size={22}/>
    </a>
  );
};

export default withErrorBoundary('FacebookShare', FacebookShare);
