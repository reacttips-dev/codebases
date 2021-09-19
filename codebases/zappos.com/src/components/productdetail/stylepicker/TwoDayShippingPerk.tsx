import React from 'react';
import cn from 'classnames';

import PrimeLogo from 'components/icons/vipDashboard/PrimeLogo';
import primeLogoAlt from 'images/amazon-prime.svg';

import css from 'styles/components/productdetail/twoDayShippingPerk.scss';

interface Props {
  hydraBlueSkyPdp: boolean;
  isNonStandardShipOptionLabels?: boolean;
}

const TwoDayShippingPerk = ({ hydraBlueSkyPdp, isNonStandardShipOptionLabels = false }: Props) => (
  <div className={cn(css.wrapper, { [css.blueSky]: hydraBlueSkyPdp })}>
    {!hydraBlueSkyPdp && (
      <div>
        <PrimeLogo fillColor="#000000"/>
      </div>
    )}
    <div className={css.message}>
      <div>
        {hydraBlueSkyPdp ? (
          <>
            <strong>FREE</strong> upgraded shipping & returns with
          </>
        ) : (
          <>
            Amazon Prime members get <strong>free { isNonStandardShipOptionLabels ? 'upgraded' : '2 day'} shipping!</strong>
          </>
        )}
      </div>
    </div>
    {hydraBlueSkyPdp && (
      <img src={primeLogoAlt} alt="Amazon Prime" />
    )}
  </div>
);

export default TwoDayShippingPerk;
