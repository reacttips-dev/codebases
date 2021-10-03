import React, { Component } from "react";
import { connect } from "react-redux";
import SearchForm from "../../../common/SearchForm";
import { resetViewAll } from "../../../../_actions/sidebarSliderActions";
import axios from "axios";
import TemplatesCategoryViewAll from "./TemplatesCategoryViewAll";

class MyTemplates extends Component {
  signal = axios.CancelToken.source();
  constructor(props) {
    super(props);
    this.state = {
      viewAll: true,
    };
  }

  render() {
    const { viewAll, type } = this.state;
    const { selectedOrg, templateType } = this.props;

    return (
      <>
        <SearchForm
          viewAll={viewAll}
          type={type}
          signalToken={this.signal.token}
          org={selectedOrg}
          templateType={templateType}
          autoFocus={true}
        />
        <hr className="tldr-hr" />

        <TemplatesCategoryViewAll
          org={selectedOrg}
          isMyElement={true}
          title={templateType}
          closeMore={this.closeMore}
          templateType={templateType}
          viewAll={false}
          formatFilter={false}
        />
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
}

MyTemplates.propTypes = {};

const mapStateToProps = (state) => ({
  selectedOrg: state.auth.payload.selectedOrg,
});

const mapDispatchToProps = (dispatch) => ({
  resetViewAll: () => dispatch(resetViewAll()),
});

export default connect(mapStateToProps, mapDispatchToProps)(MyTemplates);
