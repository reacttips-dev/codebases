import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import * as C from './constants';

import {observer} from 'mobx-react';

import ToolBuilder from '../shared/tool_builder.jsx';

export default
@observer
class OnboardingToolSelection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      popularTools: [],
      searchedTools: [],
      lastRequest: 0,
      requestTimeout: undefined,
      searchResults: [],
      showResults: false,
      searchResultIndex: -1,
      newToolName: null,
      toolSearchInputText: ''
    };

    // render bindings
    this.onChange = this.onChange.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
    this.dropDownSelectTool = this.dropDownSelectTool.bind(this);
    this.getOptions = this.getOptions.bind(this);
    this.removeTool = this.removeTool.bind(this);
    this.isToolSelected = this.isToolSelected.bind(this);
    this.searchResultClass = this.searchResultClass.bind(this);
    this.resetToolName = this.resetToolName.bind(this);
  }

  componentDidMount() {
    $.get('/api/v1/services/popular_services', response => {
      this.setState({popularTools: response});
    });
    this.context.navStore.backRoute = `${C.ONBOARDING_BASE_PATH}/stack-info`;
  }

  resetToolName() {
    this.setState({newToolName: null});
  }

  addTool(tool) {
    this.context.globalStore.addSelectedTool(tool);
    this.setState({searchResults: [], toolSearchInputText: ''});
  }
  removeTool(tool) {
    this.context.globalStore.removeSelectedTool(tool);
    this.forceUpdate();
  }

  componentWillUnmount() {
    clearTimeout(this._blurTimeout);
  }

  dropDownSelectTool(val) {
    this.addSelectedTool(val.value);
  }

  getOptions(input) {
    return fetch('/api/v1/services/search?q=' + input)
      .then(response => {
        return response.json();
      })
      .then(json => {
        let options = [];
        for (let i in json) {
          let tool = json[i];
          options.push({value: tool, label: tool.name});
        }
        return {options: options};
      });
  }

  shouldSendRequest() {
    return new Date().getTime() - this.state.lastRequest > 2000;
  }

  // handle form input changes
  onChange(event) {
    event = event.nativeEvent;

    this.setState({[event.target.name]: event.target.value});
    clearTimeout(this.state.requestTimeout);

    if (event.target.value !== '') {
      this.setState({
        requestTimeout: setTimeout(() => {
          $.get('/api/v1/services/search', {q: event.target.value}, data => {
            data = data || [];
            this.setState({searchResults: data, requestTimeout: undefined, searchResultIndex: -1});
          });
        }, 1000),
        searchResults: []
      });
    } else {
      this.setState({requestTimeout: undefined, searchResults: [], searchResultIndex: -1});
    }
  }

  onContinue() {
    trackEvent('stack.create.toolsList.submit');

    browserHistory.push(`${C.ONBOARDING_BASE_PATH}/tool-details`);
  }

  onKeyPress(event) {
    event = event.nativeEvent;
    if (event.key === 'ArrowDown') {
      this.setState({
        searchResultIndex: Math.min(
          this.state.searchResultIndex + 1,
          this.state.searchResults.length
        )
      });
    } else if (event.key === 'ArrowUp') {
      this.setState({searchResultIndex: Math.max(this.state.searchResultIndex - 1, 0)});
    } else if (event.key === 'Enter' && this.state.searchResultIndex > -1) {
      this.addTool(this.state.searchResults[this.state.searchResultIndex]);
    } else if (event.key === 'Escape') {
      this.setState({searchResultIndex: -1});
    }
  }

  searchResultClass(tool) {
    if (this.state.searchResultIndex === this.state.searchResults.indexOf(tool)) return 'active';
    return '';
  }

  isToolSelected(tool) {
    return (
      this.context.globalStore.selectedTools.findIndex(t => {
        return t.id === tool.id;
      }) !== -1
    );
  }

  render() {
    return (
      <div className="onboarding__tool-selection">
        <h1>Build Your Stack</h1>
        <p className="subheader">Search for or select the tools & services you use in this stack</p>
        <br />
        <ToolBuilder canCreateTools={true} multiline={false} placeholder="Search & add tools" />
        <div className="submit-links-container tools-selection-continue-container">
          <div className="submit-links">
            {this.context.globalStore.selectedTools.length > 0 && (
              <button className="btn btn-ss-alt btn-lg" onClick={this.onContinue}>
                Continue
              </button>
            )}
          </div>
        </div>
        <div className="onboarding__tool-selection__popular-tools">
          <h3>Popular Tools</h3>
          {this.state.popularTools.map(tool => {
            if (
              this.context.globalStore.selectedTools.findIndex(t => {
                return t.id === tool.id;
              }) === -1
            ) {
              return (
                <div
                  key={`toolselection-tool-${tool.id}`}
                  className="onboarding__tool-selection__tool hint--top"
                  data-hint={tool.name}
                  onClick={() => this.addTool(tool)}
                >
                  <img src={tool.image_url} />
                </div>
              );
            } else {
              return (
                <div
                  key={`toolselection-tool-${tool.id}`}
                  className="onboarding__tool-selection__tool remove hint--top"
                  data-hint={tool.name}
                  onClick={() => this.removeTool(tool)}
                >
                  <img src={tool.image_url} />
                </div>
              );
            }
          })}
          {this.state.popularTools.length === 0 && (
            <img src={C.IMG_SPINNER} className="onboarding__tool-selection__loading" />
          )}
        </div>
      </div>
    );
  }
}

OnboardingToolSelection.contextTypes = {
  routerProps: PropTypes.object,
  globalStore: PropTypes.object,
  navStore: PropTypes.object
};
