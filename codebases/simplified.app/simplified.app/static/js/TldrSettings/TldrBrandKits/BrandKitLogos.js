import React, { Component } from "react";
import PropTypes from "prop-types";
import TLDRImage from "../../_components/common/TLDRImage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { connect } from "react-redux";
import { deleteUserAssets } from "../../_actions/sidebarSliderActions";

class BrandKitLogos extends Component {
  signal = axios.CancelToken.source();

  constructor(props) {
    super(props);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);

    this.state = {
      isHovering: false,
    };
  }

  handleMouseEnter() {
    this.setState({
      isHovering: true,
    });
  }

  handleMouseLeave() {
    this.setState({
      isHovering: false,
    });
  }

  render() {
    const { logoInfo } = this.props;
    return (
      <>
        <div
          className="thumbnail"
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
        >
          <div className="placeholder">
            <TLDRImage src={logoInfo.thumbnail} width={200} />
          </div>

          {this.state.isHovering && (
            <div className="actions" onClick={this.deleteBrandKitLogo}>
              <FontAwesomeIcon icon="trash" />
            </div>
          )}
        </div>
      </>
    );
  }

  deleteBrandKitLogo = () => {
    const { logoInfo } = this.props;
    const extraProps = {
      type: "brandAsset",
      id: logoInfo.id,
    };
    this.props.delete(extraProps, this.signal.token);
  };
}

BrandKitLogos.propTypes = {
  delete: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
  delete: (props, token) => dispatch(deleteUserAssets(props, token)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BrandKitLogos);
