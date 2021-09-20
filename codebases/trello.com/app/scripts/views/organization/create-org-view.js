/* eslint-disable
    eqeqeq,
    @typescript-eslint/no-use-before-define,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { Auth } = require('app/scripts/db/auth');
const { Board } = require('app/scripts/models/board');
const { Controller } = require('app/scripts/controller');
const { ModelLoader } = require('app/scripts/db/model-loader');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const Promise = require('bluebird');
const {
  maybeDisplayOrgMemberLimitsError,
} = require('app/scripts/views/organization/member-limits-error');
const { Util } = require('app/scripts/lib/util');
const View = require('app/scripts/views/internal/view');
const templates = require('app/scripts/views/internal/templates');
const { isDesktop } = require('@trello/browser');
const { Analytics } = require('@trello/atlassian-analytics');
const { TeamTypeSelect } = require('app/src/components/TeamTypeSelect');
const { renderComponent } = require('app/src/components/ComponentWrapper');
const React = require('react');
const $ = require('jquery');
const { navigate } = require('app/scripts/controller/navigate');

const formatEmailDomain = function (emailDomain) {
  if (emailDomain) {
    return `(${emailDomain})`;
  } else {
    return '';
  }
};

class CreateOrgView extends View {
  static initClass() {
    this.prototype.viewTitleKey = 'create organization';

    this.prototype.events = {
      'click .js-save': 'submit',
      'submit form': 'submit',
      'input .js-display-name'() {
        return this.updateSubmitButton();
      },
    };
  }

  constructor(options) {
    super(options);
    this.onChangeTeamType = this.onChangeTeamType.bind(this);
    this.renderTeamTypeSelect = this.renderTeamTypeSelect.bind(this);
  }

  initialize({ createOpts, trackingOpts }) {
    this.createOpts = createOpts;
    this.trackingOpts = trackingOpts;
    if (this.trackingOpts == null) {
      this.trackingOpts = { category: null, method: null, context: {} };
    }
    if (this.createOpts == null) {
      this.createOpts = {
        isBusinessClass: false,
        boardToAddToOrg: false,
        isEnterprise: false,
      };
    }
    const [, domain] = Array.from((Auth.me().get('email') || '').split('@'));
    this.emailDomain = domain ? domain : '';
    this.teamTypeValue = '';
    return this;
  }

  getValue(name) {
    return __guard__(this.$(`[name=${name}]`).val(), (x) => x.trim());
  }

  render() {
    let template, templateArgs;

    if (this.createOpts.isEnterprise) {
      template = require('app/scripts/views/templates/org_create_enterprise');
      templateArgs = {
        enterprises: Auth.me().enterpriseList,
        dontUpsell: isDesktop(),
      };
    } else {
      template = require('app/scripts/views/templates/org_create');
      templateArgs = {
        dontUpsell: isDesktop(),
        emailDomain: formatEmailDomain(this.emailDomain),
        boardToAddToOrg: this.createOpts.boardToAddToOrg,
        memberCount:
          this.model.memberList != null
            ? this.model.memberList.length
            : undefined,
        isPrivateTemplate: this.createOpts.isPrivateTemplate,
      };
    }

    this.$el.html(templates.fill(template, templateArgs));
    this.updateSubmitButton();
    this.renderTeamTypeSelect();

    return this;
  }

  updateSubmitButton() {
    const isDisabled =
      this.getValue('displayName').length === 0 || this.teamTypeValue === '';
    return this.$('.js-save').prop('disabled', isDisabled);
  }

  submit(e) {
    Util.stop(e);

    if (maybeDisplayOrgMemberLimitsError($(e.target), null, Auth.me())) {
      return;
    }

    const data = {};

    this.$('.js-save').prop('disabled', true).addClass('disabled');

    for (const name of ['displayName', 'desc', 'enterprise']) {
      data[name] = this.getValue(name);
    }

    if (this.teamTypeValue !== '') {
      data['teamType'] = this.teamTypeValue;
    }

    Auth.me().organizationList.create(data, {
      modelCache: this.modelCache,
      silent: true,
      success: (data) => {
        if (this.createOpts.boardToAddToOrg) {
          this.createOpts.boardToAddToOrg.update({ idOrganization: data.id });

          if (this.createOpts.isPrivateTemplate) {
            this.model.setPref('isTemplate', false).save();
          }
        }

        return ModelLoader.loadOrganizationMembersMinimal(data.id)
          .then(() => {
            if (this.$('.js-add-members').prop('checked')) {
              const org = this.model.getOrganization();
              return Promise.map(
                this.model.memberList.models,
                function (member) {
                  if (!org.isMember(member)) {
                    return org.changeMemberRole(member, { type: 'normal' });
                  }
                },
                { concurrency: 3 },
              );
            }
          })
          .then(() => {
            if (this.createOpts.isBusinessClass) {
              navigate(`/${data.get('name')}/billing`, {
                trigger: true,
              });
            } else if (this.createOpts.isEnterprise) {
              navigate(`/${data.get('name')}/account`, {
                trigger: true,
              });
            } else {
              Controller.organizationBoardsView(data.get('name'));
            }
            Analytics.sendTrackEvent({
              action: 'created',
              actionSubject: 'workspace',
              actionSubjectId: data.id,
              attributes: {
                isEnterprise: Boolean(this.createOpts.isEnterprise),
                isBusinessClass: Boolean(this.createOpts.isBusinessClass),
                category: this.createOpts.category,
                method: this.trackingOpts.method,
                ...this.createOpts.context,
              },
              containers: {
                board: {
                  id: this.model instanceof Board ? this.model.get('id') : null,
                },
                workspace: {
                  id: data.id,
                },
              },
              source: 'createWorkspaceViewModal',
            });
            PopOver.hide();
          })
          .done();
      },
    });
  }

  onChangeTeamType(teamTypeValue) {
    this.teamTypeValue = teamTypeValue;
    return this.updateSubmitButton();
  }

  renderTeamTypeSelect() {
    return this.whenIdle(`org_view_select_${this.cid}`, () => {
      const teamTypeSelectComponent = (
        <TeamTypeSelect onChange={this.onChangeTeamType} />
      );
      const teamTypeSelectDiv = this.$('.js-team-type-select')[0];
      return renderComponent(teamTypeSelectComponent, teamTypeSelectDiv);
    });
  }
}

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined;
}
CreateOrgView.initClass();
module.exports = CreateOrgView;
