import React, {Component} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import {compose} from 'react-apollo';
import BaseModal, {ButtonPanel} from '../../../../shared/library/modals/base/modal';
import {withPortal} from '../../../../shared/library/modals/base/portal';
import SimpleButton from '../../../../shared/library/buttons/base/simple.jsx';
import Link from '../../../../shared/library/typography/link';
import Title from '../../../../shared/library/typography/title';
import DigestIcon from './icons/digest-icon.svg';
import {grid} from '../../../../shared/utils/grid';

const Container = glamorous.div({
  display: 'flex'
});

const Text = glamorous.div();

export class DigestModal extends Component {
  static propTypes = {
    onDismiss: PropTypes.func
  };

  render() {
    const {onDismiss} = this.props;
    return (
      <BaseModal title="Feed Weekly Digest" onDismiss={onDismiss} width={480}>
        <Container>
          <DigestIcon style={{width: 40, height: 40, flexShrink: 0, marginRight: grid(2)}} />
          <Text>
            <Title>You are now subscribed to the Feed Weekly Digest</Title> You can always change
            your preferences by going to your <Link href="/settings/email">email settings</Link>.
          </Text>
        </Container>
        <ButtonPanel>
          <SimpleButton onClick={onDismiss}>Ok, got it!</SimpleButton>
        </ButtonPanel>
      </BaseModal>
    );
  }
}

export default compose(withPortal)(DigestModal);
