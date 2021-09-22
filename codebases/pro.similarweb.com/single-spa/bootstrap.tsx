import swLog from "@similarweb/sw-log";
import { serializeTrackManagementData } from "../app/services/track/serializeTrackManagementData";
import { getI18n } from "./i18nLegacy";
import { RecentService } from "services/recent/recentService";
import { CacheService } from "services/cache/CacheService";
import UserDataWorker from "./UserDataWorker";
import { UserCustomCategoryService } from "services/category/userCustomCategoryService";
import { FavoritesService } from "services/favorites/favoritesService";
import { PreferencesService } from "services/preferences/preferencesService";
import { CompetitiveTrackerService } from "services/competitiveTracker/competitiveTrackerService";
import { EducationMockForDev } from "components/educationbar/educationMock";

declare const window;

const setupSettingsWorker = (data) => {
    const worker = new UserDataWorker();
    worker.getSettings((e) => {
        initWindow(e.data.value, null);
    });
    return data.value;
};

export const bootstrap = async () => {
    window.similarweb = window.similarweb || {};
    window.similarweb.config = window.similarweb.config || {};
    const { getSettingsCache, getI18nCache, clearBypassCache, getUserDataCache } = CacheService;
    try {
        const userdataPromise = getUserDataCache();
        const settingsPromise = getSettingsCache(setupSettingsWorker);
        const i18nPromise = getI18nCache();
        const recentsPromise = RecentService.getRecentsCache();
        const favoritesPromise = FavoritesService.getFavoritesCache();
        const preferencesPromise = PreferencesService.fetch();
        const trackersPromise = CompetitiveTrackerService.fetch();
        const regionForApi = window.assetsRoot.indexOf("west") !== -1 ? "west-2" : "east-1";
        const trackMangementPromise = await fetch(
            `https://web-track-management-server-production-us-${regionForApi}.s3.amazonaws.com/sw-track/track.json?${Date.now()}`,
        )
            .then((res) => {
                return res.json();
            })
            .catch((e) => {
                swLog.error("trackMangementPromise error", e);
            });
        // in development mode we want to work with MOCK data so
        // it is not be affected by changes in the education CMS
        // if needed you can copy the data returns from the education CMS
        // and paste in the MOCK file
        const educationPromise =
            process.env.NODE_ENV === "development"
                ? EducationMockForDev
                : await fetch(
                      `https://web-education-cms-production-us-${regionForApi}.s3.amazonaws.com/education.json`,
                  )
                      .then((res) => {
                          return res.json();
                      })
                      .catch((e) => {
                          swLog.error("trackMangementPromise error", e);
                      });

        const [
            userData,
            settingsRes,
            i18n,
            recents,
            favorites,
            preferences,
            trackers,
            education,
        ] = await Promise.all([
            userdataPromise,
            settingsPromise,
            i18nPromise,
            recentsPromise,
            favoritesPromise,
            preferencesPromise,
            trackersPromise,
            educationPromise,
        ]);
        const recentsArray = Object.values(recents).filter(({ data }) => data);
        RecentService.setRecents(recentsArray);
        FavoritesService.init(favorites);
        PreferencesService.init(preferences);
        CompetitiveTrackerService.init(trackers);
        const clonedRes = { ...userData.userData, ...settingsRes };

        // clear cache bypass if set
        clearBypassCache();

        initWindow(settingsRes, userData);

        await UserCustomCategoryService.init();

        window.i18n = getI18n(i18n);
        window.education = education;

        const initStore = await import("./store/initialStore");
        return {
            startup: {
                userData,
                ...settingsRes,
            },
            clonedRes,
            i18n: window.i18n,
            trackManagementData: serializeTrackManagementData(trackMangementPromise),
            store: initStore.generateStore(),
        };
    } catch (e) {
        swLog.error("Bootstrapping error", e);
    }
};

export const initWindow = ({ settings, categories, countries }, userData = null) => {
    if (settings) {
        window.similarweb.settings = settings;
        window.similarweb.config.categories = categories;
        window.similarweb.config.countries = countries.countriesClient;
        window.similarweb.config.mobileUsersCountries = countries.mobileUsersCountries;
    }

    if (userData) {
        window.similarweb.config.userData = userData;
    }
};
