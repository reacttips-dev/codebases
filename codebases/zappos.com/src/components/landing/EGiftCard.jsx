import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { parse } from 'query-string';
import cn from 'classnames';

import useMartyContext from 'hooks/useMartyContext';
import { PRODUCT_ASIN } from 'common/regex';
import { toUSD } from 'helpers/NumberFormats';
import { translateCartError } from 'apis/mafia';
import { changeQuantity, fetchCartItems } from 'actions/cart';
import { fetchEGiftCardDesigns, setGiftCardDesign } from 'actions/eGiftCard';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import { Loader } from 'components/Loader';
import MelodyCarousel from 'components/common/MelodyCarousel';
import HtmlToReact from 'components/common/HtmlToReact';
import ZapposForm from 'components/landing/ZapposForm';

import css from 'styles/components/landing/egiftcard.scss';
import { mCard, image as mImage } from 'styles/components/common/melodyCard.scss';

export const EGiftCard = props => {
  const { testId, router, marketplace: { pdp: { egcUrl } } } = useMartyContext();

  const {
    eGiftCards: { asin, designs = [] } = {},
    cartIsLoaded,
    isEgcInCart,
    egcTerms,
    setGiftCardDesign,
    changeQuantity,
    slotDetails,
    fetchCartItems,
    fetchEGiftCardDesigns
  } = props;

  const [ isAdding, setAdding ] = useState(false);
  const [ price, setPrice ] = useState(0);

  // get egc designs from api
  useEffect(() => {
    if (!designs.length) {
      fetchEGiftCardDesigns();
    }
  }, [designs.length, fetchEGiftCardDesigns]);

  // fetch cart if it hasn't been fetched already (to confirm you only have one egc in your cart)
  useEffect(() => {
    if (!cartIsLoaded) {
      fetchCartItems();
    }
  }, [cartIsLoaded, fetchCartItems]);

  // select specific EGC from query param asin
  useEffect(() => {
    const { asin } = parse(window.location.search); // using query-string here because `URLSearchParams` api is unsupported in IE11

    const isAsin = PRODUCT_ASIN.test(asin);
    if (isAsin && designs.some(design => design.asin === asin)) {
      setGiftCardDesign(asin);
    }
  }, [designs, setGiftCardDesign]);

  const onAddToCart = e => {
    e.preventDefault();
    const { recipientName, recipientEmail, senderName, message, amount } = e.target;
    setAdding(true);

    changeQuantity({
      items: [{
        asin,
        recipientName: recipientName.value,
        recipientEmail: recipientEmail.value,
        senderName: senderName.value,
        message: message.value,
        amount: amount.value,
        itemType: 'egc',
        egc: true,
        quantity: 1
      }]
    }, { firePixel: true })
      .then(resp => {
        const error = translateCartError(resp);
        if (error) {
          setAdding(false);
          alert(error);
        } else {
          fetchCartItems(); // TODO: remove this logic once https://github01.zappos.net/mweb/marty/issues/6291 is addressed on the mafia side
          router.push('/cart');
        }
      });
  };

  const onDesignChosen = event => {
    const { asin } = event.currentTarget.dataset;
    setGiftCardDesign(asin);
  };

  const getDesign = designs => (
    asin ?
      designs.find(design => design.asin === asin) :
      designs[0]
  );

  const makeDesigns = ({ asin, imageUrl, designName }) => (
    <div key={asin} className={cn(css.designContainer, mCard)}>
      <Link
        to={`${egcUrl}?asin=${asin}`}
        className={mImage}
        onClick={onDesignChosen}
        data-asin={asin}
        data-test-id={testId('egcDesign')}>
        <img src={imageUrl} alt={designName}/>
      </Link>
    </div>
  );

  const onBlur = e => {
    const { target } = e;

    if (!target) {
      return;
    }

    switch (target.name) {
      case 'amount':
        setPrice(target.value || 0);
        break;
      default:
        break;
    }
  };

  // if egc designs are fetched and cart is loaded
  if (!(designs.length && cartIsLoaded)) {
    return <Loader />;
  }

  const selectedDesign = getDesign(designs);

  if (isEgcInCart) {
    const {
      cta,
      heading,
      copy
    } = slotDetails.alreadyEgc;
    return (
      <div className={cn(css.container, css.egcInCart)} data-test-id={testId('egcInCartMsg')}>
        <h2>{heading}</h2>
        <p>{copy}</p>

        <Link to="/cart" data-test-id={testId('goToCart')}>{cta}</Link>
      </div>
    );
  }

  const formListeners = {
    onBlur,
    onSubmit: onAddToCart
  };

  return (
    <div className={css.container}>
      <div className={css.designs}>
        <div className={css.selected}>
          <img data-test-id={testId('egcImage')} src={selectedDesign.imageUrl} alt="Electronic Gift Card"/>
          <div className={css.info}>
            <div className={css.code}>
              Asin
              <span data-test-id={testId('egcAsin')}>{selectedDesign.asin}</span>
            </div>
            <div className={css.amount}>{toUSD(price)}</div>
          </div>
        </div>

        <div className={css.carousel}>
          { designs.length > 1 &&
            <MelodyCarousel>
              {designs.map(makeDesigns)}
            </MelodyCarousel>
          }
        </div>
      </div>
      <div>
        <ZapposForm
          className={css.form}
          formListeners={formListeners}
          slotDetails={slotDetails}
          parentIsDisabled={isAdding} />
        <HtmlToReact containerEl="p" className={css.note}>
          {egcTerms}
        </HtmlToReact>
      </div>
    </div>
  );
};

function mapStateToProps(state) {
  const {
    headerFooter: { content: { Global: { slotData: { giftCardTerms: { egcTerms } = {} } } } },
    cart: { isLoaded: cartIsLoaded, cartObj } = {},
    eGiftCards
  } = state;

  const isEgcInCart = !!cartObj.activeItems?.find(item => item.egc === true);

  return {
    egcTerms,
    cartIsLoaded,
    eGiftCards,
    isEgcInCart
  };
}

const mapDispatchToProps = {
  changeQuantity,
  fetchCartItems,
  fetchEGiftCardDesigns,
  setGiftCardDesign
};

const ConnectedEGiftCard = connect(mapStateToProps, mapDispatchToProps)(EGiftCard);
export default withErrorBoundary('EGiftCard', ConnectedEGiftCard);
