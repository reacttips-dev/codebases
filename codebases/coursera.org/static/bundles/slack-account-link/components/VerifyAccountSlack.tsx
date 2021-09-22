import React from 'react';
import { TextInput, Button, Box } from '@coursera/coursera-ui';
import 'css!./__styles__/VerifyAccountSlack';
import _t from 'i18n!nls/slack-account-link';

type Props = {
  email: string;
  errorState: boolean;
  onLink: (email: string) => void;
};

type State = {
  linkButtonEnabled: boolean;
  email: string;
  errorState: boolean;
};

export class VerifyAccountSlack extends React.Component<Props, State> {
  state = {
    linkButtonEnabled: !!this.props.email.length,
    email: this.props.email,
    errorState: !!this.props.errorState,
  };

  componentDidUpdate(prevProps: Props) {
    // Prop errorState value updated, update the corresponsding internal state as well
    if (this.props.errorState !== prevProps.errorState) {
      if (this.props.errorState) {
        /* Error state was set for the first time disable the Link button as well */
        this.setState({ errorState: this.props.errorState, linkButtonEnabled: false });
      } else {
        this.setState({ errorState: this.props.errorState });
      }
    }
  }

  onInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const email = event.target.value;
    if (email.length > 0) {
      this.setState({ linkButtonEnabled: true, email, errorState: false });
    } else {
      this.setState({ linkButtonEnabled: false, email, errorState: false });
    }
  };

  render(): JSX.Element {
    const { errorState, email, linkButtonEnabled } = this.state;
    const { onLink } = this.props;

    const componentId = errorState ? 'SlackAccountEmailError' : 'SlackAccountEmail';

    return (
      <Box justifyContent="start" alignItems="end" rootClassName="rc-VerifyAccountSlack">
        <TextInput
          componentId={componentId}
          name="SlackAccountEmail"
          label={_t('Slack Acccount Email')}
          style={{ width: '40%' }}
          onChange={this.onInputChange}
          placeholder="Email"
          value={email}
        />
        <Button
          style={{ marginLeft: '10px' }}
          size="sm"
          type="primary"
          label={_t('Link')}
          rootClassName="slack-account-email-verify"
          disabled={!linkButtonEnabled}
          onClick={() => onLink(email)}
        />
      </Box>
    );
  }
}

export default VerifyAccountSlack;
