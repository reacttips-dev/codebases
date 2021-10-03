import React, { Component } from "react";
import { StyledContentDetails } from "../styled/styles";

class SourceCreditInfo extends Component {
  render() {
    const {
      authorLink,
      authorName,
      sourceSiteName,
      sourceSiteLink,
      isDragging,
    } = this.props;
    return (
      <StyledContentDetails
        className={"content-details"}
        isDragging={isDragging}
      >
        <p>
          By{" "}
          <a href={authorLink} target="_blank" rel="noreferrer noopener">
            {authorName}
          </a>{" "}
          on{" "}
          <a href={sourceSiteLink} target="_blank" rel="noreferrer noopener">
            {sourceSiteName}
          </a>
        </p>
      </StyledContentDetails>
    );
  }
}

SourceCreditInfo.propTypes = {};

export default SourceCreditInfo;
