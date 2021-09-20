/* eslint-disable
    eqeqeq,
    no-undef,
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
const Alerts = require('app/scripts/views/lib/alerts');
const { Auth } = require('app/scripts/db/auth');
const { Board } = require('app/scripts/models/board');
const {
  boxClientId,
  dropboxClientAppKey,
  oneDriveClientId,
  siteDomain,
} = require('@trello/config');
const { ApiError } = require('app/scripts/network/api-error');
const { Card } = require('app/scripts/models/card');
const { GoogleApi } = require('app/scripts/lib/google-api');
const LimitExceeded = require('app/scripts/views/attachment/attachment-limit-exceeded-error');
const TypeRestricted = require('app/scripts/views/attachment/attachment-type-restricted-error');
const limitExceededTemplate = require('app/scripts/views/templates/popover_limit_exceeded');
const { isSubmitEvent } = require('@trello/keybindings');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const Promise = require('bluebird');
const TrelloCompleterView = require('app/scripts/views/internal/autocomplete/trello-completer-view');
const UploadingLinkView = require('app/scripts/views/card/uploading-link-view');
const { Util } = require('app/scripts/lib/util');
const View = require('app/scripts/views/internal/view');
const _ = require('underscore');
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'attachment_type_picker',
);
const { Analytics } = require('@trello/atlassian-analytics');
const { ninvoke } = require('app/scripts/lib/util/ninvoke');
const f = require('effing');
const customError = require('@atlassian/trello-error-ext');
const pastedFileName = require('app/scripts/views/internal/pasted-file-name');
const { parseTrelloUrl } = require('app/scripts/lib/util/url/parse-trello-url');
const { dontUpsell } = require('@trello/browser');
const Tooltip = require('app/scripts/views/lib/tooltip');

const FileTooLarge = customError('AttachmentTypePickerView::FileTooLarge');

const template = t.renderable(function ({
  hasLargeAttachments,
  id,
  googleDriveReady,
  tipKey,
  tipData,
  defaultName,
  restrictedAttachmentTypes,
}) {
  if (tipKey == null) {
    tipKey =
      'tip-you-can-drag-and-drop-files-and-links-onto-cards-to-upload-them';
  }
  if (tipData == null) {
    tipData = {};
  }

  t.div(
    '.error.js-file-too-large',
    { style: 'margin: 12px 0 6px; display:none;' },
    function () {
      if (hasLargeAttachments) {
        t.format('that-file-size-exceeds-the-250mb-limit');
      } else {
        if (!dontUpsell()) {
          t.div('.gold-promo', function () {
            t.format(
              'that-file-size-exceeds-the-10mb-limit-but-if-you-upgrade-to',
            );
            t.icon(
              'trello-gold',
              'trello-gold-you-can-upload-files-up-to-250mb',
            );
          });
        } else {
          t.div('.gold-promo', function () {
            t.format('that-file-size-exceeds-the-10mb-limit');
          });
        }
      }
    },
  );

  t.ul('.pop-over-list', function () {
    if (Array.from(restrictedAttachmentTypes).includes('computer')) {
      t.li(() =>
        t.a('.disabled.js-attachment-restricted', { href: '#' }, () =>
          t.format('computer'),
        ),
      );
    } else {
      t.li('.uploader', function () {
        t.a('.fakefile', { href: '#' }, () => t.format('computer'));
        return t.form(
          '.realfile',
          {
            action: `/1/card/${id}/attachments`,
            method: 'post',
            enctype: 'multipart/form-data',
          },
          function () {
            t.input({ type: 'hidden', name: 'token', value: '' });
            t.input({ type: 'hidden', name: 'format', value: 'http' });
            return t.input('.js-attach-file', {
              type: 'file',
              name: 'file',
              tabindex: '-1',
              multiple: '',
            });
          },
        );
      });
    }

    t.li(function () {
      t.a('.js-attach-card', { href: '#' }, () => t.format('trello'));

      t.li(() =>
        t.a(
          '.js-google-drive-attachment',
          {
            href: '#',
            class: t.classify({
              disabled:
                !googleDriveReady ||
                Array.from(restrictedAttachmentTypes).includes('google-drive'),
              'js-attachment-restricted': Array.from(
                restrictedAttachmentTypes,
              ).includes('google-drive'),
            }),
          },
          () => t.format('google-drive'),
        ),
      );

      t.li(() =>
        t.a(
          '.js-dropbox-attachment',
          {
            href: '#',
            class: t.classify({
              'disabled js-attachment-restricted': Array.from(
                restrictedAttachmentTypes,
              ).includes('dropbox'),
            }),
          },
          () => t.format('dropbox'),
        ),
      );

      t.li(() =>
        t.a(
          '.js-box-attachment',
          {
            href: '#',
            class: t.classify({
              'disabled js-attachment-restricted': Array.from(
                restrictedAttachmentTypes,
              ).includes('box'),
            }),
          },
          () => t.format('box'),
        ),
      );

      return t.li(() =>
        t.a(
          '.js-one-drive-attachment',
          {
            href: '#',
            class: t.classify({
              'disabled js-attachment-restricted': Array.from(
                restrictedAttachmentTypes,
              ).includes('onedrive'),
            }),
          },
          () => t.format('onedrive'),
        ),
      );
    });
  });

  t.hr();

  if (Array.from(restrictedAttachmentTypes).includes('link')) {
    t.ul('.pop-over-list', () =>
      t.li(() =>
        t.a('.disabled.js-attachment-restricted', () =>
          t.format('attach-a-link'),
        ),
      ),
    );
  } else {
    t.label({ for: 'addLink' }, function () {
      t.format('attach-a-link');
    });

    t.input('.attachment-add-link-input.js-attachment-url.js-autofocus', {
      type: 'text',
      id: 'addLink',
      placeholder: t.l('paste-any-link-here-ellipsis'),
    });

    t.div('.js-name-link.hide', function () {
      t.label({ for: 'nameLink' }, function () {
        t.format('link-name');
      });

      return t.input('.attachment-add-link-input.js-attachment-name', {
        type: 'text',
        id: 'nameLink',
        value: defaultName,
      });
    });

    t.input('.js-add-attachment-url', {
      style: 'margin: 0;',
      type: 'submit',
      value: t.l('attach'),
    });
  }

  t.hr();

  t.p('.quiet.u-bottom', function () {
    t.format(tipKey, tipData);
  });
});

class AttachmentTypePickerView extends View {
  static initClass() {
    this.prototype.viewTitleKey = 'attach from';

    this.prototype.events = {
      'click .js-google-drive-attachment:not(.disabled)':
        'openGoogleDriveFilePicker',
      'click .js-dropbox-attachment:not(.disabled)': 'openDropboxFilePicker',
      'click .js-one-drive-attachment:not(.disabled)': 'openOneDriveFilePicker',
      'click .js-box-attachment:not(.disabled)': 'openBoxFilePicker',
      'click .js-attach-card': 'attachCard',
      'change .js-attach-file': 'startUpload',
      'click .js-add-attachment-url': 'addUrl',
      'keydown .js-attachment-url': 'keydown',
      'keydown .js-attachment-name': 'keydown',
      'input .js-attachment-url': 'toggleAttachmentNameInput',
      'mouseenter .js-attachment-restricted': 'showRestrictedTooltip',
      'mouseleave .js-attachment-restricted': 'hideRestrictedTooltip',
      'click a[href^="/gold"]'() {
        return Analytics.sendClickedLinkEvent({
          linkName: 'goldLink',
          source: 'cardAttachmentPickerInlineDialog',
        });
      },
      'click a[href^="/business-class"]'() {
        return Analytics.sendClickedLinkEvent({
          linkName: 'businessClassLink',
          source: 'cardAttachmentPickerInlineDialog',
        });
      },
    };

    this.prototype._scripts = {
      dropbox: 'https://www.dropbox.com/static/api/1/dropbox.js',
      box: 'https://app.box.com/js/static/select.js',
      oneDrive: 'https://js.live.net/v7.0/OneDrive.js',
    };
  }

  initialize() {
    return this.listenTo(GoogleApi, 'loaded', this.render);
  }

  getCard() {
    if (this.model instanceof Card) {
      return this.model;
    } else {
      return this.model.getCard();
    }
  }

  getData() {
    // We're trying to delay loading these scripts, to reduce the chance that
    // they'll cause problems on the client; unfortunately we need to load them
    // prior to the user trying to upload a file from that service, otherwise
    // any popup windows they try to open will be blocked (i.e. if we try to
    // asynchronously load a script between the time they click and when we start
    // the associated picker)
    for (const key in this._scripts) {
      const scriptUrl = this._scripts[key];
      this._loadOnce(scriptUrl, function () {});
    }
  }

  render() {
    if (!this.getCard().canAttach()) {
      if (this.getCard().isOverLimit('attachments', 'perCard')) {
        this.$el.html(limitExceededTemplate('perCard'));
      } else if (
        this.getCard().getBoard().isOverLimit('attachments', 'perBoard')
      ) {
        this.$el.html(limitExceededTemplate('perBoard'));
      }
      return this;
    }

    const org = this.getCard()?.getBoard()?.getOrganization();
    const data = {
      id: this.getCard().id,
      hasLargeAttachments:
        Auth.me()?.hasPremiumFeature('largeAttachments') ||
        org?.hasPremiumFeature('largeAttachments') ||
        false,
      googleDriveReady: GoogleApi.loaded,
      defaultName: this.options.defaultName,
      restrictedAttachmentTypes:
        this.getCard()?.getBoard()?.getRestrictedAttachmentTypes() || [],
    };

    // Everyone can turn on power-ups now
    if (!(org != null && org.isFeatureEnabled('plugins'))) {
      data.tipKey = 'tip-you-can-attach-other-things-with-power-ups';
      data.tipData = {
        url:
          '/power-ups?utm_source=trello&utm_medium=inapp&utm_content=attachments-menu&utm_campaign=power-ups',
      };
    }

    this.$el.html(template(data));

    return this;
  }

  startUpload(e) {
    const $input = $(e.target);
    const $tooLarge = this.$('.js-file-too-large').hide();
    const files = _.toArray($input[0].files);
    const { options } = this;

    if (options.onStartUpload) {
      options.onStartUpload();
    }

    const org = this.getCard()?.getBoard()?.getOrganization();
    const upload =
      files.length > 0
        ? _.any(files, (file) => !Auth.me().canUploadAttachment(file, org))
          ? Promise.reject(FileTooLarge())
          : Promise.resolve(files).each((file) => {
              const source = 'cardAttachmentPickerInlineDialog';

              const analyticsPayload = {
                source,
                taskName: 'create-attachment/file',
              };

              const traceId = Analytics.startTask(analyticsPayload);
              analyticsPayload.traceId = traceId;

              // There may be an @options.defaultName, but we don't want to use
              // it because we want to keep the file extension
              const name = file.name || pastedFileName();
              return ninvoke(this.getCard(), 'upload', file, name, {
                traceId,
              }).then(
                (response) => {
                  if (traceId) {
                    Analytics.sendTrackEvent({
                      source,
                      action: 'uploaded',
                      actionSubject: 'attachment',
                      actionSubjectId: 'fileAttachment',
                      attributes: {
                        taskId: traceId,
                      },
                    });

                    Analytics.taskSucceeded(analyticsPayload);
                  }

                  return this.trigger('attach', {
                    mimeType: response.mimeType,
                    name: this.options.defaultName || name,
                    url: response.url,
                  });
                },
                (err) => {
                  if (traceId) {
                    analyticsPayload.error = err;
                    Analytics.taskFailed(analyticsPayload);
                  }

                  return Promise.reject(err);
                },
              );
            })
        : // Doesn't support the file API, use form based upload
          ninvoke(Util, 'uploadFile', Auth.myToken(), $input);

    return upload
      .then(function () {
        Analytics.sendOperationalEvent({
          action: 'completed',
          actionSubject: 'upload',
          source: 'cardAttachmentPickerInlineDialog',
        });
        Alerts.show('finished uploading', 'info', 'AjaxQueueUpload', 2000);
        PopOver.hide();
        if (options.onFinishUpload) {
          return options.onFinishUpload();
        }
      })
      .catch(FileTooLarge, function () {
        $tooLarge.show();
        if (options.onFinishUpload) {
          options.onFinishUpload();
        }
        return Analytics.sendOperationalEvent({
          action: 'errored',
          actionSubject: 'upload',
          source: 'cardAttachmentPickerInlineDialog',
          attributes: {
            reason: 'file too large',
          },
        });
      })
      .catch(LimitExceeded, () => {
        this.render();
        return Analytics.sendOperationalEvent({
          action: 'errored',
          actionSubject: 'upload',
          source: 'cardAttachmentPickerInlineDialog',
          attributes: {
            reason: 'limit exceeded',
          },
        });
      })
      .catch(TypeRestricted, () => {
        PopOver.hide();
        if (options.onFinishUpload) {
          options.onFinishUpload();
        }
        Alerts.show(
          'attachment upload restricted',
          'error',
          'attachment',
          5000,
        );
        return Analytics.sendOperationalEvent({
          action: 'errored',
          actionSubject: 'upload',
          source: 'cardAttachmentPickerInlineDialog',
          attributes: {
            reason: 'restricted by enterprise',
          },
        });
      })
      .catch(ApiError.NoResponse, () => {
        // There was a network error
        PopOver.hide();
        options.onFinishUpload?.();
        Alerts.show('unable to upload file', 'error', 'upload', 5000);
        return Analytics.sendOperationalEvent({
          action: 'errored',
          actionSubject: 'upload',
          source: 'cardAttachmentPickerInlineDialog',
          attributes: {
            reason: 'other',
          },
        });
      })
      .done();
  }

  _loadOnce(scriptUrl, next) {
    if (window._loadedScripts == null) {
      window._loadedScripts = {};
    }
    if (window._loadedScripts[scriptUrl]) {
      return next();
    }

    return $.getScript(scriptUrl, () => {
      window._loadedScripts[scriptUrl] = true;
      return next();
    });
  }

  attachLinks(type, objs, normalize) {
    if (!objs) {
      return;
    }
    this.$('.js-limit-exceeded').toggleClass('hide', true);
    this.options.onStartUpload && this.options.onStartUpload(this.model, type);

    PopOver.pushView({
      view: UploadingLinkView,
    });
    return Promise.resolve(objs)
      .call('map', normalize != null ? normalize : (o) => o)
      .each((file) => {
        const data = _.pick(file, 'url', 'mimeType', 'name');
        this.trigger('attach', data);
        return Promise.fromNode((next) =>
          this.getCard().uploadUrl(data, next),
        ).then((response) => {
          return Analytics.sendOperationalEvent({
            action: 'completed',
            actionSubject: 'upload',
            source: 'cardAttachmentPickerInlineDialog',
            attributes: {
              type,
            },
          });
        });
      })
      .then(() => {
        return PopOver.hide();
      })
      .catch(LimitExceeded, () => {
        PopOver.popView(); // Pop the `UploadingLinkView`
        this.render(); // Re-render to show the limit exceeded error
        return Analytics.sendOperationalEvent({
          action: 'errored',
          actionSubject: 'upload',
          source: 'cardAttachmentPickerInlineDialog',
          attributes: {
            reason: 'limit exceeded',
          },
        });
      })
      .catch(TypeRestricted, () => {
        Alerts.show('link type restricted', 'error', 'attachment', 5000);
        Analytics.sendOperationalEvent({
          action: 'errored',
          actionSubject: 'upload',
          source: 'cardAttachmentPickerInlineDialog',
          attributes: {
            reason: 'type restricted',
          },
        });
        return PopOver.hide();
      })
      .finally(() => {
        return (
          this.options.onFinishUpload &&
          this.options.onFinishUpload(this.model, type)
        );
      })
      .done();
  }

  openGoogleDriveFilePicker(e) {
    Util.stop(e);

    return ninvoke(gapi, 'load', 'picker')
      .then(function () {
        // If we received an oauth token in the past, we can do a background
        // request to refresh it, since it will not spawn a popup window.
        const refresh = GoogleApi.validToken();
        return ninvoke(GoogleApi, 'authorize', refresh);
      })
      .then((oauthToken) => {
        // Use a docs view that shows folders
        const docsView = new google.picker.DocsView();
        docsView.setIncludeFolders(true);

        const teamDrivesView = new google.picker.DocsView();
        teamDrivesView.setIncludeFolders(true);
        teamDrivesView.setSelectFolderEnabled(true);
        teamDrivesView.setEnableTeamDrives(true);

        const picker = new google.picker.PickerBuilder()
          .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
          .enableFeature(google.picker.Feature.SUPPORT_TEAM_DRIVES)
          .addView(docsView)
          .addView(teamDrivesView)
          .setOAuthToken(oauthToken)
          .setCallback((data) => {
            return this.attachLinks('Google drive file', data.docs, f.id);
          })
          .build();

        picker.setVisible(true);
        // Fix ridiculous google drive bug
        return $('iframe.picker-frame[src*=authserviceid]').attr(
          'src',
          function () {
            return $(this)
              .attr('src')
              .replace(/authserviceid/g, 'fixgoogle');
          },
        );
      })
      .catch((err) => {
        switch (err.message) {
          case 'popup_closed_by_user':
            // The user closed the popup before finishing the sign in flow.
            break;
          case 'access_denied':
            // The user denied the permission to the scopes required.
            break;
          default:
            throw err;
        }
      })
      .done();
  }

  openDropboxFilePicker(e) {
    Util.stop(e);

    this._loadOnce(this._scripts.dropbox, () => {
      Dropbox.init({ appKey: dropboxClientAppKey });
      Dropbox.choose({
        linkType: 'preview',
        iframe: true,
        success: (files) => {
          return this.attachLinks('Dropbox file', files, (file) => ({
            url: file.link,
            name: file.name,
          }));
        },
      });

      // The overlay that dropbox creates isn't scrollable, so if your window
      // isn't very tall you can't click the cancel button.  This hack fixes
      // this situation by finding the chooser iframe and making the parent
      // scrollable
      $('iframe[src^="https://www.dropbox.com/chooser"]')
        .parent()
        .css('overflow', 'auto');
    });
  }

  openOneDriveFilePicker(e) {
    Util.stop(e);

    this._loadOnce(this._scripts.oneDrive, () => {
      Promise.try(
        () =>
          new Promise(function (resolve, reject) {
            const { OneDrive } = window;
            return OneDrive.open({
              clientId: oneDriveClientId,
              action: 'share',
              multiSelect: true,
              // If this is false, it takes over the whole window … not an overlay
              openInNewWindow: true,
              success(response) {
                return resolve(response.value);
              },
              cancel() {
                return resolve([]);
              },
              error(err) {
                return reject(err);
              },
              advanced: {
                redirectUri: `${siteDomain}/onedrive_callback_7.html`,
              },
            });
          }),
      )
        .then((files) => {
          return this.attachLinks('OneDrive file', files, (file) => ({
            url: file.webUrl,
            name: file.name,
          }));
        })
        .done();
    });
  }

  openBoxFilePicker(e) {
    Util.stop(e);

    return this._loadOnce(this._scripts.box, () => {
      const boxSelect = new BoxSelect({
        clientId: boxClientId,
        linkType: 'shared',
        multiselect: true,
      });

      const boxSuccess = (files) => {
        boxSelect.unregister(boxSelect.SUCCESS_EVENT_TYPE, boxSuccess);
        return this.attachLinks('Box file', files, f.id);
      };

      boxSelect.success(boxSuccess);

      return boxSelect.launchPopup();
    });
  }

  keydown(e) {
    if (isSubmitEvent(e)) {
      return this.addUrl();
    }
  }

  addUrl(e) {
    let urls = this.$('.js-attachment-url').val().split(/\s+/);
    let name = this.$('.js-attachment-name').val();
    if (!/\S/.test(name)) {
      name = undefined;
    }

    urls = _.filter(urls, (url) => /\S/.test(url));

    if (!_.isEmpty(urls) && urls.length < 10) {
      this.attachLinks('link', urls, (url) => ({ url, name }));
    }
  }

  attachCard(e) {
    const trelloCompleterView = new TrelloCompleterView({
      model: this.model,
      card: this.model,
      modelCache: this.modelCache,
      button: true,
      onStartUpload: (item) => {
        let url;
        if (item instanceof Card) {
          url = item.get('url');
          return this.attachLinks('card', [{ url }]);
        } else if (item instanceof Board) {
          url = item.get('url');
          return this.attachLinks('board', [{ url }]);
        }
      },
    });

    return PopOver.pushView({
      view: trelloCompleterView,
    });
  }

  toggleAttachmentNameInput(e) {
    const url = $(e.currentTarget).val();
    const { type } = parseTrelloUrl(url);
    const isTrelloAttachment = ['board', 'card'].includes(type);
    const isEmpty = !/\S/.test(url);
    return this.$('.js-name-link').toggleClass(
      'hide',
      isTrelloAttachment || isEmpty,
    );
  }

  showRestrictedTooltip(e) {
    const $el = this.$(e.target);
    return Tooltip.show(
      t.l('attachment-type-restricted'),
      $el,
      false,
      Tooltip.STYLE.MENU,
    );
  }

  hideRestrictedTooltip() {
    return Tooltip.hide();
  }
}

AttachmentTypePickerView.initClass();
module.exports = AttachmentTypePickerView;
