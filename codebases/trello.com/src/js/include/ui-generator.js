/* eslint-disable prettier/prettier */

const CommandStorage = require('./powerup-command-storage.js');
const util = require('./util.js');

// html for existing rules, calendar commands, and due date commands
const commandItem = function(command, obo_writable, is_admin) {
  let libsSection;
  libsSection = `
  <div>
    <a class="ui top left label ${obo_writable !== false ? '' : 'unclickable '}command-lib-name"> 
      <i class="tag icon"></i> 
      <span class="text">${util.sanitize(command.lib || '')}</span> 
    </a> 
  </div>
  `;

  // prettier-ignore
  const item = $(
    `<div id="${util.sanitize(command.id)}" class="ui grid transition hidden command">
      <div class="two column paddingless row">
        <div class="flex paddingless column">
          ${libsSection}
          <div class="command-btns">
            ${command.type === 'schedule' && obo_writable !== false
              ? `<div class="ui transparent icon button run-command-btn" 
                  tabindex="0" 
                  alt="Run Now" 
                  data-tooltip="Run Now" 
                >
                  <i class="rocket icon"></i>
                </div>`
              : ''}
            ${obo_writable !== false 
              ? `<div class="ui transparent icon button edit-command-btn${!command.is_own ? ' disabled' : '' }" 
                  tabindex="0" 
                  alt="Edit" 
                  data-tooltip="Edit" 
                >
                  <img class="icon" src="img/edit.svg"></img>
                </div> 
                <div class="ui transparent icon button copy-command-btn" 
                  tabindex="0" 
                  alt="Copy" 
                  data-tooltip="Copy" 
                >
                  <img class="icon" src="img/copy.svg"></img>
                </div> 
                <div class="ui transparent icon button remove-command-btn${command.is_own || is_admin ? '' : ' disabled'}" 
                  tabindex="0" 
                  alt="Remove" 
                  data-tooltip="Remove" 
                >
                  <img class="icon" src="img/trash.svg"></img>
                </div>`
              : ''}
            <div class="ui transparent icon button command-log-btn" 
              tabindex="0" 
              alt="Command Log" 
              data-tooltip="Command Log" 
            >
              <img class="icon" src="img/lightbulb.svg"></img>
            </div>
          </div>
          ${obo_writable !== false
            ? `<div class="ui button add-to-board-btn" 
                tabindex="0" 
                alt="Add to another board"
                data-tooltip="Add to another board"
              >
                <i class="plus icon"></i>
                Add to another board
              </div>`
            : ''} 
        </div>
        <div class="column right aligned modified-by-container">
          <div class="modified-by"></div>
        </div>
      </div>
      <div class="one column paddingless row"> 
        <div class="column code-area">${util.sanitize(command.cmd)}</td> 
      </div>
      <div class="one column paddingless row"> 
        <div class="column right aligned">
          <div class="ui checkbox sharing-btns" > 
            <input type="checkbox" class="enable-command-tgl"${command.enabled ? ' checked' : ''}>
            <label>Enabled on this board</label> 
          </div>
        </div>
      </div>
    </div>
  `);

  return item;
};

// html for existing card and board buttons
const buttonItem = function(button, is_admin) {
  const team = window._trello.getContext().teamsRebrand ? 'workspace' : 'team';

  // prettier-ignore
  const item = $(`
    <div id="${util.sanitize(button.id)}" class="ui grid transition hidden command">
      <div class="two column paddingless row">
        <div class="flex paddingless column">
          <div class="ui labeled icon limited button">
            <i class="${util.sanitize(button.icon)}"></i>
            ${util.sanitize(button.label || '')}
          </div>
          <div class="command-btns">
            <div class="ui transparent icon button edit-command-btn${!button.is_own ? ' disabled' : ''}" 
              tabindex="0" 
              alt="Edit"
              data-tooltip="Edit" 
            >
              <img class="icon" src="img/edit.svg"></img>
            </div> 
            <div class="ui transparent icon button copy-command-btn" 
              tabindex="0" 
              alt="Copy" 
              data-tooltip="Copy" 
            >
              <img class="icon" src="img/copy.svg"></img>
            </div> 
            <div class="ui transparent icon button remove-command-btn${button.is_own || is_admin ? '' : ' disabled'}" 
              tabindex="0" 
              alt="Remove" 
              data-tooltip="Remove" 
            >
              <img class="icon" src="img/trash.svg"></img>
            </div> 
            <div class="ui transparent icon button command-log-btn" 
              tabindex="0" 
              alt="Command Log" 
              data-tooltip="Command Log" 
            >
              <img class="icon" src="img/lightbulb.svg"></img>
            </div> 
          </div>
        </div>
        <div class="column right aligned modified-by-container">
          <div class="modified-by"></div>
        </div>
      </div>
      <div class="one column paddingless row"> 
        <div class="column code-area">${util.sanitize(button.cmd)}</div> 
      </div>
      <div class="one column paddingless row"> 
        <div class="left aligned">
          <div class="ui checkbox sharing-btns" 
          > 
            <input type="checkbox" 
              class="enable-command-tgl"${button.enabled ? ' checked' : ''}
            >
            <label>Enabled on this board</label> 
          </div> 
          <span class="sharing-btns-divider"></span> 
          <div class="ui checkbox sharing-btns"> 
            <input type="checkbox" 
              class="scope-command-tgl"${button.scope === CommandStorage.ScopeTeam ? ' checked' : ''}${button.is_own ? '' : ' disabled'}
            >
            <label>Enabled on all boards on this ${team}</label> 
          </div> 
          <span class="sharing-btns-divider"></span> 
          <div class="ui checkbox sharing-btns"> 
            <input type="checkbox" 
              class="share-command-tgl"${button.shared ? ' checked' : ''}${button.is_own ? '' : ' disabled'}
            >
            <label>Shared with ${team}</label> 
          </div>
        </div> 
      </div>
    </div>
  `);
  return item;
};

const actionOutput = function(noUpdate, text) {
  // allows board and list names to be edited in place for actions
  const outputPhraseHtml = text
    .replace(/\\"/g, '__QUOTE__')
    .split('"')
    .map(function(x, i, a) {
      x = util.sanitize(x.replace(/__QUOTE__/g, '"'));
      if (i % 2 === 0) {
        return `<div class="action-output-text">${x}</div>`;
      }
      let style = '';
      // if it's the last piece and it's a quoted-value, add a bit of margin under it
      if (i === a.length - 2) {
        style = `style="margin-bottom: 8px";`;
      }
      if (a[i - 1].slice(-6) === ' list ') {
        return `<div class="ui search"><input class="quoted-value prompt" type="text" name="list-name" value="${x}" placeholder="${x}" ${style}></div>`;
      }
      if (a[i - 1].slice(-7) === ' board ') {
        return `<div class="ui search"><input class="quoted-value prompt" type="text" name="board-name" value="${x}" placeholder="${x}" ${style}></div>`;
      }
      return `<textarea class="quoted-value" type="text" placeholder="${x}" rows="1" ${style}>${x}</textarea>`;
    })
    .join('');

  const implicitMultiplier = text.match(/^copy each|move each/); // Should do this better.

  // prettier-ignore
  const item = $(`
    <div class="ui grid item${noUpdate ? '' : ' transition hidden'}${implicitMultiplier ? ' implicit-multiplier' : ''}">
      <div class="paddingless row">
        <div class="thirteen wide column content output-phrase">${outputPhraseHtml}</div>
        <div class="three wide column right floated content output-side right">
          <div class="ui translucent icon button remove-action-btn" 
            tabindex="0"
          >
            <i class="trash icon"></i>
          </div>
          <div class="ui translucent icon button move-up-action-btn${implicitMultiplier ? ' disabled' : ''}"
            tabindex="0"
          >
            <i class="arrow up icon"></i>
          </div>
        </div>
      </div>
    </div>
  `);

  return item;
};

const triggerOutput = function(text) {
  // allows board and list names to be edited in place for triggers
  const outputPhraseHtml = text
    .replace(/\\"/g, '__QUOTE__')
    .split('"')
    .map(function(x, i, a) {
      x = util.sanitize(x.replace(/__QUOTE__/g, '"'));
      if (i % 2 === 0) {
        return `<div class="trigger-output-text">${x}</div>`;
      }
      let style = '';
      // if it's the last piece and it's a quoted-value, add a bit of margin under it
      if (i === a.length - 2) {
        style = `style="margin-bottom: 8px";`;
      }
      if (a[i - 1].slice(-6) === ' list ') {
        return `<div class="ui search"><input class="quoted-value prompt" type="text" name="list-name" value="${x}" placeholder="${x}" ${style}></div>`;
      }
      if (a[i - 1].slice(-7) === ' board ') {
        return `<div class="ui search"><input class="quoted-value prompt" type="text" name="board-name" value="${x}" placeholder="${x}" ${style}></div>`;
      }
      return `<textarea class="quoted-value" type="text" placeholder="${x}" rows="1" ${style}>${x}</textarea>`;
    })
    .join('');
  // prettier-ignore
  const item = $(`
    <div class="ui grid item">
      <div class="thirteen wide column content output-phrase">${outputPhraseHtml}</div>
      <div class="three wide column right floated content output-side right">
        <div class="ui translucent icon button remove-trigger-btn" 
          tabindex="0"
        >
          <i class="trash icon"></i>
        </div>
      </div>
    </div>
  `);

  return item;
};

const Generator = {
  buttonItem,
  commandItem,
  actionOutput,
  triggerOutput,
};

module.exports = Generator;
