import React from 'react';
import classNames from 'classnames';
import { compose } from 'recompose';

import TrackedDiv from 'bundles/page/components/TrackedDiv';

import createLoadableComponent from 'js/lib/createLoadableComponent';

import withFormattedShareLink from 'bundles/sharing-common/utils/withFormattedShareLink';
import withCustomUrl from 'bundles/sharing-common/utils/withCustomUrl';

import ShareCTADefault from 'bundles/sharing-common/components/modal/buttons/ShareCTADefault';

import { SocialCaptions } from 'bundles/sharing-common/types/sharingSharedTypes';

import { NATIVE_MOBILE_SOURCE_PARAM, SHARE_QUERY_PARAM } from 'bundles/sharing-common/constants';

import 'css!bundles/sharing-common/components/modal/__styles__/ShareButtonWithModal';

const TABLET_SCREEN_PX = 768;

export type PropsFromCaller = {
  rootClassName?: string;
  style?: React.CSSProperties;
  // Link to be shared, if undefined will use current page
  shareLink?: string;
  utmMediumParam?: string;
  utmContentParam?: string;
  utmCampaignParam?: string;
  utmProductParam?: string;
  // provide an object of keys to string or number pairings and they will be added as query params
  extraQueryParams?: {
    [key: string]: string | number;
  };
  // To use a custom CTA or button wrap this component around it
  children?: JSX.Element;
  // Custom messages to add to social channels, check SocialCaptions type for more info, only some platforms enable this feature
  captions?: SocialCaptions;
  // Turn your shareLink into a short link (formatted like /share/:hash), not ready to be enabled yet for all pages.
  // The URL displayed in the Copy Link container is shortened by default.
  useCustomUrl?: boolean;
  // By default, the Copy Link container enables URL shortening. To disable, set this flag.
  disableCopyLinkCustomUrl?: boolean;
  // Title for modal
  title?: string;
  // Description for modal
  description?: string;
  disableDescription?: boolean;
  onSocialButtonClick?: (event: React.MouseEvent<HTMLElement>) => void;
  // Pass in a component to show a preview of the share, resides below title/description and above share links
  previewComponent?: JSX.Element;
  // For video sharing, provide a getter for current time in seconds to enable a start at checkbox.
  // If this is enabled it disables custom URLs (for now).
  getVideoTimeInSeconds?: () => number;
};

type PropsToComponent = PropsFromCaller & {
  // For native mobile share link
  // targetShareLink is the shareLink with proper UTM params added, customShareLink is the short link version
  targetShareLink: string;
  customShareLink?: string;
};

type State = {
  showModal: boolean;
};

const LoadableShareModal = createLoadableComponent(() => import('bundles/sharing-common/components/modal/ShareModal'));

export class ShareButtonWithModal extends React.Component<PropsToComponent, State> {
  state = {
    showModal: false,
  };

  componentDidMount() {
    if (window?.location?.search.includes(SHARE_QUERY_PARAM)) {
      this.setState(() => ({
        showModal: true,
      }));
    }
  }

  handleButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    const { onSocialButtonClick } = this.props;

    if (onSocialButtonClick) {
      onSocialButtonClick(event);
    }

    // If screen size is in tablet range or below and native sharing is enabled use that
    // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share, available and best for mobile devices
    if (window.innerWidth <= TABLET_SCREEN_PX && window.navigator && navigator.share) {
      this.nativeMobileShare();
    } else {
      this.setState(() => ({
        showModal: true,
      }));
    }
  };

  handleCloseModal = () => {
    this.setState(() => ({
      showModal: false,
    }));
  };

  nativeMobileShare = () => {
    const { captions, targetShareLink, customShareLink } = this.props;
    const link = customShareLink || targetShareLink;

    const title = captions?.nativeMobileTitle?.(link);
    const caption = captions?.nativeMobileMessage?.(link);

    navigator
      .share({
        url: customShareLink || targetShareLink,
        title: title || document.title,
        text: caption || '',
      })
      .catch((err) => {
        // Swallow the error if the user aborted the share, or if the device has no share targets.
        if (err.name !== 'AbortError') {
          throw err;
        }
      });
  };

  render() {
    const {
      rootClassName,
      style,
      shareLink,
      captions,
      utmContentParam,
      utmMediumParam,
      utmCampaignParam,
      utmProductParam,
      children,
      useCustomUrl,
      title,
      description,
      disableDescription,
      previewComponent,
      extraQueryParams,
      getVideoTimeInSeconds,
    } = this.props;
    const { showModal } = this.state;
    const rootClassNames = classNames('rc-ShareButtonWithModal', rootClassName);

    return (
      <div className={rootClassNames} style={style} data-e2e="universal-share-cta">
        <TrackedDiv
          aria-label={title}
          data-unit="universal-share-cta"
          trackingName="universal_sharing_cta"
          onClick={this.handleButtonClick}
          tabIndex={0}
          trackMouseEnters
        >
          {children || <ShareCTADefault />}
        </TrackedDiv>
        {showModal && (
          <LoadableShareModal
            handleCloseModal={this.handleCloseModal}
            shareLink={shareLink}
            captions={captions}
            utmContentParam={utmContentParam}
            utmMediumParam={utmMediumParam}
            utmCampaignParam={utmCampaignParam}
            utmProductParam={utmProductParam}
            extraQueryParams={extraQueryParams}
            useCustomUrl={useCustomUrl}
            title={title}
            description={description}
            disableDescription={disableDescription}
            previewComponent={previewComponent}
            initialVideoTimeInSeconds={getVideoTimeInSeconds && getVideoTimeInSeconds()}
          />
        )}
      </div>
    );
  }
}
export default compose<PropsToComponent, PropsFromCaller>(
  withFormattedShareLink(NATIVE_MOBILE_SOURCE_PARAM),
  withCustomUrl()
)(ShareButtonWithModal);
