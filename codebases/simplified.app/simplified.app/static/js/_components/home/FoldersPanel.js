import React, { Component } from "react";
import {
  fetchFolders,
  renameFolder,
  addFolder,
  removeFolder,
} from "../../_actions/folderActions";
import axios from "axios";
import { connect } from "react-redux";
import { Folder, TldrNewFolderDialog } from "../styled/home/statelessView";
import { FoldersPanelComponent } from "../styled/home/stylesHome";
import { withRouter } from "react-router-dom";
import { FOLDERS_ENDPOINT } from "../../_actions/endpoints";
import { showToast } from "../../_actions/toastActions";
import { TldrConfirmationModal } from "../common/statelessView";

class FoldersPanel extends Component {
  state = {
    showRenameFolderPopup: false,
    inProgress: "false",
    targetFolderObj: undefined,
    showDeletePopup: false,
    itemToDelete: null,
  };

  signal = axios.CancelToken.source();

  handleFolderClick = (folderData) => {
    this.props.onFolderClick(folderData);
  };

  handleRenameFolder = (name) => {
    const folder = this.state.targetFolderObj;
    const payload = {
      name: name,
      add_content_ids: folder.add_content_ids ? folder.add_content_ids : [],
    };

    axios
      .put(`${FOLDERS_ENDPOINT}/${folder.id}`, payload, {
        cancelToken: this.signal.token,
      })
      .then((res) => {
        this.props.renameFolder({
          id: folder.id,
          name: res.data.name,
        });
        this.setState({
          targetFolderObj: undefined,
          showRenameFolderPopup: false,
          inProgress: "false",
        });
        this.props.showToast({
          message: `Folder name updated successfully.`,
          heading: "Success",
          type: "success",
        });
      })
      .catch((error) => {
        this.setState({
          targetFolderObj: undefined,
          showRenameFolderPopup: false,
          inProgress: "false",
        });
        this.props.showToast({
          message:
            "Something went wrong while renaming the folder, please try again later.",
          heading: "Error",
          type: "error",
        });
      });
  };

  showRenameFolderModel = (folderData) => {
    this.setState({ targetFolderObj: folderData, showRenameFolderPopup: true });
  };

  duplicateFolderHandler = (folderData) => {
    const payload = {
      name: "Copy of " + folderData.name,
      add_content_ids: folderData.contents
        ? folderData.contents.map((item) => item.id)
        : [],
    };

    axios
      .post(FOLDERS_ENDPOINT, payload, {
        cancelToken: this.signal.token,
      })
      .then((res) => {
        this.props.addFolder(res.data);
        this.props.showToast({
          message: "Copy of " + folderData.name + " created successfully.",
          heading: "Success",
          type: "success",
        });
      })
      .catch((error) => {
        this.props.showToast({
          message:
            "Something went wrong while duplicating a folder, please try again later.",
          heading: "Error",
          type: "error",
        });
      });
  };

  deleteFolder = (item) => {
    this.setState({
      showDeletePopup: !this.state.showDeletePopup,
      itemToDelete: item,
    });
  };

  deleteFolderHandler = (folderData) => {
    axios
      .delete(
        `${FOLDERS_ENDPOINT}/${folderData.id}`,
        {},
        {
          cancelToken: this.signal.token,
        }
      )
      .then((res) => {
        this.props.removeFolder({ id: folderData.id });
        this.props.showToast({
          message: "'" + folderData.name + "' deleted successfully.",
          heading: "Success",
          type: "success",
        });
        this.setState({
          showDeletePopup: false,
          inProgress: "false",
        });
      })
      .catch((error) => {
        this.props.showToast({
          message:
            "Something went wrong while deleting folder, please try again later.",
          heading: "Error",
          type: "error",
        });
        this.setState({
          showDeletePopup: false,
          inProgress: "false",
        });
      });
  };

  render() {
    let { folders, parentFolder } = this.props;

    const {
      showDeletePopup,
      showRenameFolderPopup,
      inProgress,
      targetFolderObj,
    } = this.state;

    if (parentFolder && parentFolder.folders) {
      folders = parentFolder.folders;
    }

    const folderElements = folders.map((item) => {
      item["total_contents"] =
        item.story_contents &&
        item.story_contents.length +
          item.asset_contents.length +
          item.template_contents.length +
          item.component_contents.length;

      if (
        !item.parent ||
        !item.parent.id ||
        (parentFolder && item.parent === parentFolder.id)
      ) {
        // list only relevant folders
        return (
          <Folder
            key={item.id}
            folder={item}
            onClick={() => this.handleFolderClick(item)}
            onRenameHandler={() => this.showRenameFolderModel(item)}
            onDuplicateHandler={() => this.duplicateFolderHandler(item)}
            onDeleteHandler={() => this.deleteFolder(item)}
          />
        );
      }
      return <></>;
    });

    return folders.length ? (
      <>
        <FoldersPanelComponent>{folderElements}</FoldersPanelComponent>

        <TldrNewFolderDialog
          inProgress={inProgress}
          show={showRenameFolderPopup}
          value={targetFolderObj ? targetFolderObj.name : ""}
          rename
          onHide={(e) => {
            this.setState({ showRenameFolderPopup: false });
          }}
          onYes={(name) => {
            this.setState(
              {
                inProgress: "true",
              },
              () => this.handleRenameFolder(name)
            );
          }}
        />

        {showDeletePopup && (
          <div onClick={(e) => e.stopPropagation()}>
            <TldrConfirmationModal
              modalFor="folder"
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
                  this.deleteFolderHandler(this.state.itemToDelete)
                );
              }}
            />
          </div>
        )}
      </>
    ) : null;
  }
}

const mapStateToProps = (state) => ({
  folders: state.folders.folders,
});

const mapDispatchToProps = (dispatch) => ({
  fetchFolders: (token, props) => dispatch(fetchFolders(token, props)),
  showToast: (payload) => dispatch(showToast(payload)),
  renameFolder: (payload) => dispatch(renameFolder(payload)),
  addFolder: (payload) => dispatch(addFolder(payload)),
  removeFolder: (payload) => dispatch(removeFolder(payload)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(FoldersPanel));
