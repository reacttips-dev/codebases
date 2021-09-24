import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import FormValidation from './form_validation';

export default
@observer
class IncompleteTool extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: this.props.name,
      url: '',
      saving: false
    };

    this.createTool = this.createTool.bind(this);
    this.refocus = this.refocus.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  componentDidMount() {
    this.refs.urlInput.focus();
  }

  refocus() {
    this.props.resetToolName();
  }

  onChange(e) {
    this.setState({[e.target.name]: e.target.value});
  }

  onKeyDown(e) {
    if (e.key === 'Enter') this.createTool();
    if (e.key === 'Escape') this.refocus();
  }

  createTool() {
    let urlInput = $(this.refs.urlInput);
    if (!urlInput.val().match(/.+\..+/)) {
      urlInput.addClass('error').focus();
      $(document).trigger('errorMsg', 'Invalid URL');
      return;
    }

    this.setState({saving: true});
    $.ajax({
      type: 'POST',
      url: '/api/v1/services/create',
      data: {service: {name: this.state.name, website_url: this.state.url}},
      success: response => {
        this.setState({saving: false});
        this.context.globalStore.addSelectedTool(response);
        this.props.resetToolName();
      },
      dataType: 'json'
    }).fail(error => {
      this.setState({saving: false});
      FormValidation.parseErrors(error.responseJSON);
    });
  }

  render() {
    return (
      <li className="builder-wrap__incomplete-tool builder-wrap__builder__tool-selection">
        {this.state.saving && <span>Saving...</span>}
        {!this.state.saving && (
          <div>
            <span>{this.state.name}</span>
            <div className="onboarding-overlay" onClick={this.refocus} />
            <div className="builder-wrap__incomplete-tool__popup">
              <span>New Tool</span>
              <input
                className="builder-wrap__incomplete-tool__discrete-input"
                placeholder="New tool name"
                name="name"
                value={this.state.name}
                onChange={this.onChange}
                onKeyDown={this.onKeyDown}
              />
              <input
                className="builder-wrap__incomplete-tool__url-input"
                name="url"
                ref="urlInput"
                placeholder="Website URL"
                onChange={this.onChange}
                pattern=".+\..+"
                onKeyDown={this.onKeyDown}
                required
              />
              <button onClick={this.createTool}>Add New Tool</button>
              <div className="x-corner-close-button" onClick={this.refocus} />
            </div>
          </div>
        )}
      </li>
    );
  }
}

IncompleteTool.contextTypes = {
  globalStore: PropTypes.object
};
