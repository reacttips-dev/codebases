import React, { Component } from 'react';
import cn from 'classnames';

import Recos from 'components/productdetail/Recos';
import { getRecoSlotData, shouldRecosUpdate } from 'helpers/RecoUtils';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import { areRecosFlattened, RecosState } from 'reducers/recos';
import { JanusData } from 'types/mafia';

// eslint-disable-next-line css-modules/no-unused-class
import css from 'styles/components/productdetail/recosDetail.scss';

interface Params {
  productId: string;
  colorId?: string;
  seoName?: string;
}
interface Props {
  onRecoClicked: (...args: any) => void;
  params: Params;
  similarProductRecos: RecosState;
  styleId: string;
  heartsData: any; // TODO ts type this when `hearts` are typed
}

export class RecosDetail3 extends Component<Props> {

  // We don't want this component to re-render when it's either loading, or similarProductRecos haven't changed
  shouldComponentUpdate(nextProps: Props) {
    return shouldRecosUpdate(this.props, nextProps);
  }

  render() {
    const {
      similarProductRecos: {
        janus = {},
        lastReceivedRecoKey = ''
      } = {},
      heartsData, onRecoClicked
    } = this.props;
    // If we have recommendations, render the component.
    const janusData = janus[lastReceivedRecoKey] || {};
    let janusRecos: JanusData | undefined;
    if (!areRecosFlattened(janusData)) {
      janusRecos = getRecoSlotData(janusData['detail-ext-search-2'], janusData['detail-3']);
    }
    if (janusRecos) {
      const { title, recos } = janusRecos;
      return (
        <div className={cn(css.centerRecos, css.associatedProducts, css.associatedProductsContainer)}>
          <Recos
            id="alsoSimilar"
            recoType="subRecos"
            title={title}
            recos={recos}
            onRecoClicked={onRecoClicked}
            heartsData={heartsData} />
        </div>
      );
    }
    return null;
  }
}

export default withErrorBoundary('RecosDetail3', RecosDetail3);
