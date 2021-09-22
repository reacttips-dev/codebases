import React from 'react';

import waitForGraphql from 'js/lib/waitForGraphQL';
import type {
  IdVerificationsQuery as IdVerificationsQueryType,
  IdVerificationsQuery_IdVerificationsV1Resource_me_elements as UserVerificationData,
} from 'bundles/item/components/__generated__/IdVerificationsQuery';
import { org_coursera_userverification_idverification_IdVerificationApprovalSource as IdVerificationApprovalSource } from 'bundles/item/components/__generated__/globalTypes';

import gql from 'graphql-tag';
import { FormattedHTMLMessage } from 'js/lib/coursera.react-intl';
import _t from 'i18n!nls/ondemand';
import localStorage from 'js/lib/coursera.store';
import { getUserFullName } from 'bundles/verification/data/VerificationUtils';

import { Checkbox } from '@coursera/coursera-ui';
import { Typography, Link } from '@coursera/cds-core';

import 'css!./__styles__/HonorCodeAgreement';

type PropsFromGraphql = {
  userVerificationInformation: Partial<UserVerificationData> | null | undefined;
};

type PropsFromCaller = {
  onLoaded?: () => void;
  onAgreementComplete?: (name: string) => void;
  onAgreementIncomplete?: () => void;
  isShownInsideModal?: boolean;
};

type PropsToComponent = PropsFromGraphql & PropsFromCaller;

type State = {
  agreementChecked: boolean;
  fullName: string;
  userVerified: boolean;
};

class HonorCodeAgreement extends React.Component<PropsToComponent, State> {
  nameInput: HTMLElement | null | undefined;

  constructor(props: PropsToComponent, context: $TSFixMe) {
    super(props, context);
    const { userVerificationInformation } = props;
    const userVerified = userVerificationInformation?.verifiedBy !== IdVerificationApprovalSource.NONE;
    const fullName = userVerified
      ? getUserFullName(userVerificationInformation)
      : localStorage.get('temporaryVerifiedProfileFullName');
    this.state = {
      agreementChecked: false,
      fullName,
      userVerified,
    };
  }

  componentDidMount() {
    const { onLoaded } = this.props;
    // Let callers know we've loaded, in case they want to show a loading screen to prevent a
    // situation where everything but the honor code agreement is visible.
    // Since the graphql call is a "wait for", we've "loaded" as soon as this component is mounted.
    onLoaded?.();
  }

  handleCheckboxChange = () => {
    this.setState(
      (prevState) => ({
        agreementChecked: !prevState.agreementChecked,
      }),
      () => {
        if (!this.state.userVerified && this.state.agreementChecked && this.nameInput) {
          this.nameInput.focus();
        }

        this.checkForAgreementCompletion(this.state.agreementChecked, this.state.fullName);
      }
    );
  };

  handleNameInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!(event.target instanceof HTMLInputElement)) {
      return;
    }

    const fullName = event.target.value;

    this.setState({
      fullName,
    });

    localStorage.set('temporaryVerifiedProfileFullName', fullName);

    this.checkForAgreementCompletion(this.state.agreementChecked, fullName);
  };

  checkForAgreementCompletion(checkedState: boolean, fullName: string) {
    if (checkedState && fullName) {
      this.props.onAgreementComplete?.(fullName);
    } else {
      this.props.onAgreementIncomplete?.();
    }
  }

  render() {
    const { fullName, userVerified } = this.state;
    const honorCodeLink = 'https://learner.coursera.help/hc/articles/209818863';

    const agreementStringWithName = (
      <FormattedHTMLMessage
        message={_t(
          `I, <b class="honor-code-agreement full-name pii-hide">{fullName}</b>, understand that submitting work that isn’t my own may result in permanent failure of this course or deactivation of my Coursera account.`
        )}
        fullName={fullName}
      />
    );
    const agreementStringNoName = _t(
      `I understand that submitting work that isn’t my own may result in permanent failure of this course or deactivation of my Coursera account.`
    );

    const agreementString = !userVerified ? agreementStringNoName : agreementStringWithName;

    return (
      <div className="rc-HonorCodeAgreement">
        <div>
          <Typography variant="h3bold" component="span">
            {_t('Coursera Honor Code')}
          </Typography>
          &nbsp;&nbsp;
          <Link
            href={honorCodeLink}
            target="_blank"
            rel="noopener noreferrer"
            typographyVariant="body1"
            aria-label={_t('Learn more about Coursera’s Honor Code')}
          >
            {_t('Learn more')}
          </Link>
        </div>

        <div className="agreement-container horizontal-box">
          <div data-test="agreement-checkbox">
            <Checkbox
              inputHtmlAttributes={{ 'aria-labelledby': 'check-agree' }}
              uncheckedColor="#636363" // TODO: switch to use CDS checkbox + colors. setting a oneoff color, as we don't have this color in CUI, and not risking using CDS colors yet.
              onChange={this.handleCheckboxChange}
            />
          </div>
          <div className="agreement-text">
            <div className="checkbox-label">
              <label id="check-agree" htmlFor="check-agree">
                <Typography variant="body1" component="span">
                  {agreementString}
                </Typography>
              </label>
            </div>
            {!userVerified && (
              <div className="legal-name">
                <div className="input-area">
                  <input
                    placeholder={_t('Enter your legal name')}
                    aria-label={_t('Enter your legal name')}
                    defaultValue={fullName}
                    className="honor-code-agreement name-input pii-hide"
                    ref={(nameInput) => {
                      this.nameInput = nameInput;
                    }}
                    onChange={this.handleNameInputChange}
                  />

                  <div className="input-caption caption-text color-secondary-text">
                    {_t('Use the name on your government issued ID')}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

type IdVerificationsQueryVariables = {};

export const IdVerificationsQuery = gql`
  query IdVerificationsQuery {
    IdVerificationsV1Resource {
      me {
        elements {
          id
          firstName
          middleName
          lastName
          verifiedBy
        }
      }
    }
  }
`;

export default waitForGraphql<
  PropsFromCaller,
  IdVerificationsQueryType,
  IdVerificationsQueryVariables,
  PropsToComponent
>(IdVerificationsQuery, {
  props: ({ data, ownProps }) => {
    return {
      ...ownProps,
      userVerificationInformation: data?.IdVerificationsV1Resource?.me?.elements?.[0] || {
        verifiedBy: IdVerificationApprovalSource.NONE,
      },
    };
  },
})(HonorCodeAgreement);
