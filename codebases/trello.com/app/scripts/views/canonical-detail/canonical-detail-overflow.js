// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const React = require('react');
const $ = require('jquery');
const _ = require('underscore');
const { Util } = require('app/scripts/lib/util');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const { l } = require('app/scripts/lib/localize');
const t = require('app/scripts/views/internal/recup-with-helpers')();
const CanonicalDetailOverflowMenu = require('app/scripts/views/canonical-detail/canonical-detail-overflow-menu');

const {
  OverflowButton,
} = require('@atlassian/trello-canonical-components').CanonicalDetail;

class CanonicalDetailOverflow extends React.Component {
  static initClass() {
    this.prototype.displayName = 'CanonicalDetailOverflow';

    this.prototype.render = t.renderable(function () {
      const { isVertical } = this.props;

      return t.tag(OverflowButton, {
        className: 'canonical-overflow-button',
        onClick: this.onOverflowClick,
        isVertical,
      });
    });
  }

  constructor(props) {
    super(props);
    this.onOverflowClick = this.onOverflowClick.bind(this);
    this.state = {
      isVisible: false,
      isMounted: false,
    };
    this.onHide = this.onHide.bind(this);
  }

  componentDidMount() {
    return this.setState({
      isMounted: true,
    });
  }

  componentDidUpdate(prevProps) {
    const prevMenuItemKeys = prevProps.menuItems.map((item) => item.key);
    const currMenuItemKeys = this.props.menuItems.map((item) => item.key);

    if (!_.isEqual(prevMenuItemKeys, currMenuItemKeys)) {
      // cannot just rely on PopOver.isVisible because another card may
      // have its options updated which would then trigger the contents
      // of the open PopOver to change even if it was not for that card,
      // or the card may be removed because of being replied to.
      // setTimeout is needed because a race condition with removing the
      // popup and it updating when the menu options change (like changing
      // due date)
      return setTimeout(() => {
        if (this.state.isVisible && this.state.isMounted && PopOver.isVisible) {
          PopOver.clearStack();
          return PopOver.pushView({
            reactElement: (
              <CanonicalDetailOverflowMenu
                key="card-overflow-menu"
                menuItems={this.props.menuItems}
              />
            ),
          });
        }
      }, 0);
    }
  }

  onHide() {
    if (this.state.isMounted) {
      return this.setState({
        isVisible: false,
      });
    }
  }

  onOverflowClick(e) {
    Util.preventDefault(e);

    if (!this.state.isVisible) {
      this.props.trackOverflowMenuOpens(this.props.cardId);
    }

    this.setState({
      isVisible: true,
    });

    return PopOver.toggle({
      getViewTitle() {
        return l(['view title', 'actions']);
      },
      elem: $(e.currentTarget),
      reactElement: (
        <CanonicalDetailOverflowMenu
          key="card-overflow-menu"
          menuItems={this.props.menuItems}
        />
      ),
      hidden: this.onHide,
    });
  }
}

CanonicalDetailOverflow.initClass();
module.exports = CanonicalDetailOverflow;
