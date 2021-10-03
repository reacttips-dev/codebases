import axios from "axios";
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import SearchForm from "../../../common/SearchForm";
import { resetViewAll } from "../../../../_actions/sidebarSliderActions";
import TemplatesCategoryViewAll from "./TemplatesCategoryViewAll";
import TemplateCategories from "./TemplateCategories";

class StockTemplates extends Component {
  constructor(props) {
    super(props);

    this.signal = axios.CancelToken.source();
    this.state = {
      viewAll: false,
      templateCategory: "",
      categoryId: "",
    };
  }

  render() {
    const { viewAll, templateCategory, categoryId } = this.state;
    const { templateType, artBoardHandler } = this.props;

    return (
      <>
        <SearchForm
          viewAll={viewAll}
          templateType={templateType}
          signalToken={this.signal.token}
          cancelSignal={this.signal}
          categoryType={templateCategory}
          categoryId={categoryId}
          autoFocus={true}
        />
        <hr className="tldr-hr" />
        {viewAll ? (
          <TemplatesCategoryViewAll
            title={templateType}
            closeMore={this.closeMore}
            templateType={templateType}
            categoryType={templateCategory}
            categoryId={categoryId}
            viewAll={viewAll}
            artBoardHandler={artBoardHandler}
          />
        ) : (
          <TemplateCategories
            openMore={this.openMore}
            templateType={templateType}
            artBoardHandler={artBoardHandler}
          />
        )}
      </>
    );
  }

  componentDidMount() {}

  componentWillUnmount() {
    this.signal.cancel("The user aborted a request.");
  }

  closeMore = (event) => {
    this.props.resetViewAll();
    this.setState({
      viewAll: false,
      templateCategory: "",
      categoryId: "",
    });
  };

  openMore = (event, type, categoryId) => {
    this.props.resetViewAll();
    this.setState({
      viewAll: true,
      templateCategory: type,
      categoryId: categoryId,
    });
  };
}

StockTemplates.propTypes = {
  templateType: PropTypes.string.isRequired,
};

StockTemplates.defaultProps = {
  templateType: "post",
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
  resetViewAll: () => dispatch(resetViewAll()),
});

export default connect(mapStateToProps, mapDispatchToProps)(StockTemplates);
