import React, { Component } from "react";
import { batch, connect } from "react-redux";
import PropTypes from "prop-types";

import { StyledTextEditorToolbarFormatGroup } from "../../../styled/details/stylesDetails";
import { TldrAction } from "../../../common/statelessView";
import { faCropAlt, faEraser } from "@fortawesome/free-solid-svg-icons";
import {
  analyticsTrackEvent,
  checkCeleryTaskStatus,
  onClickSetAsBackground,
} from "../../../../_utils/common";
import {
  setActiveLayer,
  setCrop,
} from "../../../../_actions/textToolbarActions";
import Axios from "axios";
import { REMOVE_IMAGE_BACKGROUND } from "../../../../_actions/endpoints";
import { closeToast, showToast } from "../../../../_actions/toastActions";
import { openAdvancedSettings } from "../../../../_actions/sidebarSliderActions";
import { ADVANCED_EDITOR_PANEL, ADVANCED_EDITOR_CLIP } from "../../constants";

class ImageEditorToolbar extends Component {
  state = {
    bgRemoverLoading: false,
  };

  render() {
    const { bgRemoverLoading } = this.state;
    const { canvasRef, editor, location } = this.props;
    const { activeElement } = editor;
    return (
      <>
        <div className="tldr-vl" />
        <StyledTextEditorToolbarFormatGroup>
          <TldrAction
            action={activeElement.mime}
            icon="expand-arrows-alt"
            title="Set as background"
            callback={() => onClickSetAsBackground(canvasRef)}
            disabled={activeElement.mime !== "image"}
          />

          <TldrAction
            action={activeElement.mime}
            icon={faEraser}
            title="Remove background"
            callback={this.removeBackground}
            inProgress={bgRemoverLoading}
            disabled={activeElement.mime !== "image" || bgRemoverLoading}
          />
          {location !== "sidebar" && (
            <TldrAction
              action={activeElement.mime}
              icon={faCropAlt}
              title="Crop & Clip"
              callback={this.showFiltersPanel}
              disabled={activeElement.cropEnable}
            />
          )}
        </StyledTextEditorToolbarFormatGroup>
      </>
    );
  }

  showFiltersPanel = (action) => {
    this.props.openAdvancedSettings(
      ADVANCED_EDITOR_PANEL,
      ADVANCED_EDITOR_CLIP
    );
  };

  crop = (action) => {
    const { canvasRef } = this.props;
    canvasRef.handler.cropHandler.start();

    let cropObject = canvasRef.handler.cropHandler.cropObject;
    batch(() => {
      this.props.setActiveLayer(
        cropObject.id,
        cropObject.type,
        cropObject,
        null,
        ADVANCED_EDITOR_CLIP
      );
      this.props.setCrop(true);
    });
  };

  removeBackground = () => {
    const {
      editor: { activeElement: { id: layerId = null } = null } = null,
      showToast: showToastMessage,
    } = this.props;

    this.setState(
      {
        bgRemoverLoading: true,
      },
      async () => {
        const waitForRemoveBackgroundToastKey = Math.random();
        showToastMessage({
          message: "Please wait, it may take 15-30 seconds.",
          heading: "Removing background",
          type: "info",
          autohide: true,
          key: waitForRemoveBackgroundToastKey,
        });
        const response = await Axios.post(REMOVE_IMAGE_BACKGROUND, {
          layer: layerId,
        });
        if (response.status !== 200) {
          showToastMessage({
            message: "Error while processing, please try again",
            heading: "Error",
            type: "error",
          });
        } else {
          const {
            taskId,
            response: { status: taskStatus = "", info: { status_code } = {} },
          } = await checkCeleryTaskStatus(response.data.task_id, () => {});
          this.setState({
            bgRemoverLoading: false,
          });
          if (taskStatus === "SUCCESS") {
            if (status_code === 200) {
              batch(() => {
                showToastMessage({
                  message:
                    "Successfully removed the background. It may take some time to reflect the changes.",
                  heading: "Success",
                  type: "success",
                });
                this.props.closeToast(waitForRemoveBackgroundToastKey);
                analyticsTrackEvent("removedBackground");
              });
            } else {
              batch(() => {
                showToastMessage({
                  message:
                    "Error while removing the background, contact support.",
                  heading: "Oops, sorry",
                  type: "error",
                });
                this.props.closeToast(waitForRemoveBackgroundToastKey);
              });
            }
          }
        }
      }
    );
  };
}

ImageEditorToolbar.propTypes = {
  editor: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  editor: state.editor,
  auth: state.auth,
});

const mapDispatchToProps = (dispatch) => ({
  setActiveLayer: (
    elementId,
    elementType,
    layerId,
    elementParentId,
    selectedTab
  ) =>
    dispatch(
      setActiveLayer(
        elementId,
        elementType,
        layerId,
        elementParentId,
        selectedTab
      )
    ),
  setCrop: (isEnable) => dispatch(setCrop(isEnable)),
  showToast: (payload) => dispatch(showToast(payload)),
  openAdvancedSettings: (panelName, selectedTab) =>
    dispatch(openAdvancedSettings(panelName, selectedTab)),
  closeToast: (toastKey) => dispatch(closeToast(toastKey)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ImageEditorToolbar);
