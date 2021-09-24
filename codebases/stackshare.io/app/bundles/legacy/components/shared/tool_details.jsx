import PropTypes from 'prop-types';
import React, {Component} from 'react';
import * as C from './constants';
import {observer} from 'mobx-react';

import ReasonUpvote from './reason_upvote.jsx';

const TOOL_WIDTH = 320;

export default
@observer
class ToolDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      toolsWidth: 'auto',
      sliderLeft: 0
    };

    // event binding
    this.handleResize = this.handleResize.bind(this);
    this.nextTools = this.nextTools.bind(this);
    this.prevTools = this.prevTools.bind(this);
  }

  componentDidMount() {
    addEventListener('resize', this.handleResize);
    this.calculateToolWidth();
  }

  componentWillUnmount() {
    removeEventListener('resize', this.handleResize);
  }

  handleResize() {
    this.calculateToolWidth();
  }

  calculateToolWidth() {
    let containerWidth = $('.onboarding__details').width();
    let toolsWidth = Math.max(TOOL_WIDTH * Math.floor(containerWidth / TOOL_WIDTH), TOOL_WIDTH);

    this.setState({toolsWidth: toolsWidth});
  }

  nextTools() {
    let sliderTools = this.context.globalStore.selectedTools.filter(t => {
      return t.reasons.length > 0;
    });
    let maxLeft = -(sliderTools.length * TOOL_WIDTH) + this.state.toolsWidth;
    this.setState({sliderLeft: Math.max(this.state.sliderLeft - this.state.toolsWidth, maxLeft)});
  }
  prevTools() {
    this.setState({sliderLeft: Math.min(this.state.sliderLeft + this.state.toolsWidth, 0)});
  }

  render() {
    let tools = this.context.globalStore.selectedTools
      .map(tool => {
        if (tool.reasons.length > 0) {
          return (
            <div key={`details-tool-${tool.id}`} className="onboarding__details__tool">
              <div className="step-cont service-logo">
                <img src={tool.image_url} width={50} height={50} />
                <h3>{tool.name}</h3>
                {tool.reasons.slice(0, 5).map(reason => {
                  return <ReasonUpvote key={`toolreason-${reason.id}`} reason={reason} />;
                })}
              </div>
            </div>
          );
        } else {
          return null;
        }
      })
      .filter(n => {
        return n;
      });

    return (
      <div className="onboarding__details">
        <h1>Vote For Tools</h1>
        <p className="subheader">Vote for why you use the tools in your stack</p>
        <br />
        <div
          className="onboarding__details__arrow onboarding__details__arrow--left"
          onClick={this.prevTools}
        />
        <div
          className="onboarding__details__arrow onboarding__details__arrow--right"
          onClick={this.nextTools}
        />
        <div className="onboarding__details__tools" style={{width: this.state.toolsWidth}}>
          <div className="onboarding__details__tool-slider" style={{left: this.state.sliderLeft}}>
            {tools}
          </div>
          {tools.length === 0 && (
            <img src={C.IMG_SPINNER} className="onboarding__details__loading" />
          )}
        </div>
      </div>
    );
  }
}

ToolDetails.contextTypes = {
  routerProps: PropTypes.object,
  globalStore: PropTypes.object,
  navStore: PropTypes.object
};
