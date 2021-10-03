import React, { useState, useEffect } from "react";
import {
  StyledMarketplaceContent,
  HomeComponent,
} from "../_components/styled/home/stylesHome";
import axios from "axios";
import TldrTitleRow from "../_components/styled/home/TldrTitleRow";
import { ShowCenterSpinner } from "../_components/common/statelessView";
import AiLastRuns from "./AiLastRuns";
import { connect } from "react-redux";
import {
  getFavoriteCopies,
  resetDocument,
} from "../_actions/aiDocumentActions";
import { handleHTTPError } from "../_actions/errorHandlerActions";
import { TldrNewFolderDialog } from "../_components/styled/home/statelessView";
import { resetCardsSelection } from "../_actions/homepageCardActions";
import { createNewFolder, moveToFolder } from "../_actions/folderActions";
import { ShowNoContent } from "../_components/common/statelessView";
import { EmptyStateScreen } from "../_components/styled/home/statelessView";
import { MAGICAL } from "../_utils/routes";

function TldrFavoriteCopies(props) {
  let signal = axios.CancelToken.source();

  const [loaded, setLoaded] = useState(false);
  const [search, setSearchTerm] = useState("");
  const [showNewFolderPopup, setShowNewFolderPopup] = useState(false);
  const [inProgress, setInProgress] = useState("false");
  const { payload } = props.documents;

  function fetchFavoriteCopies() {
    setLoaded(false);
    props.getFavoriteCopies(props, search, signal).then(() => {
      setLoaded(true);
    });
  }

  useEffect(() => {
    props.resetDocument();
    fetchFavoriteCopies();
  }, [search]);

  function handleSearch(searchTerm) {
    setSearchTerm(searchTerm);
  }

  useEffect(() => {
    props.resetDocument();
    fetchFavoriteCopies();
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
      <HomeComponent>
        <StyledMarketplaceContent>
          <TldrTitleRow
            itemCount={payload.length}
            displayType="item"
            title={"Favorites"}
            subTitle={"View your favorite copies"}
            handleSearch={handleSearch}
            showNewFolderPopup={showNewFolderPopup}
            emptyScreenOnClickAction={() => setShowNewFolderPopup(true)}
            marginTop="-1rem"
            disableSearch={true}
          />
          {payload.length === 0 && search === "" && loaded ? (
            <EmptyStateScreen
              title="No favorite documents here yet!"
              description="Create your AI documents"
              link={MAGICAL}
              linkPlaceholder="Go to playground"
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
        </StyledMarketplaceContent>
      </HomeComponent>

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

TldrFavoriteCopies.propTypes = {};

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
    getFavoriteCopies: (props, search, signal) =>
      dispatch(getFavoriteCopies(props, search, signal)),
    resetCardsSelection: () => dispatch(resetCardsSelection()),
    createNewFolder: (name, token) => dispatch(createNewFolder(name, token)),
    moveToFolder: (folder, selectedCards, token) =>
      dispatch(moveToFolder(folder, selectedCards, token)),
    resetDocument: () => dispatch(resetDocument()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TldrFavoriteCopies);
