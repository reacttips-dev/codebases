/* eslint-disable
    @typescript-eslint/no-this-alias,
    eqeqeq,
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
const { getKey, Key } = require('@trello/keybindings');
const SelectMemberOnCardView = require('app/scripts/views/member/select-member-on-card-view');
const { Util } = require('app/scripts/lib/util');
const View = require('app/scripts/views/internal/view');
const _ = require('underscore');
const templates = require('app/scripts/views/internal/templates');
const { l } = require('app/scripts/lib/localize');
const { Analytics } = require('@trello/atlassian-analytics');

class ComposerMemberSelectorView extends View {
  static initClass() {
    this.prototype.viewTitleKey = 'select members';

    this.prototype.events = {
      'mouseenter .item': 'hoverMemberSelect',
      'click .item': 'addOrRemoveMember',
      keyup: 'keyupEvent',
    };
  }

  populate(idMems, hideSearch) {
    this.data = {
      idMems:
        idMems != null
          ? idMems
          : _.pluck(
              this.model
                .getBoard()
                .memberList.filterDeactivated({ force: true }).models,
              'id',
            ),
    };

    return (this.data.showSearch = !(
      this.data.idMems.length <= 5 || hideSearch
    ));
  }

  render() {
    this.$el.html(
      templates.fill(
        require('app/scripts/views/templates/popover_member_searcher'),
        this.data,
      ),
    );

    this.fillMems(this.data.idMems);
    if (this.$('.js-filter-emoji').length > 0) {
      this.setTimeout(() => {
        return this.$('.js-filter-emoji').focus().select();
      }, 20);
    }
    if (this.$('.js-filter-members').length > 0) {
      this.setTimeout(() => {
        return this.$('.js-filter-members').focus().select();
      }, 20);
    }

    return this;
  }

  fillMems(idMems) {
    const $list = this.$('.js-members-list');

    $list.empty();

    for (const idMember of Array.from(idMems.slice(0, 5))) {
      const member = this.modelCache.get('Member', idMember);

      this.appendSubview(
        this.subview(SelectMemberOnCardView, member, { card: this.model }),
        $list,
      );
    }
  }

  filterAndFillMembers(term) {
    const idBoardMems = _.pluck(this.model.getBoard().memberList.models, 'id');
    const mems = Util.filterMembers(this.modelCache, term, idBoardMems);

    if (mems.length > 0) {
      this.fillMems(mems);
      const elem = this.$('.js-members-list .item:first');
      Util.selectMenuItem(this.$('.js-members-list'), '.item', elem);
    } else {
      this.$('.js-members-list')
        .html('<li><p class="empty"></p></li>')
        .find('p')
        .text(l('no matched members'));
    }
  }

  hoverMemberSelect(e) {
    const elem = $(e.target).closest('.item');
    return Util.selectMenuItem(this.$('.js-members-list'), '.item', elem);
  }

  keyupEvent(e) {
    const key = getKey(e);

    if ([Key.Tab, Key.Enter].includes(key)) {
      Util.stop(e);
      this.$('.js-members-list .item.selected:first .js-select-member')
        .first()
        .click();
      return;
    } else if ([Key.ArrowUp, Key.ArrowDown].includes(key)) {
      Util.stop(e);
      Util.navMenuList(this.$('.js-members-list'), '.item', key);
      return;
    } else {
      const filter = this.$('.js-filter-members');
      // the filter input is showed conditionally, we can't assume it'll always be
      // there
      if (filter.length > 0) {
        const input = filter.val().trim().toLocaleLowerCase();
        this.filterAndFillMembers(input);
      }
      return;
    }
  }

  addOrRemoveMember(e) {
    Util.stop(e);
    const parent = $(e.target).closest('.item');
    parent.toggleClass('active');
    const idMember = parent.find('[idMember]').attr('idMember');

    if (this.model.toggle('idMembers', idMember)) {
      // GAS migration cleanup: this is likely dead code
      // https://bitbucket.org/trello/web/pull-requests/5317/
      Analytics.sendTrackEvent({
        action: 'added',
        actionSubject: 'member',
        source: 'cardComposerMemberSelectorInlineDialog',
        attributes: {
          addedTo: 'card',
        },
      });
    } else {
      // GAS migration cleanup: this is likely dead code
      // https://bitbucket.org/trello/web/pull-requests/5317/
      Analytics.sendTrackEvent({
        action: 'removed',
        actionSubject: 'member',
        source: 'cardComposerMemberSelectorInlineDialog',
        attributes: {
          removedFrom: 'card',
        },
      });
    }
  }
}

ComposerMemberSelectorView.initClass();
module.exports = ComposerMemberSelectorView;
