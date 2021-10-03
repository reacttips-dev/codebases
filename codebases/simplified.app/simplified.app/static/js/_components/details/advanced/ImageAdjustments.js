import React, { Component } from "react";
import { connect } from "react-redux";
import {
  StyledSliderFilterCollection,
  StyledAdvEditorToolbarFormatGroup,
} from "../../styled/details/stylesDetails";
import TldrCollpasibleSection from "../../common/TldrCollpasibleSection";
import TldrSlider from "../../common/TldrSlider";
import { StyledButton } from "../../styled/styles";
import { imageAdjustments } from "./imageEffects/defaultImageFilters";
import { findIndex } from "lodash";

class ImageAdjustments extends Component {
  constructor(props) {
    super(props);
    this.excludeFilterSlider = [
      "original",
      "grayscale",
      "invert",
      "sepia",
      "vintage",
      "brownie",
      "blackwhite",
      "kodachrome",
      "technicolor",
      "polaroid",
      "sharpen",
      "emboss",
    ];
    const { layerstore, editor } = this.props;
    let editorFormat = editor.activeElement.format;

    const layer = layerstore.layers[editor.activeElement.id];
    this.state = {
      lastUpdated: layer?.last_updated,
      filters: editorFormat.filters || [],
      collapse: false,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const layer =
      nextProps.layerstore.layers[nextProps.editor.activeElement.id];
    if (layer?.last_updated > prevState.lastUpdated) {
      return {
        ...prevState,
        lastUpdated: layer?.last_updated,
        filters: layer.payload.filters || [],
      };
    }
    return null;
  }

  handleToggleChange = () => {
    this.setState({ collapse: !this.state.collapse });
  };

  render() {
    const { filters } = this.state;

    const sliders = imageAdjustments.map((adjustment, index) => {
      // Don't render slider for excluded filter
      if (
        findIndex(
          this.excludeFilterSlider,
          (filter) => filter === adjustment.filter
        ) > -1
      ) {
        return <React.Fragment key={index}></React.Fragment>;
      }

      // Get filter index from applied format
      let filterTypeIndex = filters.findIndex((filter) => {
        if (!filter) {
          return false;
        }
        return adjustment.name === filter.type;
      });

      let sliderValue = 0;
      if (filters[filterTypeIndex]) {
        if (adjustment.name === "HueRotation") {
          sliderValue = parseFloat(filters[filterTypeIndex].rotation).toFixed(
            2
          );
        } else {
          sliderValue = parseFloat(
            filters[filterTypeIndex][adjustment.filter]
          ).toFixed(2);
        }
      }

      return (
        <React.Fragment key={index}>
          {adjustment.filter && (
            <StyledAdvEditorToolbarFormatGroup key={index}>
              <div className="title">{adjustment.name}</div>
              <div className="actions mr-3">
                <TldrSlider
                  hideIndicator={true}
                  values={[sliderValue]}
                  varient={adjustment}
                  key={index}
                  // onUpdate={(values) =>
                  //   this.onUpdateAdjustmentSlider(values, adjustment)
                  // }
                  onChange={(values) =>
                    this.onChangeAdjustmentSlider(
                      sliderValue,
                      values,
                      adjustment
                    )
                  }
                  step={adjustment.step}
                  domain={adjustment.domain}
                />
              </div>
            </StyledAdvEditorToolbarFormatGroup>
          )}
        </React.Fragment>
      );
    });

    return (
      <>
        <TldrCollpasibleSection
          title="Adjust"
          collapse={this.state.collapse}
          onToggleCollapse={this.handleToggleChange}
        >
          <StyledSliderFilterCollection className="mb-3">
            {sliders}
          </StyledSliderFilterCollection>
          <StyledAdvEditorToolbarFormatGroup>
            <StyledButton onClick={this.resetFilters}>
              Reset Filters
            </StyledButton>
          </StyledAdvEditorToolbarFormatGroup>
        </TldrCollpasibleSection>
      </>
    );
  }

  onUpdateAdjustmentSlider = (values, adjustment) => {
    const { canvasRef } = this.props;
    adjustment.values = values;
    canvasRef.handler.imageHandler.applyImageFilter(adjustment);
  };

  onChangeAdjustmentSlider = (sliderValue, values, adjustment) => {
    const { canvasRef } = this.props;

    // Check if the slider value is different than default value
    if (sliderValue !== values[0].toFixed(2).toString()) {
      adjustment.values = values;
      canvasRef.handler.imageHandler.applyImageFilter(adjustment);
    }
  };

  resetFilters = () => {
    this.props.canvasRef.handler.imageHandler.applyImageFilter(
      imageAdjustments[0]
    );
  };
}

ImageAdjustments.propTypes = {};

const mapStateToProps = (state) => ({
  editor: state.editor,
  layerstore: state.layerstore,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(ImageAdjustments);
