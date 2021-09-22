import React, { memo } from "react";
import styled, { keyframes } from "styled-components";

import { Truncate, Tag } from "@invisionapp/helios";

import { SearchScope } from "../types/SearchScope";
import { SearchTagType } from "../types/SearchTagType";
import trackEvent from "../utils/analytics";

const tagVisibleAnimation = keyframes`
  from {
    transform: scale(0.96);
    opacity: 0;
  }

  to {
    transform: scale(1);
    opacity: 1;
  }
`;

const StyledSearchSpaceTag = styled(Tag)`
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0;
  line-height: 20px;
  overflow: hidden;
  margin-left: ${({ index = 0 }: { index: number }) =>
    index > 0 ? "4px" : "0px"};
  animation: ${tagVisibleAnimation} 0.4s cubic-bezier(0.72, 2.55, 0.2, 1);
  background-color: ${({ selected }) =>
    selected ? "rgba(48, 54, 214, 0.22)" : "rgba(48, 54, 214, 0.14)"};
  }
  color: rgb(29, 29, 31);
  > span > svg {
    color: rgb(29, 29, 31) !important;
  }
  :hover{
    background-color: rgba(48, 54, 214, 0.22);
    color: rgb(29, 29, 31);
  }
`;

const SearchTag: React.FunctionComponent<SearchTagType> = ({
  selected,
  scope,
  value,
  className,
  index,
  onRemove,
}) => {
  const handleRemoveClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation();
    e.preventDefault();

    const tagName: string = (e.target as HTMLElement).tagName.toLowerCase();
    if (tagName !== "svg" && tagName !== "path") {
      return;
    }

    let analyticsScope: string =
      scope === SearchScope.space ? "space" : "unknown";
    if (scope === SearchScope.project) analyticsScope = "project";

    trackEvent("App.Search.FilterRemoved", {
      filterType: analyticsScope,
      index,
    });

    onRemove && onRemove(index);
  };

  switch (scope) {
    case SearchScope.space:
    case SearchScope.project:
      return (
        <StyledSearchSpaceTag
          index={index}
          selected={selected}
          className={className}
          compact
          dismissable
          onMouseDown={handleRemoveClick}
        >
          <Truncate placement="end">{`in: ${value}`}</Truncate>
        </StyledSearchSpaceTag>
      );
    default:
      throw new Error("Unknown search scope");
  }
};

export default memo(SearchTag);
