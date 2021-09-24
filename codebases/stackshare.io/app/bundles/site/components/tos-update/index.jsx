import React, {useContext, useState} from 'react';
import {withPortal} from '../../../../shared/library/modals/base/portal';
import BaseModal from '../../../../shared/library/modals/base/modal';
import TermsIcon from '../../../../shared/library/icons/terms-icon.svg';
import glamorous from 'glamorous';
import BigTitle from '../../../../shared/library/typography/big-title';
import Text from '../../../../shared/library/typography/text';
import SimpleButton from '../../../../shared/library/buttons/base/simple';
import Checkbox from '../../../../shared/library/inputs/checkbox';
import {FOCUS_BLUE, TARMAC} from '../../../../shared/style/colors';
import {acceptTermsOfService} from '../../../../data/site/mutations';
import {ApolloContext} from '../../../../shared/enhancers/graphql-enhancer';
import PropTypes from 'prop-types';

const Container = glamorous.div({
  display: 'flex',
  flexDirection: 'column',
  padding: '0 29px',
  ' span': {
    display: 'flex',
    justifyContent: 'center'
  }
});

const CheckboxContainer = glamorous.div({
  margin: '15px 5px 0'
});

export const Label = glamorous.div({
  color: TARMAC,
  fontSize: 14,
  ' a': {
    color: FOCUS_BLUE
  }
});

const Title = glamorous(BigTitle)({
  textAlign: 'center',
  margin: '10px 0',
  fontSize: 25
});

const StyledText = glamorous(Text)({
  fontSize: 14
});

const Button = glamorous(SimpleButton)({
  width: '100%',
  height: 50,
  margin: '25px 0 0 0',
  fontSize: 15
});

const TermsOfServiceModal = ({setCloseModal}) => {
  const [termsChecked, setTermsChecked] = useState(false);
  const [privacyChecked, setPrivacyChecked] = useState(false);
  const client = useContext(ApolloContext);
  const onButtonClick = () => {
    client.mutate({mutation: acceptTermsOfService});
    setCloseModal(true);
  };

  return (
    <>
      <BaseModal width={500} onDismiss={null} hideTitleBar={true} layout="auto">
        <Container>
          <span>
            <TermsIcon />
          </span>
          <Title>Terms of Service & Privacy Policy</Title>
          <StyledText>
            We have updated StackShare&apos;s Terms of Service & Privacy Policy. These changes are
            effective for all users as of June 19th, 2020. You are required to read and agree to
            these policies before continuing to use StackShare.
          </StyledText>
          <CheckboxContainer>
            <Checkbox
              checked={termsChecked}
              disabled={false}
              onToggle={() => setTermsChecked(!termsChecked)}
            >
              <Label>
                I’ve read and agree with StackShare&apos;s{' '}
                <a href="/terms" title="Terms of Service" target="_blank">
                  Terms of Service
                </a>
              </Label>
            </Checkbox>
          </CheckboxContainer>
          <CheckboxContainer>
            <Checkbox
              checked={privacyChecked}
              disabled={false}
              onToggle={() => setPrivacyChecked(!privacyChecked)}
            >
              <Label>
                I’ve read and agree with StackShare&apos;s{' '}
                <a href="/privacy" title="Terms of Service" target="_blank">
                  Privacy Policy
                </a>
              </Label>
            </Checkbox>
          </CheckboxContainer>
          <Button
            onClick={() => onButtonClick(setCloseModal, client)}
            disabled={!privacyChecked || !termsChecked}
          >
            Done
          </Button>
        </Container>
      </BaseModal>
    </>
  );
};

TermsOfServiceModal.propTypes = {
  setCloseModal: PropTypes.func
};

const TermsOfServicePortal = withPortal(TermsOfServiceModal);

const TOSUpdate = () => {
  const [closeModal, setCloseModal] = useState(false);
  if (
    window.location.href.includes('terms') ||
    window.location.href.includes('privacy') ||
    closeModal
  ) {
    return <></>;
  }
  return (
    <TermsOfServicePortal
      closeModal={closeModal}
      setCloseModal={setCloseModal}
      preventClickAway={true}
    />
  );
};

export default TOSUpdate;
