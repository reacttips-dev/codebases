import * as propTypes from "prop-types";
import * as React from "react";

export interface IFilters {
    appInfo: [
        {
            icon: string;
            id: string;
            title: string;
            category: string;
            categoryLink: string;
            relatedWebsites: any;
        },
    ];
    from: string;
    to: string;
    country: number | string;
    countryName: string;
    store: string;
}

export interface IFiltersProviderProps {
    filters: IFilters;
}

export default class FiltersProvider extends React.Component<IFiltersProviderProps, any> {
    public static childContextTypes = {
        filters: propTypes.object.isRequired,
    };

    public getChildContext() {
        return { filters: this.props.filters };
    }

    public render() {
        return this.props.children;
    }
}
