import React, { Component } from "react";
import TldrCollpasibleSection from "../../../common/TldrCollpasibleSection";
import {
  StyledFilterCollection,
  StyledImageFilter,
} from "../../../styled/details/stylesDetails";
import { imageAdjustments } from "./defaultImageFilters";
import { FILTER_TYPES } from "../../../canvas/handlers/ImageHandler";

class ImageFilters extends Component {
  constructor(props) {
    super(props);

    this.state = { collapse: false };
  }

  render() {
    const { canvasRef } = this.props;
    let filters = [];

    let activeImageObj = canvasRef.handler.canvas.getActiveObject();
    filters = activeImageObj?.filters;

    const childElements = imageAdjustments.map((adjustment, index) => {
      let adjustmentActive = false;

      if (filters && filters.length > 0) {
        filters.forEach((filter, index) => {
          if (FILTER_TYPES[index] === adjustment.filter && filter) {
            adjustmentActive = true;
          }
        });
      }

      return (
        <React.Fragment key={index}>
          <StyledImageFilter
            key={index}
            className={
              (filters?.length === 0 && adjustment.name === "Original") ||
              adjustmentActive
                ? "active"
                : ""
            }
            varient={adjustment}
            onClick={(event) => this.onImageFilterClick(adjustment)}
          >
            {adjustment.name}
          </StyledImageFilter>
        </React.Fragment>
      );
    });

    return (
      <>
        <TldrCollpasibleSection
          title="Filters"
          collapse={this.state.collapse}
          onToggleCollapse={this.handleToggleChange}
        >
          <StyledFilterCollection>{childElements}</StyledFilterCollection>
        </TldrCollpasibleSection>
      </>
    );
  }

  onImageFilterClick = (adjustment) => {
    const { canvasRef } = this.props;
    let activeObj = canvasRef.handler.canvas.getActiveObject();
    if (!activeObj) {
      return;
    }
    const findIndex = FILTER_TYPES.findIndex((ft) => ft === adjustment.filter);
    if (findIndex > -1 && activeObj.filters[findIndex]) {
      canvasRef.handler.imageHandler.removeImageFilter(adjustment);
    } else {
      canvasRef.handler.imageHandler.applyImageFilter(adjustment);
    }
  };

  handleToggleChange = () => {
    this.setState({ collapse: !this.state.collapse });
  };
}

ImageFilters.propTypes = {};

export default ImageFilters;
