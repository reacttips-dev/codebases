/* eslint-disable import/no-default-export */
import moment from 'moment';
import React from 'react';
import { Analytics } from '@trello/atlassian-analytics';

const { Auth } = require('app/scripts/db/auth');
const { ApiPromise } = require('app/scripts/network/api-promise');
const CtaJoinBoardBanner = require('app/scripts/views/member/team-boards-cta/index')
  .default;

export interface BannerProps {
  teamName: string;
  teamBoardsLink: string;
  orgId: string;
  emptyStateBanner?: boolean;
  inBoardsMenu?: boolean;
  onBannerLinkClick?: () => void;
  children: (params: {
    shouldShowBanner: boolean;
    banner: React.ReactNode;
  }) => React.ReactNode;
}
export class TeamBoardsLinkBanner extends React.Component<BannerProps> {
  state = {
    bannerDismissed: false,
  };

  componentDidMount() {
    this.recordDateForBannerDismissal(this.props.orgId);
  }

  componentDidUpdate() {
    this.recordDateForBannerDismissal(this.props.orgId);
  }

  dismissTeamBoardsLinkBanner = (
    bannerDismissId: string,
    e: React.MouseEvent,
  ) => {
    Auth.me().dismiss(bannerDismissId);

    this.setState({ bannerDismissed: true });
    this.sendAnalyticEvent('dismisses');

    // The boards menu container registers document-level click handlers, so we
    // need to mute the native event too to make sure this doesn't bubble there.
    e.preventDefault();
    e.nativeEvent.stopImmediatePropagation();
  };

  getBannerDismissId(orgId: string) {
    const bannerDismissId = `team-boards-join-link-banner-${orgId}`;

    return bannerDismissId;
  }

  getDateFirstSawBanner(orgId: string) {
    const messagesDismissed = Auth.me().get('messagesDismissed') || [];
    const joinBanner = messagesDismissed.find(function (dismissedMessage: {
      name: string;
      lastDismissed: string;
    }) {
      return dismissedMessage.name === `team-join-cta-banner-${orgId}`;
    });

    if (!joinBanner) {
      return null;
    } else {
      return joinBanner.lastDismissed;
    }
  }

  sendAnalyticEvent(verb: string) {
    const bannerSize = this.props.emptyStateBanner ? 'large ' : 'small ';
    const bannerLocation = this.props.inBoardsMenu
      ? 'boardsMenuInlineDialog'
      : 'memberBoardsHomeScreen';

    const buttonClickedEvent = () =>
      Analytics.sendClickedButtonEvent({
        buttonName: 'seeAllWorkspaceBoardsBannerButton',
        source: 'seeAllWorkspaceBoardsBanner',
        attributes: {
          bannerLocation,
        },
        containers: {
          workspace: {
            id: this.props.orgId,
          },
        },
      });
    const linkClickedEvent = () =>
      Analytics.sendClickedLinkEvent({
        linkName: 'seeAllWorkspaceBoardsBannerLink',
        source: 'seeAllWorkspaceBoardsBanner',
        attributes: {
          bannerLocation,
        },
        containers: {
          workspace: {
            id: this.props.orgId,
          },
        },
      });

    const dismissedEvent = () =>
      Analytics.sendDismissedComponentEvent({
        componentType: 'banner',
        componentName: 'seeAllWorkspaceBoardsBanner',
        source: bannerLocation,
        containers: {
          workspace: {
            id: this.props.orgId,
          },
        },
      });

    if (verb === 'dismisses') {
      dismissedEvent();
    } else if (
      bannerLocation === 'boardsMenuInlineDialog' ||
      bannerSize === 'small '
    ) {
      linkClickedEvent();
    } else {
      buttonClickedEvent();
    }
  }

  recordDateForBannerDismissal(orgId: string) {
    if (
      this.shouldShowBanner(this.props.orgId) &&
      !this.getDateFirstSawBanner(orgId)
    ) {
      this.setDateFirstSawBanner(orgId);
    }
  }

  setDateFirstSawBanner(orgId: string) {
    return ApiPromise({
      url: '/1/members/me/messagesDismissed',
      type: 'post',
      data: {
        name: `team-join-cta-banner-${orgId}`,
      },
    }).then(
      (data: {
        messagesDismissed: { name: string; dateLastDismissed: number };
      }) => {
        Auth.me().set('messagesDismissed', data.messagesDismissed);
      },
    );
  }

  isTeamJoinBannerExpired(orgId: string) {
    const dateFirstSawBanner = this.getDateFirstSawBanner(orgId);
    let days = 0;
    if (dateFirstSawBanner) {
      days = moment().diff(moment(dateFirstSawBanner), 'days');
    }

    return days > 30;
  }

  shouldShowBanner(orgId: string) {
    if (!Auth.me()) {
      return false;
    }

    const optimisticallyDismissed = this.state.bannerDismissed;
    const isDismissed = Auth.me().isDismissed(this.getBannerDismissId(orgId));

    if (isDismissed || optimisticallyDismissed) {
      return false;
    }

    if (
      !this.props.emptyStateBanner &&
      Auth.me().organizationList.length !== 1
    ) {
      return false;
    }

    const isExpired = this.isTeamJoinBannerExpired(orgId);

    if (!this.props.emptyStateBanner && isExpired) {
      return false;
    }

    // check if the user is a "guest" of the organization
    // if so, do not show banner
    if (
      !this.props.emptyStateBanner &&
      !Auth.me().organizationList.models.find(
        (org: { id: string }) => org.id === orgId,
      )
    ) {
      return false;
    }

    return true;
  }

  bannerLinkClick(verb: string) {
    this.sendAnalyticEvent(verb);
  }

  render() {
    const { onBannerLinkClick = () => {} } = this.props;
    if (!this.shouldShowBanner(this.props.orgId)) {
      return this.props.children({
        shouldShowBanner: false,
        banner: null,
      });
    }

    const banner = (
      <CtaJoinBoardBanner
        teamName={
          <React.Fragment key="teamName">{this.props.teamName}</React.Fragment>
        } //allow React to do escaping; avoid localization double escaping
        teamBoardsLink={this.props.teamBoardsLink}
        emptyStateBanner={this.props.emptyStateBanner}
        inBoardsMenu={this.props.inBoardsMenu}
        // eslint-disable-next-line react/jsx-no-bind
        onClickLink={() => {
          this.bannerLinkClick('clicks');
          onBannerLinkClick();
        }}
        // eslint-disable-next-line react/jsx-no-bind
        onDismiss={(e: React.MouseEvent) =>
          this.dismissTeamBoardsLinkBanner(
            this.getBannerDismissId(this.props.orgId),
            e,
          )
        }
      />
    );

    return this.props.children({
      shouldShowBanner: true,
      banner,
    });
  }
}

export default TeamBoardsLinkBanner;
