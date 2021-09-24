import React, {Component} from 'react';
import {observer} from 'mobx-react';
import Store from './store.js';

import Header from './components/header.jsx';
import ServiceList from './components/service_list.jsx';
import Form from './components/form.jsx';

export default
@observer
class SoftApprovalContainer extends Component {
  constructor(props) {
    super(props);
    this.store = new Store({props});
  }

  toggleFormVisibility = service => {
    if (service === this.store.selectedTool) {
      if (this.store.openedForm === false) {
        this.store.openedForm = true;
      } else {
        this.store.openedForm = false;
      }
    } else {
      if (this.store.openedForm === false) {
        this.store.openedForm = true;
      }
    }
  };

  updateImageForService = (id, image_url) => {
    let index = this.store.nonSubmittedTools.findIndex(t => {
      return t.id === id;
    });
    this.store.nonSubmittedTools[index]['image_url'] = image_url;
  };

  markToolAsSubmitted = () => {
    let tool = this.store.selectedTool;

    // Add the selected tool to the pendingApprovalTools.
    this.store.pendingApprovalTools.push(tool);

    // Remove it from the nonSubmittedTools.
    let toolIndex = this.store.nonSubmittedTools.findIndex(t => {
      return t.id === tool.id;
    });
    if (toolIndex !== -1) {
      this.store.nonSubmittedTools.splice(toolIndex, 1);
    }

    // Remove this selectedTool since it's submitted.
    this.store.selectedTool = undefined;
  };

  onServiceClick = service => {
    this.toggleFormVisibility(service);
    this.store.selectedTool = service;
  };

  handleFormChange = (name, value) => {
    this.store.selectedTool[name] = value;
  };

  onFormSubmit = e => {
    // console.log("Saving:", this.store.selectedTool)
    e.preventDefault();

    let id = this.store.selectedTool.id;
    let params = {
      name: this.store.selectedTool.name,
      title: this.store.selectedTool.title,
      image_url: this.store.selectedTool.image_url,
      description: this.store.selectedTool.description,
      twitter_username: this.store.selectedTool.twitter_username,
      features: this.store.selectedTool.features
    };
    this.store.submissionInProgress = true;
    $.post('/api/v1/services/submit_soft_approval', {id: id, service: params}, response => {
      this.updateImageForService(response.id, response.image_url);
      this.markToolAsSubmitted();
      this.store.openedForm = false;
      this.store.submissionInProgress = false;
    });
  };

  render() {
    return (
      <div className="approval_container">
        <Header />
        <ServiceList
          nonSubmittedTools={this.store.nonSubmittedTools}
          pendingApprovalTools={this.store.pendingApprovalTools}
          selectedToolId={this.store.selectedTool ? this.store.selectedTool.id : 0}
          onServiceClick={this.onServiceClick}
        />

        {this.store.selectedTool && (
          <Form
            submissionInProgress={this.store.submissionInProgress}
            service={this.store.selectedTool}
            opened={this.store.openedForm}
            handleFormChange={this.handleFormChange}
            onFormSubmit={this.onFormSubmit}
          />
        )}
      </div>
    );
  }
}
