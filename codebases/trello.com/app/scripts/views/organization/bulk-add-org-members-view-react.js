// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const React = require('react');
const t = require('app/scripts/views/internal/recup-with-helpers')(
  'bulk_add_org_members',
);
const _ = require('underscore');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const {
  BillingAddMembersSummaryWrapped,
} = require('app/src/components/BillingAddMembersSummary');
const emailRegex = /^[^@]+@[a-z0-9-]+(\.[a-z0-9-]+)+$/i;
const usernameRegex = /^@[a-z0-9_]{3,}$/;
const { Analytics } = require('@trello/atlassian-analytics');

class BulkAddOrgMembersView extends React.Component {
  static initClass() {
    this.prototype.componentDidMount = function () {
      Analytics.sendScreenEvent({
        name: 'inviteBulkAddMembersInlineDialog',
        containers: {
          organization: {
            id: this.props.model.id,
          },
        },
      });
    };

    this.prototype.render = t.renderable(function () {
      const { model } = this.props;
      let { entry } = this.state;
      const {
        addingMembers,
        addedMembers,
        progressText,
        results,
        enterpriseName,
      } = this.state;

      if (addingMembers) {
        t.div(() => {
          t.div('.spinner.loading');

          t.div('.org-members-bulk-add-progress', () => {
            t.text(progressText);
          });
        });
      } else if (addedMembers) {
        t.div(() => {
          results._categoryOrder
            .filter((category) => results[category]?.length > 0)
            .map((category) => {
              t.div('.org-members-bulk-add-results-heading', () => {
                t.format(['category', category], {
                  enterpriseDisplayName: enterpriseName,
                });
                t.text(' (');
                t.text(results[category].length);
                return t.text(')');
              });

              return t.div('.org-members-bulk-add-results-list', () =>
                (() => {
                  const result = [];
                  for (entry of Array.from(results[category])) {
                    result.push(
                      t.div('.org-members-bulk-add-results-list-item', () =>
                        t.text(entry),
                      ),
                    );
                  }
                  return result;
                })(),
              );
            });

          t.div(() => {
            t.button(
              '.nch-button.nch-button--primary.full',
              { onClick: this.onClose },
              () => t.format('done'),
            );
          });
        });
      } else {
        const emailCount = this._parseEmails().length;
        const usernameCount = this._parseUsernames().length;
        const count = emailCount + usernameCount;
        const showBillingSummary =
          (model.isBusinessClass() || model.isStandard()) &&
          !model.paysWithPurchaseOrder();

        t.div('.add-member-popup', () => {
          t.label(() => {
            t.format('emails-or-usernames');
            return t.textarea('.org-members-bulk-add', {
              placeholder: t.l('list-placeholder'),
              onChange: this.onInputChanged,
              onClick: this.onInputClicked,
              value: entry,
            });
          });

          t.div(
            {
              class: t.classify({
                'org-members-bulk-add-found': true,
                quiet: true,
                'bottom-padding': showBillingSummary,
              }),
            },
            () => {
              if (emailCount > 0) {
                t.div('.org-members-bulk-add-found-entry', () => {
                  t.format('email-addresses-found');
                  return t.text(` ${emailCount}`);
                });
              }

              if (usernameCount) {
                return t.div('.org-members-bulk-add-found-entry', () => {
                  t.format('usernames-found');
                  return t.text(` ${usernameCount}`);
                });
              }
            },
          );

          if (showBillingSummary) {
            return t.createElement(BillingAddMembersSummaryWrapped, {
              accountId: model.id,
              members: [
                ...Array.from(this._parseEmails()),
                ...Array.from(this._parseUsernames()),
              ],
              addMembers: this.addMembers,
            });
          } else {
            const bulkAddToTeamButtonClass = count === 0 ? '.disabled' : '';

            t.button(
              '.nch-button.nch-button--primary.full' + bulkAddToTeamButtonClass,
              {
                onClick: this.addMembers,
                disabled: count === 0,
              },
              () => t.format('add'),
            );
          }
        });
      }
    });
  }

  constructor(props) {
    super(...arguments);
    this.state = {
      addingMembers: false,
      addedMembers: false,
      progressText: '',
      enterpriseName: props.model.getEnterprise()?.get('displayName') ?? '',
      entry: '',
      results: [],
      preventDoubleClick: true,
    };

    this.onInputClicked = this.onInputClicked.bind(this);
    this.onInputChanged = this.onInputChanged.bind(this);
    this.onClose = this.onClose.bind(this);
    this.addMembers = this.addMembers.bind(this);
    this._parseEntries = this._parseEntries.bind(this);
    this._parseEmails = this._parseEmails.bind(this);
    this._parseUsernames = this._parseUsernames.bind(this);
  }

  _parseEntries() {
    return this.state.entry.split(/[\s,;"<>]/);
  }

  _parseEmails() {
    return _.chain(this._parseEntries())
      .map((email) => email.replace(/^\s+|\s+$/g, '').toLowerCase())
      .filter((email) => emailRegex.test(email))
      .uniq()
      .sort()
      .value();
  }

  _parseUsernames() {
    return _.chain(this._parseEntries())
      .map((username) => username.replace(/^\s+|\s+$/g, '').toLowerCase())
      .filter((username) => usernameRegex.test(username))
      .map((username) => username.replace(/@/g, ''))
      .uniq()
      .sort()
      .value();
  }

  onClose() {
    return PopOver.hide();
  }

  onInputChanged(e) {
    return this.setState({ entry: e.target.value });
  }

  onInputClicked() {
    if (this.state.preventDoubleClick) {
      this.setState({ preventDoubleClick: false });

      Analytics.sendUIEvent({
        action: 'clicked',
        actionSubject: 'input',
        actionSubjectId: 'inviteBulkMembersToWorkspaceInput',
        source: 'inviteToWorkspaceInlineDialog',
        containers: {
          organization: {
            id: this.props.model.id,
          },
        },
      });

      setTimeout(() => {
        this.setState({
          preventDoubleClick: true,
        });
      }, 1000);
    }
  }

  async addMembers() {
    const { model } = this.props;
    this.setState({ addingMembers: true });

    const users = [
      ...Array.from(this._parseEmails()),
      ...Array.from(this._parseUsernames()),
    ];

    Analytics.sendTrackEvent({
      action: 'added',
      actionSubject: 'member',
      source: 'bulkAddMembersInlineDialog',
      containers: {
        organization: {
          id: this.props.model.id,
        },
      },
      attributes: {
        addedTo: 'workspace',
      },
    });

    await model
      .addMembers(users, { ignoreErrors: true }, (progress) =>
        this.setState({
          progressText: `${progress.completed}/${progress.length}`,
        }),
      )
      .then((grouped) => {
        this.setState({
          addingMembers: false,
          addedMembers: true,
          results: grouped,
        });

        Analytics.sendScreenEvent({
          name: 'bulkMembersAddedToWorkspaceListInlineDialog',
          containers: {
            organization: {
              id: this.props.model.id,
            },
          },
          attributes: {
            added: grouped.added.length,
            notFound: users.length - grouped.added.length,
            numMembersAttempted: users.length,
          },
        });
      })
      .done();
  }
}

BulkAddOrgMembersView.initClass();
module.exports = BulkAddOrgMembersView;
