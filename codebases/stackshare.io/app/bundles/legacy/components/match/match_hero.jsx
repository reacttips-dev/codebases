import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import * as C from './constants';

import ToolBuilder from '../shared/tool_builder.jsx';
import MatchHeroSearch from './match_hero_search.jsx';
import MatchHeroLocation from './match_hero_location.jsx';
import MatchSaveButton from './match_save_button.jsx';
import MatchAndOrToggle from './match_and_or_toggle.jsx';

export default
@observer
class MatchHero extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="match__builder-hero">
        <h2>Stack Match</h2>
        <p>Find jobs that match your tech stack</p>
        <div className="match__builder-hero__jobsites">
          <img alt="Jobsites" src={C.IMG_JOBSITES} />
        </div>
        <div className="match__builder-hero__input-wrapper">
          <div className="match__builder-hero__row-1">
            <div className="match__builder-hero__row-1__selected-tools">
              <h6>TOOLS TO INCLUDE</h6>
              <ToolBuilder
                multiline={false}
                selectedToolsField="selectedTools"
                placeholder="Add tools"
                appendedChild={<MatchAndOrToggle />}
              />
            </div>
            <div className="match__builder-hero__row-1__excluded-tools">
              <h6>TOOLS TO EXCLUDE</h6>
              <ToolBuilder
                selectedToolsField="excludedTools"
                addFunction={this.context.globalStore.addExcludedTool}
                removeFunction={this.context.globalStore.removeExcludedTool}
                placeholder="Exclude tools"
              />
            </div>
          </div>
          <div className="match__builder-hero__row-2">
            <MatchHeroSearch />
            <MatchHeroLocation />
          </div>
          <MatchSaveButton />
        </div>
      </div>
    );
  }
}

MatchHero.contextTypes = {
  globalStore: PropTypes.object
};
