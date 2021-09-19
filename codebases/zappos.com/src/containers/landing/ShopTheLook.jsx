import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { changeQuantity, showCartModal } from 'actions/cart';
import { heartProduct, toggleHeartingLoginModal, unHeartProduct } from 'actions/hearts';
import ShopTheLookCard from 'components/landing/ShopTheLookCard';

import css from 'styles/containers/landing/shopTheLook.scss';

export const ShopTheLook = ({
  changeQuantity,
  isCustomer,
  showCartModal,
  heartProduct,
  unHeartProduct,
  hearts,
  slotName,
  slotDetails,
  toggleHeartingLoginModal
}) => {

  const { data, image, alt = '', heading, styles } = slotDetails;

  return (
    <section className={css.content} data-slot-id={slotName}>
      {heading && <h2 className={css.lookName}>{heading}</h2> /* Optional Heading */}
      <div className={css.shopTheLookContainer}>
        <div className={css.imageContainer}>
          <img className={css.mainImage} src={image} alt={alt}/>
        </div>
        <ul className={css.productContainer}>
          {styles.map(styleId => {
            if (data.hasOwnProperty(styleId)) { // In case ZCS times out for one of the styles
              const product = data[styleId]?.product[0] || {};
              return (
                <ShopTheLookCard
                  cardData={product}
                  hearts={hearts}
                  key={styleId}
                  styleId={styleId}
                  toggleHeartingLoginModal={toggleHeartingLoginModal}
                  changeQuantity={changeQuantity}
                  showCartModal={showCartModal}
                  heartProduct={heartProduct}
                  unHeartProduct={unHeartProduct}
                  isCustomer={isCustomer}
                />
              );
            }
            return null;
          })}
        </ul>
      </div>
    </section>
  );
};

const mapDispatchToProps = {
  changeQuantity,
  showCartModal,
  heartProduct,
  unHeartProduct,
  toggleHeartingLoginModal
};

const mapStateToProps = state => ({
  hearts: state.hearts.heartsStyleIds,
  isCustomer: !!state.cookies['x-main']
});

ShopTheLook.contextTypes = {
  marketplace: PropTypes.object
};

export default connect(mapStateToProps, mapDispatchToProps)(ShopTheLook);
