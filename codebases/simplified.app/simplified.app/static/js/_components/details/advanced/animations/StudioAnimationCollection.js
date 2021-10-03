import React, { Component } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import {
  StyledAnimation,
  StyledFilterCollection,
} from "../../../styled/details/stylesDetails";
import TldrHoverVideoPlayer from "../../../common/TldrHoverVideoPlayer";
import {
  layerInTransitions,
  slideTransitions,
} from "./defaultSlideTransitions";
import { presets } from "./defaultLayerAnimations";

export class StudioAnimationCollection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: "none",
      source: "",
      objectType: "",
    };
  }

  static getDerivedStateFromProps(nextProps, state) {
    if (
      nextProps.current !== state.current ||
      nextProps.source !== state.current ||
      nextProps.objectType !== state.objectType
    ) {
      return {
        ...state,
        current: nextProps.current,
        source: nextProps.source,
        objectType: nextProps.objectType,
      };
    }
    return null;
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!_.isEqual(this.state, nextState)) {
      return true;
    }
    return false;
  }

  render() {
    const { current, source, objectType } = this.props;
    const availableLayerTransitions =
      objectType === "text"
        ? layerInTransitions
        : objectType === "shape"
        ? layerInTransitions
            .filter((item) => !item.characterLevel)
            .filter((item) => item.id !== "reveal" && item.id !== "wipe")
        : objectType === "giphy"
        ? layerInTransitions
            .filter((item) => !item.characterLevel)
            .filter(
              (item) =>
                item.id !== "wipe" &&
                item.id !== "stomp" &&
                item.id !== "zoom" &&
                item.id !== "breathe" &&
                item.id !== "reveal"
            )
        : objectType === "group"
        ? layerInTransitions
            .filter((item) => !item.characterLevel)
            .filter((item) => item.id !== "wipe" && item.id !== "reveal")
        : objectType === "video"
        ? layerInTransitions
            .filter((item) => !item.characterLevel)
            .filter((item) => item.id !== "reveal")
        : layerInTransitions.filter((item) => !item.characterLevel);
    const allAvailableAnimations =
      source === "layer"
        ? availableLayerTransitions
        : source === "transitions"
        ? slideTransitions
        : presets;
    var childElements = allAvailableAnimations.map((adjustment, index) => {
      return (
        <div key={adjustment.id}>
          <StyledAnimation
            className={current.includes(adjustment.id) ? "active" : ""}
            animation={adjustment}
            onClick={() => {
              this.props.onClick(adjustment);
            }}
          >
            {adjustment.video ? (
              <TldrHoverVideoPlayer
                videoSrc={adjustment.video}
                pausedOverlay={
                  <div
                    style={{
                      backgroundImage: `url("https://assets.simplified.co/images/apple.jpg")`,
                      backgroundPosition: "center",
                      backgroundSize: "cover",
                      backgroundRepeat: "no-repeat",
                      width: "100%",
                      height: "100%",
                      textAlign: "center",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      objectFit: "cover",
                    }}
                  >
                    {adjustment.title}
                  </div>
                }
              />
            ) : (
              <>{adjustment.title}</>
            )}
          </StyledAnimation>
        </div>
      );
    });

    return <StyledFilterCollection>{childElements}</StyledFilterCollection>;
  }
}

StudioAnimationCollection.propTypes = {
  current: PropTypes.string.isRequired,
  source: PropTypes.string.isRequired,
};

export default StudioAnimationCollection;
