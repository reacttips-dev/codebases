import { isEmpty } from "lodash";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import Switch from "react-switch";
import {
  checkInputboxValueRangeForSlider,
  rgbaTohex,
} from "../../_utils/common";
import {
  DEFAULT_DROP_SHADOW_VALUES,
  DOMAIN_0_TO_100,
  DOMAIN_0_TO_360,
  DOMAIN_NEG100_TO_100,
  SLIDER_VALUE_REGEX,
} from "../details/constants";
import {
  StyledAdvEditorToolbarFormatGroup,
  StyledAdvEditorToolbarRow,
  StyledDropShadowCollection,
  StyledDropShadowEffect,
} from "../styled/details/stylesDetails";
import { accent, accentGrey, white } from "../styled/variable";
import TldrCollpasibleSection from "./TldrCollpasibleSection";
import TLDRColorPicker from "./TLDRColorPicker";
import TldrSlider from "./TldrSlider";

export class TldrDropShadow extends Component {
  constructor(props) {
    super(props);

    let shadow = props.editor.activeElement.format?.shadow;
    let offsetY = shadow?.offsetY ? shadow.offsetY : 0;
    let offsetX = shadow?.offsetX ? shadow.offsetX : 0;
    let shadowBlur = shadow?.blur ? shadow.blur : 0;
    let shadowColor = shadow?.color ? shadow.color : "rgba(0, 0, 0, 1)";
    let angle =
      shadow === null
        ? 0
        : Math.round(Math.atan2(offsetY, offsetX) * (180 / Math.PI)) || 0;
    angle = angle < 0 ? (angle += 360) : angle;

    this.state = {
      shadow: shadow,
      offsetY: shadow === null ? 0 : offsetY,
      offsetX: shadow === null ? 0 : offsetX,
      blur: shadow === null ? 0 : shadowBlur,
      color: shadow === null ? "rgba(0, 0, 0, 1)" : shadowColor,
      showColorPicker: false,
      rotation: angle,
      distance:
        shadow === null
          ? 0
          : Math.sqrt(Math.pow(offsetX, 2) + Math.pow(offsetY, 2)) || 0,
      checked: shadow && (offsetX !== 0 || offsetY !== 0) ? true : false,
      collapse: true,
      effectName: "none",
    };
  }

  dropShadow = (method) => {
    const { color, blur, rotation, distance, checked } = this.state;
    const radian = rotation * (Math.PI / 180);
    const offsetY = Math.round(distance * Math.sin(radian));
    const offsetX = Math.round(distance * Math.cos(radian));
    this.props.canvasRef.handler.objectHandler.dropShadow(
      {
        offsetX,
        offsetY,
        color,
        blur,
        rotation,
        distance,
        checked,
      },
      method
    );
  };

  onSwitchChange = (checked, event, id) => {
    this.setState(
      {
        checked: checked,
        distance: checked ? DEFAULT_DROP_SHADOW_VALUES.distance : 0,
        rotation: checked ? DEFAULT_DROP_SHADOW_VALUES.rotation : 0,
        blur: checked ? DEFAULT_DROP_SHADOW_VALUES.blur : 0,
        color: checked ? DEFAULT_DROP_SHADOW_VALUES.color : "rgba(0, 0, 0, 1)",
        collapse: checked ? this.state.collapse : true,
      },
      () => this.dropShadow("push")
    );
  };

  renderSwitch = () => {
    return (
      <Switch
        onChange={this.onSwitchChange}
        checked={this.state.checked}
        offColor={white}
        onColor={accent}
        offHandleColor={accentGrey}
        checkedIcon={false}
        uncheckedIcon={false}
        height={15}
        width={40}
      />
    );
  };

  handleToggleChange = () => {
    if (this.state.collapse && this.state.checked === false) {
      this.setState(
        {
          collapse: !this.state.collapse,
        },
        () => this.onSwitchChange(true)
      );
    } else {
      this.setState({ collapse: !this.state.collapse });
    }
  };

  applyShadow = (shadow) => {
    this.setState(
      (state) => ({
        effectName: state.effectName === shadow.effect ? "none" : shadow.effect,
        rotation: state.effectName === shadow.effect ? 0 : shadow.rotation,
        distance: state.effectName === shadow.effect ? 0 : shadow.distance,
        blur: state.effectName === shadow.effect ? 0 : shadow.blur,
        color: shadow.color,
        checked:
          shadow.effect === "none" || state.effectName === shadow.effect
            ? false
            : true,
      }),
      () => this.dropShadow("push")
    );
  };

  componentDidMount() {
    this.setState({
      collapse: this.state.checked ? false : true,
    });
  }

  render() {
    const { blur, color, distance, rotation } = this.state;
    const { brandKit } = this.props;
    const { title, palette } =
      brandKit.brandkitPayload.length > 0 && brandKit.brandkitPayload[0];
    const predefinedDropShadowEffects = [
      {
        name: "None",
        effect: "none",
        rotation: 0,
        distance: 0,
        blur: 0,
        color: "rgba(0,0,0,0)",
      },
      {
        name: "Soft",
        effect: "soft",
        rotation: DEFAULT_DROP_SHADOW_VALUES.rotation,
        distance: DEFAULT_DROP_SHADOW_VALUES.distance,
        blur: 10,
        color:
          color === "rgba(0,0,0,0)" ? DEFAULT_DROP_SHADOW_VALUES.color : color,
      },
      {
        name: "Regular",
        effect: "regular",
        rotation: DEFAULT_DROP_SHADOW_VALUES.rotation,
        distance: DEFAULT_DROP_SHADOW_VALUES.distance,
        blur: 5,
        color:
          color === "rgba(0,0,0,0)" ? DEFAULT_DROP_SHADOW_VALUES.color : color,
      },
      {
        name: "Retro",
        effect: "retro",
        rotation: DEFAULT_DROP_SHADOW_VALUES.rotation,
        distance: DEFAULT_DROP_SHADOW_VALUES.distance,
        blur: 0,
        color:
          color === "rgba(0,0,0,0)" ? DEFAULT_DROP_SHADOW_VALUES.color : color,
      },
    ];

    const presetOptions = predefinedDropShadowEffects.map(
      (adjustment, index) => {
        return (
          <StyledDropShadowEffect
            effect={adjustment.effect}
            onClick={() => this.applyShadow(adjustment)}
            className={
              this.state.blur === adjustment.blur &&
              this.state.rotation === adjustment.rotation
                ? "active"
                : ""
            }
            key={index}
          >
            <div className="title">{adjustment.name}</div>
          </StyledDropShadowEffect>
        );
      }
    );
    return (
      <TldrCollpasibleSection
        title="Drop Shadow"
        collapse={this.state.collapse}
        toggleButton={this.renderSwitch()}
        onToggleCollapse={this.handleToggleChange}
      >
        <StyledDropShadowCollection className="mb-3">
          {presetOptions}
        </StyledDropShadowCollection>

        <div className="actions mb-2">
          <TldrSlider
            hideIndicator={true}
            domain={DOMAIN_0_TO_360}
            values={[rotation]}
            onUpdate={this.onUpdateRotation}
            onChange={this.onChangeRotation}
            disabled={this.state.checked ? false : true}
            showDecimals={false}
            title="Rotation"
            maxLength={3}
            handleFocus={this.onUpdateRotation}
            handleFocusOut={this.onChangeRotation}
            showInputbox={true}
          ></TldrSlider>
        </div>

        <div className="actions mb-2">
          <TldrSlider
            hideIndicator={true}
            domain={DOMAIN_NEG100_TO_100}
            values={[distance]}
            onUpdate={this.onUpdateDistance}
            onChange={this.onChangeDistance}
            disabled={this.state.checked ? false : true}
            showDecimals={false}
            title="Distance"
            maxLength={4}
            handleFocus={this.onUpdateDistance}
            handleFocusOut={this.onChangeDistance}
            showInputbox={true}
          ></TldrSlider>
        </div>

        <div className="actions mb-2">
          <TldrSlider
            hideIndicator={true}
            values={[blur]}
            onUpdate={this.onUpdateBlur}
            onChange={this.onChangeBlur}
            disabled={this.state.checked ? false : true}
            showDecimals={false}
            title="Blur"
            maxLength={3}
            handleFocus={this.onUpdateBlur}
            handleFocusOut={this.onChangeBlur}
            showInputbox={true}
          ></TldrSlider>
        </div>

        <StyledAdvEditorToolbarRow>
          <StyledAdvEditorToolbarFormatGroup>
            <div className="title">Shadow Color</div>
            <TLDRColorPicker
              colorCode={rgbaTohex(color)}
              color={color}
              callback={this.onColorChangeComplete}
              top={
                brandKit.brandkitPayload.length > 0
                  ? isEmpty(palette)
                    ? -390
                    : -420
                  : -305
              }
              right={brandKit.brandkitPayload.length > 0 ? -87 : -74}
              showBrandkitPaletteColors={brandKit.brandkitPayload.length > 0}
            />
          </StyledAdvEditorToolbarFormatGroup>
        </StyledAdvEditorToolbarRow>
      </TldrCollpasibleSection>
    );
  }

  onUpdateRotation = (value) => {
    if (typeof value === "object") {
      const { rotation } = this.state;
      if (rotation === Number(value[0])) return;

      this.setState(
        {
          ...this.state,
          rotation: value[0],
        },
        () => {
          this.dropShadow("commit");
        }
      );
    } else if (typeof value === "string") {
    }
  };

  onChangeRotation = (value) => {
    if (typeof value === "object") {
      this.dropShadow("push");
    } else if (typeof value === "string") {
      this.handleRotationFocusOut(value);
    }
  };

  onUpdateDistance = (value) => {
    if (typeof value === "object") {
      const { distance } = this.state;
      if (distance === Number(value[0])) return;

      this.setState(
        {
          ...this.state,
          distance: value[0],
        },
        () => {
          this.dropShadow("commit");
        }
      );
    } else if (typeof value === "string") {
    }
  };

  onChangeDistance = (value) => {
    if (typeof value === "object") {
      this.dropShadow("push");
    } else if (typeof value === "string") {
      this.handleDistanceFocusOut(value);
    }
  };

  onUpdateBlur = (value) => {
    if (typeof value === "object") {
      const { blur } = this.state;

      if (blur === Number(value[0])) return;

      this.setState(
        {
          ...this.state,
          blur: value[0],
        },
        () => {
          this.dropShadow("commit");
        }
      );
    } else if (typeof value === "string") {
    }
  };

  onChangeBlur = (value) => {
    if (typeof value === "object") {
      this.dropShadow("push");
    } else if (typeof value === "string") {
      this.handleBlurFocusOut(value);
    }
  };

  onColorChangeComplete = (action, hex) => {
    const { color } = this.state;
    if (color === hex) return;
    this.setState(
      {
        ...this.state,
        color: hex,
      },
      () => {
        this.dropShadow("push");
      }
    );
  };

  handleRotationFocusOut = (text) => {
    let rotationValue = null;
    if (
      text.match(SLIDER_VALUE_REGEX) &&
      checkInputboxValueRangeForSlider(text, DOMAIN_0_TO_360)
    ) {
      const { rotation } = this.state;

      if (rotation === Number(text)) return;
      rotationValue = text;
    }
    this.setState(
      {
        rotation: rotationValue,
      },
      () => {
        this.dropShadow("push");
      }
    );
  };

  handleDistanceFocusOut = (text) => {
    let distanceValue = null;

    if (
      text.match(SLIDER_VALUE_REGEX) &&
      checkInputboxValueRangeForSlider(text, DOMAIN_NEG100_TO_100)
    ) {
      const { distance } = this.state;

      if (distance === Number(text)) return;
      distanceValue = text;
    }
    this.setState(
      {
        distance: distanceValue,
      },
      () => {
        this.dropShadow("push");
      }
    );
  };

  handleBlurFocusOut = (text) => {
    let blurValue = null;
    if (
      text.match(SLIDER_VALUE_REGEX) &&
      checkInputboxValueRangeForSlider(text, DOMAIN_0_TO_100)
    ) {
      const { blur } = this.state;

      if (blur === Number(text)) return;
      blurValue = text;
    }
    this.setState(
      {
        blur: blurValue,
      },
      () => {
        this.dropShadow("push");
      }
    );
  };
}

TldrDropShadow.propTypes = {
  editor: PropTypes.object.isRequired,
  layerstore: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  editor: state.editor,
  layerstore: state.layerstore,
  brandKit: state.brandKit,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(TldrDropShadow);
