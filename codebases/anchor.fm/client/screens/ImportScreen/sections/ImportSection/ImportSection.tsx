import React, { RefObject } from 'react';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import {
  SearchSection,
  SearchSectionBackground,
  SearchContent,
  SearchHeading,
} from './styles';
import TypeaheadOption from './components/TypeaheadOption';
import {
  ImportForm,
  TypeaheadOption as TypeaheadOptionProps,
} from './components/ImportForm';

type ImportScreenProps = {
  onSubmit: (param: string) => void;
  onBlur: () => void;
  isSearching: boolean;
  onSelectTypeahead: (options: TypeaheadOptionProps[]) => void;
  onTypeaheadSearch: (value: string) => void;
  rssTypeaheadResults: TypeaheadOptionProps[];
  rssFeedError: {
    message: string;
  };
  fetchingRSSFeedImport: boolean;
  rssFeedIsValid: boolean;
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
  rssFeedUrl: string;
  autoFocus?: boolean;
  inputRef?: RefObject<AsyncTypeahead<TypeaheadOptionProps>>;
};

export function ImportSection({
  isSearching,
  rssTypeaheadResults,
  onTypeaheadSearch,
  onSelectTypeahead,
  onSubmit,
  fetchingRSSFeedImport,
  rssFeedUrl,
  rssFeedIsValid,
  rssFeedError,
  rssFeedMetadata,
  autoFocus,
  inputRef,
}: ImportScreenProps) {
  const hasDataToContinue: boolean =
    !fetchingRSSFeedImport && rssFeedMetadata && !!rssFeedMetadata.podcastName;

  return (
    <SearchSection>
      <SearchSectionBackground>
        <SearchContent>
          <SearchHeading>Switch in minutes</SearchHeading>
          <ImportForm
            autoFocus={autoFocus}
            isSearching={isSearching}
            onSelectTypeahead={onSelectTypeahead}
            onTypeaheadSearch={onTypeaheadSearch}
            rssTypeaheadResults={rssTypeaheadResults}
            renderTypeaheadOption={option => {
              const { image, podcastName, authorName } = option;
              return (
                <TypeaheadOption
                  image={image}
                  podcastName={podcastName}
                  authorName={authorName}
                />
              );
            }}
            rssFeedError={rssFeedError}
            hasDataToContinue={hasDataToContinue}
            fetchingRSSFeedImport={fetchingRSSFeedImport}
            rssFeedIsValid={rssFeedIsValid}
            onClickGetStarted={() => {
              onSubmit(rssFeedUrl);
            }}
            rssFeedMetadata={rssFeedMetadata}
            inputRef={inputRef}
          />
        </SearchContent>
      </SearchSectionBackground>
    </SearchSection>
  );
}
