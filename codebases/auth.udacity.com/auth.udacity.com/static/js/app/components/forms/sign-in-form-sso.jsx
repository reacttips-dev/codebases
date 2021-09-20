import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, TextInput } from '@udacity/veritas-components';
import { __ } from '../../../services/localization-service';
import Form from '../form';

export default class SignInFormSso extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
  };

  state = {
    email: '',
  };

  handleSubmit = () => {
    this.props.onSubmit(this.state.email.trim());
  };

  render() {
    const { email } = this.state;
    const placeholder = __('Organization Email Address');

    return (
      <div>
        <Form
          buttonLabel={__('Continue')}
          onSubmit={this.handleSubmit}
          isFocus={true}
        >
          <TextInput
            autoFocus={true}
            value={email}
            type="text"
            id="email"
            label={placeholder}
            hiddenLabel
            onChange={(e) => {
              this.setState({ email: e.target.value.trim() });
            }}
            placeholder={placeholder}
            required={true}
          />

          <Text size="sm">
            {/* TODO: Can do some find and replace to synthesize this translation */}
            {__(
              "By clicking Continue, you agree to our <a href='<%= terms_of_service_link %>'><%= terms_of_service %></a> and our <a href='<%= privacy_policy_link %>'><%= privacy_policy %></a>.",
              {
                terms_of_service_link: __(
                  'https://www.udacity.com/legal/terms-of-service'
                ),
                terms_of_service: __('Terms of Use'),
                privacy_policy_link: __(
                  'https://www.udacity.com/legal/privacy'
                ),
                privacy_policy: __('Privacy Policy'),
              },
              { renderHTML: true }
            )}
          </Text>
        </Form>
      </div>
    );
  }
}
