/* global moment, Sentry, TrelloPowerUp */
const _ = require('lodash');
const { decompressFromEncodedURIComponent, compressToEncodedURIComponent } = require('lz-string');
const confetti = require('canvas-confetti').default;
const { Auth } = require('./trello-api.js');
const Builder = require('./builder-util.js');
const { getCurrentTab, showTab } = require('./powerup-tabs.js');
const CommandLog = require('./powerup-command-log.js');
const CommandStorage = require('./powerup-command-storage.js');
const Generator = require('./ui-generator.js');
const kApiEndpoint = require('./api-endpoint.js');
const Log = require('./logging.js');
const Plan = require('./powerup-plan.js');
const {
  handleError,
  markdownToHtml,
  sanitize,
  makeSlug,
  normalizeTabForUrl,
} = require('./util.js');
const Integrations = require('./powerup-integrations.js');
const Suggestions = require('./powerup-suggestions.js');
const Analytics = require('./analytics.js');

const tabToScreenMapping = {
  suggestions: 'butlerSuggestionsScreen',
  rules: 'butlerRulesScreen',
  'card-buttons': 'butlerCardButtonsScreen',
  'board-buttons': 'bulterBoardButtonsScreen',
  schedules: 'butlerSchedulesScreen',
  'on-dates': 'butlerOnDatesScreen',
  'connected-apps': 'butlerConnectedAppsScreen',
};

const tabToType = {
  rules: 'rule',
  rule: 'rule',
  'card-button': 'card-button',
  'card-buttons': 'card-button',
  'board-button': 'board-button',
  'board-buttons': 'board-button',
  schedule: 'schedule',
  schedules: 'schedule',
  'on-date': 'on-date',
  'on-dates': 'on-date',
};

/** ****************************************************************************
@
@  Tabs
@
***************************************************************************** */

function updateNavigation({ tab, action, commandId, newCommand, newIcon, newLabel } = {}) {
  const t = TrelloPowerUp.iframe({
    targetOrigin: 'https://trello.com',
  });
  if (t.getContext().useRoutes !== true) {
    return;
  }
  const tabUrlComponent = normalizeTabForUrl(tab || getCurrentTab());
  const actionUrlComponent = action ? `/${action}` : '';
  const commandIdUrlComponent = commandId ? `/${commandId}` : '';
  const newCommandParams = new URLSearchParams();
  if (newCommand) {
    newCommandParams.set('c', compressToEncodedURIComponent(newCommand));
    if (newIcon) {
      newCommandParams.set('i', newIcon);
    }
    if (newLabel) {
      newCommandParams.set('l', newLabel);
    }
  }
  const newCommandUrlComponent = newCommand ? `?${newCommandParams.toString()}` : '';

  t.board('shortLink', 'name').then(res => {
    const boardSlug = makeSlug(res.name);
    const boardUrl = `https://trello.com/b/${res.shortLink}/${boardSlug}/butler/${tabUrlComponent}${actionUrlComponent}${commandIdUrlComponent}${newCommandUrlComponent}`;
    t.navigate({
      url: boardUrl,
      trigger: false,
    });
  });
}

function showAddCommandButtons() {
  $('.command-section .new-command-btn').transition('show');
  $('.command-section .get-started-btn').transition('hide');
}

function showGetStartedButton(auth_fn) {
  $('.command-section .new-command-btn').transition('hide');
  $('.command-section .get-started-btn')
    .off('click')
    .click(auth_fn)
    .transition('show');
}

function loadIntegrationsTab() {
  showTab('connected-apps');
  updateNavigation();

  Integrations.init(Builder);
  return Auth.authorize().then(() => {
    return Integrations.getUserIntegrations().then(userIntegrations => {
      $('.integration-disconnected').transition('show');
      $('.integration-connected').transition('hide');
      userIntegrations.forEach(integration => {
        $(`.integration-connected[data-app-name="${sanitize(integration.appName)}"]`).transition(
          'show'
        );
        $(`.integration-disconnected[data-app-name="${sanitize(integration.appName)}"]`).transition(
          'hide'
        );
        const descriptionElement = $(
          `.integration-description[data-app-name="${sanitize(integration.appName)}"]`
        );
        descriptionElement.transition('hide');
        const description = Integrations.handleActionSync(
          integration.appName,
          'describe',
          integration.appData
        );
        if (description) {
          descriptionElement.html(markdownToHtml(description)).transition('show');
        }
        const revocationElement = $(
          `.revoke-integration[data-app-name="${sanitize(integration.appName)}"]`
        );
        const data = Integrations.handleActionSync(
          integration.appName,
          'setupRevocation',
          integration.appData
        );
        if (data) {
          revocationElement.empty();
          data.forEach(resource => {
            revocationElement.append(
              `<div class="item integration-action" data-verb="revoke" data-app-name="Slack">${sanitize(
                resource
              )} <img class="icon" src="img/trash.svg"></img></div>`
            );
          });
          revocationElement.closest('.ui,.dropdown').dropdown('clear');
        }
      });
      $('.integration-action')
        .off('click')
        .click(event => {
          const action = $(event.target).closest('.integration-action');
          const appName = action.attr('data-app-name');
          const verb = action.attr('data-verb');
          const params = { event };
          if (verb === 'connect') {
            Analytics.sendUIEvent({
              action: 'clicked',
              actionSubject: 'link',
              actionSubjectId: 'integrationActionConnectLink',
              source: 'butlerIntegrationsScreen',
              attributes: {
                appName,
                numOfConnections: (userIntegrations || []).length,
              },
            });
          } else if (verb === 'revoke') {
            Analytics.sendUIEvent({
              action: 'clicked',
              actionSubject: 'link',
              actionSubjectId: 'integrationActionRevokeLink',
              source: 'butlerIntegrationsScreen',
              attributes: {
                appName,
              },
            });
          }
          Integrations.handleAction(appName, verb, params)
            .then(loadIntegrationsTab)
            .catch(err => {
              // TODO: Present different errors for different `verb`s or
              // `appName`s
              Sentry.captureException(err);
              const t = window._trello;
              t.alert({
                display: 'error',
                duration: 10,
                message: 'App connection failed. Please retry.',
              });
            });
        });
      return userIntegrations;
    });
  });
}

function loadCommandsTab(type, callback) {
  // we don't want the popup to be wiped on tab switch
  // so extract the popup out before switching
  const removeCmdPopup = $('.remove-command-popup');
  $('body').append(removeCmdPopup.detach());
  // In Chrome, popup seems to hide automatically
  // But in other browsers, they aren't. So explicitly hide it
  removeCmdPopup.transition('hide');

  const t = TrelloPowerUp.iframe({
    targetOrigin: 'https://trello.com',
  });
  if (t.getContext().commandSharing) {
    const addCmdToBoardPopup = $('.add-command-to-board-popup');
    const enabledOnXBoardsPopup = $('.enabled-on-x-boards-popup');
    $('body').append(addCmdToBoardPopup.detach(), enabledOnXBoardsPopup.detach());
    addCmdToBoardPopup.transition('hide');
    enabledOnXBoardsPopup.transition('hide');
    __flags.shareCommand = undefined;
    __flags.done = undefined;
  }

  showTab(`${type}s`);
  $(
    '.builder-batch-select,.builder-batch,.card-button,.board-button,.rule,' +
      '.schedule,.on-date,.command-list-filter,.command-list,' +
      '.empty-command-list,.admin-empty-command-list,.builder-wizard,.builder'
  ).transition('hide');
  $(`.${type}`).transition('show');

  let headerText;

  switch (type) {
    case 'card-button':
      headerText = 'Card Buttons';
      break;
    case 'board-button':
      headerText = 'Board Buttons';
      break;
    case 'rule':
      headerText = 'Rules';
      break;
    case 'schedule':
      headerText = 'Scheduled Commands';
      break;
    case 'on-date':
      headerText = 'Due Date Commands';
      break;
    default:
      break;
  }
  $('.your-commands-header').text(headerText);
  if (typeof callback === 'undefined') {
    updateNavigation();
  }

  Auth.authorizeSoft()
    .then(function() {
      showAddCommandButtons();
      loadCommands(type, callback);
    })
    .catch(function() {
      showEmptyList();
      showGetStartedButton(function() {
        Auth.authorize().then(function() {
          loadCommandsTab(type, callback);
        });
      });
    });
}

/** ****************************************************************************
@
@  Commands
@
***************************************************************************** */

function hideAdminUI() {
  $('.admin-ui').transition('hide');
}

function sortCommands(commands) {
  return commands.sort(function(a, b) {
    // return a.label.localeCompare(b.label);  // Trello seems to sort buttons by plain ASCII.
    return a.label < b.label ? -1 : b.label < a.label ? 1 : 0;
  });
}

function getCommands(type) {
  return TrelloPowerUp.Promise.join(
    Plan.getUserPlanLocal(),
    CommandStorage.getCommands(type)
  ).spread(function(plan, result) {
    const { commands, obo_writable } = result;
    return {
      commands: sortCommands(commands),
      is_admin: !!(plan || {}).is_admin,
      obo_writable,
    };
  });
}

function duplicateCommand({ command, share, board } = {}) {
  getCommands(command.type).then(function(result) {
    // Reload the command without overrides.
    command =
      result.commands.find(function(c) {
        return c.id === command.id;
      }) || command;
    showBuilder({ type: command.type, command, duplicate: true, share, board });
  });
}

function applyCommandListFilter(animate) {
  $('.command-list > .command').transition('stop all');

  const value = $('.command-list-filter .ui.dropdown.filter').dropdown('get value');
  let fn;

  switch (value) {
    case '':
    case 'all':
      fn = function() {
        return true;
      };
      break;
    case 'enabled':
      fn = function(row) {
        return row.find('.enable-command-tgl')[0].checked;
      };
      break;
    case 'disabled':
      fn = function(row) {
        return !row.find('.enable-command-tgl')[0].checked;
      };
      break;
    case 'search':
      const text = $('.command-list-filter .command-search input')
        .val()
        .toLowerCase();
      fn = function(row) {
        return (
          row
            .find('.code-area')
            .text()
            .toLowerCase()
            .indexOf(text) !== -1
        );
      };
      break;
    default:
      fn = function(row) {
        return row.find('.command-lib-name>.text').text() === value;
      };
  }

  let count = 0;
  const toggle = $('.command-list > .command').filter(function() {
    const match = fn($(this));
    const visible = $(this).filter(':visible').length > 0;
    if (match) {
      ++count;
    }
    return match !== visible;
  });
  toggle.transition(animate ? 'scale' : 'toggle');
  $('.filter-no-commands').transition(count ? 'hide' : 'show');
}

function getUserLibNames() {
  return CommandStorage.getAllCommands().then(function(result) {
    const { commands } = result;
    return commands
      .map(function(command) {
        return command.lib;
      })
      .sort()
      .filter(function(lib, i, a) {
        return lib && lib !== a[i - 1];
      });
  });
}

function updateCommandLib(command, new_lib, name_element) {
  if (new_lib === command.lib) {
    return;
  }
  name_element.addClass('disabled');
  name_element.find('>.text').text(new_lib);
  CommandStorage.updateCommandId(command.id, { lib: new_lib })
    .then(function(updated_command) {
      command.lib = updated_command.lib;
      name_element.removeClass('disabled');
      name_element.removeAttr('data-tooltip');
      applyCommandListFilter(true);
      Log.logEvent('engagement', 'lib_set', !!new_lib);
    })
    .catch(function(error) {
      Sentry.captureException(error);
      name_element.find('>.text').text(command.lib);
      name_element
        .removeClass('disabled')
        .attr('data-tooltip', 'Error saving.')
        .transition('shake');
    });
}

function setupAddCommandToBoardPopup(command, buttonElement) {
  buttonElement.popup({
    popup: '.add-command-to-board-popup',
    on: 'click',
    position: 'bottom center',
    lastResort: 'bottom left',
    boundary: '.command-list',
    duration: 0,
    exclusive: true,
    onShow() {
      // if the popup is appended to the body, then it should never be visible
      if ($('.add-command-to-board-popup').parent()[0] === $('body')[0]) {
        return false;
      }
      $(this).attr('command-id', command.id);
      const addAutomationBtn = $(this).find('.add-automation-btn');
      addAutomationBtn.addClass('disabled');
      const boardDropdown = $(this).find('[name="board-name"]');
      Builder.getAllOpenBoards().then(function(boards) {
        // We want to filter out the boards the command is already enabled on
        const filteredBoards = boards.filter(board => !command.b.includes(board.id));
        Builder.setupBoardNameDropdown(boardDropdown, filteredBoards, addAutomationBtn);
      });
      Analytics.sendUIEvent({
        action: 'clicked',
        actionSubject: 'button',
        actionSubjectId: 'addToBoardButtonPopup',
        source: tabToScreenMapping[getCurrentTab().trim()],
      });
    },
    onHidden() {
      $(`#${command.id}`)
        .find('.add-to-board-btn')
        .append(
          $(this)
            .popup()
            .detach()
        );
      setupEnabledOnXBoardsPopup(command, buttonElement);
      setupAddCommandToBoardPopup(command, $(`#${command.id}`).find('.add-to-board-btn'));
    },
  });
}

const renderEnabledOnBoardCheckbox = boardName =>
  `<div class="ui checked checkbox enabled-on-board-checkbox">
            <input type="checkbox" class="enable-board-tgl">
            <label>${sanitize(boardName)}</label>
            </div>`;

function setupEnabledOnXBoardsPopup(command, buttonElement, trigger = 'click') {
  buttonElement.popup({
    popup: '.enabled-on-x-boards-popup',
    on: trigger,
    position: 'bottom center',
    lastResort: 'bottom right',
    boundary: '.command-list',
    duration: 0,
    exclusive: true,
    onShow() {
      // if the popup is appended to the body, then it's a detached popover
      // and it should never be visible
      if ($('.enabled-on-x-boards-popup').parent()[0] === $('body')[0]) {
        return false;
      }
      $(this).attr('command-id', command.id);
      const menu = $(this).find('.enabled-on-board-menu');
      Builder.getAllOpenBoards().then(function(boards) {
        const enabledBoards = boards.filter(board => command.b.includes(board.id));
        menu.empty();
        enabledBoards.forEach(function(board) {
          menu.append(renderEnabledOnBoardCheckbox(board.name));
          const checkbox = menu.find('.enabled-on-board-checkbox').last();
          checkbox.checkbox('check');
          checkbox.checkbox({
            onChange() {
              const btns = $('.sharing-btns');
              btns.addClass('disabled');
              let commandBoards = command.b;
              if (this.checked) {
                // if checked, we want to update the command with the board included
                // This shouldn't really happen because the popover will close once a
                // checkbox is unchecked so this is only to handle an unusual edge case
                // where the user might be able to rapid fire uncheck and check the
                // checkbox in the popover somehow
                commandBoards.push(board.id);
              } else {
                // if unchecked, we want to remove it from boards
                // so we want to update the command with that board removed
                commandBoards = commandBoards.filter(b => b !== board.id);
              }
              $('.enabled-on-x-boards-popup').transition('hide');
              $('body').append($('.enabled-on-x-boards-popup').detach());
              __flags = {};
              updateCommand(command.id, command.type, command.cmd, { boards: commandBoards }).then(
                function() {
                  btns.removeClass('disabled');
                }
              );
            },
          });
        });
      });
      Analytics.sendUIEvent({
        action: 'clicked',
        actionSubject: 'link',
        actionSubjectId: 'enabledOnXBoardsLink',
        source: tabToScreenMapping[getCurrentTab().trim()],
      });
    },
  });
}

function setupCommandLibPopup(command, lib_name_element) {
  const lib_name_popup = $('.command-lib-name-popup>.popup').clone(); // Do not move original to an ephemeral element.
  const lib_select = lib_name_popup.find('.lib-select');

  lib_name_element.popup({
    popup: lib_name_popup,
    on: 'click',
    position: 'right center',
    target: lib_name_element.find('i'),
    exclusive: true,
    onShow() {
      lib_select
        .dropdown({
          allowAdditions: false,
          forceSelection: false,
          action: 'hide',
          message: {
            addResult: '',
            noResults: 'Press enter to create tag',
          },
          onChange(value) {
            lib_name_element.popup('hide');
            updateCommandLib(command, value, lib_name_element);
          },
          onHide() {
            lib_select.find('input.search').off('keydown');
          },
        })
        .dropdown(command.lib ? 'set text' : 'clear text', sanitize(command.lib || ''));
      getUserLibNames().then(function(libs) {
        const values = libs.map(function(lib) {
          return { name: sanitize(lib), value: sanitize(lib), selected: lib === command.lib };
        });
        lib_select.dropdown('setup menu', { values });
        setTimeout(function() {
          const searchInput = lib_select.find('input.search');
          searchInput.on('keydown', event => {
            const keyCode = event.keyCode || event.which;
            if (event.key === 'Enter' || keyCode === '13') {
              lib_name_element.popup('hide');
              updateCommandLib(command, searchInput.val(), lib_name_element);
              searchInput.off('keydown');
              return false;
            }
            return true;
          });
          searchInput.focus();
        }, 0);
      });
      lib_select.find('> a.info').transition(command.lib ? 'hide' : 'show');
      lib_select
        .find('> a.remove')
        .transition(command.lib ? 'show' : 'hide')
        .off('click')
        .click(function() {
          lib_name_element.popup('hide');
          updateCommandLib(command, '', lib_name_element);
        });
    },
    onHidden() {
      lib_name_element.append(
        $(this)
          .popup()
          .detach()
      );
    },
  });
}

function updateModifiedBy(command) {
  const m = moment(Math.min(+new Date(), command.t)).fromNow();
  let html = `Last modified ${m}`;
  const t = TrelloPowerUp.iframe({
    targetOrigin: 'https://trello.com',
  });
  if (t.getContext().commandSharing) {
    Builder.getAllOpenBoards().then(function(boards) {
      const numBoards = command.b ? boards.filter(board => command.b.includes(board.id)).length : 0;
      if (numBoards > 0) {
        html = `<span class="enabled-on-x-boards">Enabled on ${numBoards} board${
          numBoards === 1 ? '' : 's'
        },</span> last modified ${m}`;
      }
      if (!command.is_own)
        html += ` <span data-tooltip="Owner of this shared command"> by @${sanitize(
          command.username
        )}</span>`;
      $(`#${command.id} .modified-by`).html(html);
      setupEnabledOnXBoardsPopup(command, $(`#${command.id}`).find('.enabled-on-x-boards'));
    });
  } else {
    if (!command.is_own)
      html += ` <span data-tooltip="Owner of this shared command"> by @${sanitize(
        command.username
      )}</span>`;
    $(`#${command.id} .modified-by`).html(html);
  }
}

function shareCommand(event) {
  const element = $(event.target).closest('.command');
  const id = element.attr('id');
  const btns = $('.sharing-btns');

  Analytics.sendUIEvent({
    action: 'clicked',
    actionSubject: 'button',
    actionSubjectId: 'shareCommandButton',
    source: tabToScreenMapping[getCurrentTab().trim()],
    attributes: {
      isChecked: event.target.checked,
    },
  });

  btns.addClass('disabled');
  CommandStorage.updateCommandId(id, { shared: event.target.checked })
    .then(function(command) {
      btns.removeClass('disabled');
      updateModifiedBy(command);
    })
    .catch(function(error) {
      Sentry.captureException(error);
      btns.removeClass('disabled');
      $(event.target)
        .closest('.ui.checkbox')
        .checkbox(`set ${event.target.checked ? 'unchecked' : 'checked'}`)
        .attr('data-tooltip', 'Error saving.')
        .transition('shake');
    });

  if (event.target.checked) {
    Log.logEvent('engagement', 'share_button');
  }
}

function showEmptyList(animate) {
  $('.command-list,.command-list-filter').transition('hide');
  const empty = CommandStorage.getAdminOnBehalfOf()
    ? $('.admin-empty-command-list')
    : $('.empty-command-list');
  if (animate)
    empty.transition({
      animation: 'fade down',
      duration: '0.33s',
    });
  else empty.transition('show');
  $('.library-manage').transition('show');
}

function removeCommandFromTable(element) {
  element.transition({
    animation: 'fade down',
    duration: '0.33s',
    onComplete() {
      element.remove();
      if (!$('.command-list').children().length) {
        showEmptyList(true);
      }
    },
  });
}

function showCommandsList() {
  if ($('.command-list').children().length) {
    $('.empty-command-list,.admin-empty-command-list').transition('hide');
    $('.command-list,.command-list-filter,.create-command-buttons.top').transition('show');
    applyCommandListFilter();
    $('.library-manage').transition('show');
  } else {
    const empty = CommandStorage.getAdminOnBehalfOf()
      ? $('.admin-empty-command-list')
      : $('.empty-command-list');
    empty.transition('show');
    showEmptyList();
  }
  if (!$('.command-section:visible').length)
    $('.command-section').transition({
      animation: 'fade left',
      duration: '0s',
      onComplete() {},
    });
}

function showCommands() {
  if ($('.builder-wizard:visible').length)
    $('.builder-wizard').transition({
      animation: 'fade left',
      duration: '0.33s',
      onComplete: showCommandsList,
    });
  else showCommandsList();
}

function removeCommand(event, is_admin) {
  const popup = $(event.target).closest('.popup');
  const id = popup.attr('command-id');

  CommandStorage.removeCommandId(id, is_admin)
    .then(function() {
      removeCommandFromTable(popup.closest(`#${id}`));
      popup.transition('hide');
      $('body').append($('.remove-command-popup').detach());
      $(event.target).removeClass('disabled');
    })
    .catch(function(error) {
      Sentry.captureException(error);
      $(event.target).removeClass('disabled');
      $(event.target)
        .closest('.ui.button')
        .transition('shake');
    });
}

function scopeCommand(event) {
  const element = $(event.target).closest('.command');
  const id = element.attr('id');
  const btns = $('.sharing-btns');
  Analytics.sendUIEvent({
    action: 'clicked',
    actionSubject: 'button',
    actionSubjectId: 'scopeCommandButton',
    source: tabToScreenMapping[getCurrentTab().trim()],
    attributes: {
      isChecked: event.target.checked,
    },
  });

  btns.addClass('disabled');
  CommandStorage.updateCommandId(id, {
    scope: event.target.checked ? CommandStorage.ScopeTeam : CommandStorage.ScopeBoard,
  })
    .then(function(command) {
      btns.removeClass('disabled');
      updateModifiedBy(command);
    })
    .catch(function(error) {
      // Don't send the error to Sentry if it's just that the board isn't in an org
      if (error.message && error.message.indexOf('member is not in the organization') === -1) {
        Sentry.captureException(error);
      }
      btns.removeClass('disabled');
      const team = window._trello.getContext().teamsRebrand ? 'workspace' : 'team';
      $(event.target)
        .closest('.ui.checkbox')
        .checkbox(`set ${event.target.checked ? 'unchecked' : 'checked'}`)
        .attr('data-tooltip', `Board is not in a ${team}.`)
        .transition('shake');
    });

  if (event.target.checked) {
    Log.logEvent('engagement', 'team_scope_button');
  }
}

function enableCommand(event) {
  const element = $(event.target).closest('.command');
  const id = element.attr('id');
  const btns = $('.sharing-btns');
  Analytics.sendUIEvent({
    action: 'clicked',
    actionSubject: 'button',
    actionSubjectId: 'enableCommandButton',
    source: tabToScreenMapping[getCurrentTab().trim()],
    attributes: {
      isChecked: event.target.checked,
    },
  });
  btns.addClass('disabled');
  CommandStorage.enableCommandId(id, event.target.checked)
    .then(function(commands) {
      // enableCommandId can both enable and disable commands
      // We expect an array of { id: command_id } objects called commands.
      // This array tells us the commands that should still be displayed.
      // Because in an OBO context, if a premium org admin disables a user's
      // command, then they should no longer be able to see it.
      const commandStillExists = commands.find(function(item) {
        return item.id === id;
      });
      if (commandStillExists === undefined) {
        removeCommandFromTable(element);
      }
      btns.removeClass('disabled');
      applyCommandListFilter(true);
      const t = TrelloPowerUp.iframe({
        targetOrigin: 'https://trello.com',
      });
      if (t.getContext().commandSharing) {
        updateModifiedBy(commandStillExists);
      }
    })
    .catch(function(error) {
      Sentry.captureException(error);
      btns.removeClass('disabled');
      $(event.target)
        .closest('.ui.checkbox')
        .checkbox(`set ${event.target.checked ? 'unchecked' : 'checked'}`)
        .attr('data-tooltip', 'Error saving.')
        .transition('shake');
    });
}

function getRemoveCommandPopupParams() {
  return {
    popup: '.remove-command-popup',
    on: 'click',
    position: 'bottom center',
    lastResort: 'bottom left',
    boundary: '.command-list',
    duration: 0,
  };
}

let __flags = {};

function addButtonToTable(button, immediate, before_id) {
  const { is_admin } = __flags;

  const item = Generator.buttonItem(button, is_admin);

  if (!before_id) {
    item.appendTo($('.command-list'));
  } else {
    item.insertBefore($(`#${before_id}`));
  }

  updateModifiedBy(button);

  item.transition({
    animation: 'fade down',
    duration: immediate ? '0s' : '0.33s',
    onComplete() {},
  });

  item.find('.edit-command-btn').click(function() {
    // It's important to reload the command without overrides,
    // (also to refresh potential updates made in other windows).
    CommandStorage.getCommand(button.type, button.id, true).then(function(command) {
      showBuilder({ type: button.type, command });
    });
  });
  item.find('.copy-command-btn').click(function() {
    duplicateCommand({ command: button });
  });
  const popupParams = getRemoveCommandPopupParams();
  popupParams.onShow = function() {
    $(this).attr('command-id', button.id);
    // some cases Semantic does not properly move the popup
    // so we force it to always move to the correct spot
    item.find('.command-btns').after($(this).detach());
  };
  item.find('.remove-command-btn').popup(popupParams);
  item
    .find('.enable-command-tgl')
    .closest('.ui.checkbox')
    .checkbox({
      onChange() {
        enableCommand({ target: this });
      },
    });
  item
    .find('.share-command-tgl')
    .closest('.ui.checkbox')
    .checkbox({
      onChange() {
        shareCommand({ target: this });
      },
    });
  item
    .find('.scope-command-tgl')
    .closest('.ui.checkbox')
    .checkbox({
      onChange() {
        scopeCommand({ target: this });
      },
    });
  item.find('.command-log-btn').click(function() {
    updateNavigation({ action: 'log', commandId: button.id });
    CommandLog.openCommandLog(button, null, updateNavigation);
  });
}

function addCommandToTable(command, immediate, before_id, obo_writable) {
  if (command.type.indexOf('button') !== -1) {
    addButtonToTable(command, immediate, before_id);
    return;
  }

  const { is_admin } = __flags;

  const item = Generator.commandItem(command, obo_writable, is_admin);

  if (!before_id) {
    item.appendTo($('.command-list'));
  } else {
    item.insertBefore($(`#${before_id}`));
  }

  updateModifiedBy(command);

  item.transition({
    animation: 'fade down',
    duration: immediate ? '0s' : '0.33s',
    onComplete() {},
  });

  item.find('.edit-command-btn').click(function() {
    // It's important to reload the command without overrides,
    // (also to refresh potential updates made in other windows).
    CommandStorage.getCommand(command.type, command.id, true).then(function(command) {
      showBuilder({ type: command.type, command });
    });
  });
  item.find('.copy-command-btn').click(function() {
    duplicateCommand({ command });
  });
  const popupParams = getRemoveCommandPopupParams();
  popupParams.onShow = function() {
    $(this).attr('command-id', command.id);
    // some cases Semantic does not properly move the popup
    // so we force it to always move to the correct spot
    item.find('.command-btns').after($(this).detach());
  };
  item.find('.remove-command-btn').popup(popupParams);
  const t = TrelloPowerUp.iframe({
    targetOrigin: 'https://trello.com',
  });
  if (t.getContext().commandSharing) {
    setupAddCommandToBoardPopup(command, item.find('.add-to-board-btn'));
    setupEnabledOnXBoardsPopup(command, item.find('.enabled-on-x-boards'));
  } else {
    // not in command sharing so hide "Add to another board" button
    const addToBoardBtn = item.find('.add-to-board-btn');
    addToBoardBtn.addClass('disabled');
    addToBoardBtn.transition('hide');
  }

  item
    .find('.enable-command-tgl')
    .closest('.ui.checkbox')
    .checkbox({
      onChange() {
        enableCommand({ target: this });
      },
    });
  item.find('.command-log-btn').click(function() {
    updateNavigation({ tab: command.type, action: 'log', commandId: command.id });
    CommandLog.openCommandLog(command, CommandStorage.getAdminOnBehalfOf(), updateNavigation);
  });
  item.find('.run-command-btn').click(function() {
    const obo = CommandStorage.getAdminOnBehalfOf();
    TrelloPowerUp.iframe({
      targetOrigin: 'https://trello.com',
    }).boardBar({
      height: 38,
      url: `./powerup-command-runner.html?cmd=${command.id}${obo ? `&obo=${obo}` : ''}`,
    });
  });
  setupCommandLibPopup(command, item.find('.command-lib-name'));
}

function loadCommands(type, callback) {
  $('.command-list').empty();
  $('.command-list-filter').transition('hide');
  $('.command-list-error').transition('hide');
  $('.command-list-loading').transition('show');
  $('.create-command-buttons').transition('hide');
  $('.library-manage').transition('hide');
  getCommands(type)
    .then(function(result) {
      if (getCurrentTab() !== `${type}s`) {
        return; // No callback.
      }
      $('.command-list-loading').transition('hide');
      $('.create-command-buttons').transition('show');
      if (result.is_admin) {
        showAdminUI(type);
      } else {
        hideAdminUI();
      }
      __flags.is_admin = result.is_admin;
      $('.command-section .new-command-btn').transition(
        result.obo_writable === false ? 'hide' : 'show'
      );
      result.commands.forEach(function(command) {
        addCommandToTable(command, true, null, result.obo_writable);
      });
      showCommands();
      if (callback) {
        callback();
      }
    })
    .catch(function(error) {
      Sentry.captureException(error);
      $('.command-list-loading').transition('hide');
      if (error.message === 'NOT_AUTHORIZED') {
        $('.command-list-error.not-authorized').transition('show');
      } else {
        $('.command-list-error.error-loading').transition('show');
      }
    });
}

function updateCommand(
  command_id,
  type,
  text,
  { label, icon, image, enabled, close_card, boards }
) {
  const fields = {
    label,
    icon,
    image,
    cmd: text,
    enabled,
    close: close_card ? 1 : undefined,
    b: boards,
  };

  return CommandStorage.updateCommandId(command_id, fields)
    .then(function() {
      return CommandStorage.getCommands(type);
    })
    .then(function(result) {
      const { commands } = result;
      const t = TrelloPowerUp.iframe({
        targetOrigin: 'https://trello.com',
      });
      if (t.getContext().commandSharing && __flags.done) {
        // if __flags.done exists, then it went through a command sharing
        // flow and has its own Done page and shouldn't continue
        return;
      }
      showCommands();
      updateNavigation();
      sortCommands(commands);
      // It's important to reload the command to re-add any overrides before
      // adding it to the table (it's edited without overrides).
      const i = commands.findIndex(function(c) {
        return c.id === command_id;
      });
      const command = commands.splice(i, 1)[0];
      $(`#${command_id}`).remove();
      const j = commands.findIndex(function(c) {
        return c.label > label;
      });
      addCommandToTable(command, false, j === -1 ? null : commands[j].id, result.obo_writable);
      applyCommandListFilter(true);
    });
}

function appendCommand(type, text, { label, icon, image, enabled, close_card, boards }) {
  let command = {
    label,
    icon,
    image,
    cmd: text,
    type,
    shared: false,
    scope: CommandStorage.ScopeBoard,
    enabled,
    close: close_card ? 1 : undefined,
    b: boards,
  };

  return getCommands(type).then(function(result) {
    return CommandStorage.addCommand(command)
      .then(function(c) {
        command = c;
        return CommandStorage.getCommands(type);
      })
      .then(function({ commands }) {
        const t = TrelloPowerUp.iframe({
          targetOrigin: 'https://trello.com',
        });
        if (t.getContext().commandSharing && __flags.done) {
          // if __flags.done exists, then it went through a command sharing
          // flow and has its own Done page and shouldn't continue
          return;
        }

        const i = sortCommands(commands).findIndex(function(c) {
          return c.label > label;
        });
        addCommandToTable(command, false, i === -1 ? null : commands[i].id, result.obo_writable);
        showCommands();
        updateNavigation();
        Plan.getUserPlanLocal().then(({ plan_id }) => {
          Analytics.sendTrackEvent({
            action: 'created',
            actionSubject: 'command',
            source: tabToScreenMapping[getCurrentTab().trim()],
            attributes: {
              commandType: _.camelCase(command.type),
              plan: plan_id,
            },
          });
        });
        Log.logEvent('engagement', `add_command_${type}`, { type, length: text.length });
        return true;
      });
  });
}

function showAdminUI(type) {
  const dropdown = $('.admin-ui .admin-member-select');

  if (type.match(/button/)) {
    CommandStorage.setAdminOnBehalfOf();
    dropdown.dropdown({ onChange() {} }).dropdown('clear'); // Triggers onChange.
    return;
  }

  const t = TrelloPowerUp.iframe({
    targetOrigin: 'https://trello.com',
  });
  TrelloPowerUp.Promise.join(t.board('members'), t.member('all')).spread(function(board, me) {
    const menu = dropdown.find('.menu');
    menu.find('>.item').remove();
    menu.append(
      `<div class="item" data-value="${sanitize(me.id)}">` +
        `<span class="text-body">${sanitize(me.fullName)} <small>(@${sanitize(
          me.username
        )})</small></span>` +
        `</div>`
    );
    board.members.forEach(function(member) {
      if (member.id === me.id) {
        return;
      }
      menu.append(
        `<div class="item" data-value="${sanitize(member.id)}">` +
          `<span class="text-body">${sanitize(member.fullName)} (@${sanitize(
            member.username
          )})</span>` +
          `</div>`
      );
    });
    const search = menu.find('.ui.search.input');
    if (board.members.length > 9) search.show();
    else search.hide();
    dropdown.dropdown({
      onChange(value) {
        if (value === me.id) {
          value = undefined;
        }
        if (CommandStorage.getAdminOnBehalfOf() !== value) {
          CommandStorage.setAdminOnBehalfOf(value);
          loadCommands(type);
          Log.logEvent('engagement', 'admin_select');
        }
      },
    });
    $('.admin-ui').transition('show');
  });
}

/* *****************************************************************************
@
@  Builder
@
***************************************************************************** */

let __builder_init = false;

const { collectPhrase } = Builder;

function updateOutput() {
  let actionCount = $('.builder-output .item').length;

  if (__flags.has_trigger) {
    const triggers = $('.builder.triggers');
    const actions = $('.builder.actions');

    // no trigger selected yet, hide the actions and disable the save button
    if (!$('.builder-output .output-trigger .list').children().length) {
      $('.save-builder-output-btn').toggleClass('disabled', true);
      const t = TrelloPowerUp.iframe({
        targetOrigin: 'https://trello.com',
      });
      if (t.getContext().commandSharing) {
        $('.add-automation-builder-output-btn').addClass('disabled');
      }
      $('.js-empty-trigger').transition('show');
      $('.output-trigger .command-trigger').transition('hide');
      $('.output-actions').transition('hide');
      actions.transition({
        animation: 'fade down',
        duration: '0.33s',
        onComplete() {
          if (__flags.has_trigger) {
            triggers.transition('fade down');
          }
        },
      });
      return;
    }

    // we already have a trigger selected, show actions
    $('.js-empty-trigger').transition('hide');
    $('.output-trigger .command-trigger').transition('show');
    $('.output-actions').transition('show');

    actionCount -= 1;

    if (actions.hasClass('hidden')) {
      triggers.transition({
        animation: 'fade down',
        duration: '0.33s',
        onComplete() {
          actions.transition('fade down');
        },
      });
    }
  }

  const output = $('.builder-output');
  const outputActions = $('.builder-output .output-actions');
  $('.save-builder-output-btn').toggleClass('disabled', !actionCount);
  const t = TrelloPowerUp.iframe({
    targetOrigin: 'https://trello.com',
  });
  if (t.getContext().commandSharing) {
    $('.add-automation-builder-output-btn').toggleClass('disabled', !actionCount);
  } else {
    $('.builder.actions-body').transition('show');
  }
  $('.add-actions').transition('hide');
  if (!actionCount) {
    $('.first-action').transition('show');
    $('.another-action').transition('hide');
    $('.output-actions .command-actions').transition('hide');
    $('.js-empty-actions').transition('show');
  } else {
    $('.first-action').transition('hide');
    $('.another-action').transition('show');
    $('.js-empty-actions').transition('hide');
    $('.output-actions .command-actions').transition('show');
    if (output.hasClass('hidden')) {
      outputActions.transition('show');
      output.transition('fade down');
    } else if (outputActions.hasClass('hidden')) {
      outputActions.transition('fade down');
    }
  }

  if (t.getContext().commandSharing) {
    // update DOM element visibility depending on where user is in command sharing flow
    if (__flags.shareCommand) {
      $('.builder.actions-body').transition('hide');
      if (__flags.done) {
        $('.first-action').transition('hide');
        $('.js-empty-actions').transition('hide');
        $('.output-actions .command-actions').transition('hide');
        $('.builder-output .output-done-command').transition('show');
        confetti({
          angle: _.random(55, 125),
          spread: _.random(50, 70),
          particleCount: _.random(40, 75),
          origin: {
            x:
              (parseInt($('.left-pane').css('width'), 10) +
                parseInt($('.right-pane').css('padding-left'), 10)) /
              window.innerWidth,
          },
        });
      }
    } else {
      $('.builder.actions-body').transition('show');
    }
  }
}

function showTriggers(editor, output) {
  if (editor) {
    $('.js-empty-trigger').transition('show');
    $('.output-trigger .command-trigger').transition('hide');
    $('.output-actions').transition('hide');
    $('.builder.triggers').transition('show');
    $('.builder.actions').transition('hide');
  } else {
    $('.js-empty-trigger').transition('hide');
    $('.output-trigger .command-trigger').transition('show');
    $('.output-actions').transition('show');
    $('.builder.triggers').transition('hide');
    $('.builder.actions').transition('show');
  }
  if (output) {
    $('.builder-output .output-trigger').transition('show');
  } else {
    $('.builder-output .output-trigger').transition('hide');
  }
}

function moveActionBtn_click() {
  const item = this.closest('.item');
  $(item)
    .prev()
    .detach()
    .insertAfter(item);
}

function removePhraseBtn_click(event) {
  const item = $(event.target).closest('.item');
  item.transition({
    animation: 'fade down',
    duration: '0.33s',
    onComplete() {
      item.remove();
      updateOutput();
    },
  });
  $('.too-many-actions').transition('hide');
  $('.implicit-multiplier-stop').transition('hide');
}

function addTriggerToOutput(text, board) {
  const t = TrelloPowerUp.iframe({
    targetOrigin: 'https://trello.com',
  });
  if (t.getContext().commandSharing) {
    $('.list-does-not-exist-trigger').transition('hide');
  }
  const item = Generator.triggerOutput(text);
  item.appendTo($('.builder-output .output-trigger .list'));
  item
    .find('.remove-trigger-btn')
    .off('click')
    .click(removePhraseBtn_click);

  // shows appropriate warning message in command sharing flow
  // and enables board/list name editability in triggers
  const list_names = item.find('[name="list-name"]');
  if (t.getContext().commandSharing && list_names.length && board) {
    const listName = list_names.val();
    Builder.getListsByBoardId(board.id).then(function(lists) {
      const listOnBoard = lists.some(list => list.name === listName);
      if (!listOnBoard) {
        $('.list-does-not-exist-trigger')
          .html(
            `<i class="yellow warning sign icon"></i>The list <b>${sanitize(
              listName
            )}</b> does not exist on <b>${board.name}</b>. Please pick a different list.`
          )
          .transition('show');
        list_names.css('opacity', 0.4);
        Builder.setupListNameAutoComplete(list_names, {
          lists,
          clear_invalid_value: true,
          listWarning: $('.list-does-not-exist-trigger'),
        });
        list_names.addClass('quoted-value-highlighted');
        $('.prompt:first').focus();
      } else {
        Builder.setupListNameAutoComplete(list_names, {
          lists,
        });
      }
    });
  } else if (list_names.length) {
    Builder.setupListNameAutoComplete(list_names);
  }

  const board_names = item.find('[name="board-name"]');
  if (board_names.length) Builder.setupBoardNameAutoComplete(board_names, null, true);

  updateOutput();
}

function addActionToOutput(text, noUpdate, board) {
  if ($('.builder-output .output-actions .list .item').length >= 40) {
    $('.too-many-actions').transition('show');
    return;
  }
  $('.too-many-actions').transition('hide');

  if ($('.builder-output .output-actions .list .item.implicit-multiplier').length) {
    $('.implicit-multiplier-stop').transition('show');
    return;
  }
  $('.implicit-multiplier-stop').transition('hide');

  const t = TrelloPowerUp.iframe({
    targetOrigin: 'https://trello.com',
  });
  if (t.getContext().commandSharing) {
    $('.list-does-not-exist-action').transition('hide');
  }

  const item = Generator.actionOutput(noUpdate, text);

  item.appendTo($('.builder-output .output-actions .list'));
  if (!noUpdate)
    item.transition({
      animation: 'fade down',
      duration: $('.builder-output .output-actions:visible').length ? '0.33s' : '0s',
      onComplete: updateOutput,
    });
  item
    .find('.remove-action-btn')
    .off('click')
    .click(removePhraseBtn_click);
  item
    .find('.move-up-action-btn')
    .off('click')
    .click(moveActionBtn_click);

  const list_names = item.find('[name="list-name"]');
  // shows appropriate warning message in command sharing flow
  // and enables board/list name editability in actions
  if (t.getContext().commandSharing && list_names.length && board) {
    const listName = list_names.val();
    Builder.getListsByBoardId(board.id).then(function(lists) {
      const listOnBoard = lists.some(list => list.name === listName);
      if (!listOnBoard) {
        $('.list-does-not-exist-action')
          .html(
            `<i class="yellow warning sign icon"></i>The list <b>${sanitize(
              listName
            )}</b> does not exist on <b>${board.name}</b>. Please pick a different list.`
          )
          .transition('show');
        list_names.css('opacity', 0.4);
        Builder.setupListNameAutoComplete(list_names, {
          lists,
          clear_invalid_value: true,
          listWarning: $('.list-does-not-exist-action'),
        });
        list_names.addClass('quoted-value-highlighted');
        $('.prompt:first').focus();
      } else {
        Builder.setupListNameAutoComplete(list_names, {
          lists,
        });
      }
    });
  } else if (list_names.length) {
    Builder.setupListNameAutoComplete(list_names);
  }

  const board_names = item.find('[name="board-name"]');
  if (board_names.length) Builder.setupBoardNameAutoComplete(board_names, null, true);
}

function collectBuilderOutputText() {
  const phrases = [];
  $('.builder-output .output-phrase').each(function(i, phrase) {
    phrases.push(collectPhrase($(phrase)[0]).trim());
  });

  return Builder.joinCommandPhrases(phrases, __flags.has_trigger);
}

function saveBuilderOutput({ type, command, board }) {
  let isButton;
  switch (type) {
    case 'card-button':
    case 'board-button':
      isButton = true;
      break;
    default:
      break;
  }
  if (isButton && !$('.ui.form.button-config').form('is valid')) {
    return;
  }

  const text = collectBuilderOutputText();
  const label = $('.ui.form.button-config input[name="button-label"]')
    .val()
    .substring(0, 100);
  const icon = $('.ui.form.button-config .button-icon-select > i').attr('class');
  const image = $('.ui.form.button-config .button-icon-select > i').attr('data-image');
  const enabled = $('.ui.form.button-config .button-enabled').prop('checked');
  const close_card = $('.ui.form.button-config .button-close-card').prop('checked');

  const cancel_btn = $('.cancel-btn');
  cancel_btn.addClass('disabled');
  const save_btn = $('.save-builder-output-btn');
  const t = TrelloPowerUp.iframe({
    targetOrigin: 'https://trello.com',
  });
  if (t.getContext().commandSharing) {
    const addAutomationBtn = $('.add-automation-builder-output-btn');
    addAutomationBtn.addClass('disabled');
  }
  save_btn.addClass('disabled');
  const save_img = save_btn.find('i');
  const save_cls = save_img.attr('class');
  save_img.attr('class', 'notched circle loading icon');
  const reset = function(error) {
    setTimeout(function() {
      cancel_btn.removeClass('disabled');
      save_btn.removeClass('disabled');
      save_img.attr('class', save_cls);
      if (error) {
        Sentry.captureException(error);
        save_btn
          .attr(
            'data-tooltip',
            `Error saving: ${typeof error === 'object' ? error.message : error}`
          )
          .transition('shake');
      } else {
        save_btn.attr('data-tooltip', null);
      }
    }, 0);
  };

  if (command && command.id) {
    Analytics.sendUIEvent({
      action: 'clicked',
      actionSubject: 'button',
      actionSubjectId: 'saveBuilderOutputButton',
      source: tabToScreenMapping[getCurrentTab().trim()],
      attributes: {
        commandType: _.camelCase(command.type),
        idCommand: command.id,
        saveType: 'update',
      },
    });
    if (
      t.getContext().commandSharing &&
      board &&
      !command.b.some(boardId => boardId === board.id)
    ) {
      // a new board can be added to command
      command.b.push(board.id);
    }
    updateCommand(command.id, command.type, text, {
      label,
      icon,
      image,
      enabled,
      close_card,
      boards: command.b,
    })
      .then(function() {
        reset();
      })
      .catch(reset);
  } else {
    Analytics.sendUIEvent({
      action: 'clicked',
      actionSubject: 'button',
      actionSubjectId: 'saveBuilderOutputButton',
      source: tabToScreenMapping[getCurrentTab().trim()],
      attributes: {
        commandType: _.camelCase(type),
        idCommand: '',
        saveType: 'new',
      },
    });

    appendCommand(type, text, {
      label,
      icon,
      image,
      enabled,
      close_card,
      boards: board ? [board.id] : undefined,
    })
      .then(function() {
        reset();
      })
      .catch(reset);
  }
  confetti({
    angle: _.random(55, 125),
    spread: _.random(50, 70),
    particleCount: _.random(40, 75),
  });
}

function splitCommandPhrases(cmd) {
  const and = 'and ';
  return cmd.split(',\n').map(function(a) {
    return a.substr(0, and.length) === and ? a.substr(and.length) : a;
  });
}

function resetBuilder({ command, suggestion, duplicate, share, done, board }) {
  $('.ui.form.button-config').form('clear');
  $('.ui.form.button-config .button-enabled').prop('checked', true);
  $('.phrase input.error').removeClass('error');
  $('.builder-output .list').empty();
  $('.js-empty-trigger').transition('show');
  $('.js-empty-actions').transition('show');
  $('.add-actions').transition('show');
  $('.actions-body').transition('hide');
  $('.add-triggers').transition('show');
  $('.triggers-body').transition('hide');
  $('.output-actions .command-trigger').transition('hide');
  $('.output-actions .command-actions').transition('hide');
  $('.save-builder-output-btn').toggleClass('disabled', true);
  $('.save-builder-output-btn').transition('show');
  $('.cancel-btn').transition('show');
  $('.another-action').transition('hide');
  $('.builder-output .output-done-command').transition('hide');
  $('.add-automation-builder-output-btn').transition('hide');
  $('.back-to-rules-btn').transition('hide');
  $('.add-automation-builder-output-btn').toggleClass('disabled', true);

  if (command) {
    let { label } = command;
    if (label && duplicate) label += ' (copy)';
    $('.ui.form.button-config input[name="button-label"]').val(label);
    $('.ui.form.button-config .button-enabled').prop('checked', command.enabled);
    $('.ui.form.button-config .button-close-card').prop('checked', command.close);
    const selectedIcon = $('.ui.form.button-config .button-icon-select .menu i')
      .removeClass('selected')
      .filter(`[data-image="${command.image}"]`)
      .addClass('selected');
    if (selectedIcon.length)
      $('.ui.form.button-config .button-icon-select > i').replaceWith(selectedIcon.clone());
  }

  const phrases = command ? splitCommandPhrases(command.cmd) : suggestion ? suggestion.cmd : [];
  if (__flags.has_trigger) {
    if (phrases.length) {
      addTriggerToOutput(phrases.shift(), board);
      showTriggers(false, true);
    } else {
      showTriggers(true, true);
    }
  } else {
    showTriggers(false, false);
  }

  const t = TrelloPowerUp.iframe({
    targetOrigin: 'https://trello.com',
  });
  if (t.getContext().commandSharing) {
    // update appropriate DOM elements for command sharing flow
    if (share) {
      $('.save-builder-output-btn').transition('hide');
      $('.cancel-btn').transition('hide');
      $('.add-automation-builder-output-btn').transition('show');
    }
    if (done) {
      $('.add-automation-builder-output-btn').transition('hide');
      $('.back-to-rules-btn').transition('show');
      showTriggers(false, false);
      $('.builder-output .output-actions').transition('hide');

      $('.js-done-command').text(done.cmd);
      $('.js-done-command-board').html(`was added to <b>${board.name}</b>`);
    } else {
      phrases.forEach(phrase => addActionToOutput(phrase, false, board));
    }
  } else {
    phrases.forEach(addActionToOutput);
  }
}

function initBuilder({ type, share, done }) {
  __flags = {};
  let headerText = '';

  switch (type) {
    case 'card-button':
      headerText = 'Create a Card Button';
      __flags.has_trigger = false;
      break;
    case 'board-button':
      headerText = 'Create a Board Button';
      __flags.has_trigger = false;
      break;
    case 'rule':
      headerText = 'Create a Rule';
      __flags.has_trigger = true;
      break;
    case 'schedule':
      headerText = 'Create a Schedule Command';
      __flags.has_trigger = true;
      break;
    case 'on-date':
      headerText = 'Create a Due Date Command';
      __flags.has_trigger = true;
      break;
    default:
      break;
  }

  const t = TrelloPowerUp.iframe({
    targetOrigin: 'https://trello.com',
  });
  if (t.getContext().commandSharing) {
    // share and done are screens for command sharing flow
    if (share) {
      headerText = 'Review your automation';
      __flags.shareCommand = true;
    }
    if (done) {
      headerText = 'Done!';
      __flags.done = true;
    }
  }
  $('.create-header').text(headerText);

  if (__builder_init) {
    return;
  }

  if (!__flags.has_trigger) {
    $('.add-triggers').transition('hide');
  }

  __builder_init = true;

  $('.builder-start-hidden').transition('hide');
  $('.builder-tabs .item').tab({
    onFirstLoad() {
      Builder.setupDropdowns(this);
    },
  });
  Builder.setupDropdowns('.builder .ui.tab.active'); // No onFirstLoad event for already active tabs.

  $('.user-timezone').text(moment.tz.guess());

  Builder.setupClauses();
  Builder.setupInputFields('.builder');
  Builder.setupPowerUpAutoComplete('.builder');

  $('#builder-open-help').popup({
    on: 'click',
    inline: false,
    popup: $('.builder-help'),
    position: 'top right',
    lastResort: 'top right',
    hoverable: false,
  });
  $('.builder-example')
    .click(function() {
      return false;
    })
    .each(function(i, element) {
      const target = $(element);
      const popup = target.next('.ui.popup');
      $(element).popup({
        on: 'click',
        popup,
        target: target.length ? target : false,
        position: 'top center',
        lastResort: true,
        hoverable: false,
        boundary: '.builder-wizard-body',
      });
    });

  $('.builder-advanced-toggle').checkbox({
    onChecked() {
      t.set('member', 'private', 'advanced', true);
      $('.builder-basic')
        .addClass('hidden')
        .hide();
      $('.builder-advanced')
        .removeClass('hidden')
        .show();
    },
    onUnchecked() {
      t.set('member', 'private', 'advanced', false);
      $('.builder-basic')
        .removeClass('hidden')
        .show();
      $('.builder-advanced')
        .addClass('hidden')
        .hide();
    },
  });
  $('.builder-basic')
    .removeClass('hidden')
    .show();
  $('.builder-advanced')
    .addClass('hidden')
    .hide();
  $('.builder-advanced-toggle').checkbox('set unchecked');
  t.get('member', 'private', 'advanced').then(function(enabled) {
    if (enabled) {
      $('.builder-basic')
        .addClass('hidden')
        .hide();
      $('.builder-advanced')
        .removeClass('hidden')
        .show();
      $('.builder-advanced-toggle').checkbox('set checked');
    } else {
      $('.builder-basic')
        .removeClass('hidden')
        .show();
      $('.builder-advanced')
        .addClass('hidden')
        .hide();
      $('.builder-advanced-toggle').checkbox('set unchecked');
    }
  });

  $('.builder-show-more-content').hide();
  $('.builder-show-more').click(function() {
    $('.builder-show-more').hide();
    $('.builder-show-more-content').show();
    return false;
  });

  $('.triggers .phrase').prepend(
    '<div class="ui green icon right floated button select-trigger-btn" tabindex="0"><i class="plus icon"></i></div>'
  );
  $('.actions .phrase').prepend(
    '<div class="ui green icon right floated button select-action-btn" tabindex="0"><i class="plus icon"></i></div>'
  );

  $('.select-trigger-btn').click(function(event) {
    const errors = $(event.target)
      .closest('.phrase')
      .find('input[type="text"]:not(.optional):visible')
      .filter(function() {
        return !this.value;
      })
      .addClass('error')
      .off('focus')
      .focus(function() {
        $(this).removeClass('error');
      });
    if (errors.length) return;
    const phrase = $(event.target).closest('.phrase');
    const text = collectPhrase(phrase[0]).split('\n');
    text.slice(1).forEach(function(action) {
      addActionToOutput(action, true);
    });
    const { top } = $('.builder-wizard').offset();
    if (top < $('html').scrollTop()) $('html,body').animate({ scrollTop: top }, 'slow');
    addTriggerToOutput(text[0]);
  });

  $('.select-action-btn').click(function(event) {
    const errors = $(event.target)
      .closest('.phrase')
      .find('input[type="text"]:not(.optional):visible')
      .filter(function() {
        return !this.value;
      })
      .addClass('error')
      .off('focus')
      .focus(function() {
        $(this).removeClass('error');
      });
    if (errors.length) return;
    const phrase = $(event.target).closest('.phrase');
    const text = collectPhrase(phrase[0]);
    const { top } = $('.builder-wizard').offset();
    if (top < $('html').scrollTop()) $('html,body').animate({ scrollTop: top }, 'slow');
    addActionToOutput(text);
    $('.select-action-btn').blur();
  });
}

function showBuilder({ type, command, suggestion, duplicate, share, done, board }) {
  initBuilder({ type, share, done });
  // we don't want the popup to be wiped when showing builder
  // so extract the popup out before that
  $('body').append($('.remove-command-popup').detach());
  const t = TrelloPowerUp.iframe({
    targetOrigin: 'https://trello.com',
  });
  if (t.getContext().commandSharing) {
    $('body').append($('.add-command-to-board-popup').detach());
    $('body').append($('.enabled-on-x-boards-popup').detach());
  }
  if (command && command.id) {
    if (t.getContext().commandSharing && share) {
      updateNavigation({ action: 'share', commandId: command.id });
    } else {
      updateNavigation({ action: 'edit', commandId: command.id });
    }
  } else if (command) {
    updateNavigation({
      action: 'new',
      newCommand: command.cmd,
      newIcon: command.image,
      newLabel: command.label,
    });
  } else {
    updateNavigation({ action: 'new' });
  }

  if (!suggestion)
    $('.builder .cancel-btn, .builder-wizard .cancel-btn')
      .off('click')
      .click(function() {
        showCommands();
        updateNavigation();
      });
  else
    $('.builder .cancel-btn, .builder-wizard .cancel-btn')
      .off('click')
      .click(function() {
        showCommands();
        loadSuggestions();
      });

  const already_visible = $('.builder-wizard:visible').length;

  const startBuilder = function() {
    resetBuilder({ command, suggestion, duplicate, share, done, board });

    if (!already_visible) {
      // Need to change the completion handler, which is stored
      // with the element. Using 'show' as the animation in
      // order to specify a new handler doesn't seem to work,
      // so just using a zero-length animation.
      $('.builder-wizard').transition({
        animation: 'fade right',
        duration: '0s', // Immediate.
        onComplete() {},
      });
    }

    $('.add-automation-builder-output-btn')
      .off('click')
      .click(function() {
        Analytics.sendUIEvent({
          action: 'clicked',
          actionSubject: 'button',
          actionSubjectId: 'addAutomationButton',
          source: 'adjustYourAutomationScreen',
        });
        const text = collectBuilderOutputText();
        saveBuilderOutput({ type, command: text === command.cmd ? command : undefined, board });
        showBuilder({
          type,
          command,
          suggestion,
          duplicate,
          share,
          done: { cmd: text },
          board,
        });
      });

    $('.back-to-rules-btn')
      .off('click')
      .click(function() {
        Analytics.sendUIEvent({
          action: 'clicked',
          actionSubject: 'button',
          actionSubjectId: 'backToRulesButton',
          source: 'reviewYourAutomationScreen',
        });
        const commandType = getCurrentTab().replace(/s$/, '');
        return getCommands(commandType).then(function({ commands }) {
          __flags.share = undefined;
          __flags.done = undefined;
          showCommands();
          updateNavigation();
          updateModifiedBy(command);
          sortCommands(commands);
        });
      });

    $('.save-builder-output-btn')
      .off('click')
      .click(function() {
        if (duplicate) {
          saveBuilderOutput({ type });
        } else if (
          command &&
          command.b &&
          (command.b.length > 1 || (command.b.length === 1 && !command.enabled))
        ) {
          $('#butler-confirm-edit-command')
            .modal({
              onApprove() {
                saveBuilderOutput({ type, command });
              },
              onDeny() {
                saveBuilderOutput({ type });
              },
            })
            .modal('show');
        } else {
          saveBuilderOutput({ type, command });
        }
      });
  };

  if (already_visible) {
    startBuilder();
  } else {
    $('.command-section').transition({
      animation: 'fade right',
      duration: '0.33s',
      onComplete: startBuilder,
    });
  }
}

function openNewCommand() {
  const type = getCurrentTab().replace(/s$/, '');
  return getCommands(type).then(function() {
    __flags.share = undefined;
    __flags.done = undefined;
    showBuilder({ type });
  });
}

function initCommandList() {
  $('.command-section .new-command-btn').click(function() {
    openNewCommand().then(() => {
      const type = getCurrentTab().replace(/s$/, '');
      Analytics.sendUIEvent({
        action: 'clicked',
        actionSubject: 'button',
        actionSubjectId: 'newCommandButton',
        source: tabToScreenMapping[getCurrentTab().trim()],
        attributes: {
          commandType: _.camelCase(type),
        },
      });
    });
  });

  $('.ui.form.button-config').form({
    fields: {
      'button-label': 'empty',
    },
    on: 'blur',
  });

  $('.button-icon-select').dropdown({
    onChange(value) {
      $(this)
        .find('>i')
        .replaceWith($(value));
    },
  });
}

/** ****************************************************************************
@
@  Suggestions
@
***************************************************************************** */

function updateShowDiscarded() {
  const discarded = $('.discarded-suggestion').length;
  if (!discarded) {
    return $('.discarded-suggestions').transition('hide');
  }

  $('.discarded-suggestions-count').text(discarded);
  $('.discarded-suggestions-btn')
    .off('click')
    .click(function() {
      $('.discarded-suggestions').transition('scale');
      $('.discarded-suggestion').transition('scale');
      return false;
    });
  $('.discarded-suggestions').transition('show');
}

function acceptSuggestion(suggestion, element) {
  const button = element.find('.accept-suggestion-btn');
  button.addClass('disabled');
  const icon = button.children('i');
  const cl = icon.attr('class');
  icon.attr('class', 'notched circle loading icon');
  Suggestions.accept(suggestion)
    .then(function() {
      element.transition('scale');
      element.removeClass('discarded-suggestion'); // In case it had been discarded before.
      icon.attr('class', cl);
      button.removeClass('disabled');
      let type = suggestion.type || 'card';
      switch (type) {
        case 'board':
        case 'card':
          type += '-button';
          break;
        default:
          break;
      }

      Analytics.sendTrackEvent({
        action: 'accepted',
        actionSubject: 'suggestion',
        source: tabToScreenMapping[getCurrentTab().trim()],
        attributes: {
          suggestionType: suggestion.type || 'card',
          admin: suggestion.admin,
          utility: suggestion.utility,
        },
      });
      loadCommandsTab(type, function() {
        showBuilder({ type, suggestion });
      });
    })
    .catch(function() {
      icon.attr('class', 'yellow warning sign icon');
      button.transition('shake');
      button.attr('data-tooltip', 'Error contacting server. Press to retry.');
      button.removeClass('disabled');
    });
  Log.logEvent('engagement', 'accept_suggestion', {
    utility: suggestion.utility,
    admin: suggestion.admin,
  });
}

function discardSuggestion(suggestion, element) {
  const button = element.find('.discard-suggestion-btn');
  button.addClass('disabled');
  const icon = button.children('i');
  const cl = icon.attr('class');
  icon.attr('class', 'notched circle loading icon');
  Suggestions.discard(suggestion)
    .then(function() {
      element.transition('scale');
      element.addClass('discarded-suggestion');
      icon.attr('class', cl);
      button.removeClass('disabled');
      Analytics.sendTrackEvent({
        action: 'discarded',
        actionSubject: 'suggestion',
        source: tabToScreenMapping[getCurrentTab().trim()],
        attributes: {
          suggestionType: suggestion.type || 'card',
          admin: suggestion.admin,
          utility: suggestion.utility,
        },
      });
      updateShowDiscarded();
    })
    .catch(function() {
      icon.attr('class', 'yellow warning sign icon');
      button.transition('shake');
      button.attr('data-tooltip', 'Error contacting server. Press to retry.');
      button.removeClass('disabled');
    });
  Log.logEvent('engagement', 'discard_suggestion', {
    utility: suggestion.utility,
    admin: suggestion.admin,
  });
}

function addSuggestionToTable(suggestion, hidden) {
  let label;
  let has_trigger;
  switch (suggestion.type) {
    case 'rule':
      has_trigger = true;
      label = 'Rule';
      break;
    case 'schedule':
      has_trigger = true;
      label = 'Scheduled (Calendar)';
      break;
    case 'on-date':
      has_trigger = true;
      label = 'Scheduled (Due Date)';
      break;
    case 'board':
      has_trigger = false;
      label = 'Board Button';
      break;
    default:
      has_trigger = false;
      label = 'Card Button';
      break;
  }

  // prettier-ignore
  const item = $(
    `<div class="ui grid transition suggestion ${((suggestion.user_action || {}).value === 'discard'
      ? ' discarded-suggestion hidden'
      : hidden
      ? ' hidden-suggestion hidden'
      : '')}">
      <div class="two column paddingless row">
        <div class="flex paddingless column">
          <div class="ui labeled icon limited button tip">
            <img class="icon-sm" src="img/sparkle.svg">
            <div>
              ${sanitize(label)}
            </div>
          </div>
        </div>
        <div class="flex paddingless column float right aligned actions">
          <div class="ui button discard-suggestion-btn${(suggestion.admin ? ' disabled' : '')}">
            <div class="img-wrapper">
              <img src="img/trash.svg">
            </div>
          </div>
          <div class="ui green button accept-suggestion-btn flex">
            <div>
              + Add
            </div>
          </div>
        </div>

      </div>
      <div class="one column paddingless row">
        <div class="column code-area">${sanitize(Builder.joinCommandPhrases(suggestion.cmd, has_trigger))}</td>
      </div>
      <div class="one column left aligned paddingless row">
        <div class="column left aligned modified-by-container">
          <div class="modified-by">
            ${sanitize(
              suggestion.admin
                ? 'Recommended by a system administrator.'
                : `Performed ${suggestion.count} times, most recently ${moment(suggestion.until).fromNow()}.`
            ) +
            sanitize(
              (suggestion.user_action || {}).value === 'discard'
                ? `Discarded ${moment(suggestion.user_action.date).fromNow()}.`
                : ''
            )}
          </div>
        </div>
      </div>
    </div>
  `);

  item.appendTo($('.suggestion-list'));

  item.find('.accept-suggestion-btn').click(function() {
    acceptSuggestion(suggestion, item);
  });
  item.find('.discard-suggestion-btn').click(function() {
    discardSuggestion(suggestion, item);
  });
}

function requestSuggestions(refresh) {
  $('.suggestion-list').empty();
  $('.butler-no-suggestions').transition('hide');
  $('.butler-no-more-suggestions').transition('hide');
  $('.butler-refresh-wait').transition('hide');
  $('.discarded-suggestions').transition('hide');
  $('.more-suggestions').transition('hide');
  $('.butler-error-loading-suggestions').transition('hide');
  $('.butler-suggestions-loading').transition('show');
  $('.refresh-suggestions-btn').addClass('disabled');
  const t = TrelloPowerUp.iframe({
    targetOrigin: 'https://trello.com',
  });
  TrelloPowerUp.Promise.join(
    Suggestions.getSuggestions(t, refresh),
    CommandStorage.getAllCommands()
  )
    .spread(function(suggestion_data, { commands }) {
      if (suggestion_data.admin_suggestions) {
        suggestion_data.suggestions = [].concat(
          suggestion_data.admin_suggestions,
          suggestion_data.suggestions
        );
        delete suggestion_data.admin_suggestions;
      }
      const dateLastSeen = new Date().toISOString();
      const { since, suggestions, suggestionDataToCache } = Suggestions.processSuggestionData(
        suggestion_data,
        commands,
        dateLastSeen
      );
      $('.butler-suggestions-loading').transition('hide');
      $('.refresh-suggestions-btn').removeClass('disabled');

      if (!suggestions.length) {
        $('.butler-no-suggestions').transition('slide down');
        if (suggestionDataToCache) {
          suggestionDataToCache.dateLastSeen = dateLastSeen;
          return t.set('board', 'private', 'suggestions', suggestionDataToCache);
        }
      } else {
        if (suggestion_data.refresh_wait) {
          $('.suggestions-refresh-wait').text(moment(suggestion_data.refresh_wait).fromNow(true));
          $('.butler-refresh-wait').transition('slide down');
        }
        $('.suggestions-date').text(moment(suggestionDataToCache.dateLastUpdate).fromNow());
        $('.suggestions-action-count').text(suggestion_data.action_count);
        $('.suggestions-since').text(` in the last ${since}`);
        $('.suggestions-header').transition('show');

        let shown = 0;
        let hidden = 0;
        suggestions.forEach(function(suggestion) {
          if ((suggestion.user_action || {}).value === 'discard') {
            addSuggestionToTable(suggestion);
          } else if (shown >= 5) {
            hidden += 1;
            addSuggestionToTable(suggestion, true);
          } else {
            shown += 1;
            addSuggestionToTable(suggestion);
          }
        });

        if (!shown) {
          $('.butler-no-more-suggestions').transition('slide down');
        }

        if (hidden > 0) {
          $('.more-suggestions-count').text(hidden);
          $('.more-suggestions-btn')
            .off('click')
            .click(function() {
              $('.more-suggestions').transition('scale');
              $('.hidden-suggestion').transition('scale');
              return false;
            });
          $('.more-suggestions').transition('show');
        }

        updateShowDiscarded();
        if (suggestionDataToCache) {
          suggestionDataToCache.dateLastSeen = dateLastSeen;
          return t.set('board', 'private', 'suggestions', suggestionDataToCache);
        }
      }
    })
    .then(function() {
      // Cached the last visit they had to the suggestions page.
      Suggestions.setSuggestionTabUnseenCount(t);
    })
    .catch(function(error) {
      Sentry.captureException(error);
      if (error.message === 'INVALID_TOKEN' || error.message === 'USER_NOT_FOUND') {
        return Auth.reauthorize(t).then(function() {
          loadCommandsTab('card-button');
        });
      }
      $('.butler-suggestions-loading').transition('hide');
      $('.refresh-suggestions-btn').removeClass('disabled');
      $('.butler-error-loading-suggestions').transition('slide down');
    });

  Log.logEvent('engagement', refresh ? 'refresh_suggestions' : 'load_suggestions');
}

function loadSuggestions() {
  // How many unseen suggestions were there when they clicked the suggestions tab
  const numUnseenSuggestions = parseInt($('.unseen-suggestion-count').text() || '0', 10);
  Analytics.sendScreenEvent({
    name: 'butlerSuggestionsScreen',
    attributes: {
      numUnseenSuggestions,
    },
  });

  $('.refresh-suggestions-btn')
    .off('click')
    .click(function() {
      requestSuggestions(true);
    });

  showTab('suggestions', true);
  updateNavigation();
  requestSuggestions(false);
}

/** ****************************************************************************
@
@  Bot Command Importer
@
***************************************************************************** */
function loadImportableCommands() {
  const t = TrelloPowerUp.iframe({
    targetOrigin: 'https://trello.com',
  });
  function showBotImporterModal(commands) {
    const command_list = commands;
    let imported = false;
    const modal = $('#butler-command-importer-modal');
    const importable_commands = modal.find('.js-importable-commands');
    modal.modal({
      selector: { close: '.right.corner.label' },
      onHide() {
        importable_commands.empty();
        if (imported) {
          // clear the cached server commands so that we are forced to refresh
          // them upon import of a command
          CommandStorage.clearCachedServerCommands();
          const curTab = getCurrentTab();
          loadCommandsTab(curTab[curTab.length - 1] === 's' ? curTab.slice(0, -1) : curTab);
          imported = false;
        }
      },
    });
    modal.modal('show');
    importable_commands.empty();

    const type_title_mapping = {
      rules: 'Rules',
      due_date: 'Due Date Commands',
      calendar: 'Scheduled Commands',
      non_importable: 'Non-Importable Commands',
    };

    function removeImportedCommand(ccid, type) {
      if (command_list[type]) {
        command_list[type] = command_list[type].filter(function(cmd) {
          return cmd.ccid !== ccid;
        });
        // Set imported to true so that when we exit the modal we know if we
        // need to fetch the updated commands from the server
        imported = true;
      }
    }

    function importCommand(command, element, type) {
      element.find('.command-import-btn').transition('hide');
      element.find('.import-loading-icon').transition('show');
      Auth.getToken(t)
        .then(function(token) {
          return new TrelloPowerUp.Promise(function(resolve, reject) {
            const board_id = t.getContext().board;
            $.ajax(`${kApiEndpoint}bot-command-import`, {
              type: 'POST',
              headers: { 'X-Butler-Trello-Token': token },
              data: JSON.stringify({
                board_id,
                cmd: command.cmd,
                ccid: command.ccid,
              }),
            })
              .done(function(response) {

                if (!response.success) {
                  return reject(new Error(response.error || 'NO_RESPONSE'));
                }
                return resolve(response.response);
              })
              .fail(function() {
                return reject(new Error('NETWORK_ERROR'));
              });
          });
        })
        .then(function(response) {
          element.find('.import-loading-icon').transition('hide');
          element.find('.import-success-icon').transition('show');
          element.transition({
            animation: 'fade down',
            duration: '1.13s',
            onComplete() {
              element.remove();
              if (command_list[type].length === 0) {
                $(`.table.${type}`).transition('hide');
              }
              if (
                !$('.rules-data-rows').children().length &&
                !$('.due_date-data-rows').children().length &&
                !$('.calendar-data-rows').children().length
              ) {
                $('.empty-list').transition('show');
              }
            },
          });
          if (response.ccid) {
            removeImportedCommand(response.ccid, type);
          }
        })
        .catch(function(error) {
          element.find('.import-loading-icon').transition('hide');
          element
            .find('.command-import-btn')
            .attr('data-tooltip', error || 'NO_RESPONSE')
            .attr('alt', error)
            .transition('shake');
          element.find('.command-archive-btn').transition('show');
          console.log('Error importing command', error);
          Sentry.captureException(error);
        });
    }

    function archiveCommand(command, element, type) {
      element.find('.command-archive-btn').transition('hide');
      element.find('.import-loading-icon').transition('show');
      Auth.getToken(t)
        .then(function(token) {
          return new TrelloPowerUp.Promise(function(resolve, reject) {
            const board_id = t.getContext().board;
            $.ajax(`${kApiEndpoint}bot-command-archive`, {
              type: 'POST',
              headers: { 'X-Butler-Trello-Token': token },
              data: JSON.stringify({
                board_id,
                cmd: command.cmd,
                ccid: command.ccid,
              }),
            })
              .done(function(response) {

                if (!response.success) {
                  return reject(new Error(response.error || 'NO_RESPONSE'));
                }
                return resolve(response.response);
              })
              .fail(function() {
                return reject(new Error('NETWORK_ERROR'));
              });
          });
        })
        .then(function(response) {
          element.find('.import-loading-icon').transition('hide');
          element.find('.import-success-icon').transition('show');
          element.transition({
            animation: 'fade down',
            duration: '1.13s',
            onComplete() {
              element.remove();
              if (command_list[type].length === 0) {
                $(`.table.${type}`).transition('hide');
              }
              if (
                !$('.rules-data-rows').children().length &&
                !$('.due_date-data-rows').children().length &&
                !$('.calendar-data-rows').children().length
              ) {
                $('.empty-list').transition('show');
              }
            },
          });
          if (response.ccid) removeImportedCommand(response.ccid, type);
        })
        .catch(function(error) {
          element.find('.import-loading-icon').transition('hide');
          element
            .find('.command-archive-btn')
            .attr('data-tooltip', error)
            .attr('alt', error)
            .transition('shake');
          console.log('Error archiving bot command', error);
          Sentry.captureException(error);
        });
    }

    function addCommands(type) {
      const add_command_list = command_list[type] || [];
      const table = $(
        `${'<table class="ui unstackable table '}${sanitize(type)}">
          <thead><tr>
          <th>${sanitize(type_title_mapping[type])}</th>
          <th class="right aligned"></th></tr></thead>
          <tbody class="${sanitize(type)}-data-rows">
          </tr></tbody>
          </table>`
      );
      add_command_list.forEach(function(command, i) {
        let item = `<tr><td data-index="${sanitize(i)}">${sanitize(command.cmd)}</td>`;
        item += '<td class="right aligned">';
        if (type !== 'non_importable') {
          // Only add an import button for importable commands
          item +=
            '<div class="ui transparent icon button command-import-btn" tabindex="0" alt="Import command" data-tooltip="Import command"><i class="download icon"></i></div>';
        }

        // Making the loading and success states `disabled buttons`
        // causes them to line up nicely
        item +=
          '<div class="ui transparent icon disabled button import-loading-icon transition hidden" tabindex="0"><i class="blue notched circle loading icon"></i></div>';
        item +=
          '<div class="ui transparent icon disabled button import-success-icon transition hidden" tabindex="0"><i class="checkmark icon"></i></div>';

        item +=
          '<div class="ui transparent icon button command-archive-btn" tabindex="0" alt="Archive command" data-tooltip="Archive command"><i class="archive icon"></i></div>';
        item += '</td></tr>';

        const element = $(item);
        element.appendTo(table.find(`.${sanitize(type)}-data-rows`));

        if (type !== 'non_importable') {
          element.find('.command-import-btn').click(function() {
            importCommand(command, element, type);
          });
        }
        element.find('.command-archive-btn').click(function() {
          archiveCommand(command, element, type);
        });
      });
      table.appendTo($('.js-importable-commands'));
      if (!add_command_list.length) {
        $(`.table.${type}`).transition('hide');
      }
    }

    addCommands('rules');
    addCommands('due_date');
    addCommands('calendar');
    addCommands('non_importable');
    if (
      !command_list.rules.length &&
      !command_list.due_date.length &&
      !command_list.calendar.length
    )
      modal.find('.empty-list').transition('show');
    modal.modal('refresh');
  }

  Auth.getToken(t)
    .then(function(token) {
      return new TrelloPowerUp.Promise(function(resolve, reject) {
        const board_id = t.getContext().board;
        $.ajax(`${kApiEndpoint}importable-commands?b=${board_id}`, {
          type: 'GET',
          headers: { 'X-Butler-Trello-Token': token },
        })
          .done(function(response) {
            if (!response.success) {
              return reject(new Error(response.error || 'NO_RESPONSE'));
            }
            return resolve(response.response);
          })
          .fail(function() {
            return reject(new Error('NETWORK_ERROR'));
          });
      });
    })
    .then(function(response) {
      const commands = response || {
        rules: [],
        calendar: [],
        due_date: [],
        non_importable: [],
      };
      if (
        commands.rules.length ||
        commands.calendar.length ||
        commands.due_date.length ||
        commands.non_importable.length
      ) {
        $('.butler-bot-command-import-btn')
          .off('click')
          .click(function() {
            showBotImporterModal(commands);
            return false;
          });
        $('.butler-importable-commands').transition('show');
      }
    })
    .catch(function(error) {
      if (error.message !== 'NOT_AUTHORIZED') {
        console.log('Error fetching importable commands', error);
        Sentry.captureException(error);
      }
    });
}

/** ****************************************************************************
@
@  Sharing
@
***************************************************************************** */

function showLibraryImportModal(link_id) {
  const modal = $('#butler-library-import-modal');
  const command_list = modal.find('.library-command-list');
  const import_btn = modal.find('> .actions .ok');
  let import_success = false;

  import_btn.addClass('disabled');
  modal
    .find('> .content > .message')
    .transition('hide')
    .filter('.updating')
    .transition('show');
  modal.find('.library-command-list').empty();

  modal.modal({
    transition: 'fade',
    selector: { close: '.right.corner.label' },
    onHide() {
      command_list.empty();
      if (import_success) {
        const type = getCurrentTab().replace(/s$/, '');
        loadCommands(type);
      }
    },
    onApprove() {
      modal.find('> .content > .updating.message').transition('hide');
      modal.find('> .content > .importing.message').transition('show');
      modal.find('> .content > .error-importing.message').transition('hide');
      modal.find('> .content > .message.error-share-access').transition('hide');
      import_btn.addClass('disabled');
      CommandStorage.importLibrary(link_id)
        .then(function() {
          modal.find('> .content > .importing.message').transition('hide');
          modal.find('> .content > .success-importing.message').transition('show');
          import_success = true;
          Log.logEvent('engagement', 'lib_import');
        })
        .catch(function(error) {
          Sentry.captureException(error);
          import_btn.removeClass('disabled');
          modal.find('> .content > .importing.message').transition('hide');
          if (error && error.message === 'LIBRARY_SHARE_INVALID') {
            modal.find('> .content > .message.error-share-access').transition('show');
          } else {
            modal.find('> .content > .error-importing.message').transition('show');
          }
        });
      return false;
    },
  });
  modal.modal('show');

  CommandStorage.getSharedLibrary(link_id)
    .then(function(lib) {
      command_list.empty();

      let html = `${'<table class="ui unstackable table">' +
        '<thead><tr>' +
        '<th><i class="tag icon"></i>'}${sanitize(lib.title)}</th></tr></thead><tbody>`;

      lib.cmds.forEach(function(command) {
        const cmd = command.cmd.replace(/\n/g, ' ');
        html += `<tr><td class="code-area">${sanitize(cmd)}</td></tr>`;
      });

      html += '</tbody></table>';

      command_list.html(html);

      setTimeout(function() {
        modal.find('> .content > .updating.message').transition('hide');
      });
      modal.modal('refresh');
      import_btn.removeClass('disabled');
    })
    .catch(function(error) {
      Sentry.captureException(error);
      modal.find('> .content > .message.updating').transition('hide');
      if (error && error.message === 'LIBRARY_SHARE_INVALID') {
        modal.find('> .content > .message.error-share-access').transition('show');
      } else {
        modal.find('> .content > .message.error-updating').transition('show');
      }
    });
}

function getLibraries() {
  const t = TrelloPowerUp.iframe({
    targetOrigin: 'https://trello.com',
  });
  const member_id = CommandStorage.getAdminOnBehalfOf() || t.getContext().member;

  return TrelloPowerUp.Promise.join(
    CommandStorage.getAllCommands(),
    CommandStorage.getSharedLibraries()
  ).spread(function(result, shared_libs) {
    const { commands, obo_writable } = result;
    const user_libs_by_name = {};
    const other_libs_by_name = {};
    let libs = shared_libs.map(function(lib) {
      if (lib.user_id === member_id) {
        lib.is_own = true;
        lib.count = 0;
        lib.enabled = 0;
        user_libs_by_name[lib.title] = lib;
      } else {
        other_libs_by_name[lib.title] = lib;
      }
      return lib;
    });

    commands.forEach(function(command) {
      if (!command.lib) {
        return;
      }
      let lib = user_libs_by_name[command.lib];
      if (!lib) {
        lib = {
          user_id: member_id,
          title: command.lib,
          is_own: true,
          count: 0,
          enabled: 0,
          src: other_libs_by_name[command.lib],
        };
        user_libs_by_name[command.lib] = lib;
        if (lib.src) lib.src.used = true;
        libs.push(lib);
      }
      ++lib.count;
      if (command.enabled) {
        ++lib.enabled;
      }
    });

    libs = libs.filter(function(lib) {
      return !lib.used;
    });

    libs.sort(function(a, b) {
      if (a.is_own && !b.is_own) {
        return -1;
      }
      if (!a.is_own && b.is_own) {
        return 1;
      }
      return a.title.localeCompare(b.title);
    });

    return {
      libs,
      obo_writable,
    };
  });
}

function shareLibrary(event, lib) {
  const btn = $(event.target);
  const share = event.target.checked;

  btn.addClass('disabled');

  (share ? CommandStorage.startSharing(lib.title) : CommandStorage.stopSharing(lib))
    .then(function(new_lib) {
      btn.removeClass('disabled');
      if (share) {
        lib.link_id = new_lib.link_id;
        lib.org_id = new_lib.org_id;
      } else {
        delete lib.link_id;
        delete lib.org_id;
      }
      Log.logEvent('engagement', 'lib_share', share);
    })
    .catch(function(error) {
      Sentry.captureException(error);
      btn.removeClass('disabled');
      $(event.target)
        .closest('.ui.checkbox')
        .checkbox(`set ${event.target.checked ? 'unchecked' : 'checked'}`)
        .attr('data-tooltip', 'Error saving.')
        .transition('shake');
    });
}

function showLibraryRenameModal(lib, libs) {
  const t = TrelloPowerUp.iframe({
    targetOrigin: 'https://trello.com',
  });
  const member_id = CommandStorage.getAdminOnBehalfOf() || t.getContext().member;
  const modal = $('#butler-library-rename-modal');
  const lib_name = modal.find('input[name="lib-name"]');
  const new_name = modal.find('input[name="new-name"]');
  let rename_success = false;

  modal.find('> .content > .message').transition('hide');
  modal.find('.ok.button').removeClass('disabled');
  new_name.attr('disabled', false);

  const user_libs = {};
  libs.forEach(function(l) {
    if (l.user_id === member_id) {
      user_libs[l.title] = true;
    }
  });

  const change_fn = function() {
    const value = new_name.val().trim();
    modal.find('.rename-lib,.merge-libs,.remove-tag').transition('hide');
    if (!value) {
      modal.find('.remove-tag').transition('show');
    } else if (value === lib.title) {
      modal
        .find('.rename-lib')
        .transition('show')
        .filter('.ok.button')
        .addClass('disabled');
    } else if (user_libs[value]) {
      modal.find('.merge-libs').transition('show');
    } else {
      modal
        .find('.rename-lib')
        .transition('show')
        .filter('.ok.button')
        .removeClass('disabled');
    }
  };

  lib_name.val(lib.title);
  new_name
    .val(lib.title)
    .off('input')
    .on('input', change_fn);
  change_fn();

  modal.modal({
    transition: 'fade',
    selector: { close: '.right.corner.label' },
    onHide() {
      if (rename_success) {
        const type = getCurrentTab().replace(/s$/, '');
        loadCommands(type);
      }
    },
    onApprove() {
      new_name.attr('disabled', true);
      modal.find('.ok.button').addClass('disabled');
      modal.find('> .content > .renaming.message').transition('show');
      modal.find('> .content > .error-renaming.message').transition('hide');
      const value = new_name.val().trim();
      CommandStorage.renameLibrary(lib.title, value)
        .then(function() {
          modal.find('> .content > .renaming.message').transition('hide');
          modal.find('> .content > .success-renaming.message').transition('show');
          rename_success = true;
        })
        .catch(function(error) {
          Sentry.captureException(error);
          new_name.attr('disabled', false);
          modal.find('.ok.button').removeClass('disabled');
          modal.find('> .content > .renaming.message').transition('hide');
          modal.find('> .content > .error-renaming.message').transition('show');
        });
      return false;
    },
  });
  modal.modal('show');
}

function showLibraryEnableModal(lib_title, enable) {
  const modal = enable ? $('#butler-library-enable-modal') : $('#butler-library-disable-modal');
  const command_list = modal.find('.library-command-list');
  const enable_btn = modal.find('> .actions .ok');
  let enable_success = false;

  enable_btn.addClass('disabled');
  modal
    .find('> .content > .message')
    .transition('hide')
    .filter('.updating')
    .transition('show');
  modal.find('.library-command-list').empty();

  modal.modal({
    transition: 'fade',
    selector: { close: '.right.corner.label' },
    onHide() {
      command_list.empty();
      if (enable_success) {
        const type = getCurrentTab().replace(/s$/, '');
        loadCommands(type);
      }
    },
    onApprove() {
      modal.find('> .content > .updating.message').transition('hide');
      modal.find('> .content > .enabling.message').transition('show');
      modal.find('> .content > .error-enabling.message').transition('hide');
      enable_btn.addClass('disabled');
      CommandStorage.enableLibrary(lib_title, enable)
        .then(function() {
          modal.find('> .content > .enabling.message').transition('hide');
          modal.find('> .content > .success-enabling.message').transition('show');
          enable_success = true;
          Log.logEvent('engagement', 'lib_enable', enable);
        })
        .catch(function(error) {
          Sentry.captureException(error);
          enable_btn.removeClass('disabled');
          modal.find('> .content > .enabling.message').transition('hide');
          if (error && error.message === 'LIBRARY_SHARE_INVALID') {
            modal.find('> .content > .message.error-share-access').transition('show');
          } else {
            modal.find('> .content > .error-enabling.message').transition('show');
          }
        });
      return false;
    },
  });
  modal.modal('show');

  CommandStorage.getAllCommands()
    .then(function(result) {
      const { commands } = result;
      command_list.empty();

      let html = `${'<table class="ui unstackable table">' +
        '<thead><tr>' +
        '<th><i class="tag icon"></i>'}${sanitize(lib_title)}</th></tr></thead><tbody>`;

      commands.forEach(function(command) {
        if (command.lib !== lib_title) {
          return;
        }
        const cmd = command.cmd.replace(/\n/g, ' ');
        html += `<tr><td class="code-area">${sanitize(cmd)}</td></tr>`;
      });

      html += '</tbody></table>';

      command_list.html(html);

      setTimeout(function() {
        modal.find('> .content > .updating.message').transition('hide');
      });
      modal.modal('refresh');
      enable_btn.removeClass('disabled');
    })
    .catch(function(error) {
      Sentry.captureException(error);
      modal.find('> .content > .message.updating').transition('hide');
      if (error && error.message === 'LIBRARY_SHARE_INVALID') {
        modal.find('> .content > .message.error-share-access').transition('show');
      } else {
        modal.find('> .content > .message.error-updating').transition('show');
      }
    });
}
function showLibrarySharingModal() {
  const modal = $('#butler-library-sharing-modal');
  const lib_list = modal.find('.library-list');

  modal
    .find('> .content > .message')
    .transition('hide')
    .filter('.updating')
    .transition('show');
  modal.modal({
    selector: { close: '.right.corner.label' },
    onHide() {
      lib_list.empty();
    },
  });
  modal.modal('show');
  const t = TrelloPowerUp.iframe({
    targetOrigin: 'https://trello.com',
  });
  return TrelloPowerUp.Promise.all([Plan.getUserPlanLocal(t), getLibraries()])
    .spread(function(plan, result) {
      const { libs, obo_writable } = result;
      lib_list.empty();

      const displayedLibraries = libs.filter(function(lib) {
        return (lib.is_own && lib.enabled) || obo_writable !== false;
      });

      displayedLibraries.forEach(function(lib, i) {
        let item =
          `<table data-index="${sanitize(i)}" class="ui unstackable table">` +
          `<thead><tr>` +
          `<th>${sanitize(lib.title)}</th>` +
          `<th class="right aligned">`;

        if (lib.is_own) {
          if (obo_writable !== false) {
            item +=
              '<div class="ui transparent icon button library-rename-btn" tabindex="0" alt="Rename" data-tooltip="Rename the library"><i class="pencil icon"></i></div>' +
              '<div class="ui transparent icon button library-enable-btn" tabindex="0" alt="Enable all on this board" data-tooltip="Enable all of this library\'s commands on this board"><i class="check icon"></i></div>';
          }
          item +=
            '<div class="ui transparent icon button library-disable-btn" tabindex="0" alt="Disable all on this board" data-tooltip="Disable all of this library\'s commands on this board"><i class="remove icon"></i></div>';
        } else {
          item +=
            '<div class="ui transparent icon button library-import-btn" tabindex="0" alt="Import all commands from the shared library" data-tooltip="Import all commands from the shared library"><i class="download icon"></i></div>';
        }

        item += '</th></tr></thead><tbody><tr>';

        if (lib.is_own && obo_writable !== false) {
          item += `<td>${sanitize(lib.count)} commands (${sanitize(lib.enabled)} enabled)</td>`;
          if (
            plan &&
            plan.plan_id &&
            (!plan.plan_id.startsWith('TRELLO_') ||
              (plan.is_org && !(plan.plan_id === 'TRELLO_FREE')))
          ) {
            item +=
              `<td class="right aligned"><div class="ui toggle checkbox">` +
              `<input type="checkbox" class="library-share-tgl"${
                lib.link_id || lib.src ? ' checked' : ''
              }${
                lib.is_own && !lib.src ? '' : ' disabled'
              }><label style="margin-right:0.75em">Shared</label>` +
              `</td>`;
          }
          if (lib.src)
            item +=
              `</tr><tr><td>A library with this name is shared by ${sanitize(
                lib.src.username ? `@${lib.src.username}` : 'another user'
              )}</td><td class="right aligned">` +
              `<div class="ui transparent icon button library-import-btn" tabindex="0" alt="Add/update all commands from the shared library" data-tooltip="Add/update all commands from the shared library"><i class="download icon"></i></div></td>`;
        } else {
          item += `<td>${sanitize(
            lib.username ? `Shared by @${lib.username}` : 'Shared by another user'
          )}</td><td></td>`;
        }

        item += '</tr></tbody></table>';

        const element = $(item);
        element.appendTo(lib_list);

        element
          .find('.library-share-tgl')
          .closest('.ui.checkbox')
          .checkbox({
            onChange() {
              shareLibrary({ target: this }, lib);
            },
          });
        element.find('.library-import-btn').click(function() {
          showLibraryImportModal(lib.src ? lib.src.link_id : lib.link_id);
        });
        element.find('.library-enable-btn').click(function() {
          showLibraryEnableModal(lib.title, true);
        });
        element.find('.library-disable-btn').click(function() {
          showLibraryEnableModal(lib.title, false);
        });
        element.find('.library-rename-btn').click(function() {
          showLibraryRenameModal(lib, libs);
        });
      });

      if (!displayedLibraries.length)
        modal.find('> .content > .message.empty-list').transition('show');

      setTimeout(function() {
        modal.find('> .content > .updating.message').transition('hide');
      });
      modal.modal('refresh');
    })
    .catch(function(error) {
      Sentry.captureException(error);
      modal.find('> .content > .message.updating').transition('hide');
      modal.find('> .content > .message.error-updating').transition('show');
    });
}

function setupLibraryManageMenu() {
  $('.library-manage .button')
    .off('click')
    .click(function() {
      showLibrarySharingModal();
    });
}
// LIBS

function initMisc() {
  $('.help-popup')
    .click(function() {
      return false;
    })
    .each(function(i, element) {
      const target = $(element);
      const popup_selector = target.attr('data-popup-selector');
      const popup = popup_selector ? $(popup_selector) : target.next('.ui.popup');
      target.popup({
        on: 'click',
        popup,
        target: target.length ? target : false,
        position: 'top center',
        lastResort: true,
        hoverable: false,
        boundary: '.builder-wizard-body',
      });
    });

  $('.close-popup')
    .off('click')
    .click(function(event) {
      $(event.target)
        .closest('.popup')
        .popup('hide all');
    });

  $('.butler-account-details-btn')
    .off('click')
    .click(function() {
      const t = TrelloPowerUp.iframe({
        targetOrigin: 'https://trello.com',
      });
      t.overlay({ url: './powerup-account.html?tab=account' }).catch(err =>
        handleError('showAccountOverlay', err)
      );
      return false;
    });
  $('.butler-usage-details-btn')
    .off('click')
    .click(function() {
      const t = TrelloPowerUp.iframe({
        targetOrigin: 'https://trello.com',
      });
      t.overlay({ url: './powerup-account.html?tab=usage' }).catch(err =>
        handleError('showUsageOverlay', err)
      );
      return false;
    });

  $('.remove-command-popup .ok.button').click(function(e) {
    const { is_admin } = __flags;
    $(e.target).addClass('disabled');
    removeCommand(e, is_admin);
  });

  $('.enabled-on-x-boards-popup .add-to-another-board-btn').click(function(e) {
    const popup = $(e.target).closest('.enabled-on-x-boards-popup');
    const commandID = popup.attr('command-id');
    CommandStorage.getCommandById(commandID, true).then(function(command) {
      popup.transition('hide');
      setupAddCommandToBoardPopup(command, popup.parent().find('.enabled-on-x-boards'), 'manual');
      popup
        .parent()
        .find('.enabled-on-x-boards')
        .popup('show');
    });
  });

  $('.add-command-to-board-popup .ok.button.add-automation-btn').click(function(e) {
    $(e.target).addClass('disabled');
    const popup = $(e.target).closest('.add-command-to-board-popup');
    const commandID = popup.attr('command-id');
    const board = $(e.target).attr('command-board');
    const boardId = $(e.target).attr('command-board-id');
    if (board) {
      CommandStorage.getCommandById(commandID, true).then(function(command) {
        popup.transition('hide');
        duplicateCommand({ command, share: true, board: { name: board, id: boardId } });
        Analytics.sendUIEvent({
          action: 'clicked',
          actionSubject: 'button',
          actionSubjectId: 'addAutomationToBoardButton',
          source: tabToScreenMapping[getCurrentTab().trim()],
        });
      });
    }
  });

  $('.command-list-filter .ui.dropdown.filter').dropdown({
    onShow() {
      const dropdown = $(this);
      getUserLibNames().then(function(libs) {
        const html = libs.map(function(lib) {
          return `<a class="item" data-type="lib" data-value="${sanitize(
            lib
          )}"><i class="tag icon"></i>${sanitize(lib)}</a>`;
        });
        dropdown.find('.item[data-type="lib"]').detach();
        if (!html.length) dropdown.find('.divider.libs').transition('hide');
        else
          dropdown
            .find('.divider.libs')
            .transition('show')
            .after(html);
      });
    },
    onChange(value) {
      $('.command-list-filter .command-search').transition(value === 'search' ? 'show' : 'hide');
      applyCommandListFilter(true);
      $('html,body').animate({ scrollTop: 0 }, 'slow');
    },
  });
  $('.command-list-filter .command-search')
    .off('input')
    .on('input', function() {
      applyCommandListFilter(true);
    });

  $('.builder.actions .add-actions').click(function(e) {
    $('.builder.actions .actions-body').transition('show');
    $(e.target).transition('hide');
  });

  $('.builder.triggers .add-triggers').click(function(e) {
    $('.builder.triggers .triggers-body').transition('show');
    $(e.target).transition('hide');
  });

  setupLibraryManageMenu();
}

const init = function() {

  const t = TrelloPowerUp.iframe({
    targetOrigin: 'https://trello.com',
  });
  CommandStorage.init(t);
  Suggestions.setSuggestionTabUnseenCount(t);

  $('.dashboard-tabs .ui.dropdown').dropdown({ on: 'hover' });
  $('.dashboard-tabs .item[data-tab="tab-suggestions"]').click(function() {
    loadSuggestions();
    $('.left-pane').toggleClass('hidden');
  });
  $('.dashboard-tabs .item[data-tab="tab-card-buttons"]').click(function() {
    loadCommandsTab('card-button');
    $('.left-pane').toggleClass('hidden');
  });
  $('.dashboard-tabs .item[data-tab="tab-board-buttons"]').click(function() {
    loadCommandsTab('board-button');
    $('.left-pane').toggleClass('hidden');
  });
  $('.dashboard-tabs .item[data-tab="tab-rules"]').click(function() {
    loadCommandsTab('rule');
    $('.left-pane').toggleClass('hidden');
  });
  $('.dashboard-tabs .item[data-tab="tab-schedules"]').click(function() {
    loadCommandsTab('schedule');
    $('.left-pane').toggleClass('hidden');
  });
  $('.dashboard-tabs .item[data-tab="tab-on-dates"]').click(function() {
    loadCommandsTab('on-date');
    $('.left-pane').toggleClass('hidden');
  });

  $('.dashboard-tabs .item[data-tab="tab-connected-apps"],.integrations-tab-link').click(
    function() {
      loadIntegrationsTab().then(userIntegrations => {
        Analytics.sendScreenEvent({
          name: 'butlerIntegrationsScreen',
          attributes: {
            numOfConnections: (userIntegrations || []).length,
          },
        });
      });

      $('.left-pane').toggleClass('hidden');
    }
  );


  const params = new URLSearchParams(window.location.search);
  const tab = params.get('tab');
  const cmdEditParam = params.get('commandEdit');
  const cmdLogParam = params.get('commandLog');
  const newCommand = params.get('newCommand')
    ? decompressFromEncodedURIComponent(params.get('newCommand'))
    : null;
  const newIcon = params.get('newIcon');
  const newLabel = params.get('newLabel');

  function loadInitialTab(callback = null) {
    const sendDeepLinkEvent = sourceTab => {
      Analytics.sendTrackEvent({
        action: 'clicked',
        actionSubject: 'link',
        actionSubjectId: 'butlerDeepLink',
        attributes: {
          tab,
        },
        source: tabToScreenMapping[sourceTab],
      });
    };
    switch (tab) {
      case 'rules':
        loadCommandsTab('rule', callback);
        sendDeepLinkEvent('rules');
        break;
      case 'card-buttons':
      case 'card-button':
        loadCommandsTab('card-button', callback);
        sendDeepLinkEvent('card-buttons');
        break;
      case 'board-buttons':
      case 'board-button':
        loadCommandsTab('board-button', callback);
        sendDeepLinkEvent('board-buttons');
        break;
      case 'schedule':
      case 'schedules':
      case 'scheduled':
        loadCommandsTab('schedule', callback);
        sendDeepLinkEvent('schedules');
        break;
      case 'on-dates':
      case 'due-dates':
      case 'duedates':
      case 'dates':
        loadCommandsTab('on-date', callback);
        sendDeepLinkEvent('on-dates');
        break;
      case 'suggestions':
        Auth.authorizeSoft().then(function() {
          loadSuggestions();
        });
        sendDeepLinkEvent('suggestions');
        break;
      case 'connected-apps':
        loadIntegrationsTab();
        sendDeepLinkEvent('connected-apps');
        break;
      default:
        Auth.authorizeSoft()
          .then(function() {
            Plan.refreshUserPlan(t);
          })
          .catch(function() {
            // do nothing
          })
          .finally(function() {
            if ($('.left-pane .item.tab-suggestions').hasClass('active')) {
              loadSuggestions();
            }
          });
        // Check for importable Bot commands
        loadImportableCommands();
    }
  }

  if (cmdEditParam) {
    const id = cmdEditParam;
    if (cmdEditParam === 'new') {
      if (newCommand) {
        try {
          const newCommandObj = {
            type: tabToType[tab],
            cmd: newCommand,
            image: newIcon,
            label: newLabel ? newLabel.substring(0, 100) : null,
          };
          loadCommandsTab(tabToType[tab], () => {
            showBuilder({ type: tabToType[tab], command: newCommandObj });
          });
        } catch (e) {
          loadInitialTab(openNewCommand);
        }
      } else {
        loadInitialTab(openNewCommand);
      }
    } else {
      CommandStorage.getCommandById(id, true).then(function(command) {
        if (typeof command !== 'undefined') {
          loadCommandsTab(command.type, () => {
            if (command.is_own) {
              showBuilder({ type: command.type, command });
            }
            Analytics.sendTrackEvent({
              action: 'clicked',
              actionSubject: 'link',
              actionSubjectId: 'butlerDeepLink',
              attributes: {
                tab: command.type,
                tabAction: 'commandEdit',
                commandOwned: command.is_own,
              },
              source: tabToScreenMapping[getCurrentTab().trim()],
            });
          });
        } else {
          loadInitialTab();
        }
      });
    }
  } else if (cmdLogParam) {
    const id = cmdLogParam;
    CommandStorage.getCommandById(id, true).then(function(command) {
      if (typeof command !== 'undefined') {
        loadCommandsTab(command.type, () => {
          updateNavigation({ action: 'log', commandId: command.id });
          CommandLog.openCommandLog({ id }, null, updateNavigation);
          Analytics.sendTrackEvent({
            action: 'clicked',
            actionSubject: 'link',
            actionSubjectId: 'butlerDeepLink',
            attributes: {
              tab: command.type,
              tabAction: 'commandLog',
            },
            source: tabToScreenMapping[getCurrentTab().trim()],
          });
        });
      } else {
        loadInitialTab();
      }
    });
  } else {
    loadInitialTab();
  }


  initCommandList();

  initMisc();
};

const PowerUpDashboard = {
  init,
};
window.PowerUpDashboard = PowerUpDashboard;

module.exports = PowerUpDashboard;
