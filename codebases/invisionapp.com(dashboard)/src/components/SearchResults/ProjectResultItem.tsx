import React from "react";
import styled from "styled-components";
import { Text, Flex, Truncate } from "@invisionapp/helios";

import TimeAgo from "./TimeAgo";
import Thumbnail from "./Thumbnail";

export interface IProjectResultItemProps {
  title: string;
  spaceTitle?: string;
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

const PrefixCaret = styled.div`
  height: 4px;
  width: 4px;
  border-radius: 50%;
  background-color: #cfcfd3;
  margin: 0 4px;
`;

const ProjectResultItem = ({
  title,
  spaceTitle,
  userLastAccessedAt,
  contentUpdatedAt,
  isSelected,
  documentCount,
}: IProjectResultItemProps) => {
  return (
    <Flex alignContent="center" alignItems="center">
      <StyledThumbnail resourceType="project" isSelected={isSelected} />
      <RightContent>
        <StyleTitle order="body">
          <Truncate placement="end">{title}</Truncate>
        </StyleTitle>
        <Flex alignContent="center" alignItems="center">
          <Text color="text-lighter" size="smallest" order="body">
            in {spaceTitle}
          </Text>
          <PrefixCaret />
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

export default ProjectResultItem;
