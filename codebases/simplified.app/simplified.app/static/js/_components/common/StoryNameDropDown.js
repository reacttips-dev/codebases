import { connect } from "react-redux";
import React, { useState } from "react";
import { Dropdown, Modal } from "react-bootstrap";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import { dataURItoBlob } from "../../_utils/common";
import { PROJECTS } from "../../_utils/routes";
import { captureAndUpdateCover } from "../../_actions/storiesActions";
import { showToast } from "../../_actions/toastActions";
import { StyledModal } from "../styled/settings/stylesSettings";
import { StyledNavbarButton } from "../styled/styles";
import { withRouter } from "react-router-dom";
import { EditProjectName, SaveAsTemplate } from "../common/statelessView";

const StoryNameDropDown = (props) => {
  const signal = axios.CancelToken.source();
  const [openSaveAsTemplateDialog, setOpenSaveAsTemplateDialog] =
    useState(false);
  const [openRenameProjectDialog, setOpenRenameProjectDialog] = useState(false);

  const OptionsDropdown = ({ props }) => {
    return (
      <Dropdown>
        <Dropdown.Toggle
          variant="secondary"
          id="download-artboards"
          as={StyledNavbarButton}
        >
          <FontAwesomeIcon icon={faCog}></FontAwesomeIcon>
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={saveAsTemplate}>
            Save as template
          </Dropdown.Item>
          <Dropdown.Item onClick={openRenameDialog}>
            Rename project
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  };

  const saveAsTemplate = () => {
    setOpenSaveAsTemplateDialog(true);
  };

  const openRenameDialog = () => {
    setOpenRenameProjectDialog(true);
  };

  const setStoryPageCover = (
    props,
    storyId,
    pageId,
    saveAsTemplate,
    templateName
  ) => {
    const { canvasRef } = props.props;
    let imageQuality = 0.2;
    let fileType = "jpeg";

    let fileName = `${pageId}_${Date.now()}.${fileType}`;

    const dataURL = canvasRef.handler.getArtBoardAsDataURL({
      format: fileType,
      quality: imageQuality,
      name: fileName,
    });

    if (!dataURL) {
      props.props.showToast({
        message: "Something went wrong. Please contact support center.",
        heading: "Failed to generate cover image",
        type: "error",
      });
      props.props.backToDashboard();
      props.props.redirect(PROJECTS, props);
      return;
    }

    let file = new File([dataURItoBlob(dataURL)], fileName, {
      type: "image/jpeg",
    });

    props.props.captureAndUpdateCover(
      storyId,
      file,
      saveAsTemplate,
      signal,
      {
        ...props.props,
      },
      templateName
    );
    setOpenSaveAsTemplateDialog(false);
  };

  return (
    <>
      <OptionsDropdown props={props}></OptionsDropdown>
      <StyledModal
        show={openSaveAsTemplateDialog}
        onHide={(e) => setOpenSaveAsTemplateDialog(false)}
        backdrop="static"
        size="sm"
        centered
      >
        <SaveAsTemplate
          props={props}
          handleCloseAddModal={(e) => setOpenSaveAsTemplateDialog(false)}
          signal={signal}
          onSubmit={setStoryPageCover}
        ></SaveAsTemplate>
      </StyledModal>
      <Modal
        show={openRenameProjectDialog}
        onHide={(e) => setOpenRenameProjectDialog(false)}
        backdrop="static"
        size="sm"
        centered
      >
        <EditProjectName
          props={props.props}
          handleCloseAddModal={(e) => setOpenRenameProjectDialog(false)}
          signal={signal}
        ></EditProjectName>
      </Modal>
    </>
  );
};

StoryNameDropDown.propTypes = {};

const mapDispatchToProps = (dispatch) => ({
  captureAndUpdateCover: (
    storyId,
    file,
    saveAsTemplate,
    signal,
    props,
    templateName
  ) =>
    dispatch(
      captureAndUpdateCover(
        storyId,
        file,
        saveAsTemplate,
        signal,
        props,
        templateName
      )
    ),
  showToast: (payload) => dispatch(showToast(payload)),
});

export default connect(null, mapDispatchToProps)(withRouter(StoryNameDropDown));
