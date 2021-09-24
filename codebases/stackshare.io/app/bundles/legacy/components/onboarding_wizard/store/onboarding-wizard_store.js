import {observable, computed, action} from 'mobx';
import {browserHistory} from 'react-router';

class OnboardingWizardStore {
  // Notifications
  @observable notifications = new Map();

  // Steps (legacy)
  @observable stepsCompleted = [];
  @observable currentStep = {};

  // Footer bar
  @observable ajaxInProgress = false;

  // basic-information
  @observable userImg = '';
  @observable firstName = '';
  @observable lastName = '';
  @observable companyName = '';
  @observable jobTitle = '';
  @observable weeklyDigestSubscribed = true;
  @observable emailFeedWeekly = true;
  @observable companySuggestions = [];
  @observable isCompaniesRequestLoading = false;

  // build-your-stack
  @observable services = [];
  @observable selectedTools = [];

  @observable savingState = 'Save';

  constructor(props) {
    const {user_info, redirect, oauth, tracking, image_assets} = props;
    this.icons = image_assets;
    this.redirectPath = redirect;

    // tracking
    this.tracking = tracking;

    // basic-information
    this.userId = user_info.userId;
    this.userImg = user_info.userImg || '';
    this.firstName = user_info.firstName || '';
    this.lastName = user_info.lastName || '';
    this.companyName = user_info.companyName || '';
    this.jobTitle = user_info.jobTitle || '';
    this.weeklyDigestSubscribed = !user_info.isPrivate;

    // build-your-stack
    this.services = user_info.services;
    this.oauth = oauth;

    // long flow steps =
    // 'welcome',
    // 'basic-information',
    // 'build-your-stack'
    // 'tools-voting',
    // 'next-steps'
    // short flow steps =
    // 'welcome',
    // 'basic-information',
    // 'build-your-stack'
    this.steps = [
      {slug: 'welcome'},
      {
        slug: 'build-your-stack',
        iconPath: this.icons.onboardingWrenchIconPath,
        sidebarTitle: 'Tools in your stack',
        sidebarText:
          'Tools you use, are familiar with, or want to keep up with. You can always edit this later on.'
      },
      {
        slug: 'basic-information',
        iconPath: this.icons.onboardingBasicInformationIconPath,
        sidebarTitle: 'Personal Info',
        sidebarText:
          'Fill out the information on the left. You can always edit the data under settings in your profile.'
      },
      {
        slug: 'areas-of-interest',
        iconPath: this.icons.magnifierIconPath,
        sidebarTitle: 'Interests',
        sidebarText:
          "Let us know what you're interested in. We'll use this information to customize your StackShare experience."
      }
    ];

    this.setupExperiment();
    this.setupNavigation();
    this.setupTools();
  }

  /*
  |--------------------------------------------------------------------------
  | setup
  |--------------------------------------------------------------------------
  */

  setupExperiment = () => {
    this.stepOrder = ['welcome', 'basic-information', 'build-your-stack'];
  };

  setupNavigation = () => {
    // go to slug on page load
    this.goToStepSlug(this.getSlugFromLocation(window.location));

    // set current step if navigation happened via browser buttons
    this.unlistenToHistory = browserHistory.listen(location => {
      if (location.action === 'POP') {
        this.setCurrentStep(this.getSlugFromLocation(location));
      }
    });
  };

  rescue = response => {
    this.ajaxInProgress = false;
    this.showNotification({
      type: 'error',
      message: response.data.message || 'An error occurred while saving your stack.'
    });
  };

  populateToolsFromServices = () => {
    this.services.forEach(tool => {
      this.addSelectedTool(tool, 'github');
    });
  };

  setupTools = () => {
    this.stackId = null;

    get('/api/v1/stacks/name_is_available_with_id?owner=personal&name=My%20Stack', {
      headers: {
        'Cache-Control': 'no-cache'
      }
    }).then(getResponse => {
      if (getResponse.status === 200) {
        if (getResponse.data.available) {
          // if stack doesn't exist, add services from detected tools
          this.populateToolsFromServices();
        } else {
          // if stack exists, get services via ajax
          this.stackId = getResponse.data.stack_id;
          get(`/api/v1/stacks/show?stack[id]=${this.stackId}&stack[owner][type]=User`).then(
            response => {
              if (response.status === 200) {
                this.services = response.data.services;
                this.populateToolsFromServices();
              } else {
                this.rescue(response);
              }
            }
          );
        }
      } else {
        this.rescue(getResponse);
      }
    });
  };

  /*
  |--------------------------------------------------------------------------
  | basic-information
  |--------------------------------------------------------------------------
  */

  @action
  loadSuggestions = value => {
    this.isCompaniesRequestLoading = true;
    get(`/api/v1/companies/search?q=${value}`).then(response => {
      this.isCompaniesRequestLoading = false;
      this.companySuggestions = response.data;
    });
  };

  @action
  clearCompanySuggestions = () => {
    this.companySuggestions = [];
  };

  /*
  |--------------------------------------------------------------------------
  | build-your-stack
  |--------------------------------------------------------------------------
  */

  @computed
  get selectedToolsLength() {
    return this.selectedTools.length;
  }

  addSelectedTool = (tool, source = 'search_box') => {
    if (!_.find(this.selectedTools, {id: tool.id})) {
      this.selectedTools.push(tool);

      trackEvent('onboarding.added_tool', {
        source,
        tool
      });
    }
    this.checkOverflowed();
  };

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

  removeSelectedTool = tool => {
    let toolIndex = this.selectedTools.findIndex(t => {
      return t.id === tool.id;
    });
    if (toolIndex !== -1) {
      this.selectedTools.splice(toolIndex, 1);

      trackEvent('onboarding.removed_tool', {tool});
    }
    this.checkOverflowed();
  };

  @action
  clearSelectedTools = () => {
    this.selectedTools = [];

    trackEvent('onboarding.clicked_clear_tools', {});
  };

  createStack = services => {
    this.ajaxInProgress = true;

    post('/api/v1/stacks/create', {
      body: {
        onboarding: true,
        stack: {
          name: 'My Stack',
          services,
          owner: {
            type: 'User',
            id: this.userId
          }
        }
      }
    }).then(response => {
      if (response.status === 200) {
        this.unmount();
      } else {
        this.rescue(response);
      }
    });
  };

  updateStack = (id, services) => {
    this.ajaxInProgress = true;

    post('/api/v1/stacks/update', {
      body: {
        stack: {
          id,
          services,
          owner: {
            type: 'User',
            id: this.userId
          }
        }
      }
    }).then(response => {
      if (response.status === 200) {
        this.unmount();
      } else {
        this.rescue(response);
      }
    });
  };

  @action
  saveSelectedTools = () => {
    const services = this.selectedTools.map(tool => {
      return tool.id;
    });

    if (this.stackId) {
      this.updateStack(this.stackId, services);
    } else {
      this.createStack(services);
    }
  };

  @action
  toggleFeedDigest = () => {
    this.emailFeedWeekly = !this.emailFeedWeekly;
  };

  @action
  submitFeedDigest = () => {
    if (!this.ajaxInProgress) {
      this.ajaxInProgress = true;
      this.clearNotifications();

      return new Promise((resolve, reject) => {
        post('/api/v1/onboarding/toggle_email_feed_weekly', {
          body: {
            user: {
              email_feed_weekly: this.emailFeedWeekly
            }
          }
        }).then(response => {
          this.ajaxInProgress = false;

          if (response.status === 200) {
            trackEvent('onboarding.click_toggle_feed_digest', {
              emailFeedWeekly: this.emailFeedWeekly
            });
            resolve();
          } else {
            this.showNotification({type: 'serverError', message: response.data.errors});
            reject();
          }
        });
      });
    }
  };

  // legacy
  checkOverflowed = () => {
    let overflowed =
      $('.builder-wrap__slider-wrap').innerWidth() < $('.builder-wrap__builder').outerWidth();
    if (overflowed) {
      $('.builder-wrap__slider-wrap').addClass('overflowed');
    } else {
      $('.builder-wrap__slider-wrap').removeClass('overflowed');
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Notifications (To be abstracted)
  |--------------------------------------------------------------------------
  */

  @action
  showNotification = ({type, message, icon}) => {
    if (!type || !message) {
      return;
    }
    this.notifications
      .set('type', type)
      .set('message', message)
      .set('icon', icon);
  };

  @action
  clearNotifications = () => {
    this.notifications.clear();
  };

  @computed
  get hasNotification() {
    return this.notifications.size > 0;
  }

  @computed
  get hasError() {
    return this.hasNotification && this.notifications.get('type') === 'error';
  }

  /*
 |--------------------------------------------------------------------------
 | Steps
 |--------------------------------------------------------------------------
 */

  @action
  getSlugFromLocation = location => {
    return _.last(location.pathname.split('/'));
  };

  @action
  setCurrentStep = slug => {
    const step = _.find(this.steps, {slug});
    if (step) {
      this.currentStep = step;
    }
    return step;
  };

  @action
  goToStepSlug = slug => {
    if (this.setCurrentStep(slug)) {
      browserHistory.push(`/onboarding/${slug}`);
    } else {
      throw `${slug} is not a valid step to navigate to.`;
    }
  };

  @action
  goToNextStep = () => {
    const currentSlug = this.currentStep.slug;
    const currentIndex = this.stepOrder.findIndex(step => {
      return step === currentSlug;
    });
    const nextIndex = currentIndex + 1;
    this.goToStepNumber(nextIndex);
  };

  @action
  goToStepNumber = stepNumber => {
    if (stepNumber) {
      const nextStep = this.stepOrder[stepNumber];
      this.goToStepSlug(nextStep);
    } else {
      this.unmount();
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Unmount
  |--------------------------------------------------------------------------
  */

  @action
  unmount = () => {
    this.clearNotifications();
    this.unlistenToHistory();
    try {
      const lastPage = localStorage.getItem('Onboarding.redirect');
      if (lastPage) {
        window.location = lastPage;
        return;
      }
    } catch (err) {
      // nothing
    }
    window.location = this.redirectPath;
  };
}

let onboardingWizardStore;

const store = {
  get instance() {
    return onboardingWizardStore;
  },
  set instance(props) {
    onboardingWizardStore = new OnboardingWizardStore(props);
  }
};

export default store;
export {onboardingWizardStore};
