import React from 'react';
import { observer } from 'mobx-react';

import { Button } from '../../../js/components/base/Buttons';
import { Input } from '../../../js/components/base/Inputs';
import LoadingIndicator from '../../../js/components/base/LoadingIndicator';
import { Modal, ModalHeader, ModalContent, ModalFooter } from '../../../js/components/base/Modals';
import { updateTeamProfile } from '../services/ProfilePageService';
import { getStore } from '../../../js/stores/get-store';
import { isDomainNameValid } from '../../../js/utils/publicProfileValidation';
import { createEvent } from '../../../js/common/model-event';
import dispatchUserAction from '../../../js/modules/pipelines/user-action';

const descriptionText = 'Before your team\'s profile can be made public, update your team domain' +
  ' and make sure it\'s eligible for public visibility. Your team domain helps identify your team on Postman.',
  confirmCTAText = 'Continue';

/**
 * Modal for making team profile public.
 * The modal will be shown only when team domain is not compliant.
 *
 * The modal can be triggered in following way:
 * pm.mediator.trigger('showUpdateTeamProfileModal', {
 *    // Consumers can use this to pass text that will shown in the modal as
 *    // description rather than using the default one
 *    description: "This is the description text of the modal" // This is optional,
 *    confirmCTAText: "Text to be shown in the confirm button", // Optional
 *    disablePageRefresh: boolean, // optional, by default false
 *    onComplete: () => { // This is optional
 *        // This will be called if the public profile creation has succeeded
 *    },
 *    onCancel: () => {  // This is optional
 *        // This will be called when the user closes the modal explicitly
 *    }
 * });
 */
@observer
export default class UpdateTeamProfileModal extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      showModal: false,
      teamDomain: null,
      updating: false,
      error: null
    };

    this.descText = descriptionText;
    this.confirmCTAText = confirmCTAText;

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleContinue = this.handleContinue.bind(this);
    this.isContinueDisabled = this.isContinueDisabled.bind(this);
  }

  componentDidMount () {
    pm.mediator.on('showUpdateTeamProfileModal', this.handleOpen);
  }

  componentWillUnmount () {
    pm.mediator.off('showUpdateTeamProfileModal', this.handleOpen);
  }

  handleOpen (props) {
    const user = getStore('CurrentUserStore'),
      teamId = user.teamId,
      options = {
        organizationId: teamId,
        data: { isPublic: true }
      };

    this.domain = _.get(user, 'team.domain', '');
    this.descText = _.get(props, 'description') ? props.description : this.descText;
    this.confirmCTAText = _.get(props, 'confirmCTAText') ? props.confirmCTAText : this.confirmCTAText;
    this.onComplete = props && props.onComplete;
    this.onCancel = props && props.onCancel;
    this.disablePageRefresh = props && props.disablePageRefresh;

    // before showing the modal, check if the domain name is compliant by calling the API
    // case 1: For status code 200, the operation is complete and no need for showing modal
    // case 2: For status code 4xx, show the modal with right error message from API
    // case 3: For status code 5xx, show hard-coded error toast message and don't mount the modal
    updateTeamProfile(user, options)
      .then(() => {
        this.onComplete && this.onComplete();
      })
      .catch((error) => {
        if (error.status >= 400 && error.status <= 499) {
          // for 4xx, mount the modal with error from API
          this.setState({
            showModal: true,
            teamDomain: this.domain,
            error: _.get(error, 'error.message')
          });
        }
        else {
          // for 5xx, show error toast and don't mount the modal
          pm.toasts.error('Failed to make team profile public. Please try again after sometime');
        }
      });
  }

  handleContinue () {
    if (!this.state.teamDomain) {
      pm.toasts.error('Please enter team domain');
      return;
    }

    this.setState({ updating: true });

    let user = getStore('CurrentUserStore'),
        teamId = user.team.id;

    // update domain name and make profile public
    updateTeamProfile(user, { data: { domain: this.state.teamDomain, isPublic: true }, organizationId: teamId })
      .then(() => {
        this.setState({ updating: false });

        this.onComplete && this.onComplete();

        if (!this.disablePageRefresh) {
          let refreshOrganizationEvent = createEvent('refreshOrganizations', 'user');
          dispatchUserAction(refreshOrganizationEvent);
        }

        this.handleClose();
      })
      .catch((error) => {
        this.setState({ updating: false });

        if (error.status >= 400 && error.status <= 499) {
          this.setState({ error: _.get(error, 'error.message') });
        }
        else {
          this.handleClose();
          pm.toasts.error('Failed to make team profile public. Please try again after sometime');
        }
      });
  }

  /**
   * handles closing of modal
   * and reset the state when closed
   */
  handleClose () {
    this.onComplete = null;
    this.onCancel = null;
    this.descText = descriptionText;
    this.confirmCTAText = confirmCTAText;
    this.disablePageRefresh = false;

    this.setState({
      showModal: false,
      teamDomain: null
    });
  }

  handleCancel () {
    // Fire the consumer provided callback to notify that this action was canceled by the user
    typeof this.onCancel === 'function' && this.onCancel();

    this.handleClose();
  }

  handleChange (input) {
    this.setState({
      teamDomain: input,

      // validate if there's an error with input
      error: this.getDomainNameError(input)
    });
  }

  /**
   *
   * @param {String} domain
   */
  getDomainNameError (domain) {
    if (!domain || !domain.length) {
      return 'Empty domain not allowed';
    }
    else if (!isDomainNameValid(domain)) {
      return 'Must contain only alphabets, numbers, hyphens, and must be 6 to 64 characters.';
    }

    return null;
  }

  getCustomOverlayStyles () {
    return {
      zIndex: 120
    };
  }

  isContinueDisabled () {
    return this.state.error || this.state.updating;
  }

  render () {
    return (
      <Modal
        className='update-username-modal'
        isOpen={this.state.showModal}
        onRequestClose={this.handleCancel}
        customOverlayStyles={this.getCustomOverlayStyles()}
      >
        <ModalHeader>
          Update your team domain
        </ModalHeader>
        <ModalContent className='update-username-modal__content'>
          <p className='update-username-modal__description'>{this.descText}</p>
          <label>Team domain</label>
          <Input
            inputStyle='box'
            value={this.state.teamDomain}
            onChange={this.handleChange}
          />
          {
            (this.state.error !== null) &&
            <span className='update-user-profile-modal-container__input-name__error'>
              {this.state.error}
            </span>
          }
        </ModalContent>
        <ModalFooter>
          <Button
            className='action-button__cancel'
            type='primary'
            onClick={this.handleContinue}
            disabled={this.isContinueDisabled()}
          >
            {this.state.updating ? <LoadingIndicator /> : this.confirmCTAText}
          </Button>
          <Button
            className='action-button__cancel'
            type='secondary'
            onClick={this.handleCancel}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}
