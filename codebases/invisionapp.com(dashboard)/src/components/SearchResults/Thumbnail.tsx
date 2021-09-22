import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Spaces } from "@invisionapp/helios/icons";
import { DocumentIcon } from "@invisionapp/helios";

import EmptyThumbnail from "./EmptyThumbnail";
import { IThumbnail } from "../../types/SearchResults/IThumbnail";
import { AspectRatio } from "../../types/SearchResults/AspectRatio";

const StyledThumbnail = styled.div<IThumbnail>`
  box-sizing: border-box;
  height: 49px;
  width: 70px;
  border: 0.88px solid #dee0e4;
  border-radius: 3.5px;
  background-color: #f8f8fa;
  position: relative;
  overflow: hidden;
  background-color: ${({ isSelected }) => (isSelected ? "white" : "#f8f8fa")};
`;

const StyledThumbnailNoBorder = styled.div<IThumbnail>`
  box-sizing: border-box;
  height: 49px;
  width: 70px;
`;
export interface IImageWrap {
  aspectRatio?: AspectRatio;
}

export const ImgWrap = styled.div<IImageWrap>`
  margin: auto;
  overflow: hidden;
  max-width: 50px;
  width: ${({ aspectRatio }) =>
    aspectRatio === "landscape" ? "50px" : "30px"};
  height: ${({ aspectRatio }) =>
    aspectRatio === "landscape" ? "100%" : "50px"};
  display: block;
  margin-top: ${({ aspectRatio }) =>
    aspectRatio === "landscape" ? "3px" : "auto"};
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12);
  padding: 1px;
`;

export const StyledImg = styled.img`
  width: 100%;
  height: 100%;
  margin: auto;
`;

const StyledEmptyThumbnail = styled(EmptyThumbnail)`
  height: auto;
  width: 49px;
  padding: 1px;
`;

const IconWrap = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
  align-content: center;
  align-items: center;
`;

const StyledSpaces = styled(Spaces)`
  width: 20px;
`;

const StyledIcon = styled.div`
  display: flex;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 3.5px;
  background: #1d1d1f;
  align-content: center;
  align-items: center;
`;

const Thumbnail = ({
  src,
  className,
  resourceType,
  isSelected,
}: IThumbnail) => {
  const [isLoaded, setIsLoaded] = useState<Boolean>(false);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("landscape");

  const onImageLoaded = ({ target }: any) => {
    if (target && target.width && target.height) {
      const width = target.width;
      const height = target.height;

      setIsLoaded(true);
      setAspectRatio(width / height >= 1 ? "landscape" : "portrait");
    }
  };

  useEffect(() => {
    if (resourceType !== "space" && src && src.length > 0) {
      const img = new Image();
      img.onload = onImageLoaded;
      img.src = src;
    }
  }, [src, resourceType]);

  return resourceType !== "space" && resourceType !== "project" ? (
    <StyledThumbnail
      className={className}
      data-testid="global-search-ui-thumbnail"
      isSelected={isSelected}
      resourceType={resourceType}
    >
      {src && isLoaded && (
        <ImgWrap
          aspectRatio={aspectRatio}
          data-testid="global-search-ui-thumbnail-img"
        >
          <StyledImg src={src} />
        </ImgWrap>
      )}
      {(!src || src.length === 0) && (
        <ImgWrap
          aspectRatio="landscape"
          data-testid="global-search-ui-thumbnail-empty"
        >
          <StyledEmptyThumbnail />
        </ImgWrap>
      )}
    </StyledThumbnail>
  ) : (
    <StyledThumbnailNoBorder
      isSelected={isSelected}
      resourceType={resourceType}
      data-testid={`global-search-ui-thumbnail-${
        resourceType === "project" ? "project" : "space"
      }`}
    >
      <IconWrap>
        <StyledIcon>
          {resourceType === "project" ? (
            <DocumentIcon size="32" documentType="project" />
          ) : (
            <StyledSpaces fill="white" />
          )}
        </StyledIcon>
      </IconWrap>
    </StyledThumbnailNoBorder>
  );
};

export default Thumbnail;
