import React, { Component } from "react";
import { Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import styled from "styled-components";
import {
  faCopy,
  faEllipsisV,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { grey } from "../_components/styled/variable";
import {
  StyledTemplateActionsDropDownItem,
  StyledTemplateActionsDropDownMenu,
} from "../_components/styled/styles";
import { batch, connect } from "react-redux";
import { setActiveLayer, setActivePage } from "../_actions/textToolbarActions";
import { wsClonePage, wsDeletePage } from "../_actions/webSocketAction";
import { resetSliders } from "../_actions/sidebarSliderActions";
import { TldrConfirmActionModal } from "../_components/common/statelessView";

const CustomToggle = React.forwardRef(({ onClick }, ref) => (
  <Link
    className="px-2"
    to=""
    href=""
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
      onClick(e);
    }}
  >
    <FontAwesomeIcon icon={faEllipsisV} size="1x" color={grey} />
  </Link>
));

const StyledMenuWrapper = styled.div`
  position: absolute;
  right: 8px;
  top: 8px;
`;

class ArtBoardPreviewDropdownActions extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showConfirmation: false,
    };
  }

  onClickDeleteCurrentArtBoard = (event) => {
    const { activePage, pagestore, showForActiveArtboardOnly, pageId } =
      this.props;
    if (activePage.isSelected || !showForActiveArtboardOnly) {
      let currentIndex = null;
      let pageIdToRemove = null;
      if (showForActiveArtboardOnly) {
        currentIndex = activePage.pageIndex;
        pageIdToRemove = activePage.id;
      } else {
        currentIndex = pagestore.pageIds.indexOf(pageId);
        pageIdToRemove = pageId;
        if (currentIndex < 0) {
          return;
        }
      }
      this.props.wsDeletePage(pageIdToRemove);
    }

    this.props.setActiveLayer(null, null, null, null);
    this.props.resetSliders();
  };

  duplicate = () => {
    const { activePage, showForActiveArtboardOnly, pageId } = this.props;
    if (showForActiveArtboardOnly) {
      this.props.wsClonePage(activePage.id);
    } else {
      this.props.wsClonePage(pageId);
    }
  };

  render() {
    const { activePage, pageId, showForActiveArtboardOnly } = this.props;

    return (
      <>
        <StyledMenuWrapper>
          <Dropdown drop="down" alignRight={true}>
            <Dropdown.Toggle
              as={CustomToggle}
              id="dropdown-active-artboard-action"
            />

            {((showForActiveArtboardOnly && pageId === activePage.id) ||
              !showForActiveArtboardOnly) && (
              <StyledTemplateActionsDropDownMenu>
                <StyledTemplateActionsDropDownItem
                  onClick={(e) => {
                    e.stopPropagation();
                    this.duplicate();
                  }}
                >
                  Duplicate
                  <FontAwesomeIcon icon={faCopy} size="1x" />
                </StyledTemplateActionsDropDownItem>
                <StyledTemplateActionsDropDownItem
                  onClick={(e) => {
                    e.stopPropagation();
                    this.setState({ showConfirmation: true });
                  }}
                >
                  Delete
                  <FontAwesomeIcon icon={faTrash} size="1x" />
                </StyledTemplateActionsDropDownItem>
              </StyledTemplateActionsDropDownMenu>
            )}
          </Dropdown>
        </StyledMenuWrapper>

        <TldrConfirmActionModal
          show={this.state.showConfirmation}
          onYes={() => {
            batch(() => {
              this.setState({ showConfirmation: false });
              this.onClickDeleteCurrentArtBoard();
            });
          }}
          onHide={() => this.setState({ showConfirmation: false })}
        ></TldrConfirmActionModal>
      </>
    );
  }
}

ArtBoardPreviewDropdownActions.defaultProps = {
  showForActiveArtboardOnly: true,
};

ArtBoardPreviewDropdownActions.propTypes = {
  pageId: PropTypes.string.isRequired,
  showForActiveArtboardOnly: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  pagestore: state.pagestore,
  activePage: state.editor.activePage,
});

const mapDispatchToProps = (dispatch) => ({
  setActivePage: (pageId, pageIndex, isSelected) =>
    dispatch(setActivePage(pageId, pageIndex, isSelected)),
  wsDeletePage: (pageId) => dispatch(wsDeletePage(pageId)),
  setActiveLayer: (elementId, elementType, layerId, elementParentId) =>
    dispatch(setActiveLayer(elementId, elementType, layerId, elementParentId)),
  resetSliders: () => dispatch(resetSliders()),
  wsClonePage: (pageId) => dispatch(wsClonePage(pageId)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ArtBoardPreviewDropdownActions);
