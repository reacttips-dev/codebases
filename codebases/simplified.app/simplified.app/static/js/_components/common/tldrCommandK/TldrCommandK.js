import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Modal } from "react-bootstrap";
import Select from "react-select";
import { globalSearchStyle } from "../../styled/details/stylesSelect";
import {
  COMMAND_K_GROUPED_OPTIONS,
  IMAGES_SLIDER_PANEL,
  NEW_ARTBOARD,
  ADD_HEADING_TEXT,
  ADD_BODY_TEXT,
  ADD_BACKGROUND_IMAGE,
  ADD_SHAPE_CIRCLE,
  ADD_SHAPE_RECT,
  SHOW_KBD_SHORTCUTS,
  OPEN_CONTACT_US,
} from "../../details/constants";
import {
  closeSlider,
  openSlider,
  setOrUpdateStyles,
} from "../../../_actions/sidebarSliderActions";
import { hideCommandKSearch } from "../../../_actions/commandKActions";
import { wsAddLayer, wsAddPage } from "../../../_actions/webSocketAction";
import CustomOption from "./components/CustomOption";
import CustomControl from "./components/CustomControl";
import CustomMenuList from "./components/CustomMenuList";
import CustomGroup from "./components/CustomGroup";
import {
  defaultBodyTextItem,
  defaultHeaderTextItem,
  defaultCircleShapeItem,
  defaultRectShapeItem,
} from "../../canvas/constants/defaults";
import { REPLACE_BKG_IMAGE } from "../../../_actions/types";

import axios from "axios";
import { showToast } from "../../../_actions/toastActions";
import { EXPORT_IMAGE_ERROR_PAYLOAD } from "../../../_utils/constants";

class TldrCommandK extends Component {
  signal = axios.CancelToken.source();

  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { isSearchShowing } = this.props;
    const showCommandKContent = isSearchShowing === "open" ? true : false;

    return (
      <>
        {showCommandKContent && (
          <Modal
            show={showCommandKContent}
            backdrop="static"
            animation={false}
            className="mt-5"
          >
            <Select
              isClearable={true}
              isSearchable={true}
              components={{
                Option: CustomOption,
                Control: CustomControl,
                MenuList: CustomMenuList,
                Group: CustomGroup,
              }}
              styles={globalSearchStyle}
              autoFocus={true}
              menuIsOpen={true}
              options={COMMAND_K_GROUPED_OPTIONS}
              onChange={(selected) => this.onActionSelected(selected)}
              onBlur={() => this.props.hideCommandKSearch()}
              onKeyDown={(event) => this.closeCommandK(event)}
              placeholder="What would you like to do?"
            />
          </Modal>
        )}
      </>
    );
  }

  closeCommandK = (e) => {
    if (e.keyCode === 27) {
      this.props.hideCommandKSearch();
    }
  };

  onActionSelected = (selectedAction) => {
    if (!selectedAction) return;

    this.props.hideCommandKSearch();
    switch (selectedAction.type) {
      case "open":
        this.openPanel(selectedAction.value);
        break;
      case "add":
        this.addSelectedElement(selectedAction.value);
        break;
      case "export":
        this.exportCurrentArtboard(selectedAction.value);
        break;
      default:
        this.openHelp(selectedAction.value);
        break;
    }
  };

  openPanel = (panelType) => {
    const isActivePanel = (panelType) => {
      const { sliderPanelType, isSliderOpen } = this.props.sidebarSlider;
      const isActive =
        sliderPanelType === panelType && isSliderOpen === "open"
          ? " active"
          : "";
      return isActive;
    };

    if (!isActivePanel(panelType)) {
      this.props.openSlider(panelType);
    } else {
      this.props.closeSlider();
    }
  };

  addSelectedElement = (element) => {
    const { activePage } = this.props;

    switch (element) {
      case NEW_ARTBOARD:
        this.props.wsAddPage();
        break;
      case ADD_HEADING_TEXT:
        this.props.wsAddLayer(activePage.id, defaultHeaderTextItem);
        break;
      case ADD_BODY_TEXT:
        this.props.wsAddLayer(activePage.id, defaultBodyTextItem);
        break;
      case ADD_BACKGROUND_IMAGE:
        this.props.setOrUpdateStyles(REPLACE_BKG_IMAGE, IMAGES_SLIDER_PANEL);
        break;
      case ADD_SHAPE_CIRCLE:
        this.props.wsAddLayer(activePage.id, defaultCircleShapeItem);
        break;
      case ADD_SHAPE_RECT:
        this.props.wsAddLayer(activePage.id, defaultRectShapeItem);
        break;
      default:
        return;
    }
  };

  exportCurrentArtboard = (type) => {
    const { story, canvasRef } = this.props;

    const dataURL = canvasRef.handler.getArtBoardAsDataURL({
      format: type,
      quality: 1,
      multiplier: 1,
      name: `${story.payload.title}`,
    });

    if (!dataURL) {
      this.props.showToast(EXPORT_IMAGE_ERROR_PAYLOAD);
      return;
    }

    canvasRef.handler.saveDataURLToFile(dataURL, {
      format: type,
      name: `${story.payload.title}`,
    });
  };

  openHelp = (option) => {
    switch (option) {
      case SHOW_KBD_SHORTCUTS:
        break;
      case OPEN_CONTACT_US:
        this.openIntercom();
        break;
      default:
        return;
    }
  };

  openIntercom = () => {
    window.Intercom("show");
  };
}

TldrCommandK.propTypes = {
  isSearchShowing: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  isSearchShowing: state.commandK.isSearchShowing,
  sidebarSlider: state.sidebarSlider,
  activePage: state.editor.activePage,
  story: state.story,
});

const mapDispatchToProps = (dispatch) => ({
  hideCommandKSearch: () => dispatch(hideCommandKSearch()),
  openSlider: (panel) => dispatch(openSlider(panel)),
  closeSlider: () => dispatch(closeSlider()),
  wsAddLayer: (pageId, message) => dispatch(wsAddLayer(pageId, message)),
  wsAddPage: () => dispatch(wsAddPage()),
  setOrUpdateStyles: (action, destination) =>
    dispatch(setOrUpdateStyles(action, destination)),
  showToast: (payload) => dispatch(showToast(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TldrCommandK);
