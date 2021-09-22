import React, {
  useState,
  createContext,
  useContext,
  ReactNode,
  useEffect,
} from "react";

import { GlobalNavigationProps } from "../types/GlobalSearchUiProps";
import { ISearchResource } from "../types/SearchResults/ISearchResource";
import { SearchTagType } from "../types/SearchTagType";

import { filtersPropsToTags } from "../utils/filterPropToTags";
import parseSearchUrl from "../utils/parseSearchUrl";

type GlobalSearchUiContextProps = {
  tags: Array<SearchTagType>;
  keywords: string;
  viewType: string | undefined;
  setKeywords: (keywords: string) => void;
  setTags: (tags: Array<SearchTagType>) => void;
  hasFocus: boolean;
  setHasFocus: (hasFocus: boolean) => void;
  isLastTagActive?: boolean;
  setIsLastTagActive: (isLastTagActive: boolean) => void;
  setSelectedSearchOption: (index: number) => void;
  selectedSearchOption: number;
  setSelectedOptionText: (text: string) => void;
  selectedOptionText: string;
  setCloseAutoSearchModal: (close: boolean) => void;
  closeAutoSearchModal: boolean;
  setSearchResults: (results: Array<ISearchResource>) => void;
  searchResults?: Array<ISearchResource>;
  enableAutoSearch?: boolean;
  externalDocEntries: any;
  getExtDocFallbackIcon?: ((docType: string) => string) | null;
  enableFreehandXCustomIcons?: boolean;
};

export const GlobalSearchUiContext = createContext<GlobalSearchUiContextProps>({
  tags: [],
  keywords: "",
  hasFocus: false,
  isLastTagActive: false,
  viewType: "",
  setKeywords: () => {},
  setTags: (_) => {},
  setHasFocus: (_) => {},
  setIsLastTagActive: (_) => {},
  setSelectedSearchOption: (_) => {},
  selectedSearchOption: -1,
  setSelectedOptionText: (_) => {},
  selectedOptionText: "",
  setCloseAutoSearchModal: (_) => {},
  closeAutoSearchModal: false,
  setSearchResults: (_) => {},
  searchResults: [],
  enableAutoSearch: false,
  externalDocEntries: {},
  getExtDocFallbackIcon: null,
  enableFreehandXCustomIcons: false,
});

interface IGlobalSearchUiProviderProps {
  children?: ReactNode;
  globalNavigationProps?: GlobalNavigationProps;
  value?: any; // for unit tests purposes
}

const GlobalSearchUiProvider = ({
  children,
  globalNavigationProps,
  value,
}: IGlobalSearchUiProviderProps) => {
  // Internal states
  const [keywords, setKeywords] = useState("");
  const [tags, setTags] = useState<SearchTagType[]>([]);
  const [hasFocus, setHasFocus] = useState(false);
  const [viewType, setViewType] = useState("");
  const [isLastTagActive, setIsLastTagActive] = useState(false);
  const [selectedSearchOption, setSelectedSearchOption] = useState(-1);
  const [selectedOptionText, setSelectedOptionText] = useState("");
  const [closeAutoSearchModal, setCloseAutoSearchModal] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [enableAutoSearch, setEnableAutoSearch] = useState(false);
  const [externalDocEntries, setExternalDocEntries] = useState(null);
  const [integrationUIIntialized, setIntegrationUIIntialized] = useState(false);
  const [getExtDocFallbackIcon, setGetExtDocFallbackIcon] = useState(null);
  const [enableFreehandXCustomIcons, setEnableFreehandXCustomIcons] = useState(
    false
  );

  const enableFreehandXFilteringSorting = !!globalNavigationProps?.account
    ?.flags?.enableFreehandXFilteringSorting;

  // Update tags list if the filter prop value changes
  const filter = globalNavigationProps?.globalSearchUi?.filter;
  const enableSearchQuickResults = !!globalNavigationProps?.account
    ?.globalSearchUiConfig?.enableSearchQuickResults;

  const initializeExtDocConfig = (initExtDocLinker: (uiLib: string) => any) => {
    initExtDocLinker("home").then(
      (homeExtDocLinker: { config: any; fallbackIcon: any }) => {
        setExternalDocEntries(homeExtDocLinker.config);
        setGetExtDocFallbackIcon(() => homeExtDocLinker.fallbackIcon);
      }
    );
  };

  useEffect(() => {
    // load integrations-ui
    const appShell = window?.inGlobalContext?.appShell;
    const integrationUI = appShell?.getFeatureContext("integrations-ui");
    if (
      !integrationUIIntialized &&
      !externalDocEntries &&
      integrationUI?.getManifest
    ) {
      const initializeExtDoc =
        window?.inGlobalContext?.externals?.integrations?.initExtDocLinker;
      if (initializeExtDoc) {
        initializeExtDocConfig(initializeExtDoc);
      } else {
        integrationUI
          .getManifest()
          .then(
            ({ namedCriticalPathFiles }: { namedCriticalPathFiles: any }) => {
              const tag = document.createElement("script");
              document.head.appendChild(tag);
              tag.src = namedCriticalPathFiles["integrations-ui-api.js"];
              tag.onload = () => {
                const loadedInitializeExtDoc =
                  window.inGlobalContext?.externals?.integrations
                    ?.initExtDocLinker;
                if (loadedInitializeExtDoc) {
                  initializeExtDocConfig(loadedInitializeExtDoc);
                }
              };
            }
          )
          .catch(() => {
            console.error("Unable to load Integration UI");
          });
      }
      setIntegrationUIIntialized(true);
    }
  }, [externalDocEntries, integrationUIIntialized]);

  useEffect(() => {
    setEnableAutoSearch(enableSearchQuickResults);
  }, [enableSearchQuickResults]);

  useEffect(() => {
    setEnableFreehandXCustomIcons(enableFreehandXFilteringSorting);
  }, [enableFreehandXFilteringSorting]);

  const stringifiedFilter = JSON.stringify(filter);
  useEffect(() => {
    if (filter) {
      const tags: SearchTagType[] = filtersPropsToTags(filter);
      setTags(tags);
    }
    // eslint-disable-next-line react-app/react-hooks/exhaustive-deps
  }, [stringifiedFilter]);

  // Initialize the input text with the search url value if provided
  const searchQueryParam = window.location.search;
  useEffect(() => {
    const searchQueryUrl = parseSearchUrl(searchQueryParam);
    if (searchQueryUrl.search && searchQueryUrl.search.length > 0) {
      setKeywords(searchQueryUrl.search);
    }
  }, [searchQueryParam]);

  // Monitor context changes via the viewType
  const globalNavViewType: string | undefined =
    globalNavigationProps?.globalSearchUi?.viewType;
  useEffect(() => {
    if (!globalNavViewType || globalNavViewType.length === 0) {
      return;
    }

    setViewType(globalNavViewType);
    if (globalNavViewType !== "search") {
      setKeywords("");
    }
  }, [globalNavViewType]);

  // When in focus, invoke the MENU_VISIBILITY_CHANGED event in global-navigation,
  // as we want the GlobalHeader to become stuck when the search ui is active.
  const globalNavigationActions = globalNavigationProps?.actions;
  useEffect(() => {
    if (globalNavigationActions && globalNavigationActions.triggerEvent) {
      globalNavigationActions.triggerEvent("MENU_VISIBILITY_CHANGED", {
        menu: "global-search-ui",
        status: hasFocus ? "open" : "closed",
      });
    }
  }, [hasFocus, globalNavigationActions]);

  return (
    <GlobalSearchUiContext.Provider
      value={{
        keywords,
        tags,
        setKeywords,
        setTags,
        viewType,
        hasFocus,
        setHasFocus,
        isLastTagActive,
        setIsLastTagActive,
        selectedSearchOption,
        setSelectedSearchOption,
        selectedOptionText,
        setSelectedOptionText,
        closeAutoSearchModal,
        setCloseAutoSearchModal,
        searchResults,
        setSearchResults,
        enableAutoSearch,
        externalDocEntries,
        getExtDocFallbackIcon,
        enableFreehandXCustomIcons,
        ...value, // value prop and spread used for unit testing purposes only
      }}
    >
      {children}
    </GlobalSearchUiContext.Provider>
  );
};

export const useGlobalSearchUiContext = () => useContext(GlobalSearchUiContext);
export default GlobalSearchUiProvider;
