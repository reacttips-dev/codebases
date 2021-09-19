import React, { useCallback, useEffect, useState } from 'react';

import { track } from 'apis/amethyst';
import { sizeBiasImpression } from 'events/product';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import useMartyContext from 'hooks/useMartyContext';
import HtmlToReact from 'components/common/HtmlToReact';
import { GenericSizeBiases } from 'types/product';

import css from 'styles/components/productdetail/genericSizeBiasReco.scss';

interface Props {
  currentProductId: string;
  genericSizeBiases: {} | GenericSizeBiases;
}

export const GenericSizeBiasReco = ({ currentProductId, genericSizeBiases }: Props) => {
  const { testId } = useMartyContext();
  const { productId, sizeBiases, text } = genericSizeBiases as GenericSizeBiases;
  const [ copyText, setCopyText ] = useState(null);
  useEffect(() => {
    if (copyText && currentProductId === productId) {
      track(() => ([
        sizeBiasImpression, { text: copyText, productId, sizeBiases }
      ]));
    }
  }, [copyText, currentProductId, productId, sizeBiases, text]);

  const copyTextRef = useCallback(node => {
    if (node) {
      setCopyText(node.textContent);
    }
  }, [setCopyText]);

  const copyProps = {
    'className': css.copy,
    'ref': copyTextRef,
    'data-test-id': testId('genericSizeBias')
  };

  return (text && currentProductId === productId) ? <HtmlToReact {...copyProps}>{text}</HtmlToReact> : null;
};

export default withErrorBoundary('GenericSizeBiasReco', GenericSizeBiasReco);
