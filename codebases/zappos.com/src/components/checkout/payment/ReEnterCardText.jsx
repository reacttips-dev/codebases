import css from 'styles/components/checkout/payment/reEnterCardText.scss';

const ReEnterCardText = ({ isChecked, isExpired, selectedPaymentNeedsConfirmation }) => {
  if (selectedPaymentNeedsConfirmation && isChecked && !isExpired) {
    return (
      <div className={css.cautionBox}>
        <h2>Please re-enter your card number.</h2>
        <ul>
          <li>We want to make sure this is an authorized use of your account.</li>
          <li>We take this additional security step only when you use this card to ship to an address for the first time or have recently edited your shipping address.</li>
        </ul>
      </div>
    );
  }

  return null;
};

export default ReEnterCardText;
