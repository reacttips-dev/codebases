import {observable} from 'mobx';
import algoliasearch from 'algoliasearch';
import * as C from '../constants';
import {Savable, Saved} from '../constants';

export default class GlobalStore {
  @observable searching = false;
  @observable jobSearch = '';
  @observable location = '';
  @observable searchOperator = 'AND';
  @observable selectedTools = [];
  @observable excludedTools = [];
  @observable fullTime = false;
  @observable freelance = false;
  @observable remote = false;
  @observable saveState = Savable;
  @observable userId = null;
  @observable userName = null;
  @observable showGetJobAlerts = true;
  @observable showPostAJob = true;
  @observable showTwitterFollow = true;
  @observable jobAlertMatchPercentage = null;
  @observable jobAlertEmailFrequency = null;
  @observable popularTools = [];

  // New props from rewrite.
  @observable matchedCompany = [];
  @observable matchedTotalCompany = 0;
  @observable matchedJob = [];
  @observable matchedTotalJob = 0;
  @observable visibleIndex = 'Job';
  @observable jobPage = 0;
  @observable companyPage = 0;

  defaultTools = ['react', 'nodejs'];

  constructor(props) {
    this.client = algoliasearch(window._ALGOLIA_ID, window._ALGOLIA_API_KEY);
    this.companyIndex = this.client.initIndex(window._MATCH_COMPANIES_INDEX);
    this.jobIndex = this.client.initIndex(window._MATCH_JOBS_INDEX);

    this.routerProps = props.routerProps;
    if (props.routerProps) {
      this.userId = this.routerProps.userId;
      this.userName = this.routerProps.userName;
      this.jobAlertMatchPercentage = this.routerProps.jobAlertMatchPercentage;
      this.jobAlertEmailFrequency = this.routerProps.jobAlertEmailFrequency;
    }

    this.popularTools = [];
    this.analyzeUrl();
    /* $.get('/api/v1/services/popular_services', {limit: 500}, response => {
      if (response) {
        this.popularTools = response
        this.analyzeUrl()
      }
    }) */

    $(document).on('builder.tool.added', () => {
      this.search();
    });
    $(document).on('builder.tool.removed', () => {
      this.search();
    });
    $(document).on('builder.tool.operatorChanged', () => {
      this.search();
    });
  }

  analyzeUrl() {
    // load from path
    let pathSegments = location.pathname.split('/');
    if (pathSegments.length > 2) {
      this.slug = pathSegments[pathSegments.length - 1];
      this.addDefaultTools([this.slug]);
      setTimeout(() => {
        this.search();
      });
      return;
    }
    // load from params
    this.params = location.search.substr(1).split('&');
    if (
      this.params.find(p => {
        return p.split('=')[0] === 'selectedTools';
      })
    ) {
      this.deserializeFromUrl();
      return;
    }
    // load from job stack
    if (this.userId) {
      $.get('/api/v1/match/saved_search', response => {
        this.location = response.location || '';
        this.jobSearch = response.keywords || '';
        this.fullTime = response.full_time;
        this.remote = response.remote;
        this.freelance = response.freelance;
        this.searchOperator = response.match_exact === true ? 'AND' : 'OR';
      });

      $.get('/api/v1/match/job_stack', response => {
        if (response.excluded_services.length > 0) {
          this.excludedTools = [];
          for (let tool of response.excluded_services)
            this.addExcludedTool(tool, {serialize: false});
        }

        if (response.included_services.length > 0) {
          this.selectedTools = [];
          for (let tool of response.included_services)
            this.addSelectedTool(tool, {serialize: false});
        }

        this.saveState = Saved;
        this.search();

        if (response.included_services.length === 0 && response.excluded_services.length === 0) {
          this.addDefaultTools();
          this.search();
        }
      });
    } else {
      this.addDefaultTools();
      this.search();
    }
  }

  deserializeFromUrl() {
    let query = {};

    for (let i = 0; i < this.params.length; i++) {
      let b = this.params[i].split('=');
      query[decodeURIComponent(b[0])] = decodeURIComponent(b[1] || '');
    }

    if (query.selectedTools) {
      $.get(
        '/services/find_all_by_actual_slug',
        {slugs: query.selectedTools.replace(/--/g, ',')},
        response => {
          if (response instanceof Array) this.selectedTools = [];
          for (let tool of response) this.addSelectedTool(tool, {serialize: false});
          setTimeout(() => {
            this.search();
          });
        }
      );
    }

    if (query.excludedTools) {
      $.get(
        '/services/find_all_by_actual_slug',
        {slugs: query.excludedTools.replace(/--/g, ',')},
        response => {
          if (response instanceof Array) this.excludedTools = [];
          for (let tool of response) this.addExcludedTool(tool, {serialize: false});
          setTimeout(() => {
            this.search();
          });
        }
      );
    }

    if (query.fullTime) this.fullTime = query.fullTime === 'true';
    if (query.freelance) this.freelance = query.freelance === 'true';
    if (query.remote) this.remote = query.remote === 'true';
    if (query.jobSearch) this.jobSearch = query.jobSearch;
    if (query.location) this.location = query.location;
    if (query.searchOperator) this.searchOperator = query.searchOperator;
  }

  serializeToUrl() {
    let tools = this.selectedTools
      .map(t => {
        return t.slug;
      })
      .join('--');
    let excludedTools = this.excludedTools
      .map(t => {
        return t.slug;
      })
      .join('--');
    let obj = {
      selectedTools: tools,
      excludedTools: excludedTools,
      location: this.location,
      jobSearch: this.jobSearch,
      searchOperator: this.searchOperator
    };
    let str = [];
    for (let p in obj)
      if (obj.hasOwnProperty(p) && obj[p]) {
        str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
      }
    let urlPath = `${C.BASE_PATH}?${str.join('&')}`;
    window.history.replaceState({}, '', urlPath);
  }

  addDefaultTools(tools = this.defaultTools, recursed = false) {
    this.selectedTools = [];
    tools.forEach(item => {
      let regex = new RegExp(`^${item}$`, 'i');
      let tool = this.popularTools.find(t => {
        return regex.test(t.slug);
      });
      if (tool) this.addSelectedTool(tool, {serialize: false});
      else
        $.get('/services/find_all_by_actual_slug', {slugs: item}, response => {
          if (response instanceof Array && response.length > 0) {
            for (let t of response) this.addSelectedTool(t, {serialize: false});
            this.search();
            return;
          } else if (!recursed) this.addDefaultTools(this.defaultTools, true);
        });
    });
    this.search();
  }

  searchPopularTools(query) {
    if (query === '') return [];
    let regex = new RegExp(query.replace(' ', '.*\\s.*'), 'i');
    return this.popularTools.filter(t => {
      return regex.test(t.name);
    });
  }

  addSelectedTool(tool, opts = {}) {
    opts = Object.assign({serialize: true}, opts);
    if (tool.required === undefined) tool.required = true;
    if (
      this.selectedTools.findIndex(t => {
        return t.id === tool.id;
      }) === -1
    )
      this.selectedTools.push(tool);
    if (opts.serialize) this.serializeToUrl();
    this.removeExcludedTool(tool);
  }
  removeSelectedTool(tool) {
    let toolIndex = this.selectedTools.findIndex(t => {
      return t.id === tool.id;
    });
    if (toolIndex !== -1) this.selectedTools.splice(toolIndex, 1);
    this.serializeToUrl();
  }

  filterToolsBasedOnPackage(tools) {
    if (!tools || !tools[0]) {
      return tools;
    }

    if (this.showPackage) {
      return tools.map(tool => ({...tool, hidden: false}));
    }

    const calculatedTools = tools.map(tool => {
      if (tool.just_added) {
        return {
          ...tool,
          hidden: false
        };
      }

      if (tool.is_package) {
        return {
          ...tool,
          hidden: true
        };
      }

      return {
        ...tool,
        hidden: false
      };
    });

    return calculatedTools;
  }

  addExcludedTool(tool) {
    if (
      this.excludedTools.findIndex(t => {
        return t.id === tool.id;
      }) === -1
    )
      this.excludedTools.push(tool);
    this.removeSelectedTool(tool);
  }
  removeExcludedTool(tool) {
    let toolIndex = this.excludedTools.findIndex(t => {
      return t.id === tool.id;
    });
    if (toolIndex !== -1) this.excludedTools.splice(toolIndex, 1);
    this.serializeToUrl();
  }

  updateSelectedTool(tool) {
    tool.required = !!tool.required;
    let toolIndex = this.selectedTools.findIndex(t => {
      return t.id === tool.id;
    });
    if (toolIndex !== -1) this.selectedTools[toolIndex] = tool;
  }

  // Increases the page for the visible index and performs a search for
  // the it, appending results to the right array.
  loadMore(indexName) {
    this[indexName.toLowerCase() + 'Page'] = this[indexName.toLowerCase() + 'Page'] + 1;
    this[indexName.toLowerCase() + 'Index'].search(
      `${this.jobSearch} ${this.location}`,
      {
        facets: '*',
        filters: this.filters(),
        attributesToRetrieve: '*',
        typoTolerance: 'false',
        hitsPerPage: 20,
        page: this[indexName.toLowerCase() + 'Page']
      },
      (error, content) => {
        this['matchedTotal' + indexName] = content.nbHits;
        for (let hit of content.hits) {
          this['matched' + indexName].push(hit);
        }
        $(document).trigger('match.search.done');
      }
    );
  }

  // Starts a new search in Algolia using the selected tools. It also resets
  // the page for both indexes to 0. See the loadMore() function to see how
  // loading more results works.
  search() {
    this.companyPage = 0;
    this.jobPage = 0;
    this.searching = true;

    if (this.selectedTools.length === 0 && this.excludedTools.length === 0) {
      this.matchedCompany = [];
      this.matchedTotalCompany = 0;
      this.matchedJob = [];
      this.matchedTotalJob = 0;
      $(document).trigger('match.search.done');
      this.searching = false;
      return;
    }

    this.companyIndex.search(
      `${this.jobSearch} ${this.location}`,
      {
        facets: '*',
        filters: this.filters(),
        attributesToRetrieve: '*',
        typoTolerance: 'false',
        hitsPerPage: 20,
        page: this.companyPage
      },
      (error, content) => {
        this.matchedTotalCompany = content.nbHits;
        this.matchedCompany = content.hits;
      }
    );

    this.jobIndex.search(
      `${this.jobSearch} ${this.location}`,
      {
        facets: '*',
        filters: this.filters(),
        attributesToRetrieve: '*',
        typoTolerance: 'false',
        hitsPerPage: 20,
        page: this.jobPage
      },
      (error, content) => {
        this.matchedTotalJob = content.nbHits;
        this.matchedJob = content.hits;
        trackEvent('match.search-results-job', {
          total: content.nbHits,
          selectedToolCount: this.selectedTools.length,
          location: this.location,
          keywords: this.jobSearch
        });
      }
    );

    $(document).trigger('match.search.done');
    this.searching = false;
  }

  filters() {
    let toolFilters = this.selectedTools
      .map(t => {
        return `stack.name:"${t.name}"`;
      })
      .join(` ${this.searchOperator} `);
    if (this.excludedTools.length > 0) {
      if (toolFilters === '') {
        toolFilters +=
          'NOT ' +
          this.excludedTools
            .map(t => {
              return `stack.name:"${t.name}"`;
            })
            .join(' AND NOT ');
      } else {
        toolFilters +=
          ' AND (NOT ' +
          this.excludedTools
            .map(t => {
              return `stack.name:"${t.name}"`;
            })
            .join(' AND NOT ') +
          ')';
      }
    }
    return toolFilters;
  }

  saveSelectedTools() {
    if (!this.routerProps.userId) {
      $(document).trigger('match.sign-in');
      $(document).trigger('match.selected-tools-saved');
      return;
    }

    let tools = this.selectedTools.map(t => {
      return {id: t.id, required: !!t.required};
    });
    let excludedTools = this.excludedTools.map(t => {
      return {id: t.id, required: !!t.required};
    });
    $.ajax({
      url: '/api/v1/match/save_job_stack',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({job_stack: {services: tools, excluded_services: excludedTools}}),
      success: () => {
        $(document).trigger('match.selected-tools-saved');
        this.saveState = Saved;
      }
    });
    this.saveSearch();
  }

  saveSearch() {
    let payload = {
      keywords: this.jobSearch,
      location: this.location,
      full_time: this.fullTime,
      freelance: this.freelance,
      remote: this.remote,
      match_exact: this.searchOperator === 'OR' ? false : true
    };
    $.ajax({
      url: '/api/v1/match/save_search',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({search: payload})
    });
  }
}
