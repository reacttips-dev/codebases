// eslint-disable-next-line @trello/export-matches-filename
import { Auth } from 'app/scripts/db/auth';
// eslint-disable-next-line no-restricted-imports
import $ from 'jquery';
import { asString as osAndBrowserVersionString } from '@trello/browser';
import { getKey, Key } from '@trello/keybindings';
import { ApiAjax } from 'app/scripts/network/api-ajax';
import _ from 'underscore';
import globalClickHandler from 'app/scripts/views/internal/global-click-handler';
import Alerts from 'app/scripts/views/lib/alerts';
import Dialog from 'app/scripts/views/lib/dialog';
import Layout from 'app/scripts/views/lib/layout';
import { PopOver } from 'app/scripts/views/lib/pop-over';

export const domReady = () => {
  const $document = $(document);

  $('meta[name=apple-itunes-app]').attr(
    'content',
    `app-id=461504587, app-argument=${location.href}`,
  );

  // Calculate window size and reposition popover

  window.orientationchange = () => Dialog.calcPos();

  $('#trello-root').addClass(osAndBrowserVersionString);

  // Adds the dataTransfer property to jQuery so we can get HTML5 drag/drop file uploads to work
  $.event.props.push('dataTransfer');
  // Adds the detail property so we can get data attached to custom events
  $.event.props.push('detail');

  let docMouseDownTarget = null;

  // this is to prevent chrome's errant clicks from deselecting text (Trelp-977)
  $document.on('mousedown', function (e) {
    docMouseDownTarget = e.target;
  });

  $document.on(
    'click',
    '.js-resend-confirmation-email',
    _.throttle(() => {
      return ApiAjax({
        type: 'POST',
        url: '/resendValidate',
        data: {
          email: Auth.me().get('email'),
        },
        success() {
          return Alerts.flash('email sent', 'confirm', 'email');
        },
      });
    }, 60000),
  );

  $document.on('click', function (e) {
    if ($(e.target).closest('.js-react-root').length) {
      return;
    }

    // if targets don't match, this is a chrome bugged click (Trelp-977)
    const isRealClick = docMouseDownTarget === e.target;
    docMouseDownTarget = null;

    // quick editor clicks are handled on the quick-card-editor itself, so
    // if quick editor exists, it's open, and we need to ignore it
    const isQuickEditOpen = $('.quick-card-editor').length > 0;

    if (!(Dialog.isVisible || isQuickEditOpen) || isRealClick) {
      return globalClickHandler(e);
    }
  });

  // Close all on esc

  $document.on('keyup', function (e) {
    const key = getKey(e);
    if (key === Key.Escape) {
      e.preventDefault();

      if (Layout.isEditing()) {
        return Layout.cancelEdits();
      } else if ($('.new-comment').hasClass('focus')) {
        return $('.new-comment').removeClass('focus').find('textarea').blur();
      } else {
        $('input').blur();

        return $('textarea').blur();
      }
    }
  });

  // Disallow dragging of anything that isn't a .ui-draggable,
  // so we don't accidentally trigger our drag/drop handlers
  $document.on('dragstart', (e) => {
    return (
      $(e.target).closest('.ui-draggable, .js-draggable, [draggable="true"]')
        .length > 0
    );
  });
};

export const initializeLayers = () => {
  PopOver.init();
  Dialog.init();
  window.onpageshow = function (event) {
    if (event.persisted) {
      window.location.reload();
    }
  };
};
