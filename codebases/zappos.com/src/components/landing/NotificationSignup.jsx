// a "notify me" component for Landing Pages and generic brand taxonomy pages
// if scheduled in Symphony will include either a brand Id or a list Id from Content team
import { Component } from 'react';
import { connect } from 'react-redux';
import cn from 'classnames';
import PropTypes from 'prop-types';

import { defaultMeta } from 'cfg/marketplace.json';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import { subscribeToBrandNotification, subscribeToLandingList } from 'actions/landing/notificationSignup';
import { handleOverlayAfterSubmission } from 'helpers/modalHelpers';
import { AriaLiveTee } from 'components/common/AriaLive';
import { INTERNET_EMAIL } from 'common/regex';
import { HYDRA_SUBSCRIPTION_TEST } from 'constants/hydraTests';
import { triggerAssignment } from 'actions/ab';

import css from 'styles/components/landing/notificationSignup.scss';
const regex = INTERNET_EMAIL.toString().slice(2, -2);

export class NotificationSignup extends Component {
  state = {
    isSubmitted: false,
    encounteredError: false,
    hasSubmittedInvalid: false
  };

  handleSubmissionResult = isSuccessful => {
    isSuccessful ? this.setState({ isSubmitted: true }) : this.setState({ encounteredError: true });
  };

  onSubmit = e => {
    e.preventDefault();
    const { subscribeToLandingList, subscribeToBrandNotification, triggerAssignment, toggleModal } = this.props;
    // subscribeToLandingList is a listId sent in from content team through symphony
    // subscribeToBrandNotification could be a taxonomy page or a custom brand page through symphony
    const { target: { emailAddress, id, emailType } } = e;
    triggerAssignment(HYDRA_SUBSCRIPTION_TEST);

    if (emailAddress.checkValidity()) {
      const type = emailType.value;
      const newId = id.value;
      const email = emailAddress.value;

      this.setState({
        hasSubmittedInvalid: false,
        encounteredError: false
      });
      type === 'LIST' ? subscribeToLandingList(email, newId).then(this.handleSubmissionResult) : subscribeToBrandNotification(email, newId).then(this.handleSubmissionResult);
    } else {
      this.setState({ hasSubmittedInvalid: true });
      emailAddress.focus();
      return;
    }
    handleOverlayAfterSubmission(toggleModal);
  };

  makeInvalidMessage = () => {
    const { hasSubmittedInvalid } = this.state;
    const { testId } = this.context;
    const { slotName } = this.props;

    return hasSubmittedInvalid &&
      <p
        className={css.error}
        id={`${slotName}error`}
        data-test-id={testId('invalidEmailMsg')}>
        Uh oh, please enter a valid email address!
      </p>;
  };

  makeSuccessMessage = () => {
    const { isSubmitted } = this.state;
    const { testId } = this.context;

    return isSubmitted &&
      <p
        className={css.success}
        id="successMsg"
        data-test-id={testId('successEmailMsg')}
      ><AriaLiveTee role="alert">Thank you for signing up!</AriaLiveTee>
      </p>;
  };

  makeErrorMessage = () => {
    const { encounteredError } = this.state;
    const { testId } = this.context;

    return encounteredError &&
      <p className={css.error} data-test-id={testId('errorEmailMsg')} role="alert">Uh oh, looks like we've encountered an error.  This has been logged and we're working on a fix.  Thank you for your patience.</p>;
  };

  validateEmail = ({ target }) => {
    this.setState({ hasSubmittedInvalid: !target.checkValidity() });
  };

  makeForm = (id, emailType, image, alt) => {
    const { hasSubmittedInvalid } = this.state;
    const { onTaxonomyComponentClick, slotName } = this.props;
    const { title } = defaultMeta;
    const buttonText = 'notify me';
    const { testId } = this.context;
    const dataLabel = emailType === 'LIST' ? `${id}-signup` : 'Brand-Info';
    const emailId = `landingPageEmail-${id}`;
    return (
      <>
        <form
          method="post"
          onSubmit={this.onSubmit}
          className={css.emailForm}
          noValidate>
          <input
            type="hidden"
            name="emailType"
            value={emailType} />
          <input
            type="hidden"
            name="id"
            value={id} />
          <div className={css.formTop}>
            <label htmlFor={emailId} className={cn({ [css.labelInvalid]: hasSubmittedInvalid })}>Please enter your email address</label>

            <div className={css.actionContainer}>
              <input
                type="email"
                id={emailId}
                className={cn(css.email, { [css.emailInvalid]: hasSubmittedInvalid })}
                name="emailAddress"
                pattern={regex}
                required
                data-test-id={testId('notifyEmail')}
                aria-describedby={hasSubmittedInvalid ? `${slotName}error` : null}
                onBlur={this.validateEmail}
              />
              <button
                type="submit"
                className={css.notifyBtn}
                data-test-id={testId('signUpButton')}
                data-eventlabel={dataLabel}
                data-eventvalue="Notify-Me"
                onClick={onTaxonomyComponentClick}>{buttonText}
              </button>
            </div>
            {hasSubmittedInvalid && this.makeInvalidMessage()}
          </div>
          {image && <div className={css.imgWrap}>
            <img src={image} alt={alt} />
          </div>}
          <p>{title} respects your privacy. We don&#39;t rent or sell your personal information to anyone.</p>
        </form>
      </>
    );
  };

  render() {
    const { slotDetails, slotName, componentStyle, heading: propHeading, listId: brandid, imageUrl: image, alt } = this.props;
    const brandInfo = slotDetails.brand || slotDetails;
    const { monetateId } = slotDetails;
    const { id, name, type, header, listId } = brandInfo;
    const { isSubmitted, encounteredError } = this.state;
    const emailType = (type?.toUpperCase() || 'unset');
    const heading = propHeading || header;

    const newId = brandid || listId || id;

    if (newId) {
      return (
        <div className={cn(css.emailNotification, { [css.promoGroupStyles]: componentStyle === 'promoGroupModal' })} data-slot-id={slotName} data-monetate-id={monetateId}>
          {heading && <h2 className={css.head}>{heading}</h2>}
          {this.makeErrorMessage()}
          { (!isSubmitted && !encounteredError) && this.makeForm(newId, emailType, image, alt) }
          {this.makeSuccessMessage(name)}
        </div>
      );
    } else {
      return null;
    }
  }
}

NotificationSignup.propTypes = {
  slotDetails: PropTypes.object.isRequired
};

NotificationSignup.contextTypes = {
  testId: PropTypes.func
};

const mapStateToProps = state => ({
  notificationSignup: state.notificationSignup
});

const ConnectedNotificationSignup = connect(mapStateToProps,
  {
    subscribeToBrandNotification,
    subscribeToLandingList,
    triggerAssignment
  })(NotificationSignup);

export default withErrorBoundary('NotificationSignup', ConnectedNotificationSignup);
