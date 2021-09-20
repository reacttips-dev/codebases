/* global moment, TrelloPowerUp */

const { Auth } = require('./trello-api.js');
const kApiEndpoint = require('./api-endpoint.js');
const util = require('./util.js');

const openCommandLog = function(command, on_behalf_of, onHideCallback) {
  const element = $('#powerup-command-log');
  const content = element.find('.content');
  const loading = element.find('.loading.message');
  const filter = element.find('.filter.checkbox');
  const more = element.find('.more.button');
  const nomore = element.find('.no-more-entries');
  const noMatchFilter = element.find('.no-match-filter');
  const error = loading.siblings('.error.message');
  const log = element.find('.command-log');
  const runs = element.find('.runs');
  const obo = on_behalf_of ? `&obo=${on_behalf_of}` : '';
  const t = TrelloPowerUp.iframe({
    targetOrigin: 'https://trello.com',
  });
  const board_id = t.getContext().board;
  const b = board_id ? `&b=${board_id}` : '';

  log.empty();
  element
    .modal({
      detachable: true,
      autofocus: false,
      onHide() {
        log.empty();
        onHideCallback();
      },
    })
    .modal('show');
  filter.find('.filter-checkbox').prop('checked', false); //Uncheck filter checkbox when log is opened
  filter.checkbox({
    onChecked() {
      log
        .find('.valid')
        .addClass('hidden')
        .hide();
      if (log.find('.invalid').length === 0) {
        noMatchFilter.transition('show');
      }
    },
    onUnchecked() {
      log
        .find('.valid')
        .removeClass('hidden')
        .show();
      noMatchFilter.transition('hide');
    },
  });

  function scroll() {
    content.animate({ scrollTop: content.prop('scrollHeight') }, 500);
  }

  function getEntry(output) {
    return output
      ? output
          .map(function(message) {
            let item = '<div class="item">';
            switch (message.type) {
              case 'ERROR':
                item += '<i class="red warning circle icon"></i>';
                break;
              case 'WARNING':
                item += '<i class="yellow warning circle icon"></i>';
                break;
              case 'MESSAGE':
                item += '<i class="blue info circle icon"></i>';
                break;
              default:
                break;
            }
            item += `<div class="content">${util.markdownToHtml(message.message)}</div>`;
            item += '</div>';
            return item;
          })
          .join('')
      : '<div class="item"><i class="blue info circle icon"></i><div class="content">No details.</div></div>';
  }

  function hasFilterableMessage(output) {
    return (
      output &&
      output.some(function(message) {
        return ['ERROR', 'WARNING'].includes(message.type);
      })
    );
  }

  (function load(before) {
    loading.show(); // transition() is not working for that element.
    runs.hide();
    filter.hide();
    more.transition('hide');
    nomore.transition('hide');
    error.transition('hide');
    noMatchFilter.transition('hide');
    Auth.authorize().then(function() {
      $.ajax(`${kApiEndpoint}powerup-command-log/${command.id}?before=${before}${obo}${b}`, {
        type: 'GET',
        headers: { 'X-Butler-Trello-Token': Auth.getActiveToken() },
      })
        .done(function(response) {
          loading.hide();
          if (!response.success) {
            error.transition('show');
            scroll();
            element
              .find('.retry-btn')
              .off('click')
              .click(function() {
                load(before);
                return false;
              });
          } else if (response.response.log.length) {
            if (Number.isInteger(response.response.monthUsage)) {
              runs.text(`Current estimated monthly runs: ${response.response.monthUsage}`).show();
            }
            response.response.log.forEach(function(entry) {
              let { output } = entry;
              if (typeof output === 'string') output = [{ message: output, type: 'MESSAGE' }];
              const operations =
                entry.data &&
                entry.data.command_card &&
                Number.isInteger(entry.data.command_card.operations)
                  ? entry.data.command_card.operations
                  : '';
              const html = getEntry(output);
              const trClass = hasFilterableMessage(output)
                ? '<tr class="invalid">'
                : '<tr class="valid">';

              log.append(
                trClass +
                  '<td><div class="ui list">' +
                  '<div class="item"><small>' +
                  moment(entry.t).format('LLLL') +
                  '</small></div>' +
                  html +
                  (operations ? `<div>Total operations: ${operations}</div>` : '') +
                  '</div></td></tr>'
              );
              before = entry.t;
            });
            log.find('.content a').attr('target', '_blank');
            // if filtered, stay filtered
            if (filter.find('.filter-checkbox').prop('checked')) {
              log
                .find('.valid')
                .addClass('hidden')
                .hide();
              if (log.find('.invalid').length === 0) {
                noMatchFilter.transition('show');
              }
            } else {
              log
                .find('.valid')
                .removeClass('hidden')
                .show();
              noMatchFilter.transition('hide');
            }
            more
              .transition('show')
              .off('click')
              .click(function() {
                scroll();
                load(before);
              });
            filter.show();
          } else {
            if (Number.isInteger(response.response.monthUsage)) {
              runs.text(`Current estimated monthly runs: ${response.response.monthUsage}`).show();
            }
            filter.show();
            more.transition('hide');
            nomore.transition('show');
          }
        })
        .fail(function() {
          loading.hide();
          error.transition('show');
          scroll();
        });
    });
  })(new Date().toISOString());
};

const CommandLog = {
  openCommandLog,
};
module.exports = CommandLog;
