import React, { useEffect, useRef, useState } from "react";
import swLog from "@similarweb/sw-log";
import { i18nFilter } from "filters/ngFilters";
import { SWReactIcons } from "@similarweb/icons";
import { SWReactTable } from "components/React/Table/SWReactTable";
import { column, options } from "components/React/Table/SWReactTableDefaults";
import * as _ from "lodash";
import { stringify } from "querystring";
import { swSettings } from "common/services/swSettings";
import UserDataWorker from "../../../single-spa/UserDataWorker";
const i18n = i18nFilter();
const IMPERSONATE_LIMIT = 100;

const getUserIdentities = async (token) => {
    const queryStringParams = stringify({ token, action: "Impersonate" });
    const response = await fetch(`/useridentity/getidentities?${queryStringParams}`);
    const json = await response.json();
    return json.Result;
};

export const ImpersonatePopupReact: React.FC<any> = (props) => {
    const [search, setSearch] = useState("");
    const [loadingSuggestions, setLoadingSuggestions] = useState(false);
    const [tableData, setTableData] = useState(null);
    const userDataWorker = useRef(new UserDataWorker());
    const onSearch = (e) => {
        setSearch(e.target.value);
    };
    useEffect(() => {
        const fn = async () => {
            setLoadingSuggestions(true);
            const users = await getUserIdentities(search);
            const Records = _.take(users, IMPERSONATE_LIMIT);
            Records.forEach((user: any) => {
                user.Role = i18n(`Usermanagement.Role.${user.Role}`);
            });
            setTableData({ Records });
            setLoadingSuggestions(false);
        };
        if (search) {
            fn().then();
        } else {
            setTableData(null);
        }
    }, [search]);

    const impersonateUser = (row) => {
        try {
            window.localStorage.setItem("impersonationRequested", JSON.stringify(true));
        } catch (e) {
            swLog.error("Error: cannot set item in local storage");
        }

        userDataWorker.current.clearCache((e) => {
            location.href =
                swSettings.swsites.pro +
                "/useridentity/switchidentity?" +
                "name=" +
                encodeURIComponent(row.UserName) +
                "&redirectto=" +
                encodeURIComponent(location.href);
        });
    };

    const clear = () => {
        setSearch("");
        setLoadingSuggestions(false);
    };
    const tableOptions = options({
        hideHeader: true,
    });
    const tableColumns = [
        column({
            field: "Id",
            trackingName: "Id",
            displayName: "Id",
            tooltip: "User Id",
            cellTemplate: "default-cell",
            width: "80px",
        }),
        column({
            field: "UserName",
            trackingName: "UserName",
            displayName: "UserName",
            tooltip: "User name",
            cellTemplate: "link-impersonate",
            cellClass: "impersonateCell",
            minWidth: 160,
        }),
        column({
            field: "Role",
            trackingName: "Role",
            displayName: "Role",
            tooltip: "Role",
            cellTemplate: "default-cell",
            width: "100px",
        }),
        column({
            field: "AccountName",
            trackingName: "AccountName",
            displayName: "AccountName",
            tooltip: "AccountName",
            cellTemplate: "default-cell",
            width: "150px",
        }),
    ];
    const onSubmit = () => {
        // $item ?
    };
    const hasData = tableData?.Records && tableData.Records.length > 0;
    return (
        <div className="modal-dialog">
            <div className="modal-content">
                <div className="impersonate-header">
                    <h3 className="account-modalTitle">
                        {i18n("Usermanagement.Modal.Impersonate.Title")}
                    </h3>

                    <div className="account-modalForm account-modalFormImpersonate">
                        <form name="impersonateForm" onSubmit={onSubmit}>
                            <div className="impersonate-row">
                                <div className="impersonate">
                                    <input
                                        defaultValue={search}
                                        onChange={onSearch}
                                        className="impersonate-searchInput"
                                        placeholder={i18n(
                                            "Usermanagement.Modal.Impersonate.SearchText",
                                        )}
                                        autoFocus
                                    />
                                    {loadingSuggestions && (
                                        <SWReactIcons
                                            className="impersonate-searchIcon"
                                            iconName="search"
                                        />
                                    )}
                                </div>

                                <span
                                    className="swWizard-backBtn impersonate-clearBtn"
                                    onClick={clear}
                                >
                                    {i18n("Usermanagement.Modal.Clear")}
                                </span>
                            </div>
                            <p className="impersonate-subtitle">
                                {i18n("Usermanagement.Modal.Impersonate.SearchSubtitle")}
                            </p>
                        </form>
                    </div>
                </div>
                <div className="account-modalInfo-innerContent">
                    {hasData && (
                        <SWReactTable
                            tableColumns={tableColumns}
                            tableData={tableData}
                            tableOptions={tableOptions}
                            onItemClick={impersonateUser}
                            className="impersonate-table"
                        ></SWReactTable>
                    )}
                </div>
            </div>
        </div>
    );
};
