import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import {compose} from 'react-apollo';
import BaseModal from '../../../shared/library/modals/base/modal.jsx';
import {withPortal} from '../../../shared/library/modals/base/portal';
import SimpleButton from '../../../shared/library/buttons/base/simple';
import TextField from '../../../shared/library/inputs/text';
import Select, {BLOCK} from '../../../shared/library/inputs/select';
import CheckBoxes from './checkbox.jsx';
import SuccessfullySignedUpIcon from '../../../shared/library/icons/succesfully-signed-up.svg';
import Circular, {BUTTON} from '../../../shared/library/indicators/indeterminate/circular';
import {createPrivateStackshareLead} from '../../../../app/data/private-landing/mutations';
import {withMutation} from '../../../shared/enhancers/graphql-enhancer';
import {WHITE, CATHEDRAL, SILVER_ALUMINIUM} from '../../../shared/style/colors';
import {
  IS_NOT_NULL,
  IS_EMAIL,
  IS_VALID_URL,
  validateEmail,
  validateWebsite,
  validateNotNull
} from '../../../../app/shared/utils/validate.js';
import {PHONE, DESKTOP} from '../../../shared/style/breakpoints';
import {useSendAnalyticsEvent} from '../../../shared/enhancers/analytics-enhancer';

const defaultFormArray = [
  [
    {
      label: 'First Name',
      placeholder: 'Enter first name',
      keyName: 'firstName',
      type: 'text',
      validation: []
    },
    {
      label: 'Last Name',
      placeholder: 'Enter last name',
      keyName: 'lastName',
      type: 'text',
      validation: []
    }
  ],
  {
    label: 'Company email address',
    placeholder: 'Enter company email address',
    keyName: 'email',
    type: 'text',
    validation: [IS_EMAIL, IS_NOT_NULL]
  },
  {
    label: 'Position/Title',
    placeholder: 'Your position with company',
    keyName: 'position',
    type: 'text',
    validation: []
  },
  {
    label: 'Company Name',
    placeholder: 'Enter the company name',
    keyName: 'companyName',
    type: 'text',
    validation: [IS_NOT_NULL]
  },
  {
    label: 'Company Website URL',
    placeholder: 'Enter the company URL',
    keyName: 'companyUrl',
    type: 'text',
    validation: [IS_VALID_URL, IS_NOT_NULL]
  },
  {
    label: 'Location',
    placeholder: 'Enter the company location',
    keyName: 'location',
    type: 'text',
    validation: []
  },
  {
    label: 'Number of engineers/developers at your company',
    placeholder: 'Select the number of engineers',
    keyName: 'numberOfEngineers',
    type: 'select',
    selectStyle: {
      height: 45
    },
    customOffset: 22,
    options: [
      {
        name: '0-50',
        value: '0-50'
      },
      {
        name: '51-100',
        value: '51-100'
      },
      {
        name: '101-250',
        value: '101-250'
      },
      {
        name: '251-500',
        value: '251-500'
      },
      {
        name: '501-1000',
        value: '501-1000'
      },
      {
        name: '1001+',
        value: '1001+'
      }
    ],
    validation: [IS_NOT_NULL]
  },
  {
    label: 'Where do you host your Git repos?',
    keyName: 'repositoryHosts',
    type: 'checkbox',
    hasOther: true,
    options: [
      {name: 'GitHub (github.com)', icon: 'github'},
      {name: 'GitHub Enterprise (On-Prem/Server)', icon: 'github'},
      {name: 'GitHub Enterprise Cloud', icon: 'github'},
      {name: 'Bitbucket Cloud', icon: 'bitbucket'},
      {name: 'Bitbucket Server', icon: 'bitbucket'},
      {name: 'GitLab Cloud', icon: 'gitlab'},
      {name: 'GitLab Enterprise (On-Prem)', icon: 'gitlab'},
      {name: 'Azure DevOps', icon: 'azure'},
      {name: 'Azure DevOps Server', icon: 'azure'}
    ],
    validation: []
  },
  {
    label: 'How can we help you?',
    placeholder: '',
    keyName: 'helpMessage',
    type: 'text',
    validation: []
  }
];

let formArray = JSON.parse(JSON.stringify(defaultFormArray));

const SignUpContentForm = glamorous.div({
  background: WHITE,
  padding: '32px 44px',
  '& label': {
    fontSize: 14,
    fontWeight: 600,
    lineHeight: 2,
    color: CATHEDRAL
  },
  [PHONE]: {
    padding: 20
  }
});

const SignedUpSuccessfully = glamorous.div({
  background: WHITE,
  height: 510,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  textAlign: 'center'
});

const BreakUpLine = glamorous.hr({
  marginBottom: 24
});

const SignUpContainer = glamorous.div({
  display: 'flex',
  justifyContent: 'flex-end',
  marginBottom: 20
});

const SignUpForPrivateStackshare = glamorous(SimpleButton)({
  height: 47,
  width: 120,
  border: 0,
  borderRadius: 2,
  fontSize: 14,
  fontWeight: 600,
  padding: '13px 30px',
  color: WHITE
});

const Close = glamorous(SimpleButton)({
  height: 47,
  border: 0,
  borderRadius: 4,
  fontSize: 14,
  fontWeight: 600,
  padding: '14px 40px',
  color: WHITE
});

const SingleRow = glamorous.div({
  [DESKTOP]: {
    display: 'flex',
    justifyContent: 'space-between',
    '> div': {
      width: '48%'
    }
  }
});

const Form = glamorous.div({
  maxHeight: 400,
  overflowX: 'hidden',
  overflowY: 'auto',
  paddingRight: 10,
  '::-webkit-scrollbar': {
    width: 5
  },

  '::-webkit-scrollbar-thumb': {
    borderRadius: 5,
    backgroundColor: 'rgba(0,0,0,.5)',
    boxShadow: ' 0 0 1px rgba(255,255,255,.5)'
  },
  [PHONE]: {
    maxHeight: 400
  }
});

const SuccesfullySignedUp = glamorous(SuccessfullySignedUpIcon)({
  height: 82,
  width: 82
});

const SuccesfullMessage = glamorous.h3({
  fontSize: 18,
  fontWeight: 'bold',
  color: CATHEDRAL,
  margin: '20px 0 15px 0'
});

const PromiseToRespond = glamorous.h4({
  fontSize: 15,
  lineHeight: 1.73,
  color: SILVER_ALUMINIUM,
  marginTop: 0,
  marginBottom: 28,
  [PHONE]: {
    marginRight: 15,
    marginLeft: 15
  }
});

const Loader = glamorous.div({
  width: 119,
  height: 47,
  borderRadius: 4,
  background: 'rgba(6, 141, 254, 0.15)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
});

const formStateDefault = {
  firstName: '',
  lastName: '',
  position: '',
  email: '',
  companyName: '',
  companyUrl: '',
  location: '',
  numberOfEngineers: '',
  repositoryHosts: '',
  helpMessage: ''
};

const errorStateDefault = {
  firstName: false,
  lastName: false,
  position: false,
  email: false,
  companyName: false,
  companyUrl: false,
  location: false,
  numberOfEngineers: false,
  repositoryHosts: false,
  helpMessage: false
};

const SignUpForPrivateStackshareBeta = ({
  onDismiss,
  createPrivateStackshareLead,
  mobile,
  title,
  type
}) => {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formState, setFormState] = useState(formStateDefault);
  const [errorState, setErrorState] = useState(errorStateDefault);
  const sendAnalyticsEvent = useSendAnalyticsEvent();

  useEffect(() => {
    formArray = JSON.parse(JSON.stringify(defaultFormArray));
    sendAnalyticsEvent('open-private-stackshare-form', {
      path: typeof window !== 'undefined' ? window.location.pathname : null,
      url: typeof window !== 'undefined' ? window.location.href : null,
      referrer: typeof document !== 'undefined' ? document.referrer : null
    });
  }, []);

  const handleOnChange = (value, elementDetails) => {
    setFormState(prevState => {
      return {
        ...prevState,
        [elementDetails.keyName]: value
      };
    });

    if (errorState[elementDetails.keyName]) checkForError(elementDetails);
  };

  const renderElements = arrayToRender => {
    return arrayToRender.map(formElement =>
      formElement.length ? (
        <SingleRow>{renderElements(formElement)}</SingleRow>
      ) : (
        whichElementToRender(formElement)
      )
    );
  };

  const whichElementToRender = elmDets => {
    const elementDetails = JSON.parse(JSON.stringify(elmDets));

    switch (elementDetails.type) {
      case 'text':
        return (
          <TextField
            {...elementDetails}
            value={formState[elementDetails.keyName]}
            onChange={e => handleOnChange(e.target.value, elementDetails)}
            style={{marginTop: 23}}
            borderWidth={1}
            error={errorState[elementDetails.keyName]}
            isRequired={Boolean(elementDetails.validation && elementDetails.validation.length)}
          />
        );
      case 'select':
        return (
          <Select
            display={BLOCK}
            {...elementDetails}
            value={formState[elementDetails.keyName]}
            onSelect={e => {
              handleOnChange(e, elementDetails);
            }}
            style={{marginTop: 23}}
            error={errorState[elementDetails.keyName]}
            isRequired={Boolean(elementDetails.validation && elementDetails.validation.length)}
          />
        );
      case 'checkbox':
        return (
          <CheckBoxes
            elementDetails={elementDetails}
            handleOnChange={handleOnChange}
            error={errorState[elementDetails.keyName]}
            mobile={mobile}
          />
        );
    }
  };

  const checkForError = formElement => {
    let hasError = false;

    formElement.validation.map(validate => {
      switch (validate) {
        case IS_NOT_NULL:
          if (!validateNotNull(formState[formElement.keyName])) {
            setErrorState(prevState => ({
              ...prevState,
              [formElement.keyName]: `Please enter ${formElement.label.replace('*', '')}.`
            }));
            hasError = true;
          }
          break;
        case IS_EMAIL:
          if (!validateEmail(formState[formElement.keyName])) {
            setErrorState(prevState => ({
              ...prevState,
              [formElement.keyName]: 'Please enter valid email address.'
            }));
            hasError = true;
          }
          break;
        case IS_VALID_URL:
          if (!validateWebsite(formState[formElement.keyName])) {
            setErrorState(prevState => ({
              ...prevState,
              [formElement.keyName]: 'Please enter valid url.'
            }));
            hasError = true;
          }
          break;
      }
    });

    if (!hasError && errorState[formElement.keyName]) {
      setErrorState(prevState => ({
        ...prevState,
        [formElement.keyName]: false
      }));
    }

    return hasError;
  };

  const checkError = formElements => {
    let arr = formElements.map(formElement =>
      formElement.length ? checkError(formElement) : checkForError(formElement)
    );
    return arr.some(elm => elm);
  };

  const submitData = async () => {
    setIsSubmitting(true);

    let hasError = await checkError(formArray);

    sendAnalyticsEvent('sign_up_private_stackshare_form', {...formState, success: !hasError});

    if (hasError) {
      setIsSubmitting(false);
      document.getElementById('#top').scrollIntoView();
      return;
    }
    const resp = await createPrivateStackshareLead(formState);

    if (resp.data.createPrivateStackshareLead) {
      setSubmitted(true);
    }
  };

  return (
    <BaseModal layout="none" title={title} onDismiss={submitted ? null : onDismiss} width={744}>
      {submitted ? (
        <SignedUpSuccessfully>
          <SuccesfullySignedUp alt={'Succesfully Signed Up'} />
          <SuccesfullMessage>
            {type === 'signup' ? 'Succesfully signed up!' : 'Succesfully Submitted!'}
          </SuccesfullMessage>
          <PromiseToRespond>We‘ll be in touch with you soon to tell you more!</PromiseToRespond>
          <Close onClick={onDismiss}>Close</Close>
        </SignedUpSuccessfully>
      ) : (
        <SignUpContentForm>
          <Form>
            <div id="#top" />
            {renderElements(formArray)}
          </Form>
          <BreakUpLine />
          <SignUpContainer>
            {isSubmitting ? (
              <Loader>
                <Circular size={BUTTON} />
              </Loader>
            ) : (
              <SignUpForPrivateStackshare onClick={submitData}>
                {type === 'signup' ? 'Sign Up' : 'Submit'}
              </SignUpForPrivateStackshare>
            )}
          </SignUpContainer>
        </SignUpContentForm>
      )}
    </BaseModal>
  );
};

SignUpForPrivateStackshareBeta.propTypes = {
  onDismiss: PropTypes.func,
  createPrivateStackshareLead: PropTypes.func,
  mobile: PropTypes.bool,
  title: PropTypes.string,
  type: PropTypes.oneOf(['signup', 'lead'])
};

SignUpForPrivateStackshareBeta.defaultProps = {
  title: '',
  type: 'signup'
};

export default compose(
  withPortal,
  withMutation(createPrivateStackshareLead, mutate => ({
    createPrivateStackshareLead: variables => mutate({variables})
  }))
)(SignUpForPrivateStackshareBeta);
