/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS104: Avoid inline assignments
 * DS201: Simplify complex destructure assignments
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const $ = require('jquery');
const { EntityDisplay } = require('app/scripts/lib/entity-display');
const { idCache } = require('@trello/shortlinks');
const { ModelLoader } = require('app/scripts/db/model-loader');
const Promise = require('bluebird');
const TFM = require('app/scripts/lib/markdown/tfm');
const TrelloMarkdown = require('@atlassian/trello-markdown');
const { Util } = require('app/scripts/lib/util');
const _ = require('underscore');
const templates = require('app/scripts/views/internal/templates');
const { truncate } = require('@trello/strings');
const { l } = require('app/scripts/lib/localize');
const parseURL = require('url-parse');
const xtend = require('xtend');
const { ApiError } = require('app/scripts/network/api-error');
const { drawFavicon } = require('app/scripts/lib/draw-favicon');
const { Backgrounds } = require('app/scripts/data/backgrounds');
const {
  objectResolverClient,
} = require('app/scripts/network/object-resolver-client');

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined;
}

const execMatch = function (match, url) {
  if (url == null) {
    return null;
  }

  const parsed = parseURL(url);
  let matchedValues = [url];

  for (const attr in match) {
    const expected = match[attr];
    if (_.isString(expected)) {
      if (expected !== parsed[attr]) {
        return null;
      }
    } else if (_.isRegExp(expected)) {
      let results;
      if ((results = expected.exec(parsed[attr])) != null) {
        matchedValues = matchedValues.concat(results.slice(1));
      } else {
        return null;
      }
    } else {
      throw Error('invalid specification');
    }
  }

  return matchedValues;
};

const requestCache = {};
const cachedModelLoad = ({ key, fromModelCache, fromApi }) => {
  const modelFromCache = fromModelCache();
  if (modelFromCache != null) {
    return Promise.resolve(modelFromCache);
  }

  return requestCache[key] != null
    ? requestCache[key]
    : (requestCache[key] = fromApi()
        .tap(() => delete requestCache[key])
        .catch(ApiError.NotFound, ApiError.Unauthorized, () => {
          // Keep these negative hits in the requestCache to avoid
          // retrying the API
          setTimeout(() => {
            return delete requestCache[key];
          }, Util.getMs({ minutes: 5 }));

          return undefined;
        }));
};

const cachedLoadCardLinkData = (idCard, modelCache) =>
  cachedModelLoad({
    key: `cardLinkData-${idCard}`,
    fromModelCache() {
      return modelCache.get('Card', idCard);
    },
    fromApi() {
      return ModelLoader.loadCardLinkData(idCard);
    },
  });
const drawBoardIcon = (prefs) => {
  let left;
  const { backgroundImageScaled, backgroundImage, background } = prefs;

  const hexColor =
    Backgrounds[background] != null ? Backgrounds[background].color : undefined;

  const smallUrl =
    (left = __guard__(
      Util.smallestPreviewBiggerThan(backgroundImageScaled, 64, 64),
      (x) => x.url,
    )) != null
      ? left
      : backgroundImage;

  return Promise.try(() => {
    if (smallUrl != null) {
      return new Promise((resolve, reject) => {
        const img = document.createElement('img');
        img.setAttribute('crossorigin', 'anonymous');
        img.onload = () => resolve(img);
        img.onerror = () => reject();
        return (img.src = `${smallUrl}?favicon`);
      });
    }
  }).then((img) => {
    return drawFavicon(img, { url: smallUrl, color: hexColor });
  });
};

const boardIconCache = {};
const boardIconCachedLoad = ({ key, fallback, fromModelCache, fromApi }) => {
  if (boardIconCache[key] != null) {
    return boardIconCache[key];
  }

  const modelFromCache = fromModelCache();
  const prefs =
    modelFromCache != null ? modelFromCache.get('prefs') : undefined;

  if ((prefs != null ? prefs.background : undefined) != null) {
    return (boardIconCache[key] = drawBoardIcon(prefs).catch(() => {
      return fallback;
    }));
  }

  return (boardIconCache[key] = fromApi()
    .tap(() => delete boardIconCache[key])
    .then((loadedPrefs) => {
      if (loadedPrefs) {
        return drawBoardIcon(loadedPrefs);
      } else {
        return fallback;
      }
    })
    .catch(ApiError.NotFound, ApiError.Unauthorized, () => {
      // Keep these negative hits in the boardIconCache to avoid
      // retrying the API
      setTimeout(() => {
        return delete boardIconCache[key];
      }, Util.getMs({ minutes: 5 }));
      return fallback;
    })
    .catch(() => {
      return fallback;
    }));
};

module.exports.KnownServices = new ((function () {
  const Cls = class {
    static initClass() {
      this.prototype._knownUrls = [
        {
          key: 'trello board',
          match: {
            protocol: location.protocol,
            host: location.host,
            pathname: new RegExp(`\
^\
/b/\
(\
[a-zA-Z0-9]{8}|\
[a-fA-F0-9]{24}\
)\
(?:$|/.*)\
`),
          },
          previewClass: 'attachment-thumbnail-preview-trello-logo',
          getIcon(...args) {
            const [, shortLink] = Array.from(args[0]),
              modelCache = args[1];
            return boardIconCachedLoad({
              key: shortLink,
              fallback: require('resources/images/services/trello.png'),
              fromModelCache() {
                return modelCache.get('Board', idCache.getBoardId(shortLink));
              },
              fromApi() {
                return ModelLoader.loadBoardPrefs(shortLink);
              },
            });
          },
          getText(...args) {
            const [fullUrl, shortLink] = Array.from(args[0]),
              modelCache = args[1];
            return cachedModelLoad({
              key: shortLink,
              fromModelCache() {
                return __guard__(
                  modelCache.get('Board', idCache.getBoardId(shortLink)),
                  (x) => x.get('name'),
                );
              },
              fromApi() {
                return ModelLoader.loadBoardName(shortLink);
              },
            }).then((name) => (name != null ? name : fullUrl));
          },
        },
        {
          key: 'trello action',
          match: {
            protocol: location.protocol,
            host: location.host,
            pathname: new RegExp(`\
^\
/c/\
(\
[a-zA-Z0-9]{8}|\
[a-fA-F0-9]{24}\
)\
(?:$|/.*)\
`),
            hash: new RegExp(`\
^\
\\#(?:comment|action)-([0-9a-f]{24})\
$\
`),
          },
          previewClass: 'attachment-thumbnail-preview-trello-logo',
          getShared(...args) {
            const [, , idAction] = Array.from(args[0]),
              modelCache = args[1];
            return Promise.try(function () {
              let left;
              return (left = modelCache.get('Action', idAction)) != null
                ? left
                : ModelLoader.loadAction(idAction).catch(
                    ApiError,
                    function () {},
                  );
            }).then(function (action) {
              if (action != null) {
                return {
                  action,
                  memberCreator: modelCache.get(
                    'Member',
                    action.get('idMemberCreator'),
                  ),
                };
              } else {
                return {};
              }
            });
          },

          getIcon(...args) {
            let avatarUrl;
            const shared = args[2];
            const { memberCreator } = shared;
            if (
              (avatarUrl =
                memberCreator != null
                  ? memberCreator.get('avatarUrl')
                  : undefined) != null
            ) {
              return [avatarUrl, '30.png'].join('/');
            } else {
              return require('resources/images/services/trello.png');
            }
          },

          getText(...args) {
            const [fullUrl] = Array.from(args[0]),
              shared = args[2];
            const { action } = shared;

            if (action == null) {
              return fullUrl;
            }

            const text = _.chain(
              new EntityDisplay('action').getEntities(
                action.getDisplay(),
                __guard__(action.get('data').card, (x) => x.id),
              ),
            )
              .map(function ({ type, text }) {
                if (type === 'member' && action.isCommentLike()) {
                  return text + ':';
                } else if (type === 'comment') {
                  return TFM.comments.textInline(text);
                } else {
                  return text;
                }
              })
              .join('')
              .value();

            return truncate(text, 64);
          },
        },
        {
          key: 'trello card',
          match: {
            protocol: location.protocol,
            host: location.host,
            pathname: new RegExp(`\
^\
/c/\
(\
[a-zA-Z0-9]{8}|\
[a-fA-F0-9]{24}\
)\
(?:$|/.*)\
`),
          },
          previewClass: 'attachment-thumbnail-preview-trello-logo',
          getIcon(...args) {
            const [, shortLink] = Array.from(args[0]),
              modelCache = args[1];
            return cachedLoadCardLinkData(shortLink, modelCache).then(function (
              card,
            ) {
              const fallback = require('resources/images/services/trello.png');
              if (!card) {
                return fallback;
              }

              const idBoard = card.get('idBoard');
              return boardIconCachedLoad({
                key: idBoard,
                fallback,
                fromModelCache() {
                  return modelCache.get('Board', idBoard);
                },
                fromApi() {
                  return ModelLoader.loadBoardPrefs(idBoard);
                },
              });
            });
          },
          getText(...args) {
            const [fullUrl, shortLink] = Array.from(args[0]),
              modelCache = args[1];
            return cachedLoadCardLinkData(shortLink, modelCache).then(function (
              card,
            ) {
              let left;
              return (left = card != null ? card.get('name') : undefined) !=
                null
                ? left
                : fullUrl;
            });
          },
        },
        {
          key: 'fogbugz case',
          match: {
            protocol: /^https?:$/,
            host: /^([^.]+)\.fogbugz\.com$/,
            pathname: new RegExp(`\
^\
/f/cases/\
([\\d]+)\
`),
          },
          previewClass: 'attachment-thumbnail-preview-fogbugz-logo',
          icon: require('resources/images/services/fogbugz.png'),
          getArgs(...args) {
            const [, , caseNumber] = Array.from(args[0]);
            return { caseNumber };
          },
        },
        {
          key: 'kiln commit',
          match: {
            protocol: /^https?:$/,
            host: new RegExp(
              `^([^\\.]+)\\.(?:fogbugz\\.com/kiln|kilnhg\\.com)$`,
            ),
            pathname: new RegExp(`\
^\
/Code/\
([^/]+)\
/\
([^/]+)\
/\
([^/]+)\
/History/\
([^/]+)\
`),
          },
          previewClass: 'attachment-thumbnail-preview-kiln-logo',
          icon: require('resources/images/services/kiln.png'),
          getText(...args) {
            const [, , project, repo, branch, hash] = Array.from(args[0]);
            if (repo === 'Group') {
              return `${project} » ${branch}: ${hash}`;
            } else {
              return `${project} » ${repo} » ${branch}: ${hash}`;
            }
          },
          dataUrl(url) {
            return url.replace(new RegExp(`/Code/`), '/trello/Code/');
          },

          _processJSON(url, json) {
            if (json.reviews != null) {
              for (const review of Array.from(json.reviews)) {
                review.status = l([
                  'known services',
                  'kiln commit',
                  'status',
                  review.sStatus,
                ]);
                review.url = url.replace(
                  new RegExp(`/Code/.*$`),
                  `/Review/${review.sReview}`,
                );
              }
            }

            if (json.sAuthor) {
              // Remove the email address from "John Doe <john@doe.org>"
              json.author = json.sAuthor.replace(/\s<.*$/, '');
            }

            if (json.hash) {
              json.shortHash = json.hash.substr(0, 6);
            }

            if (json.sDescription) {
              const inlineFormatter = new TrelloMarkdown({
                restrict: {
                  block: ['paragraph', 'newline'],
                  inline: ['break', 'email', 'emoji', 'url'],
                },
              });
              json.shortCommitMessage = json.sDescription.split('\n')[0];
              json.commitMessageHtml = inlineFormatter.format(
                json.sDescription,
              ).output;
            }

            json.url = url;
            return json;
          },

          previewHtml(url, json) {
            return templates.fill(
              require('app/scripts/views/templates/kiln_changeset_preview'),
              this._processJSON(url, json),
            );
          },

          previewHtmlError(url, error) {
            if (/unable to access/i.test(error)) {
              url = __guard__(
                new RegExp(`^https?://[-a-z0-9\\.]+(/kiln)?`).exec(url),
                (x) => x[0],
              );
              return {
                login: l('known services.kiln commit.error'),
              };
            } else {
              return null;
            }
          },

          thumbnailHtml(url, json, data) {
            return templates.fill(
              require('app/scripts/views/templates/kiln_changeset_thumbnail'),
              xtend(this._processJSON(url, json), data),
            );
          },
        },
        {
          key: 'github commit',
          match: {
            protocol: 'https:',
            host: 'github.com',
            pathname: new RegExp(`\
^\
/\
([^/]+)/\
([^/]+)/\
commit/\
([^/]{7,40})\
$\
`),
          },
          previewClass: 'attachment-thumbnail-preview-github-logo',
          icon: require('resources/images/services/github.png'),
          getText(...args) {
            const [, user, repo, hash] = Array.from(args[0]);
            return `${user}/${repo}: ${hash.substr(0, 7)}`;
          },
        },
        {
          key: 'github issue',
          match: {
            protocol: 'https:',
            host: 'github.com',
            pathname: new RegExp(`\
^\
/\
([^/]+)/\
([^/]+)/\
issues/\
(\\d+)\
$\
`),
          },
          previewClass: 'attachment-thumbnail-preview-github-logo',
          icon: require('resources/images/services/github.png'),
          getArgs(...args) {
            const [, user, repo, number] = Array.from(args[0]);
            return { user, repo, number };
          },
        },
        {
          name: 'GitHub Pull Request',
          match: {
            protocol: 'https:',
            host: 'github.com',
            pathname: new RegExp(`\
^\
/\
([^/]+)/\
([^/]+)/\
pull/\
(\\d+)\
$\
`),
          },
          previewClass: 'attachment-thumbnail-preview-github-logo',
          icon: require('resources/images/services/github.png'),
          getArgs(...args) {
            const [, user, repo, number] = Array.from(args[0]);
            return { user, repo, number };
          },
          getText(...args) {
            const [, user, repo, number] = Array.from(args[0]);
            return `${user}/${repo}: Pull Request ${number}`;
          },
        },
      ];
    }

    getPreviewClass(productName) {
      switch (false) {
        case productName !== 'Confluence':
          return 'attachment-thumbnail-preview-confluence-logo';
        case productName !== 'Jira':
          return 'attachment-thumbnail-preview-jira-logo';
        case productName !== 'Bitbucket' && productName !== 'git':
          return 'attachment-thumbnail-preview-bitbucket-logo';
        default:
          return undefined;
      }
    }

    getIcon(productName, resourceType) {
      switch (false) {
        case productName !== 'Confluence':
          if (resourceType === 'page') {
            return require('resources/images/services/confluence-page-preview.svg');
          }
          if (resourceType === 'blog') {
            return require('resources/images/services/confluence-blog-preview.svg');
          }
          return require('resources/images/services/confluence-mark-gradient-blue.svg');
        case productName !== 'Jira':
          return require('resources/images/services/jira-mark-gradient-blue.svg');
        case productName !== 'Bitbucket' && productName !== 'git':
          return require('resources/images/services/bitbucket-mark-contained-gradient-blue.svg');
        default:
          return undefined;
      }
    }

    interpretWithObjectResolverService(url, options) {
      const { sourceComponent } = options;
      return objectResolverClient
        .resolveUrl(url, {
          sourceComponent,
        })
        .then((resolvedObject) => {
          if (
            (resolvedObject != null ? resolvedObject.data : undefined) == null
          ) {
            return null;
          }

          const { data, meta } = resolvedObject;
          const name = data.name || data.url || url;
          const icon =
            (data.icon != null ? data.icon.url : undefined) ||
            __guard__(
              data.generator != null ? data.generator.icon : undefined,
              (x) => x.url,
            ) ||
            this.getIcon(
              data.generator != null ? data.generator.name : undefined,
              meta?.resourceType,
            );
          if (!(name && icon)) {
            // If we don't have both a name and icon, just render the link normally
            return null;
          }
          return {
            meta,
            name,
            text: name,
            previewClass: this.getPreviewClass(
              data.generator != null ? data.generator.name : undefined,
            ),
            application: data?.generator?.name,
            tag: data?.tag,
            icon,
            url,
          };
        })
        .catch((e) => null);
    }

    interpret(url, modelCache, options = {}) {
      for (const entry of Array.from(this._knownUrls)) {
        let parts;
        if ((parts = execMatch(entry.match, url)) != null) {
          return (function (entry) {
            let { name, icon } = entry;
            const {
              key,
              getText,
              getArgs,
              previewClass,
              getShared,
              getIcon,
            } = entry;
            return Promise.resolve(
              typeof getShared === 'function'
                ? getShared(parts, modelCache)
                : undefined,
            ).then(function (shared) {
              const text = (() => {
                if (getText != null) {
                  return getText(parts, modelCache, shared);
                } else {
                  let left;
                  const args =
                    (left =
                      typeof getArgs === 'function'
                        ? getArgs(parts, modelCache)
                        : undefined) != null
                      ? left
                      : {};
                  return l(['known services', key, 'text'], args);
                }
              })();

              if (getIcon != null) {
                icon = getIcon(parts, modelCache, shared);
              }

              if (name == null) {
                name = l(['known services', key, 'name']);
              }

              return Promise.props({
                name,
                previewClass,
                icon,
                text,
                type: entry.key,
              });
            });
          })(entry);
        }
      }

      const { sourceComponent } = options;

      return Promise.resolve(
        this.interpretWithObjectResolverService(url, {
          sourceComponent,
        }),
      );
    }

    _runHandler(name, url, ...rest) {
      const adjustedLength = Math.max(rest.length, 1),
        args = rest.slice(0, adjustedLength - 1),
        next = rest[adjustedLength - 1];
      for (const known of Array.from(this._knownUrls)) {
        if (execMatch(known.match, url) != null && known[name] != null) {
          const { dataUrl } = known;
          $.ajax({
            url: dataUrl(url),
            xhrFields: { withCredentials: true },
            headers: { 'X-Trello': "Is it me you're looking for?" },
            success(json) {
              return next(null, known[name](url, json, ...Array.from(args)));
            },
            error(xhr, error, errorText) {
              const errorHandler = `${name}Error`;
              const loadError =
                typeof known[errorHandler] === 'function'
                  ? known[errorHandler](url, errorText, ...Array.from(args))
                  : undefined;
              return next(loadError != null ? loadError : 'could not load');
            },
          });
          return;
        }
      }
      next();
    }

    previewHtml(url, next) {
      return this._runHandler('previewHtml', url, next);
    }

    thumbnailHtml(url, data, next) {
      return this._runHandler('thumbnailHtml', url, data, next);
    }
  };
  Cls.initClass();
  return Cls;
})())();
