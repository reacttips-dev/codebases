/* eslint-disable
    eqeqeq,
    react-hooks/rules-of-hooks,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS201: Simplify complex destructure assignments
 * DS204: Change includes calls to have a more natural evaluation order
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const Alerts = require('app/scripts/views/lib/alerts');
const { ApiPromise } = require('app/scripts/network/api-promise');
const { ApiError } = require('app/scripts/network/api-error');
const BoardObserverOptionComponent = require('app/scripts/views/board-menu/board-observer-option-component');
const MemberMultiSelectAutocompleteComponent = require('app/scripts/views/member/member-multi-select-autocomplete-component');
const BoardMenuInviteTeamComponent = require('app/scripts/views/board-menu/board-menu-invite-team-component');
const {
  localizeServerError,
} = require('app/scripts/lib/localize-server-error');
const { Member } = require('app/scripts/models/member');

const {
  maybeDisplayMemberLimitsError,
} = require('app/scripts/views/board-menu/member-limits-error');
const { ModelLoader } = require('app/scripts/db/model-loader');
const View = require('app/scripts/views/internal/view');
const React = require('react');
const ReactDOM = require('@trello/react-dom-wrapper');
const DisplayInvitationLinkView = require('app/scripts/views/invitation-link/display-invitation-link-view');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const BluebirdPromise = require('bluebird');
const t = require('app/scripts/views/internal/recup-with-helpers')(
  'board_member_add_multiple',
);
const tc = require('app/scripts/views/internal/teacup-with-helpers')(
  'board_member_add_multiple',
);
const { Util } = require('app/scripts/lib/util');
const $ = require('jquery');
const _ = require('underscore');
const { featureFlagClient } = require('@trello/feature-flag-client');
const { Analytics } = require('@trello/atlassian-analytics');
const EMAIL_REGEX = /^[^@]+@[a-z0-9-]+(\.[a-z0-9-]+)+$/i;
const {
  isEligibileForExperiment,
  getSlackConnection,
  InviteFromSlackCaptionLink,
  InviteFromSlackInviteButton,
} = require('app/src/components/InviteFromSlack');

class BoardMemberAddMultipleView extends View {
  static initClass() {
    this.prototype.displayType = 'board-member-add-multiple';
    this.prototype.initialInviteMessage = t.l(
      'im-working-on-this-project-in-trello-and-wanted-to-share-it-with-you',
    );

    this.prototype.events = {
      // invitation links
      'click .js-show-invitation-link': 'showInvitationLink',
      'click .js-invitation-link': 'clickInvitationLink',
      'click .js-deactivate-link': 'deactivateInvitationLink',
      'click .js-copy-invitation-link': 'copyInvitationLink',
    };
  }
  viewTitleKey() {
    if (this.model.isTemplate()) {
      return 'invite to template';
    } else {
      return 'invite to board';
    }
  }

  initialize() {
    this.onAutocompleteSubmit = this.onAutocompleteSubmit.bind(this);
    this.onAutocompleteSearch = this.onAutocompleteSearch.bind(this);
    this.onObserverChange = this.onObserverChange.bind(this);
    this.onInviteTeamClick = this.onInviteTeamClick.bind(this);
    this.onInvitationMessageChange = this.onInvitationMessageChange.bind(this);
    this.selectInvitationMessage = this.selectInvitationMessage.bind(this);
    if (this.invitationMessageValue == null) {
      this.invitationMessageValue = this.initialInviteMessage;
    }
    this.observerValue = 'normal';
    this.selectedMemberOptions = [];
    this.onSelectMemberOption = this.onSelectMemberOption.bind(this);
    this.onRemoveMemberOption = this.onRemoveMemberOption.bind(this);

    const organization = this.model.getOrganization();
    this.loadingOrg = organization != null;
    // experiment code start
    this.hasSlackConnection = false;
    this.isInviteFromSlackExperiment = false;
    // experiment code end
    if (organization != null) {
      this.listenTo(
        organization.memberList,
        'add remove reset',
        this.frameDebounce(this.renderAutocomplete),
      );
    }

    this.listenTo(
      this.model.memberList,
      'add remove reset',
      this.frameDebounce(this.renderAutocomplete),
    );

    // in case the bc org admins decides to change the invite permissions
    // when you are looking at this view.
    if (organization != null) {
      return this.listenTo(
        organization,
        'change:prefs',
        this.frameDebounce(this.render),
      );
    }
  }

  remove() {
    ReactDOM.unmountComponentAtNode(this.$('.js-autocomplete-root')[0]);
    return super.remove(...arguments);
  }

  loadOrgData() {
    const organization = this.model.getOrganization();
    if (organization != null && this.model.editable()) {
      let orgModel;
      if (
        organization.paysWithPurchaseOrder() &&
        (organization.isBusinessClass() || organization.isStandard())
      ) {
        orgModel = ModelLoader.loadOrganizationMembersMinimalWithAvailableLicenseCount(
          organization.id,
        );
      } else {
        orgModel = ModelLoader.loadOrganizationMembersMinimal(organization.id);
      }

      orgModel
        .then(() => {
          this.loadingOrg = false;
          this.renderAutocomplete();
        })
        .done();
    } else {
      this.loadingOrg = false;
    }
  }

  render() {
    this.$el.html(
      tc.renderable(() =>
        tc.div('.invite-board-member-autocomplete.js-autocomplete-root'),
      ),
    );
    // Determine experiment eligibility.
    // If it meets one of the following condition, fall back to original experience.
    // 1. not EN locale
    // 2. or not browser user
    // 3. or feature flag value is not-enrolled or control
    if (!isEligibileForExperiment()) {
      this.renderAutocomplete();
    } else {
      const trelloInviteFromSlackFeatureFlag = featureFlagClient.get(
        'apollo.web.growth-invite-teammates-from-slack',
        'not-enrolled',
      );
      if (trelloInviteFromSlackFeatureFlag === 'not-enrolled') {
        this.renderAutocomplete();
      } else {
        // Fire Feature Expose Events
        featureFlagClient.getTrackedVariation(
          'apollo.web.growth-invite-teammates-from-slack',
          'not-enrolled',
        );
        if (trelloInviteFromSlackFeatureFlag === 'control') {
          this.renderAutocomplete();
        }
        if (trelloInviteFromSlackFeatureFlag === 'experiment') {
          getSlackConnection(this.model.get('shortLink'), document.cookie).then(
            (res) => {
              this.hasSlackConnection = res;
              this.isInviteFromSlackExperiment = true;
              this.renderAutocomplete();
            },
          );
        }
      }
    }

    Analytics.sendScreenEvent({
      name: 'inviteToBoardInlineDialog',
      containers: {
        board: {
          id: this.model.id,
        },
        organization: {
          id: this.model?.getOrganization()?.id,
        },
      },
    });
    return this;
  }

  /**
   * This function fixes an issue with adding a lot of members at once.
   * Our api currently only supports sending requests one at a time to
   * add members to a board. Because of this, we were sending concurrent
   * requests to the trello api. If you do that with new trello users
   * then the response from the api, and the socket updates, will send
   * the wrong information about board memberships. Therefore, we send
   * concurrent requests for n - (n - 1) first, then after that succeeds
   * we send the last update, which will have the correct information
   * and socket update. Eventually, we are going to build an endpoint
   * to accept an array of emails or user ids and that will do this work
   * for us, but this is a temporary solution.
   */
  addMembers(results, users) {
    const addMemberPromises = results.map(({ member }, i) => () => {
      const userValue = users[i].value;
      const traceId = users[i].traceId;

      if (member != null) {
        let needle;
        if (
          ((needle = this.model.id),
          !Array.from(member.get('idBoards')).includes(needle))
        ) {
          return this.addMember(member, traceId);
        } else {
          Analytics.taskAborted({
            taskName: 'edit-board/members/add',
            source: 'boardMemberBulkAddInlineDialog',
            traceId,
            error: new Error('invalid board'),
          });
        }
      } else if (EMAIL_REGEX.test(userValue)) {
        return this.sendEmailInvite(userValue, traceId);
      } else {
        //If email entered is invalid, make sure we abort the vitalStats task
        Analytics.taskAborted({
          taskName: 'edit-board/members/add',
          source: 'boardMemberBulkAddInlineDialog',
          traceId: traceId,
          error: new Error('invalid email'),
        });
      }

      return Promise.resolve();
    });

    const batch1 = addMemberPromises.slice(0, addMemberPromises.length - 1);
    const lastPromise = addMemberPromises[addMemberPromises.length - 1];

    return BluebirdPromise.map(batch1, (c) => c()).then(lastPromise);
  }

  onAutocompleteSubmit(allowMultiBoardGuests) {
    const users = [];
    let membersAddedCount = 0;
    let newBillableGuestsAddedCount = 0;

    _.forEach(this.selectedMemberOptions, (option) => {
      const member = option.id
        ? this.modelCache.get('Member', option.id)
        : undefined;
      if (member) {
        const traceId = Analytics.startTask({
          taskName: 'edit-board/members/add',
          source: 'boardMemberBulkAddInlineDialog',
        });
        this.addMember(member, traceId);
        if (option.wouldBecomeBillableGuest) {
          return newBillableGuestsAddedCount++;
        } else {
          return membersAddedCount++;
        }
      } else {
        const value = option.email ? option.email : option.username;
        const type = option.email ? 'email' : 'username';

        const traceId = Analytics.startTask({
          taskName: 'edit-board/members/add',
          source: 'boardMemberBulkAddInlineDialog',
        });

        return users.push({ value, type, traceId });
      }
    });

    return BluebirdPromise.map(users, (user) => {
      return this.getMemberFromUser(user).catch((err) => ({ hasError: true }));
    }).then((results) => {
      const isErrors = _.some(results, ({ hasError }) => hasError);
      newBillableGuestsAddedCount = _.filter(
        results,
        ({ wouldBecomeBillableGuest }) => wouldBecomeBillableGuest,
      ).length;
      const isBlockedInvites =
        !allowMultiBoardGuests && newBillableGuestsAddedCount > 0;

      if (isBlockedInvites || isErrors) {
        return _.each(results, ({ wouldBecomeBillableGuest, hasError }, i) => {
          this.selectedMemberOptions[i].blockInvite = wouldBecomeBillableGuest;
          Analytics.taskAborted({
            taskName: 'edit-board/members/add',
            source: 'boardMemberBulkAddInlineDialog',
            traceId: users[i].traceId,
          });
          return (this.selectedMemberOptions[i].hasError = hasError);
        });
      } else {
        // these should be run sequentially
        return this.addMembers(results, users).then(() => {
          PopOver.hide();

          if (results.length > 0) {
            // We won't send an invitation if one already exists
            return Analytics.sendTrackEvent({
              action: 'sent',
              actionSubject: 'boardInvitation',
              source: 'inviteToBoardInlineDialog',
              containers: {
                board: {
                  id: this.model.id,
                },
                organization: {
                  id: this.model?.getOrganization()?.id,
                },
              },
              attributes: {
                numInvitesSent: results.length,
                changedMessage:
                  this.invitationMessageValue !== this.initialInviteMessage,
              },
            });
          }
        });
      }
    });
  }

  getMemberFromUser({ value, type, traceId }) {
    const org = this.model.getOrganization();

    const memberPromise = ApiPromise({
      method: 'get',
      url: `/1/members/${value}`,
      data: { fields: ['idOrganizations', 'idBoards'] },
      traceId,
    })
      .then((data) => {
        const memberModel = new Member(data, { modelCache: this.modelCache });
        if (type === 'email') {
          memberModel.set('email', value);
        }
        return memberModel;
      })
      .catch(ApiError.NotFound, (err) => null);

    // If the current user is attempting to invite a single board guest
    // (which would turn them into a multi-board guest and incur extra billing),
    // this promise should resolve to true.
    const wouldBecomeBillableGuestPromise =
      org &&
      !org.isFeatureEnabled('multiBoardGuests') &&
      org.getAvailableLicenseCount() > 0
        ? false
        : ApiPromise({
            url: '/1/search/members/',
            type: 'get',
            data: {
              idBoard: this.model.id,
              idOrganization: org != null ? org.id : undefined,
              query: value,
            },
            dataType: 'json',
            traceId,
          }).then((data) => {
            return data.length === 1 && data[0].wouldBecomeBillableGuest;
          });

    return BluebirdPromise.all([
      memberPromise,
      wouldBecomeBillableGuestPromise,
    ]).then((...args) => {
      const [member, wouldBecomeBillableGuest] = Array.from(args[0]);
      return { member, wouldBecomeBillableGuest };
    });
  }

  addMember(member, traceId) {
    if (maybeDisplayMemberLimitsError(this.$el, this.model, member)) {
      Analytics.taskAborted({
        taskName: 'edit-board/members/add',
        source: 'boardMemberBulkAddInlineDialog',
        traceId,
      });
      return Promise.resolve();
    }

    return this.model.addMember(
      member,
      traceId,
      this.observerValue,
      this.invitationMessageValue,
      function (err, resp) {
        if (err) {
          Analytics.taskFailed({
            taskName: 'edit-board/members/add',
            source: 'boardMemberBulkAddInlineDialog',
            traceId,
            error: err,
          });

          const errorMessage = /organization restricts invites/.test(
            err.message,
          )
            ? t.l('team-restricts-invites')
            : localizeServerError(err.message);

          return Alerts.showLiteralText(
            errorMessage,
            'error',
            'addMemberError',
            5000,
          );
        }
        Analytics.taskSucceeded({
          taskName: 'edit-board/members/add',
          source: 'boardMemberBulkAddInlineDialog',
          traceId,
        });
      },
    );
  }

  sendEmailInvite(email, traceId) {
    const data = {
      email,
      type: this.observerValue,
      invitationMessage: this.invitationMessageValue,
    };

    if (maybeDisplayMemberLimitsError(this.$el, this.model)) {
      Analytics.taskAborted({
        taskName: 'edit-board/members/add',
        source: 'boardMemberBulkAddInlineDialog',
        traceId,
      });

      return Promise.resolve();
    }

    return ApiPromise({
      url: `/1/board/${this.model.id}/members`,
      type: 'put',
      dataType: 'json',
      data,
      traceId,
    })
      .then((data) => {
        const member = new Member(data, { modelCache: this.modelCache });

        const memberType = this.observerValue ? this.observerValue : 'normal';
        Analytics.sendTrackEvent({
          action: 'sent',
          actionSubject: 'emailBoardInvitation',
          actionSubjectId: member.id,
          source: 'inviteToBoardInlineDialog',
          containers: {
            board: {
              id: this.model.id,
            },
            organization: {
              id: this.model?.getOrganization()?.id,
            },
          },
          attributes: {
            memberType,
            taskId: traceId,
          },
        });

        Analytics.sendTrackEvent({
          action: 'added',
          actionSubject: 'member',
          actionSubjectId: member.id,
          source: 'inviteToBoardInlineDialog',
          containers: {
            board: {
              id: this.model.id,
            },
            organization: {
              id: this.model?.getOrganization()?.id,
            },
          },
          attributes: {
            addedTo: 'board',
            confirmed: !!member.get('confirmed'),
            memberType,
            taskId: traceId,
          },
        });

        return Analytics.taskSucceeded({
          taskName: 'edit-board/members/add',
          source: 'boardMemberBulkAddInlineDialog',
          traceId,
        });
      })
      .catch((error) => {
        throw Analytics.taskFailed({
          taskName: 'edit-board/members/add',
          source: 'boardMemberBulkAddInlineDialog',
          traceId,
          error,
        });
      });
  }

  onAutocompleteSearch(query) {
    query = query.toLowerCase().trim();
    const org = this.model.getOrganization();
    let filteredOrgMembers = [];

    // The api does not return results for ghost members in search,
    // because it does not expect users to know the "username" of a
    // ghost user, only the email (since inviting a ghost only uses email).
    // So here we first query the api, and add in the results for ghosts that
    // match the search after (within their org)
    const formatMember = (member) => {
      return _.extend(member.toJSON(), {
        active: true,
        similarity: 0,
        joined: this.model.getMembershipFor(member) != null,
        idOrganizations: [org.id],
      });
    };

    if (org != null) {
      if (query.length > 0) {
        filteredOrgMembers = org.memberList
          .chain()
          .filter((member) =>
            _.any(
              Util.getMemNameArray(member),
              (part) => part.indexOf(query) === 0,
            ),
          )
          .map(formatMember)
          .value();
      } else {
        filteredOrgMembers = org.memberList.map(formatMember);
      }
    }

    if (query.length > 2) {
      return ApiPromise({
        url: '/1/search/members/',
        type: 'get',
        data: {
          idBoard: this.model.id,
          idOrganization: org != null ? org.id : undefined,
          query,
        },
        dataType: 'json',
      }).then((members) => {
        return _.uniq(_.union(members, filteredOrgMembers), false, (item) =>
          item.username ? item.username : item.email,
        );
      });
    } else if (org != null) {
      return filteredOrgMembers;
    } else {
      return [];
    }
  }

  onInviteTeamClick(e) {
    Analytics.sendUIEvent({
      action: 'clicked',
      actionSubject: 'dropdownItem',
      actionSubjectId: 'inviteTeamToBoardDropdownItem',
      source: 'inviteToBoardInlineDialog',
      containers: {
        board: {
          id: this.model.id,
        },
        organization: {
          id: this.model.getOrganization().id,
        },
      },
    });

    const memsAvailable = this.model.orgMembersAvailable().map((member) => {
      return _.extend(member.toJSON(), {
        active: true,
        similarity: 0,
        joined: this.model.hasActiveMembership(member),
        idOrganizations: [this.model.getOrganization().id],
      });
    });

    this.selectedMemberOptions = _.uniq(
      _.union(this.selectedMemberOptions, memsAvailable),
      false,
      (item) => (item.username ? item.username : item.email),
    );
    return this.renderAutocomplete();
  }

  onObserverChange(newValue) {
    this.observerValue = newValue;
    return this.renderAutocomplete();
  }

  onInvitationMessageChange(e) {
    this.invitationMessageValue = e.target.value;
    return this.renderAutocomplete();
  }

  selectInvitationMessage() {
    if (this.invitationMessageValue === this.initialInviteMessage) {
      return $('.js-invitation-message').select();
    }
  }

  onSelectMemberOption(member) {
    this.selectedMemberOptions = _.uniq(
      _.union(this.selectedMemberOptions, _.flatten([member])),
      false,
      (item) => (item.username ? item.username : item.email),
    );
    return this.renderAutocomplete();
  }

  onRemoveMemberOption(idx) {
    this.selectedMemberOptions = this.selectedMemberOptions.filter(
      (_, i) => i !== idx,
    );
    return this.renderAutocomplete();
  }

  renderAutocomplete() {
    const renderTarget = this.$('.js-autocomplete-root')[0];
    if (renderTarget == null) {
      return;
    }

    const organization = this.model.getOrganization();
    const autocompleteProps = {
      onAutocompleteSearch: this.onAutocompleteSearch,
      displayDetails: true,
      displayUsername: false,
      shouldFocusOnSelectMemberOption: true,
      onSubmit: this.onAutocompleteSubmit,
      submitText: t.l('send-invitation'),
      emptySearchText: t.l('looks-like-that-person-isnt-a-trello-member-yet'),
      placeholder: t.l('email-address-or-name'),
      onSelectMemberOption: this.onSelectMemberOption,
      onRemoveMemberOption: this.onRemoveMemberOption,
      selectedOptions: this.selectedMemberOptions,
      loadingOrg: this.loadingOrg,
      showMultiboardGuestWarning:
        organization != null
          ? organization.isFeatureEnabled('multiBoardGuests')
          : undefined,
      isTemplate: this.model.isTemplate(),
    };

    if (organization) {
      let availableToInvite = this.model.orgMembersAvailable();
      availableToInvite = _.filter(availableToInvite, (member) => {
        let needle;
        return (
          (needle = member.get('username')),
          !Array.from(_.pluck(this.selectedMemberOptions, 'username')).includes(
            needle,
          )
        );
      });
      if (availableToInvite.length > 1) {
        autocompleteProps.extraSearchOption = (
          <BoardMenuInviteTeamComponent
            onClick={this.onInviteTeamClick}
            availableToInvite={availableToInvite}
          />
        );
      }
      autocompleteProps.displayOrg = organization;
    }
    const children = [];
    // Guard experiment component behind experiment attribute
    if (this.isInviteFromSlackExperiment) {
      children.push(
        <InviteFromSlackCaptionLink
          idBoard={this.model.id}
          hasSlackConnection={this.hasSlackConnection}
          key="trelloInviteFromSlackCaptionLink"
        />,
      );
    }

    if (
      this.model?.getOrganization()?.isPremium() &&
      !this.model?.getOrganization()?.isStandard()
    ) {
      children.push(
        <BoardObserverOptionComponent
          onChange={this.onObserverChange}
          value={this.observerValue}
          key="observerOption"
        />,
      );
    }

    if (featureFlagClient.get('enable-invite-email-message', false)) {
      children.push(
        <textarea
          onChange={this.onInvitationMessageChange}
          onClick={this.selectInvitationMessage}
          className="invitation-message-input js-invitation-message"
          value={this.invitationMessageValue}
          key="invitationMessage"
          placeholder={t.l(
            'sharing-is-caring-let-your-collaborators-know-what-youre-working-on',
          )}
          maxLength={500}
        />,
      );
    }
    return ReactDOM.render(
      <MemberMultiSelectAutocompleteComponent {...autocompleteProps}>
        {children}
        {this.isInviteFromSlackExperiment ? (
          <InviteFromSlackInviteButton
            idBoard={this.model.id}
            hasSlackConnection={this.hasSlackConnection}
            key="trelloInviteFromSlackInviteButton"
          />
        ) : null}
      </MemberMultiSelectAutocompleteComponent>,
      renderTarget,
    );
  }
}
BoardMemberAddMultipleView.initClass();

_.extend(BoardMemberAddMultipleView.prototype, DisplayInvitationLinkView);

module.exports = BoardMemberAddMultipleView;
