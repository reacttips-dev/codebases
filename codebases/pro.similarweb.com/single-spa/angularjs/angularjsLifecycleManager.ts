declare global {
    // eslint:disable-next-line:interface-name
    interface Window {
        angular?: any;
    }
}

const defaultOpts = {
    // required opts
    angular: null,
    domElementGetter: null,
    mainAngularModule: null,

    // Optional opts
    uiRouter: false,
    preserveGlobal: false,
    appRemainsMounted: false,
    elementId: "__single_spa_angular_1",
    strictDi: false,
    template: undefined,
};

function getContainerEl(opts): HTMLElement {
    const element = opts.domElementGetter();
    if (!element) {
        throw new Error(`domElementGetter did not return a valid dom elemnt`);
    }

    return element;
}

function bootstrap(): Promise<void> {
    return Promise.resolve();
}

function mount(opts, mountedInstances): Promise<void> {
    return Promise.resolve().then(() => {
        if (opts.angular !== window.angular && !opts.preserveGlobal) {
            window.angular = opts.angular;
        }

        const containerEl = getContainerEl(opts);
        if (
            !opts.appRemainsMounted &&
            (containerEl.innerHTML === "" || containerEl.innerHTML === undefined)
        ) {
            const bootstrapEl = document.createElement("div");
            bootstrapEl.id = opts.elementId;

            containerEl.appendChild(bootstrapEl);

            if (opts.uiRouter) {
                const uiViewEl = document.createElement("div");
                uiViewEl.setAttribute("ui-view", opts.uiRouter === true ? "" : opts.uiRouter);
                bootstrapEl.appendChild(uiViewEl);
            }

            if (opts.template) {
                bootstrapEl.innerHTML = opts.template;
            }

            if (opts.strictDi) {
                mountedInstances.instance = opts.angular.bootstrap(
                    bootstrapEl,
                    [opts.mainAngularModule],
                    { strictDi: opts.strictDi },
                );
            } else {
                mountedInstances.instance = opts.angular.bootstrap(bootstrapEl, [
                    opts.mainAngularModule,
                ]);
            }
        } else {
            containerEl.style.display = "block";
        }
    });
}

function unmount(opts, mountedInstances): Promise<void> {
    return new Promise((resolve) => {
        const container = getContainerEl(opts);
        if (!opts.appRemainsMounted) {
            mountedInstances.instance.get("$rootScope").$destroy();
            container.innerHTML = "";
        } else {
            container.style.display = "none";
        }

        if (opts.angular === window.angular && !opts.preserveGlobal) {
            delete window.angular;
        }

        setTimeout(resolve);
    });
}

export default function singleSpaAngularJS(userOpts) {
    if (typeof userOpts !== "object") {
        throw new Error(`single-spa-angularjs requires a configuration object`);
    }

    const opts = {
        ...defaultOpts,
        ...userOpts,
    };

    if (!opts.angular) {
        throw new Error(`single-spa-angularjs must be passed opts.angular`);
    }

    if (!opts.mainAngularModule) {
        throw new Error(`single-spa-angularjs must be passed opts.mainAngularModule string`);
    }

    const mountedInstances = {};

    return {
        bootstrap: bootstrap.bind(null, opts, mountedInstances),
        mount: mount.bind(null, opts, mountedInstances),
        unmount: unmount.bind(null, opts, mountedInstances),
    };
}
