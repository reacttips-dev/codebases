// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const React = require('react');
const t = require('app/scripts/views/internal/recup-with-helpers')(
  'board_member_add_multiple',
);

const options = {
  normal: {
    label: t.l('add-as-members'),
    description: t.l(
      'board-members-can-edit-comment-and-invite-people-to-this-board',
    ),
  },
  observer: {
    label: t.l('add-as-observers'),
    description: t.l('observers-can-view-and-comment-on-this-board'),
  },
};

class BoardObserverOptionComponent extends React.Component {
  static initClass() {
    this.prototype.render = t.renderable(function () {
      const { onChange, value } = this.props;
      const { isOpen } = this.state;

      const selectedOption = options[value];

      return t.div(
        '.board-observer-dropdown',
        {
          onBlur: () => this.setState({ isOpen: false }),
          tabIndex: 0,
        },
        () => {
          t.div(
            '.board-observer-selected',
            { onClick: () => this.setState({ isOpen: !isOpen }) },
            () => {
              t.p(() => {
                return t.text(selectedOption.label);
              });
              return t.icon('down');
            },
          );
          if (isOpen) {
            return t.div('.board-observer-options', () => {
              return Object.keys(options).map((key) => {
                return t.div(
                  '.board-observer-option',
                  {
                    onClick: (e) => {
                      onChange(key);
                      return this.setState({ isOpen: false });
                    },
                  },
                  () => {
                    t.div('.board-observer-option-title', () => {
                      t.text(options[key].label);
                      if (key === value) {
                        return t.icon('check');
                      }
                    });
                    return t.div('.board-observer-option-description', () => {
                      return t.text(options[key].description);
                    });
                  },
                );
              });
            });
          }
        },
      );
    });
  }
  constructor(props) {
    super(props);
    this.state = { isOpen: false };
  }
}

BoardObserverOptionComponent.initClass();
module.exports = BoardObserverOptionComponent;
