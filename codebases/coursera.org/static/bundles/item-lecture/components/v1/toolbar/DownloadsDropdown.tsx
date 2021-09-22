import React from 'react';

import classNames from 'classnames';
import AssetDownloadItem from 'bundles/item-lecture/components/v1/downloadItems/AssetDownloadItem';
import SubtitleDownloadItem from 'bundles/item-lecture/components/v1/downloadItems/SubtitleDownloadItem';
import TranscriptDownloadItem from 'bundles/item-lecture/components/v1/downloadItems/TranscriptDownloadItem';
import LectureVideoDownloadItem from 'bundles/item-lecture/components/v1/downloadItems/LectureVideoDownloadItem';

import {
  fetchLectureAssets,
  getLanguageCode,
  areDownloadsEnabled,
  /* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
} from 'bundles/item-lecture/utils/downloadsDropdownUtils';

import type VideoContent from 'bundles/video-player/models/VideoContent';

/* eslint-disable no-restricted-imports */
import type ItemMetadata from 'pages/open-course/common/models/itemMetadata';
/* eslint-enable no-restricted-imports */

import _t from 'i18n!nls/item-lecture';

import 'css!./__styles__/DownloadsDropdown';

import type { Item } from 'bundles/learner-progress/types/Item';
import type { VideoPlayer } from 'bundles/item-lecture/types';
import type { LanguageCode } from 'bundles/interactive-transcript/types';

type Props = {
  courseId: string;
  itemMetadata: ItemMetadata;
  computedItem: Item;
  videoPlayer: VideoPlayer;
  shouldShowVideoDownloads: boolean;
  videoContent: VideoContent;
};

type State = {
  assetSources: Array<any>;
  languageCode: LanguageCode;
  showMenu: boolean;
};

// TODO remove itemMetadata as a prop to this component
class DownloadsDropdown extends React.Component<Props, State> {
  dropdown: HTMLDivElement | null | undefined;

  state = {
    assetSources: [],
    languageCode: '',
    showMenu: false,
  };

  componentDidMount() {
    const { itemMetadata, videoPlayer, videoContent } = this.props;

    videoPlayer.on('subtitleschange', this.onSubtitlesChange);

    const languageCode = getLanguageCode(itemMetadata, videoPlayer, videoContent);
    this.setState({ languageCode });

    fetchLectureAssets(itemMetadata).then((assetSources: $TSFixMe) => {
      this.setState({ assetSources });
    });
  }

  componentDidUpdate(prevProps: Props, { showMenu: prevShowMenu }: State) {
    const { showMenu } = this.state;
    if (showMenu !== prevShowMenu) {
      if (showMenu) {
        /*
          Used to monitor clicks outside the dropdown so as to close it if open
         */
        document.addEventListener('click', this.handleDocumentClick, false);
        document.addEventListener('keydown', this.handleEscKeyPress, false);
      } else {
        document.removeEventListener('click', this.handleDocumentClick, false);
        document.removeEventListener('keydown', this.handleEscKeyPress, false);
      }
    }
  }

  componentWillUnmount() {
    const { videoPlayer } = this.props;

    /*
      The video player has been removed. Remove event listeners.
      Also remove click event listener
     */
    videoPlayer.off('subtitleschange', this.onSubtitlesChange);
    document.removeEventListener('click', this.handleDocumentClick, false);
    document.removeEventListener('keydown', this.handleEscKeyPress, false);
  }

  handleEscKeyPress = (event: KeyboardEvent) => {
    if (event.keyCode === 27) {
      this.toggleMenu();
    }
  };

  handleDocumentClick = (e: MouseEvent) => {
    if (this.dropdown && this.dropdown.contains(e.target as Node)) {
      return;
    }

    this.toggleMenu();
  };

  onSubtitlesChange = () => {
    const { itemMetadata, videoPlayer, videoContent } = this.props;

    const languageCode = getLanguageCode(itemMetadata, videoPlayer, videoContent);
    this.setState({ languageCode });
  };

  toggleMenu = () => {
    this.setState((prevState) => ({
      showMenu: !prevState.showMenu,
    }));
  };

  render() {
    const { assetSources, languageCode, showMenu } = this.state;
    const { computedItem, courseId, videoContent } = this.props;
    const ariaLabel = showMenu
      ? _t('Download video resources dropdown menu: open')
      : _t('Download video resources dropdown menu: closed');

    const downloadsDropdownClasses = classNames({
      'rc-DownloadsDropdown': true,
      'bt3-dropdown': true,
      'bt3-open': showMenu,
    });

    if (!videoContent || !areDownloadsEnabled(courseId)) {
      return null;
    }

    return (
      <div
        className={downloadsDropdownClasses}
        ref={(ref) => {
          this.dropdown = ref;
        }}
      >
        <button
          type="button"
          className="bt3-dropdown-toggle"
          aria-haspopup="true"
          aria-expanded={showMenu}
          aria-label={ariaLabel}
          onClick={this.toggleMenu}
          id="downloads-dropdown-btn"
        >
          {_t('Download')}
        </button>
        {showMenu && (
          <ul
            role="menu"
            className="bt3-dropdown-menu"
            aria-labelledby="downloads-dropdown-btn"
            aria-label={_t('Downloads Menu')}
          >
            <LectureVideoDownloadItem courseId={courseId} computedItem={computedItem} videoContent={videoContent} />
            <SubtitleDownloadItem languageCode={languageCode} videoContent={videoContent} />
            <TranscriptDownloadItem languageCode={languageCode} videoContent={videoContent} />

            {assetSources.map(({ itemName, url, fileType, typeName }) => (
              <AssetDownloadItem
                key={url}
                itemName={itemName}
                downloadUrl={url}
                fileType={fileType}
                assetTypeName={typeName}
              />
            ))}
          </ul>
        )}
      </div>
    );
  }
}

export default DownloadsDropdown;
