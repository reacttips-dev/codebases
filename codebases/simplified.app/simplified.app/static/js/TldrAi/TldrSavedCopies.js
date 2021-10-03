import React, { useState, useEffect } from "react";

import axios from "axios";
import TldrTitleRow from "../_components/styled/home/TldrTitleRow";
import { ShowCenterSpinner } from "../_components/common/statelessView";
import AiLastRuns from "./AiLastRuns";
import { connect } from "react-redux";
import { getDocuments, resetDocument } from "../_actions/aiDocumentActions";
import { handleHTTPError } from "../_actions/errorHandlerActions";
import { TldrNewFolderDialog } from "../_components/styled/home/statelessView";
import { resetCardsSelection } from "../_actions/homepageCardActions";
import { createNewFolder, moveToFolder } from "../_actions/folderActions";
import { ShowNoContent } from "../_components/common/statelessView";
import { EmptyStateScreen } from "../_components/styled/home/statelessView";
import { MAGICAL } from "../_utils/routes";
import TLDRTitleSearch from "../_components/common/TLDRTitleSearch";

function TldrSavedCopies(props) {
  let signal = axios.CancelToken.source();

  const [loaded, setLoaded] = useState(false);
  const [search, setSearchTerm] = useState("");
  const [showNewFolderPopup, setShowNewFolderPopup] = useState(false);
  const [inProgress, setInProgress] = useState("false");
  const { payload } = props.documents;

  function fetchSavedCopies() {
    setLoaded(false);
    props.getDocuments(props, search, signal).then(() => {
      setLoaded(true);
    });
  }

  useEffect(() => {
    props.resetDocument();
    fetchSavedCopies();
  }, [search]);

  function handleSearch(searchTerm) {
    setSearchTerm(searchTerm);
  }

  useEffect(() => {
    props.resetDocument();
    fetchSavedCopies();
    return () => {
      signal.cancel("The user aborted a request.");
    };
  }, []);

  function createNewFolder(name) {
    props.createNewFolder(name, signal.token).then(() => {
      setShowNewFolderPopup(false);
      setInProgress("false");
      props.moveToFolder(props.folders[0], props.selectedCards, signal.token);
      props.resetCardsSelection();
    });
  }

  return (
    <>
      <TldrTitleRow
        itemCount={payload?.length || 0}
        displayType="item"
        title={"Documents"}
        subTitle={"Generate more or view past compilations"}
        handleSearch={handleSearch}
        showNewFolderPopup={showNewFolderPopup}
        emptyScreenOnClickAction={() => setShowNewFolderPopup(true)}
        marginTop="-1rem"
        classes={"d-none d-md-flex"}
      />

      <TLDRTitleSearch
        searchConfig={{
          handleSearch: handleSearch,
        }}
        title={"Documents"}
        classes={"d-flex d-sm-flex d-md-none"}
        style={{ paddingLeft: "1rem", paddingRight: "1rem" }}
      ></TLDRTitleSearch>
      {payload?.length === 0 && search === "" && loaded ? (
        <EmptyStateScreen
          title="No documents here yet!"
          description="Create your AI documents"
          link={MAGICAL}
          linkPlaceholder="Go to Playground"
        />
      ) : null}
      {payload?.length > 0 ? (
        <>
          <AiLastRuns results={payload}></AiLastRuns>
        </>
      ) : loaded && search === "" ? (
        <>
          <ShowCenterSpinner loaded={loaded}></ShowCenterSpinner>
        </>
      ) : loaded && search !== "" ? (
        <ShowNoContent text="No results found." />
      ) : (
        <ShowCenterSpinner loaded={loaded}></ShowCenterSpinner>
      )}

      <TldrNewFolderDialog
        inProgress={inProgress}
        show={showNewFolderPopup}
        onHide={(e) => {
          setShowNewFolderPopup(false);
        }}
        onYes={(name) => {
          setInProgress("true");
          createNewFolder(name);
        }}
      />
    </>
  );
}

TldrSavedCopies.propTypes = {};

const mapStateToProps = (state) => {
  return {
    documents: state.document,
    folders: state.folders.folders,
    selectedCards: state.homePageCards.selectedCards,
    auth: state.auth,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    handleHTTPError: (error, props) => dispatch(handleHTTPError(error, props)),
    getDocuments: (props, search, signal) =>
      dispatch(getDocuments(props, search, signal)),
    resetCardsSelection: () => dispatch(resetCardsSelection()),
    createNewFolder: (name, token) => dispatch(createNewFolder(name, token)),
    moveToFolder: (folder, selectedCards, token) =>
      dispatch(moveToFolder(folder, selectedCards, token)),
    resetDocument: () => dispatch(resetDocument()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TldrSavedCopies);
