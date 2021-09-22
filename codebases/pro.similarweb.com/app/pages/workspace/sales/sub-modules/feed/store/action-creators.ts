import { createAction, createAsyncAction } from "typesafe-actions";
import { Feed } from "../types/feed";
import { UseStatisticsMapByListId, UseStatisticsUpdatePayload } from "../../usage-statistics/types";
import { TTopCountries } from "../types/topCountries";
import { TAdNetworksAbout } from "../types/adNetwork";
import { TSiteInfo } from "../types/siteInfo";
import { TechnologiesData } from "../types/technologies";

export const fetchFeedsAsyncAction = createAsyncAction(
    "@@sales/feed/FETCH_FEEDS_START",
    "@@sales/feed/FETCH_FEEDS_SUCCESS",
    "@@sales/feed/FETCH_FEEDS_FAILURE",
)<void, Feed[], string | undefined>();

export const fetchTopCountrysAsyncAction = createAsyncAction(
    "@@sales/feed/TOP_COUNTRIES_START",
    "@@sales/feed/TOP_COUNTRIES_SUCCESS",
    "@@sales/feed/TOP_COUNTRIES_FAILURE",
)<void, TTopCountries, string | undefined>();

export const fetchAdNetworksAsyncAction = createAsyncAction(
    "@@sales/feed/AD_NETWORKS_START",
    "@@sales/feed/AD_NETWORKS_SUCCESS",
    "@@sales/feed/AD_NETWORKS_FAILURE",
)<void, TAdNetworksAbout, string | undefined>();

export const fetchSiteInfoAsyncAction = createAsyncAction(
    "@@sales/feed/SITE_INFO_START",
    "@@sales/feed/SITE_INFO_SUCCESS",
    "@@sales/feed/SITE_INFO_FAILURE",
)<void, TSiteInfo, string | undefined>();

export const getAdNetworksUseStatisticsAsyncAction = createAsyncAction(
    "@@sales/feed/GET_AD_NETWORKS_USE_STATISTICS",
    "@@sales/feed/GET_AD_NETWORKS_USE_STATISTICS_SUCCESS",
    "@@sales/feed/GET_AD_NETWORKS_USE_STATISTICS_FAILURE",
)<void, UseStatisticsMapByListId, string | undefined>();

export const updateAdNetworksUseStatisticsAction = createAction(
    "@@sales/feed/UPDATE_AD_NETWORK_USE_STATISTICS",
)<UseStatisticsUpdatePayload>();

export const fetchTechnologies = createAsyncAction(
    "@@sales/feed/FETCH_TECHNOLOGIES_REQUEST",
    "@@sales/feed/FETCH_TECHNOLOGIES_SUCCESS",
    "@@sales/feed/FETCH_TECHNOLOGIES_FAILURE",
)<string, TechnologiesData, string>();

export const setTechnologiesCategory = createAction("@@sales/feed/SET_TECHNOLOGIES_CATEGORY")<
    string
>();

export const clearTechnologies = createAction("@@sales/feed/CLEAR_TECHNOLOGIES")();
