import React from "react";
import { components } from "react-select";
import { StyledCommandKPanelBox } from "../../../styled/details/stylesDetails";
import { ReactComponent as TextIcon } from "../../../../assets/icons/sidebar-text.svg";
import { ReactComponent as VideoIcon } from "../../../../assets/icons/sidebar-video.svg";
import { ReactComponent as ComponentsIcon } from "../../../../assets/icons/sidebar-components.svg";
import { ReactComponent as IconsIcon } from "../../../../assets/icons/sidebar-icons.svg";
import { ReactComponent as ImagesIcon } from "../../../../assets/icons/sidebar-images.svg";
import {
  ELEMENTS_SLIDER_PANEL,
  ICONS_SLIDER_PANEL,
  IMAGES_SLIDER_PANEL,
  TEXT_SLIDER_PANEL,
  VIDEO_SLIDER_PANEL,
} from "../../../details/constants";

const kbdPosition = {
  position: "absolute",
  top: "1px",
  right: "3px",
};

const CustomGroup = (props) => {
  const panelChildren =
    props.label === "Open Library" &&
    props.children.map((panel, index) => {
      var selected = panel.props.data;
      return (
        <StyledCommandKPanelBox
          key={index}
          className={panel.props.isFocused ? "active" : ""}
          onClick={() => panel.props.selectOption(selected)}
        >
          {panel.props.data.value === TEXT_SLIDER_PANEL ? (
            <TextIcon />
          ) : panel.props.data.value === VIDEO_SLIDER_PANEL ? (
            <VideoIcon />
          ) : panel.props.data.value === ICONS_SLIDER_PANEL ? (
            <IconsIcon />
          ) : panel.props.data.value === ELEMENTS_SLIDER_PANEL ? (
            <ComponentsIcon />
          ) : panel.props.data.value === IMAGES_SLIDER_PANEL ? (
            <ImagesIcon />
          ) : null}
          {panel.props.data.label}
          <div style={kbdPosition}>
            <kbd>{panel.props.data.hotkey[0]}</kbd>
          </div>
        </StyledCommandKPanelBox>
      );
    });

  return (
    <components.Group {...props}>
      <div className={props.label === "Open Library" ? "custom-row" : ""}>
        {props.label === "Open Library" ? (
          <>{panelChildren}</>
        ) : (
          <>{props.children}</>
        )}
      </div>
    </components.Group>
  );
};

export default CustomGroup;
