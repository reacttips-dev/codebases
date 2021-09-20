/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const f = require('effing');
const React = require('react');
const Promise = require('bluebird');
const t = require('app/scripts/views/internal/recup-with-helpers')('popover');

const tfilter = require('app/scripts/views/internal/recup-with-helpers')(
  'filter_cards_search_results',
);
const _ = require('underscore');

class Popover extends React.Component {
  static initClass() {
    this.prototype.displayName = 'Popover';

    this.prototype.render = t.renderable(function () {
      let { children } = this.props;
      const {
        hideHeader,
        onBack,
        onClose,
        isFilterPopover,
        clearFilter,
      } = this.props;

      return t.div({ class: t.classify({ 'no-back': !onBack }) }, () => {
        if (!hideHeader) {
          t.div('.pop-over-header.js-pop-over-header', () => {
            if (onBack != null) {
              t.a('.pop-over-header-back-btn.icon-sm.icon-back.is-shown', {
                onClick: onBack,
                href: '#',
              });
            }

            t.span('.pop-over-header-title', () => {
              if (this.props.hasSafeViewTitle) {
                return t.raw(this.state.title);
              } else {
                return t.text(this.state.title);
              }
            });

            return t.a('.pop-over-header-close-btn.icon-sm.icon-close', {
              onClick: onClose,
              href: '#',
            });
          });
        }

        t.div(() => {
          const props = {
            className:
              'pop-over-content js-pop-over-content u-fancy-scrollbar js-tab-parent',
          };

          const addClass = (addedClasses, classNames) =>
            _.chain(classNames != null ? classNames.split(' ') : undefined)
              .union(addedClasses.split(' '))
              .value()
              .join(' ');

          const addClassesToReactElement = (classNames, reactElement) =>
            React.cloneElement(reactElement, {
              className: addClass(
                'js-popover-pushed hide',
                reactElement.props.classNames,
              ),
            });

          children = _.chain(children)
            .initial()
            .map(f(addClassesToReactElement, 'js-popover-pushed hide'))
            .value()
            .concat(_.last(children));

          return t.addElement(<div {...props}>{children}</div>);
        });

        if (isFilterPopover) {
          return t.div('.board-header-filter-clear-btn', () => {
            t.button(
              '.button.nch-button--primary',
              { onClick: clearFilter, href: '#' },
              () => {
                t.span('.icon-sm.icon-close');
                t.span('.board-header-filter-clear-btn-text', () => {
                  return tfilter.format('clear-filter');
                });
              },
            );
          });
        }
      });
    });
  }

  constructor(props) {
    super(props);

    this.state = {
      title: '',
    };
  }

  componentDidMount() {
    this.isStillMounted = true;
    return this.updateTitle(this.props);
  }

  componentDidUpdate() {
    if (this._titlePromise != null) {
      this._titlePromise.cancel();
    }

    return this.updateTitle(this.props);
  }

  updateTitle(props) {
    // mod-no-header popovers don't have titles

    if (props.getViewTitle == null) {
      return;
    }

    if (props.getViewTitle() === this.state.title) {
      return;
    }

    return (this._titlePromise = Promise.resolve(props.getViewTitle())
      .cancellable()
      .then((title) => {
        if (this.isStillMounted) {
          return this.setState({ title });
        }
      })
      .catch(Promise.CancellationError, function () {}));
  }

  componentWillUnmount() {
    this.isStillMounted = false;
    return this._titlePromise != null ? this._titlePromise.cancel() : undefined;
  }
}

Popover.initClass();
module.exports = Popover;
