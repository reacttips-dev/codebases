import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import * as C from './constants';
import BuilderStore from './stores/builder-store';
import IncompleteTool from './incomplete_tool.jsx';
import {Savable, Saved} from './constants';

let builderStore;

// Triggered events
// [builder.tools.added] when tool is added
// [builder.tools.removed] when tool is removed

export default
@observer
class ToolBuilder extends Component {
  constructor(props) {
    super(props);

    // set defaults
    this.opts = Object.assign(
      {
        selectedToolsField: 'selectedTools',
        appendedChild: null
      },
      props
    );

    this.state = {
      searchResults: [],
      searchInput: '',
      querying: false,
      selectedIndex: -1,
      timeouts: {},
      resultsSelector: 'mouse',
      multiline: !!this.props.multiline,
      newToolName: null,
      left: '',
      removeUnapproved: this.props.removeUnapproved || false
    };

    this.toolsMouseDown = false;
  }

  componentDidMount() {
    builderStore = new BuilderStore(this.context.globalStore, {
      defaultTools: this.opts.defaultTools,
      selectedToolsField: this.opts.selectedToolsField
    });

    //console.log('TOOL BUILDER DID MOUNT', this.context.globalStore);

    this.opts.addFunction = (
      this.props.addFunction || this.context.globalStore.addSelectedTool
    ).bind(this.context.globalStore);
    this.opts.removeFunction = (
      this.props.removeFunction || this.context.globalStore.removeSelectedTool
    ).bind(this.context.globalStore);

    document.addEventListener('resize', this.updateDimensions);

    document.addEventListener('keydown', this.handleKeydown);
    document.addEventListener('match.selected-tools-saved', this.selectedToolsSaved);

    // for tools dragability
    document.addEventListener('mouseup', this.onToolsMouseUp);
    document.addEventListener('mousemove', e => {
      if (this.toolsMouseDown) {
        this.onToolsMouseMove(e);
      }
    });

    document.addEventListener('builder.popularTools.loaded', () => {
      this.search();
    });
    document.addEventListener('builder.multiline.set', this.eventSetMultiline);

    // remove sliding class after every transitionend
    this.refs.builder.addEventListener(
      'transitionend',
      () => {
        $(this.refs.builder).removeClass('sliding');
      },
      false
    );

    this.updateDimensions();
    this.updateToolBar();
    this.slide(-this.refs.builder.offsetWidth - 1000);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeydown);
    document.removeEventListener('mouseup', this.onToolsMouseUp);
    document.removeEventListener('builder.multiline.set', this.eventSetMultiline);
    document.removeEventListener('resize', this.updateDimensions);
  }

  componentWillReact() {
    this.updateToolBar();
  }

  getElementClassName = selector => {
    const baseClassName = this.props.baseClassName;

    if (!baseClassName) {
      return '';
    }

    return `${baseClassName}__${selector}`;
  };

  onToolsMouseUp = () => {
    this.toolsMouseDown = false;
  };

  updateDimensions = () => {
    // If the props for multiline was passed as true, it should
    // always be true, skip this width check.
    if (this.props.multiline === true) {
      return;
    }
    let multiline = innerWidth < 700;
    if (this.state.multiline !== multiline) this.setState({multiline});
  };

  eventSetMultiline = (e, data) => {
    this.setState({multiline: data.state});
  };

  // document keydown events
  handleKeydown = e => {
    if (e.key === 'm' && e.ctrlKey) {
      this.setState({multiline: !this.state.multiline});
      this.updateToolBar();
    }
  };

  onToolsMouseDown = e => {
    this.toolsMouseDown = true;
    this.toolsMouseDownX = e.pageX - parseInt(this.refs.builder.style.left) || 0;
  };
  onToolsMouseMove = e => {
    let upperLimit = -(this.refs.builder.offsetWidth - this.refs.sliderWrap.clientWidth);
    if (this.toolsMouseDown) {
      this.refs.builder.style.left =
        Math.max(Math.min(e.pageX - this.toolsMouseDownX, 0), upperLimit) + 'px';
      e.preventDefault();
    }
  };

  resetToolName = () => {
    this.setState({newToolName: null});
  };

  setMouseActive = () => {
    this.setState({resultsSelector: 'mouse'});
  };

  toggleToolRequired = tool => {
    tool.required = !tool.required;
    this.forceUpdate();
    this.context.globalStore.saveSelectedTools();
  };
  selectedToolsSaved = () => {
    if (this.context.globalStore.saveState) this.context.globalStore.saveState = Saved;
  };

  clearSearchResults = () => {
    clearTimeout(this.state.timeouts.searchTimeout);
    this.setState({
      searchResults: [],
      searchInput: '',
      querying: false,
      selectedIndex: -1
    });

    this.refs.searchInput.focus();
  };

  updateToolBar() {
    let overflowed = this.refs.sliderWrap.clientWidth < this.refs.builder.offsetWidth;
    if (overflowed) $(this.refs.sliderWrap).addClass('overflowed');
    else $(this.refs.sliderWrap).removeClass('overflowed');
  }

  addSearchResult = tool => {
    let toolIndex = this.state.searchResults.findIndex(t => {
      return t.id === tool.id;
    });
    if (toolIndex === -1 && this.state.searchInput !== '') this.state.searchResults.push(tool);
  };

  slide(dx) {
    let upperLimit = this.refs.builder.offsetWidth - this.refs.sliderWrap.clientWidth;
    let x = Math.min(Math.max(dx, -upperLimit), 0);
    $(this.refs.builder).addClass('sliding');
    this.setState({left: `${x}px`});
  }

  searchChange = e => {
    clearTimeout(this.state.timeouts.searchTimeout);

    // if this is not coming from a triggered event
    if (e.target.value === '') {
      this.clearSearchResults();
      return;
    }

    this.setState({searchInput: e.target.value});
    this.search(e.target.value);
  };

  search = (query = this.state.searchInput) => {
    if (!query || query === '') return;

    this.setState({
      searchResults: builderStore.searchPopularTools(query),
      querying: true
    });

    this.setState({
      timeouts: Object.assign(this.state.timeouts, {
        searchTimeout: setTimeout(() => {
          // search algolia here
          this.client = algoliasearch(window._ALGOLIA_ID, window._ALGOLIA_API_KEY);
          this.index = this.client.initIndex(window._SERVICES_INDEX);

          this.index.search(
            this.state.searchInput,
            {
              facets: '*',
              attributesToRetrieve: '*',
              typoTolerance: 'false',
              hitsPerPage: 20
            },
            (error, content) => {
              if (content.nbHits !== 0) {
                for (let hit of content.hits) {
                  // console.log(hit);
                  this.addSearchResult(hit);
                }
              }
              this.setState({querying: false});
            }
          );
        }, 500)
      })
    });
  };

  searchKeyDown = e => {
    let resultWindow, resultHeight;

    let goDown = () => {
      if (this.state.selectedIndex >= this.state.searchResults.length - 1) return;
      this.setState({selectedIndex: this.state.selectedIndex + 1});
      resultWindow = $('.match__builder-wrap__search-results');
      resultHeight = $('.match__builder-wrap__search-results li')
        .eq(0)
        .outerHeight();
      if (resultHeight * (this.state.selectedIndex + 2) > resultWindow.outerHeight())
        resultWindow.scrollTop(
          resultHeight * (this.state.selectedIndex + 2) - resultWindow.outerHeight()
        );
      this.setState({resultsSelector: 'keyboard'});
    };
    let goUp = () => {
      if (this.state.selectedIndex <= -1) return;
      this.setState({selectedIndex: this.state.selectedIndex - 1});
      resultWindow = $('.match__builder-wrap__search-results');
      resultHeight = $('.match__builder-wrap__search-results li')
        .eq(0)
        .outerHeight();
      if (resultHeight * (this.state.selectedIndex - 1) < resultWindow.scrollTop())
        resultWindow.scrollTop(resultHeight * (this.state.selectedIndex - 1));
      this.setState({resultsSelector: 'keyboard'});
    };

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        goDown();
        break;
      case 'ArrowUp':
        e.preventDefault();
        goUp();
        break;
      case 'p':
        if (e.ctrlKey) {
          e.preventDefault();
          goUp();
        }
        break;
      case 'n':
        if (e.ctrlKey) {
          e.preventDefault();
          goDown();
        }
        break;
      case 'Enter':
        if (this.state.selectedIndex !== -1)
          this.addSelectedTool(this.state.searchResults[this.state.selectedIndex]);
        break;
      case 'Backspace':
        if (
          this.context.globalStore[this.opts.selectedToolsField].length > 0 &&
          this.state.searchInput.length === 0
        ) {
          let tools = this.context.globalStore[this.opts.selectedToolsField];

          if (this.context.globalStore.showPackage) {
            tools = this.context.globalStore
              .filterToolsBasedOnPackage(tools)
              .filter(tool => !tool.hidden);
          }

          this.removeSelectedTool(tools[tools.length - 1]);
        }
        break;
      case 'Escape':
        this.clearSearchResults();
        break;
    }
  };

  addSelectedTool = tool => {
    this.opts.addFunction(tool);
    this.clearSearchResults();
    setTimeout(() => {
      this.updateToolBar();
      this.context.globalStore.saveState = Savable;
      this.slide(-this.refs.builder.offsetWidth - 1000);
    });
    setTimeout(() => {
      $(document).trigger('builder.tool.added');
    }, 300);
  };
  removeSelectedTool = tool => {
    this.opts.removeFunction(tool);
    setTimeout(() => {
      this.updateToolBar();
      this.context.globalStore.saveState = Savable;
      this.setState({saveState: Savable});
    });
    setTimeout(() => {
      $(document).trigger('builder.tool.removed');
    }, 300);
  };

  focusInput = e => {
    if (!$(e.target).hasClass('builder-wrap__tool')) {
      $("input[name='servicesSearchInput']").focus();
    }
  };

  render() {
    let searchResults = this.state.searchResults.map((tool, index) => {
      if (tool.is_approved || !this.state.removeUnapproved) {
        return (
          <li
            key={`search-result-${tool.id}`}
            onClick={() => this.addSelectedTool(tool)}
            onMouseEnter={this.setMouseActive}
            className={this.state.selectedIndex === index ? 'selected' : undefined}
          >
            <img src={C.defaultImage(tool.image_url)} />
            {tool.name}
            {tool.is_approved === 0 && (
              <span
                style={{
                  marginLeft: '15px',
                  padding: '2px 11px',
                  color: 'white',
                  borderRadius: '.25em',
                  backgroundColor: 'rgb(206, 206, 206)',
                  fontSize: '10px'
                }}
              >
                Unapproved
              </span>
            )}
          </li>
        );
      }
    });

    if (
      this.props.canCreateTools &&
      !this.state.querying &&
      this.state.searchInput &&
      this.state.searchResults.length === 0
    )
      searchResults.unshift(<li className="no-result">No results found</li>);

    let input = (
      <input
        placeholder={this.props.placeholder}
        onChange={this.searchChange}
        onKeyDown={this.searchKeyDown}
        name={this.props.selectedToolsField || 'servicesSearchInput'}
        value={this.state.searchInput}
        ref="searchInput"
        className={this.getElementClassName('input')}
      />
    );

    return (
      <div
        onClick={this.focusInput}
        className={[
          `builder-wrap${this.state.multiline ? ' multiline' : ''}`,
          this.getElementClassName('list')
        ].join(' ')}
      >
        <div className="builder-wrap__slider-wrap" ref="sliderWrap">
          <ul
            className="builder-wrap__builder"
            onMouseDown={this.onToolsMouseDown}
            ref="builder"
            style={{left: this.state.left}}
          >
            {this.context.globalStore
              .filterToolsBasedOnPackage(this.context.globalStore[this.opts.selectedToolsField])
              .filter(tool => !tool.hidden)
              .map(tool => {
                return (
                  <li
                    key={`builder-tool-${tool.id}`}
                    className={this.getElementClassName('list__item')}
                  >
                    <img src={tool.image_url} />
                    <span>{tool.name}</span>
                    <div
                      className="builder-wrap__tool"
                      onClick={() => this.removeSelectedTool(tool)}
                    />
                    <div className={`hint--right--hide`} data-hint={'Required'}>
                      <div
                        className={`pulse pulse-animation${tool.required ? '' : ' not-required'}`}
                        onClick={() => this.toggleToolRequired(tool)}
                      />
                      <span className="after-required" />
                    </div>
                  </li>
                );
              })}
          </ul>
          {this.state.multiline && input}
          {this.state.multiline && this.props.appendedChild}
        </div>
        {this.state.newToolName !== null && (
          <IncompleteTool name={this.state.newToolName} resetToolName={this.resetToolName} />
        )}
        <div className="builder-wrap__slider-arrows">
          <div
            className="slider-back"
            onClick={() => this.slide((parseInt(this.refs.builder.style.left) || 0) + 200)}
          />
          <div
            className="slider-forward"
            onClick={() => this.slide((parseInt(this.refs.builder.style.left) || 0) - 200)}
          />
        </div>
        {!this.state.multiline && input}
        {!this.state.multiline && this.props.appendedChild}
        {(searchResults.length > 0 || this.state.querying) && (
          <div>
            <div className="react-invisible-overlay" onClick={this.clearSearchResults} />
            <ul className={`builder-wrap__search-results ${this.state.resultsSelector}`}>
              {searchResults}
              {this.state.querying && (
                <div className="loading">
                  <span>Searching...</span>
                  <img src="https://img.stackshare.io/fe/spinner.svg" />
                </div>
              )}
            </ul>
          </div>
        )}
      </div>
    );
  }
}

ToolBuilder.contextTypes = {
  globalStore: PropTypes.object
};

ToolBuilder.propTypes = {
  baseClassName: PropTypes.string, // Allows styling components from custom scss file (search for this.getElementClassName)
  multiline: PropTypes.bool, // Allows tools to be displayed on more than one line. (default: false)
  removeUnapproved: PropTypes.bool,
  addFunction: PropTypes.func, // Function called to add a tool
  removeFunction: PropTypes.func, // Function called to remove a tool
  canCreateTools: PropTypes.bool, // Set ability to create missing tools (default: false)
  placeholder: PropTypes.string, // Input placeholder text (default: '')
  selectedToolsField: PropTypes.string // Field that holds selected tools in the globalStore (default: 'selectedTools')
};
