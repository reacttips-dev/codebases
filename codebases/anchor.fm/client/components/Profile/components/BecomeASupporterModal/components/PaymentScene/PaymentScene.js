import React from 'react';
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';
import ToggleButton from 'react-bootstrap/lib/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/lib/ToggleButtonGroup';
import styles from './PaymentScene.sass';
import { parseUserAgent } from '../../../../../../../helpers/serverRenderingUtils';
import getDollarStringFromCents from '../../../../../../modules/getDollarStringFromCents';
import ExpandableSupportMessage from './components/ExpandableSupportMessage';
import ContentHeader from '../ContentHeader';
import { mapPlatformToEventTarget } from '../../../../../../money';
import PaymentForm from '../../../../../PaymentForm';

class PaymentScene extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      needsLineOffset: false,
    };
  }

  componentDidMount() {
    const { browser } = parseUserAgent();
    // Safari browser appears to be off by a full line in calculation
    if (browser === 'sa') {
      this.setState(() => ({
        needsLineOffset: true,
      }));
    }
  }

  render() {
    const {
      onSelectPerMonthSupportOptionsChoice,
      selectedPerMonthSupportOption,
      perMonthSupportOptions,

      hasMobileStyling,
      isMessageFromCreator,
      message,
      podcastAuthor,
      podcastName,
      podcastImageUrl,
      trackListenerSupportEvent,

      onSubmitSupport,
    } = this.props;

    let line = hasMobileStyling ? 4 : 3;
    if (this.state.needsLineOffset) {
      line = hasMobileStyling ? line - 2 : line - 1;
    }

    return (
      <div className={styles.root}>
        <div className={styles.body}>
          <div className={styles.creatorSection}>
            <ContentHeader
              headerTitle="Become a supporter"
              hasMobileStyling={hasMobileStyling}
              podcastImageUrl={podcastImageUrl}
              podcastName={podcastName}
              podcastAuthor={podcastAuthor}
              isMessageFromCreator={isMessageFromCreator}
              contentDescription={
                isMessageFromCreator ? (
                  <ExpandableSupportMessage
                    line={line}
                    className={styles.customMessage}
                    text={message}
                  />
                ) : (
                  message
                )
              }
            />
            <div className={styles.divider} />
          </div>
          <div className={styles.choiceSection}>
            {perMonthSupportOptions.length > 0 && (
              <div className={styles.chooseASupportLevelTitle}>
                Your monthly contribution
              </div>
            )}
            <ButtonToolbar bsClass={`${styles.choiceToolbar} .btn-toolbar`}>
              <ToggleButtonGroup
                value={selectedPerMonthSupportOption}
                onChange={o => onSelectPerMonthSupportOptionsChoice(o.id, o)}
                type="radio"
                name="choice"
              >
                {perMonthSupportOptions.map(perMonthSupportOption => (
                  <ToggleButton
                    value={perMonthSupportOption}
                    key={perMonthSupportOption.id}
                  >
                    {getDollarStringFromCents(perMonthSupportOption.amount)}
                    {!hasMobileStyling && ' per month'}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </ButtonToolbar>
          </div>
          <PaymentForm
            className={styles.paymentMethodSection}
            nativePayButtonClassName={styles.paymentMethodSectionNative}
            creditCardLinkClassName={styles.payWithCreditCardLink}
            creditCardFormClassName={styles.paymentMethodSectionCreditCard}
            loadingSceneClassName={styles.positionedAsNativePayment}
            selectedProduct={selectedPerMonthSupportOption}
            itemLabel="Monthly donation"
            totalLabel={podcastName}
            submitButtonLabel={
              selectedPerMonthSupportOption
                ? `Support for ${getDollarStringFromCents(
                    selectedPerMonthSupportOption.amount
                  )} a month`
                : 'Submit'
            }
            onClickPaymentButton={platformName => {
              trackListenerSupportEvent({
                type: 'payment_button_clicked',
                target: mapPlatformToEventTarget(platformName),
              });
            }}
            onSubmitPaymentForm={(data, metadata) => {
              const { selectedProduct } = data;
              return onSubmitSupport(
                {
                  ...data,
                  perMonthSupportOption: selectedProduct,
                },
                metadata
              );
            }}
          />
        </div>
      </div>
    );
  }
}

export default PaymentScene;
