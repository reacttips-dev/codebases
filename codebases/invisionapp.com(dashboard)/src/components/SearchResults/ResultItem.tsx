import React from "react";

import SpaceResultItem from "./SpaceResultItem";
import ProjectResultItem from "./ProjectResultItem";
import DocumentResultItem from "./DocumentResultItem";
import navigate from "../../utils/navigate";
import MenuOption from "./MenuOption";

import {
  ISearchSpaceData,
  ISearchFreehandMetadata,
} from "../../types/SearchResults/ISearchResource";
import trackEvent from "../../utils/analytics";
import { isOfResourceType } from "../../types/ResourceType";

export interface IResultItemProps {
  id: string;
  title: string;
  spaceTitle?: string | undefined;
  isSelected?: boolean;
  resourceType: string;
  logoSrc?: string;
  userLastAccessedAt?: Date;
  contentUpdatedAt: Date;
  space?: ISearchSpaceData;
  path: string;
  thumbnailUrl?: string;
  documentCount?: number;
  index: number;
  thumbnailAssetKey?: string;
  thumbnailAssetURL?: string;
  freehandMetadata?: ISearchFreehandMetadata;
  enableFreehandXCustomIcons?: boolean;
}

const ResultItem = ({
  id,
  title,
  spaceTitle,
  isSelected,
  resourceType,
  logoSrc,
  userLastAccessedAt,
  contentUpdatedAt,
  space,
  path,
  index,
  documentCount,
  thumbnailUrl,
  freehandMetadata,
  enableFreehandXCustomIcons,
}: IResultItemProps) => {
  const handleClick = (e: MouseEvent) => {
    trackEvent("App.Search.QuickList.Result.Opened", {
      resultNumber: index,
      resourceType,
    });

    if (!isOfResourceType(resourceType)) {
      window.open(path, "_blank");
    } else {
      navigate(path, e.metaKey);
    }
  };

  return (
    <MenuOption index={index} isSelected={isSelected} onClick={handleClick}>
      {resourceType === "space" && (
        <SpaceResultItem
          title={title}
          userLastAccessedAt={userLastAccessedAt}
          contentUpdatedAt={contentUpdatedAt}
          id={id}
          isSelected={isSelected}
          documentCount={documentCount}
        />
      )}
      {resourceType === "project" && (
        <ProjectResultItem
          title={title}
          spaceTitle={spaceTitle}
          userLastAccessedAt={userLastAccessedAt}
          contentUpdatedAt={contentUpdatedAt}
          id={id}
          isSelected={isSelected}
          documentCount={documentCount}
        />
      )}
      {resourceType !== "space" && resourceType !== "project" && (
        <DocumentResultItem
          id={id}
          title={title}
          userLastAccessedAt={userLastAccessedAt}
          contentUpdatedAt={contentUpdatedAt}
          resourceType={resourceType}
          logoSrc={logoSrc}
          space={space}
          thumbnailUrl={thumbnailUrl}
          isSelected={isSelected}
          freehandMetadata={freehandMetadata}
          enableFreehandXCustomIcons={enableFreehandXCustomIcons}
        />
      )}
    </MenuOption>
  );
};

export default ResultItem;
