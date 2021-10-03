import React from "react";
import PropTypes from "prop-types";
import TLDRInfiniteScroll from "../_components/common/TLDRInfiniteScroll";
import { StyledCenterAlignedRow } from "../_components/styled/ai/styledAi";
import { StyledMarketPlaceGallery } from "../_components/styled/home/stylesHome";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AI_NEW_DOCUMENT } from "../_utils/routes";
import { useHistory } from "react-router";
import { batch, connect } from "react-redux";
import { resetDocument } from "../_actions/aiDocumentActions";
import AIAllDocuments from "./AIAllDocuments";
import AIFavoriteDocuments from "./AIFavoriteDocuments";
import { analyticsTrackEvent } from "../_utils/common";

function AiLastRuns(props) {
  const history = useHistory();
  function loadMoreData() {}

  const blankView = () => {
    return (
      <StyledCenterAlignedRow
        key={"blk"}
        className={""}
        onClick={(e) => {
          batch(() => {
            props.resetDocument();
            history.push(AI_NEW_DOCUMENT);
            analyticsTrackEvent("createNewDocument");
          });
        }}
      >
        <FontAwesomeIcon
          icon={"plus-circle"}
          className={"mb-1 mr-2"}
        ></FontAwesomeIcon>{" "}
        New document
      </StyledCenterAlignedRow>
    );
  };

  const allDocuments = props.results.map((result) => {
    return result.prompt === undefined ? (
      <AIFavoriteDocuments
        key={`${result.id}`}
        result={result}
        enableCardSelection
      />
    ) : (
      <AIAllDocuments
        key={`${result.id}`}
        result={result}
        enableCardSelection
      />
    );
  });

  const childElements =
    allDocuments.length > 0 ? [blankView()].concat(allDocuments) : allDocuments;

  return (
    <StyledMarketPlaceGallery>
      <TLDRInfiniteScroll
        className={"ai-results-infinite-scroll"}
        childrens={childElements}
        hasMore={false}
        loadMoreData={loadMoreData}
        loaded={false} // Change its value whenever data get loaded.
      />
    </StyledMarketPlaceGallery>
  );
}

AiLastRuns.propTypes = {
  results: PropTypes.array.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

const mapDispatchToProps = (dispatch) => {
  return {
    resetDocument: () => dispatch(resetDocument()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AiLastRuns);
