import React from "react";
import styled from "styled-components";
import { Text, Flex, Truncate } from "@invisionapp/helios";

import TimeAgo from "./TimeAgo";
import Thumbnail from "./Thumbnail";
import ResourceTypeIcon from "./ResourceTypeIcon";
import convertoToCdnThumbnailUrl from "../../utils/convertToCdnThumbnailUrl";

import { ResourceType } from "../../types/ResourceType";
import {
  ISearchSpaceData,
  ISearchFreehandMetadata,
} from "../../types/SearchResults/ISearchResource";

export interface IDocumentResultItemProps {
  title: string;
  isSelected?: boolean;
  resourceType: string;
  logoSrc?: string;
  userLastAccessedAt?: Date;
  contentUpdatedAt: Date;
  space?: ISearchSpaceData;
  thumbnailUrl?: string;
  thumbnailAssetKey?: string;
  thumbnailAssetURL?: string;
  id: string;
  freehandMetadata?: ISearchFreehandMetadata;
  enableFreehandXCustomIcons?: boolean;
}

const StyleTitle = styled(Text)`
  line-height: 20px;
  margin-left: 8px;
  max-width: 450px;
`;

const StyledSpaceTitle = styled(Text)`
  max-width: 300px;
`;

const StyledResourceTypeIcon = styled(ResourceTypeIcon)`
  flex-shrink: 0;
  display: flex;
`;

const StyledThumbnail = styled(Thumbnail)`
  flex-shrink: 0;
`;

const RightContent = styled.div`
  margin-left: 16px;
`;

const DocumentResultItem = ({
  title,
  userLastAccessedAt,
  contentUpdatedAt,
  resourceType,
  logoSrc,
  space,
  isSelected,
  thumbnailUrl,
  freehandMetadata,
  enableFreehandXCustomIcons,
}: IDocumentResultItemProps) => {
  const projectTitle = space?.project?.title;
  const displayTitle = projectTitle ? projectTitle : space?.title;
  const freehandIconAssetURL =
    enableFreehandXCustomIcons && resourceType === "freehand"
      ? freehandMetadata?.iconAssetURL
      : undefined;

  return (
    <Flex alignContent="center" alignItems="center">
      <StyledThumbnail
        isSelected={isSelected}
        resourceType={resourceType as ResourceType}
        src={convertoToCdnThumbnailUrl(thumbnailUrl)}
      />
      <RightContent>
        <Flex alignContent="center" alignItems="center">
          <StyledResourceTypeIcon
            resourceType={resourceType}
            logoSrc={logoSrc}
            freehandLogoSrc={freehandIconAssetURL}
          />
          <StyleTitle order="body">
            <Truncate placement="end">{title}</Truncate>
          </StyleTitle>
        </Flex>
        <Flex alignContent="center" alignItems="center">
          {displayTitle && (
            <StyledSpaceTitle
              color="text-lighter"
              size="smallest"
              element="div"
              order="body"
            >
              <Truncate placement="end">{displayTitle}</Truncate>
            </StyledSpaceTitle>
          )}
          <TimeAgo
            withPrefixCaret={
              displayTitle && displayTitle.length > 0 ? true : false
            }
            userLastAccessedAt={userLastAccessedAt}
            contentUpdatedAt={contentUpdatedAt}
          />
        </Flex>
      </RightContent>
    </Flex>
  );
};

export default DocumentResultItem;
