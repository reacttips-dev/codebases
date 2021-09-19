import React, { Component } from 'react';
import cn from 'classnames';

import Recos from 'components/productdetail/Recos';
import { shouldRecosUpdate } from 'helpers/RecoUtils';
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
  numberOfAskQuestions: number;
  numberOfReviews: number;
  onRecoClicked: (...args: any) => void;
  params: Params;
  similarProductRecos: RecosState;
  styleId: string;
  heartsData: any; // TODO ts type this when `hearts` are typed
  hydraBlueSkyPdp?: boolean;
}

export class RecosDetail1 extends Component<Props> {

  static defaultProps = {
    numberOfAskQuestions: 0,
    numberOfReviews: 0
  };

  // We don't want this component to re-render when it's either loading, or recommendations haven't changed
  shouldComponentUpdate(nextProps: Props) {
    return shouldRecosUpdate(this.props, nextProps);
  }

  render() {
    const { similarProductRecos = {}, onRecoClicked, numberOfAskQuestions, numberOfReviews, heartsData, hydraBlueSkyPdp = false } = this.props;
    // If we have recommendations, render the component
    const { janus = {}, lastReceivedRecoKey = '' } = similarProductRecos;
    const janusData = janus[lastReceivedRecoKey] || {};
    let janusRecos: JanusData | undefined;
    if (!areRecosFlattened(janusData)) {
      janusRecos = janusData['detail-1'];
    }
    if (janusRecos) {
      let { recos } = janusRecos;
      const { title } = janusRecos;
      if (recos && numberOfAskQuestions <= 0 && numberOfReviews <= 0) {
        recos = recos.slice(0, 3);
      }
      // OIDIA only allows for more than 5 recos
      if (!hydraBlueSkyPdp) {
        recos = recos.slice(0, 5);
      }
      const classNames = hydraBlueSkyPdp ? cn(css.centerRecos, css.associatedProducts, css.associatedProductsHeading) : css.subRecos;
      return (
        <div className={classNames}>
          <Recos
            id="alsoBought"
            isVertical={!hydraBlueSkyPdp}
            recoType="crossRecos"
            recos={recos}
            title={title}
            onRecoClicked={onRecoClicked}
            heartsData={heartsData} />
        </div>
      );
    }
    return null;
  }
}

export default withErrorBoundary('RecosDetail1', RecosDetail1);
