import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { StyledNavbar, StyledNavbarButton } from "../_components/styled/styles";
import { Nav, Navbar, OverlayTrigger, Tooltip } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TldrShare from "../_components/common/TldrShare";
import TldrNavDropdown from "../_components/common/TldrNavDropdown";
import EditableLabel from "../_components/common/EditableLabel";
import { MAGICAL } from "../_utils/routes";
import { resetDocument, updateDocument } from "../_actions/aiDocumentActions";
import Axios from "axios";
import Format from "string-format";
import { DOCUMENT_DETAILS } from "../_actions/endpoints";
import { useHistory } from "react-router";
import { handleHTTPError } from "../_actions/errorHandlerActions";
import { BrandLogo } from "../_components/common/statelessView";

export const TldrAINavbar = (props) => {
  const [share, showShare] = useState(false);
  const { selectedOrg } = props.auth.payload;
  const { data } = props.document;
  const signalToken = Axios.CancelToken.source();
  const history = useHistory();

  function handleFocus(text) {}

  function backToDashboard() {
    props.resetDocument();
    history.push(MAGICAL);
  }

  function handleFocusOut(text) {
    const documentId = data.id;
    if (!text) {
      return;
    }

    Axios.patch(
      Format(DOCUMENT_DETAILS, documentId),
      { title: text },
      {
        cancelToken: signalToken.token,
      }
    )
      .then((res) => {
        props.updateDocument(res.data);
      })
      .catch((error) => {
        props.handleHTTPError(error, props);
      });
  }

  return (
    <StyledNavbar
      expanded={true}
      fixed="top"
      iscompact="true"
      location="editor"
    >
      <Navbar.Brand
        className="nav-brand-icon story-brand-icon"
        onClick={(e) => {
          e.stopPropagation();
          backToDashboard();
        }}
      >
        <BrandLogo />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <StyledNavbarButton
            onClick={(e) => {
              e.stopPropagation();
              backToDashboard();
            }}
          >
            <FontAwesomeIcon icon="chevron-left" />
          </StyledNavbarButton>
          <EditableLabel
            text={data.title}
            labelClassName="storyname"
            inputClassName="storyinput"
            labelPlaceHolder={data.title + "&#xf02b;"}
            inputMaxLength={50}
            onFocus={handleFocus}
            onFocusOut={handleFocusOut}
          />
        </Nav>

        <OverlayTrigger
          placement="bottom"
          overlay={<Tooltip id="heart">Share with others</Tooltip>}
        >
          <StyledNavbarButton
            tldrbtn="basic"
            onClick={(e) => {
              e.stopPropagation();
              showShare(true);
            }}
          >
            <FontAwesomeIcon
              icon="user-plus"
              className="mr-1"
            ></FontAwesomeIcon>
            <span className="ai-share-document-span">Share</span>
          </StyledNavbarButton>
        </OverlayTrigger>
        <TldrNavDropdown />
      </Navbar.Collapse>
      {share && (
        <TldrShare
          org={selectedOrg}
          onHide={() => {
            showShare(false);
          }}
        />
      )}
    </StyledNavbar>
  );
};

TldrAINavbar.propTypes = {
  auth: PropTypes.object.isRequired,
  document: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    document: state.document,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateDocument: (payload) => dispatch(updateDocument(payload)),
    resetDocument: () => dispatch(resetDocument()),
    handleHTTPError: (error, props) => dispatch(handleHTTPError(error, props)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TldrAINavbar);
