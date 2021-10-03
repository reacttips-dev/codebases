import React, { Component } from "react";
import ImageFilters from "./ImageFilters";
import ImageAdjustments from "../ImageAdjustments";

class ImageEffects extends Component {
  render() {
    const { canvasRef } = this.props;
    return (
      <>
        <ImageFilters canvasRef={canvasRef} />
        <ImageAdjustments canvasRef={canvasRef} />
      </>
    );
  }
}

ImageEffects.propTypes = {};

export default ImageEffects;
