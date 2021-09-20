/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const $ = require('jquery');
const { ActionHistory } = require('@trello/action-history');
const Alerts = require('app/scripts/views/lib/alerts');
const { Auth } = require('app/scripts/db/auth');
const ReactDOM = require('@trello/react-dom-wrapper');
const React = require('react');

const { ApiError } = require('app/scripts/network/api-error');
const { Card } = require('app/scripts/models/card');
const {
  containsValidUrl,
} = require('app/scripts/lib/util/url/contains-valid-url');
const inviteAddNameTemplate = require('app/scripts/views/templates/invite_add_name');
const { getKey, Key } = require('@trello/keybindings');
const { l } = require('app/scripts/lib/localize');
const {
  localizeServerError,
} = require('app/scripts/lib/localize-server-error');
const {
  maybeDisplayMemberLimitsError,
} = require('app/scripts/views/board-menu/member-limits-error');
const { ModelCache } = require('app/scripts/db/model-cache');
const { ModelLoader } = require('app/scripts/db/model-loader');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const Promise = require('bluebird');
const SelectMemberOnCardView = require('app/scripts/views/member/select-member-on-card-view');
const AutoCompleteMultiBoardGuestAlert = require('app/scripts/views/organization/invite-member-autocomplete-multi-board-guest-alert');
const { Util } = require('app/scripts/lib/util');
const View = require('app/scripts/views/internal/view');
const _ = require('underscore');
const template = require('app/scripts/views/templates/popover_select_members');
const { Analytics, tracingCallback } = require('@trello/atlassian-analytics');
const { track, trackUe, trackDebounced } = require('@trello/analytics');
const { searchFilter } = require('app/scripts/lib/util/text/search-filter');
const isDesktop = require('@trello/browser').isDesktop();

const MAX_EXPANDED_MEMBERS = 9;
const MAX_SUGGESTIONS = 5;

class CardMemberSelectView extends View {
  static initClass() {
    this.prototype.viewTitleKey = 'members';

    this.prototype.events = {
      'click .js-board-members .js-select-member': 'selectMem',
      'click .js-org-members .js-select-member': 'selectMem',
      'click .js-suggestions .js-select-member': 'addSuggestedMember',
      'click .js-show-org-members': 'showOrgMembers',
      'mouseenter .pop-over-member-list .item': 'hoverMemberSelect',
      'input .js-search-mem'(e) {
        this.updateSearch();
        return this.renderSuggested();
      },

      keydown: 'keydownEvent',

      // send email invite to new email address
      'click .js-send-email-invite': 'sendEmailInvite',
      'submit .js-email-data': 'sendEmailInvite',
    };
  }

  constructor(options) {
    super(options);
    this.wouldBecomeBillableGuest = this.wouldBecomeBillableGuest.bind(this);
  }

  initialize() {
    this.showAllOrgMembers = false;
    this.wouldBecomeBillableGuestPromise = null;

    this.updateSearch = _.debounce(this.updateSearch, 100);

    this.makeDebouncedMethods('renderMems', 'renderSuggested');

    // If the @model is a Card Composer, there won't be a memberList we have to
    // watch
    if (this.model.memberList != null) {
      this.listenTo(this.model.memberList, 'add remove reset', () => {
        this.updateOrdering();
        this.renderMemsDebounced();
        return this.renderSuggestedDebounced();
      });
    }

    Analytics.sendScreenEvent({
      name: 'cardMemberListInlineDialog',
      containers: this.model.getBoard().getAnalyticsContainers(),
      attributes: {
        cardIsTemplate: this.model.get('isTemplate'),
        cardIsClosed: this.model.get('closed'),
      },
    });

    return this.updateOrdering();
  }

  remove() {
    if (this.reactRoot) {
      ReactDOM.unmountComponentAtNode(this.reactRoot);
    }
    return super.remove(...arguments);
  }

  updateOrdering() {
    this._onCardMembers = {};
    this._onListMembers = {};
    this._onBoardMembers = {};

    const addCardMembers = (target, card) =>
      card.memberList.forEach((member) => (target[member.id] = true));
    // Might be the card composer
    if (this.model instanceof Card) {
      addCardMembers(this._onCardMembers, this.model);
    }
    this.model
      .getList()
      .cardList.forEach(addCardMembers.bind(null, this._onListMembers));
    return this.model.getBoard().listList.forEach((list) => {
      return list.cardList.forEach(
        addCardMembers.bind(null, this._onBoardMembers),
      );
    });
  }

  render() {
    const board = this.model.getBoard();

    this.$el.html(
      template({
        canInviteMembers:
          !board.hasInvitationRestrictions() && board.canInviteMembers(),
        includeOrgMembers:
          (board.getOrganization() != null && board.canInviteMembers()) ||
          this.model.getBoard().isEditableByTeamMemberAndIsNotABoardMember(),
        placeholder: l('add member placeholder'),
      }),
    );

    this.renderMems();
    return this.renderSuggested();
  }

  getSearch() {
    return this.$('.js-search-mem').val().trim();
  }

  filteredMembers(members, search) {
    const satisfiesSearch = searchFilter(search);

    return _.chain(members)
      .filter((mem) => {
        return satisfiesSearch(Util.getMemNameArray(mem));
      })
      .first(8)
      .value();
  }

  filteredBoardMembers(term) {
    const activeMembers = this.activeBoardMembers();

    const sortedMembers = activeMembers.sortBy((member) => {
      const prefix = Auth.isMe(member)
        ? 0
        : this._onCardMembers[member.id]
        ? 1
        : this._onListMembers[member.id]
        ? 2
        : this._onBoardMembers[member.id]
        ? 3
        : 4;

      return prefix + member.get('fullName');
    });

    if (term) {
      return this.filteredMembers(sortedMembers, term);
    } else {
      return sortedMembers;
    }
  }

  filteredOrgMembers(term) {
    if (this.showOrgSection()) {
      const org = this.model.getBoard().getOrganization();
      if (
        (org != null ? org.paysWithPurchaseOrder() : undefined) &&
        (org != null ? org.isBusinessClass() || org.isStandard() : undefined)
      ) {
        if (this.orgMembersPromise == null) {
          this.orgMembersPromise = ModelLoader.loadOrganizationMembersDataWithAvailableLicenseCount(
            org.id,
          );
        }
      } else {
        if (this.orgMembersPromise == null) {
          this.orgMembersPromise = ModelLoader.loadOrganizationMembersData(
            org.id,
          );
        }
      }

      return this.orgMembersPromise.then((members) => {
        const nonBoardMembers = org.memberList
          .filterDeactivated({ force: true })
          .without(
            ...Array.from(this.model.getBoard().memberList.models || []),
          );

        if (term) {
          return this.filteredMembers(nonBoardMembers, term);
        } else {
          return nonBoardMembers;
        }
      });
    } else {
      return [];
    }
  }

  hasSearch() {
    return this.getSearch() !== '';
  }

  showOrgSection() {
    // Only include team members if they've started searching or clicked on the
    // "Show team members" button … we want to keep the UI simple for the
    // common case
    const org = this.model.getBoard().getOrganization();
    return org != null && (this.showAllOrgMembers || this.hasSearch());
  }

  renderMems() {
    const term = this.getSearch();
    const boardMemList = this.filteredBoardMembers(term);
    const orgMemList = this.filteredOrgMembers(term);

    const sections = {
      '.js-board-members': boardMemList,
      '.js-org-members': orgMemList,
    };

    const showOrgSection = this.showOrgSection();
    this.$('.js-show-org-members').toggleClass('hide', showOrgSection);
    this.$('.js-invite-results').toggleClass('hide', !Util.checkEmail(term));

    if (this._renderMemsPromise != null) {
      this._renderMemsPromise.cancel();
    }
    this._renderMemsPromise = Promise.each(_.keys(sections), (selector) => {
      const $section = this.$(selector);
      if ($section.length === 0) {
        return;
      }

      const $loading = $section.find('.js-loading');
      const $noResults = $section.find('.js-no-results');

      $loading.removeClass('hide');
      $noResults.addClass('hide');

      return Promise.resolve(sections[selector]).then((memList) => {
        $loading.addClass('hide');

        const $memList = $section.find('.js-mem-list');
        $memList.toggleClass(
          'collapsed',
          memList.length > MAX_EXPANDED_MEMBERS,
        );
        $noResults.toggleClass('hide', memList.length > 0);

        if (memList.length > 0) {
          this.$('.js-board-members').removeClass('hide');
          this.$('.js-invite-no-results').addClass('hide');
          this.$('.js-org-members').toggleClass('hide', !showOrgSection);
        }

        const subviews = Array.from(memList).map((mem) =>
          this.subview(SelectMemberOnCardView, mem, {
            showUnconfirmed: true,
            card: this.model,
          }),
        );

        return this.ensureSubviews(subviews, $memList);
      });
    })
      .cancellable()
      .then(() => {
        if (this.hasSearch()) {
          const $elem = this.$el.find('.item').first();
          if ($elem.length > 0) {
            return Util.selectMenuItem(this.$el, '.item', $elem);
          } else {
            return this.renderEmailInviteToSearchResults({ email: term });
          }
        }
      })
      .done();
    return this;
  }

  activeBoardMembers() {
    return this.model.getBoard().memberList.filterDeactivated({ force: true });
  }

  renderSuggested() {
    const $suggestions = this.$('.js-suggestions');

    const suggestedMembers = this.getSuggestedMembers();

    const showSuggestions =
      !this.hasSearch() &&
      suggestedMembers.length > 0 &&
      // Don't bother showing suggestions if we can already see
      // all of the members and their full names
      this.activeBoardMembers().length > MAX_EXPANDED_MEMBERS;

    $suggestions.toggleClass('hide', !showSuggestions);
    const $memberList = $suggestions.find('.js-mem-list');

    if (showSuggestions) {
      const subviews = suggestedMembers.map((member) => {
        return this.subview(
          SelectMemberOnCardView,
          member,
          { card: this.model },
          `join-suggestion-${member.id}`,
        );
      });

      this.ensureSubviews(subviews, $memberList);
      trackDebounced.hour(
        'Suggestions',
        'Card Members Menu',
        'Displayed',
        suggestedMembers.length,
      );
    } else {
      $memberList.empty();
    }

    return this;
  }

  getSuggestedMembers() {
    const history = ActionHistory.get();

    const idList = this.model.get('idList');

    const suggested = new Set();

    const joinEntry = { action: { type: 'join', idMember: Auth.myId() } };
    const addMemberEntries = history
      .filter(
        ({ action, context }) =>
          action.type === 'add-member' && context.idList === idList,
      )
      .filter(function ({ action }) {
        if (suggested.has(action.idMember)) {
          return false;
        } else {
          suggested.add(action.idMember);
          return true;
        }
      });

    return [joinEntry, ...Array.from(addMemberEntries)]
      .filter(({ action }) => this.model.isValidSuggestion(action))
      .map(({ action }) => {
        return this.modelCache.get('Member', action.idMember);
      })
      .slice(0, MAX_SUGGESTIONS)
      .sort(function (a, b) {
        if (Auth.isMe(a)) {
          return -1;
        } else if (Auth.isMe(b)) {
          return 1;
        } else {
          const aFullName = a.get('fullName').toLowerCase();
          const bFullName = b.get('fullName').toLowerCase();
          return aFullName.localeCompare(bFullName);
        }
      });
  }

  hoverMemberSelect(e) {
    return Util.selectMenuItem(this.$el, '.item', e.currentTarget);
  }

  keydownEvent(e) {
    const key = getKey(e);

    if ([Key.Tab, Key.Enter].includes(key)) {
      Util.stop(e);
      this.$('.js-mem-list .item.selected:first .js-select-member')
        .first()
        .click();
      this.$('.js-search-mem').val('');
      this.focusSearch();
      this.renderMems();
    } else if ([Key.ArrowUp, Key.ArrowDown].includes(key)) {
      Util.stop(e);
      Util.navMenuList(this.$el, '.item', key);
    }
  }

  updateSearch(e) {
    this.$('.js-invite-error').addClass('hide');
    this.renderMems();
    return this.focusSearch();
  }

  selectMem(e) {
    Util.stop(e);
    const { model } = this;

    const $mem = $(e.currentTarget);
    const $item = $mem.closest('.item');
    const idMem = $mem.attr('idMember');
    const source = 'cardMemberSelectInlineDialog';

    if ($item.hasClass('active')) {
      const traceId =
        // Do not trace CardComposer member toggling
        model.typeName === 'Card'
          ? Analytics.startTask({
              taskName: 'edit-card/idMembers',
              source,
            })
          : '';

      model.removeMemberWithTracing(
        idMem,
        traceId,
        tracingCallback(
          {
            taskName: 'edit-card/idMembers',
            traceId,
            source,
          },
          (_err, res) => {
            if (res) {
              Analytics.sendUpdatedCardFieldEvent({
                field: 'idMembers',
                source,
                containers: {
                  card: { id: model.id },
                  board: { id: model.get('idBoard') },
                  list: { id: model.get('idList') },
                },
                attributes: {
                  taskId: traceId,
                },
              });
            }
          },
        ),
      );

      $item.removeClass('active');
      track('Card', 'Change Member', 'Remove Member');
    } else {
      const board = this.model.getBoard();
      const member = ModelCache.get('Member', idMem);

      if (!board.hasActiveMembership(member)) {
        if (
          Auth.isMe(member) &&
          model.getBoard().isEditableByTeamMemberAndIsNotABoardMember()
        ) {
          Alerts.show(
            'woohoo-you-are-now-a-member-of-this-board',
            'info',
            'join-board',
            4000,
          );

          board.optimisticJoinBoard();
        }
      }

      const traceId =
        // Do not trace CardComposer member toggling
        model.typeName === 'Card'
          ? Analytics.startTask({
              taskName: 'edit-card/idMembers',
              source,
            })
          : '';

      model.addMemberWithTracing(
        idMem,
        traceId,
        tracingCallback(
          {
            taskName: 'edit-card/idMembers',
            traceId,
            source,
          },
          (_err, res) => {
            if (res) {
              Analytics.sendUpdatedCardFieldEvent({
                field: 'idMembers',
                source,
                containers: {
                  card: { id: model.id },
                  board: { id: model.get('idBoard') },
                  list: { id: model.get('idList') },
                },
                attributes: {
                  taskId: traceId,
                },
              });
            }
          },
        ),
      );

      $item.addClass('active');
      track('Card', 'Change Member', 'Add Member');

      // Tracking for adding invitees to cards
      const boardMembers = this.model.getBoard().memberList.models;
      const myId = Auth.me().id;
      return boardMembers.forEach(function (boardMember) {
        if (
          boardMember.get('id') === idMem &&
          boardMember.get('idMemberReferrer') === myId
        ) {
          return trackUe('card', 'adds', 'invitee', 'to card', '', '', {
            member: myId,
            addedMember: idMem,
          });
        }
      });
    }

    this.focusSearch();
  }

  addSuggestedMember(e) {
    Util.stop(e);

    const idMember = this.$(e.currentTarget).attr('idMember');
    const source = 'cardMemberSelectInlineDialog';

    const traceId = Analytics.startTask({
      taskName: 'edit-card/idMembers',
      source,
    });

    this.model.addMemberWithTracing(
      idMember,
      traceId,
      tracingCallback(
        {
          taskName: 'edit-card/idMembers',
          traceId,
          source,
        },
        (_err, res) => {
          if (res) {
            Analytics.sendUpdatedCardFieldEvent({
              field: 'idMembers',
              source,
              containers: {
                card: { id: this.model.id },
                board: { id: this.model.get('idBoard') },
                list: { id: this.model.get('idList') },
              },
              attributes: {
                taskId: traceId,
              },
            });
          }
        },
      ),
    );

    track('Card', 'Suggested', Auth.isMe(idMember) ? 'Join' : 'Add Member');

    this.focusSearch();
  }

  focusSearch() {
    this.$('.js-search-mem').focus();
  }

  showOrgMembers(e) {
    this.showAllOrgMembers = true;
    this.renderMems();
  }

  wouldBecomeBillableGuest(email) {
    // Dependency required at call site to avoid import cycles, do not lift to top of module
    const { ApiPromise } = require('app/scripts/network/api-promise');
    const board = this.model.getBoard();

    if (!board.hasOrganization()) {
      return Promise.resolve(false);
    }

    const org = board.getOrganization();
    if (org && !org.isFeatureEnabled('multiBoardGuests')) {
      return Promise.resolve(false);
    }

    return ApiPromise({
      url: '/1/search/members/',
      type: 'get',
      data: {
        idBoard: board != null ? board.id : undefined,
        query: email,
      },
      dataType: 'json',
    }).then((data) => {
      return data.length === 1 && data[0].wouldBecomeBillableGuest;
    });
  }

  renderEmailInviteToSearchResults(data) {
    this.$('.js-invite-no-results').removeClass('hide');
    const puncSpacePattern = /[\s\d\x21-\x2F\x3A-\x40\x5B-\x60\x7B-\x7F]+/;
    const puncPattern = /[\d\x21-\x2F\x3A-\x40\x5B-\x60\x7B-\x7F]+/;

    const fullName = _.compact(
      Util.removeDomainFromEmailAddress(data.email).split(puncSpacePattern),
    )
      .join(' ')
      .replace(puncPattern, '');
    const board = this.model.getBoard();
    const org = board != null ? board.getOrganization() : undefined;

    _.extend(data, {
      fullName: Util.toTitleCase(fullName),
      canAddAsObserver:
        org != null ? org.isFeatureEnabled('observers') : undefined,
      modelType: 'Board',
      isLoading: true,
      isOrgAdmin: org != null ? org.owned() : undefined,
      isDesktop,
    });

    const isEmailSearch = Util.checkEmail(data.email);
    const canInvite =
      !(board != null ? board.hasInvitationRestrictions() : undefined) &&
      isEmailSearch &&
      (board != null ? board.canInviteMembers() : undefined);

    this.$('.js-board-members').addClass('hide');
    this.$('.js-org-members').addClass('hide');

    if (canInvite) {
      this.$('.js-invite-no-results').addClass('hide');
      this.$('.js-invite-results')
        .html(inviteAddNameTemplate(data))
        .removeClass('hide');

      if (this.wouldBecomeBillableGuestPromise != null) {
        this.wouldBecomeBillableGuestPromise.cancel();
      }
      return (this.wouldBecomeBillableGuestPromise = this.wouldBecomeBillableGuest(
        data.email,
      )
        .cancellable()
        .then((wouldBecomeBillableGuest) => {
          // Update the email form template to remove the loading state and prepare
          // the MBG alert if necessary
          _.extend(data, {
            isLoading: false,
            wouldBecomeBillableGuest,
            availableLicenseCount:
              org != null ? org.getAvailableLicenseCount() : Infinity,
          });
          this.$('.js-invite-results').html(inviteAddNameTemplate(data));

          // Inject the mbg alert if necessary (lets the user know about any extra billing, or why
          // they are not allowed to invite)
          if (wouldBecomeBillableGuest) {
            const Element = (
              <AutoCompleteMultiBoardGuestAlert
                displayOrg={org}
                isDesktop={isDesktop}
              />
            );
            if ((this.reactRoot = this.$('.js-billable-guests-alert')[0])) {
              return ReactDOM.render(Element, this.reactRoot);
            }
          }
        })
        .catch(ApiError, (restOrApiError) => {
          const error = localizeServerError(restOrApiError);
          _.extend(data, {
            isLoading: false,
            error,
          });
          return this.$('.js-invite-results').html(inviteAddNameTemplate(data));
        })
        .catch(Promise.CancellationError));
    }
  }

  _getNewMemberId(updatedMemberIds, existingMemberIds, newMemberRole, email) {
    // Dependency required at call site to avoid import cycles, do not lift to top of module
    const { ApiPromise } = require('app/scripts/network/api-promise');
    const newMemberId = _.first(
      _.difference(updatedMemberIds, existingMemberIds),
    );

    if (newMemberId != null) {
      track(
        'Invitations',
        'Send Email Board Invite to New Member',
        `Role: ${newMemberRole}`,
      );
      return Promise.resolve(newMemberId);
    }

    // Someone with this email already belonged to the board, so they couldn't
    // be invited or added. Use server search to find who it is and add them to
    // the card.
    const requestData = _.extend(
      { query: email },
      this.model.getBoard().getInviteURLParams(),
    );

    const searchParams = {
      url: '/1/search/members/',
      type: 'get',
      data: requestData,
      dataType: 'json',
    };
    return ApiPromise(searchParams).then((results) => {
      if (results.length > 0) {
        // server-side search by email does an exact search, so this should
        // always return only one result
        return results[0].id;
      }
    });
  }

  sendEmailInvite(e) {
    // Dependency required at call site to avoid import cycles, do not lift to top of module
    const { ApiPromise } = require('app/scripts/network/api-promise');
    Util.stop(e);
    const $sendButton = this.$('.js-send-email-invite');
    // The email is already being sent
    if ($sendButton.attr('disabled') != null) {
      return;
    }

    const $name = this.$('.js-email-data .js-full-name');
    const name = $name.val().trim();

    const email = this.$('.js-email-data .js-email').val().trim();

    if (!Util.validName(name)) {
      Util.setCaretAtEnd($name);
      $('.js-name-error').show();
      return;
    } else if (containsValidUrl(name)) {
      // Urls are not allowed as member names
      Util.setCaretAtEnd($name);
      $('.js-name-error-url').show();
      return;
    }

    const data = {
      fullName: name,
      email,
      type: 'normal',
      allowBillableGuest: true,
    };

    if (this.$('#addAsObserver').is(':checked')) {
      data.type = 'observer';
    }

    const board = this.model.getBoard();

    if (maybeDisplayMemberLimitsError($(e.target), board)) {
      return;
    }

    // Disable the button while we're sending the invite
    $sendButton.attr('disabled', 'disabled');

    const existingMembers = _.pluck(board.memberList.models, 'id');

    ApiPromise({
      url: `/1/board/${board.id}/members`,
      type: 'put',
      data,
    })
      .then(({ members }) => {
        const updatedMemberIds = _.pluck(members, 'id');
        return this._getNewMemberId(
          updatedMemberIds,
          existingMembers,
          data.type,
          email,
        );
      })
      .then((newMemberId) => {
        if (newMemberId != null) {
          const source = 'cardMemberSelectInlineDialog';
          const traceId = Analytics.startTask({
            taskName: 'edit-card/idMembers',
            source,
          });

          this.model.addMemberWithTracing(
            newMemberId,
            traceId,
            tracingCallback(
              {
                taskName: 'edit-card/idMembers',
                traceId,
                source,
              },
              (_err, res) => {
                if (res) {
                  Analytics.sendUpdatedCardFieldEvent({
                    field: 'idMembers',
                    source,
                    containers: {
                      card: { id: this.model.id },
                      board: { id: this.model.get('idBoard') },
                      list: { id: this.model.get('idList') },
                    },
                    attributes: {
                      taskId: traceId,
                    },
                  });

                  this.$('.js-send-email-invite').removeAttr('disabled');
                  return PopOver.hide();
                }
              },
            ),
          );

          return track('Card', 'Change Member', 'Add Member');
        }
      })
      .catch(ApiError, (resOrApiError) => {
        const message = localizeServerError(resOrApiError);

        this.$('.js-invite-error')
          .removeClass('hide')
          .find('.error')
          .html(message);
        this.$('.js-uninvited-search-results').empty().hide();

        $sendButton.removeAttr('disabled');
        $('js-search-mem').focus().select();

        track(
          'Invitations',
          'Error',
          resOrApiError.message != null
            ? resOrApiError.message
            : resOrApiError.responseText,
        );
      });
  }
}

CardMemberSelectView.initClass();
module.exports = CardMemberSelectView;
