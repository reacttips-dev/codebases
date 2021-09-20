/* eslint-disable
    eqeqeq,
    @typescript-eslint/no-use-before-define,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { Auth } = require('app/scripts/db/auth');
const { Util } = require('app/scripts/lib/util');
const _ = require('underscore');
const { isShortId } = require('@trello/shortlinks');
const { seesVersionedVariation } = require('@trello/feature-flag-client');

const getOrganizationName = function (org) {
  if (_.isString(org)) {
    return org;
  } else {
    return org.get('name');
  }
};

const getOrganizationUrl = (org) => `/${getOrganizationName(org)}`;

const _orgUrl = function (org, path, options) {
  if (options == null) {
    options = {};
  }
  let query = options.returnUrl
    ? (query = `?returnUrl=${encodeURIComponent(options.returnUrl)}`)
    : '';

  return `${getOrganizationUrl(org)}${path}${query}`;
};

module.exports.Urls = {
  getSearchUrl(query) {
    return `/search?q=${encodeURIComponent(query)}`;
  },

  getOrganizationName,

  getOrganizationUrl,

  getEnterpriseAdminDashboardUrl(enterpriseOrName, tab) {
    const name = _.isString(enterpriseOrName)
      ? enterpriseOrName
      : enterpriseOrName.get('name');
    if (tab != null) {
      return `/e/${name}/admin/${tab}`;
    } else {
      return `/e/${name}/admin`;
    }
  },

  getOrganizationMemberCardsUrl(org, username) {
    return this.getMemberCardsUrl(username, getOrganizationName(org));
  },
  getOrganizationAccountUrl(org) {
    return _orgUrl(org, '/account');
  },
  getOrganizationBillingUrl(org, options) {
    return _orgUrl(org, '/billing', options);
  },
  getOrganizationExportUrl(org) {
    return _orgUrl(org, '/export');
  },
  getOrganizationMembersUrl(org) {
    return _orgUrl(org, '/members');
  },
  getOrganizationTablesUrl(org) {
    const isOrganizationDefaultViewsEnabled = seesVersionedVariation(
      'remarkable.default-views',
      'alpha',
    );

    return _orgUrl(
      org,
      isOrganizationDefaultViewsEnabled ? '/views/table' : '/tables',
    );
  },
  getOrganizationFreeTrialUrl(org) {
    return _orgUrl(org, '/free-trial');
  },
  getOrganizationReportsUrl(org) {
    return _orgUrl(org, '/reports');
  },
  getOrganizationGuestUrl(org) {
    return _orgUrl(org, '/members/guests');
  },
  getOrganizationPowerUpsUrl(org) {
    return _orgUrl(org, '/power-ups');
  },
  getWorkspaceDefaultMyWorkViewUrl(org) {
    return _orgUrl(org, '/views/my-work');
  },
  getWorkspaceDefaultCustomViewUrl(org) {
    return _orgUrl(org, '/views/table');
  },
  getWorkspaceDefaultCustomCalendarViewUrl(org) {
    return _orgUrl(org, '/views/calendar');
  },

  getBoardUrl(idBoard, section, extra) {
    // Dependency required at call site to avoid import cycles, do not lift to top of module
    let baseUrl, url;
    if (extra == null) {
      extra = [];
    }
    const { ModelCache } = require('app/scripts/db/model-cache');

    if ((idBoard != null ? idBoard.id : undefined) != null) {
      idBoard = idBoard.id;
    }

    const board = ModelCache.get('Board', idBoard);

    if ((url = board != null ? board.get('url') : undefined) != null) {
      baseUrl = Util.relativeUrl(url);
    } else {
      const name = board != null ? board.get('name') : undefined;

      baseUrl = name
        ? `/board/${Util.makeSlug(name)}/${idBoard}`
        : `/board/${idBoard}`;
    }

    if (section) {
      baseUrl += `/${section}`;
    }

    for (const part of Array.from(extra)) {
      baseUrl += `/${part}`;
    }

    return baseUrl;
  },

  getBoardShortUrl(idBoard, section) {
    // Dependency required at call site to avoid import cycles, do not lift to top of module
    let baseUrl, shortUrl;
    const { ModelCache } = require('app/scripts/db/model-cache');

    if ((idBoard != null ? idBoard.id : undefined) != null) {
      idBoard = idBoard.id;
    }

    const board = ModelCache.get('Board', idBoard);

    if (
      (shortUrl = board != null ? board.get('shortUrl') : undefined) != null
    ) {
      baseUrl = Util.relativeUrl(shortUrl);
    } else {
      const shortLink = board != null ? board.get('shortLink') : undefined;

      baseUrl = `/b/${shortLink}`;
    }

    if (section) {
      baseUrl += `/${section}`;
    }

    return baseUrl;
  },

  getBoardPowerUpsUrl(board) {
    return this.getBoardUrl(board) + '/power-ups';
  },

  getUpgradeUrl(board) {
    let org;
    if ((org = board.getOrganization()) != null) {
      return this.getOrganizationBillingUrl(org);
    } else {
      return '/business-class';
    }
  },

  getBoardPowerUpsUpgradeUrl(board) {
    let org;
    if ((org = board.getOrganization()) != null) {
      return this.getOrganizationBillingUrl(org, {
        returnUrl: this.getBoardPowerUpsUrl(board),
      });
    } else {
      return '/business-class';
    }
  },

  getTeamOnboardingUrl(org) {
    return _orgUrl(org, '/getting-started');
  },
  getMemberBoardProfileUrl(username, idBoard) {
    return [this.getBoardUrl(idBoard), 'member', username].join('/');
  },
  getMemberProfileUrl(username) {
    if (username == null) {
      username = Auth.myUsername();
    }
    return `/${username}`;
  },
  getMemberBoardsUrl(
    username,
    orgname,
    showHomeBoardsTab,
    templatesData,
    showGettingStarted,
  ) {
    if (username == null) {
      username = Auth.myUsername();
    }
    if (orgname) {
      return this.getMemberOrgUrl(
        orgname,
        showHomeBoardsTab,
        showGettingStarted,
      );
    } else if (showHomeBoardsTab) {
      return `/${username}/boards`;
    } else if (templatesData) {
      let templatesUrl = '/templates';
      if (templatesData.category) {
        templatesUrl += `/${templatesData.category}`;
      }
      if (templatesData.templateSlug) {
        templatesUrl += `/${templatesData.templateSlug}`;
      }
      if (templatesData.referrerUsername) {
        return (templatesUrl += `/${templatesData.referrerUsername}/recommend`);
      }
    } else {
      return '/';
    }
  },
  getMemberOrgUrl(orgname, showHomeBoardsTab, showGettingStarted) {
    if (showHomeBoardsTab) {
      return `/${orgname}/home`;
    } else if (showGettingStarted) {
      return `/${orgname}/getting-started`;
    } else {
      return `/${orgname}/highlights`;
    }
  },

  getMemberCardsUrl(username, orgname) {
    if (username == null) {
      username = Auth.myUsername();
    }
    if (orgname) {
      return `/${username}/cards/${orgname}`;
    } else {
      return `/${username}/cards`;
    }
  },
  getMemberAccountUrl(username) {
    if (username == null) {
      username = Auth.myUsername();
    }
    return `/${username}/account`;
  },
  getMemberBillingUrl(username) {
    if (username == null) {
      username = Auth.myUsername();
    }
    return `/${username}/billing`;
  },
  getMemberActivityUrl(username) {
    if (username == null) {
      username = Auth.myUsername();
    }
    return `/${username}/activity`;
  },

  getCardUrl(card, highlight, replyToComment) {
    const baseUrl = (() => {
      let url;
      if ((url = card.get('url')) != null) {
        return Util.relativeUrl(url);
      } else {
        let left;
        const idBoard = card.get('idBoard');
        const idCard = (left = card.get('idShort')) != null ? left : card.id;
        const card_name = card.get('name');

        if (idCard == null) {
          return null;
        } else if (isShortId(idCard)) {
          return `/card/${Util.makeSlug(card_name)}/${idBoard}/${idCard}`;
        } else {
          return `/card/board/${Util.makeSlug(card_name)}/${idBoard}/${idCard}`;
        }
      }
    })();

    if (replyToComment) {
      return [baseUrl, `replyToComment=${replyToComment}`].join('?');
    } else if (highlight) {
      return [baseUrl, highlight].join('#');
    } else {
      return baseUrl;
    }
  },

  getCardUrlWithoutModels(idBoard, idCard, card_name) {
    if (idCard == null) {
      return null;
    } else if (isShortId(idCard)) {
      return `/card/${Util.makeSlug(card_name)}/${idBoard}/${idCard}`;
    } else {
      return `/card/board/${Util.makeSlug(card_name)}/${idBoard}/${idCard}`;
    }
  },

  getBoardInvitationLinkUrl(board, secret) {
    return `/invite/b/${board.get('shortLink')}/${secret}/${Util.makeSlug(
      board.get('name'),
    )}`;
  },

  getOrganizationInvitationLinkUrl(org, secret) {
    return `/invite/${org.get('name')}/${secret}`;
  },

  getActionUrl(action) {
    let cardData;
    const prefix = action.isCommentLike() ? 'comment' : 'action';

    const highlight = [prefix, action.id].join('-');

    const card = action.getCard();
    if (card) {
      return this.getCardUrl(card, highlight);
    } else if ((cardData = action.get('data').card) != null) {
      // We don't have the card model.  This commonly happens if the card this
      // is an action for has been archived and wasn't loaded.
      return [`/c/${cardData.shortLink}/`, highlight].join('#');
    } else {
      return null;
    }
  },

  getWorkspaceViewUrl({ shortLink, name }) {
    return name ? `/v/${shortLink}/${Util.makeSlug(name)}` : `/v/${shortLink}`;
  },
};
