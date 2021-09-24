import {computed, observable, observe} from 'mobx';
import {browserHistory} from 'react-router';
import * as C from '../stack-edit_constants';
import {Saving, Savable, Saved, NotFound} from '../stack-edit_constants';

export default class GlobalStore {
  @observable
  stackInfo = {
    id: null,
    slug: null,
    name: '',
    description: '',
    website_url: '',
    private: false,
    image_url: '',
    path: ''
  };
  @observable
  newCompany = {
    id: null,
    name: '',
    website_url: '',
    description: '',
    angellist_url: '',
    email_address: '',
    twitter_username: '',
    image_url: '',
    type: 'Company'
  };
  @observable selectedTools = [];
  @observable showPackage = false;
  @observable stackOwner;
  @observable possibleOwners = [];
  @observable ownerIndex = 0;
  @observable saveState = Saved;
  @computed
  get stackOwnerId() {
    return this.stackOwner === 'newcompany' ? this.newCompany.id : this.stackOwner;
  }
  @computed
  get owner() {
    if (this.ownerIndex < this.possibleOwners.length && this.ownerIndex >= 0)
      return this.possibleOwners[this.ownerIndex] || {};
    else return {};
  }

  constructor(props) {
    this.possibleOwners.push({
      id: props.routerProps.userId,
      image_url: props.routerProps.userImg,
      name: props.routerProps.userName,
      type: 'User'
    });

    observe(this.newCompany, () => {
      this.saveState = Savable;
    });

    this.saveStack = this.saveStack.bind(this);

    get('/api/v1/companies/index').then(response => {
      for (let org of response.data) this.addPossibleOwner(org);
      this.possibleOwners.push(this.newCompany);
    });
  }

  toggleShowPackages() {
    this.showPackage = !this.showPackage;
    if (this.showPackage) {
      this.selectedTools = this.selectedTools
        .map(tool => {
          if (tool.just_added) tool.just_added = false;
          return tool;
        })
        .filter(tool => tool.just_added !== false);
    }
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

  addSelectedTool(tool) {
    if (!tool.reasons) tool.reasons = [];
    else tool.reasons = tool.reasons.slice(0, 5);
    let toolIndex = this.selectedTools.findIndex(t => {
      return t.id === tool.id;
    });
    if (toolIndex === -1) {
      this.selectedTools[this.selectedTools.length] = tool;
    } else {
      this.selectedTools[toolIndex] = Object.assign(this.selectedTools[toolIndex], tool);
    }
    this.saveState = Savable;
  }

  removeSelectedTool(tool) {
    let toolIndex = this.selectedTools.findIndex(t => {
      return t.id === tool.id;
    });
    if (toolIndex !== -1) this.selectedTools.splice(toolIndex, 1);
    this.saveState = Savable;
  }
  addPossibleOwner(owner) {
    let ownerIndex = this.possibleOwners.findIndex(o => {
      return o.id === owner.id && o.type === owner.type;
    });
    if (ownerIndex === -1) {
      this.possibleOwners.push(owner);
      ownerIndex = this.possibleOwners.length - 1;
    }
    return ownerIndex;
  }
  setOwner(owner) {
    this.stackOwner = this.possibleOwners.find(o => o.id === owner.id && o.type === owner.type);
    return (this.ownerIndex = this.possibleOwners.findIndex(o => {
      return o.id === owner.id && o.type === owner.type;
    }));
  }

  toolImage(tool) {
    if (tool && tool.image_url) return tool.image_url;
    else return C.IMG_NO_IMG_TOOL;
  }

  setSlugs(ownerSlug, stackSlug) {
    this.ownerSlug = ownerSlug;
    this.stackSlug = stackSlug;
    $.get('/api/v1/stacks/edit', {stack: {slug: stackSlug, owner: {slug: ownerSlug}}}, response => {
      this.stackInfo = {
        id: response.id || '',
        slug: response.slug || '',
        name: response.name || '',
        type: response.type,
        private: response.private,
        description: response.description || '',
        website_url: response.website_url || '',
        path: response.path || '',
        current_user_admin: !!response.current_user_admin,
        current_user_private: !!response.current_user_private,
        image_url: ''
        // image_url:   (response.image_url   || '') // uploadcare is giving problems
      };

      this.selectedTools = [];
      for (let tool of response.services) this.addSelectedTool(tool, false);
      this.ownerIndex = this.addPossibleOwner(response.owner);
      this.stackOwner = this.possibleOwners.find(
        o => o.id === response.owner.id && o.type === response.owner.type
      );
      $(document).trigger('stack-edit.stack.loaded');
      this.saveState = Saved;
    }).fail(error => {
      if (error.status === 404) this.stackInfo.id = NotFound;
    });
  }

  saveNewCompany(callback) {
    this.saveState = Saving;
    let payload = {
      company: {
        name: this.newCompany.name,
        website_url: this.newCompany.website_url,
        description: this.newCompany.description,
        angellist_url: this.newCompany.angellist_url,
        email_address: this.newCompany.email_address,
        twitter_username: this.newCompany.twitter_username,
        image_url: this.newCompany.image_url
      }
    };

    if (this.newCompany.id === 0 || this.newCompany.id === null) {
      $.post('/api/v1/companies/create', payload, response => {
        this.newCompany.id = response;
        this.saveState = Saved;
        callback && callback();
      });
    } else {
      payload.company.id = this.newCompany.id;
      $.post('/api/v1/companies/update', payload, response => {
        this.newCompany.id = response;
        this.saveState = Saved;
        callback && callback();
      });
    }
  }

  saveStack(callback) {
    this.saveState = Saving;
    let payload = {
      id: this.stackInfo.id,
      name: this.stackInfo.name,
      description: this.stackInfo.description,
      website_url: this.stackInfo.website_url,
      private: this.stackInfo.private,
      owner: this.possibleOwners[this.ownerIndex],
      services: this.selectedTools.map(t => {
        return t.id;
      })
    };

    if (this.stackInfo.image_url) payload.image_url = this.stackInfo.image_url;

    $.post('/api/v1/stacks/update', {stack: payload}, response => {
      this.selectedTools = [];
      for (let tool of response.services) this.addSelectedTool(tool);

      browserHistory.replace(
        `${C.BASE_PATH}/${response.owner.slug}/${response.slug}/${
          location.pathname.split('/').slice(-1)[0]
        }`
      );

      this.ownerSlug = response.owner.slug;
      this.stackSlug = response.slug;
      this.saveState = Saved;
      callback && callback();
    });
  }

  save() {
    if (this.saveState === Saving) return;

    if (this.owner === this.newCompany) this.saveNewCompany(this.saveStack);
    else this.saveStack();
  }
}
