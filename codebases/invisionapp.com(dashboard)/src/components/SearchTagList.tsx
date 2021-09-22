import React, { Fragment, memo } from "react";
import styled from "styled-components";

import { SearchScope } from "../types/SearchScope";
import { SearchTagType } from "../types/SearchTagType";

import SearchTag from "./SearchTag";

const StyledTagList = styled.div`
  align-self: center;
  align-items: center;
  cursor: default;
  display: flex;
  max-width: 200px;
  height: 100%;
  margin-left: 8px;
`;

const SearchTagList: React.FunctionComponent<{
  tags?: Array<SearchTagType>;
  onRemove?(index: number): void;
  hasFocus?: boolean;
  keepVisible?: boolean;
  isLastTagActive?: boolean;
}> = ({ tags, onRemove, hasFocus, keepVisible, isLastTagActive }) => {
  if (!tags || tags.length === 0) {
    return null;
  }

  if (!hasFocus && !keepVisible) {
    return null;
  }

  return (
    <StyledTagList>
      {(hasFocus || keepVisible) &&
        tags &&
        tags.map(({ scope, value, className, id }, i) => {
          const isLast = i === tags.length - 1;

          if (scope === SearchScope.space || scope === SearchScope.project) {
            return (
              <SearchTag
                selected={isLast && isLastTagActive}
                index={i}
                key={i}
                scope={scope}
                value={value}
                className={className}
                id={id}
                onRemove={onRemove}
              />
            );
          } else {
            return <Fragment key={i} />;
          }
        })}
    </StyledTagList>
  );
};

export default memo(SearchTagList);
