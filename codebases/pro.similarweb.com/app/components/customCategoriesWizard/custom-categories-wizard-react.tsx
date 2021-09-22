import * as React from "react";
import { useEffect, useRef, useState } from "react";
import * as classNames from "classnames";
import { useTrack } from "../../../.pro-features/components/WithTrack/src/useTrack";
import { Injector } from "common/ioc/Injector";
import { i18nFilter } from "filters/ngFilters";
import { hasMarketingPermission } from "services/Workspaces.service";
import { ECategoryType, ICategory } from "common/services/categoryService.types";
import { WebsiteListTypeSelectorContainer } from "components/website-list-selector/WebsiteListTypeSelectorContainer";
import * as _ from "lodash";
import {
    domainsValidation,
    domainValidator,
    ECustomCategoriesDomainsValidation,
} from "components/customCategoriesWizard/validators";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import RegexPatterns from "services/RegexPatterns";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { SWReactIcons } from "@similarweb/icons";
import { ScrollArea } from "@similarweb/ui-components/dist/react-scrollbar";
import { Button } from "@similarweb/ui-components/dist/button";
import { InPlaceEditReact } from "components/in-place-edit/inPlaceEditReact";
import { marketingWorkspaceApiService } from "services/marketingWorkspaceApiService";
import { showSuccessToast } from "actions/toast_actions";
import { getToastItemComponent } from "components/React/Toast/ToastItem";
import swLog from "@similarweb/sw-log";
import { AutocompleteWebsitesMainItem } from "components/AutocompleteWebsites/AutocompleteWebsitesMainItem";
import { IChosenItem } from "../../@types/chosenItems";
import { UserCustomCategoryService } from "services/category/userCustomCategoryService";
import categoryService from "common/services/categoryService";
import { sitesResourceService } from "services/sitesResource/sitesResourceService";

enum ECustomCategoriesWizardMode {
    NEW,
    EDIT,
}

interface ICustomCategoryDomain {
    domain: string;
    valid: boolean;
    favicon?: string;
}

export const MAX_DOMAINS_IN_CATEGORY = 300;

const errorMessages = {
    domainsLimitation: i18nFilter()("customcategories.wizard.error.limitation"),
    domainsFormat: i18nFilter()("customcategories.wizard.error.format"),
    duplicateName: i18nFilter()("customcategories.wizard.error.duplicatename"),
    emptyName: i18nFilter()("customcategories.wizard.error.emptyname"),
    emptyDomainsList: i18nFilter()("customcategories.wizard.error.emptydomains"),
    duplicateDomain: i18nFilter()("customcategories.wizard.error.duplicatedomain"),
    duplicatedRemoved: i18nFilter()("customcategories.wizard.error.duplicateremoved"),
    serverError: i18nFilter()("custom.category.server.error"),
    specialCharactersNotAllowed: i18nFilter()("custom.category.name.error"),
};

const createDomain = (domain: string, favicon: string) => {
    const d: string = _.trim(domain, " /")
        .toLowerCase()
        .replace(/^(https?:\/\/)?(www\.)?/, "");
    return {
        domain: d,
        valid: domainValidator.test(d) && d.indexOf("/") == -1,
        favicon,
    };
};

export interface ICustomCategoriesWizardReactProps {
    onClose?: VoidFunction;
    placeholder?: string;
    namePlaceholder?: string;
    editorTitle?: string;
    initialCategoryType?: ECategoryType;
    isCategoryTypeDisabled?: boolean;
    customCategoryId?: string;
    customCategoryName?: string;
    showDeleteButton?: boolean;
    reloadOnDelete?: boolean;
    onSave?: (
        {
            ctrl: { categoryName, initialCategoryName },
        },
        data: any,
    ) => any;
    onDelete?: (
        {
            ctrl: { categoryName, initialCategoryName },
        },
        data: any,
    ) => any;
    stayOnPage?: boolean;
}
export const CustomCategoriesWizardReact: React.FC<ICustomCategoriesWizardReactProps> = ({
    onClose,
    placeholder,
    namePlaceholder,
    editorTitle,
    initialCategoryType,
    isCategoryTypeDisabled,
    customCategoryId,
    customCategoryName,
    showDeleteButton,
    reloadOnDelete,
    onSave,
    onDelete,
    stayOnPage,
}) => {
    const [focused, setFocused] = useState(false);
    const [hideCategoryNameErrorMessage, setHideCategoryNameErrorMessage] = useState(false);
    const [track, trackWithGuid] = useTrack();
    // services
    const swNavigator = useRef(Injector.get("swNavigator"));
    const sitesResource = useRef(Injector.get("sitesResource"));
    const $ngRedux = useRef(Injector.get("$ngRedux"));

    const shouldStayOnPage = useRef(stayOnPage);

    const [categoryType, setCategoryType] = useState<ECategoryType>(initialCategoryType);
    const [mode, setMode] = useState<ECustomCategoriesWizardMode>(
        customCategoryId || customCategoryName
            ? ECustomCategoriesWizardMode.EDIT
            : ECustomCategoriesWizardMode.NEW,
    );
    const [categoryId, setCategoryId] = useState<string>();
    const [categoryName, setCategoryName] = useState<string>("");
    const initialCategoryName = useRef<string>("");
    const [domains, setDomains] = useState<ICustomCategoryDomain[]>([]);
    // TODO: maybe we can get rid of this flag, and only check if we have domain without icon each time the domains changed?
    const [shouldSyncFavicons, setShouldSyncFavicons] = useState(false);
    const [confirmBeforeLeaving, setConfirmBeforeLeaving] = useState(false);
    const [loading, setLoading] = useState(false);
    const [invalidName, setInvalidName] = useState<string | boolean>(false);
    const [invalidDomains, setInvalidDomains] = useState<string | boolean>(false);
    const [hideDomainErrorMessage, setHideDomainErrorMessage] = useState(false);
    const [duplicateDomains, setDuplicateDomains] = useState<string | boolean>(false);

    // constructor
    useEffect(() => {
        let predictate;
        if (customCategoryId || customCategoryName) {
            if (customCategoryName) {
                predictate = { text: customCategoryName };
            }

            if (customCategoryId) {
                predictate = { categoryId: customCategoryId };
            }

            const category = _.find<ICategory>(userCategories, predictate);
            if (category) {
                setCategoryId(category.categoryId);
                setCategoryName(category.text);
                initialCategoryName.current = category.text;
                const tempDomains = _.map(category.domains, function (domain: string) {
                    return { domain, valid: true };
                });
                setDomains(tempDomains);
                setCategoryType(category.categoryType ? category.categoryType : undefined);
            }
        }
    }, []);

    // since `mode` could be set only once, it is safe to use the useEffect hook
    useEffect(() => {
        if (mode === ECustomCategoriesWizardMode.NEW) {
            track("Pop Up", "open", "Create New Category");
        }
        if (mode === ECustomCategoriesWizardMode.EDIT) {
            setShouldSyncFavicons(true);
        }
    }, [mode]);

    useEffect(() => {
        async function syncFavicons() {
            const domainsWithoutIcons = domains
                .filter((domain) => !domain.favicon)
                .map((domain) => domain.domain);
            if (domainsWithoutIcons.length === 0) {
                return;
            }
            const response = await sitesResourceService.getWebsitesFavicons(domainsWithoutIcons);
            const newDomains = domains.map((domain) => {
                return {
                    ...domain,
                    favicon: domain.favicon || response[domain.domain],
                };
            });
            setDomains(newDomains);
            setShouldSyncFavicons(false);
        }

        syncFavicons();
    }, [shouldSyncFavicons, domains]);

    const maxDomains = MAX_DOMAINS_IN_CATEGORY;
    const userCategories = UserCustomCategoryService.getCustomCategories();
    const namePlaceholderText = i18nFilter()(namePlaceholder);
    const hasMarketingWorkspace = hasMarketingPermission();

    const onCategoryTypeChange = (type) => {
        setCategoryType(type);
    };
    const _track = (...params) => {
        track(params[0], params[1], params[2]);
    };
    const onCloseClick = () => {
        _track("Pop Up", "click", "Create New Category/Cancel");
        onClose();
    };
    const onFocus = () => {
        setFocused(true);
        setHideCategoryNameErrorMessage(true);
    };
    const onBlur = () => {
        setFocused(false);
        setHideCategoryNameErrorMessage(true);
    };
    const onSaveCategory = () => {
        if (confirmBeforeLeaving) {
            track("Internal Link", "click", "Industry Analysis/View Category/" + categoryName);
            navigateToCategory();
        } else {
            setInvalidName(false);
            setInvalidDomains(false);
            setHideCategoryNameErrorMessage(false);
            setHideDomainErrorMessage(false);

            const duplicateName = validateCategoryName();
            const emptyName = _.isEmpty(categoryName);

            if (duplicateName || emptyName) {
                setInvalidName(duplicateName);
                setInvalidName(
                    duplicateName ? errorMessages.duplicateName : errorMessages.emptyName,
                );
                track("Pop Up", "warning", "Create New Category/Error/Required Field");
            }

            domainsVal(true, domains);

            if (duplicateName || emptyName) {
                return;
            } else {
                if (mode == ECustomCategoriesWizardMode.NEW) {
                    track(
                        "Pop Up",
                        "click",
                        `Create New Category/Save/${categoryName};${domains.length}`,
                    );
                    addCategory();
                } else if (mode == ECustomCategoriesWizardMode.EDIT) {
                    track(
                        "Pop Up",
                        "click",
                        `Edit Category/Save/${categoryName};${domains.length}`,
                    );
                    updateCategory();
                }
            }
        }
    };

    const domainsVal = (withTracking: boolean, domains) => {
        const validationResult = domainsValidation(domains, maxDomains);
        switch (validationResult) {
            case ECustomCategoriesDomainsValidation.INVALID_LENGTH:
                setInvalidDomains(errorMessages.domainsLimitation);
                withTracking &&
                    track(
                        "Pop Up",
                        "warning",
                        `Create New Category/Error/Over ${maxDomains} websites`,
                    );
                return;
            case ECustomCategoriesDomainsValidation.INVALID_FORMAT:
                setInvalidDomains(errorMessages.domainsFormat);
                withTracking &&
                    track("Pop Up", "warning", "Create New Category/Error/Invalid Format");
                return;
            case ECustomCategoriesDomainsValidation.DOMAIN_DUPLICATED:
                setInvalidDomains(errorMessages.duplicateDomain);
                withTracking &&
                    track("Pop Up", "warning", "Create New Category/Error/Duplicated domains");
                return;
            default:
                setInvalidDomains(false);
                setHideDomainErrorMessage(false);
                return;
        }
    };

    const navigateToCategory = () => {
        setLoading(true);
        const gotoPage = confirmBeforeLeaving
            ? "industryAnalysis-overview"
            : swNavigator.current.current().name;
        const currentParams = swNavigator.current.getParams();
        const categoryObject = UserCustomCategoryService.getCustomCategoryByName(categoryName);
        swNavigator.current.go(
            gotoPage,
            Object.assign(currentParams, { category: categoryObject?.forUrl }),
            { reload: true },
        );
        onClose();
    };

    const validateCategoryName = () => {
        // if the user didn't change the category name
        if (categoryName == initialCategoryName.current) {
            return false;
        } else {
            return _.some(userCategories, { name: categoryName });
        }
    };

    const onInputChange = (e) => {
        // track if the user start to input a group name
        if (categoryName.length === 1) {
            TrackWithGuidService.trackWithGuid(
                "workspace.marketing.sidebar.partner_lists.create_partner_list.pop_up",
                "value-ok",
            );
        }
        setCategoryName(e.target.value);
        if (RegexPatterns.testCustomCategoryNameUnicode(e.target.value)) {
            setInvalidName(errorMessages.specialCharactersNotAllowed);
            setHideCategoryNameErrorMessage(false);
        } else {
            setInvalidName(false);
        }
    };

    const removeDomain = (index: number, $event: any) => {
        $event.stopPropagation();
        const newDomains = [...domains];
        const domain: any = newDomains.splice(index, 1);
        if (mode == ECustomCategoriesWizardMode.NEW) {
            track("Pop Up", "click", `Create New Category/Remove Domain/${domain.domain}`);
        } else if (mode == ECustomCategoriesWizardMode.EDIT) {
            track("Pop Up", "click", `Edit Category/Remove Domain/${domain.domain}`);
        }
        setDomains(newDomains);
        domainsVal(false, newDomains);
    };

    const isDomainAlreadyExists = (domain: string) => {
        return domains.find((d) => d.domain === domain);
    };
    const addDomain = ($event: any, domain: any, favicon: string) => {
        if (typeof domain !== "string") {
            domain = domain.name;
        }
        if (!domain) {
            return;
        }

        if (isDomainAlreadyExists(domain)) {
            setInvalidDomains(errorMessages.duplicateDomain);
            if ($event) {
                $event.stopPropagation();
            }
            return;
        }
        const newDomains = [createDomain(domain, favicon), ...domains];
        setDomains(newDomains);
        switch (mode) {
            case ECustomCategoriesWizardMode.NEW:
                track("Pop Up", "click", `Create New Category/Add Domain/${domain}`);
                break;
            case ECustomCategoriesWizardMode.EDIT:
                track("Pop Up", "click", `Edit Category/Add Domain/${domain}`);
                break;
        }
        domainsVal(false, newDomains);
    };

    const onFinishEditDomain = (domain, originalDomain) => {
        if (mode == ECustomCategoriesWizardMode.NEW) {
            track("Pop Up", "click", `Create New Category/Edit Domains/${domain}`);
        } else if (mode == ECustomCategoriesWizardMode.EDIT) {
            track("Pop Up", "click", `Edit Category/Edit Domains/${domain}`);
        }

        if (domain !== originalDomain) {
            const updatedDomainIndex = domains.findIndex((d) => d.domain === originalDomain);
            if (updatedDomainIndex > -1) {
                const newDomains = [...domains];
                const updatedDomain = {
                    ...newDomains[updatedDomainIndex],
                    domain,
                    favicon: null,
                };
                newDomains.splice(updatedDomainIndex, 1, updatedDomain);
                setDomains(newDomains);
                domainsVal(false, newDomains);
            }
        }
    };

    const addCategory = async () => {
        setLoading(true);
        try {
            const data = await UserCustomCategoryService.addCustomCategory({
                name: categoryName,
                domains: _.map(domains, (domain) => domain.domain),
                CategoryType: categoryType,
            });

            // SIM-29458: create empty workspace if the user doesn't have one
            if (categoryType === ECategoryType.PARTNERS_LIST) {
                const workspaceId = await marketingWorkspaceApiService.getOrCreateAnEmptyWorkspace();
                if (workspaceId) {
                    const createdCategory = data.find((d) => d.Name === categoryName);
                    // create a link to tha newly created workspace
                    const href = swNavigator.current.href("marketingWorkspace-websiteGroup", {
                        workspaceId,
                        websiteGroupId: createdCategory.Id,
                    });
                    // prevent redirect
                    shouldStayOnPage.current = true;
                    setLoading(false);
                    // close the popup
                    onClose();
                    // show the toast
                    $ngRedux.current.dispatch(
                        showSuccessToast(
                            getToastItemComponent({
                                text: i18nFilter()(
                                    "customcategories.wizard.editor.toast.workspace.text",
                                ),
                                linkText: i18nFilter()(
                                    "customcategories.wizard.editor.toast.workspace.link.text",
                                ),
                                href,
                            }),
                        ),
                    );
                }
            }

            //If onSave parameter was passed trigger it
            if (typeof onSave === "function") {
                // TODO: remove ctrl when available
                onSave(
                    { ctrl: { categoryName, initialCategoryName: initialCategoryName.current } },
                    data,
                );
            }

            if (!shouldStayOnPage.current) {
                navigateToCategory();
            }
        } catch (error) {
            swLog.log(error);
            setInvalidName(errorMessages.serverError);
            setLoading(false);
        }
    };

    const updateCategory = () => {
        const update = UserCustomCategoryService.updateCustomCategory({
            name: categoryName,
            domains: _.map(domains, (domain) => domain.domain),
            id: categoryId,
            CategoryType: categoryType,
        });
        setLoading(true);
        update.then(
            (updatedCustomCategories) => {
                //If onSave parameter was passed trigger it
                if (typeof onSave === "function") {
                    // TODO: remove ctrl when avaiable
                    onSave(
                        {
                            ctrl: {
                                categoryName,
                                initialCategoryName: initialCategoryName.current,
                            },
                        },
                        updatedCustomCategories,
                    );
                }
                if (!shouldStayOnPage.current) {
                    navigateToCategory();
                }
            },
            function (error) {
                swLog.log(error);
                setInvalidName(errorMessages.serverError);
                setLoading(false);
            },
        );
    };

    const deleteCategory = () => {
        setLoading(true);
        let currentCategory;
        const currentState = swNavigator.current.current();
        const currentStateParams = swNavigator.current.getParams();
        currentCategory = currentStateParams.category
            ? categoryService.categoryQueryParamToCategoryObject(currentStateParams.category)
            : null;
        if (currentStateParams.partnerListId) {
            currentCategory = _.find(UserCustomCategoryService.getCustomCategories(), {
                categoryId: currentStateParams.partnerListId,
            });
        }
        // Run delete action via the user service
        const deleteAction = UserCustomCategoryService.deleteCustomCategory({ id: categoryId });
        deleteAction.then(
            (updatedCustomCategories) => {
                //If onDelete parameter was passed trigger it
                if (typeof onDelete === "function") {
                    onDelete(
                        { ctrl: { categoryName, initialCategoryName } },
                        updatedCustomCategories,
                    );
                }
                // Once the category has been deleted - check if the current page has this category selected
                // if so - redirect to the current state homepage. otherwise - refresh the page, so that
                // the category will not appear in the lists anymore.
                const shouldRedirectToHomeState = currentCategory?.categoryId === categoryId;
                const targetState = shouldRedirectToHomeState
                    ? currentState.homeState
                    : currentState;
                setLoading(false);
                onClose();
                swNavigator.current.go(
                    targetState,
                    shouldRedirectToHomeState ? {} : currentStateParams,
                    { reload: reloadOnDelete },
                );
            },
            (err) => {
                // In case of an error - close the modal.
                swLog.log(err);
                setLoading(false);
                onClose();
            },
        );
    };

    const onPaste = (event: ClipboardEvent) => {
        const pasted = event.clipboardData.getData("text").trim();
        if (pasted) {
            const tmpDomains = _.filter(pasted.replace(/[\r\n]/g, ",").split(","));
            if (tmpDomains.length > 0) {
                // check for duplications
                const pastedDomains = [];
                _.forEach(tmpDomains, (domain: string) => {
                    pastedDomains.push(createDomain(domain, ""));
                });
                const all = _.concat(pastedDomains, domains);
                const uniques = _.uniqWith(all, (crr, other) => crr.domain === other.domain);
                if (all.length != uniques.length && uniques.length <= maxDomains) {
                    setDuplicateDomains(
                        `${all.length - uniques.length} ${errorMessages.duplicatedRemoved}`,
                    );
                } else {
                    setDuplicateDomains(false);
                }
                setDomains(uniques);

                if (mode == ECustomCategoriesWizardMode.NEW) {
                    track(
                        "Pop Up",
                        "click",
                        `Create New Category/Paste Domains/${tmpDomains.length}`,
                    );
                } else if (mode == ECustomCategoriesWizardMode.EDIT) {
                    track("Pop Up", "click", `Edit Category/Paste Domains/${tmpDomains.length}`);
                }
                event.preventDefault();
                domainsVal(false, uniques);
            }
        }
    };

    const deleteButtonText = "customcategories.wizard.delete.button";
    const deleteButtonTextLoading = "customcategories.wizard.delete.button.loading";
    let saveButtonText;
    let saveButtonTextLoading;
    if (mode === ECustomCategoriesWizardMode.NEW) {
        saveButtonText = "customcategories.wizard.save.button";
        saveButtonTextLoading = "customcategories.wizard.save.button.loading";
    } else {
        saveButtonText = "customcategories.wizard.edit.button";
        saveButtonTextLoading = "customcategories.wizard.edit.button.loading";
    }
    const categoryNameClassnames = classNames("customCategoriesWizard-name", {
        "customCategoriesWizard-name-invalid": invalidName && !categoryName,
        "customCategoriesWizard-name-focused": focused,
    });
    const iconClassnames = classNames(
        "customCategoriesWizard-icon",
        "customCategoriesWizard-invalid-icon",
        "iconInfo",
        "iconInfo--white",
        {
            "customCategoriesWizard-invalid-icon--hide-message": hideCategoryNameErrorMessage,
        },
    );
    const invalidDomainsClassnames = classNames(
        "customCategoriesWizard-invalid-icon",
        "customCategoriesWizard-editor-invalid-format",
        "iconInfo",
        "iconInfo--white",
        { "customCategoriesWizard-invalid-icon--hide-message": hideDomainErrorMessage },
    );
    const counterClassnames = classNames({
        "customCategoriesWizard-editor-counter-invalid": domains.length > maxDomains,
    });
    const editorClassnames = classNames("customCategoriesWizard-editor", "u-alignLeft", {
        "customCategoriesWizard-editor--error": !!invalidDomains || domains.length > maxDomains,
    });
    const autoCompleteExcludes: IChosenItem[] = domains.map((domain) => {
        return {
            displayName: domain.domain,
            name: domain.domain,
            color: null,
            icon: null,
            image: null,
            smallIcon: null,
        };
    });
    return (
        <>
            {!confirmBeforeLeaving && (
                <div className="customCategoriesWizard">
                    {/*<i className="sw-icon-close-thin swWizard-close" onClick={onCloseClick} />*/}
                    <div className={categoryNameClassnames}>
                        <div className="customCategoriesWizard-name-input">
                            <input
                                tabIndex={1}
                                maxLength={26}
                                type="text"
                                autoFocus
                                value={categoryName}
                                placeholder={namePlaceholderText}
                                onFocus={onFocus}
                                onBlur={onBlur}
                                onChange={onInputChange}
                            />
                            <div className="customCategoriesWizard-name-input-bar"></div>
                        </div>
                        {!invalidName && <i className="customCategoriesWizard-icon sw-icon-edit" />}
                        {invalidName && (
                            <PlainTooltip
                                cssClass="PlainTooltip-element"
                                appendTo=".customCategoriesWizard"
                                placement="left"
                                defaultOpen={true}
                                tooltipContent={<span>{i18nFilter()(invalidName as string)}</span>}
                            >
                                <i className={iconClassnames}>!</i>
                            </PlainTooltip>
                        )}
                    </div>
                    <div className="customCategoriesWizard-editor-container">
                        <div className="customCategoriesWizard-editor-header">
                            <div className="customCategoriesWizard-editor-title u-alignLeft">
                                {i18nFilter()(editorTitle)}
                            </div>
                            <div className="customCategoriesWizard-editor-counter u-alignRight">
                                <span className={counterClassnames}>
                                    <span>{domains.length}</span>
                                </span>
                                &nbsp;/ {maxDomains}&nbsp;
                                <span className="u-lowercase">
                                    {i18nFilter()("search.websites.button")}
                                </span>
                            </div>
                            {invalidDomains && (
                                <PlainTooltip
                                    cssClass="PlainTooltip-element"
                                    appendTo=".customCategoriesWizard"
                                    placement="left"
                                    defaultOpen={true}
                                    tooltipContent={
                                        <span>{i18nFilter()(invalidDomains as string)}</span>
                                    }
                                >
                                    <i className={invalidDomainsClassnames}>!</i>
                                </PlainTooltip>
                            )}
                            {duplicateDomains && (
                                <PlainTooltip
                                    cssClass="PlainTooltip-element"
                                    appendTo=".customCategoriesWizard"
                                    tooltipContent={
                                        <span>{i18nFilter()(duplicateDomains as string)}</span>
                                    }
                                    placement="left"
                                    defaultOpen={true}
                                >
                                    <i className="customCategoriesWizard-invalid-icon iconInfo iconInfo--white">
                                        !
                                    </i>
                                </PlainTooltip>
                            )}
                        </div>
                        <div className={editorClassnames}>
                            <div className="customCategoriesWizard-editor-add-domain">
                                <AutocompleteWebsitesMainItem
                                    key={domains.length}
                                    autocompleteProps={{
                                        onPaste,
                                        searchIcon: null,
                                        placeholder: (
                                            <span
                                                dangerouslySetInnerHTML={{
                                                    __html: i18nFilter()(placeholder),
                                                }}
                                            />
                                        ),
                                        top: "0",
                                        width: "400",
                                        position: "static",
                                        fastEnterFunc: (q) => {
                                            addDomain(null, q, null);
                                        },
                                    }}
                                    recentSearches={[]}
                                    className="newDomainInput"
                                    onClick={(domain: any) => {
                                        addDomain(null, domain, domain.image || null);
                                    }}
                                    excludes={autoCompleteExcludes}
                                />
                                <div className="customCategoriesWizard-add-domain-bar"></div>
                            </div>
                            <div className="customCategoriesWizard-editor-list">
                                <div className="customCategoriesWizard-domains-list">
                                    <ScrollArea
                                        style={{ flex: "auto", height: "100%" }}
                                        verticalScrollbarStyle={{ borderRadius: 5 }}
                                        horizontal={false}
                                        smoothScrolling={true}
                                        minScrollSize={48}
                                    >
                                        {domains.map((domain, index) => {
                                            return (
                                                <div
                                                    key={`domain-${domain.domain}`}
                                                    className="customCategoriesWizard-domain-wrapper"
                                                >
                                                    {domain.favicon && (
                                                        <img
                                                            className="customCategoriesWizard-domain-favicon"
                                                            src={domain.favicon}
                                                        />
                                                    )}
                                                    <div className="customCategoriesWizard-domain">
                                                        <InPlaceEditReact
                                                            value={domain.domain}
                                                            inputClass="customCategoriesWizard-editor-edit-domain"
                                                            onFinishEditing={onFinishEditDomain}
                                                            className={
                                                                !domain.valid ? "invalid" : ""
                                                            }
                                                        />
                                                    </div>
                                                    <div
                                                        onClick={(e) => {
                                                            removeDomain(index, e);
                                                        }}
                                                    >
                                                        <SWReactIcons
                                                            className="customCategoriesWizard-editor-remove-domain"
                                                            iconName="delete"
                                                            size="xs"
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </ScrollArea>
                                </div>
                            </div>
                        </div>
                        {hasMarketingWorkspace && (
                            <div style={{ marginTop: 22 }}>
                                <div className="customCategoriesWizard-editor-title u-alignLeft">
                                    {i18nFilter()("customcategories.wizard.select.list.type")}
                                </div>
                                <WebsiteListTypeSelectorContainer
                                    selectedListType={categoryType}
                                    onListTypeSelect={onCategoryTypeChange}
                                    // error={categoryTypeSelectorError}
                                    // errorText={categoryTypeSelectorErrorText}
                                    disabled={isCategoryTypeDisabled}
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}

            {confirmBeforeLeaving && (
                <div className="confirmation-before-leaving">
                    <div className="action-text">
                        {i18nFilter()("customcategories.wizard.confirmation.actiontext")}
                    </div>
                    <div className="category">
                        {/*<i className="sw-icon-custom-categories"></i>*/}
                        {categoryName}
                    </div>
                    <div className="big-icon">
                        <img src="/images/Icon_create_CC_Success.png" />
                    </div>
                </div>
            )}

            <div className="swWizard-footer customCategoriesWizard-footer swWizard-footer-buttons">
                {confirmBeforeLeaving && (
                    <Button type="flat" onClick={onCloseClick}>
                        {i18nFilter()("customcategories.wizard.confirmation.close")}
                    </Button>
                )}
                {mode === ECustomCategoriesWizardMode.EDIT && showDeleteButton && (
                    <Button
                        isLoading={loading}
                        type="flatWarning"
                        isDisabled={loading}
                        onClick={deleteCategory}
                    >
                        {i18nFilter()(loading ? deleteButtonTextLoading : deleteButtonText)}
                    </Button>
                )}
                <Button
                    isLoading={loading}
                    onClick={onSaveCategory}
                    isDisabled={
                        domains.length === 0 ||
                        categoryName === "" ||
                        !!invalidName ||
                        (categoryType as string) === "" ||
                        !!invalidDomains
                    }
                >
                    {i18nFilter()(loading ? saveButtonTextLoading : saveButtonText)}
                </Button>
            </div>
        </>
    );
};

CustomCategoriesWizardReact.defaultProps = {
    placeholder: "customcategories.wizard.editor.placeholder.bold",
    namePlaceholder: "customcategories.wizard.name.placeholder",
    editorTitle: "customcategories.wizard.editor.title",
    initialCategoryType: null,
    isCategoryTypeDisabled: false,
    customCategoryId: null,
    customCategoryName: null,
    showDeleteButton: true,
    reloadOnDelete: true,
    onClose: () => null,
};
