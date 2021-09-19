import React from 'react';
import queryString from 'query-string';

import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import { TwitterV2 } from 'components/icons';
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

export const TwitterShareV2 = ({ product, className, onClick }: Props) => {
  const { testId } = useMartyContext();
  const twitterLink = 'https://twitter.com/share?' + queryString.stringify({ text: product.name, url: product.link });

  const shareToTwitter = () => {
    window.open(twitterLink, '_blank', 'noopener,noreferrer');
    onClick();
  };

  return (
    <button
      type="button"
      className={className}
      data-test-id={testId('twitterShareIconV2')}
      onClick={shareToTwitter}>
      <TwitterV2 title="Share on Twitter" size={22}/>
    </button>
  );
};

export default withErrorBoundary('TwitterShareV2', TwitterShareV2);
