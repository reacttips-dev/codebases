import PropTypes from 'prop-types';
import React from 'react';
import a11yKeyPress from 'js/lib/a11yKeyPress';
import MiniProfileRenderer from 'bundles/classmates/components/MiniProfileRenderer';
import { getProfileLink } from 'bundles/discussions/utils/discussionsUrl';
import 'css!./__styles__/ProfileName';

class ProfileName extends React.Component {
  static propTypes = {
    fullName: PropTypes.string.isRequired,
    externalId: PropTypes.string.isRequired,
    userId: PropTypes.number,
    ariaHidden: PropTypes.bool,
    ariaLabel: PropTypes.string,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  static defaultProps = {
    ariaHidden: false,
  };

  onNameClick = (event) => {
    const { externalId } = this.props;
    const { router } = this.context;
    router.push(getProfileLink(externalId));
  };

  render() {
    const { ariaHidden, fullName, externalId, userId, ariaLabel } = this.props;
    return (
      <span
        tabIndex={ariaHidden ? -1 : 0}
        role="link"
        className="rc-ProfileName nostyle pii-hide"
        aria-hidden={ariaHidden}
        aria-label={ariaLabel}
        onClick={this.onNameClick}
        onKeyPress={(event) => a11yKeyPress(event, this.onNameClick)}
        onMouseEnter={(e) => this.miniProfile.display(e)}
        onMouseLeave={(e) => this.miniProfile.hide(e)}
        onFocus={(e) => this.miniProfile.display(e)}
        onBlur={(e) => this.miniProfile.hide(e)}
      >
        <span className="profile-name">{fullName}</span>
        <span data-js="mini-profile">
          <MiniProfileRenderer
            ref={(c) => {
              this.miniProfile = c;
            }}
            source="profileName"
            externalId={externalId}
            userId={userId}
          />
        </span>
      </span>
    );
  }
}

export default ProfileName;
