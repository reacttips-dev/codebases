import React, { Component } from "react";
import { connect } from "react-redux";
import SearchForm from "../../../common/SearchForm";
import {
  resetViewAll,
  searchIconsOnBrandfetch,
} from "../../../../_actions/sidebarSliderActions";
import axios from "axios";
import {
  ImageItem,
  ShowNoContent,
  TldrLicenseAgreementText,
} from "../../../common/statelessView";
import { wsAddLayer } from "../../../../_actions/webSocketAction";
import { BRANDFETCH_LICENSE_AGREEMENT } from "../../../../_actions/endpoints";
import { SourceTypes } from "../../../../_actions/types";

class Brandfetch extends Component {
  signal = axios.CancelToken.source();
  abortController = new AbortController();

  constructor(props) {
    super(props);
    this.state = {
      viewAll: true,
      data: [],
    };
  }

  componentWillMount() {
    this.props.searchIconsOnBrandfetch(
      "google",
      { ...this.props },
      this.abortController.signal
    );
  }

  preparePayload = (data) => {
    if (data.image_width <= 0 || data.image_height <= 0) {
    }
    const message = {
      mime: "image",

      content: {
        source: SourceTypes.BRANDFETCH,
        source_id: null,
        source_url: data.image,
      },
      payload: {
        type: "image",
        src: data.image,
        height: 400,
        width: 600,
        originX: "left",
        originY: "top",
      },
    };
    return message;
  };

  render() {
    const { viewAll, data } = this.state;
    const { payload } = this.props.sidebarSlider;
    const { error_message } = this.props.errors;
    let brandElement = [];
    if (data) {
      if (error_message === "No results found.") {
        brandElement = <ShowNoContent text="No results found." />;
      } else {
        brandElement = payload.map((item, index) => {
          return item.image === undefined ? (
            <ShowNoContent text="Check domain name" />
          ) : (
            <div
              key={index}
              className="brandfetch-item-element brandfetch-item brandfetch-logo-icon"
              onClick={() => this.addBrandLogoLayer(this.preparePayload(item))}
            >
              <ImageItem
                data={this.preparePayload(item)}
                key="1"
                url={item.image}
                alt={item.description}
                width={item.image_width}
                height={item.image_width} // To make the square
                source={item.source}
                type={item.type}
                itemWidth={80.656}
                showOverlayInfo={false}
                isUsedInSwiper={false}
              />
            </div>
          );
        });
      }
    }

    return (
      <>
        <SearchForm
          viewAll={viewAll}
          type="Brandfetch"
          signalToken={this.signal.token}
          autoFocus={true}
        />
        <hr className="tldr-hr" />
        <TldrLicenseAgreementText
          text="By using logos from Brandfetch you agree to its license."
          redirectTo={BRANDFETCH_LICENSE_AGREEMENT}
        />
        {brandElement}
      </>
    );
  }

  componentDidMount() {
    // Do nothing
  }

  componentWillUnmount() {
    this.signal.cancel("The user aborted a request.");
  }

  closeMore = (event) => {
    this.props.resetViewAll();
    this.setState({ viewAll: false });
  };

  openMore = (event, type) => {
    this.props.resetViewAll();
    this.setState({ viewAll: true });
  };

  addBrandLogoLayer = (data) => {
    this.props.wsAddLayer(this.props.editor.activePage.id, data);
  };
}

Brandfetch.propTypes = {};

const mapStateToProps = (state) => ({
  selectedOrg: state.auth.payload.selectedOrg,
  sidebarSlider: state.sidebarSlider,
  editor: state.editor,
  errors: state.errors,
});

const mapDispatchToProps = (dispatch) => ({
  resetViewAll: () => dispatch(resetViewAll()),
  searchIconsOnBrandfetch: (searchTerm, props, signalToken) =>
    dispatch(searchIconsOnBrandfetch(searchTerm, props, signalToken)),
  wsAddLayer: (activePageId, payload) =>
    dispatch(wsAddLayer(activePageId, payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Brandfetch);
