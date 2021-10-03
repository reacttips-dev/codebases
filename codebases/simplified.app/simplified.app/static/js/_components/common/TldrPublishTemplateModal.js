import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from "axios";
import { Modal, Button, Spinner } from "react-bootstrap";
import { fetchCategories } from "../../_actions/storiesActions";
import Select from "react-select";
import { categoryOptionsStyle } from "../styled/details/stylesSelect";
import { StyledPublishTemplateModalBody } from "../styled/styles";
import TldrTagsInput from "./TldrTagsInput";
import EditableLabel from "./EditableLabel";
import { isEmpty } from "lodash";

class TldrPublishTemplateModal extends Component {
  signal = axios.CancelToken.source();

  constructor(props) {
    super(props);

    this.state = {
      selectedCategory: {},
      templateName: props.templateName,
      tags: [],
      formErrors: { name: "", tags: "", category: "" },
      nameValid: false,
      tagsValid: false,
      categoryValid: false,
      formValid: false,
    };
  }

  componentDidMount() {
    this.props.fetchCategories(this.props, this.signal.token);
    this.validateFields("name", this.state.templateName);
  }

  render() {
    const { show, onHide, onYes, inprogress, templateName } = this.props;
    const { formValid } = this.state;

    let categoryOptions = [];
    this.props.navbar.payload &&
      this.props.navbar.payload.results &&
      this.props.navbar.payload.results.forEach((cat) => {
        var data = {
          ...cat,
          value: cat.title.toLowerCase(),
          label: cat.title,
        };
        categoryOptions.push(data);
      });

    return (
      <Modal show={show} onHide={onHide} centered size="lg" backdrop="static">
        <Modal.Header>
          <Modal.Title>Publish your template.</Modal.Title>
        </Modal.Header>

        <hr className="modal-hr" />

        <StyledPublishTemplateModalBody>
          <div className="mb-3">
            <p className="mb-1">Template Name</p>
            <EditableLabel
              text={templateName}
              labelClassName="templatetitlename"
              inputClassName="templatetitleinput"
              onFocus={(text) => this.handleFocus(text)}
              onFocusOut={(text) => this.handleFocusOut(text)}
              showIcon={true}
              inputMaxLength={50}
              labelPlaceHolder="Give a name to your template."
            />
            <div className="mt-1 mb-1 error">{this.state.formErrors.name}</div>
          </div>

          <div className="mb-3">
            <p className="mb-1">Tags</p>
            <TldrTagsInput
              as="input"
              applyTags={(tags) => this.applyTags(tags)}
            />
            <div className="mt-1 mb-1 error">{this.state.formErrors.tags}</div>
          </div>

          <div>
            <p className="mb-1">Category</p>
            <Select
              options={categoryOptions}
              onChange={(selected) => this.selectCategory(selected)}
              styles={categoryOptionsStyle}
              isMulti
            />
          </div>
          <div className="mt-1 mb-1 error">
            {this.state.formErrors.category}
          </div>
        </StyledPublishTemplateModalBody>

        <hr className="modal-hr" />

        <Modal.Footer>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onHide();
            }}
            variant="outline-warning"
            disabled={inprogress === "true" ? true : false}
          >
            Cancel
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onYes(
                this.state.templateName,
                this.state.tags,
                this.state.selectedCategory
              );
            }}
            variant="warning"
            disabled={!formValid}
          >
            {inprogress === "true" && (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
                <span className="sr-only">Publishing...</span>
              </>
            )}
            {inprogress === "false" && "Publish"}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  selectCategory = (selected) => {
    this.setState(
      {
        ...this.state,
        selectedCategory: selected,
      },
      () => this.validateFields("category", selected)
    );
  };

  applyTags = (tags) => {
    this.setState(
      {
        ...this.state,
        tags: tags,
      },
      () => this.validateFields("tags", tags)
    );
  };

  handleFocus = (text) => {};

  handleFocusOut = (text) => {
    this.setState(
      {
        ...this.state,
        templateName: text,
      },
      () => this.validateFields("name", text)
    );
  };

  validateFields = (fieldName, value) => {
    let fieldValidationErrors = this.state.formErrors;
    let nameValid = this.state.nameValid;
    let tagsValid = this.state.tagsValid;
    let categoryValid = this.state.categoryValid;

    switch (fieldName) {
      case "name":
        nameValid = value.length > 0;
        fieldValidationErrors.name = nameValid
          ? ""
          : "Please enter name for your template.";
        break;
      case "tags":
        tagsValid = value.length > 0;
        fieldValidationErrors.tags = tagsValid
          ? ""
          : "Please give atleast one tag.";
        break;
      case "category":
        categoryValid = !isEmpty(value);
        fieldValidationErrors.category = categoryValid
          ? ""
          : "Please select a category.";
        break;
      default:
        break;
    }

    this.setState(
      {
        formErrors: fieldValidationErrors,
        nameValid: nameValid,
        tagsValid: tagsValid,
        categoryValid: categoryValid,
      },
      this.validateForm
    );
  };

  validateForm = () => {
    this.setState({
      formValid:
        this.state.nameValid &&
        this.state.tagsValid &&
        this.state.categoryValid,
    });
  };
}

TldrPublishTemplateModal.propTypes = {
  fetchCategories: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  navbar: state.navbar,
});

const mapDispatchToProps = (dispatch) => ({
  fetchCategories: (props, signalToken) =>
    dispatch(fetchCategories(props, signalToken)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TldrPublishTemplateModal);
