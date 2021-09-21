/* eslint-disable no-template-curly-in-string */
module.exports = {
  _runbook:
    "https://www.notion.so/gatsbyjs/Working-with-text-copies-in-com-code-b540a036ec7f4298af2d353a59fc84bf",
  auth: {
    morphemes: {
      github: "GitHub",
      gitlab: "GitLab",
      bitbucket: "Bitbucket",
      google: "Google",
      workos: "WorkOS",
    },
    actions: {
      signUpWith: "Authorize with {oauthProvider}",
      logInWith: "Log in with {oauthProvider}",
      continueToProvider: "Continue to your provider",
    },
    headers: {
      signUpPage: "Select Your VCS Provider",
      logInPage: "Log in to Gatsby Cloud",
      sso: "Single Sign-On",
    },
    messages: {
      loginIntroText: "Stop managing content. Start telling your story.",
      signupIntroText:
        "Authorizing with your VCS (version control system) provider is how you’ll connect your site and also sign in to Gatsby Cloud.",
      termsAndPolicy:
        "By signing up, you agree to our <termsLink>Terms of Service</termsLink> and <privacyLink>Privacy Policy</privacyLink>",
      haveAnAccount: "Already have an account? <link>Log in</link>",
      noAccount: "Don't have an account? <link>Sign up</link>",
      ssoLogin: "Or use <link>Single Sign-On</link>",
      backToLogin: "Back to <link>Log in</link>",
      notUsingSSO: "Not using SSO?",
    },
    labels: {
      enterYourEmail: "Enter your email address",
    },
  },
  organizations: {
    morphemes: {
      organization: "workspace",
    },
    actions: {
      reactivate: "Reactivate idle workspace",
      createOrganizationButton: "Create new workspace",
      backToHomepage: "Go back to the homepage",
    },
    headers: {
      yourOrganization: "Your workspace",
      contributorAccessTo: "CONTRIBUTOR ACCESS TO",
      zeroOrganizationsHeader: "You don't have any workspaces set up - yet!",
      noAccess: "You do not have access to this workspace.",
    },
    messages: {
      loadingDetails: "loading your workspace details...",
      contactTheOwner:
        "Please contact the workspace owner to request permission.",
      afterYourTrialEnds:
        "After your trial ends, you will automatically be switched to the Free Plans.",
    },
  },
  createOrganization: {
    actions: {
      editName: "Edit name",
      changePlan: "Change plan",
      createPaidSpace: "Pay and create workspace",
      createFreeSpace: "Create workspace",
    },
    headers: {
      wizardHeader: "Create a workspace",
      setup: "Set up your workspace",
      pickPlan: "Pick a plan for your workspace",
      review: "Review your workspace",
    },
    messages: {
      setupDescription:
        "A workspace can be a team, company, or any other way you want to organize your projects. Don’t worry, you can always change the name of your workspace later.",
      pickPlanDescription:
        "All plans allow you to create an unlimited number of sites. If you need a custom plan or want to try out a few select features, please <link>contact us</link>.",
      reviewDescription:
        "Don’t worry, you can always change all of this information later.",
    },
    labels: {
      orgName: "Name your workspace",
      reviewName: "Workspace name",
      reviewPlan: "Selected plan",
      reviewTotal: "Total payment",
      setupStep: "Set up workspace",
      pickPlanStep: "Pick a plan",
      reviewStep: "Review",
    },
  },
  editOrganization: {
    labels: {
      orgName: "Workspace name",
    },
  },
  loginErrors: {
    headers: {
      oauthError: "There was an issue accessing {oauthProvider}",
    },
    messages: {
      oauthError:
        "<strong>Something is currently interfering with establishing a secure connection with {oauthProvider}.</strong> Maybe they are having trouble over there? Please try to reload this page in a few minutes.",
      ssoError:
        "It looks like your domain is not configured for Enterprise SSO on Gatsby Cloud. If you are interested in adding it to your Workspace, please reach out to our team using the link below.",
    },
    invitationExpired: {
      heading: ["Your invitation has expired"],
      message: [
        "We are sorry, but this invitation has expired",
        "If you need assistance, please email support at support@gatsbyjs.com.",
      ],
      label: "Sign in to Gatsby Cloud ",
    },
    invitationAccepted: {
      heading: ["Your invitation has already been accepted"],
      message: [
        "We are sorry, but this invitation has been accepted",
        "If you need assistance, please email support at support@gatsbyjs.com.",
      ],
      label: "Sign in to Gatsby Cloud ",
    },
    invitationError: {
      heading: ["Your invitation token has an error", "so we can not find it"],
      message: [
        "We are sorry, but we could not find a matching token in our database.",
        "Our team has been notified of the error and will check on it. We will get back to you as soon as possible.",
      ],
      label: "Got it!",
    },
    invitationRequired: {
      heading: ["You must have an invitation", "to access Gatsby Cloud"],
      message: [
        "We are sorry, but we could not find a matching invitation in our database.",
        "Please sign up for your personal invitation to Gatsby Cloud.",
      ],
      label: "Sign up for Gatsby Cloud ",
    },
    invitationMismatch: {
      heading: ["Your invitation link", "was already used"],
      message: [
        "We are sorry, but an invitation link is valid one time. Invitation links can not be passed along.",
        "Please sign up for your personal invitation to Gatsby Cloud.",
      ],
      label: "Sign up for Gatsby Cloud ",
    },
    previewAccess: {
      heading: ["You do not have permissions to view this Preview"],
      message: [
        "If you need assistance, please email support at support@gatsby.com.",
      ],
      label: "Got It",
    },
    blocked: {
      heading: ["This account has been blocked"],
      message: [
        "If you think you have been blocked by mistake please email support at support@gatsbyjs.com.",
      ],
      label: "Got it",
    },
    ticketNotFound: {
      heading: ["Your login has expired"],
      message: ["We are sorry, but this login has expired."],
      label: "Got it",
    },
  },
  modalErrors: {
    gotIt: "Got it",
    contactSupport: "Contact support",
    emailSupport:
      "If you need assistance, please email support at support@gatsbyjs.com.",
    noGatsby: {
      heading: ["No Gatsby site found in the repo"],
      message: [
        "We could not find a Gatsby site in the selected repository.",
        "Your repository must contain one Gatsby project.",
        "If you are sure that you got everything configured correctly, please contact our support — we are happy to help however we can!",
      ],
    },
    invalidVersion: {
      heading: [
        "Gatsby package version found in repo is incompatible with Gatsby Cloud",
      ],
      message: [
        "We have detected the Gatsby package version in the selected repository is incompatible with Gatsby Cloud.",
        "Please upgrade your package to version 2.1.0 or above.",
        "If you are sure that you got everything configured correctly, please contact our support — we are happy to help however we can!",
      ],
    },
    blacklistedDeps: {
      heading: ["Your repository has one or many harmful packages."],
      message: [
        "We have detected the use of harmful packages within this repository. We are unable to create your site.",
        "If you are sure that you got everything configured correctly, please contact our support — we are happy to help however we can!",
      ],
    },
    noOrganizationPermission: {
      heading: ["You do not have permission to create this site"],
      message: [
        "You do not have adequate permission to create sites for this workspace. Contact the owner for an invitation.",
        "If you are sure that you got everything configured correctly, please contact our support — we are happy to help however we can!",
      ],
    },
    defaultError: {
      heading: ["Something went wrong"],
      message: [
        "Woops! Getting in trouble? — we are happy to help you!",
        "Gatsby Cloud is currently unavailable. Please check back soon.",
      ],
    },
    unAuthorized: {
      heading: "Authorization Error",
      subHeading: "It looks like there's an authorization error",
      content:
        "It appears that you don't have access to that resource. Please check with the project administrator, or contact support for assistance",
    },
  },
  sites: {
    morphemes: {
      site: "site",
    },
    actions: {
      addSite: "Add a site",
      backToHomepage: "Go back to the homepage",
      viewErrors: "View errors",
      viewFullReport: "View full report",
      viewFullLighthouseReport: "View full Lighthouse report",
    },
    headers: {
      noSites: "You don’t seem to have any sites",
      noSitesViewer: "No sites in this workspace yet",
      noAccess: "You do not have access to this site.",
      lighthouse: "Lighthouse",
      hostedOnGatsbyCloud: "Hosted on Gatsby Cloud",
    },
    messages: {
      noSitesDescription: "Add a site and have it up and running in minutes.",
      noSitesDescriptionViewer:
        "Owners and editors can add sites in the workspace.",
      noSites: "No sites in this workspace",
      noMatchingSites: "No matching sites in this workspace",
      contactTheOwner: "Please contact the site owner to request permission.",
      loadingScores: "Loading the scores...",
      somethingWentWrongWhenTryingToLoadTheLighthouseScores:
        "Something went wrong when trying to load the Lighthouse scores",
      reportNotEnabled:
        "No report for this build. Go to <link>site settings</link>  to enable the feature.",
      noReportForSite: "No report for this build yet.",
      goToSiteDetails: "Go to site details for {siteName}",
      domainIsNotValidated: "{domain} is not validated",
      withDomainsNames: "With domains names",
    },
    createSiteButton: "Create new site",
    addNewSite: "Create new site",
    updated: "Updated",
    deleteSite: "Delete site",
    cancel: "Cancel",
    deleteSiteConf: "Are you sure you want to delete ",
    yesDeleteSite: "Yes, delete this site",
    deleteSiteInfo:
      "You can delete a site at any time, but you won’t be able to access the Gatsby site URL anymore.",
    losePreviewUrl: "You will no longer be able to view your site URL.",
    deleteSiteNoPermission:
      "You do not have permissions to delete this site. Please contact the site's owner.",
    deletedSuccessfully: "deleted successfully",
  },
  siteSettings: {
    headers: {
      environmentVariables: "Environment variables",
      dataSources: "Data Sources",
      hosting: "Hosting",
      preview: "Preview",
    },
    messages: {
      sitePrefixHint:
        "Only lower case alphabetical characters and numbers are allowed.",
      wrongSitePrefix: "The site prefix is not valid or already exists.",
      yourDefaultHostedSiteWillBeAt:
        "Your default hosted site will be at <strong>{prefix}.gatsbyjs.io.</strong>",
      editingSitePrefixWillRequire:
        "Editing the site prefix could require you to update your DNS settings.",
    },
  },
  siteBuildsSettings: {
    labels: {
      enableBuilds: "Enable builds",
      enableBuildChecks: "Enable build checks",
      enableIncrementalBuilds: "Enable cloud builds",
      enableAutomaticDeploys: "Enable automatic deploys",
    },
    messages: {
      incrementalBuildsDisabled:
        "Cloud builds are not available for {freePlanName} plan",
      automaticDeploysDisabledHosting:
        "Customizable only for Gatsby Hosting, <link>turn on Gatsby Hosting</link> to unlock the feature.",
      automaticDeploysDisabledPlan:
        "Customizable only with a Performance or Enterprise Hosting plan. <link>Upgrade your plan</link> to unlock the feature.",
    },
  },
  sitePreviewSettings: {
    headers: {
      configureWidget: "Configure Preview Widget",
      gatsbyCloudWebhook: "Gatsby Cloud Webhook",
    },
    labels: {
      enablePreviewBuilds: "Enable CMS Preview builds",
      previewUpdateType: "Choose how CMS preview gets updated",
      previewUpdateTypeOptionAuto: "Automatic Preview Builds",
      previewUpdateTypeOptionManual: "Manual Preview Builds",
    },
    messages: {
      gatsbyCloudWebhookDescription:
        "Copy and paste this link in the appropriate part of your CMS to trigger preview builds.",
      previewUpdateTypeOptionAutoDescription:
        "Automatically build a new preview when content is updated.",
      previewUpdateTypeOptionManualDescription:
        "Allow users to manually trigger a rebuild of their preview when they are ready.",
    },
  },
  sitesList: {
    headers: {
      noMatchingSites: "No matching sites in this workspace",
    },
    labels: {
      repositoryLink: "View repository",
      repositoryLinkAria: "View repository on {provider}",
      searchSites: "Search sites (searching is case-sensitive)",
    },
    messages: {
      noSites: "No sites in this workspace",
      noMatchingSites:
        'Sorry, we couldn\'t find any sites matching "{searchTerm}". Searching is case-sensitive.',
    },
  },
  header: {
    actions: {
      createOrganization: "Create a workspace",
    },
    labels: {
      currentOrgIndicator: "(current workspace)",
    },
    title: "Cloud",
    loggedInAs: "Logged in as",
    userSettings: "User Settings",
    documentation: "Documentation",
    cloudDocumentation: "Gatsby Cloud",
    ossDocumentation: "Gatsby Open Source",
    statusPage: "System Status",
    productRoadmap: "Product Roadmap",
    needHelp: "Need help? Drop us an email:",
    signOut: "Sign out",
    allOrganizations: "All Workspaces",
    youDontHaveOrg: "You don't have any workspaces yet.",
  },
  sourceControl: {
    morphemes: {
      github: "GitHub",
      gitlab: "GitLab",
      bitbucket: "Bitbucket",
      google: "Google",
      workos: "WorkOS",
    },
  },
  createSite: {
    actions: {
      selectInstallation: "Select destination",
      backToWorkspace: "Go to workspace",
    },
    headers: {
      wizardTitle: "Add a new site",
      zeroInstallations: "Where should we host this new project?",
      noAccessTitle:
        "You do not have permissions to add a site in this workspace",
    },
    labels: {
      pickSiteType: "How do you want to add a new site?",
      siteTypeProvision: "Start from a Template",
      siteTypeImport: "Import from a Git repository",
      siteTypeSupportedProviders: "Supported source control providers",
    },
    messages: {
      autoAddedVariables:
        "We automatically added these based on your connected integrations. <link>To learn more, refer to this documentation</link> if you are unsure about this step or want to learn more about environment variables.",
      provisionDescription:
        "Choose starter, connect a CMS, and Gatsby does the rest for you. Templates are available on GitHub only.",
      importDescription:
        "Connect your site from an existing Git repository to get access to powerful features, including Gatsby Builds & Previews",
      openedSourceControlAuth:
        "We just opened a new browser window to authenticate with {provider}. Accidentally closed the window?",
      pendingSourceControlAuth:
        "Thank you. Please wait a few moments while we load your {provider} information.",
      noAccessDescription:
        "Please contact your workspace owner to request permission.",
      availableOnlyForGitHubUsers: "Available only for GitHub users.",
    },
    title: "Create a new site",
    chooseOrganization: "Select an organization",
    addIt: "Add it",
    searchPlaceholder: "Search your {provider} repositories",
    organization: "Organization",
    cancel: "Cancel",
    previewSite: "Preview Site",
    addVariable: "Add Variable",
    bulkAddVariables: "Bulk Add Variables",
    key: "Key",
    value: "Value",
    remove: "Remove",
    cantBeEmpty: "Can't be empty",
    setUpSite: "Set up site for ",
    continue: "Continue",
    needHelp: "Need help with environment variables of webhook setup? Go to",
    stepTwo: "Step 2: Add integrations",
    setupLater: "now or setup integrations later in your site settings",
    goBack: "Go back",
  },
  provisionSite: {
    messages: {
      creatingRepository:
        "We are creating a Git repository to ensure you can update your site after deploying it. Every push to this repository will automatically trigger a new build.",
      updatePermissions: "Update Permissions",
    },
    cmsTab: "CMS & starter",
    starterTab: "Starter",
    repositoryTab: "Repository",
    summaryTab: "Summary",
    pickCMS: "Pick a Content Management System (CMS) provider",
    pickStarter: "Pick a Starter",
    nameYourProject: "What should we call your new project?",
    chooseDestination: "Choose a destination:",
    chooseOrganization:
      "Choose the GitHub organization to create the repository for your new site. Can’t find your organization?",
    openWindowGithubAuthentication:
      "We just opened a new browser window to authenticate with GitHub. Accidentally closed the window?",
    configureRepository: "Configure your new repository",
    waitAMoment:
      "Thank you. Please wait a few moments while we load your GitHub information.",
    addIt: "Add it",
    organizations: "Organizations: ",
    summary: "Successfully set up",
    instanceAvailable: "Once your site is available, editing content in",
    update: "will instantly update your site. Manage your content in",
    here: "here: ",
    repository: "We create a repository on GitHub on your behalf",
    createdRepo: "We created a repository on GitHub on your behalf:",
    integrations:
      "We are adding more starters and CMS integrations soon—stay tuned!",
    repositoryName: "A repository named ",
    created: " will be created under the ",
    organization: " organization ",
    connectCms: "Connect to your CMS Provider",
    connectCmsDescription:
      "To ensure a seamless integration, please authorize access to a CMS provider.",
    connectCmsTab: "Connect CMS",
    manageContent: "Manage your content in ",
    contentfulSpace: "A contentful space named ",
    contentfulOrg: "Contentful organization",
    contentfulDefaultOrg: "your Contentful default organization",
    projectNamed: "A project named",
    createdCms: "will be created in your",
  },
  cmsIntegrations: {
    title: "Optional integrations for your site, ",
    intro:
      "Connecting to a CMS will make sure you have an accurate preview version of your site (a Gatsby Cloud preview instance).",
    timingCaveat:
      "Not ready yet? That's ok! You can add multiple data sources at any time through the site settings.",
    connect: "Connect",
    hideDetails: "Hide details",
    skipStep: "Skip this step",
    details: "Details",
    documentation: "Read more about integrations",
    moreIntegrations:
      "We are adding more integrations soon and will keep you updated!",
    setupSite: "Set up your site",
    edit: "Edit",
    editIntegrations: "Edit Integrations",
    zeroState: "There are zero CMS integrations set up for this site yet.",
    addIntegration: "Add Integration",
    connected: "Connected",
    integrations: "We are adding more CMS integrations soon—stay tuned!",
    manualIntegrations: "Manual Integrations",
    manualIntegrationsSubheading:
      'Integrations that must be setup manually. Find the information for your CMS below, open the "Setup instructions" in a new tab so you can refer to them later, and then click "Skip this step" at the bottom of this page.',
    manualIntegrationsDesc:
      'Please click "Setup instructions" to open in a new tab, click "Skip this step" below, and follow the instructions to manually setup your site.',
  },
  cmsIntegration: {
    actions: {
      authorize: "Authorize",
      continue: "Continue",
    },
    headers: {
      connectIntegration: "{vendorName} Integration",
      connectIntegrationLong: "Configure integrationw with {vendorName}",
    },
    labels: {
      contentfulOrg: "Contentful organization",
      contentfulSpace: "Contentful space",
      contentfulSpacePlaceholder: "Select space",
      cosmicJsAuthToken: "Authentication token",
      cosmicJsBucket: "Bucket",
      datoCmsProject: "Project",
      sanityProject: "Sanity project",
      sanityDataset: "Sanity dataset",
      sanityDatasetPlaceholder: "Select dataset",
      shopifyStoreUrl: "Store Url",
      shopifyApiKey: "Private app API key",
      shopifyPassword: "Private app password",
    },
    messages: {
      shopifyFindPrivateAppCreds:
        "Login to your Shopify store and go to Apps → Manage private apps. Select the private app you created when configuring the Shopify source plugin. Use these details for authorization below.",
      shopifyStoreUrlInstructions:
        "Login to your Shopify store and go to Online Store → Domains. Enter the complete subdomain for your store's myshopify.com domain. For example, delicious-brews.myshopify.com.",
      shopifyConfirmIntegrationDetails:
        "Review your shop configuration data source for <strong>{siteName}</strong>.",
      authorizationRequired:
        "We need authorizaton to connect to <strong>{siteName}</strong>.",
      authorizationRequiredToProvision:
        "Please authorize Gatsby Cloud to create a content model in {cmsVendor} for your example site <strong>{siteName}</strong>.",
      integrationUpdated: "Site integration updated successfully",
      chooseContentfulDataSource:
        "Choose a Contentful space to use as the data source for <strong>{siteName}</strong>.",
      chooseContentfulOrgDataSource:
        "Choose a Contentful organization to use as the data source for <strong>{siteName}</strong>.",
      chooseCosmicJsDataSource:
        "Choose a CosmicJS bucket slug to use as the data source for <strong>{siteName}</strong>.",
      chooseDatoCmsDataSource:
        "Choose a DatoCMS project to use as the data source for <strong>{siteName}</strong>.",
      chooseSanityDataSource:
        "Choose a Sanity dataset to use as the data source for <strong>{siteName}</strong>.",
      cosmicJsAuthTokenInstructions:
        "Log into CosmicJS and go to <link>Account Settings → Authentication</link> to get your authentication token.",
      loadingContentfulSpaces: "Loading your spaces…",
      loadingCosmicJsBuckets: "Loading your buckets…",
      loadingDatoCmsProjects: "Loading your projects…",
      loadingSanityProjects: "Loading your projects…",
      validationContentfulOrgRequired:
        "You must select a Contentful organization to continue",
      validationContentfulSpaceRequired:
        "You must select a Contentful space to continue",
      validationCosmicJsBucketRequired: "You must select a bucket to continue",
      validationCosmicJsAuthTokenRequired:
        "Authentication token required to continue",
      validationDatoCmsProjectRequired: "You must select a project to continue",
      validationShopifyShopNameRequired: "Shop name required to continue",
      validationShopifyShopPasswordRequired:
        "Shop Password required to continue",
      validationShopifyShopAPIKeyRequired: "Shop API Key required to continue",
      validationSanityProjectRequired:
        "You must select a Sanity project to continue",
      validationSanityDatasetRequired:
        "You must select a Sanity dataset to continue",
    },
  },
  productionView: {
    deploysTo: "Deploys to ",
  },
  build: {
    labels: {
      published: "Published",
    },
    actions: {
      publish: "Publish",
      publishThisBuild: "Publish this build",
    },
  },
  deploysView: {
    actions: {
      viewErrors: "View errors",
      viewBuild: "View build",
      viewFunctions: "View functions",
    },
    headers: {
      deploysListTitle: "Deploy Previews for Feature Branches",
      pullRequestBuilds: "Pull Request Builds",
      mergeRequestBuilds: "Merge Request Builds",
      pullRequests: "Pull Requests",
      mergeRequests: "Merge Requests",
      productionBuildTitle: "Deploy Build for Production Branch",
      latestProductionBuild: "Latest Production Build",
      pullRequest: "Pull request: <strong>{title}</strong>",
      latestBuildForProductionBranch:
        "Latest build of the {productionBranch} branch",
      latestSuccessfulBuildForProductionBranch:
        "Latest successful deploy of the {productionBranch} branch",
      allBuildsOfBranch: "All the builds of the {productionBranch} branch",
      allBuildsOfPR:
        'All the builds of the pull request called "{pullRequestTitle}"',
      production: `Production`,
      publishBuild: `Publish build`,
    },
    labels: {
      searchInputGithub:
        "Search deploy previews by pull request title or author",
      searchInputGitlab:
        "Search deploy previews by merge request title or author",
      searchInputPlaceholderGithub:
        "Start typing a pull request title or an author name",
      searchInputPlaceholderGitlab:
        "Start typing a merge request title or an author name",
      allBuilds: "All branch builds",
      buildDetails: "Build details",
      buildOfTitle: "A build of the {title} branch",
      history: "History",
      viewLatestBuildAt: "View latest build at",
      automaticDeploys: "Automatic deploys",
      viewProductionHistory: "View production history",
      publish: "Publish",
      disableAutomaticDeploys: "Disable automatic deploys",
    },
    messages: {
      buildTriggered: "Build triggered",
      deploysListSubtitleGithub:
        "Deploy previews are generated for this site when you open a pull request against the <strong>{productionBranch}</strong> branch.",
      deploysListSubtitleGitlab:
        "Deploy previews are generated for this site when you open a merge request against the <strong>{productionBranch}</strong> branch.",
      pullRequestBuilds:
        "Pull Request Builds are generated for this site when you open a pull request against the <strong>{productionBranch}</strong> branch.",
      mergeRequestBuilds:
        "Merge Request Builds are generated for this site when you open a merge request against the <strong>{productionBranch}</strong> branch.",
      noSearchResults: "No deploys found for this search request.",
      thisBuildWillGoLive: "This build will go live when you publish it.",
    },
  },
  functionsView: {
    actions: {
      goBackToFunctions: "Functions",
      backToFunctionsList: "Back to functions list",
      seeRecentLogs: "See recent logs",
      readDocs: "Read the Functions docs",
    },
    headers: {
      functionLogsTitle: 'Logs for "{functionName}" function',
      noFunctions: "This site has no functions configured",
      noFunctionLogs: "There are no logs yet for this function",
      invocation: "Invocation",
      functionInvocationsLog: "Function invocations log",
      youDidntIncludeAnyFunctions:
        "You didn’t include any functions in this build",
    },
    labels: {
      runSuccessfully: "Run successfully",
      failed: "Failed",
      timedOut: "Timed out",
      lastInvocationStatus: "Last invocation status",
      lastInvocationDate: "Last invocation date",
      functionDetailsShort: "View logs",
      functionDetails: "View logs for {functionName}",
    },
    messages: {
      noFunctionsDescription:
        "Learn more about configuring functions with Gatsby\u00A0Hosting <link>here</link>",
      noFunctionLogsDescription: "This function has not been run yet",
      noLogsforFuncion: "No logs for this function yet.",
      buildHasNoFunctions: "This build has no functions configured yet.",
      youCanDevelopTestAndDeploy:
        "You can develop, test, and deploy serverless functions alongside your frontend code.",
      thisFunctionhasNotBeenInvoked:
        "This function has not been invoked on this build for the last 12 hours.",
    },
  },
  buildsByBranchView: {
    headers: {
      noBuilds: "No builds",
      listOfBuilds: "Builds of the <strong>{branch}</strong> branch",
    },
    labels: {
      backToSiteDetails: "Back to the site details",
    },
    messages: {
      loadingBuilds: "Loading the builds...",
      errorLoadingBuilds:
        "Something went wrong when fetching the builds: {error}",
      noBuildsForBranch: "There are actually no builds for this branch",
      noBuildsForPr: "There are actually no builds for this pull request",
    },
  },
  setupSite: {
    pickBranch: "Branch to build from",
  },
  datocmsModal: {
    authorize: "Authorize with ",
    withDatoCms: "with DatoCMS",
    chooseProject: "Select a project to use as the data source for",
  },
  siteDetails: {
    actions: {
      addSiteDescription: "Click to add a description…",
      getStartedNow: "Get started now",
      setUpCustomDomain: "Set up a custom domain",
      installationInstructions: "Install Plugin",
    },
    labels: {
      sourceControlProviderChip: "Code hosted on {provider}",
      siteDirectory: "Base directory: {directoryPath}",
      functions: "Functions",
    },
    headers: {
      functions: "Functions",
    },
    messages: {
      quicklyBoostYourWebPerf:
        "Quickly boost your web performance by hosting on Gatsby Cloud!",
      yourSiteIsHostedOnGatsbyCloud: "Your site is hosted on Gatsby Cloud!",
    },
    builds: "Builds",
    previews: "CMS Preview",
    settings: "Site Settings",
    overview: "Overview",
    triggerRebuild: "Restart site",
    deploysFrom: "Deploys from",
    previewUrl: "Preview Url",
    previewStatus: "Preview Status",
    restart: "Restart",
    rebuild: "Rebuild",
    update: "Update",
    previousBuilds: "Previous updates",
    lastBuild: "Last update",
    logs: "Logs",
    showLogs: "Show logs",
    created: "Created",
    started: "Started",
    buildLogs: "Build logs",
    youCannotTrigger:
      "You cannot restart this site until the current update is finished.",
    authorize: "Authorize",
    siteHasNotAuthorized:
      "This site has not been authorized with our GitHub application",
    zeroBuildsTitle: "We're creating your site",
    zeroBuildsText:
      "This may take a few minutes. More information will be provided when the process has started.",
    branch: "BRANCH",
    view: "View",
    inModal: "in modal",
    inNewTab: "in new tab",
    experimentalFeatures: "Experimental features",
    incrementalBuilds: "Cloud builds",
    enabled: "Enabled",
    new: "New",
    deployTargets: "Deploy Targets",
    deploys: "Deploys",
    loadingBuilds: "loading builds...",
    loadingMoreBuilds: "loading more builds",
    buildsLoaded: "builds loaded",
  },
  previewTarget: {
    previewTarget: "Target Branch",
    editTarget: "Edit target",
    targetBranch: "Branch",
    directoryPath: "Directory path: ",
    cancel: "Cancel",
    save: "Save",
  },
  manageContributors: {
    actions: {
      confirm: "Confirm",
      transfer: "Transfer",
      transferOwnership: "Transfer ownership",
      manageMember: "Manage member {nameOrEmail}",
      removeMember: "Remove member",
      modifyMember: "Modify member",
      remove: "Remove",
      revokeInvite: "Revoke invite",
      resendInvite: "Resend invite",
    },
    headers: {
      removeMember: "Do you want to remove this member from the workspace?",
      removeMemberQuestion: "Remove member?",
      transferOrgQuestion: "Transfer workspace ownership?",
      revokeInvite: "Do you want to revoke the access of that user?",
      revokeInviteQuestion: "Revoke invite?",
      resendInvite: "Do you want to resend an invitation to that person?",
      resendInviteQuestion: "Resend invite?",
    },
    labels: {
      memberSiteAccessAll: "All sites",
      memberSiteAccessSome: "{count, plural, one {# site} other {# sites}}",
    },
    messages: {
      removeMemberConf:
        "Are you sure you want to remove <strong>{email}</strong>?",
      removeMemberEffects:
        "They will no longer be able to contribute to this workspace.",
      resendOrgInviteConf:
        "Are you sure you want to resend the invitation to collaborate on this workspace to <strong>{email}</strong>?",
      revokeOrgInviteConf:
        "Are you sure you want to revoke the invitation to collaborate on this workspace from <strong>{email}</strong>?",
      transferOwnership:
        "Do you want to transfer the ownership of this workspace?",
      transferOrg: "Transfer workspace ownership",
      transferOrgConf:
        "Are you sure you want to transfer workspace ownership to <strong>{email}</strong>?",
      transferOrgEffects:
        "You will no longer have access to owner permissions for this workspace",
      orgOwnershipTransferred: "Workspace ownership transferred successfully",
      memberRemoved: "Member removed successfully",
      memberInvitationResent: "Member invitation resent",
      memberInvitationRevoked: "Member invitation revoked",
    },
  },
  orgMembers: {
    actions: {
      addMembers: "Add Members",
      inviteMembers: "Invite Members",
    },
    labels: {
      docsLink:
        "View the documentation for details about roles and permissions",
      noPlan: "Upgrade my plan",
      searchMembers: "Search members",
    },
    headers: {
      noPlan:
        "You do not have access to invite more workspace members with the 'Free' plan",
      noViewPermissions: "You do not have permission to view workspace members",
    },
    messages: {
      loadingOrgMembers: "Loading your workspace members...",
      removeContributor:
        "Do you want to remove this contributor from the workspace?",
      viewingAndManagingSiteMembers: "Viewing and managing site members",
      comingSoon: "Coming soon",
      manageMembersInSettings:
        "This tab only shows workspace members at this time. The ability to manage site members in this tab is coming soon. For now, please continue using site settings to manage site members.",
      noViewPermissionsDescription:
        "Please contact your workspace owner to request permission.",
      noPlan: "Please upgrade your plan to invite members.",
    },
  },
  subscriptionStatus: {
    actions: {
      updatePaymentInformation:
        "Update payment information to continue using Gatsby Cloud",
      resubscribe: "Subscribe to Gatsby Cloud",
    },
    messages: {
      loadingProvider: "Preparing the form…",
      errorLoadingProvider:
        "Something wrong occured when trying to prepare the billing form. Please, refresh the page or retry the operation later.",
      paymentFailed: "Stopped: Payment with Visa ending in {lastFour} failed",
      paymentFailedDescription:
        "When trying to bill your Visa credit card we encountered the following error:",
      paymentFailedUpdate:
        "Please update your payment method by adding a valid credit card below.",
      trialExpired: "Your free trial period has expired.",
      planCanceled: "Canceled: Your plan was canceled on {cancellationDate}",
      creditCardExpired: "Your credit card expired on {expirationDate}",
      creditCardExpiredUpdate:
        "Update payment information to continue using Gatsby Cloud",
      planChangeRequested:
        "Change to the <strong>{requestedPlanName}</strong> plan requested.\nPlease hold for our sales staff to contact you.",
    },
  },
  organizationStatus: {
    morphemes: {
      orgStatus: "Status",
    },
    headers: {
      statusSection: "Status",
      reactivate: "Reactivate idle workspace",
      reactivateQuestion: "Reactivate workspace?",
      orgInOverage: "Your workspace is currently in overage",
      orgIsIdle: "Your workspace is currently idle",
    },
    actions: {
      reactivateShort: "Reactivate",
      reactivate: "Reactivate this workspace",
      upgrade: "Upgrade this workspace",
    },
    messages: {
      orgIsIdle: "This workspace is currently idle",
      orgInOverage:
        "This workspace has reached its limit of monthly real-time edits",
      reactivated: "<strong>{organizationName}</strong> reactivated",
      idleStatusScreen:
        "Due to inactivity your workspace is in idle mode. Visit your workspace settings to reactivate anytime.",
      idleStatusInfo:
        "Shh! Your workspace is sleeping. We put it in idle mode because you haven't made any builds in over a month. Reactivate to wake it up again.",
      activeStatusInfo:
        "Your workspace is currently active. If you've haven't made any builds for over a month we may put it in idle mode, but you can always wake it up again!",
      overageStatusInfo:
        "Your workspace has reached its limit of monthly real-time edits, and is currently in overage mode. To increase your limit, consider upgrading your plan.",
    },
  },
  organizationPlan: {
    labels: {
      currentPlanName: "Current plan: {planName}",
      triallingPlan: "{planName} Trial",
    },
  },
  envVars: {
    actions: {
      copyAllVars: " Bulk Copy Variables",
      addVariableRow: "Add Variable",
      addBulkVariables: "Bulk Add Variables",
      removeVariableRow: "Remove environment variable",
      removeVariableRowShort: "Remove",
      editVariables: "Edit Variables",
      bulkSubmit: "Add",
    },
    headers: {
      environmentVariables: "Environment variables",
      noEnvVars: "No environment variables",
      bulkAdd: "Add environment variables",
    },
    labels: {
      helpLink: "Learn more about managing environment variables",
      buildVariablesTab: "Build variables",
      previewVariablesTab: "Preview variables",
      keyFieldPlaceholder: "Key",
      valueFieldPlaceholder: "Value",
      keyFieldLabel: "Environment variable key",
      valueFieldLabel: "Environment variable value",
      bulkAddModal: "Add multiple environment variables at once",
      bulkAddPlaceholder: "Add environment variables",
      bulkAdd: "Add multiple environment variables at once",
    },
    messages: {
      copiedToClipBoard: "Copied to clipboard!",
      loadingEnvVars: "Loading environment variables for your site...",
      noEnvVarsDescription:
        "There are no {envVarsOfType} set up for this site.",
      noEnvVarsTypeBuild: "build environment variables",
      noEnvVarsTypePreview: "preview environment variables",
      bulkAddValidateRequired:
        "You must enter at least one environment variable",
      bulkAddValidateFormatShort: "Looks like some of your input is invalid.",
      bulkAddValidateFormat:
        "Looks like some of your input is invalid. Check that the following environment variables are correctly formatted: {invalidEnvVars}.",
      bulkAddFormat: "Add each variable on a new line in the format: VAR=value",
    },
  },
  buildStates: {
    running: "running",
    rebooting: "rebooting",
  },
  buildLogs: {
    headers: {
      previewLogs: "Preview logs",
      noRawLogs: "No logs found",
    },
  },
  members: {
    morphemes: {
      viewer: "Viewer",
      editor: "Editor",
      owner: "Owner",
      admin: "Admin",
    },
  },
  addMembers: {
    actions: {
      addMember: "Add Member",
      removeMember: "Remove",
      sendInvites: "Send invites",
    },
    headers: {
      addMembersTitle: "Add Members",
      inviteMembers: "Invite Members",
      memberFieldsGroup: "Member {num}",
    },
    messages: {
      addMembersDescription:
        "Enter emails of people you would like to invite. Invited users will receive an email in their inbox inviting them to this workspace.",
      memberInvitationSent:
        "<strong>Member invitation sent</strong> successfully",
    },
  },
  modifyMember: {
    actions: {
      modifyMember: "Modify Member",
      saveChanges: "Save changes",
    },
    headers: { modifyMemberTitle: "Modify Member" },
    messages: {
      modifyMemberDescription:
        "Modifying the roles and permissions for {name}.",
      memberModifyConfirmation: "<strong>Member modified</strong> successfully",
    },
  },
  memberFields: {
    labels: {
      email: "Email address",
      role: "Role",
      siteAccess: "Site access",
      allowAllSitesAccess: "Access to all sites",
      allowSomeSitesAccess: "Access to some sites only",
      pickSites: "Select sites",
    },
    messages: {
      roleHintViewer: "Can view sites only. Cannot create or modify sites.",
      roleHintEditor: "Can create, view, and modify sites.",
      roleHintOwner:
        "Access to all sites in a space. Can create, view, and modify sites, workspaces, and plan & billing information.",
      roleHintAdmin:
        "Access to all sites in a space. Can create, view, and modify sites and workspaces",
      ownerSiteAccessDisclaimer:
        "Owners get access to all sites within the workspace. To set specific site access, change the role.",
      sitesSelectedAll:
        "All current sites in the workspace are selected. This member will not automatically have access to any new sites created in the workspace.",
      sitesSelectedNone: "None selected",
      sitesSelectedNum:
        "{count, plural, one {# site} other {# sites}} selected",
      validationEmailNotAMember:
        "This user has already been invited to the workspace.",
      validationEmailUnique: "Emails must be unique.",
      validationSitesRequired: "Please select at least one site to continue.",
    },
  },
  billing: {
    addPayment: "Add a payment method",
    creditCardInformation: "Credit card information",
    name: "Name on card",
    cardNumber: "Card number",
    expirationDate: "Expiration date",
    cvcCode: "CVC code",
    optionalInformation: "Optional information",
    companyName: "Company name",
    requiredField: "This field is required",
    validEmail: "Please enter a valid email address",
    cancel: "Cancel",
    startSubscription: "Start subscription",
    subscriptionNote: 'By clicking "Start subscription", you agree with our ',
    termsAndConditions: " Terms and Conditions",
    yourOrder: "Your order",
    gatsbyPreview: "Gatsby Preview",
    total: "Total",
    paymentDetails: "Payment Details",
    updatePaymentDetails: "Update Payment Details",
    billed: "Billed",
    billedDetails: "via debit/credit card.",
    updatePayment: "Update payment information",
    contactSupport: "Contact Support",
    gotIt: "Got it!",
    plan: "Plan.",
    month: "month",
    year: "year",
    monthYear: "month / year",
    formEmail: "Email address",
    company: "Company name",
    changePlanFor: "Change plan for",
    morphemes: {
      month: "month",
    },
    headers: {
      billingAddress: "Billing address",
    },
    labels: {
      billingAddress: "Billing address",
      billingAddressLineTwo: "Apartment, Suite, etc",
      billingCity: "City",
      billingState: "State",
      billingZipCode: "Zip Code",
      billingCountry: "Country",
      selectCountry: "Select country",
      billingInterval: "Billing interval",
      billingIntervalOptionMonthly: "Monthly",
      billingIntervalOptionAnnual: "Yearly",
    },
    messages: {
      contactSalesForCustomPlan:
        "Don’t see a plan that fits your needs? We’re here to help. Contact <link>sales@gatsbyjs.com</link> for a customized plan built for you.",
    },
  },
  changePlanRequest: {
    cancel: "Cancel",
    submit: "Submit request",
    Enterprise: {
      heading: "Cloud Enterprise is tailor-made to fit your needs",
      lede:
        "Thanks for your interest in Gatsby Cloud Enterprise! We want to create the best solution for your team, and believe that having a conversation is the best way to do so.",
      note:
        "We’ll get in touch with you as soon as possible. If there is a preferred time to do so, please let us know.",
    },
    Business: {
      heading: "Change to Business",
      lede:
        "Thanks for your interest in Gatsby Cloud Business! We want to create the best solution for your team, and believe that having a conversation is the best way to do so.",
      note:
        "We’ll get in touch with you as soon as possible. If there is a preferred time to do so, please let us know.",
    },
    Free: {
      heading: "Cancel Plan",
      lede: "Cancel your billing subscription.",
      note:
        "We're sorry to see you go! Your subscription will cancel at the end of your current billing period.",
    },
    default: {
      heading: "Change to",
      lede: "Your plan change request will be processed immediately.",
    },
  },
  planInformation: {
    morphemes: {
      tier1PlanName: "Free",
      tier2PlanName: "Individual",
      tier3PlanName: "Team",
      tier4PlanName: "Enterprise",
      freePlanName: "Free",
      standardPlanName: "Standard",
      performancePlanName: "Performance",
      enterprisePlanName: "Enterprise",
    },
    headers: {
      currentPlan: "Current Plan",
      planFeatureCategoryFeature: "Features",
      planFeatureCategoryCollaboration: "Collaboration",
      planFeatureCategoryLogin: "Log in with...",
      planFeatureCategoryProviders: "Git Providers",
      planFeatureCategoryDeploy: "Deploy to...",
    },
    actions: {
      pickTier1: "Get started for free",
      pickTier2: "Start 14-day free trial",
      pickTier2Aria: "Start 14-day free trial of Individual plan",
      pickTier3: "Start 14-day free trial",
      pickTier3Aria: "Start 14-day free trial of Team plan",
      pickTier4: "Contact Sales",
      changePlan: "Change plan",
    },
    messages: {
      defaultFeaturesIntro:
        "Everything in <strong>{prevTierPlanName}</strong>, plus:",
      tier1PlanDescription:
        "For <strong>personal</strong> and single purpose sites",
      tier1PlanFeatures: [
        "100 Real-Time Edits/month",
        "Standard Builds",
        "Deploy Previews",
        "Real-time CMS Previews",
        "Lighthouse Reports",
        "1 editor",
      ],
      tier2PlanDescription:
        "For <strong>pro developers</strong> building pilot projects or small sites",
      tier2PlanFeatures: [
        "250 Real-Time Edits/month",
        "Cloud builds",
        "Deploy Previews",
        "Real-time CMS Previews",
        "Site Access Control",
        "Lighthouse Reports",
        "1 editor",
      ],
      tier3PlanDescription:
        "For <strong>organization-wide</strong> use and teams producing large sites",
      tier3PlanFeatures: [
        "1000 Real-Time Edits/month",
        "Cloud builds",
        "Deploy Previews",
        "Real-time CMS Previews",
        "Site Access Control",
        "Lighthouse Reports",
        "5 editors",
      ],
      tier4PlanDescription:
        "<strong>Custom packages</strong> designed for the needs of your company",
      tier4PlanFeatures: [
        "Dedicated Slack Channel",
        "New Team Training",
        "Site Optimization Consultation",
        "Custom Number of Editors",
      ],
      monthlyAmountAria: "${amount} per month",
      trialNoCardRequiredHint:
        "No credit card required. After the {trialDays} days, you will automatically be downgraded to the {planName} Plan.",
      custom: "Custom",
      byQuote: "By quote",
      featureComparisonSummary:
        "A comparison of features available in the different Gatsby Cloud plans.",
      planFeatureRte: "Real-time edits",
      planFeatureContentPreviews: "CMS Previews",
      planFeatureDeployPreviews: "Deploy Previews",
      planFeatureLighthouseReports: "Lighthouse Reports",
      planFeatureIncrementalBuilds: "Cloud builds",
      planFeatureConcurrentBuilds: "Concurrent Builds",
      planFeatureSupportSLA: "Support SLA",
      planFeatureEditors: "Editors",
      planFeatureViewers: "Viewers (coming soon)",
      planFeaturePrivateUrls: "Site Access Control",
      planFeatureCustomUrls: "Custom URLs (coming soon)",
      planFeatureEnforceSSO: "Enforce Single Sign-On",
      planFeatureGithub: "GitHub",
      planFeatureGitlab: "GitLab",
      planFeatureBitbucket: "Bitbucket (coming soon)",
      planFeatureGoogle: "Google (coming soon)",
      planFeatureGithubEnterprise: "GitHub Enterprise (coming soon)",
      planFeatureGitlabEnterprise: "GitLab Enterprise (coming soon)",
      planFeatureCloudflare: "Cloudflare",
      planFeatureNetlify: "Netlify",
      planFeatureFastly: "Fastly",
      planFeatureFirebase: "Firebase",
      planFeatureAws: "AWS S3",
      planFeatureGoogleStorage: "Google Storage",
      planFeatureZeit: "Vercel",
      planFeatureAzure: "Azure",
      planRteIntervalsFree: "100 / month",
      planRteIntervalsTeam: "250 / month",
      planRteIntervalsEnterprise: "1000 / month",
      settingsTrialEndInformation:
        "After your {trialPlanName} plan trial ends, you will automatically be converted to the {freePlanName} plan. You can <link>upgrade anytime</link> to use features found in our {trialPlanName}+ plans.",
      changePlanTrialEndInformation:
        "You will automatically be switched to the {freePlanName} plan at the end of your trial if you choose not to upgrade.",
    },
    labels: {
      linkToPricingDocs: "Plan information docs",
    },
  },
  orgDetails: {
    actions: {
      backToWorkspace: "Go to workspace",
    },
    labels: {
      settings: "Settings",
      sites: "Sites",
      members: "Members",
    },
    headers: {
      noAccessTitle:
        "You do not have permissions to view this workspace settings",
    },
    messages: {
      noAccessDescription:
        "Please contact your workspace owner to request permission.",
    },
  },
  orgSettings: {
    headers: {
      general: "General",
      details: "Workspace Details",
      status: "Status",
      plan: "Plan",
    },
  },
  paymentInformation: {
    paymentInformation: "Payment information",
    updatePayment: "Update payment method",
    updatePaymentFor: "Update payment method for",
    paymentNoPermissions:
      "You do not have permissions to view payment information. Please contact the workspace owner.",
    paymentMethodUpdated: "Payment method updated ",
    successfully: "successfully!",
    addPaymentMethod: "Yes, add new payment method",
    cancel: "No, cancel",
    cancelText: "Cancel",
    resubscribe: "Resubscribe",
    resubscribeToManage:
      "Your subscription was canceled. To manage your workspace and sites you'll need to reactivate your subscription.",
    ownerMustResubscribe:
      "The subscription for this workspace has been canceled. The workspace owner must resubscribe to resume managing this workspace and associated sites",
    updatedSuccessfully: "updated successfully",
    actions: {
      updatePayment: "Update payment method",
    },
    labels: {
      cardNumber: "Card number",
      billingInterval: "Billing interval",
      nextPayment: "Next payment",
    },
    headers: {
      paymentInformation: "Payment Information",
      paymentHistory: "Payment History",
    },
    messages: {
      billedMonthly: "Billed monthly",
      billedAnnually: "Billed annually",
      nextPaymentReceived: "Next payment received",
    },
  },
  paymentHistory: {
    messages: {
      viewYourPaymentHistory:
        "You can view your payment history, download invoices, and update billing address and information using our portal below.",
    },
    actions: {
      goToPortal: "Go to the Portal",
    },
  },
  notFound: {
    actions: {
      goToHomepage: "Back to homepage",
    },
    headers: {
      pageNotFound: "Page not found",
    },
    messages: {
      pageNotFoundIntro:
        "Sorry 😔 — we couldn't find what you were looking for.",
      needHelp: "Need help finding something?",
      contactSupport:
        "Email <link>support@gatsbyjs.com</link> and we'll help you.",
    },
  },
  webhookCard: {
    webhookIntegration: "Webhook Integration",
    sendPostRequest:
      "Please send a POST request to this webhook URL whenever data is updated, so that these changes can be pushed to Gatsby Preview",
    previewWebhook: "Preview Webhook",
    buildsWebhook: "Builds Webhook",
  },
  branchList: {
    actions: {
      showOptions: "Show available options",
    },
    messages: {
      zeroResults: "No results",
    },
    labels: {
      searchPlaceholder: "Find a branch...",
    },
  },
  visitorAccess: {
    public: "Public",
    anyoneCanVisit: "Anyone can view your site's Preview and Build",
    passwordProtected: "Password protected",
    visitorHasToKnowPassword:
      "Password required to view your site's Preview and Build.",
    logInRequired: "Log in required",
    visitorMustHaveGatsbyAccount:
      "Gatsby Cloud account required to view your site's Preview and Build.",
    cantBeEmpty: "Can't be empty",
    editAccess: "Edit",
    setPassword: "Set Password",
    cancel: "Cancel",
    save: "Save",
    visitorAccess: "Access Control",
    updated: "updated",
    editVisitorAccess: "Edit Visitor Access",
    show: "Show",
    hide: "Hide",
  },
  previewLogin: {
    actions: {
      viewSite: "View site",
    },
    labels: {
      gatsbyPreviewLink: "Gatsby Preview",
      documentationLink: "Documentation",
      passwordField: "Password",
    },
    headers: {
      cloudAuthForm: "Please identify yourself to view this site",
      passwordAuthForm: "This site is password protected",
    },
    messages: {
      noPermission: "You do not have permissions to view this Preview",
      verificationFailed: "Failed to verify password",
    },
  },
  leadCapture: {
    headers: {
      heyThere: "Hey there!",
      trialInfo:
        "You’re getting access to a Gatsby Cloud <strong>{trialDays}-day {trialledPlanName} Trial</strong>",
      trialFeatures: "What does my free trial include?",
      trialEnd: "What happens after {trialDays} days?",
      welcomeFreeTier: "Welcome to Gatsby\u00A0<strong>Cloud</strong>",
      welcomeTrial:
        "Start your {trialDays}-day <strong>{trialingPlanName}</strong> trial",
      whatsIncludedFreeTier: "What’s included in our {freeTierPlanName} Plan?",
      whatsIncludedTrial: "What’s included in the trial?",
    },
    messages: {
      intro:
        "Before you continue, tell us about yourself! This will help us make Gatsby Cloud better for you.",
      trialEndDisclaimer:
        "No credit card required. After the {trialDays} days, you will automatically be downgraded to the <strong>{freeTierPlanName} plan.</strong>",
      trialledPlanFeatures: "All {trialledPlanName} features including:",
      trialFreeFeatures:
        "We will automatically switch you to the {freePlanName} Plan, which includes:",
      noCreditCardRequired: "No credit card required.",
    },
    labels: {
      firstName: "First name",
      lastName: "Last name",
      workEmail: "Work email",
      country: "Country",
      region: "State/Province",
      projectType: "I want to use Gatsby for...",
      projectTypeCompany: "Company Project",
      projectTypeClient: "Client Project",
      projectTypePersonal: "Personal Project",
    },
    actions: {
      submit: "Start building",
      proceedFreeTier: "Next",
      proceedTrial: "Start my free trial",
    },
  },
  upgrade: {
    headers: {
      upgradeToFreeTrial:
        "Would you like to upgrade to a <strong>{trialDays}-Day Free Trial?</strong>",
      upgradeDetails:
        "No credit card required. After the {trialDays} days you will automatically be downgraded to the <strong>Free Plan</strong>.",
    },
    messages: {
      automaticDowngrade:
        "No credit card required. After 14 days, you will automatically be downgraded to the <strong>Free Plan</strong>.",
    },
    actions: {
      pickTier1Trial: "No, continue with Free Plan",
      pickTier2Trial: "Yes, start Individual Trial",
      pickTier3Trial: "Yes, start Team Trial",
    },
  },
  deleteCDN: {
    actions: {
      delete: "Delete Integration",
    },
    headers: {
      deleteIntegration: "Delete Integration?",
    },
    messages: {
      areYouSure:
        "Are you sure you want to delete the <strong>{cdnVendorName} integration</strong> for <strong>{siteName}</strong>? Gatsby Cloud will stop triggering deploys for this site.",
      cdnIntegrationRemoved: "{cdnVendorName} integration removed successfully",
    },
  },
  publishReports: {
    addReport: "Add report",
    save: "Save",
    cancel: "Cancel",
    noPluginsYet: "You have not plug any build report in yet.",
    publishReports: "Reports",
  },
  userSettings: {
    orgsAndBilling: "Workspaces & Billing",
    followTheLink:
      "Follow the link to manage billing and members of workspaces that you own or admin.",
    personalDetails: "Personal Details",
    saveButton: "Save all changes",
    joined: "Joined",
    owns: "Owns",
    created: "Created",
    site: "site",
    noOrgsNote: "You are not part of any workspaces yet.",
    errorFetchingOrgs:
      "Oops. There was an error retrieving your workspaces. If the error persists, please email support at support@gatsbyjs.com.",
    yourAccount: "Your Account",
    accountOverview: "Overview",
    headers: {
      updateYourPersonalDetails: `Update your personal details`,
    },
    messages: {
      yourNameAndEmailHelpUs: `Your name and email address help us follow up on support tickets, inform you of maintenance or outages, and keep you up-to-date on events, research opportunities, and feature releases.`,
    },
    actions: {
      updateYourDetails: `Update your details`,
    },
  },
  maintenance: {
    headers: {
      maintenanceHeader: "Sorry, Gatsby is down for maintenance",
    },
    messages: {
      maintenanceDescription: "We will be back up shortly",
    },
  },
  previewStatus: {
    labels: {
      previewStopped:
        "Previews have stopped because your workspace is in idle mode.",
    },
  },
  buildStatus: {
    labels: {
      organizationActive: "Workspace is out of Overage period",
    },
  },
  importSite: {
    actions: {
      cmsIntegrationsSkip: "Skip this step",
      cmsIntegrationsNext: "Set up your site",
      seeMoreCmsIntegrations: "See more integrations",
      chooseSourceProvider: "Use {sourceProvider}",
      publishSite: "Create site",
      refreshList: "Refresh the list",
    },
    headers: {
      repositoryStepGitHub:
        "Select a <strong>GitHub organization and repository</strong>",
      repositoryStepGitLab:
        "Select a <strong>GitLab group and repository</strong>",
      repositoryStepBitbucket:
        "Select a <strong>Bitbucket workspace and repository</strong>",
      repositorySiteDetails: "Site Details",
      cmsIntegrationsStep:
        "Optional integrations for your site, <strong>{siteName}</strong>",
      cmsIntegrations: "Integrations",
      cmsOtherIntegrations: "Other integrations",
      cmsSuggestedIntegrations: "Suggested integrations",
      sourceProviderStep: "Select a Git provider",
      setupSiteStep: "Set up site for <strong>{repoName}</strong>",
      selectedBranch: "Branch to build from",
    },
    labels: {
      sourceProviderStep: "Git provider",
      repositoryStep: "Repository",
      integrationsStep: "Integrations",
      setupStep: "Setup",
      sourceProviderTeamFieldGitHub: "Select an Organization",
      sourceProviderTeamFieldGitLab: "Select a Group",
      sourceProviderTeamFieldBitbucket: "Select a Workspace",
      repositoryField: "Select a Repository",
      baseBranchField: "Base Branch",
      baseDirectoryField: "Base Directory",
      siteNameField: "Site Name",
    },
    messages: {
      loadingSourceProviderTeams: "Loading your repositories...",
      loadingRepositoryBranches: "Loading your repo branches…",
      refreshingSourceProviderTeams: "Refreshing the list...",
      baseDirectoryHint: "The default is set to the root directory",
      creatingSite: "Creating your site...",
      loadingIntegrations: "Loading available cms integrations...",
      cmsIntegrationsIntro:
        "Connecting to a CMS will make sure you have an accurate preview version of your site (a Gatsby Cloud preview instance).",
      cmsIntegraionsDocsInfo:
        "Not ready yet? That's ok! You can add multiple data sources at any time through the site settings. <link>Read more about integrations</link>",
      sourceProviderIntro:
        "Import your site to Cloud by selecting the Git provider where your code is stored.",
      loadingDataForSetup: "Loading site data...",
      setupLater:
        'Need help with environment variables of webhook setup? Go to "{integrationsStep}" step now or setup integrations later in your site settings.',
      noRepositoryWithThatName: "There is no a repository with that name.",
      fieldIsRequiredSelectRepository:
        "The field is required, select a repository.",
      noRepos: "No repos found",
    },
  },
  deployNow: {
    labels: {
      repositoryStep: "Repository",
      integrationsStep: "Integrations",
      setupStep: "Setup",
      configureRepository: "Configure your new repository",
      whichWorkspace: "Which workspace do you want to create the project in?",
      repoName: "What is the new repository name?",
    },
    messages: {
      creatingRepository: "Creating repository...",
      cloningRepo: "Cloning repository...",
      pushingRepository: "Pushing repository...",
      creatingSite: "Creating site...",
      success: "Success, proceeding...",
      addIt: "Add it",
      openWindowGithubAuthentication:
        "We just opened a new browser window to authenticate with GitHub. Accidentally closed the window?",
      waitAMoment:
        "Thank you. Please wait a few moments while we load your GitHub information.",
    },
  },
  ui: {
    actions: {
      back: "Back",
      cancel: "Cancel",
      gotIt: "Got it",
      next: "Next",
      save: "Save",
      edit: "Edit",
      remove: "Remove",
      continue: "Continue",
      turnOn: "Turn on",
      turnOff: "Turn off",
      yesTurnOff: "Yes, Turn off",
      returnToHomepage: "Back to homepage",
      editSettings: "Edit settings",
    },
    labels: {
      removing: "Removing",
      updating: "Updating",
      disabled: "Disabled",
      enabled: "Enabled",
    },
    messages: {
      graphqlError: "Error: {errorText}",
      validationCantBeEmpty: "Can't be empty",
      validationIsRequired: "This field is required",
      validationInvalidEmail: "Invalid email",
      internalServerError: "Internal server error",
      saving: "Saving",
    },
  },
  releaseNotes: {
    headers: {
      title: "Latest Releases & Updates for Gatsby Cloud",
      emptyState: "There are no release notes for now.",
    },
    messages: {
      stayTuned:
        "This page will list all the new features, bugfixes and maintenances occuring on Gatsby Cloud.",
    },
    actions: {
      viewDetails: "View details",
    },
    labels: {
      newFeature: "New feature",
      maintenance: "Maintenance",
      bugfix: "Bug fix",
    },
  },
  announcementWorkspaces: {
    headers: {
      title: "New feature announcement",
      featureTitle: "Introducing Gatsby\u00A0Cloud\u00A0Workspaces",
    },
    messages: {
      catchPhrase:
        "We’re excited to share an update that makes Gatsby Cloud even easier to use. Here’s a quick summary of the most important changes that you’ll see when you log in today:",
      features: [
        "Organizations are now known as Workspaces",
        "New sites can be added to a Workspace from any repository or organization in Github",
        "You can create new Workspaces with separate subscriptions, giving you the flexibility to organize your sites to match your needs",
      ],
    },
    actions: {
      viewWorkspaces: "Go to workspaces",
      goToReleaseNotes: "See all release notes",
      seeReleaseNotes: "See release notes",
      openNewAnnouncement: "See the new announcements",
    },
  },
  cdnIntegration: {
    morphemes: {
      netlifySite: "Site",
      netlifyAccount: "Account",
      fastlyService: "Service",
      firebaseProject: "Project",
      firebaseSite: "Site",
      amazonS3Bucket: "Bucket",
      gcloudStorageBucket: "Bucket",
      vercelProject: "Project",
      vercelTeam: "Team",
      azureStorageAccount: "Storage Account Name",
    },
    actions: {
      connectShort: "Connect",
      connectCdn: "Connect {cdnName}",
      manageCdn: "Manage {cdnName} integration",
    },
    headers: {
      amazonS3IntegrationTitle: "AWS S3 Integration",
      azureIntegrationTitle: "Azure Integration",
      fastlyIntegrationTitle: "Fastly Integration",
      firebaseIntegrationTitle: "Firebase Integration",
      gcloudStorageIntegrationTitle: "Google Cloud Storage Integration",
      netlifyIntegrationTitle: "Netlify Integration",
      vercelIntegrationTitle: "Vercel Integration",
      authorizeCdn:
        "Do you authorize your Gatsby Cloud site to integrate with {cdnVendorName}?",
    },
    messages: {
      cdnIntegrationUpdated: "CDN configuration updated",
      vendorNotSupported:
        "{cdnVendorName} integration does not seem to be supported",
    },
    labels: {
      siteDeploysTo: "Deploys to {cdnVendorName}",
    },
  },
  netlifyIntegrationConfig: {
    actions: {
      connect: "Connect",
      create: "Create",
      switchToExistingSite:
        "Click here to connect to an existing Netlify deployment site",
      switchToNewSite: "Click here to connect to a new Netlify deployment site",
    },
    headers: {
      connectToSite: "Connect Netlify to <strong>{siteName}</strong>",
      connectToExisting: "Connect to an existing Netlify deployment site.",
      connectToNew: "Create a new deployment site on Netlify",
    },
    labels: {
      selectAccount: "Select Netlify team",
      selectSite: "Choose a Netlify site to publish to",
      siteName: "Netlify deployment site name",
      sitePlaceholder: "Find a site...",
    },
    messages: {
      authorizingNetlify:
        "We just opened a new browser window to authorize with Netlify. Accidentally closed the window?",
      connectToNewSiteCallout:
        "Want to connect this Gatsby Cloud site to a new Netlify deployment site? <button>Click here</button>",
      connectToExistingSiteCallout:
        "Want to connect this Gatsby Cloud site to an existing Netlify deployment site? <button>Click here</button>",
      accountValidateRequired: "You have to select a Netlify team.",
      siteValidateRequired: "You have to pick a Netlify site.",
      siteNameValidateRequired: "You have to enter a Netlify site name.",
      siteNameValidateFormat:
        "Only alphanumeric characters and hyphens are allowed.",
      loadingSites: "Loading your sites...",
      noSites: "No sites found",
      noMatchingSites: "No matching sites found",
      siteCreationFailed: "Unable to create Netlify site",
    },
  },
  firebaseIntegrationConfig: {
    actions: {
      connect: "Connect",
    },
    headers: {
      connectToSite: "Connect Firebase to <strong>{siteName}</strong>",
      noProjects: "No projects found on Firebase",
    },
    labels: {
      selectProject: "Select project",
      firebaseProject: "Choose a Firebase project for deployment",
      firebaseSiteName:
        "Enter a Firebase site name (for projects with multiple sites)",
    },
    messages: {
      authorizingFirebase:
        "We just opened a new browser window to authorize with Firebase. Accidentally closed the window?",
      projectCreationInstructions:
        "Create a Firebase project at <link>https://console.firebase.google.com</link>",
    },
  },
  vercelIntegrationConfig: {
    actions: {
      connect: "Connect",
      create: "Create",
      switchToExistingSite:
        "Click here to connect to an existing Vercel deployment",
      switchToNewSite: "Click here to connect to a new Vercel deployment",
    },
    headers: {
      connectToSite: "Connect Vercel to <strong>{siteName}</strong>",
      connectToNew: "Create a new deployment on Vercel",
      connectToExisting:
        "Connect this Gatsby Cloud site to an existing Vercel deployment",
    },
    labels: {
      vercelProjectTeam: "Vercel team",
      teamPersonalLabel: "Personal Account",
      vercelProjectName: "Vercel project name",
      vercelProjectId: "Choose a Vercel project to publish to",
      selectProject: "Select project",
    },
    messages: {
      authorizingVercel:
        "We just opened a new browser window to authorize with Vercel. Accidentally closed the window?",
      connectToNewSiteCallout:
        "Want to connect this Gatsby Cloud site to a new Vercel project? <button>Click here</button>",
      connectToExistingSiteCallout:
        "Want to connect this Gatsby Cloud site to an existing Vercel project? <button>Click here</button>",
      projectNameValidateFormat:
        "Only alphanumeric characters and hyphens are allowed.",
    },
  },
  azureIntegrationConfig: {
    labels: {
      azureConnectionString: "Connection String",
      azureStorageAccount: "Storage Account Name",
    },
    messages: {
      introText: "Set up deployment target",
    },
  },
  gcloudStorageIntegrationConfig: {
    labels: {
      gcsProjectId: "Project ID",
      gcsKeyData: "Service Account Key",
      gcsBucket: "Bucket Name",
      gcsFileKeyPrefix: "File Key Prefix",
    },
    messages: {
      introText: "Set up deployment target",
      gcsKeyDataDescription: "JSON format. Requires Storage Object Admin",
    },
  },
  fastlyIntegrationConfig: {
    labels: {
      fastlyToken: "Fastly API token",
      fastlyServiceName: "Fastly service name",
      fastlyHostName: "Fastly host name",
      fastlyForceSSL: "Force TLS/SSL",
      fastlyTlsKey: "Private Key",
      fastlyTlsCert: "Certificate",
    },
    messages: {
      introText: "Set up deployment target",
    },
  },
  amazonS3IntegrationConfig: {
    labels: {
      s3AccessKeyID: "Access Key ID",
      s3SecretAccessKey: "Secret Access Key",
      s3BucketName: "Bucket Name",
      s3FileKeyPrefix: "File Key Prefix",
      s3CloudFrontDistributionId: "CloudFront Distribution ID",
      s3InvalidationPaths: "CloudFront Invalidation Paths",
    },
    messages: {
      introText: "Set up deployment target",
    },
  },
  gatsbyCloudCdnIntegrationConfig: {
    actions: {
      addDomain: "Add domain",
      enable: "Turn on",
      disable: "Turn off",
      useCustomCertificate: "Use custom certificate",
      remove: "Remove",
      makePrimary: "Make primary",
      edit: "Edit",
      checkStatus: "Check Status",
      viewDetails: "View details",
      requestCertificate: "Turn on automatic certificates",
      requestCertificateAgain: "Re-request certificate",
    },
    headers: {
      setupGatsbyCloudCdn: "Deploy to Gatsby Hosting",
      connectedDomains: "Connected domains",
      sslCertificates: "SSL Certificates",
      removeDomain: "Remove domain",
      turnOnAutomaticCertificate: "Turn on automatic certificates",
      useCustomCertificate: "Use custom certificate",
      removeCertificate: "Remove certificate",
      addDomain: "Add Domain",
      turnOff: "Turn off?",
      makeDomainPrimary: "Make domain primary",
    },
    labels: {
      connected: "On",
      notConnected: "Off",
      connecting: "Connecting…",
      domainField: "Please enter a domain",
      certificate: "Certificate",
      privateKey: "Private key",
      intermediateCertificates: "Intermediate certificates",
      httpsOn: "HTTPS On",
      httpsFailed: "Certificate generation failed",
      sslCertificateRequested: "SSL Certificate requested",
      type: "Type",
      value: "Value",
      domains: "Domain(s)",
      created: "Created",
      expires: "Expires",
      serialNumber: "Serial Number",
      managed: "Managed by Gatsby Hosting",
      custom: "Custom Certificate",
    },
    messages: {
      features: ["Use your own domain", "Get a free SSL certificate"],
      success:
        "Have any question about Hosting? <link>Read our docs to learn more</link>.",
      certificateHint: "Place your PEM formatted certificate",
      privateKeyHint: "Place your private key",
      pleaseUpdateDnsRecord:
        "Please update your DNS records to validate domain(s)",
      checkStatus:
        "Check status (changes can take up to 24 hours to propagate) or <link>see the docs</link>",
      gatsbyCloudTurnedOn: "Gatsby Hosting turned on",
      gatsbyCloudTurnedOff: "Gatsby Hosting turned off",
      domainRemoved: "The <strong>{domain}</strong> domain removed.",
      managedCertificateTurnedOn:
        "Managed certificates for <strong>{domain}</strong> turned on",
      makeDomainPrimary: "The <strong>{domain}</strong> domain set as primary.",
      certificateRemoved: "The certificate removed.",
      domainAdded: "The <strong>{domain}</strong> domain added.",
      areYouSureYouWantToRemoveDomain:
        "Are you sure you want to remove the <strong>{domain}</strong> domain?",
      areYouSureYouWantToRemoveCertificate:
        "Are you sure you want to remove the certificate for domains(s) <strong>{domains}</strong>?",
      areYouSureYouWantToMakeDomainPrimary:
        "Are you sure you want to make <strong>{domain}</strong> primary?",
      mustBeValidDomainName: "This field must be a valid domain name",
      doYouWantToRemoveDomain: "Do you want to remove the {domain}?",
      doYouWantToRemoveCertificate:
        "Do you want to remove the certificate for domain(s): {domains}?",
      doYouWantToTurnOffGatsbyCloudCDN:
        "Do you want to turn off Gatsby Hosting?",
      doYouWantToMakeDomainPrimary: "Do you want to make the {domain} primary?",
      doYouWantToTurnOnAutomaticCertificate:
        "Do you want to turn on automatic certificates for <strong>{domain}</strong>?",
      doYouWantToTurnOnAutomaticCertificateAria:
        "Do you want to turn on automatic certificates for {domain}?",
      areYouSureYouWantToTurnOffGatsbyCloudCDN:
        "Are you sure you want to turn off Gatsby Hosting for <strong>{siteName}</strong>?",
      turnOffAutomaticCertificateWarning:
        "This will turn off automatic certificates and use your custom certificate instead.",
      notValidated: "Not validated",
      errorOccured: "An error occured!",
      generatingSslCertificate: "Generating SSL certificate",
      sslCertificateAdded: "SSL certificate added",
      placeYourPrivateKey: "Place your private key",
      placeYourPemFormatedCertificate: "Place your PEM formatted certificate",
      placeYourCaCertificateChain: "Place your CA certificate chain",
      validating: "Validating...",
      loadingDetails: "Loading details...",
      generatingCertificate: "1/2 Certificate being generated",
      uploadingCertificate: "2/2 Uploading certificate to CDN",
      validationMustBeValidDomain: "This field must be a valid domain name",
      thisWillRemoveAndMakeDomainsUnavailable:
        "This will remove your site from our CDN such that users will not be able to access your site and will make the following domains unavailable until you set up another hosting integration:",
      youReachedMaxDomains:
        "You reached the max number ({maxDomains}) of custom domains per site",
    },
  },
  notificationDeploys: {
    headers: {
      noNotificationIntegrations: "No outgoing notifications",
      removeNotificationIntegration: "Remove a notification",
    },
    actions: {
      addNotification: "Add Notification",
      yesRemoveNotificationIntegration: "Yes, remove the notification",
    },
    labels: {
      slack: "Slack",
      email: "Email",
      webhooks: "Webhooks",
      prComment: "Pull-request comment",
      addWebhookDeployNotification: "Add an outgoing webhook",
      addSlackDeployNotification: "Add a Slack integration",
      addEmailDeployNotification: "Add an email notification",
      addPullRequestCommentDeployNotification:
        "Add a pull-request comment notification",
      eventToListen: "Event to listen",
      outgoingWebhooks: "Outgoing webhook URL:",
      eventTypePlaceholder: "Select an event",
      eventTypeBuildSucceeded: "Build Succeeded",
      eventTypeBuildFailed: "Build Failed",
      eventTypeDeploySucceeded: "Deploy Succeeded",
      eventTypeDeployFailed: "Deploy Failed",
    },
    messages: {
      triggerHttpPostRequest:
        "Trigger an HTTP POST request to <a>{url}</a> when a <strong>{status}</strong>.",
      createPullRequestComment:
        "Create a pull-request comment when a <strong>{status}</strong>.",
      slackWebhook:
        "Send a messsage to a Slack channel when a <strong>{status}</strong>.",
      specificEventsIntro: "This will be triggered when:",
      buildSucceeded: "build succeeds",
      buildFailed: "build fails",
      deploySucceeded: "deploy succeeds",
      deployFailed: "deploy fails",
      loadingNotificationDeploys: "Loading notifications",
      addNewIntegration:
        'To add a new outgoing notification, click on the "Add Notification" button.',
      notificationSuccessfullyCreated: "Notification successfully created",
      notificationSuccessfullyRemoved: "Notification successfully removed",
      removeNotificationIntegrationContent:
        "Are you sure you want to delete this notification?",
      failedToRemoveNotification: "Failed to remove this notification",
      webhookHint: "For example: https://my-services/webhooks/",
      webhookSlackHint:
        "For example: https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX",
    },
  },
  cmsPreview: {
    actions: {
      restart: "Restart preview",
      viewMoreActions: "More actions",
      clearCacheAndRestart: "Clear cache and restart",
    },
    headers: {
      previewBuildsDisabled: "Preview builds are disabled for this site",
    },
    messages: {
      previewBuildsDisabledDescriptionReadAccess:
        "Please contact the site's owner to enable preview builds",
      previewBuildsDisabledDescription:
        "Go to <link>Site Settings</link> to enable preview builds",
    },
  },
  acceptInvitation: {
    messages: {
      acceptingInvitation: "Accepting invitation…",
    },
  },
  errorAlert: {
    headers: {
      defaultHeader: "Something went wrong",
    },
    messages: {
      somethingWentWrong: "Something went wrong",
      supportIntro: "Woops! Getting in trouble? — we are happy to help you!",
      supportContact:
        "If you need assistance, please contact our support team.",
    },
    actions: {
      contactSupport: "Contact Support",
    },
  },
  previewLoader: {
    headers: {
      error: "Oh no!",
    },
    messages: {
      loading: "Polishing your site...",
      error: "We've run into an error previewing your site.",
      loadingTooltip: "Building a new preview",
    },
  },
}
