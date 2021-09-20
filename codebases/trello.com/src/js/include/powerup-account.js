/* global moment, Sentry, TrelloPowerUp */

const TrelloApi = require('./trello-api.js');
const kApiEndpoint = require('./api-endpoint');
const Plan = require('./powerup-plan.js');
const { showTab } = require('./powerup-tabs.js');
const util = require('./util.js');

const { Auth } = TrelloApi;

let kApiTestParam;
kApiTestParam = '';

/** ****************************************************************************
@
@  Power-Up
@
***************************************************************************** */

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
        lastResort: 'bottom center',
        hoverable: false,
      });
    });

  $('.close-popup')
    .off('click')
    .click(function(event) {
      $(event.target)
        .closest('.popup')
        .popup('hide all');
    });

  $('.close-modal')
    .off('click')
    .click(function(event) {
      $(event.target)
        .closest('.modal')
        .modal('hide');
    });
}

/** ****************************************************************************
@
@  Tabs
@
***************************************************************************** */

function loadPowerUpLog(element) {
  const loading = $(element).find('.loading-log');
  const more = $(element).find('.more.button');
  const nomore = $(element).find('.no-more.button');
  const error = loading.siblings('.error-loading-log');
  const filter = element.find('.filter.checkbox');
  const noMatchFilter = element.find('.no-match-filter');
  const log = element.find('.command-log');
  element.find('.command-log').empty();
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
    loading.transition('show');
    filter.hide();
    more.transition('hide');
    nomore.transition('hide');
    error.transition('hide');
    noMatchFilter.transition('hide');

    Auth.authorize().then(function() {
      $.ajax(`${kApiEndpoint}powerup-user-log?before=${before}`, {
        type: 'GET',
        headers: { 'X-Butler-Trello-Token': Auth.getActiveToken() },
      })
        .done(function(response) {
          loading.transition('hide');
          if (!response.success) {
            error.transition('show');
            $(element)
              .find('.retry-btn')
              .off('click')
              .click(function() {
                load(before);
                return false;
              });
          } else if (response.response.log.length) {
            const log = element.find('.command-log');
            response.response.log.forEach(function(entry) {
              const { output } = entry;
              if (typeof output === 'string') {
                return; // Command update activity.
              }
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
                load(before);
              });
            filter.show();
          } else {
            filter.show();
            more.transition('hide');
            nomore.transition('show');
          }
        })
        .fail(function() {
          loading.transition('hide');
          error.transition('show');
        });
    });
  })(new Date().toISOString());
}

function loadUsageTab() {
  showTab('usage');
  Auth.authorize().then(function() {
    Plan.refreshUserPlan(TrelloPowerUp.iframe({ targetOrigin: 'https://trello.com' }));
    loadPowerUpLog($('#butler-powerup-log'));
  });
}

function cancelSubscription(customer_id) {
  const modal = $('#butler-cancel-subscription-modal');
  let reason;

  modal.find('.status').transition('hide');
  modal.find('.actions .cancel.button').removeClass('disabled');
  modal
    .find('.ui.checkbox')
    .checkbox('uncheck')
    .checkbox({
      onChecked() {
        reason = $(this)
          .siblings('label')
          .text();
        modal.find('.actions .ok.button').removeClass('disabled');
      },
    });

  modal.modal({
    onApprove() {
      modal.find('.error.status').transition('hide');
      modal.find('.sending.status').transition('show');
      modal.find('.actions .button').addClass('disabled');

      $.ajax(`${kApiEndpoint}stripe-cancel${kApiTestParam}`, {
        type: 'POST',
        headers: { 'X-Butler-Trello-Token': Auth.getActiveToken() },
        data: JSON.stringify({
          customer_id,
          reason,
          comments: modal.find('.comments').val(),
        }),
        contentType: 'application/json',
      })
        .done(function(response) {
          modal.find('.sending.status').transition('hide');
          if (response.success) {
            modal.find('.success.status').transition('scale up');
            setTimeout(function() {
              modal.modal('hide');
            }, 1000);
            loadAccountTab();
          } else {
            modal.find('.error.status').transition('scale up');
            modal.find('.actions .button').removeClass('disabled');
          }
        })
        .fail(function() {
          modal.find('.sending.status').transition('hide');
          modal.find('.error.status').transition('show');
          modal.find('.actions .button').removeClass('disabled');
        });

      return false;
    },
  });

  modal.modal('show');
}

function fillAccountInfo(account, alt_account) {
  if (alt_account) {
    $('.butler-alt-account').transition('show');
  } else {
    $('.butler-alt-account').transition('hide');
  }

  if (account.managed_by) {
    return TrelloApi.getMember(account.managed_by)
      .then(function(member) {
        $('.butler-account-managed-by').text(`${member.fullName} (@${member.username})`);
        $('.butler-account-managed').transition('scale up');
      })
      .catch(function() {
        $('.butler-account-loading-error').transition('scale up');
      });
  }

  if (account.cancel_at_period_end) {
    $('.butler-cancel-subscription').transition('hide');
    $('.butler-cancel-scheduled-date').text(moment(account.current_period_end).format('LLL'));
    $('.butler-cancel-scheduled').transition('show');
  } else {
    $('.butler-cancel-subscription')
      .transition('show')
      .off('click')
      .click(function() {
        cancelSubscription(account.customer_id);
      });
    $('.butler-cancel-subscription-earlier').transition(
      moment(account.current_period_end) > moment().add(30, 'd') ? 'show' : 'hide'
    );
    $('.butler-cancel-scheduled').transition('hide');
  }

  $('.butler-payment-source').text(account.source);
  $('.butler-payment').transition('scale up');

  const invoices_html = (account.invoices || [])
    .map(function(invoice) {
      return (
        '<div class="item"><a href="' +
        kApiEndpoint +
        'stripe-invoice/' +
        invoice.id +
        kApiTestParam +
        '" target="_blank">' +
        moment(invoice.date).format('LL') +
        '</a></div>'
      );
    })
    .join('\n');

  $('.butler-invoice-menu').html(invoices_html);

  if (account.upcoming_invoice) {
    $('.butler-upcoming-invoice-date').text(moment(account.upcoming_invoice.date).format('LL'));
    $('.butler-upcoming-invoice').transition('show');
  } else {
    $('.butler-upcoming-invoice').transition('hide');
  }

  $('.butler-invoices').transition('scale up');
}

function loadAccountTab() {
  $(
    '.butler-payment,.butler-invoices,.butler-alt-account,.butler-account-loading-error'
  ).transition('hide');
  $('.butler-account-loading').transition('show');
  showTab('account');
  Auth.authorize().then(function() {
    Plan.refreshUserPlan(TrelloPowerUp.iframe({ targetOrigin: 'https://trello.com' }));
    $.ajax(`${kApiEndpoint}stripe-account${kApiTestParam}`, {
      type: 'GET',
      headers: { 'X-Butler-Trello-Token': Auth.getActiveToken() },
    })
      .done(function(response) {
        $('.butler-account-loading').transition('hide');
        if (response.success) {
          if (response.response.org_account)
            fillAccountInfo(response.response.org_account, response.response.user_account);
          else if (response.response.user_account) {
            fillAccountInfo(response.response.user_account);
          }
        } else {
          $('.butler-account-loading-error').transition('scale up');
        }
      })
      .fail(function() {
        $('.butler-account-loading').transition('hide');
        $('.butler-account-loading-error').transition('scale up');
      });
  });
}

const init = function() {
  $('.dashboard-tabs .item[data-tab="tab-usage"]').click(function() {
    loadUsageTab();
  });
  $('.dashboard-tabs .item[data-tab="tab-account"]').click(function() {
    loadAccountTab();
  });
  $('.dashboard-tabs .item[data-tab="tab-upgrade"]').click(function() {
    showTab('upgrade');
  });

  const tab = (window.location.search.match(/tab=([a-zA-Z]*)/) || [])[1];

  switch (tab) {
    case 'account':
      loadAccountTab();
      break;
    case 'upgrade':
      showTab('upgrade');
      break;
    default:
      loadUsageTab();
  }

  initMisc();
};

const AccountDashboard = {
  init,
};
window.AccountDashboard = AccountDashboard;

module.exports = AccountDashboard;
