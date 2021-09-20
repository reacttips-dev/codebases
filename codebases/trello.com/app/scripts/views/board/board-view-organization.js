/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const $ = require('jquery');
const { Analytics } = require('@trello/atlassian-analytics');

const { PopOver } = require('app/scripts/views/lib/pop-over');
const BoardHeaderOrgMenuView = require('app/scripts/views/board/board-header-org-menu-view');
const { Util } = require('app/scripts/lib/util');

module.exports.renderOrgChanges = function () {
  if (this.model.get('closed')) {
    return this.renderClosed();
  } else {
    return this.renderBoardHeader();
  }
};

module.exports.refreshOrganization = function () {
  const oldOrganization = this.modelCache.get(
    'Organization',
    this.model.previous('idOrganization'),
  );
  const organization = this.model.getOrganization();

  if (oldOrganization != null) {
    this.stopListening(oldOrganization);
  }

  if (organization != null) {
    for (const prop of [
      'name',
      'logoHash',
      'displayName',
      'limits',
      'products',
    ]) {
      this.listenTo(
        organization,
        `change:${prop}`,
        this.frameDebounce(this.renderOrgChanges),
      );
    }
  }

  return this.renderOrgChanges();
};

module.exports.openOrgMenu = function (e) {
  Util.stop(e);

  Analytics.sendClickedButtonEvent({
    buttonName: 'boardWorkspaceButton',
    source: 'boardScreen',
  });

  PopOver.toggle({
    elem: $(e.target).closest('a'),
    view: new BoardHeaderOrgMenuView({
      model: this.model,
      modelCache: this.modelCache,
    }),
  });
};
