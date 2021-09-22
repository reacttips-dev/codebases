import { MiniFlexTable } from "@similarweb/ui-components/dist/mini-flex-table";
import * as React from "react";
import { NoData } from "../../../../../../components/NoData/src/NoData";
import Header from "../../../common components/Header";
import WithAllContexts from "../../../common components/WithAllContexts";
import { TableBoxContainer, TableContainer } from "./StyledComponents";

export const externalAppLink = (appId, store) =>
    /0|google/i.test(store)
        ? "https://play.google.com/store/apps/details?id=" + appId
        : "https://itunes.apple.com/app/id" + appId;
export const externalAppLinkTrack = (category) => (track, store, title) =>
    track(category, "click", `${title}/${store} Store/table row`);

const TableBox: any = ({ loading, data, columns, title, tooltip, subtitleFilters }) => (
    <WithAllContexts>
        {({ track, getAssetsUrl, filters }) => {
            const trackExternal = externalAppLinkTrack("External Link");
            const metadata = {
                links: {
                    externalApp: ({ appId }) => externalAppLink(appId, filters.store),
                },
                tracks: {
                    externalApp: () => trackExternal(track, filters.store, title),
                },
                getAssetsUrl,
            };
            return (
                <TableBoxContainer data-automation-table-container={true}>
                    <Header
                        loading={loading}
                        title={title}
                        tooltip={tooltip}
                        subtitleFilters={subtitleFilters}
                    />
                    <TableContainer>
                        {loading ? null : data ? (
                            <MiniFlexTable data={data} columns={columns} metadata={metadata} />
                        ) : (
                            <NoData />
                        )}
                    </TableContainer>
                </TableBoxContainer>
            );
        }}
    </WithAllContexts>
);
TableBox.displayName = "TableBox";
export default TableBox;
