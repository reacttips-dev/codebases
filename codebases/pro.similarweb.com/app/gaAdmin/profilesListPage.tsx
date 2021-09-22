import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import React from "react";
import { useLoading } from "custom-hooks/loadingHook";
import { availableSearchTypes, searchTypes } from "./constants";
import gaAdminService from "./gaAdminService";
import { ProfileDetailsModal } from "./profileDetailsModal";
import { ProfilesFilters } from "./profilesFilters";
import {
    ContentContainer,
    ContentError,
    InlineIcon,
    ListContainer,
    TableContainer,
} from "./styledComponents";
import { DefaultCell, ISimpleTableConfig, SimpleTable } from "./tableComponents";

const DEFAULT_PAGE_SIZE = 50;
const DEFAULT_PAGE = 1;
const DEFAULT_SEARCH_TYPE = searchTypes.domain;

const renderDomainWithFlags = ({ colConfig, item }) => (
    <DefaultCell>
        {item.isDeleted && (
            <PlainTooltip tooltipContent="Deleted">
                <span>
                    <InlineIcon size="xs" iconName="clear-circle" />
                </span>
            </PlainTooltip>
        )}
        {item.isPrivate && (
            <PlainTooltip
                tooltipContent={`Private (${
                    item.swUserInfo?.FirstName || item.swUserInfo?.LastName
                        ? item.swUserInfo?.FirstName + " " + item.swUserInfo?.LastName
                        : "unknown"
                })`}
            >
                <span>
                    <InlineIcon size="xs" iconName="private" />
                </span>
            </PlainTooltip>
        )}
        {item[colConfig.key]}
    </DefaultCell>
);

const profilesTableConfig: ISimpleTableConfig = {
    columns: [
        {
            key: "domain",
            title: "Domain",
            width: "250px",
            grow: 2,
            renderCell: renderDomainWithFlags,
        },
        { key: "email", title: "Email", width: "250px", grow: 2 },
        { key: "accountName", title: "Account Name", width: "200px", grow: 1 },
    ],
};

const ErrorMessage = ({ error }) => {
    if (!error) {
        return null;
    }

    let errorMessage;
    switch (error?.name) {
        case gaAdminService.ERROR_FETCH_UNREACHABLE:
            errorMessage = `${error.message} - Internal service only! (please check connection to SimilarWeb VPN)`;
            break;
        case gaAdminService.ERROR_FETCH_STATUS:
            errorMessage = error.message;
            break;
        default:
            errorMessage = `Unknown error - ${error.message}`;
    }

    return <ContentError>ERROR: {errorMessage}</ContentError>;
};

const TableContent = ({ profiles, profileTableConfig }) => {
    switch (profiles.state) {
        case useLoading.STATES.LOADING:
            return <ContentContainer>Loading...</ContentContainer>;
        case useLoading.STATES.ERROR:
            return <ErrorMessage error={profiles.error} />;
        default:
            return profiles.data && profiles.data.length > 0 ? (
                <SimpleTable config={profileTableConfig} data={profiles.data} />
            ) : (
                <ContentContainer>No Data</ContentContainer>
            );
    }
};

export const ProfilesListPage = ({ location, history }) => {
    const [profiles, profilesOps] = useLoading<any, any>();
    const [profileDetails, setProfileDetails] = React.useState(null);

    // ref to function to set url params
    const updateUrl = React.useCallback(
        (params = {}) => {
            const qs = new URLSearchParams(location.search);
            Object.keys(params).forEach((key) =>
                params[key] !== undefined ? qs.set(key, params[key]) : qs.delete(key),
            );
            history.push(`${location.pathname}?${qs.toString()}`);
        },
        [history, location.pathname, location.search],
    );

    // get params
    const { page, pageSize, search, srType } = React.useMemo(() => {
        const qs = new URLSearchParams(location.search);
        const page = Number.parseInt(qs.get("page")) || DEFAULT_PAGE;
        const pageSize = Number.parseInt(qs.get("pageSize")) || DEFAULT_PAGE_SIZE;
        const search = qs.get("search");
        const srType = qs.get("srType") || DEFAULT_SEARCH_TYPE;

        const updatedUrlParams = {};

        const srTypeIdx = availableSearchTypes.findIndex((sr) => sr.id === srType);
        if ((qs.has("srType") || qs.has("search")) && (srTypeIdx === -1 || !search)) {
            updatedUrlParams["srType"] = undefined;
            updatedUrlParams["search"] = undefined;
        }
        if (qs.has("page") && String(page) !== qs.get("page")) {
            updatedUrlParams["page"] = page === DEFAULT_PAGE ? undefined : page;
        }
        if (qs.has("pageSize") && String(pageSize) !== qs.get("pageSize")) {
            updatedUrlParams["pageSize"] = pageSize === DEFAULT_PAGE_SIZE ? undefined : pageSize;
        }
        if (Object.keys(updatedUrlParams).length) {
            updateUrl(updatedUrlParams);
        }

        return { page, pageSize, search, srType };
    }, [location.search]);

    // update list by params
    React.useEffect(() => {
        if (search) {
            switch (srType) {
                case searchTypes.domain:
                    profilesOps.load(async () => {
                        const profile = await gaAdminService.getGAProfileByDomain(search);
                        return profile._isError ? [] : [profile];
                    });
                    break;
                case searchTypes.email:
                    profilesOps.load(() =>
                        gaAdminService.getGAProfilesByEmail(search, { page, pageSize }),
                    );
                    break;
                case searchTypes.swUser:
                    profilesOps.load(() =>
                        gaAdminService.getGAProfilesBySWUserEmail(search, { page, pageSize }),
                    );
                    break;
            }
        } else {
            profilesOps.load(() => gaAdminService.getGAProfiles({ page, pageSize }));
        }
    }, [page, pageSize, search, srType]);

    // profile table config used
    const useProfileTableConfig = React.useMemo(
        () => ({
            ...profilesTableConfig,
            onRowClick: (item) => setProfileDetails(item),
        }),
        [setProfileDetails],
    );

    // function to close profile details modal
    const onProfileDetailsClose = React.useCallback(() => {
        setProfileDetails(null);
    }, [setProfileDetails]);

    return (
        <React.Fragment>
            <ListContainer>
                <ProfilesFilters
                    page={page}
                    pageSize={pageSize}
                    search={search}
                    srType={srType}
                    onFiltersChange={updateUrl}
                />
                <TableContainer>
                    <TableContent profiles={profiles} profileTableConfig={useProfileTableConfig} />
                </TableContainer>
            </ListContainer>

            <ProfileDetailsModal profile={profileDetails} onCloseClick={onProfileDetailsClose} />
        </React.Fragment>
    );
};
