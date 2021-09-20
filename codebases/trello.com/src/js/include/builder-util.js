/* global TrelloPowerUp */

const Integrations = require('./powerup-integrations.js');
const IntegrationsAtlassian = require('./powerup-integrations-atlassian.js');
const IntegrationsSlack = require('./powerup-integrations-slack.js');
const TrelloApi = require('./trello-api.js');
const util = require('./util.js');

const setupDropdowns = function(parent, options = {}) {
  const parents = $(parent).not('[bld-dd]');
  if (!parents.length) {
    return;
  }
  parents.attr('bld-dd', 1);

  let dropdown_toggle_selector;
  const dropdown_config = {
    on: options.click ? 'click' : 'hover',
    onShow() {
      // Dropdown doesn't have onVisible as of v2.2.
      // onShow is called before actually showing the dropdown menu, so widths
      // for the hidden items are not available. Use a heuristic instead.
      const dropdown = $(this).closest('.ui.dropdown');
      const visible_text = dropdown.find('.text');
      const text_width = visible_text.innerWidth();
      const text_length = visible_text.text().trim().length;
      const padding = dropdown.innerWidth() - text_width;
      const menu = dropdown.find('.menu');
      const items = menu.children('.item');
      let max_length = 0;
      items.each(function(i, item) {
        if ($(item).text().length > max_length) max_length = $(item).text().length;
      });
      dropdown
        .find('.menu')
        .css('min-width', padding + (1.33 * max_length * text_width) / (text_length || 1.0));

      if (dropdown.hasClass('toggling')) {
        const select = dropdown.find('select')[0];
        const option = select.options[select.selectedIndex];
        dropdown_toggle_selector = $(option).attr('data-toggle');
      }

      return true;
    },
    onChange(value, text, item) {
      const dropdown = $(this).closest('.ui.dropdown');
      if (dropdown.hasClass('label-select')) {
        return dropdown.dropdown('set text', util.sanitize(value));
      }
      if (!dropdown.hasClass('toggling')) {
        return;
      }
      const select = dropdown.find('select')[0];
      const option = select.options[item.index()];
      const new_toggle_selector = $(option).attr('data-toggle');
      if (new_toggle_selector === dropdown_toggle_selector) {
        return;
      }
      if (dropdown_toggle_selector) {
        dropdown.siblings(dropdown_toggle_selector).transition('toggle');
      }
      if (new_toggle_selector) {
        dropdown.siblings(new_toggle_selector).transition('toggle');
      }
      dropdown_toggle_selector = new_toggle_selector;
    },
  };

  parents
    .find('.ui.dropdown')
    .dropdown(dropdown_config)
    .filter('.label-select')
    .each(function() {
      const value =
        $(this).dropdown('get value') ||
        $(this)
          .find('.menu .item')
          .first()
          .attr('data-value');
      $(this).dropdown('set selected', value);
    });
};

const setupInputFields = function(parent) {
  const parents = $(parent).not('[bld-if]');
  if (!parents.length) return;
  parents.attr('bld-if', 1);

  const now = new Date();
  let hour = now.getHours();
  let min = Math.ceil(now.getMinutes() / 5) * 5;
  if (min >= 60) {
    ++hour;
    min = 0;
  }
  const pm = Math.floor(hour / 12) === 1;
  hour = hour % 12 || 12;

  const inputs = parents.find('input');
  inputs
    .filter('.numeric-value')
    .off('blur')
    .blur(function(event) {
      if (event.target.value.match(/^{.*}$/)) {
        return;
      }
      const value = parseInt(event.target.value, 10);
      let min = $(event.target).attr('data-min-value') || 0;
      const max = $(event.target).attr('data-max-value');
      if (min === undefined) {
        min = 0;
      }
      if (isNaN(value) || value < min) {
        event.target.value = min;
      } else if (max !== undefined && value > max) {
        event.target.value = max;
      }
    });
  inputs
    .filter('.hour')
    .val(hour)
    .off('blur')
    .blur(function(event) {
      const value = parseInt(event.target.value, 10);
      if (isNaN(value) || value < 1) {
        event.target.value = 12;
      } else if (value > 12) {
        event.target.value = Math.min(value - 12, 11);
        $(event.target)
          .parent()
          .siblings('.dropdown')
          .dropdown('set selected', 'pm');
      }
    });
  inputs
    .filter('.minutes')
    .val(min > 9 ? min : `0${min}`)
    .off('blur')
    .blur(function(event) {
      let value = parseInt(event.target.value, 10);
      if (isNaN(value) || value < 0) {
        value = 0;
      } else if (event.target.value > 59) {
        value = 59;
      }
      event.target.value = value > 9 ? value : `0${value}`;
    });
  parents.find('.dropdown.ampm').dropdown('set selected', pm ? 'pm' : 'am');
  inputs
    .filter('.year')
    .off('blur')
    .blur(function(event) {
      const value = parseInt(event.target.value, 10);
      if (isNaN(value)) {
        event.target.value = new Date().getYear() + 1900;
      } else if (value < 100) {
        event.target.value = 2000 + value;
      }
    });
  inputs
    .filter('[name="report-var"]')
    .off('blur')
    .blur(function(event) {
      event.target.value = event.target.value.replace(/[^a-zA-Z0-9_]/g, '_');
    });
};

/** ****************************************************************************
@
@  Builder Clauses
@
***************************************************************************** */

const hideShow = function(event, hide_selector, show_selector) {
  const hide = $(event.target).closest(hide_selector);
  const show = hide.parent().children(show_selector);
  hide.addClass('hidden').hide();
  show.removeClass('hidden').show();
};

const showSibling = function(event, sibling_selector, show_selector) {
  const show = $(event.target)
    .closest(sibling_selector)
    .parent()
    .children(show_selector);
  show.transition({
    animation: 'drop',
    duration: '0.33s',
  });
};

const onClauseChange = function(event, add_clause) {
  let clause = $(event.target).closest('.clause');
  for (let parent; (parent = clause.parent().closest('.clause')).length; ) clause = parent;

  let open;

  const popup = clause.closest('.ui.popup');
  if (popup.length) {
    const span = popup.prev('span');
    open = span.length
      ? span.children('.builder-open.builder-popup')
      : popup.siblings('.builder-open.builder-popup');
  } else {
    const modal = clause.closest('.ui.modal');
    if (modal.length) {
      open = $(modal.data('button'));
    } else {
      const inline = clause.closest('.builder-inline');
      open = inline.prev('.builder-clauses').children('.builder-open');
    }
  }

  const optional = open.siblings('.builder-optional.clause:last');
  const value = optional.children('.clause-value');
  let clone;

  if (add_clause && $(optional).hasClass('multiple-clause')) clone = optional.clone(false);

  value.text(collectPhrase(clause[0]));

  if (optional.hasClass('hidden')) {
    setupDropdowns(optional);
    optional.find('.builder-delete').click(deleteClause);

    if (optional.hasClass('multiple-clause'))
      showSibling({ target: open[0] }, open, '.builder-optional.clause:last');
    else hideShow({ target: open[0] }, open, '.builder-optional.clause:last');
  }

  if (clone) clone.insertAfter(optional); // Clone of the hidden template clause; appended at the end.
};

const selectClause = function(event) {
  const errors = $(event.target)
    .closest('.clause')
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

  onClauseChange(event, true);
  $(event.target)
    .closest('.ui.popup')
    .popup('hide all');
  $(event.target)
    .closest('.ui.modal')
    .modal('hide');
};

const deleteClause = function(event) {
  const optional = $(event.target).closest('.builder-optional');
  const hide =
    optional.siblings('.builder-optional:visible').length === 0
      ? optional.add(optional.siblings('.prefix'))
      : optional;
  hide.transition({
    animation: 'scale',
    duration: '0.25s',
    onComplete() {
      const parent_clause = $(this)
        .parent()
        .closest('.clause');
      optional.detach();
      if (parent_clause.length) onClauseChange({ target: parent_clause[0] });
    },
  });
};

const moveClauseUp = function(event) {
  const clause = $(event.target).closest('.multiple-clause');
  const prev = clause.prev('.multiple-clause');
  if (prev)
    clause.transition({
      animation: 'scale',
      duration: '0.25s',
      onComplete() {
        clause
          .detach()
          .insertBefore(prev)
          .transition('scale');
      },
    });
};

const setupClauses = function(parent, options) {
  if (!parent) parent = $('body');
  const parents = $(parent).not('[bld-cl]');
  if (!parents.length) return;
  parents.attr('bld-cl', 1);

  setupDropdowns(parents.find('.builder.ui.popup'), options); // Setting up pop-ups on demand doesn't seem to work well.

  parents
    .find(
      '.builder.popup .clause.segment, .builder.modal .clause.segment, .builder-inline .clause.segment'
    )
    .prepend(
      '<div class="ui icon transparent right floated small button select-clause-btn" tabindex="0"><i class="plus icon"></i></div>'
    );
  parents
    .find('.select-clause-btn')
    .off('click')
    .click(selectClause);

  parents
    .find('.builder-open:not(.builder-popup)')
    .off('click')
    .click(function(event) {
      hideShow(event, '.builder-open', '.builder-optional');
    });
  parents
    .find('.builder-close:not(.builder-popup)')
    .off('click')
    .click(function(event) {
      hideShow(event, '.builder-optional', '.builder-open');
    });

  parents
    .find('.builder-add-clause')
    .off('click')
    .click(function(event) {
      const add = $(event.target).closest('.builder-add-clause');
      const siblings = add.siblings('.multiple-clause');
      const template = siblings.first();
      const max = add.attr('max-clauses');
      if (max && siblings.length > max) {
        // Template doesn't count.
        add.transition('shake');
        add
          .siblings('.builder-max-clauses')
          .transition('hide')
          .transition('scale');
        return;
      }
      const clone = template.clone(false);
      clone.find('input').val('');
      setupDropdowns(clone, options);
      setupPowerUpAutoComplete(clone, options);
      clone.find('.builder-open-nested').click(function(event) {
        hideShow(event, '.builder-open-nested', '.builder-optional-nested');
      });
      clone.find('.builder-delete').click(deleteClause);
      clone.find('.builder-up-clause').click(moveClauseUp);
      clone.insertBefore(add).transition('drop');
    });

  parents.find('.builder-open.builder-popup').each(function(i, btn) {
    const button = $(btn);
    const modal_selector = button.attr('data-modal-selector');
    if (modal_selector) {
      return button.off('click').click(function() {
        const modal = $(modal_selector);
        modal
          .modal({
            onShow() {
              modal.data('button', button);
              button.siblings('.prefix').transition('show');
            },
            onHide() {
              delete modal.__button;
              if (!button.siblings('.builder-optional:visible').length)
                button.siblings('.prefix').transition('scale down');
            },
          })
          .modal('show');
      });
    }

    const isFilter =
      button.attr('data-popup-selector') === '.card-filter.popup' ||
      button.attr('data-popup-selector') === '.card-filter-triggers.popup';
    const target = button;
    button.popup({
      on: 'click',
      inline: false,
      popup: button.attr('data-popup-selector'),
      target,
      position: 'bottom center',
      lastResort: 'bottom left',
      hoverable: false,
      boundary: '.builder-wizard-body',
      onShow() {
        // - putting the popup inside a span breaks the layout of the popup, so we need to put it outside it.
        const span = target.parent('span');
        if (span.length) {
          $(span).after($(this).detach());
        }

        button.siblings('.prefix').transition('show');
        // setupDropdowns(this);  // We pre-setup them above. Otherwise, the default label name doesn't seem to populate correctly.

        // making the filter popup always open with the first tab since its smallest
        // seems to improve the popup positioning logic to fit in its container
        if (isFilter) {
          $('.card-filter.popup')
            .find('.item')
            .tab('change tab', 'card-filter-base');
        }
      },
      onHidden() {
        if (!button.siblings('.builder-optional:visible').length)
          button.siblings('.prefix').transition('scale down');
      },
    });
  });
  parents
    .find('.builder-close.builder-popup')
    .off('click')
    .click(function(event) {
      hideShow(event, '.builder-optional', '.builder-open.builder-popup');
    });
  parents
    .find('.close-popup')
    .off('click')
    .click(function(event) {
      $(event.target)
        .closest('.popup')
        .popup('hide all');
    });
};

/** ****************************************************************************
@
@  Auto-complete
@
***************************************************************************** */

const searchSelect = function(value) {
  $(this).data('search-select', util.sanitize(value));
};

let __autocomplete_cache = {};

const getCacheResource = function(name, loader_fn) {
  return new TrelloPowerUp.Promise(function(resolve, reject) {
    if (__autocomplete_cache[name]) {
      return resolve(__autocomplete_cache[name]);
    }

    const loading = `${name}__loading`;
    if (!__autocomplete_cache[loading]) {
      __autocomplete_cache[loading] = [];
    }

    __autocomplete_cache[loading].push({ resolve, reject });
    if (__autocomplete_cache[loading].length > 1) {
      return;
    }

    loader_fn(
      function(data) {
        __autocomplete_cache[name] = data;
        const waiting = __autocomplete_cache[loading];
        delete __autocomplete_cache[loading];
        waiting.forEach(function(w) {
          w.resolve(data);
        });
      },
      function(error) {
        const waiting = __autocomplete_cache[loading];
        delete __autocomplete_cache[loading];
        waiting.forEach(function(w) {
          w.reject(error);
        });
      }
    );
  });
};

const getLists = function() {
  return getCacheResource('lists', function(resolve, reject) {
    TrelloPowerUp.iframe({ targetOrigin: 'https://trello.com' })
      .lists('name')
      .then(function(lists) {
        resolve(lists);
      })
      .catch(function(error) {
        reject(error);
      });
  });
};

const searchQuery = function(query) {
  // Allow dropdown search to display all values when a prior value had been selected.
  const selected = $(this).data('search-select');
  if (!selected) {
    return true;
  }
  if (util.sanitize(query) !== selected) {
    $(this).data('search-select', '');
    return true;
  }
  $(this).search('search local', '');
  return false;
};

const getAllOpenBoards = function() {
  return getCacheResource('all_open_boards', function(resolve, reject) {
    TrelloApi.getMe({ boards: 'open', fields: '', board_fields: 'id,name' })
      .then(function(response) {
        resolve(response.boards);
      })
      .catch(reject);
  });
};

const getBoards = function() {
  return getCacheResource('boards', function(resolve, reject) {
    TrelloApi.getMyBoards({ filter: 'open', lists: 'open', count: 100, fields: 'id,name' })
      .then(resolve)
      .catch(reject);
  });
};

const getListsByBoardId = function(boardId) {
  return TrelloApi.getLists(boardId, {});
};

// TODO: move these and all integrations autofill out of this file.
const getJiraIssueTypes = function(site_id, project_key) {
  return getCacheResource(
    `jira_data_${site_id}`,
    IntegrationsAtlassian.getJiraSiteData(site_id)
  ).then(cachedData => {
    if (!project_key) return cachedData.issueTypes;
    return cachedData.projects
      .filter(project => project.key === project_key)
      .map(project => project.issuetypes)[0];
  });
};

const getJiraProjects = function(site_id) {
  return getCacheResource(
    `jira_data_${site_id}`,
    IntegrationsAtlassian.getJiraSiteData(site_id)
  ).then(cachedData => {
    return cachedData.projects.map(project => ({
      name: project.name,
      key: project.key,
    }));
  });
};

const getJiraContext = function() {
  return getCacheResource('jira_context', Integrations.getIntegrationDetails('JIRA'));
};

const getSlackChannels = function(workspace_id) {
  return getCacheResource(
    `slack_channels_${workspace_id}`,
    IntegrationsSlack.getSlackChannelsForWorkspace(workspace_id)
  );
};

const getSlackContext = function() {
  return getCacheResource('slack_context', Integrations.getIntegrationDetails('Slack'));
};

const setupListNameAutoComplete = function(
  list_name_elements,
  { lists, clear_invalid_value, listWarning } = {}
) {
  if (!lists) {
    return getLists().then(function(loaded_lists) {
      if (loaded_lists)
        setupListNameAutoComplete(list_name_elements, { lists: loaded_lists, clear_invalid_value });
    });
  }

  const selected = lists.find(function(list) {
    return list.selected;
  });
  if (selected) {
    list_name_elements.each(function() {
      searchSelect.bind(this)(selected.name);
      $(this).val(selected.name);
    });
  }

  const seen = {};
  lists = lists
    .filter(function(list) {
      if (seen[list.name]) {
        return false;
      }
      seen[list.name] = true;
      return true;
    })
    .map(function(list) {
      return { name: util.sanitize(list.name) };
    });

  const search = list_name_elements
    .addClass('prompt')
    .parent()
    .addClass('search')
    .search('clear cache')
    .search('hide results')
    .search({
      source: lists,
      fields: { title: 'name' },
      searchFields: ['name'],
      searchFullText: false,
      showNoResults: false,
      minCharacters: 0,
      maxResults: 20,
      onSearchQuery(query) {
        searchQuery.call(this, query);
        const t = TrelloPowerUp.iframe({
          targetOrigin: 'https://trello.com',
        });
        if (t.getContext().commandSharing && listWarning) {
          // Used in command sharing to determine if command needs its list changed
          // if the current list doesn't exist on the target board
          if (lists.some(list => list.name === query)) {
            list_name_elements.css('opacity', 1.0);
            list_name_elements.removeClass('quoted-value-highlighted');
            listWarning.transition('hide');
          } else {
            list_name_elements.css('opacity', 0.4);
            list_name_elements.addClass('quoted-value-highlighted');
            listWarning.transition('show');
          }
        }
      },
      onSelect(result) {
        searchSelect.call(this, result.name);
        const t = TrelloPowerUp.iframe({
          targetOrigin: 'https://trello.com',
        });
        if (t.getContext().commandSharing && listWarning) {
          // Used in command sharing to determine if command needs its list changed
          // if the current list doesn't exist on the target board
          if (lists.some(list => list.name === result.name)) {
            list_name_elements.css('opacity', 1.0);
            list_name_elements.removeClass('quoted-value-highlighted');
            listWarning.transition('hide');
          }
        }
      },
    });

  search.each(function() {
    const value = $(this).search('get value');
    if (!value) {
      return;
    }
    if (clear_invalid_value && !seen[value]) {
      $(this).search('set value', '');
    } else {
      searchSelect.call(this, value);
    }
  });
};

const setupBoardNameAutoComplete = function(board_name_elements, boards, setup_lists) {
  if (!boards)
    return getBoards().then(function(loaded_boards) {
      if (loaded_boards)
        setupBoardNameAutoComplete(board_name_elements, loaded_boards, setup_lists);
    });

  const selected = boards.find(function(board) {
    return board.selected;
  });
  if (selected)
    board_name_elements.each(function() {
      searchSelect.call(this, selected.name);
      $(this).val(selected.name);
    });

  const seen = {};
  boards = boards
    .filter(function(board) {
      if (seen[board.name]) {
        return false;
      }
      seen[board.name] = board;
      return true;
    })
    .map(function(board) {
      return { name: util.sanitize(board.name), lists: board.lists };
    });

  const findListName = function(element) {
    const board_name = $(element).find('[name="board-name"]');
    const siblings = $(element)
      .closest('.phrase,.clause,.output-phrase')
      .find('[name="list-name"],[name="board-name"]');
    let list_name;
    siblings.get().find(function(element, i, array) {
      if (element === board_name[0]) {
        list_name = $(array[i - 1]).filter('[name="list-name"]');
        return true;
      }
      return false;
    });
    return list_name;
  };

  const search = board_name_elements
    .addClass('prompt')
    .parent()
    .addClass('search')
    .search({
      source: boards,
      fields: { title: 'name' },
      searchFields: ['name'],
      searchFullText: false,
      showNoResults: false,
      minCharacters: 0,
      maxResults: 20,
      onSearchQuery: searchQuery,
      onSelect(result) {
        searchSelect.call(this, result.name);
        const list_name = findListName(this);
        if (list_name) {
          setupListNameAutoComplete(list_name, { lists: result.lists, clear_invalid_value: true });
        }
        const search = $(this);
        $(this)
          .closest('.builder-optional')
          .find('.builder-close')
          .on('click', function() {
            search.search('set value', '');
            getLists().then(function(lists) {
              setupListNameAutoComplete(list_name, { lists, clear_invalid_value: true });
            });
          });
      },
    });

  search.each(function() {
    const value = $(this).search('get value');
    if (!value) return;
    searchSelect.call(this, value);
    if (setup_lists) {
      const board = seen[value];
      if (board) {
        const list_name = findListName(this);
        if (list_name) {
          setupListNameAutoComplete(list_name, { lists: board.lists });
        }
      }
    }
  });
};

// used by command sharing to select a board the user wants to add command to
const setupBoardNameDropdown = function(board_name_elements, boards, addBoardBtn) {
  const selected = boards.find(board => Boolean(board.selected));
  if (selected)
    board_name_elements.each(function() {
      searchSelect.call(this, selected.name);
      $(this).val(selected.name);
    });

  const seen = {};
  boards = boards
    .filter(function(board) {
      if (seen[board.name]) {
        return false;
      }
      seen[board.name] = board;
      return true;
    })
    .map(function(board) {
      return { name: util.sanitize(board.name), lists: board.lists, id: board.id };
    });

  const search = board_name_elements
    .addClass('prompt')
    .parent()
    .addClass('search')
    .search('clear cache')
    .search({
      source: boards,
      fields: { title: 'name' },
      searchFields: ['name'],
      searchFullText: false,
      showNoResults: false,
      minCharacters: 0,
      maxResults: 20,
      onSearchQuery: searchQuery,
      onSelect(result) {
        searchSelect.call(this, result.name);
        addBoardBtn.removeClass('disabled');
        addBoardBtn.attr('command-board', result.name);
        addBoardBtn.attr('command-board-id', result.id);
      },
    })
    .search('set value', '');

  search.each(function() {
    const value = $(this).search('get value');
    if (!value) return;
    searchSelect.call(this, value);
  });
};

const setupJiraSiteIssueTypesAutoComplete = function(
  site_id,
  project_key,
  issue_type_names,
  issue_types
) {
  if (!issue_types) {
    getJiraIssueTypes(site_id, project_key).then(function(loaded_issue_types) {
      if (loaded_issue_types)
        setupJiraSiteIssueTypesAutoComplete(
          site_id,
          project_key,
          issue_type_names,
          loaded_issue_types
        );
    });
    return;
  }

  // If they only have one issue type, then set a default for the issue type
  // inputs
  if (issue_types.length === 1) {
    issue_type_names.val(issue_types[0]);
  }

  const selected = issue_types.find(function(issue) {
    return issue.selected;
  });

  if (selected)
    issue_type_names.each(function() {
      searchSelect.bind(this)(selected);
      $(this).val(selected);
    });

  const seen = {};
  const filteredIssues = issue_types
    .filter(function(issue_type) {
      if (seen[issue_type]) return false;
      seen[issue_type] = true;
      return true;
    })
    .map(function(issue_type) {
      return {
        name: util.sanitize(issue_type),
      };
    });

  const search = issue_type_names
    .addClass('prompt')
    .parent()
    .addClass('search')
    .search('clear cache')
    .search('hide results')
    .search({
      source: filteredIssues,
      fields: { title: 'name' },
      searchFields: ['name'],
      searchFullText: false,
      showNoResults: false,
      minCharacters: 0,
      maxResults: 20,
      onSearchQuery: searchQuery,
      onSelect(result) {
        searchSelect.bind(this)(result.name);
      },
    });

  search.each(function() {
    const value = $(this).search('get value');
    if (!value) return;
    searchSelect.bind(this)(value);
  });
};

const setupJiraProjectAutoComplete = function(site_id, project_names, projects) {
  if (!projects) {
    getJiraProjects(site_id).then(function(loaded_projects) {
      if (loaded_projects) setupJiraProjectAutoComplete(site_id, project_names, loaded_projects);
    });
    return;
  }

  // If they only have one project, then set a default for the project name
  // inputs
  if (projects.length === 1) {
    project_names.val(projects[0].key);
  }

  const selected = projects.find(function(site) {
    return site.selected;
  });

  if (selected)
    project_names.each(function() {
      searchSelect.bind(this)(selected.key);
      $(this).val(selected.key);
    });

  const seen = {};
  const filteredProjects = projects
    .filter(function(project) {
      if (seen[project.key]) return false;
      seen[project.key] = true;
      return true;
    })
    .map(function(project) {
      return {
        name: util.sanitize(project.name),
        key: util.sanitize(project.key),
        title: util.sanitize(`${project.key} (${project.name})`),
      };
    });

  const findIssueTypeElements = function(element) {
    const issue_type_elements = $(element)
      .closest('.phrase,.clause,.output-phrase')
      .find('[name="jira-issue-type"]');
    return issue_type_elements;
  };

  // This could be optimized to directly query the API with current input:
  // https://semantic-ui.com/modules/search.html#/examples
  const search = project_names
    .addClass('prompt')
    .parent()
    .addClass('search')
    .search('clear cache')
    .search('hide results')
    .search({
      source: filteredProjects,
      fields: { title: 'title' },
      searchFields: ['name', 'key', 'title'],
      searchFullText: false,
      showNoResults: false,
      minCharacters: 0,
      maxResults: 20,
      onSearchQuery: searchQuery,
      onSelect(result) {
        searchSelect.bind(this)(result.key);
        // Set the project name to the key of the project
        // even though the search options display `${key} (${name})`
        const issue_type_elements = findIssueTypeElements(this);
        if (issue_type_elements[0]) {
          setupJiraSiteIssueTypesAutoComplete(site_id, result.key, issue_type_elements, null);
        }
        $(this).search('set value', result.key);
        $(this).search('hide results');
        return false;
      },
    });

  search.each(function() {
    const value = $(this).search('get value');
    if (!value) return;
    searchSelect.bind(this)(value);
    const issue_type_elements = findIssueTypeElements(this);
    if (issue_type_elements[0]) {
      setupJiraSiteIssueTypesAutoComplete(site_id, value, issue_type_elements, null);
    }
  });
};

const setupJiraContextAutoComplete = function(site_names, sites) {
  if (!sites) {
    getJiraContext().then(function(loaded_sites) {
      if (loaded_sites && loaded_sites.length)
        setupJiraContextAutoComplete(site_names, loaded_sites);
      else {
        $('.unauthorized-jira').transition('show');
      }
    });
    return;
  }

  // If they only have one site, then set a default for the site name inputs
  if (sites.length === 1) {
    site_names.val(sites[0].connection_name);
    site_names.attr('site_id', sites[0].connection_id);
  }
  const selected = sites.find(function(site) {
    return site.selected;
  });
  if (selected)
    site_names.each(function() {
      searchSelect.bind(this)(selected.name);
      $(this).val(selected.name);
    });

  const seen = {};
  const sitesBySiteId = {};
  const filteredSites = sites
    .filter(function(site) {
      if (seen[site.connection_id]) return false;
      seen[site.connection_id] = site;
      return true;
    })
    .map(function(site) {
      sitesBySiteId[site.connection_id] = site;
      return {
        name: util.sanitize(site.connection_name),
        site_id: util.sanitize(site.connection_id),
      };
    });

  const findProjectNameElements = function(element) {
    const project_name = $(element)
      .closest('.phrase,.clause,.output-phrase')
      .find('[name="jira-project-ref"]');
    return project_name;
  };

  const findIssueTypeElements = function(element) {
    const project_name = $(element)
      .closest('.phrase,.clause,.output-phrase')
      .find('[name="jira-issue-type"]');
    return project_name;
  };

  const search = site_names
    .addClass('prompt')
    .parent()
    .addClass('search')
    .search({
      source: filteredSites,
      fields: { title: 'name' },
      searchFields: ['name'],
      searchFullText: false,
      showNoResults: false,
      minCharacters: 0,
      maxResults: 20,
      onSearchQuery: searchQuery,
      onSelect(result) {
        searchSelect.bind(this)(result.name);
        $(this).attr('site_id', result.site_id);
        const project_name_elements = findProjectNameElements(this);
        if (project_name_elements[0]) {
          setupJiraProjectAutoComplete(result.site_id, project_name_elements, null);
        }
        const issue_type_elements = findIssueTypeElements(this);
        if (issue_type_elements[0]) {
          setupJiraSiteIssueTypesAutoComplete(result.site_id, undefined, issue_type_elements, null);
        }
      },
    });

  search.each(function() {
    const value = $(this).search('get value');
    if (!value) return;
    searchSelect.bind(this)(value);
    const site_id = $(this)
      .parent()
      .find('[name="jira-site-name"]')
      .attr('site_id');
    const project_name_elements = findProjectNameElements(this);
    if (project_name_elements[0]) {
      setupJiraProjectAutoComplete(site_id, project_name_elements, null);
    }
    const issue_type_elements = findIssueTypeElements(this);
    if (issue_type_elements[0]) {
      setupJiraSiteIssueTypesAutoComplete(site_id, undefined, issue_type_elements, null);
    }
  });
};

const setupSlackChannelAutoComplete = function(workspace_id, channel_names, channels) {
  if (!channels) {
    getSlackChannels(workspace_id).then(function(loaded_channels) {
      if (loaded_channels)
        setupSlackChannelAutoComplete(workspace_id, channel_names, loaded_channels);
    });
    return;
  }

  const selected = channels.find(function(site) {
    return site.selected;
  });
  if (selected)
    channel_names.each(function() {
      searchSelect.bind(this)(selected.name);
      $(this).val(selected.name);
    });

  const seen = {};
  const filteredChannels = channels
    .filter(function(channel) {
      if (seen[channel.id]) return false;
      seen[channel.id] = true;
      return true;
    })
    .map(function(channel) {
      return {
        name: util.sanitize(channel.name),
        id: util.sanitize(channel.id),
      };
    });

  const search = channel_names
    .addClass('prompt')
    .parent()
    .addClass('search')
    .search('clear cache')
    .search('hide results')
    .search({
      source: filteredChannels,
      fields: { title: 'name' },
      searchFields: ['name'],
      searchFullText: false,
      showNoResults: false,
      minCharacters: 0,
      maxResults: 20,
      onSearchQuery: searchQuery,
      onSelect(result) {
        searchSelect.bind(this)(result.name);
      },
    });

  search.each(function() {
    const value = $(this).search('get value');
    if (!value) return;
    searchSelect.bind(this)(value);
  });
};

const setupSlackContextAutoComplete = function(workspace_names, workspaces) {
  if (!workspaces) {
    getSlackContext().then(function(loaded_workspaces) {
      if (loaded_workspaces && loaded_workspaces.length) {
        setupSlackContextAutoComplete(workspace_names, loaded_workspaces);
      } else {
        $('.unauthorized-slack').transition('show');
      }
    });
    return;
  }

  if (workspaces.length === 1) {
    // If they only have one site, then set a default for the workspace name
    // inputs
    workspace_names.val(workspaces[0].connection_name);
    workspace_names.attr('workspace_id', workspaces[0].connection_id);
  }
  const selected = workspaces.find(function(site) {
    return site.selected;
  });
  if (selected)
    workspace_names.each(function() {
      searchSelect.bind(this)(selected.name);
      $(this).val(selected.name);
    });

  const seen = {};
  const filteredWorkspaces = workspaces
    .filter(function(site) {
      if (seen[site.connection_id]) return false;
      seen[site.connection_id] = true;
      return true;
    })
    .map(function(site) {
      return {
        name: util.sanitize(site.connection_name),
        workspace_id: util.sanitize(site.connection_id),
      };
    });

  const findChannelNames = function(element) {
    const channel_name = $(element)
      .closest('.phrase,.clause,.output-phrase')
      .find('[name="slack-channel"]');
    return channel_name;
  };

  const search = workspace_names
    .addClass('prompt')
    .parent()
    .addClass('search')
    .search({
      source: filteredWorkspaces,
      fields: { title: 'name' },
      searchFields: ['name'],
      searchFullText: false,
      showNoResults: false,
      minCharacters: 0,
      maxResults: 20,
      onSearchQuery: searchQuery,
      onSelect(result) {
        searchSelect.bind(this)(result.name);
        $(this).attr('workspace_id', result.workspace_id);
        const channel_name = findChannelNames(this);
        if (channel_name[0]) {
          setupSlackChannelAutoComplete(result.workspace_id, channel_name, null);
        }
      },
    });

  search.each(function() {
    const value = $(this).search('get value');
    if (!value) return;
    searchSelect.bind(this)(value);
    const channel_name = findChannelNames(this);
    const workspace_id = $(this)
      .parent()
      .find('[name="slack-workspace-name"]')
      .attr('workspace_id');
    if (channel_name[0]) setupSlackChannelAutoComplete(workspace_id, channel_name, null);
  });
};

const getSelectedBoards = function(board_name_elements) {
  return getBoards().then(function(boards) {
    return $(board_name_elements)
      .map(function() {
        return $(this)
          .val()
          .trim();
      })
      .get()
      .map(function(board_name) {
        return (
          boards.find(function(board) {
            return board.name.toLowerCase() === board_name.toLowerCase();
          }) || { name: board_name }
        );
      });
  });
};

const searchInit = function() {
  const value = $(this).search('get value');
  if (typeof value === 'string') {
    // From logged exceptions; haven't been able to repro.
    searchSelect.bind(this)(value);
  }
};

const setupAutoComplete = function(elements, records, field_name) {
  const search_records = records.map(function(r) {
    const s = { record: r };
    s[field_name] = util.sanitize(r[field_name]);
    return s;
  });
  elements.parent().search({
    source: search_records,
    fields: { title: field_name },
    searchFields: [field_name],
    searchFullText: false,
    showNoResults: false,
    minCharacters: 0,
    maxResults: 20,
    onSearchQuery: searchQuery,
    onSelect(result) {
      searchSelect.bind(this)(result.record[field_name]);
    },
  });
  searchInit.bind(elements.parent())();
};

const setupPowerUpAutoComplete = function(parent, options = {}) {
  const t = TrelloPowerUp.iframe({
    targetOrigin: 'https://trello.com',
  });
  const inputs = $(parent).find('.ui.input>input');

  const list_names = $(inputs).filter('[name="list-name"]');
  if (list_names.length)
    getLists().then(function(lists) {
      if (options.select_default) {
        const current = t.getContext().list;
        const list =
          lists.find(function(l) {
            return l.id === current;
          }) || lists[0];
        if (list) list.selected = true;
      }
      setupListNameAutoComplete(list_names, { lists });
    });

  const board_names = $(inputs).filter('[name="board-name"]');
  if (board_names.length)
    getBoards().then(function(boards) {
      if (options.select_default) {
        const current = t.getContext().board;
        const board =
          boards.find(function(b) {
            return b.id == current;
          }) || boards[0];
        if (board) board.selected = true;
      }
      setupBoardNameAutoComplete(board_names, boards);
    });

  const jira_site_names = $(inputs).filter('[name="jira-site-name"]');
  if (jira_site_names.length) setupJiraContextAutoComplete(jira_site_names, null);
  const slack_workspace_names = $(inputs).filter('[name="slack-workspace-name"]');
  if (slack_workspace_names.length) setupSlackContextAutoComplete(slack_workspace_names, null);

  const usernames = $(inputs).filter('[name="username"]');
  const field_names = $(inputs).filter('[name="field-name"]');
  const labels = $(parent).find('.dropdown.label-select');
  if (usernames.length || field_names.length)
    t.board('members', 'customFields', 'labels').then(function(board) {
      board.members.forEach(function(member) {
        member.username = util.sanitize(member.username);
        member.fullName = util.sanitize(member.fullName);
      });
      usernames
        .addClass('prompt')
        .parent()
        .addClass('search')
        .search({
          source: board.members,
          fields: { title: 'username', description: 'fullName' },
          searchFields: ['username', 'fullName'],
          searchFullText: false,
          showNoResults: false,
          minCharacters: 0,
          maxResults: 20,
          onSearchQuery: searchQuery,
          onSelect(result) {
            searchSelect.bind(this)(result.username);
          },
        });

      $(parent)
        .find('.no-custom-fields')
        .transition(board.customFields.length ? 'hide' : 'show');
      board.customFields.forEach(function(field) {
        field.name = util.sanitize(field.name);
      });
      field_names
        .addClass('prompt')
        .parent()
        .addClass('search')
        .each(function() {
          let fields = board.customFields;
          const field_type = $(this)
            .find('input[name="field-name"]')
            .attr('data-field-type');
          if (field_type)
            fields = fields.filter(function(field) {
              return field_type.indexOf(field.type) != -1;
            });

          $(this).search({
            source: fields,
            fields: { title: 'name', description: 'type' },
            searchFields: ['name'],
            searchFullText: false,
            showNoResults: false,
            minCharacters: 0,
            maxResults: 20,
            onSearchQuery: searchQuery,
            onSelect(result) {
              searchSelect.bind(this)(result.name);
              const field_value = $(this)
                .siblings()
                .find('input[name="field-value"]');
              if (field_value) {
                field_value.val('');
                if (result.type === 'list')
                  field_value
                    .addClass('prompt')
                    .parent()
                    .addClass('search')
                    .search('clear cache')
                    .search({
                      source: result.options.map(function(o) {
                        return { name: util.sanitize(o.value.text) };
                      }),
                      fields: { title: 'name' },
                      searchFields: ['name'],
                      searchFullText: false,
                      showNoResults: false,
                      minCharacters: 0,
                      maxResults: 20,
                      onSearchQuery: searchQuery,
                      onSelect(result) {
                        searchSelect.bind(field_value)(result.name);
                      },
                    });
                else
                  field_value
                    .removeClass('prompt')
                    .parent()
                    .removeClass('search');
              }
            },
          });
        });

      let default_label_value;
      labels.find('.menu').html(
        board.labels.map(function(label, i) {
          let value = [];
          if (label.color) {
            value.push(label.color);
          }
          if (label.name) {
            value.push(`"${label.name}"`);
          }
          value = value.join(' ');
          if (!i) {
            default_label_value = value;
          }
          return `<div class="item batch-label ${label.color ||
            'colorless'}${!i ? ' active selected' : ''}" data-value="${sanitize(value)}">${label.name ? sanitize(label.name) : '&nbsp;'}</div>`;
        })
      );
      labels.dropdown('refresh').dropdown('set selected', default_label_value);
    });
};

const refreshAutoCompleteCache = function() {
  // Refresh the autocomplete cache
  __autocomplete_cache = {};
  setupPowerUpAutoComplete('.builder');
};

/** ****************************************************************************
@
@  Collect
@
***************************************************************************** */

const parseSchema = function(schema) {
  try {
    return JSON.parse(schema);
  } catch (e) {
    console.log('[ERROR] parsing JSON:', schema);
    throw e;
  }
};

const escapeValue = function(v) {
  // Construct the regex using char codes to prevent issues if this file
  // is read in the wrong encoding. Some browsers that default to
  // non-western encodings (e.g. Japanese browsers that default to
  // Shift-JIS) may fail to parse the regex.
  const kQuotesRegex = new RegExp(
    `["${String.fromCharCode(8220)}${String.fromCharCode(8221)}]`,
    'g'
  ); // /["“”]/g
  return v
    .replace(kQuotesRegex, '\\"')
    .split('\n')
    .join('\\n');
};

const mergeSchemas = function(s, t) {
  if (!t) return;
  if (typeof s !== 'object')
    throw new Error(`mergeSchemas: Expected object:\ns=${JSON.stringify(s)}`);
  if (typeof t !== 'object')
    throw new Error(`mergeSchemas: Expected object\nt=${JSON.stringify(t)}`);

  Object.getOwnPropertyNames(t).forEach(function(p) {
    if (p in s) mergeSchemas(s[p], t[p]);
    else s[p] = t[p];
  });
};

const collectPhrase = function(node) {
  if (!node) {
    // Happens when detaching a multiple-clause.
    return null;
  }
  const elem = $(node);
  if (node.nodeType === Node.TEXT_NODE) {
    return node.nodeValue
      .replace(/^\s+/, ' ')
      .replace(/\s+$/, ' ')
      .replace(/^ ,/, ',');
  }
  if (node.nodeType === Node.ELEMENT_NODE) {
    if (
      elem.hasClass('hidden') ||
      elem.hasClass('popup') ||
      elem.hasClass('builder-comment') ||
      elem.hasClass('results') ||
      elem.css('display') === 'none'
    )
      return null;
    if (elem.hasClass('action-output-text') || elem.hasClass('trigger-output-text')) {
      return node.textContent
        .replace(/^\s+/, ' ')
        .replace(/\s+$/, ' ')
        .replace(/^ ,/, ',');
    }
    if (elem.hasClass('button')) {
      const default_value = elem.find('.default-value');
      return default_value.length ? collectPhrase(default_value[0]) : null;
    }
    if (node.nodeName === 'SCRIPT') {
      return null;
    }
    if (node.nodeName === 'INPUT' || node.nodeName === 'TEXTAREA') {
      let value = elem.prop('value').trim();
      if (elem.hasClass('optional') && !value) {
        return null;
      }
      if (!value) {
        value = elem.prop('placeholder');
      }
      if (elem.hasClass('quoted-value')) {
        return `"${escapeValue(value)}"`;
      }
      return value;
    }
    if (elem.hasClass('dropdown')) {
      if (elem.hasClass('label-select')) {
        // fix quotations in label name
        const label = $(elem)
          .dropdown('get value')
          .trim();

        const customLabel = label.substring(label.indexOf('"'), label.lastIndexOf('"') + 1);
        if (customLabel) {
          // replace all within outer quotations
          const formattedCustomLabel = customLabel
            .substring(1, customLabel.length - 1)
            .replaceAll('"', '\\"');

          return `${label.substring(
            0,
            label.indexOf('"')
          )}"${formattedCustomLabel}"${label.substring(label.lastIndexOf('"') + 1)}`;
        }

        return label;
      }
    }
    const child_text = [];
    // .forEach(), .map() not available on Safari.
    for (let i = 0; i < node.childNodes.length; ++i) {
      child_text.push(collectPhrase(node.childNodes[i]));
    }
    const text = child_text
      .filter(function(t) {
        return !!t;
      })
      .map(function(t, i, a) {
        if (t.slice(-1) === ' ' && i < a.length - 1 && ' ,'.indexOf(a[i + 1][0]) !== -1)
          return t.slice(0, -1);
        return t;
      })
      .join('')
      .trim();
    if (elem.hasClass('new-phrase')) {
      return `\n${text}`;
    }
    return (elem.hasClass('clause') && text[0] !== ',' ? ' ' : '') + text;
  }
  return null;
};

const collectSchema = function(node) {
  if (!node) return null;
  switch (node.nodeType) {
    case Node.TEXT_NODE:
      return null;
    case Node.ELEMENT_NODE:
      const element = $(node);
      if (
        element.hasClass('hidden') ||
        element.hasClass('popup') ||
        element.hasClass('builder-comment') ||
        element.hasClass('results') ||
        element.css('display') === 'none'
      )
        return null;
      if (element.hasClass('button')) {
        const default_value = element.find('.default-value');
        return default_value.length ? collectSchema(default_value[0]) : null;
      }
      if (node.nodeName === 'SCRIPT') return null;
      if (node.nodeName === 'INPUT' || node.nodeName === 'TEXTAREA') {
        let schema = element.attr('schema');
        if (!schema) {
          throw new Error(`Schema missing from input node:\n${JSON.stringify(node)}`);
        }
        let value = element.prop('value').trim();
        if (element.hasClass('optional') && !value) {
          return null;
        }
        if (!value) {
          value = element.prop('placeholder');
        }
        schema = schema.replace('_v_', value).replace('_q_', `"${escapeValue(value)}"`);
        return parseSchema(schema);
      }
      if (element.hasClass('dropdown')) {
        const dd = $(element);
        const value = dd.dropdown('get value');
        let schema = dd.attr('schema');
        let item;
        if (!schema) {
          item = dd.dropdown('get item', value);
          schema = item.attr('schema');
        }
        if (!schema) {
          const index = dd.find('.menu>.item').index(item);
          const option = $(dd.find('select option')[index]);
          schema = option.attr('schema');
        }
        if (!schema) {
          return null;
        }
        schema = schema.replace('_v_', value).replace('_q_', `"${escapeValue(value)}"`);
        return parseSchema(schema);
      }
      let schema = $(element).attr('schema');
      if (schema) {
        return parseSchema(schema);
      }
      schema = {};
      for (let i = 0; i < node.childNodes.length; ++i)
        mergeSchemas(schema, collectSchema(node.childNodes[i]));
      return schema;
    default:
      return null;
  }
};

const joinCommandPhrases = function(phrases, has_trigger) {
  let trigger;

  if (has_trigger) {
    trigger = `${phrases[0]},\n`;
    phrases = phrases.slice(1);
  } else {
    trigger = '';
  }

  if (phrases.length > 1)
    return (
      trigger +
      phrases.slice(0, -1).join(',\n') +
      (phrases[phrases.length - 2].match(/^for each /) ? ',\n' : ',\nand ') +
      phrases.slice(-1)[0]
    );
  return trigger + phrases.join();
};

const Builder = {
  setupClauses, // (parent, options)
  setupDropdowns, // (parent, options)
  setupInputFields, // (parent)
  setupPowerUpAutoComplete, // (parent, options)
  setupListNameAutoComplete, // (list_name_elements, lists, clear_invalid_value)
  setupBoardNameAutoComplete, // (board_name_elements, boards, setup_list)
  setupBoardNameDropdown,
  setupAutoComplete, // (elements, records, field_name)
  collectPhrase, // (node)
  collectSchema, // (node)
  getSelectedBoards, // (board_name_elements)
  getAllOpenBoards,
  getListsByBoardId,
  joinCommandPhrases, // (phrases, has_trigger)
  refreshAutoCompleteCache,
};

module.exports = Builder;
