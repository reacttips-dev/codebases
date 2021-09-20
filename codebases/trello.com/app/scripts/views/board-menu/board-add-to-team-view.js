/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const _ = require('underscore');
const { Auth } = require('app/scripts/db/auth');
const { Controller } = require('app/scripts/controller');
const { localizeCount } = require('app/scripts/lib/localize-count');
const { logoDomain } = require('@trello/config');
const { ModelLoader } = require('app/scripts/db/model-loader');
const BluebirdPromise = require('bluebird');
const { Util } = require('app/scripts/lib/util');
const View = require('app/scripts/views/internal/view');
const { l } = require('app/scripts/lib/localize');
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'board_power_ups',
);
const { navigate } = require('app/scripts/controller/navigate');
const { Analytics } = require('@trello/atlassian-analytics');

module.exports = class BoardAddToTeam extends View {
  initialize() {
    const me = Auth.me();
    this.menuType = this.options.menuType;
    this.listenTo(
      me.organizationList,
      'add remove reset change',
      this.frameDebounce(this.render),
    );
    return (this.createNewTeam = me.organizationList.length === 0);
  }

  events() {
    return {
      'click .js-team': 'clickTeam',
      'click .js-create-team': 'clickCreateTeam',
      'click .js-create': 'clickCreateNewTeam',
      'click .js-cancel': 'clickCancelNewTeam',
    };
  }

  render() {
    this.$el.html(
      t.render(() => {
        if (this.createNewTeam) {
          const memberCount = this.model.memberList.length;
          t.div('.create-team', function () {
            t.p(() => t.format('first-create-your-business-class-team'));

            t.p(function () {
              t.label(function () {
                t.format('team-name');
                const options =
                  memberCount === 1
                    ? {
                        value: t.l(
                          'names-projects',
                          { name: Auth.me().get('fullName') },
                          { raw: true },
                        ),
                      }
                    : memberCount === 2
                    ? {
                        placeholder: t.l(
                          'eg-names-projects',
                          { name: Auth.me().get('fullName') },
                          { raw: true },
                        ),
                      }
                    : {};
                options.maxLength = 100;

                return t.input('.full.js-autofocus.js-name', options);
              });

              if (memberCount > 1) {
                return t.div('.check-div', function () {
                  t.input('.js-add-members', {
                    type: 'checkbox',
                    checked: true,
                    id: 'addMembers',
                  });
                  return t.label(
                    { for: 'addMembers', class: 'create-team-add-members' },
                    () => t.format('add-the-members-of-this-board-to-the-team'),
                  );
                });
              }
            });

            t.div(function () {
              t.button('.nch-button.nch-button--primary.js-create', () =>
                t.format('create'),
              );

              return t.a('.create-team-cancel.quiet-button.js-cancel', () =>
                t.format('cancel'),
              );
            });

            return t.hr();
          });

          return _.defer(() => this.$('.js-name').select().focus());
        } else {
          const orgs = Auth.me().organizationList.sortBy((org) =>
            org.get('displayName').toLowerCase(),
          );

          t.div('.assign-to-team', () =>
            t.p(function () {
              t.format('this-board-is-not-in-a-team-yet');
              t.text(' ');
              return t.format(
                'please-select-a-team-or-create-a-new-team-to-upgrade',
              );
            }),
          );

          if (orgs.length > 0) {
            t.ul('.assign-to-team-list', () => {
              return (() => {
                const result = [];
                for (const org of Array.from(orgs)) {
                  const data = !org.canAddBoard(this.model)
                    ? {
                        class: 'disabled',
                        title: t.l(
                          'team-restrictions-prevent-you-from-adding-this-board-to-this-team',
                        ),
                      }
                    : org.isAtOrOverFreeBoardLimit()
                    ? {
                        class: 'disabled',
                        title: l([
                          'out of free team boards',
                          'this team has reached the maximum number of open boards',
                        ]),
                      }
                    : {
                        class: 'js-team',
                        'data-idOrganization': org.id,
                      };

                  result.push(
                    t.li(
                      '.assign-to-team-list-item.js-assign-team-list-item',
                      data,
                      function () {
                        t.div(
                          '.assign-to-team-list-item-logo.js-team-logo',
                          function () {
                            const logoHash = org.get('logoHash');
                            if (logoHash) {
                              return t.img({
                                src: `${logoDomain}/${logoHash}/30.png`,
                              });
                            } else {
                              return t.span('.icon.icon-lg.icon-organization');
                            }
                          },
                        );
                        return t.div(
                          '.assign-to-team-list-item-details',
                          function () {
                            t.div(
                              '.assign-to-team-list-item-name',
                              function () {
                                t.text(org.get('displayName'));
                                if (org.isFeatureEnabled('plugins')) {
                                  t.text(' ');
                                  return t.icon('business-class', {
                                    class: 'icon-business-class-color',
                                  });
                                }
                              },
                            );
                            return t.div(
                              '.assign-to-team-list-item-member-count',
                              function () {
                                let memberships;
                                if (
                                  (memberships = org.get('memberships')) != null
                                ) {
                                  return t.text(
                                    localizeCount(
                                      'members',
                                      memberships.length,
                                    ),
                                  );
                                }
                              },
                            );
                          },
                        );
                      },
                    ),
                  );
                }
                return result;
              })();
            });
          }

          return t.div('.assign-to-team-create.js-create-team', () =>
            t.div('.assign-to-team-create-content', () =>
              t.format('create-a-new-team'),
            ),
          );
        }
      }),
    );
    return this;
  }

  clickTeam(e) {
    this.$('.js-team').addClass('disabled');
    const idOrg = this.$(e.currentTarget).attr('data-idOrganization');
    this.$(e.currentTarget)
      .find('.js-team-logo')
      .html(t.render(() => t.span('.spinner')));

    this.model.trigger('added-to-team');
    Analytics.sendTrackEvent({
      action: 'added',
      actionSubject: 'board',
      actionSubjectId: this.model.id,
      source: 'boardAddToTeamViewSection',
      containers: {
        board: {
          id: this.model.id,
        },
        workspace: {
          id: idOrg,
        },
      },
      attributes: {
        addedTo: 'workspace',
      },
    });
    return BluebirdPromise.fromNode((next) => {
      return this.model.update(
        'idOrganization',
        idOrg,
        { waitForServer: true },
        next,
      );
    })
      .then(() => {
        this.$('.js-team').removeClass('disabled');
        const organization = this.model.getOrganization();
        if (
          this.options.menuType === 'Collections' &&
          organization != null &&
          organization.isFeatureEnabled('tags')
        ) {
          return ModelLoader.loadOrganizationMinimal(idOrg).then(() => {
            return this.model.trigger('team-has-bc');
          });
        } else {
          return navigate(Controller.getBoardPowerUpsUpgradeUrl(this.model), {
            trigger: true,
          });
        }
      })
      .done();
  }

  clickCreateTeam(e) {
    this.createNewTeam = true;
    return this.render();
  }

  clickCancelNewTeam(e) {
    Util.stop(e);
    return this.model.trigger('cancel-add-to-team');
  }

  clickCreateNewTeam(e) {
    const name = this.$('.js-name').val();
    if (!/\S/.test(name)) {
      return;
    }

    const data = { displayName: name };

    this.$('.js-create,.js-cancel').prop('disabled', true).addClass('disabled');

    return Auth.me().organizationList.create(data, {
      modelCache: this.modelCache,
      silent: true,
      success: (data) => {
        const idOrg = data.id;
        this.model.trigger('added-to-team');
        this.model.update('idOrganization', idOrg, { waitForServer: true });

        return ModelLoader.loadOrganizationMembersMinimal(idOrg)
          .then(() => {
            if (this.$('.js-add-members').prop('checked')) {
              const org = this.model.getOrganization();

              Analytics.sendTrackEvent({
                action: 'created',
                actionSubject: 'workspace',
                actionSubjectId: idOrg,
                source: 'boardAddToTeamViewSection',
                containers: {
                  board: {
                    id: this.model.id,
                  },
                  workspace: {
                    id: idOrg,
                  },
                },
              });

              return BluebirdPromise.map(
                this.model.memberList.models,
                (member) => {
                  if (!org.isMember(member)) {
                    return org.changeMemberRole(member, { type: 'normal' });
                  }
                },
                { concurrency: 3 },
              );
            } else {
              Analytics.sendTrackEvent({
                action: 'created',
                actionSubject: 'workspace',
                actionSubjectId: idOrg,
                source: 'boardAddToTeamViewSection',
                containers: {
                  board: {
                    id: this.model.id,
                  },
                  workspace: {
                    id: idOrg,
                  },
                },
              });
            }
          })
          .then(() => {
            return navigate(Controller.getBoardPowerUpsUpgradeUrl(this.model), {
              trigger: true,
            });
          })
          .done();
      },
    });
  }
};
