import React from "react";
import styled from "styled-components";
import { Text, Flex, Truncate } from "@invisionapp/helios";

import TimeAgo from "./TimeAgo";
import Thumbnail from "./Thumbnail";

export interface ISpaceResultItemProps {
  title: string;
  isSelected?: boolean;
  userLastAccessedAt?: Date;
  contentUpdatedAt: Date;
  id: string;
  documentCount?: number;
}

const RightContent = styled.div`
  margin-left: 16px;
`;

const StyleTitle = styled(Text)`
  line-height: 20px;
  max-width: 300px;
`;

const StyledThumbnail = styled(Thumbnail)`
  flex-shrink: 0;
  background-color: ${({ isSelected }) => (isSelected ? "white" : "#f8f8fa")};
`;

const SpaceResultItem = ({
  title,
  userLastAccessedAt,
  contentUpdatedAt,
  isSelected,
  documentCount,
}: ISpaceResultItemProps) => {
  return (
    <Flex alignContent="center" alignItems="center">
      <StyledThumbnail resourceType="space" isSelected={isSelected} />
      <RightContent>
        <StyleTitle order="body">
          <Truncate placement="end">{title}</Truncate>
        </StyleTitle>
        <Flex alignContent="center" alignItems="center">
          <Text color="text-lighter" size="smallest" order="body">
            {documentCount === 1
              ? `${documentCount} document`
              : `${documentCount || 0} documents`}
          </Text>
          <TimeAgo
            withPrefixCaret
            userLastAccessedAt={userLastAccessedAt}
            contentUpdatedAt={contentUpdatedAt}
          />
        </Flex>
      </RightContent>
    </Flex>
  );
};

export default SpaceResultItem;
