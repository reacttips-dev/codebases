import React, { Component } from 'react';
import cn from 'classnames';

import Recos from 'components/productdetail/Recos';
import { getRecoSlotData, shouldRecosUpdate } from 'helpers/RecoUtils';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import { areRecosFlattened, RecosState } from 'reducers/recos';
import { JanusData } from 'types/mafia';

import { associatedProducts, associatedProductsHeading, centerRecos } from 'styles/components/productdetail/recosDetail.scss';

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

export class RecosDetail2 extends Component<Props> {

  // We don't want this component to re-render when it's either loading, or similarProductRecos haven't changed
  shouldComponentUpdate(nextProps: Props) {
    return shouldRecosUpdate(this.props, nextProps);
  }

  render() {
    const { similarProductRecos = {}, onRecoClicked, heartsData } = this.props;
    // If we have recommendations, render the component.
    const { janus = {}, lastReceivedRecoKey = '' } = similarProductRecos;
    const janusData = janus[lastReceivedRecoKey] || {};
    let janusRecos: JanusData | undefined;
    if (!areRecosFlattened(janusData)) {
      janusRecos = getRecoSlotData(janusData['detail-vis-sims'], janusData['detail-2']);
    }
    if (janusRecos) {
      const { title, recos } = janusRecos;
      return (
        <div className={cn(centerRecos, associatedProducts, associatedProductsHeading)}>
          <Recos
            id="alsoLike"
            recoType="associatedProducts"
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

export default withErrorBoundary('RecosDetail2', RecosDetail2);
