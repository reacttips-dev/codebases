import React, { RefObject } from 'react';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import InfoButton from '../../../../../../components/InfoButton';
import { trackEvent } from '../../../../../../modules/analytics';
import { CarrotIcon } from '../../../../../../shared/Icon/components/CarrotIcon';
import { Spinner } from '../../../../../../shared/Spinner';
import Search from '../../../../../../components/svgs/Search';
import { MarketingButton } from '../../../../../../components/MarketingPagesShared/MarketingButton';
import { stripHtml } from '../../../../../../../helpers/html';
import {
  EpisodeCount,
  EpisodeCountText,
  PopupAnchor,
  InputWrapper,
  SearchIconWrapper,
  Message,
  SelectedPodcast,
  SelectedPodcastImage,
  SelectedPodcastInfo,
  SelectedPodcastName,
  DesktopEpisodeCount,
  MobileEpisodeCount,
  SelectedPodcastAuthor,
  SelectedPodcastDescription,
  ButtonWrapper,
  SpinnerContainer,
  inputFieldClassName,
  typeaheadClassName,
  mutedTextColor,
  infoButtonClassName,
  caretIconClassName,
} from './styles';

export type TypeaheadOption = {
  podcastName: string;
  podcastDescription: string;
  authorName: string;
  episodeCount: number;
  image: string;
  feedUrl: string;
  type: string;
};

type Props = {
  isSearching: boolean;
  onSelectTypeahead: (options: TypeaheadOption[]) => void;
  onTypeaheadSearch: (value: string) => void;
  rssTypeaheadResults: TypeaheadOption[];
  renderTypeaheadOption: (option: TypeaheadOption) => React.ReactNode;
  rssFeedError: {
    message: string;
  };
  hasDataToContinue: boolean;
  fetchingRSSFeedImport: boolean;
  rssFeedIsValid: boolean;
  onClickGetStarted: () => void;
  rssFeedMetadata: {
    authorName: string;
    authorEmail: string;
    image: string;
    isExplicit: boolean;
    itunesCategory: string;
    language: string;
    podcastName: string;
    podcastDescription: string;
    episodeCount: number;
  };
  autoFocus?: boolean;
  inputRef?: RefObject<AsyncTypeahead<TypeaheadOption>>;
};

export const ImportForm = ({
  isSearching,
  onSelectTypeahead,
  onTypeaheadSearch,
  rssTypeaheadResults,
  renderTypeaheadOption,
  rssFeedError,
  hasDataToContinue,
  fetchingRSSFeedImport,
  rssFeedIsValid,
  onClickGetStarted,
  rssFeedMetadata,
  autoFocus,
  inputRef,
}: Props) => {
  const renderEpisodeCount = () => (
    <div>
      <EpisodeCount>
        <EpisodeCountText>
          {rssFeedMetadata.episodeCount}{' '}
          {rssFeedMetadata.episodeCount === 1 ? 'Episode' : 'Episodes'}
        </EpisodeCountText>
        <InfoButton
          direction="top"
          width={230}
          activeOnHover={false}
          infoBubbleClassName={infoButtonClassName}
        >
          This episode count might not reflect all of your episodes.{' '}
          <PopupAnchor
            href="https://anch.co/episodes-found-incorrect"
            target="_blank"
            rel="noopener noreferrer"
            // Otherwise the popover closes before it navigates to the URL
            onMouseDown={e => e.preventDefault()}
          >
            Learn more
            <CarrotIcon
              fillColor="white"
              size={{ width: 7, height: 8 }}
              className={caretIconClassName}
            />
          </PopupAnchor>
        </InfoButton>
      </EpisodeCount>
    </div>
  );

  const episodeCount = renderEpisodeCount();

  return (
    <div>
      <FormGroup id="podcastName">
        <InputWrapper>
          <AsyncTypeahead
            caseSensitive={true}
            autoFocus={autoFocus}
            emptyLabel="No podcasts or RSS feeds found."
            isLoading={isSearching}
            inputProps={{
              className: inputFieldClassName,
              'aria-label': 'Enter your podcast name or RSS feed',
            }}
            // @ts-ignore (for some reason this property isn't in the types)
            className={typeaheadClassName}
            labelKey={option => option.podcastName || ''}
            filterBy={() => true}
            onChange={onSelectTypeahead}
            onSearch={onTypeaheadSearch}
            options={isSearching ? [] : rssTypeaheadResults}
            ref={inputRef}
            placeholder="Enter your podcast name or RSS feed"
            renderMenuItemChildren={renderTypeaheadOption}
          />
          <SearchIconWrapper>
            <Search size={24} color={mutedTextColor} />
          </SearchIconWrapper>
        </InputWrapper>
        {rssFeedError && rssFeedError.message && (
          <Message>{rssFeedError.message}</Message>
        )}
        {hasDataToContinue && !rssFeedIsValid && rssFeedError.message && (
          <Message>Sorry, the feed is not valid</Message>
        )}
      </FormGroup>

      {hasDataToContinue && (
        <SelectedPodcast>
          <SelectedPodcastImage
            src={rssFeedMetadata.image}
            alt={`Cover for the podcast ${rssFeedMetadata.podcastName}`}
          />
          <SelectedPodcastInfo>
            <SelectedPodcastName>
              {rssFeedMetadata.podcastName}
              <DesktopEpisodeCount>{episodeCount}</DesktopEpisodeCount>
            </SelectedPodcastName>
            {rssFeedMetadata.authorName && (
              <SelectedPodcastAuthor>
                by {rssFeedMetadata.authorName}
              </SelectedPodcastAuthor>
            )}
            {rssFeedMetadata.podcastDescription && (
              <SelectedPodcastDescription>
                {stripHtml(rssFeedMetadata.podcastDescription)}
              </SelectedPodcastDescription>
            )}
            <ButtonWrapper>
              <MarketingButton
                kind="button"
                onClick={() => {
                  onClickGetStarted();
                  trackEvent(
                    'importing_ux_get_started_button_clicked',
                    {},
                    // @ts-ignore
                    { providers: [mParticle] }
                  );
                }}
              >
                Switch your podcast
              </MarketingButton>
            </ButtonWrapper>
            <MobileEpisodeCount>{episodeCount}</MobileEpisodeCount>
          </SelectedPodcastInfo>
        </SelectedPodcast>
      )}
      {fetchingRSSFeedImport && (
        <SpinnerContainer>
          <Spinner color="white" />
        </SpinnerContainer>
      )}
    </div>
  );
};
