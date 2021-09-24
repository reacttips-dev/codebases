import React, {Component} from 'react';
import Percentage from '../shared/percentage.jsx';

export default class StackShowPercentage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <a href={decodeURIComponent(this.props.click_path)} className="no-underline">
        {this.props.has_job_stack && <div className="percentage-label">Your job stack is a</div>}
        <Percentage percent={this.props.percent} has_job_stack={this.props.has_job_stack} />
        <div className="percent-container__cta">
          {this.props.has_job_stack && (
            <span className="btn btn-ss btn-ss-alt btn-xs">
              View {this.props.company_name}&apos;s Jobs
            </span>
          )}
          {!this.props.has_job_stack && (
            <span className="btn btn-ss btn-ss-alt btn-xs">Add your stack</span>
          )}
          {!this.props.has_job_stack && (
            <div className="cta-label">
              See if you&apos;re a match for {this.props.company_name}&apos;s Jobs
            </div>
          )}
        </div>
      </a>
    );
  }
}
