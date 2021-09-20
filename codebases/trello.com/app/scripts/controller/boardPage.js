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
 * DS201: Simplify complex destructure assignments
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const React = require('react');
const { importWithRetry } = require('@trello/use-lazy-component');

const Promise = require('bluebird');
const { Recents } = require('app/scripts/lib/recents');
const $ = require('jquery');
const moment = require('moment');
const f = require('effing');
const { ApiError } = require('app/scripts/network/api-error');
const { Auth } = require('app/scripts/db/auth');
const { navigate } = require('app/scripts/controller/navigate');
const { getSpinner } = require('app/src/getSpinner');
const {
  currentModelManager,
} = require('app/scripts/controller/currentModelManager');
const { CardDetailLoading } = require('../../src/components/CardDetailLoading');
const {
  CardDetailLoadingError,
} = require('../../src/components/CardDetailLoadingError');
const { sendChunkLoadErrorEvent } = require('@trello/error-reporting');
const { forTemplate } = require('@trello/i18n');
const l = forTemplate('home');

// If you call someMoment.year(undefined), that's a no-op.
// If you call someMoment.year(NaN), that gives you an invalid date.
const parseMaybe = function (str) {
  const result = parseInt(str, 10);
  if (isNaN(result)) {
    return undefined;
  } else {
    return result;
  }
};

const mapMaybe = function (f, maybeNum) {
  if (maybeNum != null) {
    return f(maybeNum);
  } else {
    return undefined;
  }
};

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined;
}

module.exports.BoardPage = {
  cardDetailViewChunkLoaded: false,
  boardReferralPage(shortLink, name, referrerUsername) {
    return this.boardPage(shortLink, '', referrerUsername);
  },

  boardPage(shortLink, path, referrerUsername) {
    // :slug
    // :slug/:section
    // :slug/map
    // :slug/member/:username
    // :slug/calendar/:year/:month
    // :slug/calendar/:year/:month/:day
    // :slug/power-ups/enabled
    // :slug/power-ups/category/:category
    // :slug/power-up/:powerup
    // :slug/power-up/:powerup/enable
    // :slug/power-up/:powerup/view/:key
    // :slug/butler
    // :slug/butler/:butlerTab
    // :slug/butler/:butlerTab/edit/:butlerCmd
    // :slug/butler/:butlerTab/new
    // :slug/butler/:butlerTab/log/:butlerCmd
    // :slug/butler/reports/:reportType
    // :slug/butler/edit/:butlerCmd
    // :slug/butler/log/:butlerCmd
    // :slug/timeline
    // :slug/table
    // :slug/calendar-view
    // :slug/map/:lat/:lng/:zoom
    if (path == null) {
      path = '';
    }
    const [, section, ...subsections] = Array.from(
      path.split('?')[0].split('/'),
    );

    const settings = { idBoard: shortLink, referrerUsername };

    if (section === 'calendar') {
      const calendarMoment = moment().startOf('day');
      calendarMoment.year(parseMaybe(subsections[0]));
      calendarMoment.month(mapMaybe(f.sub(1), parseMaybe(subsections[1])));
      calendarMoment.date(parseMaybe(subsections[2]));
      if (calendarMoment.isValid()) {
        settings.calendarDate = calendarMoment.toDate();
      }
    }
    // need both lat and long for centering
    if (section === 'map' && subsections[0] != null && subsections[1] != null) {
      const lat = parseFloat(subsections[0]);
      const lng = parseFloat(subsections[1]);
      const zoom = parseInt(subsections[2], 10);
      if (lat && lng) {
        settings.mapCenterTo = { lat, lng };
      }
      if (zoom) {
        settings.zoom = zoom;
      }
    }

    if (section === 'member' && subsections[0] != null) {
      settings.usernameBoardProfile = subsections[0];
    }

    if (section === 'power-ups' && subsections[0] != null) {
      settings.directorySection = subsections[0];
      if (subsections[1] != null) {
        settings.directoryCategory = subsections[1];
      }
    }

    if (section === 'power-up' && subsections[0] != null) {
      settings.directoryIdPowerUp = subsections[0];

      if (subsections[1] != null && subsections[1] === 'enable') {
        settings.directoryIsEnabling = true;
      } else if (subsections[1] === 'view' && subsections[2] != null) {
        settings.powerUpViewKey = subsections[2];
      }
    }

    if (section === 'butler' && subsections.length) {
      if (subsections[0] === 'edit' && subsections[1]) {
        settings.butlerCmdEdit = subsections[1];
      } else if (subsections[0] === 'log' && subsections[1]) {
        settings.butlerCmdLog = subsections[1];
      } else if (subsections[0] === 'reports' && subsections[1]) {
        settings.reportType = subsections[1];
      } else {
        settings.butlerTab = subsections[0];
        if (subsections[1] && subsections[1] === 'new') {
          settings.butlerCmdEdit = subsections[1];
        } else if (
          subsections[1] &&
          subsections[1] === 'edit' &&
          subsections[2]
        ) {
          settings.butlerCmdEdit = subsections[2];
        } else if (
          subsections[1] &&
          subsections[1] === 'log' &&
          subsections[2]
        ) {
          settings.butlerCmdLog = subsections[2];
        }
      }
    }

    if (
      [
        'calendar',
        'member',
        'power-up',
        'power-ups',
        'map',
        'butler',
        'timeline',
        'table',
        'calendar-view',
        'dashboard',
      ].includes(section)
    ) {
      settings.section = section;
    }

    return this.displayBoard(settings).done();
  },

  oldBoardPage(path) {
    // :id
    // :slug/:id
    // :slug/:id/:section
    // :slug/:id/member/:username

    const settings = {};

    const parts = path.split('/');
    if (parts.length === 1) {
      settings.idBoard = parts[0];
    } else {
      settings.idBoard = parts[1];
    }

    if (parts.length === 3) {
      settings.section = parts[2];
    } else if (parts.length === 4) {
      settings.usernameBoardProfile = parts[3];
    }

    return this.displayBoard(settings).done();
  },

  cardPage(shortLink, path) {
    const highlight =
      location.hash.length > 1
        ? // Remove leading #
          location.hash.substr(1)
        : null;
    const replyToComment = this.getQueryParamByKey('replyToComment');
    return this.displayBoard({
      idCard: shortLink,
      highlight,
      replyToComment,
    }).done();
  },

  oldCardPage(slug, idBoard, cardComponent) {
    // cardComponent can be one of several things.
    //
    // It could be an id, or it could be a shortLink, which are both fine.
    // *Or* it could be an idShort, if it's a #123-style link in an old
    // notification.
    //
    // We don't want displayBoard to have to special-case this one annoying
    // scenario (it's the only case where you need to use the idBoard in order
    // to determine the idCard), so we normalize the route here to maintain
    // backwards compatibility.

    const isIdShort = (str) => /^\d+$/.test(str);

    const idCardPromise = (() => {
      if (isIdShort(cardComponent)) {
        // Dependency required at call site to avoid import cycles, do not lift to top of module
        const { ModelLoader } = require('app/scripts/db/model-loader');
        return ModelLoader.for(
          'top-level',
          'loadCardId',
          idBoard,
          cardComponent,
        ).catch(ApiError, () => null);
      } else {
        return Promise.resolve(cardComponent);
      }
    })();

    return idCardPromise.then((idCard) => {
      return this.displayBoard({ idBoard, idCard }).done();
    });
  },

  showCardDetail(card, param) {
    if (param == null) {
      param = {};
    }
    const {
      highlight,
      runMethod,
      isNavigating,
      replyToComment,
      onHide,
      onSuccess,
      onFail,
      onAbort,
    } = param;
    if (card == null) {
      if (onAbort) {
        onAbort(new Error('card is null'));
      }
      return;
    }

    if (
      !currentModelManager.onBoardView(
        __guard__(card.getBoard(), (x) => x.id),
      ) ||
      card.modelCache !== this.getCurrentModelCache()
    ) {
      navigate(this.getCardUrl(card, highlight, replyToComment), {
        trigger: true,
      });
      if (onAbort) {
        onAbort(new Error('card is on another board'));
      }
      return;
    }

    // Figure out if we're showing the calendar before we open the dialog;
    // it's possible that the card will get moved to another board
    // while the dialog is open
    const board = card.getBoard();
    let isInterrupted = false;
    // Dependency required at call site to avoid import cycles, do not lift to top of module
    const Dialog = require('app/scripts/views/lib/dialog');

    if (!module.exports.BoardPage.cardDetailViewChunkLoaded) {
      Dialog.show({
        reactElement: <CardDetailLoading />,
        hide: () => {
          isInterrupted = true;

          if (onHide) {
            onHide();
          }
        },
      });
    }

    return Promise.all([
      importWithRetry(() =>
        import(
          /* webpackChunkName: "board-view" */ 'app/scripts/views/board/board-view'
        ),
      ),
      importWithRetry(() =>
        import(
          /* webpackChunkName: "card-detail-view" */ 'app/scripts/views/card/card-detail-view'
        ),
      ),
    ])
      .then(([{ default: BoardView }, { default: CardDetailView }]) => {
        module.exports.BoardPage.cardDetailViewChunkLoaded = true;

        if (isInterrupted) {
          if (onAbort) {
            onAbort(new Error('isInterrupted'));
          }
          return;
        }

        const cardDetailView = new CardDetailView({
          modelCache: this.getCurrentModelCache(),
          model: card,
        });
        const existingBoardView =
          card.getBoard() &&
          this.applicationView.existingSubviewOrUndefined(
            BoardView,
            card.getBoard(),
          );
        const showingCalendar = this.showingCalendar(existingBoardView);
        const showingMap = this.showingMap(existingBoardView);

        let section = '';
        let subsections;
        if (showingCalendar) {
          section = 'calendar';
        }

        if (showingMap) {
          section = 'map';

          // If the user is opening a card back from within the map,
          // we should return them to board instead of the card where the opened map.
          existingBoardView.mapReturnCard = null;
          const mapView = existingBoardView.mapView;
          if (mapView.mapCenterTo && mapView.zoom) {
            subsections = [
              mapView.mapCenterTo.lat,
              mapView.mapCenterTo.lng,
              mapView.zoom,
            ];
          }
        }

        if (this.showingTimeline()) {
          section = 'timeline';
        }

        if (this.showingCalendarView()) {
          section = 'calendar-view';
        }

        if (this.showingTable()) {
          section = 'table';
        }

        if (this.showingAutomaticReports()) {
          section = 'butler';
          subsections = ['reports', 'board-snapshot'];
        }

        Dialog.show({
          view: cardDetailView,
          hide: (isNavigating) => {
            // Dependency required at call site to avoid import cycles, do not lift to top of module
            const AttachmentViewer = require('app/scripts/views/internal/attachment-viewer');
            AttachmentViewer.clear();
            if (!isNavigating) {
              // This is bad. Here we're guessing the right URL for return.
              // It's necessary because the user can mess around with the back and
              // forward buttons to get this dialog to pop by URL.
              this.setBoardLocation(board.id, section, subsections);

              this.title(board.get('name'));
            }

            if (onHide) {
              onHide();
            }
          },

          isNavigating,
        });

        this.waitForId(card, () => {
          navigate(this.getCardUrl(card, highlight, replyToComment), {
            replace: this.onCardView(),
            trigger: false,
          });
          return Recents.add('card', card.id);
        });

        if (runMethod != null) {
          cardDetailView[runMethod]();
        }

        if (highlight != null) {
          cardDetailView.highlight(highlight, true);
        }

        if (replyToComment != null) {
          cardDetailView.replyToComment(replyToComment);
        }

        if (onSuccess) {
          onSuccess();
        }
      })
      .catch((err) => {
        Dialog.show({
          reactElement: <CardDetailLoadingError />,
          hide: () => {
            if (onHide) {
              onHide();
            }
          },
        });

        sendChunkLoadErrorEvent(err);
        if (onFail) {
          onFail(err);
        }
      });
  },

  createFirstBoardPage() {
    return Promise.using(getSpinner(), () => {
      // Dependency required at call site to avoid import cycles, do not lift to top of module
      const { ModelLoader } = require('app/scripts/db/model-loader');
      return ModelLoader.await('boardsData').then(() => {
        const me = Auth.me();
        if (!me.isLoggedIn()) {
          return (window.location = '/login');
        }

        const memberHasBoards = me.boardList.length > 0;
        if (memberHasBoards || me.isDismissed('create-first-board')) {
          return navigate('/', { trigger: true });
        }

        this.clearPreviousView();
        this.setViewType('create-first-board');
        this.title(l('orientation-create-board-button'));
        // Dependency required at call site to avoid import cycles, do not lift to top of module
        const CreateFirstBoardView = require('app/scripts/views/onboarding/create-first-board-view');
        const view = this.topLevelView(CreateFirstBoardView, me);
        $('[data-js-id="header-container"]').hide();
        return $('#content').html(view.render().el);
      });
    }).done();
  },
};
