'use es6';

import EmailConfirmBarPrebuilt from 'email-confirm-ui/prebuilts/HubHttpPrebuilt';
export default {
  injectEmailConfirmBar: function injectEmailConfirmBar() {
    return new EmailConfirmBarPrebuilt();
  },
  setup: function setup() {
    return this.injectEmailConfirmBar();
  }
};