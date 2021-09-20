import { computed, observable, action, transaction } from 'mobx';
import { WORKSPACE } from '../../js/constants/ViewHierarchyConstants';
import NavigationService from '../../js/services/NavigationService';
import { RegistryService } from './RegistryService';
import PageMetadataService from '../../js/services/PageMetadataService';
import BasePageController from '../pages/BasePageController';
import PerformanceTelemetryService from '../../js/services/PerformanceTelemetryService';
import ClientFoundationTelemetryConfig from '../telemetry/config/config';

const activePageUpdateTransition = new Event('activePageUpdateTransition');

class PageServiceClass {
  @observable activePage = '';
  @observable _activeView = null;
  @observable _activeController = null;
  @observable loader = false;
  _activeTransition = '';
  defaultPageConfig;

  _pageRegistry = new RegistryService()
  _controllerCache = new Map();

  register = (pageConfig) => {
    if (!pageConfig) {
      return;
    }

    this._pageRegistry.register(pageConfig.name, pageConfig);

    let handler = (routeParams, queryParams, transition) => {
      if (this.activePage && this.activePageController) {
        /* Metatags are created or added to every page separately on certain logic and depends upon the squads,
        * we do not have default meta tags for pages which are not having meta tags implemented by respective squads.
        * since we are using SPA we update the DOM everytime someone would want to add a meta tag to the given page.
        * But when the route changes, the meta tag remain in the dom, since react would be updating the body and not
        * the head tag where we had added meta tags in the previous page. In order to give the next route a clean slate
        * without any previous page meta tag we are calling the below method, before we initiate the next page route.
        * This removes all the page meta tags from the previous page before redirecting into the new route.
        * */
        this.activePageController._clearPageMetaTags();
      }
      return this.switchPage(pageConfig.name, { routeParams, queryParams, additionalContext: _.get(transition, 'options.additionalContext'), pageConfig });
    };

    NavigationService.register(pageConfig.name, pageConfig.route, handler, null, WORKSPACE, pageConfig.aliases);
  }

  @action
  _setActive (activePage) {
    if (!activePage) {
      return;
    }

    // Setting the active page
    this.activePage = activePage;

    // Emitting an event on the active page update subject
    window.dispatchEvent(activePageUpdateTransition);
  }

  @action
  async switchPage (activePage, options = {}) {
    if (!activePage || (pm.isScratchpad && !options.pageConfig.isEnabledInScratchpad)) {
      return Promise.resolve();
    }

    if (!this._controllerCache.has(activePage)) {
      await this.initializeController(activePage, options);
    }

    // Get the controller for the active page
    let controller = this._controllerCache.get(activePage);

    PageMetadataService.setPageTitle(controller.getTitle());
    PageMetadataService.setPageDescription(controller.getPageDescription());
    PageMetadataService.resetMetaTagFor404Page();
    PageMetadataService.removeCanonicalPageTag();

    // To trigger the didDeactivate hook we need to check the following things
    // 1. Check if the activePageName currently exists and this is not the first ever navigation
    // 2. The active page being switched should not be equal to the currently active page
    // 3. If there is a switch already going on and switchPage is triggered again before
    // the previous one is finished we need to make sure the newer one and the one in transition
    // are not same before triggering didDeactivate hook. Otherwise we will end up triggering this
    // multiple times.
    //
    // For example: On navigating from home page to a workspace, switchPage is triggered twice in parallel.
    // Once as a normal trigger and second time due to navigation to overview route but it does not wait for the
    // previous one to complete.
    // This might result in calling the previous page's didDeactivate(in this case home page) twice.

    if (this.activePageName && activePage !== this.activePageName && (!this._activeTransition || activePage !== this._activeTransition)) {
      try {
        this.activePageController && this.activePageController.didDeactivate &&
          this.activePageController.didDeactivate();

      } catch (e) {
        pm.logger.warn('PageService: Error while calling didDeactivate hook' + e);
      }
    }

    // Set the transition state to active page;
    this._setActiveTransition(activePage);

    // If the controller is present and has a didActivate function, we call
    // the didActivate and wait for it to finish before setting the active page
    if (controller && controller.didActivate) {
      // This is done to wrap return values from didActivate hooks in a promise
      // because not all controllers might return a promise
      return Promise.resolve()
        .then(() => {
          return controller.didActivate(options);
        })
        .then(async () => {
          let view = await this.getView(activePage, options);
          transaction(async () => {
            this.setActiveController(controller);
            this.setActiveView(view);
            this.setLoader(false);
            return this._setActive(activePage);
          });
        })
        .then(() => {
          // didActivate hook is already triggered and we have also updated active page at this moment
          // we can safely make transitioning as empty.
          // Make sure the active transition is equal to the one being set and another
          // parallel transition did not take place at the same time. If it did we should not
          // clear this value
          if (this._activeTransition === activePage) {
            this._clearActiveTransition();
          }
          if (!this.sentFirstLoadMetrics) {
            PerformanceTelemetryService.addMarker(ClientFoundationTelemetryConfig.INITIAL_TAB_LOAD_TIME);
            this.sentFirstLoadMetrics = true;
          }
        })
        .catch((e) => {
          // Error ocurred while transitioning the active page and hence we clear the transition state to empty
          // Make sure the active transition is equal to the one being set and another
          // parallel transition did not take place at the same time. If it did we should not
          // clear this value
          if (this._activeTransition === activePage) {
            this._clearActiveTransition();
          }
          pm.logger.warn('PageService: Error while switching page to ' + activePage, e);

          return Promise.reject(e);
        });
    }

    let view = await this.getView(activePage, options);
    transaction(async () => {
      this.setActiveView(view);
      this.setLoader(false);
      return this._setActive(activePage);
    });
    return Promise.resolve();
  }

  @computed
  get activePageName () {
    let config = this.getConfig(this.activePage);

    return config && config.name;
  }

  @computed
  get activePageView () {
    return this._activeView;
  }

  @computed
  get activePageHeader () {
    return this.activePageController && this.activePageController.header;
  }

  @computed
  get activePageController () {
    return this._activeController;
  }

  @action
  _setActiveTransition (activePage) {
    this._activeTransition = activePage;
  }

  @action
  _clearActiveTransition () {
    this._activeTransition = '';
  }

  @action
  setActiveView (view) {
    this._activeView = view;
  }

  @action
  setLoader (loader) {
    this.loader = loader;
  }

  @action
  setActiveController (controller) {
    this._activeController = controller;
  }

  async getView (key, options) {
    if (!key) {
      return;
    }

    let view = null;

    let config = this.getConfig(key);
    if (!config) {
      return;
    }

    if (config.view) {
      view = config.view;
    }
    else if (config.getView) {
      view = await config.getView();
      view = view.default;
    }

    this._viewCache && this._viewCache.set(key, view);

    return view;
  }

  async initializeController (key, options) {
    if (!key) {
      return;
    }

    let config = this.getConfig(key);

    if (!config) {
      return;
    }

    let controllerInstance = null;
    if (config.controller) {
      let Controller = config.controller;
      controllerInstance = new Controller();
    }
    else if (config.getController) {
      let Controller = await config.getController();
      Controller = Controller.default;
      controllerInstance = new Controller();
    }
    else {
      controllerInstance = new BasePageController();
    }


    try {
      this._controllerCache.set(key, controllerInstance);
      controllerInstance.setHeader(config.header);
      controllerInstance.didCreate && controllerInstance.didCreate(options);
      controllerInstance.setTitle(config.title);
      controllerInstance.setPageDescription(config.description);
    }
    catch (e) {
      pm.logger.warn('PageService: There was an error in the didCreate lifecycle of ' + key);
    }
  }

  getConfig (key) {
    return this._pageRegistry.resolve(key);
  }

  getViewFor (key) {
    let config = this.getConfig(key);
    return config && config.view;
  }

}

let PageService = new PageServiceClass();
export { PageService };

