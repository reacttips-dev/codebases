import React, { Component } from "react";
import { connect } from "react-redux";
import { WEBSOCKETS_ENDPOINT } from "../_actions/endpoints";
import { fetchStoryPages, fetchStoryDetail } from "../_actions/storiesActions";
import { wsConnect, wsDisconnect } from "../_actions/webSocketAction";
import axios from "axios";
import { fetchedFonts } from "../_actions/appActions";
import {
  StyledPreviewArea,
  StyledPreviewFrame,
} from "../_components/styled/present/stylePresent";
import PresentArtBoards from "./PresentArtBoards";
import PreviewNavbar from "./PreviewNavbar";

const format = require("string-format");

export class Preview extends Component {
  signal = axios.CancelToken.source();

  constructor(props) {
    super(props);
    this.state = {
      previewAreaSize: null,
    };

    this.previewAreaRef = React.createRef();
  }

  render() {
    const { location } = this.props;
    const following = this.props.actionstore.user;
    const { previewAreaSize } = this.state;

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

    return (
      <StyledPreviewFrame show={following.pk ? true : false}>
        <PreviewNavbar />
        <StyledPreviewArea
          ref={(node) => {
            if (!node) return;
            this.previewAreaRef = node;
          }}
        >
          {previewAreaSize && (
            <PresentArtBoards
              previewAreaSize={previewAreaSize}
              queryString={parsedQs}
              artboardIndexesToRender={artboardIndexes}
            />
          )}
        </StyledPreviewArea>
        {/* <PreviewArtboardIndicator></PreviewArtboardIndicator> */}
      </StyledPreviewFrame>
    );
  }

  getPreviewAreaRef = () => {
    return this.previewAreaRef;
  };

  componentDidMount() {
    const {
      params: { designId, org },
    } = this.props.match;

    let selectedOrg = this.props.auth.payload.selectedOrg;
    axios.defaults.headers.common["Organization"] = org;
    this.setServerToken();
    this.props
      .fetchStoryDetail(designId, this.signal, { ...this.props })
      .then((story) => {
        // Fetch fonts
        this.props.fetchedFonts(story?.story_fonts);
        this.props.fetchStoryPages(designId, null, { ...this.props });
      });

    const token = localStorage.getItem("Token");
    if (selectedOrg === Number(org) && token) {
      var dev = format(WEBSOCKETS_ENDPOINT, designId, token);
      this.props.wsConnect(dev);
    }
    this.setPreviewAreaSize();
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

  setPreviewAreaSize = () => {
    let previewAreaHeight = this.previewAreaRef.getBoundingClientRect().height;
    let previewAreaWidth = this.previewAreaRef.getBoundingClientRect().width;

    this.setState({
      ...this.state,
      previewAreaSize: {
        width: previewAreaWidth,
        height: previewAreaHeight,
      },
    });
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
}

Preview.propTypes = {};

const mapStateToProps = (state) => ({
  fonts: state.app.fonts,
  mousepointerstore: state.mousepointerstore,
  auth: state.auth,
  actionstore: state.actionstore,
  session: state.session,
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

export default connect(mapStateToProps, mapDispatchToProps)(Preview);
