/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const _ = require('underscore');
const $ = require('jquery');
const AutocompleteMemberAvatar = require('app/scripts/views/organization/invite-member-autocomplete-avatar');
const AutoCompleteMultiBoardGuestAlert = require('app/scripts/views/organization/invite-member-autocomplete-multi-board-guest-alert');
const Promise = require('bluebird');
const React = require('react');
const t = require('app/scripts/views/internal/recup-with-helpers')(
  'org_members',
);
const { l } = require('app/scripts/lib/localize');
const isDesktop = require('@trello/browser').isDesktop();
const { InfiniteList } = require('app/src/components/InfiniteList');
const {
  useNonPublicIfAvailable,
} = require('app/common/lib/util/non-public-fields-filter');
const { TeamTestIds } = require('@trello/test-ids');

const emailRegex = /([^"@\s[\](),:;<>\\]+@[-a-z0-9.]+\.[a-z]+)/gi;
const usernameRegex = /^@[a-z0-9_]{3,}$/;

class AutocompleteOptions extends React.Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.isActive;
  }

  render() {
    const {
      displayDetails,
      displayOrg,
      selectedOptions,
      activeIndex,
      searchResults,
      selectMemberOption,
    } = this.props;

    if (!searchResults.length) {
      return null;
    }

    const selectedOptionIds = selectedOptions.map((d) => d.id);
    return (
      <InfiniteList
        itemCount={searchResults.length}
        pageSize={20}
        awaitMore={false}
        // eslint-disable-next-line react/jsx-no-bind
        renderItem={(idx, key) => {
          const member = searchResults[idx];
          const selected = selectedOptionIds.includes(member.id);
          const activeMember = activeIndex === idx;
          return (
            <AutocompleteMemberAvatar
              // eslint-disable-next-line react/jsx-no-bind
              onMouseDown={(e) => selectMemberOption(e, member)}
              displayDetails={displayDetails}
              displayOrg={displayOrg}
              activeMember={activeMember}
              member={member}
              selected={selected}
              isDesktop={isDesktop}
              key={key}
            />
          );
        }}
      />
    );
  }
}

let _sanitizeEmail = undefined;
let _sanitizeUsername = undefined;

class MemberMultiSelectAutocompleteComponent extends React.Component {
  static initClass() {
    _sanitizeEmail = (email) => $.trim(email).toLowerCase().match(emailRegex);

    _sanitizeUsername = (username) =>
      $.trim(username).toLowerCase().replace(/@/g, '');

    this.prototype.render = t.renderable(function () {
      const {
        activeIndex,
        isActive,
        isFetching,
        isOpen,
        processingMembers,
        searchResults,
        searchText,
        error,
        showMultiBoardGuestAlert,
      } = this.state;
      const {
        placeholder,
        displayDetails,
        displayOrg,
        emptySearchText,
        submitText,
        children,
        extraSearchOption,
        selectedOptions,
        onRemoveMemberOption,
        fullWidthButton,
        submitAlwaysEnabled,
        hideDefaultButton,
        hideInviteLink,
        showMultiboardGuestWarning,
        isTemplate,
        showRestrictions,
      } = this.props;

      const validEmail = searchText.match(emailRegex);
      const atLeastOnePill = selectedOptions.length > 0;
      const atLeastOneBlockedInvite = _.some(
        selectedOptions,
        (member) => member.blockInvite,
      );
      const showMultiBoardGuestConfirmation =
        atLeastOneBlockedInvite && displayOrg && displayOrg.owned();
      const showMultiBoardGuestError =
        atLeastOneBlockedInvite && displayOrg && !displayOrg.owned();
      const buttonIsEnabled =
        (((!atLeastOnePill && validEmail) || atLeastOnePill) &&
          !processingMembers &&
          (!atLeastOneBlockedInvite || showMultiBoardGuestConfirmation)) ||
        submitAlwaysEnabled;

      return t.div('.multi-select-autocomplete-container', () => {
        t.div(
          '.autocomplete-input-container',
          {
            class: t.classify({
              active: isActive,
              processing: processingMembers,
              'is-empty': !selectedOptions.length,
            }),
            onKeyDown: this.onAutocompleteKeyDown,
          },
          () => {
            t.div('.autocomplete-selected', () => {
              if (selectedOptions.length) {
                selectedOptions.map((member, idx) => {
                  return t.createElement(AutocompleteMemberAvatar, {
                    displayDetails: false,
                    showRestrictions,
                    onRemoveClick: (e) => {
                      e.preventDefault();
                      return onRemoveMemberOption(idx);
                    },
                    onShowMultiBoardGuestAlert: (shouldShow) =>
                      this.setState({ showMultiBoardGuestAlert: shouldShow }),
                    member,
                  });
                });
              }

              return t.input('.autocomplete-input', {
                type: 'text',
                onBlur: this.onInputBlur,
                onChange: this.onInputChange,
                onKeyDown: this.onInputKeyDown,
                onFocus: this.onInputFocus,
                onPaste: this.onInputPaste,
                disabled: processingMembers,
                placeholder: selectedOptions.length ? '' : placeholder,
                value: searchText,
                style: {
                  minWidth: `${Math.min(
                    (searchText != null ? searchText.length : undefined) * 8 +
                      2,
                    264,
                  )}px`,
                },
                ref: this.searchInput,
                'data-test-id': TeamTestIds.AddMemberInput,
              });
            });

            if (isOpen) {
              if (isFetching) {
                return t.div('.autocomplete-search-results', () => {
                  return t.div('.spinner.loading');
                });
              } else {
                if (searchResults.length > 0) {
                  return t.div(
                    '.autocomplete-search-results',
                    {
                      className:
                        extraSearchOption != null ? 'has-extra-option' : '',
                    },
                    () => {
                      t.div('.autocomplete-search-scroll', () => {
                        return t.tag(AutocompleteOptions, {
                          isActive,
                          displayDetails,
                          displayOrg,
                          selectedOptions,
                          activeIndex,
                          searchResults,
                          selectMemberOption: this.selectMemberOption,
                        });
                      });
                      if (extraSearchOption) {
                        return t.addElement(extraSearchOption);
                      }
                    },
                  );
                } else if (emptySearchText != null) {
                  return t.div(
                    '.autocomplete-search-results.is-empty',
                    function () {
                      t.div(
                        '.is-empty-text',
                        {
                          class: t.classify({
                            'is-empty-text-mod-padding':
                              extraSearchOption != null,
                          }),
                        },
                        () => t.text(emptySearchText),
                      );
                      if (extraSearchOption) {
                        return t.addElement(extraSearchOption);
                      }
                    },
                  );
                }
              }
            } else if (error != null) {
              return t.div('.autocomplete-search-results.is-empty', () =>
                t.text(error.message),
              );
            } else if (showMultiBoardGuestAlert) {
              return t.div('.autocomplete-search-results.is-empty', () =>
                t.createElement(AutoCompleteMultiBoardGuestAlert, {
                  displayOrg,
                  isDesktop,
                }),
              );
            }
          },
        );

        t.addElement(children);

        if (!hideInviteLink) {
          t.div('.invite-link-actions', function () {
            t.span('.invite-with-link', function () {
              t.img('.invite-with-link-icon', {
                src: require('resources/images/icon-link.svg'),
              });
              return t.text(
                l([
                  'templates',
                  'board_member_add_multiple',
                  'invite-with-link',
                ]),
              );
            });

            t.a('.action-link.js-show-invitation-link', { href: '#' }, () =>
              t.text(
                l(['templates', 'board_member_add_multiple', 'create-link']),
              ),
            );

            return t.a(
              '.action-link.js-deactivate-link.hide.js-invitation-link-container',
              { href: '#' },
              () =>
                t.text(
                  l(['templates', 'board_member_add_multiple', 'disable-link']),
                ),
            );
          });

          t.p('.quiet.invite-with-link-description', function () {
            if (showMultiboardGuestWarning) {
              t.text(
                l([
                  'templates',
                  'board_member_add_multiple',
                  'guests-that-are-already-on-another-team',
                ]),
              );

              if (!isDesktop) {
                t.text(' ');
                const helpUrl =
                  'https://help.trello.com/article/1123-multi-board-guests';
                return t.a(
                  {
                    href: helpUrl,
                    target: '_blank',
                  },
                  () => l(['templates', 'select_member', 'learn-more']),
                );
              }
            } else if (isTemplate) {
              return t.text(
                l([
                  'templates',
                  'board_member_add_multiple',
                  'anyone-with-link-can-join-as-template-member',
                ]),
              );
            } else {
              return t.text(
                l([
                  'templates',
                  'board_member_add_multiple',
                  'anyone-with-link-can-join-as-board-member',
                ]),
              );
            }
          });

          t.div(
            '.manage-member-invitation-link.hide.js-invitation-link-container',
            function () {
              t.input('.js-invitation-link', {
                type: 'text',
                readOnly: 'readonly',
                placeholder: l([
                  'templates',
                  'board_member_add_multiple',
                  'loading',
                ]),
              });

              t.button(
                '.nch-button.nch-button--primary.js-copy-invitation-link.js-hide-on-copy',
                () =>
                  t.text(l(['templates', 'board_member_add_multiple', 'copy'])),
              );
              t.button(
                '.nch-button.nch-button--primary.js-copy-invitation-link.js-show-on-copy.hide',
                () =>
                  t.text(
                    l(['templates', 'board_member_add_multiple', 'copied']),
                  ),
              );

              return t.div('.js-qr-code.qr-code-inline');
            },
          );
        }

        // We'll show the error or the confirmation here, but only admins (owned)
        // can actually go through confirmation
        if (showMultiBoardGuestConfirmation || showMultiBoardGuestError) {
          t.div('.multi-board-guest-message', () =>
            t.format('invite-multi-board-guests-confirmation-message'),
          );
        }

        if (!hideDefaultButton) {
          return t.button(
            '.autocomplete-btn.nch-button.nch-button--primary',
            {
              class: t.classify({
                disabled: !buttonIsEnabled,
                fullWidthButton,
              }),
              disabled: !buttonIsEnabled,
              onClick: this.onAutocompleteSubmit(
                showMultiBoardGuestConfirmation,
              ),
              'data-test-id': TeamTestIds.TeamInviteSubmitButton,
            },
            function () {
              if (processingMembers) {
                return t.div('.spinner.loading');
              } else {
                if (showMultiBoardGuestConfirmation) {
                  return t.format(
                    'invite-multi-board-guests-confirmation-button',
                  );
                } else {
                  return t.text(submitText);
                }
              }
            },
          );
        }
      });
    });
  }
  constructor(props) {
    super(props);

    this.delaySearchTimeout = null;
    this.searchForMembersPromise = null;
    this.isUnmounted = false;
    this.searchCache = {};
    this.searchInput = React.createRef();
    this.searchInputFocusPending = null;

    this.updateSearchResultList = this.updateSearchResultList.bind(this);
    this.cancelPendingSearch = this.cancelPendingSearch.bind(this);
    this.searchForMembers = this.searchForMembers.bind(this);
    this.selectMemberOption = this.selectMemberOption.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.onInputFocus = this.onInputFocus.bind(this);
    this.onInputBlur = this.onInputBlur.bind(this);
    this.onInputKeyDown = this.onInputKeyDown.bind(this);
    this.onInputPaste = this.onInputPaste.bind(this);
    this.onAutocompleteKeyDown = this.onAutocompleteKeyDown.bind(this);
    this.onAutocompleteSubmit = this.onAutocompleteSubmit.bind(this);
    this.onDocumentClick = this.onDocumentClick.bind(this);

    this.state = {
      activeIndex: -1,
      isOpen: false,
      isFetching: props.loadingOrg,
      processingMembers: false,
      isActive: true,
      isTyping: false,
      searchResults: [],
      searchText: '',
      shouldFocusOnUpdate: false,
      showMultiBoardGuestAlert: false,
    };
  }

  componentDidMount() {
    this.searchInputFocusPending = setTimeout(
      () =>
        this.searchInput.current != null
          ? this.searchInput.current.focus()
          : undefined,
      100,
    );
    return document.addEventListener('click', this.onDocumentClick);
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.loadingOrg &&
      !this.props.loadingOrg &&
      !this.state.searchText
    ) {
      this.setState({ shouldFocusOnUpdate: true }, () =>
        this.searchForMembers(this.state.searchText),
      );
    }

    if (this.state.shouldFocusOnUpdate) {
      this.searchInput.current.focus();
      this.setState({ shouldFocusOnUpdate: false });
    }

    // Sometimes we lose focus without calling the onBlur handler, we should
    // update the state in these cases
    if (
      this.state.isActive &&
      document.activeElement !== this.searchInput.current
    ) {
      return this.setState({
        isOpen: false,
        isActive: false,
      });
    }
  }

  componentWillUnmount() {
    // Don't try to focus on the input field since it's getting unmounted
    if (this.searchInputFocusPending != null) {
      clearTimeout(this.searchInputFocusPending);
      this.searchInputFocusPending = null;
    }

    this.isUnmounted = true;
    this.cancelPendingSearch();

    return document.removeEventListener('click', this.onDocumentClick);
  }

  updateSearchResultList(searchVal) {
    if (!searchVal) {
      return;
    }

    const searchResultList = this.searchCache[searchVal];
    if (searchResultList) {
      return this.receiveSearchResults(searchResultList);
    } else {
      return this.searchForMembers(searchVal);
    }
  }

  cancelPendingSearch() {
    clearTimeout(this.delaySearchTimeout);
    this.searchForMembersPromise?.cancel();
  }

  async searchForMembers(query) {
    const { onAutocompleteSearch } = this.props;

    this.cancelPendingSearch();

    const handleSearchResults = (resultList) => {
      if (resultList == null) {
        resultList = [];
      }

      resultList.forEach(function (member) {
        if (member.id) {
          const availableNonPublicAttributes = {
            avatarUrl: useNonPublicIfAvailable(member, 'avatarUrl'),
            fullName: useNonPublicIfAvailable(member, 'fullName'),
            initials: useNonPublicIfAvailable(member, 'initials'),
          };
          return (member = _.extend(member, availableNonPublicAttributes));
        }
      });
      this.searchCache[query] = resultList;
      this.receiveSearchResults(resultList);
    };

    if (usernameRegex.test(query)) {
      query = _sanitizeUsername(query);
    } else if (emailRegex.test(query)) {
      query = _sanitizeEmail(query)[0];
    }

    if (query.length <= 2) {
      const resultList = await onAutocompleteSearch(query);
      return handleSearchResults(resultList);
    }

    this.setState({ isFetching: true, isOpen: true });

    try {
      /**
       * This is a trickier way of handling debounce because it
       * provides a better experience for the user in showing the
       * spinner when searching versus not.
       */
      this.searchForMembersPromise = new Promise((resolve) => {
        this.delaySearchTimeout = setTimeout(async () => {
          this.searchForMembersPromise = Promise.try(() =>
            onAutocompleteSearch(query),
          ).cancellable();
          const resultList = await this.searchForMembersPromise;

          handleSearchResults(resultList);
          resolve();
        }, 500);
      });

      await this.searchForMembersPromise;
    } catch (err) {
      if (err instanceof Promise.CancellationError) {
        if (!this.searchForMembersPromise) {
          this.setState({ isFetching: false });
        }
      } else {
        this.setState({ isFetching: false, error: err });
      }
    } finally {
      this.searchForMembersPromise = null;
    }
  }

  receiveSearchResults(searchResults) {
    searchResults = _.filter(
      searchResults,
      (result) => result.email || result.username,
    );

    this.setState({
      isOpen: this.state.isTyping,
      isFetching: false,
      searchResults,
    });
  }

  selectMemberOption(e, member) {
    e.preventDefault();
    const {
      onSelectMemberOption,
      shouldFocusOnSelectMemberOption,
    } = this.props;
    this.cancelPendingSearch();

    this.setState({
      searchText: '',
      isOpen: false,
      shouldFocusOnUpdate: shouldFocusOnSelectMemberOption || false,
    });
    return onSelectMemberOption(member);
  }

  onDocumentClick(e) {
    // If the user clicks outside both the red lozenge and the MBG alert, hide it if it is shown
    if (
      $(e.target).closest(
        '.autocomplete-search-results.is-empty, .autocomplete-option',
      ).length === 0 &&
      this.state.showMultiBoardGuestAlert
    ) {
      return this.setState({ showMultiBoardGuestAlert: false });
    }
  }

  onInputBlur(e) {
    // Ensure that the input element has actually unfocused. This addresses the case where a the user
    // clicks on a link that opens a new tab / window. This causes a blur event but does not actually
    // change the activeElement.
    if (document.activeElement !== this.searchInput.current) {
      if (emailRegex.test(e.target.value)) {
        this.selectMemberOption(
          e,
          _.map(_sanitizeEmail(e.target.value), (email) => ({ email })),
        );
      }

      return this.setState({
        isOpen: false,
        isActive: false,
      });
    }
  }

  onInputChange(e) {
    const searchText = e.target.value;
    this.setState({
      searchText,
      isOpen: false,
      error: undefined,
      showMultiBoardGuestAlert: false,
    });
    return this.updateSearchResultList(searchText);
  }

  onInputFocus(e) {
    return this.setState({ isActive: true });
  }

  onInputKeyDown(e) {
    const { onRemoveMemberOption, selectedOptions } = this.props;

    if (e.key === 'Backspace' && !e.target.value && selectedOptions.length) {
      onRemoveMemberOption(selectedOptions.length - 1);
      return this.setState({ shouldFocusOnUpdate: true });
    }

    if (
      ['Enter', ',', ' '].includes(e.key) &&
      emailRegex.test(e.target.value)
    ) {
      // enter, comma, or spacebar
      e.preventDefault();
      this.setState({
        isOpen: false,
        isTyping: false,
      });
      // stop any running search queries
      this.cancelPendingSearch();
      // map out emails in the case of bulk copy + paste
      return this.selectMemberOption(
        e,
        _.map(_sanitizeEmail(e.target.value), (email) => ({ email })),
      );
    } else if (
      e.key !== 'Backspace' ||
      e.target.value ||
      !selectedOptions.length
    ) {
      return this.setState({ isTyping: true });
    }
  }

  onInputPaste(e) {
    const clipboardValue = e.clipboardData.getData('Text');
    if (emailRegex.test(clipboardValue)) {
      return this.selectMemberOption(
        e,
        _.map(_sanitizeEmail(clipboardValue), (email) => ({ email })),
      );
    }
  }

  onAutocompleteKeyDown(e) {
    let nextIndex, prevIndex;
    const { activeIndex, searchResults } = this.state;
    switch (e.key) {
      case 'Enter':
        if (searchResults[activeIndex] && !searchResults[activeIndex].joined) {
          this.setState({ activeIndex: -1 });
          return this.selectMemberOption(e, searchResults[activeIndex]);
        }
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        nextIndex =
          activeIndex === searchResults.length - 1 ? -1 : activeIndex + 1;
        return this.setState({ activeIndex: nextIndex });
      case 'ArrowLeft':
      case 'ArrowUp':
        prevIndex =
          activeIndex === -1 ? searchResults.length - 1 : activeIndex - 1;
        return this.setState({ activeIndex: prevIndex });
      default:
        return null;
    }
  }

  onAutocompleteSubmit(allowMultiBoardGuests) {
    return (e) => {
      const { searchText } = this.state;
      const { onSubmit, submitDisabled } = this.props;
      if (emailRegex.test(searchText)) {
        this.selectMemberOption(
          e,
          _.map(_sanitizeEmail(searchText), (email) => ({ email })),
        );
      }

      this.setState({ processingMembers: true });
      return onSubmit(allowMultiBoardGuests)
        .then(() => {
          if (!this.isUnmounted && !submitDisabled) {
            return this.setState({ processingMembers: false });
          }
        })
        .catch((err) => {
          if (!this.isUnmounted) {
            return this.setState({ processingMembers: false, error: err });
          }
        });
    };
  }
}

MemberMultiSelectAutocompleteComponent.initClass();
module.exports = MemberMultiSelectAutocompleteComponent;
