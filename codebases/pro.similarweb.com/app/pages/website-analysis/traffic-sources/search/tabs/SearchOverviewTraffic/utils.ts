interface ISite {
    Domain: string;
    Favicon: string;
    Value: number;
    isLeader: boolean;
}

interface IEngine {
    Domain: string;
    Favicon: string;
    Name: string;
    sites: ISite[];
}

const engines = [
    "google",
    "yahoo",
    "yandex",
    "bing",
    "syndicated",
    "baidu",
    "duckduckgo",
    "Others",
];

interface IType {
    Name: string;
    iconName: string;
    sites: ISite[];
}

const types = ["Regular", "News", "Image", "Video", "Shopping", "Maps"];

const typeToIconNameMap = {
    Regular: "sw-icon-regular-search header-icon-offset",
    News: "sw-icon-news-search header-icon-offset",
    Image: "sw-icon-image-search header-icon-offset",
    Video: "sw-icon-video-search header-icon-offset",
    Shopping: "sw-icon-shopping-search header-icon-offset",
    Maps: "sw-icon-maps-search header-icon-offset",
};
// in the event that searchOverviewTrafficList[0].engineName has no data, no Favicon is returned for that
// engine either, therefore we check if that engine has a Favicon in any of the other elements
const getFavicon = (currentData, allData, engineName) => {
    if (currentData.Favicon || engineName === "Others" || engineName === "syndicated")
        return currentData.Favicon;
    const engineObjWithFavicon = allData.find(
        (siteToEnginesObj) => siteToEnginesObj[engineName].Favicon,
    );
    return engineObjWithFavicon && engineObjWithFavicon[engineName].Favicon;
};

export const transformDataForEngines = (searchOverviewTrafficList): IEngine[] => {
    const enginesObject: Record<string, IEngine> = {};
    Object.entries(searchOverviewTrafficList[0]).map(([engineName, data]: [string, any]) => {
        // this check is in order to skip testing properties that are not engines ex. Domain or Favicon
        if (engines.includes(engineName)) {
            enginesObject[engineName] = {
                Domain: data.Domain ?? data.Name,
                Favicon: getFavicon(data, searchOverviewTrafficList, engineName),
                Name: data.Name,
                sites: [],
            };
        }
    });
    // fill the sites array, for each engine, with site objects -- {Domain: string; Value: number; isLeader: boolean}
    searchOverviewTrafficList.forEach((siteToEnginesObj) => {
        Object.keys(enginesObject).forEach((key) => {
            enginesObject[key].sites.push({
                Domain: siteToEnginesObj.Domain,
                Favicon: siteToEnginesObj.Favicon,
                Value: siteToEnginesObj[key].Value,
                isLeader: siteToEnginesObj[key].IsLeader,
            });
        });
    });
    return Object.values(enginesObject).filter((data) => data.sites.some((site) => site.Value));
};

export const transformDataForTypes = (searchOverviewTrafficList): IType[] => {
    const typesObject: Record<string, IType> = {};
    Object.entries(searchOverviewTrafficList[0]).map(([typeName, data]: [string, any]) => {
        // this check is in order to skip testing properties that are not engines ex. Domain or Favicon
        if (types.includes(typeName)) {
            typesObject[typeName] = {
                Name: typeName,
                iconName: typeToIconNameMap[typeName],
                sites: [],
            };
        }
    });
    // fill the sites array, for each engine, with site objects -- {Domain: string; Value: number; isLeader: boolean}
    searchOverviewTrafficList.forEach((siteToTypessObj) => {
        Object.keys(typesObject).forEach((key) => {
            typesObject[key].sites.push({
                Domain: siteToTypessObj.Domain,
                Favicon: siteToTypessObj.Favicon,
                Value: siteToTypessObj[key].Value,
                isLeader: siteToTypessObj[key].IsLeader,
            });
        });
    });
    return Object.values(typesObject).filter((data) => data.sites.some((site) => site.Value));
};
