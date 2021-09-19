import cn from 'classnames';
import creditCardType, { types as CardType } from 'credit-card-type';

import { Amex, Discover, MasterCard, Visa } from 'components/checkout/CreditCards';

import css from 'styles/components/checkout/checkoutUtils.scss';

const paymentTypeLookupMap = {
  'AmericanExpress': 'Amex'
};

export const getPaymentTypeIcon = paymentType => {
  switch (paymentType) {
    case 'AmericanExpress':
      return <Amex />;
    case 'Discover':
      return <Discover />;
    case 'MasterCard':
      return <MasterCard />;
    case 'Visa':
      return <Visa />;
    default:
      return null;
  }
};

export const getMelodyPaymentTypeIcon = paymentType => {
  switch (paymentType) {
    case 'AmericanExpress':
      return <span className={css.amex} />;
    case 'Discover':
      return <span className={css.discover} />;
    case 'MasterCard':
      return <span className={css.mastercard} />;
    case 'Visa':
      return <span className={css.visa} />;
    default:
      return null;
  }
};

export const getMelodyPaymentTypeIconForInput = cc => {
  const ccPlain = cc.replace(/\D/g, '');
  const ccType = creditCardType(ccPlain);
  const isVisa = ccType.length === 1 && ccType.find(card => card.type === CardType.VISA);
  const isMasterCard = ccType.length === 1 && ccType.find(card => card.type === CardType.MASTERCARD);
  const isDiscover = ccType.length === 1 && ccType.find(card => card.type === CardType.DISCOVER);
  const isAmex = ccType.length === 1 && ccType.find(card => card.type === CardType.AMERICAN_EXPRESS);

  return [
    <span key="amex" className={cn(css.inline, css.amex, { [css.active]: isAmex })} />,
    <span key="discover" className={cn(css.inline, css.discover, { [css.active]: isDiscover })} />,
    <span key="mastercard" className={cn(css.inline, css.mastercard, { [css.active]: isMasterCard })} />,
    <span key="visa" className={cn(css.inline, css.visa, { [css.active]: isVisa })} />
  ];
};

export const getPaymentTypeDisplayText = paymentType => paymentTypeLookupMap[paymentType] || paymentType;

export function getFormattedDeliveryPromise(deliveryPromise) {
  let updatedText = deliveryPromise.includes('Guaranteed')
    ? deliveryPromise.replace('Guaranteed delivery date of ', '')
    : deliveryPromise.replace('Estimated Delivery ', '');

  updatedText = trimDays(updatedText);
  updatedText = updatedText.replace(/\sto/gi, ' -');

  return updatedText;
}

export function trimDays(deliveryMessage) {
  return deliveryMessage
    .replace(/(monday|tuesday|wednesday|thursday|friday|saturday|sunday),\s/gi, '');
}

export function shortenMonths(deliveryMessage) {
  return deliveryMessage
    .replace(/january/gi, 'Jan')
    .replace(/february/gi, 'Feb')
    .replace(/march/gi, 'Mar')
    .replace(/april/gi, 'Apr')
    .replace(/may/gi, 'May')
    .replace(/june/gi, 'Jun')
    .replace(/july/gi, 'Jul')
    .replace(/august/gi, 'Aug')
    .replace(/september/gi, 'Sept')
    .replace(/october/gi, 'Oct')
    .replace(/november/gi, 'Nov')
    .replace(/december/gi, 'Dec');
}
