import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import TldrSettingsBase from "../TldrSettingsBase";
import TldrCollpasibleSectionSettings from "../../_components/settings/TldrCollpasibleSectionSettings";
import {
  StyledBrandKitAddColorButton,
  StyledBrandKitColumn,
  StyledBrandKitNameRow,
  StyledBrandKitPaletteContainer,
  StyledBrandkitSectionLabels,
} from "../../_components/styled/settings/stylesSettings";
import EditableLabel from "../../_components/common/EditableLabel";
import { StyledButton } from "../../_components/styled/styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TldrConfirmationModal } from "../../_components/common/statelessView";
import BrandKitPalettes from "./BrandKitPalettes";
import {
  addColorPalette,
  deleteBrandKit,
  updateBrandKit,
  updateColorPalette,
} from "../../_actions/brandKitActions";
import { findIndex, isEmpty } from "lodash";
import BrandKitLogosSection from "./BrandKitLogosSection";
import BrandKitFontsSection from "./BrandKitFontsSection";
import Format from "string-format";
import {
  StyledColorPickerCover,
  StyledColorPickerPopover,
} from "../../_components/styled/details/stylesTextPanel";
import { SketchPicker } from "react-color";
import { DEFAULT_COLOR_PRESETS } from "../../_components/details/constants";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

class BrandKitSection extends Component {
  signal = axios.CancelToken.source();

  constructor(props) {
    super(props);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleFocusOut = this.handleFocusOut.bind(this);

    this.state = {
      collapse: false,
      isLoading: true,
      showDeletePopup: false,
      inProgress: "false",
      showFillColorPopup: false,
      newColor: "rgb(0,0,0)",
    };
  }

  addColorPalette = () => {
    this.props.addColorPalette(this.props.brandKitInfo.id, this.signal);
  };

  updateSelectedColor = (action, paletteId, colorInfo, changedValue) => {
    const { palette } = this.props.brandKitInfo;
    var colorIndex, paletteIndex, paletteArray;
    if (palette) {
      paletteIndex = findIndex(palette, (o) => {
        return o.id === paletteId;
      });
      paletteArray = palette[paletteIndex].colors;
      colorIndex = findIndex(paletteArray, (o) => {
        return o.rgb === colorInfo.rgb;
      });

      if (colorIndex > -1) {
        if (action === "delete") {
          paletteArray = paletteArray.filter(
            (color, index) => colorIndex !== index
          );
          palette[paletteIndex].colors = paletteArray;
        } else if (action === "updateColor") {
          paletteArray[colorIndex] = {
            ...colorInfo,
            rgb: changedValue,
          };
        }
      } else {
        if (action === "add") {
          paletteArray[changedValue] = colorInfo;
        }
      }

      // update palette
      this.props.updateColorPalette(
        this.props.brandKitInfo.id,
        paletteId,
        { colors: paletteArray },
        this.signal
      );
    }
  };

  addFont = () => {};

  deleteBrandkit = () => {
    this.props.deleteBrandKit(this.props.brandKitInfo.id, this.signal);
  };

  toggleDeletePopup = () => {
    this.setState({ showDeletePopup: !this.state.showDeletePopup });
  };

  updateBrandKitInfo = (newTitle) => {
    this.props.updateBrandKit(
      this.props.brandKitInfo.id,
      newTitle,
      this.signal
    );
  };

  toggleFillColorPopup = () => {
    const { showFillColorPopup } = this.state;

    this.setState({
      ...this.state,
      showFillColorPopup: !showFillColorPopup,
    });
  };

  closeColorPicker = () => {
    this.setState({
      ...this.state,
      showFillColorPopup: false,
    });
  };

  addMoreColor = ({ rgb, hex }, e) => {
    const { palette } = this.props.brandKitInfo;

    var newColor = {
      rgb: Format("rgb({},{},{})", rgb.r, rgb.g, rgb.b),
    };

    this.setState({ newColor: hex }, () => {
      this.updateSelectedColor(
        "add",
        palette[0].id,
        newColor,
        palette[0].colors.length
      );
    });
  };

  render() {
    const {
      collapse,
      showDeletePopup,
      inProgress,
      showFillColorPopup,
      newColor,
    } = this.state;
    const { brandKit, brandKitInfo } = this.props;
    const { loaded } = brandKit;
    const { palette } = brandKitInfo;
    let brandPaletteChild;

    if (loaded) {
      brandPaletteChild =
        palette &&
        palette.map((cp) => {
          return cp?.colors.map((color, i) => {
            return (
              <BrandKitPalettes
                key={i}
                colorInfo={color}
                isColorEmpty={isEmpty(color)}
                brandKitId={brandKitInfo.id}
                paletteId={cp.id}
                colorIndex={i + 1}
                updateSelectedColor={(action, paletteId, color, changedValue) =>
                  this.updateSelectedColor(
                    action,
                    paletteId,
                    color,
                    changedValue
                  )
                }
              />
            );
          });
        });
    }

    return (
      <>
        <TldrSettingsBase>
          <TldrCollpasibleSectionSettings
            title={brandKitInfo.title}
            collapse={collapse}
          >
            <StyledBrandKitNameRow>
              <EditableLabel
                text={brandKitInfo.title}
                labelClassName="brandkitname"
                inputClassName="brandkitinput"
                labelPlaceHolder={brandKitInfo.title + "&#xf02b;"}
                inputMaxLength={50}
                onFocus={this.handleFocus}
                onFocusOut={this.handleFocusOut}
              />

              <StyledButton
                type="submit"
                onClick={(e) => {
                  e.stopPropagation();
                  this.toggleDeletePopup();
                }}
              >
                <FontAwesomeIcon icon="trash" />
              </StyledButton>
            </StyledBrandKitNameRow>

            <BrandKitLogosSection brandKitInfo={brandKitInfo} />
            <BrandKitFontsSection brandKitInfo={brandKitInfo} />

            <StyledBrandKitColumn>
              <StyledBrandkitSectionLabels>
                <label>color palette</label>
              </StyledBrandkitSectionLabels>
              <StyledBrandKitPaletteContainer>
                {palette && palette.length > 0 ? (
                  <>
                    {brandPaletteChild}
                    <div style={{ position: "relative" }}>
                      <StyledBrandKitAddColorButton
                        onClick={this.toggleFillColorPopup}
                      >
                        <FontAwesomeIcon icon="plus" />
                      </StyledBrandKitAddColorButton>
                      {showFillColorPopup && (
                        <StyledColorPickerPopover
                          showBrandkitPaletteColors={false}
                          bottom={20}
                          right={25}
                        >
                          <StyledColorPickerCover
                            onClick={this.closeColorPicker}
                            style={{ width: "28px !important" }}
                          />
                          <SketchPicker
                            disableAlpha={true}
                            presetColors={DEFAULT_COLOR_PRESETS}
                            color={newColor}
                            onChangeComplete={this.addMoreColor}
                          />
                        </StyledColorPickerPopover>
                      )}
                    </div>
                  </>
                ) : (
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip id="add-palette">Add Color Palette</Tooltip>
                    }
                  >
                    <StyledBrandKitAddColorButton
                      type="submit"
                      onClick={this.addColorPalette}
                      bottomMargin={false}
                    >
                      <FontAwesomeIcon icon="plus" />
                    </StyledBrandKitAddColorButton>
                  </OverlayTrigger>
                )}
              </StyledBrandKitPaletteContainer>
            </StyledBrandKitColumn>
          </TldrCollpasibleSectionSettings>
        </TldrSettingsBase>

        <TldrConfirmationModal
          modalFor="Brandkit"
          inprogress={inProgress}
          show={showDeletePopup}
          onHide={(e) => {
            this.setState({
              ...this.state,
              showDeletePopup: false,
            });
          }}
          onYes={() => {
            this.setState(
              {
                inProgress: "true",
              },
              this.deleteBrandkit
            );
          }}
        />
      </>
    );
  }

  handleFocus(text) {}

  handleFocusOut(text) {
    const { brandKitInfo } = this.props;
    if (brandKitInfo.title === text) return;

    this.updateBrandKitInfo(text);
  }
}

BrandKitSection.propTypes = {};

const mapStateToProps = (state) => ({
  brandKit: state.brandKit,
});

const mapDispatchToProps = (dispatch) => ({
  deleteBrandKit: (id, signalToken) =>
    dispatch(deleteBrandKit(id, signalToken)),
  updateBrandKit: (id, newValue, signalToken) =>
    dispatch(updateBrandKit(id, newValue, signalToken)),
  addColorPalette: (id, signalToken) =>
    dispatch(addColorPalette(id, signalToken)),
  updateColorPalette: (brandkitId, paletteId, updatedBody, signalToken) =>
    dispatch(
      updateColorPalette(brandkitId, paletteId, updatedBody, signalToken)
    ),
});

export default connect(mapStateToProps, mapDispatchToProps)(BrandKitSection);
