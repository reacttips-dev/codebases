import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import Percentage from './../shared/percentage.jsx';
import MatchMoreTools from './match_more_tools.jsx';

export default
@observer
class MatchJob extends Component {
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
    let ids = this.props.job.stack.map(item => item.id);
    let result = this.context.globalStore.selectedTools.map(item => {
      if (ids.find(i => i === item.id)) {
        matchedToolCount += 1;
        return (
          <a
            key={`match-job-${this.props.job.id}-item-${item.id}`}
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

    if (this.props.job.stack.length - matchedToolCount === 0) return result;

    result.push(
      <div key={`match-job-more-tools${this.props.job.id}`} className="more-tools__container">
        <a className="matched-tools-more hint--top" href={`/match/jobs/${this.props.job.slug}`}>
          +{this.props.job.stack.length - matchedToolCount} more tools
        </a>
        <MatchMoreTools
          tools={this.props.job.stack}
          matchedTools={this.context.globalStore.selectedTools}
          parentId={this.props.job.id}
        />
      </div>
    );
    return result;
  };

  matchPercentage = () => {
    if (this.context.globalStore.selectedTools.length === 0) {
      return 1;
    }

    let matched = 0;
    for (let i = 0; i < this.context.globalStore.selectedTools.length; i++) {
      for (let ii = 0; ii < this.props.job.stack.length; ii++) {
        if (this.context.globalStore.selectedTools[i].id === this.props.job.stack[ii].id) {
          matched++;
          break;
        }
      }
    }

    // Multiply by 100 because our Percentage prop just needs an integer 1 to 100.
    return (matched / this.context.globalStore.selectedTools.length) * 100;
  };

  render() {
    return (
      <div
        className="match__match-container"
        id={`job-${this.props.job.id}`}
        style={{containerHeight: 'auto'}}
      >
        <div className="match__match-container__summary">
          <div className="row">
            <div className="col-md-1 col-sm-1 col-xs-3" id="match-percent">
              <Percentage percent={this.matchPercentage()} fill={true} />
            </div>
            <div className="col-md-1 col-sm-1 col-xs-3">
              <div className="match__match-container__summary__company-image">
                {this.props.job.company_image_url ? (
                  <img src={this.props.job.company_image_url} />
                ) : (
                  <span className="glyphicon glyphicon-align-justify no-co-img" />
                )}
              </div>
            </div>
            <div
              className="col-md-4 col-md-offset-0 col-sm-4 col-sm-offset-0 col-xs-11 col-xs-offset-1"
              style={{padding: 0 + 'px'}}
            >
              <div className="match__match-container__summary__job-title">
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={this.props.job.apply_url}
                  onClick={() => {
                    const {
                      company_name: companyName,
                      apply_url: jobUrl,
                      title: jobTitle,
                      city: location,
                      stack
                    } = this.props.job;
                    trackEvent('jobs_click', {
                      companyName,
                      jobUrl,
                      jobTitle,
                      location,
                      tools: stack.map(tool => tool.slug).join(',')
                    });
                  }}
                >
                  {this.props.job.title}
                  {this.props.job.verified && (
                    <span
                      className="hint--right"
                      data-hint={`Tech Stack Verified by ${this.props.job.name}`}
                      data-align="left"
                    >
                      <div className="fa fa-check-circle" />
                    </span>
                  )}
                </a>
              </div>
            </div>
            <div className="col-md-3 col-sm-3 col-xs-12">
              <div className="match__match-container__summary__location">
                {this.props.job.city && (
                  <div>
                    <i className="fa fa-map-marker" aria-hidden="true" />
                    &nbsp;&nbsp;
                    {this.props.job.city}
                  </div>
                )}
              </div>
            </div>
            <div className="col-md-3 col-sm-3 col-xs-12">
              <div className="match__match-container__summary__actions">
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={this.props.job.apply_url}
                  style={{margin: 0, marginLeft: 5 + 'px', float: 'right'}}
                  className="match__job-info__btn"
                  onClick={() => {
                    const {
                      company_name: companyName,
                      apply_url: jobUrl,
                      title: jobTitle,
                      city: location,
                      stack
                    } = this.props.job;
                    trackEvent('jobs_click', {
                      companyName,
                      jobUrl,
                      jobTitle,
                      location,
                      details: true,
                      tools: stack.map(tool => tool.slug).join(',')
                    });
                  }}
                >
                  See Details
                </a>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-11 col-md-offset-1 col-sm-offset-0 col-sm-12 col-xs-offset-0 col-xs-12">
              <p className="tag-list">
                {this.props.job.company_tag_list &&
                  this.props.job.company_tag_list.map((tag, i) => {
                    return (
                      <span
                        key={`match-job-tag-${this.props.job.id}-${i}`}
                        onClick={e => this.refineMatchResultsByTag(tag, e)}
                      >
                        {tag}
                      </span>
                    );
                  })}
              </p>
            </div>
          </div>

          <div className="row">
            <div className="col-md-11 col-md-offset-1 col-sm-offset-0 col-sm-12 col-xs-offset-0 col-xs-12">
              <div className="panel-body match__job-info">{this.matchedTools()}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

MatchJob.contextTypes = {
  globalStore: PropTypes.object
};
