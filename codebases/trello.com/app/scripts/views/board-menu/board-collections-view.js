let BoardCollectionsView;
const BoardCollectionsSelectView = require('app/scripts/views/board-menu/board-collections-select-view');
const BoardAddToTeamView = require('app/scripts/views/board-menu/board-add-to-team-view');
const { Auth } = require('app/scripts/db/auth');
const { ModelLoader } = require('app/scripts/db/model-loader');
const View = require('app/scripts/views/internal/view');
const { Feature } = require('app/scripts/debug/constants');
const { sendErrorEvent } = require('@trello/error-reporting');
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'board_collections',
);

const spinnerTemplate = t.renderable(() => {
  t.div(() => {
    t.div('.spinner.loading');
  });
});

class SpinnerView extends View {
  render() {
    return this.$el.html(spinnerTemplate());
  }
}

class OnlyForTeamMembers extends View {
  static vigor = this.VIGOR.NONE;
  renderOnce() {
    return this.$el.html(
      t.render(() => {
        t.div('.count-explanation', () => {
          t.p(() => t.format('only-team-members-can-enable-collections'));
        });
      }),
    );
  }
}

module.exports = BoardCollectionsView = (() => {
  BoardCollectionsView = class BoardCollectionsView extends View {
    viewTitleKey = 'collections';

    className() {
      return 'board-menu-content-frame board-collections-view';
    }

    static initClass() {
      this.prototype.noPadding = true;
    }

    initialize() {
      this.sidebarView = this.options.sidebarView;

      this.listenTo(this.model, 'team-has-bc', () => {
        this.redirecting = false;
        this.addToTeam = false;
        this.render();
      });
      this.listenTo(this.model, 'added-to-team', () => {
        this.redirecting = true;
        this.render();
      });
      this.listenTo(this.model, 'cancel-add-to-team', () => {
        this.addToTeam = false;
        this.render();
      });
      this.listenTo(this.model, 'cancel-upgrade', () => {
        this.initialViewState = null;
        this.render();
      });
      this.listenTo(this.model, 'add-to-team', () => {
        if (!this.model.owned()) {
          // We aren't an admin on this board so redirect to business-class page
          window.location = '/business-class';
        } else {
          this.initialViewState = null;
          this.addToTeam = true;
          this.render();
        }
      });
    }

    render() {
      try {
        this.$el.empty();

        const board = this.model;
        const boardBelongsToTeam = board.hasOrganization();
        const team = board.getOrganization();
        const me = Auth.me();

        const isBoardMember = board.isMember(me);
        const isTeamMember = team?.isMember(me);
        const notMember = !isBoardMember && !isTeamMember;
        const publicBoardAndTeam = board.isPublic() && team?.isPublic();
        const shouldRenderOnlyForTeamMembers =
          boardBelongsToTeam &&
          ((isBoardMember && !isTeamMember) ||
            (notMember && publicBoardAndTeam));

        if (this.redirecting) {
          this.renderSpinner();
        } else if (this.addToTeam) {
          this.renderAddToTeam();
        } else if (shouldRenderOnlyForTeamMembers) {
          this.renderOnlyForTeamMembers();
        } else {
          this.renderTagSelect();
        }
      } catch (err) {
        sendErrorEvent(err, {
          tags: {
            ownershipArea: 'trello-panorama',
            feature: Feature.Collections,
          },
        });
      }
    }

    renderOnlyForTeamMembers() {
      this.appendSubview(this.subview(OnlyForTeamMembers, this.model));
    }

    renderSpinner() {
      this.appendSubview(this.subview(SpinnerView, this.model));
    }

    renderAddToTeam() {
      if (this.model.hasOrganization()) {
        // So the board is part of a team, we just can't see it
        // This is a weird situation; we're just not going to let them
        // mess with the power-ups in this case
        this.appendSubview(this.subview(OnlyForTeamMembers, this.model));
        return this;
      }

      ModelLoader.loadMyOrganizations();

      this.appendSubview(
        this.subview(BoardAddToTeamView, this.model, {
          menuType: 'Collections',
        }),
      );
    }

    renderTagSelect() {
      this.appendSubview(
        this.subview(BoardCollectionsSelectView, this.model, {
          modelCache: this.modelCache,
          sidebarView: this.sidebarView,
        }),
      );
    }
  };
  BoardCollectionsView.initClass();
  return BoardCollectionsView;
})();
