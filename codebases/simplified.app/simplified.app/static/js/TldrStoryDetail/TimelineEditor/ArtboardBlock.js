import React from "react";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

import { StyledArtboardBlock } from "./styled";
import { DURATION_PIXEL_RATIO } from "../../_components/styled/variable";
import ArtBoardPreviewStaticCanvas from "../ArtBoardPreviewStaticCanvas";
import {
  StyledArtboardPreviewDuration,
  StyledArtBoardPreviewTitle,
} from "../../_components/styled/details/styleArtBoardEditor";
import ArtBoardPreviewDropdownActions from "../ArtBoardPreviewDropdownActions";

dayjs.extend(duration);

function ArtboardBlock({ order, start, end, isActive, page, onClick, scale }) {
  const duration = end - start;
  const width = (end - start) * (DURATION_PIXEL_RATIO * scale);
  return (
    <StyledArtboardBlock
      isActive={isActive}
      style={{ width: width }}
      onClick={onClick}
    >
      <div>
        <StyledArtBoardPreviewTitle
          className="justify-content-start"
          location="preview-container"
        >
          <p>{order + 1}</p>
        </StyledArtBoardPreviewTitle>
        <ArtBoardPreviewDropdownActions
          pageId={page.id}
          showForActiveArtboardOnly={false}
        />
        <ArtBoardPreviewStaticCanvas page={page}></ArtBoardPreviewStaticCanvas>

        {duration && (
          <StyledArtboardPreviewDuration>
            {dayjs.duration(duration, "seconds").format("mm:ss")}
          </StyledArtboardPreviewDuration>
        )}
      </div>
    </StyledArtboardBlock>
  );
}

ArtboardBlock.defaultProps = {
  scale: 1,
};

ArtboardBlock.propTypes = {
  page: PropTypes.object.isRequired,
  start: PropTypes.number,
  end: PropTypes.number,
  id: PropTypes.string,
  order: PropTypes.number,
  isActive: PropTypes.bool,
  onClick: PropTypes.func,
  scale: PropTypes.number,
};

export default ArtboardBlock;
