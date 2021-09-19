import React from 'react';
import { Link } from 'react-router';
import { connect, ConnectedProps } from 'react-redux';

import useMartyContext from 'hooks/useMartyContext';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import { AppState } from 'types/app';

import css from 'styles/components/productdetail/shippingAndReturnsBanner.scss';

type PropsFromRedux = ConnectedProps<typeof connector>;

export const ShippingAndReturnsBanner = ({ shippingPromoBanner = {} }: PropsFromRedux) => {
  const {
    heading,
    cta,
    link,
    copy
  } = shippingPromoBanner;

  const { testId } = useMartyContext();

  return (
    <div className={css.container}>
      <h2 className={css.heading}>{heading}</h2>
      <div>
        <div className={css.text}>
          <p className={css.info} data-test-id={testId('shipReturnsText')}>{copy}</p>
          <Link to={link} className={css.link} data-test-id={testId('shipReturnPolicyLink')}>{cta}</Link>
        </div>
      </div>
    </div>
  );
};

function mapStateToProps(state: AppState) {
  return {
    shippingPromoBanner: state.product.symphonyStory.slotData?.shippingPromoBanner
  };
}

const connector = connect(mapStateToProps);

const ConnectedShippingAndReturnsBanner = connector(ShippingAndReturnsBanner);

export default withErrorBoundary('ShippingAndReturnsBanner', ConnectedShippingAndReturnsBanner);

