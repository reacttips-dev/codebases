import React from "react";
import { Modal } from "@invisionapp/helios";
import styled from "styled-components";

import ResultItem from "./ResultItem";
import AllResultsOption from "./AllResultsOption";
import Footer from "./Footer";

import { IResultsModal } from "../../types/SearchResults/IResultsModal";
import theme from "@invisionapp/helios/css/theme";
import { useGlobalSearchUiContext } from "../GlobalSearchUiProvider";
import { isOfResourceType } from "../../types/ResourceType";

const StyledModalContent = styled.div`
  margin-top: 8px;
  margin-bottom: 16px;
`;

const StyledModal = styled(Modal)`
  border-radius: 4px;
  background-color: #ffffff;
  box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.15), 0 0 1px 0 rgba(0, 0, 0, 0.2);
  position: fixed;
  top: 59px;
  left: 316px;
  @media (max-width: ${theme.breakpoints.l - 1}px) {
    top: 50px;
    left: 50px;
  }
`;

const ResultsModal = ({
  searchResults,
  selectedSearchOption,
  open,
  keywords,
  onSubmitSearch,
}: IResultsModal) => {
  const {
    externalDocEntries,
    getExtDocFallbackIcon,
    enableFreehandXCustomIcons,
  } = useGlobalSearchUiContext();

  if (!searchResults || searchResults.length === 0 || !open) {
    return null;
  }

  return (
    <StyledModal
      open={open}
      aria-label="Search Results"
      disableAutofocus
      maxWidth={600}
      onRequestClose={() => {}}
      role="listbox"
      disableEventBubbling={false}
      data-testid="global-search-ui-results-modal"
    >
      <StyledModalContent>
        {searchResults &&
          searchResults.map(
            (
              {
                id,
                title,
                userLastAccessedAt,
                contentUpdatedAt,
                space,
                resourceType,
                path,
                thumbnailAssetURL,
                documentCount,
                freehandMetadata,
              },
              index
            ) => {
              const isSelected =
                selectedSearchOption !== -1 &&
                selectedSearchOption % (searchResults.length + 1) === index;

              const logoSrc = !isOfResourceType(resourceType)
                ? externalDocEntries?.[resourceType]?.logoSrc ||
                  getExtDocFallbackIcon?.(resourceType)
                : null;

              return (
                <ResultItem
                  id={id}
                  isSelected={isSelected}
                  key={index}
                  title={title}
                  spaceTitle={space && space.title}
                  userLastAccessedAt={userLastAccessedAt}
                  contentUpdatedAt={contentUpdatedAt}
                  space={space}
                  resourceType={resourceType}
                  logoSrc={logoSrc}
                  path={path}
                  thumbnailUrl={thumbnailAssetURL}
                  data-testid={`global-search-ui-result-item-${index}`}
                  documentCount={documentCount}
                  index={index}
                  freehandMetadata={freehandMetadata}
                  enableFreehandXCustomIcons={enableFreehandXCustomIcons}
                />
              );
            }
          )}
        <AllResultsOption
          isSelected={
            searchResults
              ? selectedSearchOption === searchResults.length
              : false
          }
          keywords={keywords}
          onSubmitSearch={onSubmitSearch}
          index={searchResults.length}
        />
      </StyledModalContent>
      <Footer />
    </StyledModal>
  );
};

export default ResultsModal;
