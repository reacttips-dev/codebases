import React, { Component } from 'react';
import { Input } from '../base/Inputs';
import XPath from '../base/XPaths/XPath';

export default class TeamDetailsUpdate extends Component {
  constructor (props) {
    super(props);

    this.state = {
      teamName: '',
      teamUrl: ''
    };

    this.handleTeamNameChange = this.handleTeamNameChange.bind(this);
    this.handleTeamUrlChange = this.handleTeamUrlChange.bind(this);
  }

  handleTeamNameChange (teamName) {
    this.setState({ teamName });
    this.props.onChange && this.props.onChange({ teamName: teamName, teamUrl: this.state.teamUrl });
  }

  handleTeamUrlChange (teamUrl) {
    this.setState({ teamUrl });
    this.props.onChange && this.props.onChange({ teamName: this.state.teamName, teamUrl: teamUrl });
  }

  render () {
    return (
      <XPath identifier='updateTeamDetails'>
        <div className='setup-team-content'>
          <span className='tab-share-content-meta-text'>{this.props.metaText}</span>
          <div className='setup-team-container'>
            <div className='left'>
              <div className='input-container'>
                <span className='input-label'>Team name</span>
                <XPath identifier='teamName'>
                  <Input
                    placeholder='Enter name of your team'
                    inputStyle='box'
                    type='text'
                    className='setup-team-input'
                    onChange={this.handleTeamNameChange}
                  />
                </XPath>
              </div>
              <div className='input-container'>
                <span className='input-label'>Team URL</span>
                <XPath identifier='teamURL'>
                  <div className='setup-team-input-container'>
                    <Input
                      placeholder='Enter a url for your team'
                      inputStyle='box'
                      type='text'
                      className='setup-team-input'
                      onChange={this.handleTeamUrlChange}
                    />
                    <div className='setup-team-input-meta-container'>
                      <span className='setup-team-input-meta'>.postman.co</span>
                    </div>
                  </div>
                </XPath>
              </div>
            </div>
            <div className='right'>
              <div className='setup-team-name-meta'>Every team needs a name</div>
              <div className='setup-team-url-meta'>This will be your team's page on the web. Team URL should have 6 or more characters. Only letters, numbers and hyphens allowed. Must start with a letter.</div>
            </div>
          </div>
        </div>
      </XPath>
    );
  }
}
