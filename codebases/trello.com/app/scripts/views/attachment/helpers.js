/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS204: Change includes calls to have a more natural evaluation order
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const Format = require('app/scripts/lib/markdown/format');
const { KnownServices } = require('app/scripts/db/known-services');
const { tryBabble } = require('app/scripts/lib/try-babble');
const { Util } = require('app/scripts/lib/util');
const Promise = require('bluebird');
const xtend = require('xtend');
const _ = require('underscore');
const { l } = require('app/scripts/lib/localize');
const parseURL = require('url-parse');
const {
  isTrelloAttachment,
} = require('app/scripts/lib/util/url/is-trello-attachment');
const Browser = require('@trello/browser');

module.exports = (function () {
  return {
    getAttachmentData(attachment) {
      const attachmentName = attachment.get('name');
      const attachmentUrl = attachment.get('url');
      const serviceKey = attachment.getServiceKey();

      let promise;
      if (serviceKey === 'trello') {
        // Explicitly don't send trello attachments through the known services
        // interpretation - we already generate previews for these, and don't
        // want to send them through a platform service.
        promise = Promise.resolve();
      } else {
        promise = KnownServices.interpret(
          attachmentUrl,
          attachment.modelCache,
          {
            sourceComponent: 'attachments',
          },
        );
      }

      return promise
        .then((known) => {
          if (known != null) {
            let name = attachmentName || known.text;
            if (name === attachmentUrl) {
              name = known.text;
            }
            return {
              isKnownService: true,
              meta: known.name,
              previewClass: known.previewClass,
              name,
              type: known.type,
            };
          }

          switch (serviceKey) {
            case 'trello':
              return {
                meta: Format.bytes(attachment.get('bytes')),
                openText: l('attachments.trello.open'),
                openIconClass: 'external-link',
                isExternal: false,
              };
            case 'gdrive':
              return {
                meta: tryBabble(['mime', attachment.get('mimeType')]),
                previewClass: 'attachment-thumbnail-preview-google-drive-logo',
              };
            case 'dropbox':
              return {
                previewClass: 'attachment-thumbnail-preview-dropbox-logo',
              };
            case 'onedrive':
              return {
                previewClass: 'attachment-thumbnail-preview-one-drive-logo',
              };
            case 'box':
              return { previewClass: 'attachment-thumbnail-preview-box-logo' };
            case 'other':
              return { ext: 'LINK' };
            default:
              return {};
          }
        })
        .then(function (thumbnailData) {
          const data = xtend(
            {
              isKnownService: false,
              isExternal: true,
              openIconClass: 'external-link',
            },
            attachment.toJSON(),
            thumbnailData,
          );

          // Only try to evaluate these if they haven't already been set
          if (data.meta == null) {
            data.meta = l(['attachments', serviceKey, 'type']);
          }
          if (data.openText == null) {
            data.openText = l(['attachments', serviceKey, 'open']);
          }
          if (data.removeText == null) {
            data.removeText = l(['attachments', serviceKey, 'remove']);
          }

          if (!data.name) {
            data.name = data.url;
          }

          if (data.ext == null) {
            data.ext = Util.fileExt(parseURL(attachmentUrl).pathname);
            // we probably guessed wrong in this case
            if (data.ext != null && data.ext.length > 6) {
              data.ext = null;
            }
          }

          return data;
        });
    },

    availableExts() {
      if (this._availableExts == null) {
        let exts = [];
        for (const mimetype of Array.from(navigator.mimeTypes)) {
          exts = exts.concat(mimetype.suffixes.split(','));
        }

        this._availableExts = _.compact(_.uniq(exts));
      }

      return this._availableExts;
    },

    imageExts() {
      return ['bmp', 'gif', 'jpeg', 'jpg', 'png', 'svg', 'webp'];
    },

    getPlayableExts(codecs, mediaType) {
      // You can pass a mime type to canPlayType on a audio or video element to
      // detect if it can be played. http://stackoverflow.com/questions/7451635

      const testEl = document.createElement(mediaType);

      return _.chain(codecs)
        .filter(({ types }) =>
          _.any(types, (t) => '' !== testEl.canPlayType(t)),
        )
        .pluck('exts')
        .flatten()
        .value();
    },

    audioExts() {
      if (this._audioExts) {
        return this._audioExts;
      }

      const codecs = [
        { exts: ['m4a'], types: ['audio/x-m4a;', 'audio/aac;'] },
        { exts: ['mp3'], types: ['audio/mpeg;'] },
        { exts: ['opus'], types: ['audio/ogg; codecs="opus"'] },
        { exts: ['ogg'], types: ['audio/ogg; codecs="vorbis"'] },
        { exts: ['wav'], types: ['audio/wav; codecs="1"'] },
      ];

      return (this._audioExts = this.getPlayableExts(codecs, 'audio'));
    },

    videoExts() {
      if (this._videoExts) {
        return this._videoExts;
      }

      const codecs = [
        { exts: ['mp4'], types: ['video/mp4; codecs="mp4v.20.8"'] },
        {
          exts: ['mov', 'h264'],
          types: [
            'video/mp4; codecs="avc1.42E01E"',
            'video/mp4; codecs="avc1.42E01E, mp4a.40.2"',
          ],
        },
        { exts: ['ogv'], types: ['video/ogg; codecs="theora"'] },
        { exts: ['webm'], types: ['video/webm; codecs="vp8, vorbis"'] },
      ];

      return (this._videoExts = this.getPlayableExts(codecs, 'video'));
    },

    googleViewerableExts() {
      // https://support.google.com/drive/answer/2423485?p=docs_viewer&rd=1
      let needle;
      const defaultExts = ['doc', 'docx', 'ppt', 'pptx', 'rtf', 'xls', 'xlsx'];

      // if you can't natively view pdfs, show them in google viewer.
      if (
        !((needle = 'pdf'), Array.from(this.availableExts()).includes(needle))
      ) {
        defaultExts.push('pdf');
      }

      return this._googleViewerableExts != null
        ? this._googleViewerableExts
        : (this._googleViewerableExts = defaultExts);
    },

    iFrameableExts() {
      const defaultExts = ['css', 'js', 'txt'];

      // NOTE: We know that using <iframe src="foo.pdf"></iframe> will possibly allow
      // the PDF to run some limited script.  The script runs on a different origin, so
      // it's not really a terrible risk.  There is the possibility that the PDF will
      // display an alert, which is maybe annoying.  (Because we load the whole carosel
      // the script may get run even if the user is previewing another attachment)
      //
      // We attempted to address this by always using Google's viewer, but that resulted
      // in a lot of PDFs being unviewable for unknown reasons (possibly because they
      // were too large, or too complicated) and caused more of a support problem than
      // the theoretical security issue it was trying to fix.
      //
      // We may be able to resolve this someday by using the atlassian media viewer
      const tryExts = ['pdf'];

      return this._iFrameableExts != null
        ? this._iFrameableExts
        : (this._iFrameableExts = _.intersection(
            tryExts,
            this.availableExts(),
          ).concat(defaultExts));
    },

    allViewerableExts({ excludeGoogleExts = false } = {}) {
      return [
        ...this.imageExts(),
        ...this.audioExts(),
        ...this.videoExts(),
        ...(excludeGoogleExts ? [] : this.googleViewerableExts()),
        ...this.iFrameableExts(),
      ];
    },

    isViewerable(url) {
      let pathname;
      try {
        pathname = new URL(url).pathname;
      } catch (ignored) {
        // If we aren't able to parse the URL, it isn't viewerable
        return false;
      }

      const fileExtension = Util.fileExt(pathname);
      const isTouch = Browser.isTouch();

      const isAuthAttachmentLink = /^\/1\/cards\/[a-f0-9]{24}\/attachments\/[a-f0-9]{24}\/download\/.*/.test(
        pathname,
      );

      const isViewerableExtension = this.allViewerableExts({
        excludeGoogleExts: isAuthAttachmentLink,
      }).includes(fileExtension);

      const _isTrelloAttachment = isTrelloAttachment(url);

      return !isTouch && _isTrelloAttachment && isViewerableExtension;
    },

    stripAndShortenName(name) {
      let nameShortened = false;
      let newName = name.replace(/\s+/g, ' ').trim();
      if (newName.length > 256) {
        newName = newName.substring(0, 256);
        nameShortened = true;
      }
      return { newName, nameShortened };
    },

    validateUrlAndName(url, name, originalUrl, originalName, type) {
      let canUpdate = false;
      let newName = originalName;

      // case of no protocol in url from edit attachment input
      const parsed = parseURL(url, {});
      if (!parsed.protocol) {
        url = parsed.set('protocol', 'http:').href;
      }

      if (type === 'other') {
        if (parsed.hostname && url.length > 0) {
          if (name.length === 0) {
            newName = url;
          } else {
            if (originalUrl === originalName && originalName === name) {
              newName = url;
            } else {
              newName = name;
            }
          }
          canUpdate = true;
        }
      } else {
        if (name.length > 0) {
          newName = name;
          canUpdate = true;
        }
      }

      return { newName, canUpdate, newUrl: url };
    },
  };
})();
