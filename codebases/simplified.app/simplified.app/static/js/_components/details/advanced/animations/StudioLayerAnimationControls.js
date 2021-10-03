import React, { Component } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import { connect } from "react-redux";
import {
  StyledAdvEditorToolbarFormatGroup,
  StyledAdvEditorToolbarRow,
} from "../../../styled/details/stylesDetails";
import { predefinedSpeeds, easingOptions } from "./defaultSlideTransitions";
import {
  StyledSpeedActionButton,
  StyledAnimationButtonGroup,
} from "../../../styled/styles";
import TldrCollpasibleSection from "../../../common/TldrCollpasibleSection";
import { ENTER_ANIMATION } from "../../../../_actions/types";
import { enterEffects, exitEffects } from "./defaultLayerAnimations";
import { TldrCollapsableAction } from "../../../common/statelessView";
import TldrAnimationOptions from "../../../../_components/common/TldrAnimationOptions";

export class StudioLayerAnimationControls extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: props.index,
      animationStore:
        props.animation.motion === ENTER_ANIMATION ? enterEffects : exitEffects,
      loop: props.animation.loop,
      trans_duration: props.animation.trans_duration, // Normal
      animationType: props.animation.type,
      easing: props.animation.easing,
      delay: props.animation.delay,
      collapse: true,
    };
  }

  static getDerivedStateFromProps(props, state) {
    const { animation } = props;
    if (
      animation.loop !== state.loop ||
      animation.trans_duration !== state.trans_duration ||
      animation.type !== state.animationType ||
      animation.delay !== state.delay ||
      animation.easeInQuad !== state.easeInQuad
    ) {
      return {
        loop: animation.loop,
        trans_duration: animation.trans_duration,
        animationType: animation.type,
        delay: animation.delay,
        easeInQuad: animation.easing,
      };
    }
    return null;
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !_.isEqual(this.state, nextState);
  }

  handleToggleChange = () => {
    this.setState({ collapse: !this.state.collapse });
  };

  onDeleteAnimation = () => {
    const { layers, editor, canvasRef } = this.props;
    const currentAnimations = layers[editor.activeElement.id].payload.animation;
    const selectedAnimation = currentAnimations[this.state.index];

    let stillAnimation = currentAnimations[1];
    if (this.state.index === 0) {
      stillAnimation["start_time"] = selectedAnimation["start_time"];
    } else {
      stillAnimation["end_time"] = selectedAnimation["end_time"];
    }
    stillAnimation["trans_duration"] =
      stillAnimation["end_time"] - stillAnimation["start_time"];

    currentAnimations.splice(this.state.index, 1);
    if (currentAnimations.length === 1) {
      canvasRef.handler.removeKey("animation");
      return;
    }
    canvasRef.handler.set("animation", currentAnimations);
  };

  previewEffect = () => {
    const { editor, canvasRef, layers } = this.props;
    const currentAnimations = layers[editor.activeElement.id].payload.animation;

    canvasRef.handler.animationHandler.previewAndUpdate(
      editor.activeElement,
      currentAnimations,
      this.state.index,
      false
    );
  };

  actionCallback = (action) => {
    if (action === "delete") {
      this.onDeleteAnimation();
    } else if (action === "edit") {
    } else if (action === "play") {
      this.previewEffect();
    }
  };

  onOptionChange = (adjustment) => {
    const { editor, canvasRef, layers } = this.props;
    const currentAnimations = layers[editor.activeElement.id].payload.animation;
    const selectedAnimation = currentAnimations[this.state.index];
    selectedAnimation["type"] = adjustment.type;

    this.setState({
      ...this.state,
      animationType: adjustment.type,
    });

    canvasRef.handler.animationHandler.previewAndUpdate(
      editor.activeElement,
      currentAnimations,
      this.state.index
    );
  };

  onChangeControl = (key, newValue) => {
    const { editor, layers, canvasRef } = this.props;
    const currentAnimations = layers[editor.activeElement.id].payload.animation;

    currentAnimations[this.state.index][key] = newValue;
    if (key === "loop") {
      canvasRef.handler.set("animation", currentAnimations);
      return;
    }
    canvasRef.handler.animationHandler.previewAndUpdate(
      editor.activeElement,
      currentAnimations
    );
  };

  onSpeedChange = (speed) => {
    this.setState({
      ...this.state,
      trans_duration: speed.value,
    });

    const { layers, editor, canvasRef } = this.props;
    const currentAnimations = layers[editor.activeElement.id].payload.animation;
    const selectedAnimation = currentAnimations[this.state.index];

    if (this.state.index === 0) {
      selectedAnimation["end_time"] =
        selectedAnimation["start_time"] + selectedAnimation["trans_duration"];

      let stillAnimation = currentAnimations[1];
      selectedAnimation["trans_duration"] = speed.value;
      stillAnimation["start_time"] = selectedAnimation["end_time"];
      stillAnimation["trans_duration"] =
        stillAnimation["end_time"] - stillAnimation["start_time"];
    } else {
      let stillAnimation = currentAnimations[0];
      selectedAnimation["trans_duration"] = speed.value;
      selectedAnimation["start_time"] =
        selectedAnimation["end_time"] - selectedAnimation["trans_duration"];

      stillAnimation["end_time"] = selectedAnimation["start_time"];
      stillAnimation["trans_duration"] =
        stillAnimation["end_time"] - stillAnimation["start_time"];
    }

    // entryAnimation["trans_duration"] = speed.value;
    // entryAnimation["end_time"] =
    // entryAnimation["start_time"] + entryAnimation["trans_duration"];
    // // On loop just change the speed.
    // if (entryAnimation.loop === true) {
    //   const updatedAnimation = [entryAnimation];
    //   canvasRef.handler.animationHandler.previewAndUpdate(
    //     editor.activeElement.id,
    //     updatedAnimation
    //   );
    //   return;
    // }

    canvasRef.handler.animationHandler.previewAndUpdate(
      editor.activeElement,
      currentAnimations,
      this.state.index
    );
  };

  onLoopSwitchChange = (checked, event, id) => {
    this.setState({
      ...this.state,
      loop: checked,
    });
    this.onChangeControl("loop", checked);
  };

  onEasingChange = (selected) => {
    this.setState({
      ...this.state,
      easing: selected.value,
    });
    this.onChangeControl("easing", selected.value);
  };

  onChangeDuration = (delay) => {
    this.setState({
      ...this.state,
      delay: delay.value,
    });
    this.onChangeControl("delay", delay[0] * 1000);
  };

  render() {
    const {
      loop,
      trans_duration,
      animationType,
      easing,
      animationStore,
      collapse,
    } = this.state;
    const selectedAnimations = animationStore.filter(function (adjustment) {
      return animationType.includes(adjustment.id);
    });

    const variants =
      selectedAnimations.length > 0 && selectedAnimations[0].variants.length > 1
        ? selectedAnimations[0].variants.map((dir, index) => {
            return (
              <StyledSpeedActionButton
                key={index}
                className={animationType === dir.type ? "active" : ""}
                onClick={() => this.onOptionChange(dir)}
              >
                {dir.title}
              </StyledSpeedActionButton>
            );
          })
        : null;

    const presetOptions = predefinedSpeeds.map((newSpeed, index) => {
      return (
        <StyledSpeedActionButton
          key={index}
          className={trans_duration === newSpeed.value ? "active" : ""}
          onClick={() => this.onSpeedChange(newSpeed)}
        >
          {newSpeed.title}
        </StyledSpeedActionButton>
      );
    });

    // if (selectedAnimations.characterLevel) {
    //   return null;
    // }
    const actionsView = collapse ? (
      <TldrCollapsableAction
        icon="play"
        action="play"
        callback={this.actionCallback}
        title="Preview Effect"
      ></TldrCollapsableAction>
    ) : (
      <>
        <TldrCollapsableAction
          icon="play"
          action="play"
          callback={this.actionCallback}
          title="Preview Effect"
        ></TldrCollapsableAction>
        <TldrCollapsableAction
          icon="edit"
          action="edit"
          callback={this.actionCallback}
          title="Edit"
        ></TldrCollapsableAction>
        <TldrCollapsableAction
          icon="trash"
          action="delete"
          callback={this.actionCallback}
          title="Delete"
        ></TldrCollapsableAction>
      </>
    );
    return (
      <TldrCollpasibleSection
        title={this.props.title}
        subtitle={this.props.subtitle}
        collapse={this.state.collapse}
        toggleButton={actionsView}
        onToggleCollapse={this.handleToggleChange}
      >
        <div className="ml-3">
          {variants && (
            <StyledAdvEditorToolbarRow>
              <StyledAdvEditorToolbarFormatGroup className="mb-3">
                <div className="title">Direction</div>
                <StyledAnimationButtonGroup>
                  {variants}
                </StyledAnimationButtonGroup>
              </StyledAdvEditorToolbarFormatGroup>
            </StyledAdvEditorToolbarRow>
          )}

          <StyledAdvEditorToolbarRow>
            <StyledAdvEditorToolbarFormatGroup className="mb-3">
              <div className="title">Animation speed</div>
              <StyledAnimationButtonGroup>
                {presetOptions}
              </StyledAnimationButtonGroup>
            </StyledAdvEditorToolbarFormatGroup>
          </StyledAdvEditorToolbarRow>

          <StyledAdvEditorToolbarRow className="mb-3">
            <StyledAdvEditorToolbarFormatGroup>
              <div className="title">Easing</div>
              <TldrAnimationOptions
                options={easingOptions}
                value={easing}
                onChange={this.onEasingChange}
              />
            </StyledAdvEditorToolbarFormatGroup>

            {/* <StyledAdvEditorToolbarFormatGroup className="mr-2">
            <div className="title">Loop</div>
            <div className="actions">
              <Switch
                onChange={this.onLoopSwitchChange}
                checked={loop}
                offColor={white}
                onColor={accent}
                offHandleColor={accentGrey}
                checkedIcon={false}
                uncheckedIcon={false}
                height={15}
                width={40}
              />
            </div>
          </StyledAdvEditorToolbarFormatGroup> */}
          </StyledAdvEditorToolbarRow>
        </div>
      </TldrCollpasibleSection>
    );
  }
}

StudioLayerAnimationControls.propTypes = {
  editor: PropTypes.object.isRequired,
  layers: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  editor: state.editor,
  layers: state.layerstore.layers,
  pages: state.pagestore.pages,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StudioLayerAnimationControls);
