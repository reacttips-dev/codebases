import React, { Component } from "react";
import {
  StyledMarkerplaceHelpText,
  HomeTitleRow,
  HomeSelectionRow,
} from "./stylesHome";
import TldrSearch from "../../common/TldrSearch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { lightInactive } from "../variable";
import { connect } from "react-redux";
import {
  Checkbox,
  TldrNewFolderDialog,
  TldrMoveToFolderModel,
} from "./statelessView";
import { resetCardsSelection } from "../../../_actions/homepageCardActions";
import {
  faTrash,
  faFolderPlus,
  faArrowAltCircleUp,
} from "@fortawesome/free-solid-svg-icons";
import { TldrConfirmationModal } from "../../common/statelessView";
import axios from "axios";
import { deleteItemsInBulk } from "../../../_actions/sidebarSliderActions";
import { showToast } from "../../../_actions/toastActions";
import { Breadcrumb, OverlayTrigger, Tooltip } from "react-bootstrap";
import {
  fetchFolders,
  addFolderItems,
  createNewFolder,
  moveToFolder,
} from "../../../_actions/folderActions";
import { withRouter } from "react-router-dom";
import { batch } from "react-redux";

const ComponentWithTooltip = (props) => {
  return (
    <OverlayTrigger
      placement="bottom"
      overlay={<Tooltip>{props.description}</Tooltip>}
    >
      {props.children}
    </OverlayTrigger>
  );
};

class TldrTitleRow extends Component {
  signal = axios.CancelToken.source();

  constructor(props) {
    super(props);

    this.state = {
      searchVisibility: false,
      searchValues: false,
      showDeletePopup: false,
      showMoveToFolderPopup: false,
      showNewFolderPopup: false,
      inProgress: "false",
      folderItems: [],
    };
  }

  componentDidMount() {
    this.props.resetCardsSelection();
    this.props.fetchFolders(this.signal.token, this.props);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props !== prevProps) {
      if (
        prevProps.isPanelShowing &&
        prevProps.itemCount !== this.props.itemCount
      ) {
        // reset cards selection and state when item count changes
        this.props.resetCardsSelection();
        this.setState({
          searchVisibility: false,
          searchValues: false,
          showDeletePopup: false,
          showMoveToFolderPopup: false,
          showNewFolderPopup: false,
          inProgress: "false",
        });
      } else if (
        this.props.showNewFolderPopup !== prevProps.showNewFolderPopup
      ) {
        this.setState({ showNewFolderPopup: this.props.showNewFolderPopup });
      }
    }
  }

  delete = () => {
    let assetsIds = [],
      templateIds = [],
      storyIds = [],
      aiDocumentIds = [];
    this.props.selectedCards.forEach((item) => {
      if (item.id) {
        if (item.hasOwnProperty("prompt")) {
          // ai document
          aiDocumentIds.push(item.id);
        } else {
          // story
          storyIds.push(item.id);
        }
      } else {
        if (item.content.meta.hasOwnProperty("asset_key")) {
          // asset
          assetsIds.push(item.content.meta.id);
        } else {
          // template
          templateIds.push(item.content.meta.id);
        }
      }
    });

    batch(() => {
      if (assetsIds.length > 0) {
        this.props.delete(
          {
            ...this.props,
            type: "asset",
            ids: assetsIds,
          },
          this.signal.token,
          this.props.selectedFolder ? true : false
        );
      }

      if (templateIds.length > 0) {
        this.props.delete(
          {
            ...this.props,
            type: "svg",
            ids: templateIds,
          },
          this.signal.token,
          this.props.selectedFolder ? true : false
        );
      }

      if (storyIds.length > 0) {
        this.props.delete(
          {
            ...this.props,
            type: "story",
            ids: storyIds,
          },
          this.signal.token,
          this.props.selectedFolder ? true : false
        );
      }

      if (aiDocumentIds.length > 0) {
        this.props.delete(
          {
            ...this.props,
            type: "document",
            ids: aiDocumentIds,
          },
          this.signal.token,
          this.props.selectedFolder ? true : false
        );
      }
    });
  };

  createNewFolder = (name) => {
    this.props.createNewFolder(name, this.signal.token).then(() => {
      this.setState({
        showNewFolderPopup: false,
        inProgress: "false",
      });
    });
  };

  moveToFolder = (folder) => {
    this.props
      .moveToFolder(folder, this.props.selectedCards, this.signal.token)
      .then(() => {
        this.props.addFolderItems({
          folderId: folder.id,
          items: this.props.selectedCards.map((item) =>
            item.id ? item : item.content.meta
          ),
        });
        this.props.resetCardsSelection();
        this.setState({
          showMoveToFolderPopup: false,
          inProgress: "false",
        });
      });
  };

  openMoveToFolderModel = () => {
    this.setState({
      showMoveToFolderPopup: true,
      folderItems: this.props.folders,
    });
  };

  render() {
    const {
      showDeletePopup,
      showNewFolderPopup,
      inProgress,
      showMoveToFolderPopup,
    } = this.state;

    const {
      type,
      displayType,
      selectedCards,
      displayNamePluralForm,
      searchBoxWidth,
      classes,
    } = this.props;

    const confirmationModalDisplayType = displayType ? displayType : type;

    return this.props.isPanelShowing ? (
      <HomeSelectionRow
        marginTop={this.props.marginTop}
        className={`${classes ? classes : ""}`}
      >
        <span className="count">
          {this.props.selectedCards.length} selected
        </span>
        <div className="action-items">
          <Checkbox
            checked
            onCheck={this.props.resetCardsSelection}
            description="Unselect all"
          />
          <ComponentWithTooltip description="Delete">
            <FontAwesomeIcon
              icon={faTrash}
              color={lightInactive}
              onClick={() => this.setState({ showDeletePopup: true })}
            />
          </ComponentWithTooltip>
          <ComponentWithTooltip description="Add to Folder">
            <FontAwesomeIcon
              icon={faArrowAltCircleUp}
              color={lightInactive}
              onClick={this.openMoveToFolderModel}
            />
          </ComponentWithTooltip>
        </div>
        <TldrConfirmationModal
          inprogress={inProgress}
          show={showDeletePopup}
          customMessage={`Are you sure you want to delete ${
            selectedCards.length
          } ${
            selectedCards.length > 1
              ? displayNamePluralForm
                ? displayNamePluralForm
                : confirmationModalDisplayType + "s"
              : confirmationModalDisplayType
          }?`}
          onHide={(e) => {
            this.setState({ showDeletePopup: false });
          }}
          onYes={() => {
            this.setState(
              {
                inProgress: "true",
              },
              this.delete
            );
          }}
        />
        <TldrMoveToFolderModel
          inProgress={inProgress}
          show={showMoveToFolderPopup}
          onHide={(e) => {
            this.setState({ showMoveToFolderPopup: false });
          }}
          folderItems={this.state.folderItems}
          onYes={(data) => {
            this.setState(
              {
                inProgress: "true",
              },
              () => this.moveToFolder(data)
            );
          }}
          onAddFolder={() => {
            this.setState({
              showMoveToFolderPopup: false,
            });
            this.props.emptyScreenOnClickAction();
          }}
        />
      </HomeSelectionRow>
    ) : (
      <HomeTitleRow className={`${classes ? classes : ""}`}>
        <div className="d-flex flex-column align-items-start">
          <h4 className="title text-center">{this.props.title}</h4>
          {this.props.subTitle ? (
            <StyledMarkerplaceHelpText className={"d-none d-md-block"}>
              {this.props.subTitle}
            </StyledMarkerplaceHelpText>
          ) : null}
          {this.props.links ? (
            <Breadcrumb>
              {this.props.links.map((item, index) => (
                <Breadcrumb.Item
                  onClick={() => this.props.handleLinkOnClick(item)}
                  active={index === this.props.links.length - 1}
                >
                  {item.name}
                </Breadcrumb.Item>
              ))}
            </Breadcrumb>
          ) : null}
        </div>
        <div className="d-flex align-items-center">
          {this.props.enableCreateNewFolderOption ? (
            <FontAwesomeIcon
              icon={faFolderPlus}
              color={lightInactive}
              className="create-folder-icon"
              onClick={() => this.setState({ showNewFolderPopup: true })}
            />
          ) : null}

          {!this.props.disableSearch ? (
            this.props.collapsedSearch ? (
              <div className="d-flex align-items-center">
                {this.state.searchVisibility ? (
                  <TldrSearch
                    autoFocus
                    width={searchBoxWidth || "300px"}
                    placeholder="Name, Platform, Type, etc."
                    onSearch={(keyword) => {
                      this.setState({ searchValues: true });
                      this.props.handleSearch(keyword);
                    }}
                    size="sm"
                    searchLocation="dashboard"
                  />
                ) : null}
                <FontAwesomeIcon
                  icon={this.state.searchVisibility ? "times" : "search"}
                  color={lightInactive}
                  className="search-icon"
                  onClick={() => {
                    if (
                      this.state.searchVisibility &&
                      this.state.searchValues
                    ) {
                      this.props.handleSearch("");
                    }
                    this.setState({
                      searchValues: false,
                      searchVisibility: !this.state.searchVisibility,
                    });
                  }}
                />
              </div>
            ) : (
              <TldrSearch
                width={searchBoxWidth || "300px"}
                placeholder="Search anything"
                onSearch={(keyword) => {
                  this.props.handleSearch(keyword);
                }}
                searchLocation="dashboard"
              />
            )
          ) : null}
        </div>

        <TldrNewFolderDialog
          inProgress={inProgress}
          show={showNewFolderPopup}
          onHide={(e) => {
            this.setState({ showNewFolderPopup: false });
            this.props.hideNewFolderPopup();
          }}
          onYes={(name) => {
            this.setState(
              {
                inProgress: "true",
              },
              () => this.createNewFolder(name)
            );
          }}
        />
      </HomeTitleRow>
    );
  }
}

const mapStateToProps = (state) => ({
  isPanelShowing: state.homePageCards.isPanelShowing,
  selectedCards: state.homePageCards.selectedCards,
  folders: state.folders.folders,
});

const mapDispatchToProps = (dispatch) => ({
  resetCardsSelection: () => dispatch(resetCardsSelection()),
  delete: (props, token, shouldUpdateFolders) =>
    dispatch(deleteItemsInBulk(props, token, shouldUpdateFolders)),
  showToast: (payload) => dispatch(showToast(payload)),
  addFolderItems: (payload) => dispatch(addFolderItems(payload)),
  fetchFolders: (token, props) => dispatch(fetchFolders(token, props)),
  createNewFolder: (name, token) => dispatch(createNewFolder(name, token)),
  moveToFolder: (folder, selectedCards, token) =>
    dispatch(moveToFolder(folder, selectedCards, token)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(TldrTitleRow));
