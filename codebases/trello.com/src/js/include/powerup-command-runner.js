/* global moment, Sentry, TrelloPowerUp */

const { Auth } = require('./trello-api.js');
const CommandStorage = require('./powerup-command-storage');
const kApiEndpoint = require('./api-endpoint.js');
const MessageBroker = require('./powerup-message-broker.js');
const util = require('./util.js');

const init = function() {
  const trello = TrelloPowerUp.iframe({
    targetOrigin: 'https://trello.com',
  });
  const { Promise } = TrelloPowerUp;

  CommandStorage.init();

  function messageToHtml(message) {
    let item = '<div class="item">';
    switch (message.type) {
      case 'ERROR':
        item += '<i class="red warning circle icon"></i>';
        break;
      case 'WARNING':
        item += '<i class="yellow warning circle icon"></i>';
        break;
      case 'MESSAGE':
      case 'END':
        item += '<i class="blue info circle icon"></i>';
        break;
      default:
        break;
    }
    item += `<div class="content">${util.markdownToHtml(message.message)}</div>`;
    item += '</div>';
    return item;
  }

  function setDetailMessages(messages) {
    const html =
      (messages || []).map(messageToHtml) ||
      '<div class="item"><i class="blue info circle icon"></i><div class="content">Command started.</div></div>';
    $('#butler-command-run-details .list')
      .html(html)
      .find('.content a')
      .attr('target', '_blank');
  }

  function appendDetailMessage(message) {
    const item = $(messageToHtml(message));
    item.find('.content a').attr('target', '_blank');
    $('#butler-command-run-details .list').append(item);
    $('#butler-command-run-details > .segment').animate({ scrollTop: item.offset().top }, 500);
  }

  // TODO: just reset the auth silently, no auth tab anymore
  function showAuthError() {
    $('#butler-error-auth').transition('slide up');
  }

  function showResponseError(response) {
    switch (response.error) {
      case 'CANT_PARSE_COMMAND':
        $('#butler-error-command-parse').transition('slide up');
        break;
      case 'COMMAND_NOT_FOUND':
        $('#butler-error-command-not-found').transition('slide up');
        break;
      case 'USER_NOT_FOUND':
        $('#butler-error-user-not-found').transition('slide up');
        break;
      case 'INVALID_TOKEN':
        Auth.reauthorize(trello);
        showAuthError();
        break;
      case 'BAD_REQUEST':
      case 'INTERNAL_ERROR':
      default:
        $('#butler-error-internal').transition('slide up');
    }
  }

  function showFinalExecutionStatus(response) {
    $('#butler-running-command').transition({
      animation: 'slide up',
      onComplete: () => {
        if (response.success) {
          const quota_exceeded = response.response.powerup_usage_exceeded;
          if (quota_exceeded) {
            $('#butler-error-quota').transition('slide up');
            $('.butler-account-details-btn')
              .off('click')
              .click(function() {
                trello.overlay({ url: './powerup-account.html?tab=account' });
                trello.closeBoardBar().done();
                return false;
              });
          } else if (
            (response.response.messages || []).some(function(m) {
              return m.type === 'ERROR';
            })
          ) {
            $('#butler-error-running-command').transition('slide up');
          } else if (
            (response.response.messages || []).some(function(m) {
              return m.type === 'WARNING';
            })
          ) {
            $('#butler-warning-running-command').transition('slide up');
          } else {
            $('#butler-success-running-command').transition('slide up');
          }
          if (!quota_exceeded)
            setTimeout(function() {
              if (!$('#butler-command-run-details:visible').length) trello.closeBoardBar().done();
            }, 5000);
        } else {
          showResponseError(response);
        }
      },
    });
  }

  function asyncExecution(response, token) {
    const { messages } = response.response;
    const params = response.response.async;

    params.onConnectionSuccess = function() {
      $.ajax(`${kApiEndpoint}powerup-resume-command`, {
        type: 'POST',
        data: JSON.stringify({
          job_id: params.job_id,
        }),
        headers: { 'X-Butler-Trello-Token': token },
        contentType: 'application/json',
      })
        .done(function(async_response) {
          if (async_response.success) {
            setDetailMessages(messages);
            $('#butler-command-run-details').transition('slide up');
            $('.butler-command-run-details-btn').transition('hide');
            trello.sizeTo('body');
          } else {
            showResponseError(async_response);
          }
        })
        .fail(function() {
          $('#butler-running-command').transition('slide up');
          $('#butler-error-running-command-network').transition('slide up');
        });
    };

    params.onConnectionFailure = function() {
      $('#butler-error-running-command-network').transition('slide up');
    };

    let ended = false;
    params.onConnectionLost = function() {
      if (!ended) $('#butler-error-running-command-network').transition('slide up');
    };

    params.onMessageReceived = function(client, topic, msg) {
      const message = JSON.parse(msg);
      messages.push(message);
      appendDetailMessage(message);

      if (message.type === 'END') {
        ended = true;
        showFinalExecutionStatus(response);
      }
    };

    MessageBroker.connect(params);
  }

  function run(token, cmd_id) {

    Promise.join(
      trello.board('id', 'name'),
      trello.card('id').catch(function() {
        return {};
      }),
      trello.member('id'),
      CommandStorage.getCommandById(cmd_id, false, true)
    ).spread(function(board, card, member, command) {

      const name =
        command && command.label
          ? `"${command.label}"`
          : $('.butler-command-name').attr('default-text');
      $('.butler-command-name').text(name);
      $('.butler-cancel-command').transition('hide');
      $('#butler-running-command').transition('slide up');

      $.ajax(`${kApiEndpoint}powerup-run-command`, {
        type: 'POST',
        data: JSON.stringify({
          cmd_id,
          command,
          board_data: {
            board_id: board.id,
            board_name: board.name,
            tz: moment.tz.guess(),
            context: navigator.userAgent,
          },
          parameters: {
            card_id: card.id,
          },
          obo: CommandStorage.getAdminOnBehalfOf(),
        }),
        headers: { 'X-Butler-Trello-Token': token },
        contentType: 'application/json',
      })
        .done(function(response) {
          if (response.response) {
            if (response.response.async) {
              return asyncExecution(response, token);
            }

            $('.butler-command-run-details-btn')
              .transition('show')
              .off('click')
              .click(function() {
                setDetailMessages(response.response.messages);
                $('.butler-command-run-details-btn').transition('hide');
                $('#butler-command-run-details').transition('show');
                trello.sizeTo('body');
              });
          } else {
            $('.butler-command-run-details-btn').transition('hide');
          }
          showFinalExecutionStatus(response);
        })
        .fail(function(jqXHR) {
          Sentry.captureMessage(
            `Run command request failed: ${jqXHR.status} - ${jqXHR.statusText}`
          );
          $('#butler-running-command').transition('slide up');
          if (jqXHR.status === 504) {
            $('#butler-error-running-command-gateway-timeout').transition('slide up');
          } else {
            $('#butler-error-running-command-network').transition('slide up');
          }
        });
    });
  }

  const cmd_id = (window.location.search.match(/cmd=([-_a-zA-Z0-9]*)/) || [])[1];
  const obo = (window.location.search.match(/obo=([a-fA-F0-9]*)/) || [])[1];
  if (obo) {
    CommandStorage.setAdminOnBehalfOf(obo);
  }
  Auth.authorize(trello).then(function() {
    run(Auth.getActiveToken(), cmd_id);
  });
};

const CommandRunner = {
  init,
};

window.CommandRunner = CommandRunner;
module.exports = CommandRunner;
