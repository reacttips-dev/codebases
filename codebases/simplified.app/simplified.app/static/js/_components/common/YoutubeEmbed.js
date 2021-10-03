import React from "react";
import PropTypes from "prop-types";
import { StyledVideoResponsive } from "../styled/home/stylesHome";

const YoutubeEmbed = ({ embedId, width, height, title }) => (
  <StyledVideoResponsive>
    <iframe
      width={width}
      height={height}
      src={embedId}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      title={title}
    />
  </StyledVideoResponsive>
);

YoutubeEmbed.propTypes = {
  embedId: PropTypes.string.isRequired,
};

export default YoutubeEmbed;
