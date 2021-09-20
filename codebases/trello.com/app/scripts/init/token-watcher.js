// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
const { Auth } = require('app/scripts/db/auth');
const { ApiError } = require('app/scripts/network/api-error');
const { errorSignal } = require('app/scripts/lib/error-signal');
const { startTokenWatcher } = require('@trello/session-cookie');
const { isCypress } = require('@trello/browser');

errorSignal.subscribe(function ({ error }) {
  if (error instanceof ApiError.Unauthenticated) {
    Auth.logoutPost();
  }
});

if (!isCypress()) {
  startTokenWatcher();
}
