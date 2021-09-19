import React from 'react';

import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import { LinkIcon } from 'components/icons';
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
  showToast: Function;
}

export const LinkShare = ({ product, className, onClick, showToast }: Props) => {
  const { testId } = useMartyContext();
  const shareLink = product.link;

  function copyToClipboard(shareLink: string): any {
    navigator.clipboard.writeText(shareLink);
    showToast();
    onClick();
  }

  return (
    <button
      type="button"
      onClick={() => copyToClipboard(shareLink)}
      className={className}
      data-test-id={testId('shareLinkIcon')}>
      <LinkIcon title="Copy Link to Clipboard" role="button" size={22}/>
    </button>
  );
};

export default withErrorBoundary('LinkShare', LinkShare);
