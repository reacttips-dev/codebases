import {observable, computed, observe, intercept, action} from 'mobx';
import {browserHistory} from 'react-router';
import {ONBOARDING_BASE_PATH, IMG_NO_IMG, IMG_NO_IMG_TOOL} from '../constants';

export default class GlobalState {
  @observable scanned = false;
  @observable selectedTools = [];
  @observable companies = [];
  @observable stackOwner = undefined;
  @observable
  stackInfo = {
    name: '',
    description: '',
    url: '',
    image_url: '',
    website_url: '',
    private: false
  };
  @observable
  newCompany = {
    id: undefined,
    name: '',
    website_url: '',
    description: '',
    angellist_url: '',
    email_address: '',
    twitter_username: '',
    image_url: ''
  };

  @action clearForm = path => {
    switch (path) {
      case '/create-stack/new-company':
        this.newCompany = {
          id: undefined,
          name: '',
          website_url: '',
          description: '',
          angellist_url: '',
          email_address: '',
          twitter_username: '',
          image_url: ''
        };
        break;
      case '/create-stack/stack-info':
        this.stackInfo = {
          name: '',
          description: '',
          url: '',
          image_url: '',
          website_url: '',
          private: false
        };
        break;
      case '/create-stack/tool-selection':
        this.selectedTools = [];
        break;
    }
  };

  constructor(props) {
    this.userId = props.routerProps.userId;
    this.routerProps = props.routerProps;

    observe(this.selectedTools, () => {
      setTimeout(() => {
        $(document).trigger('onboarding.calcSlideHeights');
      }); // wait for data to propagate :/
    });

    intercept(this.selectedTools, change => {
      if (change.type === 'splice' && change.added.length === 1) {
        let found = change.object.find(i => {
          return i.id === change.added[0].id;
        });
        if (found) {
          change.object[change.object.indexOf(found)] = change.added[0];
          return null;
        }
      }
      return change;
    });
  }

  saveToLocalStorage() {
    localStorage.setItem(`${this.userId}-onboarding-globalStore`, JSON.stringify(this));
  }

  addSelectedTool(tool) {
    if (!tool.reasons) tool.reasons = [];
    let toolIndex = this.selectedTools.findIndex(t => {
      return t.id === tool.id;
    });
    if (toolIndex === -1) this.selectedTools[this.selectedTools.length] = tool;
    else {
      this.selectedTools[toolIndex] = Object.assign(this.selectedTools[toolIndex], tool);
    }
  }
  removeSelectedTool(tool) {
    let toolIndex = this.selectedTools.findIndex(t => {
      return t.id === tool.id;
    });
    if (toolIndex !== -1) this.selectedTools.splice(toolIndex, 1);
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

  addCompany(company) {
    let companyIndex = this.companies.findIndex(c => {
      return c.id === company.id;
    });
    if (companyIndex === -1) this.companies[this.companies.length] = company;
    else this.companies[companyIndex] = Object.assign(this.companies[companyIndex], company);
  }

  @computed
  get ownerImage() {
    if (this.stackOwner === 'personal') return this.routerProps.userImg;
    if (this.stackOwner === 'newcompany') return this.newCompany.image_url;
    if (Number.isInteger(this.stackOwner)) {
      let company = this.companies.find(c => {
        return c.id === this.stackOwner;
      });
      if (company) return company.image_url || IMG_NO_IMG;
    }
    return IMG_NO_IMG;
  }
  @computed
  get ownerName() {
    if (this.stackOwner === 'personal') return this.routerProps.userName;
    if (this.stackOwner === 'newcompany') return this.newCompany.name;
    if (Number.isInteger(this.stackOwner)) {
      let company = this.companies.find(c => {
        return c.id === this.stackOwner;
      });
      if (company) return company.name;
    }
    return '';
  }

  toolImage(tool) {
    if (tool && tool.image_url) return tool.image_url;
    else return IMG_NO_IMG_TOOL;
  }

  saveStack() {
    let company = {id: 0};

    if (this.stackOwner === 'newcompany') company.id = this.newCompany.id;
    else if (Number.isInteger(this.stackOwner))
      company = this.companies.find(c => {
        return c.id === this.stackOwner;
      });

    if (!this.stackInfo.name || this.stackInfo.name === '') {
      browserHistory.push(`${ONBOARDING_BASE_PATH}/stack-info`);
      $(document).trigger('errorMsg', 'Your stack needs a name before submitting.');
    }

    $.post(
      '/api/v1/stacks/create',
      {
        stack: {
          name: this.stackInfo.name,
          website_url: this.stackInfo.website_url,
          description: this.stackInfo.description,
          private: this.stackInfo.private,
          image_url: this.stackInfo.image_url,
          services: this.selectedTools.map(t => {
            return t.id;
          }),
          owner: {
            type: company.id ? 'Company' : 'User',
            id: company.id
          }
        }
      },
      response => {
        browserHistory.push(`${ONBOARDING_BASE_PATH}/scan`);
        window.location = response.redirect;
      }
    ).fail(() => {
      $(document).trigger('errorMsg', 'An error occurred saving your stack.');
    });
  }
}
