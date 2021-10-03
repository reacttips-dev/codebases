import React, { Component } from "react";
import { connect } from "react-redux";
import { WEBSOCKETS_ENDPOINT } from "../_actions/endpoints";
import { fetchStoryPages, fetchStoryDetail } from "../_actions/storiesActions";
import { wsConnect, wsDisconnect } from "../_actions/webSocketAction";
import axios from "axios";
import { fetchedFonts } from "../_actions/appActions";
import { StyledPreviewFrame } from "../_components/styled/present/stylePresent";
import ArtBoardPreviewStaticCanvas from "../TldrStoryDetail/ArtBoardPreviewStaticCanvas";
import { StyledFullArtboardPreviewWrapper } from "../_components/styled/details/styleArtBoardEditor";

const format = require("string-format");

export class RenderPreview extends Component {
  signal = axios.CancelToken.source();

  render() {
    const { location, pagestore } = this.props;
    const { pages, pageIds } = pagestore;

    const parsedQs = new URLSearchParams(location.search);

    //
    // const { search } = this.props.location;
    // let queryParameters = new URLSearchParams(search);
    let artboardIndexes = parsedQs.get("artboardIndexes");
    artboardIndexes =
      (artboardIndexes &&
        artboardIndexes
          .split(",")
          .map((artboardIndex, index) => Number(artboardIndex))) ||
      [];

    const artboardId = parsedQs.get("artboardId");

    let page = null;
    if (artboardId) {
      page = pages[artboardId];
    } else if (artboardIndexes.length > 0) {
      let pageId = pageIds[artboardIndexes[0]];
      page = pages[pageId];
    } else if (pageIds.length > 0) {
      let pageId = pageIds[0];
      page = pages[pageId];
    }

    return (
      <StyledPreviewFrame>
        {page && (
          <StyledFullArtboardPreviewWrapper
            width={page.payload.width}
            height={page.payload.height}
          >
            <ArtBoardPreviewStaticCanvas
              page={page}
              transparentBackground={this.shouldHaveTransparentBackground()}
            />
          </StyledFullArtboardPreviewWrapper>
        )}
      </StyledPreviewFrame>
    );
  }

  componentDidMount() {
    const {
      params: { designId, org },
    } = this.props.match;

    const { location } = this.props;
    const parsedQs = new URLSearchParams(location.search);
    const pageId = parsedQs.get("artboardId");

    let selectedOrg = this.props.auth.payload.selectedOrg;
    axios.defaults.headers.common["Organization"] = org;
    this.setServerToken();
    this.props
      .fetchStoryDetail(designId, this.signal, { ...this.props })
      .then((story) => {
        // Fetch fonts
        this.props.fetchedFonts(story?.story_fonts);
        this.props.fetchStoryPages(designId, pageId, { ...this.props });
      });

    const token = localStorage.getItem("Token");
    if (selectedOrg === Number(org) && token) {
      var dev = format(WEBSOCKETS_ENDPOINT, designId, token);
      this.props.wsConnect(dev);
    }
  }

  /**
   * It set SeverToken if exists
   */
  setServerToken = () => {
    const { search } = this.props.location;
    let queryParameters = new URLSearchParams(search);
    let sToken = queryParameters.get("sToken");
    if (sToken) {
      axios.defaults.headers.common["ServerToken"] = sToken;
    }
  };

  componentDidUpdate(prevProps, prevState) {
    // Do nothing
  }

  componentWillUnmount() {
    this.props.wsDisconnect();
    this.signal.cancel("The user aborted a request.");
    axios.defaults.headers.common["Organization"] = parseInt(
      localStorage.getItem("SelectedOrgID")
    );
  }

  shouldHaveTransparentBackground = () => {
    const { location } = this.props;
    const parsedQs = new URLSearchParams(location.search);
    const transparentBackground = parsedQs.get("transparentBackground");
    const formatType = parsedQs.get("format");
    return (
      formatType === "png" && transparentBackground.toLowerCase() === "true"
    );
  };
}

RenderPreview.propTypes = {};

const mapStateToProps = (state) => ({
  fonts: state.app.fonts,
  auth: state.auth,
  pagestore: state.pagestore,
});

const mapDispatchToProps = (dispatch) => ({
  fetchStoryPages: (storyId, pageId, props) =>
    dispatch(fetchStoryPages(storyId, pageId, props)),
  fetchStoryDetail: (storyId, cancelToken, props) =>
    dispatch(fetchStoryDetail(storyId, cancelToken, props)),
  wsConnect: (url) => dispatch(wsConnect(url)),
  wsDisconnect: () => dispatch(wsDisconnect()),
  fetchedFonts: (fonts) => dispatch(fetchedFonts(fonts)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RenderPreview);
