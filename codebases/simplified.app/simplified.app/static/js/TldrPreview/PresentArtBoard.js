import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { connect, batch } from "react-redux";
import { wsBroadcast } from "../_actions/webSocketAction";
import { setActivePage, setScale } from "../_actions/textToolbarActions";
import ere from "element-resize-event";
import { ShowCenterSpinner } from "../_components/common/statelessView";
import { StyledSlideInActive } from "../_components/styled/details/stylesDetails";
import {
  StyledSlideBody,
  StyledStoryWrapper,
} from "../_components/styled/styles";
import ArtBoardPreviewStaticCanvas from "../TldrStoryDetail/ArtBoardPreviewStaticCanvas";

export class PresentArtBoard extends Component {
  signal = axios.CancelToken.source();
  constructor(props) {
    super(props);
    this.pageRef = React.createRef();
    this.state = {
      wrapperSize: { width: 0, height: 0 },
      artBoardSize: props.artBoardSize,
      scale: 1,
    };
  }

  render() {
    const { page, active, editor, layerstore } = this.props;
    const { loaded } = layerstore;
    const { activePage } = editor;

    let { artBoardSize } = this.state;
    const { height, width } = artBoardSize;

    return (
      <>
        <StyledStoryWrapper
          onClick={this.selectSlide}
          maxHeight={height}
          maxWidth={width}
          id={`body_wrapper_${page.id}`}
        >
          {/* <StyledSlideHeader>
            <div>Artboard {page.order + 1}</div>
          </StyledSlideHeader> */}

          <StyledSlideBody
            id={`body_${page.id}`}
            maxHeight={height}
            maxWidth={width}
            active={active}
            isSelected={activePage.isSelected}
            ref={(node) => {
              if (node !== null) {
                this.pageRef = node;
              }
            }}
          >
            <ArtBoardPreviewStaticCanvas page={page} />
            <StyledSlideInActive active={active} />
          </StyledSlideBody>
        </StyledStoryWrapper>
        <ShowCenterSpinner loaded={loaded} />
      </>
    );
  }

  componentDidMount() {
    const wrapper = this.pageRef;

    if (!wrapper) return;

    this.updateScale({
      ...this.state,
      wrapperSize: { width: wrapper.offsetWidth, height: wrapper.offsetHeight },
    });

    ere(wrapper, () => {
      this.updateScale({
        ...this.state,
        wrapperSize: {
          width: wrapper.offsetWidth,
          height: wrapper.offsetHeight,
        },
      });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    let body = document.querySelector("body");
    body.style.setProperty("--scale", this.state.scale);
  }

  componentWillUnmount() {
    this.signal.cancel("The user aborted a request.");
  }

  updateScale = (newState) => {
    const { wrapperSize, artBoardSize } = newState;

    let scale = Math.min(
      wrapperSize.width / artBoardSize.width,
      wrapperSize.height / artBoardSize.height
    );

    this.setState({
      ...newState,
      scale: scale,
    });
  };

  selectSlide = () => {
    const { activePage } = this.props.editor;
    if (activePage.id !== this.props.page.id || !activePage.isSelected) {
      batch(() => {
        this.props.setActivePage(this.props.page.id, true);
      });
    }
  };
}

PresentArtBoard.propTypes = {
  layerstore: PropTypes.object.isRequired,
  editor: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  editor: state.editor,
  layerstore: state.layerstore,
  auth: state.auth,
});

const mapDispatchToProps = (dispatch) => ({
  setActivePage: (pageId, isSelected) =>
    dispatch(setActivePage(pageId, isSelected)),
  setScale: (scale) => dispatch(setScale(scale)),
  wsBroadcast: (payload) => dispatch(wsBroadcast(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PresentArtBoard);
