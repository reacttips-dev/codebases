import React, { memo, useEffect, useState } from 'react';
import cn from 'classnames';
import { parseUrl } from 'query-string';

import { useWindowEvent } from 'hooks/useEvent';
import Recos from 'components/productdetail/Recos';
import { ProductQuickViewReco } from 'components/productdetail/ProductQuickView';
import { getRecoSlotData, shouldRecosUpdate } from 'helpers/RecoUtils';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import useMartyContext from 'hooks/useMartyContext';
import { areRecosFlattened, RecosState } from 'reducers/recos';
import { JanusData } from 'types/mafia';

import { associatedProducts, associatedProductsContainer, centerRecos } from 'styles/components/productdetail/recosDetail.scss';

interface Props {
  className: string;
  onRecoClicked: (e: React.MouseEvent<Element>, { cardData: { productId }, amethystRecoType: widgetType, index }: {
    cardData: {
      productId: string;
    };
    amethystRecoType: string;
    index: number;
  }) => void;
  similarProductRecos: RecosState;
}

const RecosCompleteTheLook = memo(({ similarProductRecos = {}, className, onRecoClicked }: Props) => {
  const { janus = {}, lastReceivedRecoKey = '' } = similarProductRecos;
  const janusData = janus[lastReceivedRecoKey] || {};
  let janusRecos: JanusData | undefined;
  if (!areRecosFlattened(janusData)) {
    janusRecos = getRecoSlotData(janusData['detail-0']);
  }
  const { testId } = useMartyContext();
  const [productIdFromHash, setProductIdFromHash] = useState();
  const [styleIdFromHash, setStyleIdFromHash] = useState();

  const setIdsFromHash = () => {
    if (window.location.hash.includes('#quickview')) {
      const { query: { styleId, productId } } = parseUrl(window.location.hash);
      setProductIdFromHash(productId);
      setStyleIdFromHash(styleId);
    } else {
      setProductIdFromHash(undefined);
      setStyleIdFromHash(undefined);
    }
  };

  useEffect(setIdsFromHash, []); // Set state from hash on first load
  useWindowEvent('popstate', setIdsFromHash); // Listen to history changes and set state from hash

  if (!janusRecos) {
    return null;
  } else {
    return <div className={cn(associatedProducts, associatedProductsContainer, centerRecos, className)}>
      <Recos
        id="completeTheLook"
        data-test-id={testId('completeTheLook')}
        title={janusRecos.title}
        recos={janusRecos.recos}
        onRecoClicked={onRecoClicked}
        belowImageRenderer={props => {
          // control which modal is open by state set from product and style in hash changes/intial hash
          const open = props.cardData.productId === productIdFromHash && props.cardData.styleId === styleIdFromHash;
          return <ProductQuickViewReco {...props} open={open} />;
        }}/>
    </div>;
  }
}, (prevProps, nextProps) => !shouldRecosUpdate(prevProps, nextProps));

export default withErrorBoundary('RecosCompleteTheLook', RecosCompleteTheLook);
