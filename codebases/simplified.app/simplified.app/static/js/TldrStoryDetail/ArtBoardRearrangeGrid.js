import {
  faChevronDown,
  faPlus,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Component } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { batch, connect } from "react-redux";
import {
  closeBottomPanel,
  openBottomPanel,
} from "../_actions/bottomPanelActions";
import { moveArtboard, wsAddPage } from "../_actions/webSocketAction";
import { DraggablePreviewArtBoard } from "../_components/common/statelessView";
import {
  StyledArtBoardEmptyContainer,
  StyledArtBoardRearrangeGridContainer,
} from "../_components/styled/details/styleArtBoardEditor";
import { StyledZoomActionButton } from "../_components/styled/styles";
import { BottomPanelViewTypes } from "../_utils/constants";

class ArtBoardRearrangeGrid extends Component {
  constructor(props) {
    super(props);

    this.state = {
      destinationIndex: 0,
    };
  }

  onClickClose = () => {
    const { closeBottomPanel } = this.props;
    batch(() => {
      closeBottomPanel();
    });
  };

  onClickMinimizeView = () => {
    const { openBottomPanel } = this.props;
    batch(() => {
      openBottomPanel(BottomPanelViewTypes.PREVIEW_ARTBOARDS);
    });
  };

  render() {
    const { pages, pageIds } = this.props.pagestore;
    const { activePage } = this.props;

    const previewArtBoards = pageIds.map((pageId, index) => {
      return (
        <DraggablePreviewArtBoard
          key={index}
          id={pageId}
          page={pages[pageId]}
          onMoveItem={this.moveItem}
          onDrop={this.dropItem}
          isCurrentPage={pageId === activePage.id}
        />
      );
    });

    return (
      <StyledArtBoardRearrangeGridContainer className="d-flex">
        <div
          id="grid-title-bar"
          className="title-bar"
          onClick={(e) => {
            if (e.target.id === "grid-title-bar") this.onClickClose();
          }}
        >
          <div className="title-display">
            <StyledZoomActionButton onClick={this.onClickClose}>
              {previewArtBoards.length} Artboards
              <FontAwesomeIcon
                icon={faChevronDown}
                style={{ marginLeft: "12px" }}
              />
            </StyledZoomActionButton>
          </div>
          <div className="actions">
            <div className="actions-container">
              <div className="d-none d-sm-none d-md-block">
                <OverlayTrigger
                  trigger={["hover", "focus"]}
                  placement="bottom"
                  overlay={<Tooltip>Minimize to list</Tooltip>}
                >
                  <StyledZoomActionButton onClick={this.onClickMinimizeView}>
                    <FontAwesomeIcon icon={faChevronDown}></FontAwesomeIcon>
                  </StyledZoomActionButton>
                </OverlayTrigger>
              </div>
              <OverlayTrigger
                trigger={["hover", "focus"]}
                placement="bottom"
                overlay={<Tooltip>Close full-screen view</Tooltip>}
              >
                <StyledZoomActionButton onClick={this.onClickClose}>
                  <FontAwesomeIcon icon={faTimes}></FontAwesomeIcon>
                </StyledZoomActionButton>
              </OverlayTrigger>
            </div>
          </div>
        </div>

        <div className="re-arrange-grid">
          {previewArtBoards}

          <OverlayTrigger
            trigger={["hover", "focus"]}
            placement="bottom"
            overlay={<Tooltip>Add Artboard</Tooltip>}
          >
            <StyledArtBoardEmptyContainer onClick={this.onClickAddArtBoard}>
              <FontAwesomeIcon icon={faPlus} />
            </StyledArtBoardEmptyContainer>
          </OverlayTrigger>
        </div>
      </StyledArtBoardRearrangeGridContainer>
    );
  }

  moveItem = (sourceId, destinationId) => {
    const { pageIds } = this.props.pagestore;

    const sourceIndex = pageIds.findIndex((item) => item === sourceId);
    const destinationIndex = pageIds.findIndex(
      (item) => item === destinationId
    );

    if (sourceId === -1 || destinationId === -1) {
      return;
    }

    const offset = destinationIndex - sourceIndex;

    this.moveElement(this.props.pagestore.pageIds, sourceIndex, offset);

    this.setState({
      destinationIndex: destinationIndex,
    });
  };

  moveElement = (array, index, offset) => {
    const newIndex = index + offset;

    return this.move(array, index, newIndex);
  };

  move = (array, oldIndex, newIndex) => {
    if (newIndex >= array.length) {
      newIndex = array.length - 1;
    }
    array.splice(newIndex, 0, array.splice(oldIndex, 1)[0]);
    return array;
  };

  dropItem = (pageId) => {
    this.props.moveArtboard(pageId, this.state.destinationIndex);
  };

  onClickAddArtBoard = (event) => {
    this.props.wsAddPage();
  };
}

const mapStateToProps = (state) => ({
  pagestore: state.pagestore,
  activePage: state.editor.activePage,
});

const mapDispatchToProps = (dispatch) => ({
  moveArtboard: (pageId, destinationIndex) =>
    dispatch(moveArtboard(pageId, destinationIndex)),
  wsAddPage: () => dispatch(wsAddPage()),
  openBottomPanel: (panelType) => dispatch(openBottomPanel(panelType)),
  closeBottomPanel: () => dispatch(closeBottomPanel()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ArtBoardRearrangeGrid);
