import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import Percentage from './../shared/percentage.jsx';
import MatchMoreTools from './match_more_tools.jsx';

export default
@observer
class MatchCompany extends Component {
  refineMatchResultsByTag = (tag, e) => {
    e.stopPropagation();
    let jobSearch = this.context.globalStore.jobSearch;
    if (!jobSearch.includes(tag)) {
      jobSearch = jobSearch.length === 0 ? tag : `${jobSearch} ${tag}`;
      this.context.globalStore.jobSearch = jobSearch;
      trackEvent('match.keyword-search', {
        keywords: this.context.globalStore.jobSearch,
        location: this.context.globalStore.location,
        source: 'keywords'
      });
      this.context.globalStore.serializeToUrl();
      this.context.globalStore.search();
    }
  };

  matchedTools = () => {
    let matchedToolCount = 0;
    let result = this.context.globalStore.selectedTools.map(item => {
      if (this.props.company.stack.find(i => i.id === item.id)) {
        matchedToolCount += 1;
        return (
          <a
            key={`match-company-${this.props.company.id}-item-${item.id}`}
            className="hint--top tools-link"
            data-align="left"
            data-hint={item.name}
            href={item.canonical_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img className="tools-img" src={item.image_url} />
          </a>
        );
      }
    });

    if (this.props.company.stack.length - matchedToolCount === 0) return result;

    result.push(
      <div
        key={`match-company-more-tools-${this.props.company.id}`}
        className="more-tools__container"
      >
        <a
          className="matched-tools-more hint--top"
          data-align="left"
          data-hint="See more"
          href={this.props.company.company_url}
        >
          +{this.props.company.stack.length - matchedToolCount} more tools
        </a>
        <MatchMoreTools
          tools={this.props.company.stack}
          matchedTools={this.context.globalStore.selectedTools}
          parentId={this.props.company.id}
        />
      </div>
    );
    return result;
  };

  matchPercentage = () => {
    if (this.context.globalStore.selectedTools.length === 0) {
      return 1;
    }

    let matched = this.context.globalStore.selectedTools.filter(selectedTool => {
      return this.props.company.stack.some(stackTool => selectedTool.id === stackTool.id);
    }).length;

    return (matched / this.context.globalStore.selectedTools.length) * 100;
  };

  description = () => {
    if (this.props.company.description) {
      return _(this.props.company.description).truncate(320);
    } else {
      return <p style={{fontStyle: 'italic', color: '#aaa'}}>No company description.</p>;
    }
  };

  render() {
    return (
      <div
        className="match__match-container"
        id={`company-${this.props.company.id}`}
        style={{containerHeight: 'auto'}}
      >
        <div className="match__match-container__summary" style={{paddingBottom: 0}}>
          <div className="row">
            <div className="col-md-1 col-sm-1 col-xs-3" id="match-percent">
              <Percentage percent={this.matchPercentage()} fill={true} />
            </div>
            <div className="col-md-1 col-sm-1 col-xs-3">
              <div className="match__match-container__summary__company-image">
                {this.props.company.image_url ? (
                  <img src={this.props.company.image_url} />
                ) : (
                  <span className="glyphicon glyphicon-align-justify no-co-img" />
                )}
              </div>
            </div>
            <div className="col-md-5 col-sm-5 col-xs-6" style={{padding: 0 + 'px'}}>
              <div className="match__match-container__summary__job-title">
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`${this.props.company.company_url}#jobs`}
                >
                  {this.props.company.name}
                  {this.props.company.verified && (
                    <span
                      className="hint--right"
                      data-hint={`Tech Stack Verified by ${this.props.company.name}`}
                      data-align="left"
                    >
                      <div className="fa fa-check-circle" />
                    </span>
                  )}
                </a>
              </div>
            </div>
            <div className="col-md-2 col-sm-2 col-xs-12">
              <div className="match__match-container__summary__location">
                {this.props.company.city && (
                  <div>
                    <i className="fa fa-map-marker" aria-hidden="true" />
                    &nbsp;&nbsp;
                    {this.props.company.city}
                  </div>
                )}
              </div>
            </div>

            <div className="col-md-2 col-sm-3 col-xs-12">
              <div className="match__match-container__summary__actions">
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`${this.props.company.company_url}#jobs`}
                  style={{margin: 0, marginLeft: 5 + 'px', float: 'right'}}
                  className="match__job-info__btn m-r0"
                >
                  View Jobs
                </a>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-11 col-md-offset-1 col-sm-offset-0 col-sm-12 col-xs-offset-0 col-xs-12">
              <p className="tag-list">
                {this.props.company.tag_list &&
                  this.props.company.tag_list.map((tag, i) => {
                    return (
                      <span
                        key={`match-company-tag-${this.props.company.id}-${i}`}
                        onClick={e => this.refineMatchResultsByTag(tag, e)}
                      >
                        {tag}
                      </span>
                    );
                  })}
              </p>
            </div>
          </div>
        </div>
        <div className="match__job-info-wrapper" style={{padding: 15 + 'px'}}>
          <div className="row" style={{padding: '0 10px', marginBottom: 15 + 'px'}}>
            <div className="col-md-7 col-md-offset-1">{this.description()}</div>
            <div className="col-md-4 team">
              {this.props.company.team && this.props.company.team.length > 0 && (
                <p className="team-title">Team</p>
              )}
              {this.props.company.team &&
                this.props.company.team.map(user => {
                  return (
                    <a
                      key={`match-company-user${user.id}`}
                      className="user hint--top"
                      data-align="left"
                      data-hint={user.username}
                      href={`/${user.slug}`}
                    >
                      <img src={user.image_url} />
                    </a>
                  );
                })}
            </div>
          </div>

          <div className="row" style={{padding: '0 10px'}}>
            <div className="col-md-7 col-md-offset-1">
              <div
                className="panel-body match__job-info"
                style={{padding: 0, paddingTop: 20 + 'px'}}
              >
                {this.matchedTools()}
              </div>
            </div>
            <div className="col-md-2">
              <a
                style={{margin: 0}}
                target="_blank"
                rel="noopener noreferrer"
                href={`${this.props.company.company_url}#jobs`}
              >
                <b>{this.props.company.job_count}</b> Jobs listed
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

MatchCompany.contextTypes = {
  globalStore: PropTypes.object
};
