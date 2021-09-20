// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { Backgrounds } = require('app/scripts/data/backgrounds');
const React = require('react');
const _ = require('underscore');
const { Analytics } = require('@trello/atlassian-analytics');
const { featureFlagClient } = require('@trello/feature-flag-client');

const colors = [];
const gradients = [];

for (const name in Backgrounds) {
  const data = Backgrounds[name];
  if (data.type === 'default') {
    colors.push({ key: name, name, color: data.color });
  }
  if (data.type === 'gradient') {
    gradients.push({
      key: name,
      name,
      gradient: data.path,
      color: data.color,
      emoji: data.emoji,
    });
  }
}

const Color = ({ setBackgroundColor, name, color, boardId, size }) => (
  // eslint-disable-next-line jsx-a11y/no-static-element-interactions
  <div
    // eslint-disable-next-line react/jsx-no-bind
    onClick={function () {
      const traceId = Analytics.startTask({
        taskName: 'edit-board/prefs/background',
        source: 'boardMenuDrawerBackgroundColorsScreen',
      });
      setBackgroundColor(name, color, {
        taskName: 'edit-board/prefs/background',
        source: 'boardMenuDrawerBackgroundColorsScreen',
        traceId,
        next: (_err, res) => {
          if (res) {
            Analytics.sendUpdatedBoardFieldEvent({
              field: 'background',
              value: name,
              source: 'boardMenuDrawerBackgroundColorsScreen',
              containers: {
                board: {
                  id: boardId,
                },
              },
              attributes: {
                backgroundType: 'color',
              },
            });
          }
        },
      });
    }}
    className={`board-backgrounds-section-tile board-backgrounds-section-tile-${size}`}
  >
    <div
      className="image"
      style={{
        backgroundColor: color,
      }}
    />
  </div>
);

const Gradient = ({
  setBackgroundGradient,
  name,
  gradient,
  color,
  emoji,
  boardId,
  size,
}) => (
  // eslint-disable-next-line jsx-a11y/no-static-element-interactions
  <div
    // eslint-disable-next-line react/jsx-no-bind
    onClick={function () {
      const traceId = Analytics.startTask({
        taskName: 'edit-board/prefs/background',
        source: 'boardMenuDrawerBackgroundColorsScreen',
      });
      setBackgroundGradient(name, gradient, color, {
        taskName: 'edit-board/prefs/background',
        source: 'boardMenuDrawerBackgroundColorsScreen',
        traceId,
        next: (_err, res) => {
          if (res) {
            Analytics.sendUpdatedBoardFieldEvent({
              field: 'background',
              value: name,
              source: 'boardMenuDrawerBackgroundColorsScreen',
              containers: {
                board: {
                  id: boardId,
                },
              },
              attributes: {
                backgroundType: 'gradient',
              },
            });
          }
        },
      });
    }}
    className={`board-backgrounds-section-tile board-backgrounds-section-tile-${size}`}
  >
    <div
      className="image"
      style={{
        backgroundColor: color,
        backgroundImage: `url(${gradient})`,
      }}
    >
      <span className="emoji">{emoji}</span>
    </div>
  </div>
);

class ColorsView extends React.Component {
  static initClass() {
    this.prototype.displayName = 'ColorsView';
  }

  render() {
    const { setBackgroundColor, setBackgroundGradient } = this.props;

    if (featureFlagClient.get('aaaa.web.board-bkgd-gradients', false)) {
      return (
        <div>
          <div className="board-backgrounds-section-tiles">
            {gradients.map((gradientData) => (
              <Gradient
                {..._.extend({ setBackgroundGradient }, gradientData)}
                size="large"
              />
            ))}
          </div>
          <hr className="board-menu-header-divider" />
          <div className="board-backgrounds-section-tiles">
            {colors.map((colorData) => (
              <Color
                {..._.extend({ setBackgroundColor }, colorData)}
                size="small"
              />
            ))}
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <div className="board-backgrounds-section-tiles">
            {colors.map((colorData) => (
              <Color
                {..._.extend({ setBackgroundColor }, colorData)}
                size="large"
              />
            ))}
          </div>
        </div>
      );
    }
  }
}

ColorsView.initClass();
module.exports = ColorsView;
