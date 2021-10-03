import { defaultEnterPayload, STILL_EFFECT } from "./defaultLayerAnimations";

export const depthOffset = function (layersInCanvas, layer, canvasSize) {
  // return canvasSize * layersInCanvas.indexOf(layer);
  return 0;
};

export const shouldWeAnimateThisLayer = function (
  layer,
  canvasTopLeft,
  canvasWidth,
  canvasHeight
) {
  return true;
  // let { left, top, width, height } = layer.getBoundingRect(true); //absolute
  // let boundingBoxLeftNormalised = getNormalizedValue(left, canvasTopLeft[1]);
  // let boundingBoxTopNormalised = getNormalizedValue(top, canvasTopLeft[0]);

  // if (boundingBoxTopNormalised < 0 || boundingBoxLeftNormalised < 0) {
  //   return false;
  // }
  // if (
  //   top + height > canvasTopLeft[0] + canvasHeight &&
  //   left + width > canvasTopLeft[1] + canvasWidth
  // ) {
  //   return false;
  // }
  // return true;
};

export const getNormalizedValue = function (relative_value, offset) {
  return relative_value - offset;
};

export const prepareEnterForSequence = function (first, direction) {
  let animationType = {
    Left: "fly_in_left",
    Right: "fly_in_right",
    Top: "fly_in_top",
    Bottom: "fly_in_bottom",
  };
  first = {
    ...first,
    title: direction,
    type: animationType[direction],
  };
  return first;
};

export const getQuadrant = function (center, canvasWidth, canvasHeight) {
  if (center[0] <= canvasWidth / 2 && center[1] <= canvasHeight / 2) {
    return "TopLeft";
  } else if (center[0] >= canvasWidth / 2 && center[1] <= canvasHeight / 2) {
    return "TopRight";
  } else if (center[0] <= canvasWidth / 2 && center[1] >= canvasHeight / 2) {
    return "BottomLeft";
  } else {
    return "BottomRight";
  }
};

export const locomotionHelper = function (
  layer,
  canvasWidth,
  canvasHeight,
  canvasTopLeft
) {
  let layerLeftNormalised = getNormalizedValue(layer.left, canvasTopLeft[1]);
  let layerTopNormalised = getNormalizedValue(layer.top, canvasTopLeft[0]);

  let center = [
    layerLeftNormalised + (layer.width * layer.scaleX) / 2,
    layerTopNormalised + (layer.height * layer.scaleY) / 2,
  ];

  let first = defaultEnterPayload;
  let second = STILL_EFFECT;

  switch (getQuadrant(center, canvasWidth, canvasHeight)) {
    case "TopLeft":
      if (layerTopNormalised <= layerLeftNormalised) {
        first = prepareEnterForSequence(first, "Top");
      } else {
        first = prepareEnterForSequence(first, "Left");
      }
      break;
    case "TopRight":
      if (
        canvasWidth - (layerLeftNormalised + layer.width * layer.scaleX) <
        layerTopNormalised
      ) {
        first = prepareEnterForSequence(first, "Right");
      } else {
        first = prepareEnterForSequence(first, "Top");
      }
      break;
    case "BottomLeft":
      if (
        canvasHeight - (layerTopNormalised + layer.height * layer.scaleY) <
        layerLeftNormalised
      ) {
        first = prepareEnterForSequence(first, "Bottom");
      } else {
        first = prepareEnterForSequence(first, "Left");
      }
      break;
    case "BottomRight":
      if (
        canvasWidth - (layerLeftNormalised + layer.width * layer.scaleX) <
        canvasHeight - (layerTopNormalised + layer.height * layer.scaleY)
      ) {
        first = prepareEnterForSequence(first, "Right");
      } else {
        first = prepareEnterForSequence(first, "Bottom");
      }
      break;
    default:
      break;
  }
  return { sequence: [first, second] };
};

export const prepareAnimationObject = function (
  adjustment,
  localStartTime,
  artboardDuration,
  useFallbackAnimation = false
) {
  let first = null;
  let second = null;

  if (useFallbackAnimation) {
    first = {
      title: "Fade in",
      type: "fade_in",
      ...defaultEnterPayload,
      easing: "easeOutQuart",
    };
    second = {
      type: "still",
      motion: "still",
      ...defaultEnterPayload,
      trans_duration: 5000,
      start_time: 1000,
      end_time: 6000,
    };
  } else {
    first = adjustment.sequence[0];
    second = adjustment.sequence[1];
  }

  // let newSequence = updateAnimationTimings(first, second, artboardDuration, localStartTime);
  let enterTransDuration = first["trans_duration"];
  first = { ...first, start_time: localStartTime };
  first = { ...first, end_time: localStartTime + enterTransDuration };

  second = {
    ...second,
    start_time: first["start_time"] + first["trans_duration"],
  };
  second = { ...second, end_time: artboardDuration };
  second = {
    ...second,
    trans_duration: second["end_time"] - second["start_time"],
  };
  return [first, second];
};

export const zoomPreset = function (
  adjustment,
  layersInCanvas,
  local_start_time,
  local_delay,
  artboardDuration,
  canvasTopLeft,
  canvasWidth,
  canvasHeight
) {
  if (adjustment.id === "zoom") {
    layersInCanvas.forEach((layer) => {
      let animation = null;
      if (
        shouldWeAnimateThisLayer(
          layer,
          canvasTopLeft,
          canvasWidth,
          canvasHeight
        )
      ) {
        if (layer.type === "gif") {
          animation = prepareAnimationObject(
            adjustment,
            local_start_time,
            artboardDuration,
            true
          );
        } else {
          animation = prepareAnimationObject(
            adjustment,
            local_start_time,
            artboardDuration
          );
        }
        layer.set("animation", animation);
        local_start_time += local_delay;
      } else {
        layer.set("animation", animation);
      }
    });
  }
};

export const fadeNeonPreset = function (
  adjustment,
  layersInCanvas,
  local_start_time,
  local_delay,
  artboardDuration,
  canvasTopLeft,
  canvasWidth,
  canvasHeight
) {
  layersInCanvas.forEach((layer) => {
    let animation = null;
    if (
      shouldWeAnimateThisLayer(layer, canvasTopLeft, canvasWidth, canvasHeight)
    ) {
      animation = prepareAnimationObject(
        adjustment,
        local_start_time,
        artboardDuration
      );
      if (adjustment.id === "neon") {
        animation[0] = { ...animation[0], easing: "easeOutSine" };
      }
      layer.set("animation", animation);
      local_start_time += local_delay;
    } else {
      layer.set("animation", animation);
    }
  });
};

export const popPreset = function (
  adjustment,
  layersInCanvas,
  local_start_time,
  local_delay,
  artboardDuration,
  canvasTopLeft,
  canvasWidth,
  canvasHeight
) {
  layersInCanvas.forEach((layer) => {
    let animation = null;
    if (
      shouldWeAnimateThisLayer(layer, canvasTopLeft, canvasWidth, canvasHeight)
    ) {
      if (layer.type === "gif") {
        animation = prepareAnimationObject(
          adjustment,
          local_start_time,
          artboardDuration,
          true
        );
      } else {
        animation = prepareAnimationObject(
          adjustment,
          local_start_time,
          artboardDuration
        );
        animation[0] = { ...animation[0], easing: "spring(1, 100, 13, 0)" };
      }
      layer.set("animation", animation);
      local_start_time += local_delay;
    } else {
      layer.set("animation", animation);
    }
  });
};

export const baselinePreset = function (
  adjustment,
  layersInCanvas,
  local_start_time,
  local_delay,
  artboardDuration,
  canvasTopLeft,
  canvasWidth,
  canvasHeight
) {
  layersInCanvas.forEach((layer) => {
    let animation = null;
    if (
      shouldWeAnimateThisLayer(layer, canvasTopLeft, canvasWidth, canvasHeight)
    ) {
      if (
        layer.type === "gif" ||
        layer.type === "group" ||
        layer.type === "video" ||
        layer.type === "shape"
      ) {
        animation = prepareAnimationObject(
          adjustment,
          local_start_time,
          artboardDuration,
          true
        );
      } else {
        animation = prepareAnimationObject(
          adjustment,
          local_start_time,
          artboardDuration
        );
      }
      layer.set("animation", animation);
      local_start_time += local_delay;
    } else {
      layer.set("animation", animation);
    }
  });
};

export const dashPreset = function (
  adjustment,
  layersInCanvas,
  local_start_time,
  local_delay,
  artboardDuration,
  canvasTopLeft,
  canvasWidth,
  canvasHeight
) {
  layersInCanvas.forEach((layer) => {
    let animation = null;
    if (
      shouldWeAnimateThisLayer(layer, canvasTopLeft, canvasWidth, canvasHeight)
    ) {
      animation = prepareAnimationObject(
        adjustment,
        local_start_time,
        artboardDuration
      );
      animation[0] = { ...animation[0], easing: "spring(1, 100, 13, 0)" };
      layer.set("animation", animation);
      local_start_time += local_delay;
    } else {
      layer.set("animation", animation);
    }
  });
};

export const locomotionPreset = function (
  adjustment,
  layersInCanvas,
  local_start_time,
  local_delay,
  artboardDuration,
  canvasTopLeft,
  canvasWidth,
  canvasHeight
) {
  layersInCanvas.forEach((layer) => {
    let animation = null;
    if (
      shouldWeAnimateThisLayer(layer, canvasTopLeft, canvasWidth, canvasHeight)
    ) {
      let modifiedAdjustment = locomotionHelper(
        layer,
        canvasWidth,
        canvasHeight,
        canvasTopLeft
      );
      animation = prepareAnimationObject(
        modifiedAdjustment,
        local_start_time,
        artboardDuration
      );
      layer.set("animation", animation);
      local_start_time += local_delay;
    } else {
      layer.set("animation", animation);
    }
  });
};

export const panRisePreset = function (
  adjustment,
  layersInCanvas,
  local_start_time,
  local_delay,
  artboardDuration,
  canvasTopLeft,
  canvasWidth,
  canvasHeight
) {
  layersInCanvas.forEach((layer) => {
    let animation = null;
    if (
      shouldWeAnimateThisLayer(layer, canvasTopLeft, canvasWidth, canvasHeight)
    ) {
      animation = prepareAnimationObject(
        adjustment,
        local_start_time,
        artboardDuration
      );
      layer.set("animation", animation);
      local_start_time += local_delay;
    } else {
      layer.set("animation", animation);
    }
  });
};

export const breathePreset = function (
  adjustment,
  layersInCanvas,
  local_start_time,
  local_delay,
  artboardDuration,
  canvasTopLeft,
  canvasWidth,
  canvasHeight
) {
  layersInCanvas.forEach((layer) => {
    let animation = null;
    if (
      shouldWeAnimateThisLayer(layer, canvasTopLeft, canvasWidth, canvasHeight)
    ) {
      if (layer.type === "gif") {
        animation = prepareAnimationObject(
          adjustment,
          local_start_time,
          artboardDuration,
          true
        );
      } else {
        animation = prepareAnimationObject(
          adjustment,
          local_start_time,
          artboardDuration
        );
      }
      layer.set("animation", animation);
      local_start_time += local_delay;
    } else {
      layer.set("animation", animation);
    }
  });
};

export const textBlockPreset = function (
  adjustment,
  layersInCanvas,
  local_start_time,
  local_delay,
  artboardDuration
) {
  layersInCanvas.forEach((layer) => {
    if (layer.type === "textbox") {
      let animation = prepareAnimationObject(
        adjustment,
        local_start_time,
        artboardDuration
      );
      layer.set("animation", animation);
      local_start_time += local_delay;
    } else {
      layer.set("animation", null);
    }
  });
};

export const textPopPreset = function (
  adjustment,
  layersInCanvas,
  local_start_time,
  local_delay,
  artboardDuration
) {
  layersInCanvas.forEach((layer) => {
    let animation = null;
    if (layer.type === "textbox") {
      animation = prepareAnimationObject(
        adjustment,
        local_start_time,
        artboardDuration
      );
      animation[0] = { ...animation[0], easing: "spring(1, 100, 13, 0)" };
      layer.set("animation", animation);
      local_start_time += local_delay;
    } else {
      layer.set("animation", animation);
    }
  });
};

export const textBaselinePreset = function (
  adjustment,
  layersInCanvas,
  local_start_time,
  local_delay,
  artboardDuration
) {
  layersInCanvas.forEach((layer) => {
    let animation = null;
    if (layer.type === "textbox") {
      animation = prepareAnimationObject(
        adjustment,
        local_start_time,
        artboardDuration
      );
      layer.set("animation", animation);
      local_start_time += local_delay;
    } else {
      layer.set("animation", animation);
    }
  });
};
