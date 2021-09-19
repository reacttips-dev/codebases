import React from 'react';
import cn from 'classnames';

import { isExternalReferrer } from 'helpers/index.js';
import marketplace from 'cfg/marketplace.json';
import MelodyCarousel from 'components/common/MelodyCarousel';
import MelodyCardProduct from 'components/common/melodyCard/MelodyCardProduct';
import ProductUtils from 'helpers/ProductUtils';
import useMartyContext from 'hooks/useMartyContext';
import { FormattedJanusReco } from 'types/mafia';
import { ProductSimilarStyle } from 'types/product';

import css from 'styles/components/productdetail/recos.scss';

const { recos: { showRecosOnTopForExternalReferrer } } = marketplace;

interface Props {
  additionalMelodyCardProductClasses?: any; // TODO ts type this if/when MCP is typed
  belowImageRenderer?: (...args: any) => JSX.Element;
  id?: string;
  isVertical?: boolean;
  heartsData?: any; // TODO ts type this when `hearts` are typed
  noBackground?: boolean;
  onRecoClicked: (...args: any) => void;
  recos: (FormattedJanusReco | ProductSimilarStyle)[]; // TS does not like operating on unions of arrays, so we must type this as an array with union-typed entries
  recoType?: string;
  showTitle?: boolean;
  title?: string;
}
const Recos = (props: Props) => {
  const {
    showTitle = true,
    title = 'You Might Also Like',
    id = null,
    isVertical,
    recos,
    recoType
  } = props;
  const { testId } = useMartyContext();

  if (!recos || !(recos.length > 0)) {
    return null;
  }

  let showRecosOnTop = false;
  let isTopRecos = false;
  let isBottomRecos = false;
  if (showRecosOnTopForExternalReferrer) {
    showRecosOnTop = isExternalReferrer();
    if (recoType === 'subRecos') {
      isTopRecos = showRecosOnTop;
      isBottomRecos = !showRecosOnTop;
    }
  }

  const amethystRecoType = ProductUtils.translateRecoTitleToAmethystWidget(title);

  const recoElements = recos.map((reco, index) => (
    <Reco
      {...props}
      key={reco.productId}
      reco={reco}
      index={index}
      amethystRecoType={amethystRecoType}
    />
  ));

  return (
    <div className={cn(css.recoCarousel, { [css.bottomRecos]: isBottomRecos })} data-test-id={testId('recoCarousel')}>
      {showTitle && <h2 className={cn({ [css.linethrough]: isBottomRecos })}>{title}</h2>}
      <div
        id={id || undefined}
        data-test-id={testId(id)}
        className={cn(css.recos, {
          [css.gridRecos]: recoType === 'gridRecos',
          [css.topRecos]: isTopRecos,
          [css.bottomRecos]: isBottomRecos,
          [css.noCarousel]: recos.length <= 5,
          [css.vertical]: isVertical
        })}>
        {((recos.length > 5 && recoType !== 'gridRecos') || (recos.length > 3 && isTopRecos))
          ? <MelodyCarousel showDots={false}>{recoElements}</MelodyCarousel>
          : recoElements
        }
      </div>
    </div>
  );
};

Recos.defaultProps = {
  noBackground: false
};

interface RecoProps extends Props {
  amethystRecoType: string | null;
  index: number;
  onRecoClicked: (...args: any[]) => void;
  reco: FormattedJanusReco | ProductSimilarStyle;
}

export const Reco = (props: RecoProps) => {
  const {
    isVertical = false,
    additionalMelodyCardProductClasses, onRecoClicked,
    reco, ...rest
  } = props;
  const { testId } = useMartyContext();
  return (
    <MelodyCardProduct
      key={`d-${reco.styleId}`}
      msaImageParams={null}
      cardData={reco}
      shouldLazyLoad={true}
      vertical={isVertical}
      melodyCardTestId={testId('productReco')}
      extraRecoStyle={css.heartContainer}
      onComponentClick={onRecoClicked}
      additionalClasses={additionalMelodyCardProductClasses}
      {...rest}/>
  );
};

export default Recos;
