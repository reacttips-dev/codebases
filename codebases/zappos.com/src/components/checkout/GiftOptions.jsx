import { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import cn from 'classnames';

import usePrevious from 'hooks/usePrevious';
import useMartyContext from 'hooks/useMartyContext';
import {
  fetchGiftOptions,
  onGiftOptionsImpression,
  onGiftOptionsNotEligible
} from 'store/ducks/giftoptions/actions';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';

import css from 'styles/components/checkout/giftOptions.scss';

export const GiftOptions = props => {
  const { testId } = useMartyContext();

  const {
    customerName,
    fetchGiftOptions,
    giftOptions: {
      hasInvalidGiftOptions,
      hasOnlyGiftMessagableItems,
      isLoaded,
      isLoading,
      giftOptions,
      giftOptionSuccessMessage,
      giftMessage: purchaseGiftMessage = ''
    },
    openByDefault,
    onGiftOptionsImpression,
    onGiftOptionsNotEligible,
    onToggleBox,
    onRemovingGiftOptions,
    onSavingGiftOptions,
    purchaseDataIsLoading
  } = props;

  const [isOpen, setOpen] = useState(openByDefault);
  const [giftMessage, setGiftMessage] = useState(purchaseGiftMessage);
  const [lineMessage, setLineMessage] = useState('10 lines');
  const [charMessage, setCharMessage] = useState('240 characters');
  const [charMessageWarning, setCharMessageWarning] = useState(false);
  const [lineMessageWarning, setLineMessageWarning] = useState(false);
  const previous = usePrevious({ purchaseGiftMessage, isLoaded }) || {};

  let maxLength = 0;
  Object.values(giftOptions).forEach(({ giftMessage: { maxLines, maxTotalLength } }) => {
    if (maxLines > 0 && (maxTotalLength <= maxLength || maxLength === 0)) {
      maxLength = maxTotalLength;
    }
  });

  const validateMessage = useCallback(enteredGiftMessage => {
    let maxLines = 0, maxTotalLength = 0;
    Object.values(giftOptions).forEach(({ giftMessage: { maxLines: itemMaxLines, maxTotalLength: itemMaxTotalLength } }) => {
      if (itemMaxLines > 0) {
        maxLines = itemMaxLines;
        maxTotalLength = itemMaxTotalLength;
      }
    });

    // Count the number of lines
    const numLines = enteredGiftMessage.split('\n').length;
    const size = enteredGiftMessage.length;

    // Determine the differences
    const charDelta = maxTotalLength - size;
    let lineDelta = maxLines - numLines;

    // Adjusting the line count according to entered text (24 characters = 1 line)
    const tempMsg = enteredGiftMessage.split('\n');
    tempMsg.forEach(eachLine => {
      if (eachLine.length > 24) {
        if ((eachLine.length % 24) === 0) {
          lineDelta -= Math.floor(eachLine.length / 24) - 1;
        } else {
          lineDelta -= Math.floor(eachLine.length / 24);
        }
      }
    });

    if (charDelta < -1) {
      setCharMessage(`${Math.abs(charDelta)} characters over`);
      setCharMessageWarning(true);
    } else if (charDelta < 0) {
      setCharMessage('1 character over');
      setCharMessageWarning(true);
    } else if (charDelta === 1) {
      setCharMessage('1 character');
      setCharMessageWarning(false);
    } else {
      setCharMessage(`${charDelta} characters`);
      setCharMessageWarning(false);
    }

    if (lineDelta < -1) {
      setLineMessage(`${Math.abs(lineDelta)} lines over`);
      setLineMessageWarning(true);
    } else if (lineDelta < 0) {
      setLineMessage('1 line over');
      setLineMessageWarning(true);
    } else if (lineDelta === 1) {
      setLineMessage('1 line');
      setLineMessageWarning(false);
    } else {
      setLineMessage(`${lineDelta} lines`);
      setLineMessageWarning(false);
    }

    setGiftMessage(enteredGiftMessage);
  }, [giftOptions]);

  const onGiftMessageChange = e => {
    if (!isLoaded || isLoading) {
      return;
    }
    const { target: { value: enteredGiftMessage } } = e;
    validateMessage(enteredGiftMessage);
  };

  const toggleIsOpen = e => {
    e.preventDefault();
    onToggleBox();
    setOpen(isOpen => !isOpen);
  };

  const onSubmitGiftMessage = e => {
    e.preventDefault();
    onSavingGiftOptions(giftMessage);
  };

  const removeGiftOption = e => {
    e.preventDefault();
    validateMessage('');
    onRemovingGiftOptions();
  };

  useEffect(() => {
    fetchGiftOptions();
  }, [fetchGiftOptions]);

  useEffect(() => {
    const { isLoaded: prevIsLoaded } = previous;
    if (isLoaded && !prevIsLoaded) {
      validateMessage(purchaseGiftMessage);
      onGiftOptionsImpression();
      if (!hasOnlyGiftMessagableItems) {
        onGiftOptionsNotEligible();
      }
    }
  }, [hasOnlyGiftMessagableItems, isLoaded, onGiftOptionsImpression, onGiftOptionsNotEligible, previous, purchaseGiftMessage, validateMessage]);

  const charWrapperClass = cn({ [css.warning]: charMessageWarning });
  const lineWrapperClass = cn({ [css.warning]: lineMessageWarning });

  const makeForm = () => (
  <>
  {
    isOpen && <form
      data-test-id={testId('addCouponForm')}
      onSubmit={onSubmitGiftMessage}
      method="POST"
      action="/marty/checkout"
      className={css.giftOptionsForm}>
      <div>
        A Gift From: <p className={css.customerName}>{customerName}</p>
      </div>

      <label htmlFor="giftMessage" className={css.forGiftMessage}>
        Add a Gift Message:
        <output
          aria-live="polite"
          className={css.messageLineText}
          htmlFor="giftMessage"
          id="characterHint">
          <span className={charWrapperClass}>{charMessage}</span> &#8226; <span className={lineWrapperClass}>{lineMessage}</span>
        </output>
      </label>

      <textarea
        aria-describedby="characterHint"
        aria-label="gift message"
        data-test-id={testId('giftMessage')}
        disabled={purchaseDataIsLoading}
        id="giftMessage"
        name="giftMessage"
        onChange={onGiftMessageChange}
        maxLength={maxLength}
        value={giftMessage || ''}
        rows="4">{giftMessage}</textarea>

      {
        hasInvalidGiftOptions && <div className={css.statusMessage}>
          <i className={css.errorIcon} /><span className={css.error}>Gift message is not valid</span>
        </div>
      }

      {
        giftOptionSuccessMessage && <div className={css.statusMessage}>
          <i className={css.successIcon} /><span className={css.success}>{giftOptionSuccessMessage}</span>
        </div>
      }

      <button
        type="submit"
        className={css.saveBtn}
        disabled={purchaseDataIsLoading || !giftMessage.length}
        data-test-id={testId('giftCardCodeSubmit')}>{purchaseGiftMessage ? 'Save' : 'Add'} Gift Message <span></span></button>

      {
        purchaseGiftMessage && <button
          type="button"
          className={css.removeBtn}
          disabled={purchaseDataIsLoading}
          onClick={removeGiftOption}
          data-test-id={testId('giftCardCodeSubmit')}>Remove Gift Message</button>
      }
    </form>
  }
  </>
  );

  const makeOptionsNotAvailable = () => (
    <>
    {
      isOpen && <p className={css.optionsNotAvailable}>Sorry, this order is not eligible to have a gift message</p>
    }
    </>
  );

  return (
    <>
    { isLoaded &&
      <div className={css.wrapper}>
        <button
          type="button"
          aria-expanded={isOpen}
          className={css.toggleBtn}
          onClick={toggleIsOpen}
          data-test-id={testId('giftCardPromoArea')}>
          <div className={cn([isOpen ? css.arrowUp : css.arrowDown], css.sectionTitleWrapper)}>
            <h3 className={css.sectionTitle}>
            Add a FREE Gift Message
              <span className={css.subTitle}>Includes a FREE Gift Receipt</span>
            </h3>
            <span className={css.giftIcon}></span>
          </div>
        </button>
        {
          hasOnlyGiftMessagableItems
            ? makeForm()
            : makeOptionsNotAvailable()
        }
      </div>
    }
    </>
  );
};

const mapStateToProps = ({ giftOptions }) => ({ giftOptions });

const GiftOptionsConnected = connect(mapStateToProps, { fetchGiftOptions, onGiftOptionsImpression, onGiftOptionsNotEligible })(GiftOptions);

const GiftOptionsConnectedWithErrorBoundary = withErrorBoundary('GiftOptions', GiftOptionsConnected);

export default GiftOptionsConnectedWithErrorBoundary;
