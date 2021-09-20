// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const _ = require('underscore');
const { PowerUpItemType } = require('app/src/components/PowerUp');
const {
  LoadingSkeleton,
} = require('app/src/components/PowerUp/LoadingSkeleton');
const BaseDirectoryView = require('./base-directory-view');
const React = require('react');
const t = require('recup');

class DirectoryLoading extends React.Component {
  static initClass() {
    this.prototype.displayName = 'Directory Spinner';

    this.prototype.render = t.renderable(function () {
      return t.div('.directory-content-body', () => {
        return t.div('.directory-listing', () => {
          return _.times(this.props.numOfAtoms, () => {
            return t.div('.directory-listing-powerup', () => {
              return t.tag(LoadingSkeleton, {
                type: this.props.atomType,
              });
            });
          });
        });
      });
    });
  }
}
DirectoryLoading.initClass();

class DirectorySpinner extends React.Component {
  static initClass() {
    this.prototype.displayName = 'Directory Spinner';

    this.prototype.render = t.renderable(() =>
      t.div('.directory-listing', () =>
        t.div('.directory-spinner', () => t.div('.spinner.loading.centered')),
      ),
    );
  }
}
DirectorySpinner.initClass();

module.exports = class DirectorySpinnerView extends BaseDirectoryView {
  eventSource() {
    return 'boardDirectorySpinnerScreen';
  }

  renderContent() {
    const { section, idPlugin, isEnabling } = this.options;

    if (_.contains(['category', 'custom', 'enabled'], section)) {
      return (
        <DirectoryLoading
          numOfAtoms={24}
          atomType={PowerUpItemType.Description}
        />
      );
    } else if (idPlugin || isEnabling) {
      return <DirectorySpinner />;
    } else {
      return (
        <DirectoryLoading numOfAtoms={6} atomType={PowerUpItemType.Featured} />
      );
    }
  }
};
