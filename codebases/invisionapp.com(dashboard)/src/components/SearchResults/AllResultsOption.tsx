import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Text, Truncate, Flex } from "@invisionapp/helios";
import { Search } from "@invisionapp/helios/icons";
import MenuOption from "./MenuOption";
import { useGlobalSearchUiContext } from "../GlobalSearchUiProvider";
import { SearchScope } from "../../types/SearchScope";
import { SearchTagType } from "../../types/SearchTagType";

const StyledSearch = styled(Search)`
  width: 21px;
  margin-left: 8px;
`;

const StyledOptionText = styled(Text)`
  margin-left: 16px;
  letter-spacing: 0;
`;

const StyledSpaceNameText = styled(Text)`
  margin-left: 8px;
  letter-spacing: 0;
`;

const StyledKeyWord = styled(Truncate)`
  margin-left: 6px;
  font-weight: 500;
  letter-spacing: 0;
  max-width: 300px;
`;

const StyledLabel = styled(Text)`
  margin-top: 16px;
  margin-left: 24px;
`;

const StyledMenuOption = styled(MenuOption)`
  margin-top: 8px;
`;
const AllResultsOption = ({
  keywords,
  isSelected,
  onSubmitSearch,
  index,
}: {
  keywords?: string;
  isSelected?: boolean;
  onSubmitSearch?: (
    keywords: string,
    method?: string,
    openInNewWindow?: boolean
  ) => void;
  index: number;
}) => {
  const { tags } = useGlobalSearchUiContext();
  const [spaceName, setSpaceName] = useState("");
  useEffect(() => {
    if (tags && tags.length > 0) {
      tags.forEach((tag: SearchTagType) => {
        if (tag.scope === SearchScope.space) {
          setSpaceName(tag.value as string);
        }
      });
    }
  }, [tags]);

  const handleClick = (e: MouseEvent) => {
    keywords &&
      onSubmitSearch &&
      onSubmitSearch(keywords, "quickList-show-all-results", e.metaKey);
  };

  if (!keywords) {
    return null;
  }

  return (
    <div data-testid="global-search-ui-all-results-option">
      <StyledLabel
        size="smallest"
        element="div"
        order="body"
        color="text-lightest"
      >
        All results
      </StyledLabel>
      <StyledMenuOption
        index={index}
        onClick={handleClick}
        isSelected={isSelected}
      >
        <Flex alignItems="center" alignContent="center">
          <StyledSearch size={24} strokeWidth="2" fill="text-lighter" />
          <StyledOptionText order="body">Show all results for</StyledOptionText>
          <Text order="body">
            <StyledKeyWord placement="end">{keywords || ""}</StyledKeyWord>
          </Text>
          {spaceName && spaceName.length > 0 && (
            <>
              <StyledSpaceNameText order="body">in</StyledSpaceNameText>
              <Text order="body">
                <StyledKeyWord placement="end">{spaceName}</StyledKeyWord>
              </Text>
            </>
          )}
        </Flex>
      </StyledMenuOption>
    </div>
  );
};

export default AllResultsOption;
