// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const Alerts = require('app/scripts/views/lib/alerts');
const { ApiError } = require('app/scripts/network/api-error');
const {
  localizeServerError,
} = require('app/scripts/lib/localize-server-error');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const React = require('react');
const t = require('app/scripts/views/internal/recup-with-helpers')(
  'invite_add_name',
);
const { Analytics } = require('@trello/atlassian-analytics');
const { Util } = require('app/scripts/lib/util');
const _ = require('underscore');

const extractFullName = function (email) {
  const puncSpacePattern = /[\s\d\x21-\x2F\x3A-\x40\x5B-\x60\x7B-\x7F]+/;
  const puncPattern = /[\d\x21-\x2F\x3A-\x40\x5B-\x60\x7B-\x7F]+/;

  const fullName = _.compact(
    Util.removeDomainFromEmailAddress(email).split(puncSpacePattern),
  )
    .join(' ')
    .replace(puncPattern, '');
  return Util.toTitleCase(fullName);
};

const validateFullName = (fullName) => !Util.validName(fullName);

class InviteAddName extends React.Component {
  static initClass() {
    this.prototype.displayName = 'InviteAddName';

    this.prototype.render = t.renderable(function () {
      const { email } = this.props;
      const { err, fullName, submitting } = this.state;

      const toggleErrClass = err ? '' : '.hide';

      return t.div({ style: { marginTop: '10px' } }, () => {
        t.p('.quiet', () =>
          t.format('we dont know that person…team', { email }),
        );

        t.p(`.error${toggleErrClass}`, () => t.format('full name too short'));

        return t.form({ onSubmit: this.onSubmit }, () => {
          t.label(() => t.format('full-name'));
          t.input({
            type: 'text',
            value: fullName,
            onChange: this.onNameChange,
          });
          return t.input('.wide.nch-button.nch-button--primary', {
            type: 'submit',
            disabled: submitting,
            value: t.l('send'),
          });
        });
      });
    });
  }

  getDerivedStateFromProps({ email }) {
    const fullName = extractFullName(email);

    return {
      err: validateFullName(fullName),
      fullName,
    };
  }

  constructor(props) {
    super(props);

    const fullName = extractFullName(this.props.email);

    this.state = {
      err: validateFullName(fullName),
      fullName,
    };

    this.onNameChange = this.onNameChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.sendEmailInvite = this.sendEmailInvite.bind(this);
    this._handleError = this._handleError.bind(this);
  }

  onNameChange({ target }) {
    const fullName = target.value;

    return this.setState({
      err: validateFullName(fullName.trim()),
      fullName,
    });
  }

  onSubmit(e) {
    e.preventDefault();

    const { err } = this.state;

    if (!err) {
      return this.sendEmailInvite();
    }
  }

  sendEmailInvite() {
    const { email, model } = this.props;
    const { fullName } = this.state;

    const memberData = { fullName, email, type: 'normal' };

    this.setState({ submitting: true });

    return model
      .addMembers([memberData])
      .then(() => PopOver.hide())
      .finally(() => {
        return this.setState({ submitting: false });
      })
      .catch(ApiError, this._handleError);
  }

  _handleError(resOrApiError) {
    const message = localizeServerError(resOrApiError);

    Alerts.showLiteralText(message, 'error', 'invite-add-name', 3000);
    const { model } = this.props;
    const enterprise = model?.getEnterprise();
    Analytics.sendTrackEvent({
      action: 'errored',
      actionSubject: 'emailOrganizationInvitation',
      source: 'inviteToWorkspaceInlineDialog',
      containers: {
        workspace: {
          id: model?.id,
        },
        enterprise: {
          id: enterprise?.id,
        },
      },
      attributes: {
        error: resOrApiError?.message ?? resOrApiError.responseText,
      },
    });
  }
}

InviteAddName.initClass();
module.exports = InviteAddName;
