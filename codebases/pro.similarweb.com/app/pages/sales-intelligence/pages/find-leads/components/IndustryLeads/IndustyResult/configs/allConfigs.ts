import { incomingTraffic, incomingTrafficTableMetaData, incomingFilters } from "./incomingTraffic";
import { outboundTraffic, outboundTrafficTableMetaData, outboundFilters } from "./outboundTraffic";
import { topSitesTableMetaData, topSites, topWebsitesFilters } from "./topWebsites";
import { searchLeaders, searchLeadersMetaData, searchLeadersFilters } from "./searchLeaders";
import { socialLeaders, socialLeadersMetaData, socialLeadersFilters } from "./socialLeaders";
import { displayLeaders, displayLeadersMetaData, displayFilters } from "./displayLeaders";
import {
    referralLeaders,
    referrallLeadersMetaData,
    referralLeadersFilters,
} from "./referalLeaders";
import { directLeaders, directLeadersMetaData, directLeadersFilters } from "./directLeaders";
import { emailLeaders, emailLeadersMetaData, emailLeadersFilters } from "./emailLeaders";
import { IndustryTableConfigsType } from "../types";

export enum IndustryTables {
    IncomingTraffic = "IncomingTraffic",
    OutboundTraffic = "OutboundTraffic",
    TopWebsites = "TopWebsites",
    SearchLeaders = "SearchLeaders",
    SocialLeaders = "SocialLeaders",
    DisplayLeaders = "DisplayLeaders",
    ReferralLeaders = "ReferralLeaders",
    DirectLeaders = "DirectLeaders",
    EmailLeaders = "EmailLeaders",
}

export const mapIndustryTables = {
    "incoming-traffic": IndustryTables.IncomingTraffic,
    "outbound-traffic": IndustryTables.OutboundTraffic,
    "top-websites": IndustryTables.TopWebsites,
    "search-leaders": IndustryTables.SearchLeaders,
    "social-leaders": IndustryTables.SocialLeaders,
    "display-leaders": IndustryTables.DisplayLeaders,
    "referral-leaders": IndustryTables.ReferralLeaders,
    "direct-leaders": IndustryTables.DirectLeaders,
    "email-leaders": IndustryTables.EmailLeaders,
};

export const allConfigs: IndustryTableConfigsType = {
    IncomingTraffic: {
        cols: incomingTraffic,
        tableMetaData: incomingTrafficTableMetaData,
        filters: incomingFilters,
    },
    OutboundTraffic: {
        cols: outboundTraffic,
        tableMetaData: outboundTrafficTableMetaData,
        filters: outboundFilters,
    },
    TopWebsites: {
        cols: topSites,
        tableMetaData: topSitesTableMetaData,
        filters: topWebsitesFilters,
    },
    SearchLeaders: {
        cols: searchLeaders,
        tableMetaData: searchLeadersMetaData,
        filters: searchLeadersFilters,
    },
    SocialLeaders: {
        cols: socialLeaders,
        tableMetaData: socialLeadersMetaData,
        filters: socialLeadersFilters,
    },
    DisplayLeaders: {
        cols: displayLeaders,
        tableMetaData: displayLeadersMetaData,
        filters: displayFilters,
    },
    ReferralLeaders: {
        cols: referralLeaders,
        tableMetaData: referrallLeadersMetaData,
        filters: referralLeadersFilters,
    },
    DirectLeaders: {
        cols: directLeaders,
        tableMetaData: directLeadersMetaData,
        filters: directLeadersFilters,
    },
    EmailLeaders: {
        cols: emailLeaders,
        tableMetaData: emailLeadersMetaData,
        filters: emailLeadersFilters,
    },
};

export const defaultConfigIndustry = {
    country: 999,
    duration: "1m",
    webSource: "Total",
};

export const optionsConfig = [
    {
        id: "TopWebsites",
        text: "Top Websites",
        tooltipText: "Top Websites",
        duration: "1m",
    },
    {
        id: "SearchLeaders",
        text: "Search Leaders",
        tooltipText: "Search Leaders",
        duration: "1m",
    },
    {
        id: "SocialLeaders",
        text: "Social Leaders",
        tooltipText: "Social Leaders",
        duration: "1m",
    },

    {
        id: "DisplayLeaders",
        text: "Display Leaders",
        tooltipText: "Display Leaders",
        duration: "1m",
    },
    {
        id: "ReferralLeaders",
        text: "Referral Leaders",
        tooltipText: "Referral Leaders",
        duration: "1m",
    },
    {
        id: "DirectLeaders",
        text: "Direct Leaders",
        tooltipText: "Direct Leaders",
        duration: "1m",
    },
    {
        id: "EmailLeaders",
        text: "Email Leaders",
        tooltipText: "Email Leaders",
        duration: "1m",
    },
    {
        id: "IncomingTraffic",
        text: "Incoming Traffic",
        tooltipText: "Incoming Traffic",
        duration: "3m",
    },
    {
        id: "OutboundTraffic",
        text: "Outbound Traffic",
        tooltipText: "Outbound Traffic",
        duration: "3m",
    },
];

export const configSource = {
    TopWebsites: "Total",
    SearchLeaders: "Desktop",
    SocialLeaders: "Desktop",
    DisplayLeaders: "Desktop",
    ReferralLeaders: "Desktop",
    DirectLeaders: "Desktop",
    EmailLeaders: "Desktop",
    IncomingTraffic: "Desktop",
    OutboundTraffic: "Total",
};

export const configDuration = {
    TopWebsites: "1m",
    SearchLeaders: "1m",
    SocialLeaders: "1m",
    DisplayLeaders: "1m",
    ReferralLeaders: "1m",
    DirectLeaders: "1m",
    EmailLeaders: "1m",
    IncomingTraffic: "3m",
    OutboundTraffic: "3m",
};

export const customDurationList = [
    "TopWebsites",
    "SearchLeaders",
    "SocialLeaders",
    "ReferralLeaders",
    "DisplayLeaders",
    "DirectLeaders",
    "EmailLeaders",
];

export const trafficTypes = [
    { text: "Organic", id: 0 },
    { text: "Paid", id: 1 },
];
