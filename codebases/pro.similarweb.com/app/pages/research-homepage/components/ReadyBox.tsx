import * as React from "react";
import { StatelessComponent } from "react";
import { Box } from "@similarweb/ui-components/dist/box";
import { MiniFlexTable } from "@similarweb/ui-components/dist/mini-flex-table";
import { Header, HeaderCustomizable } from "./Header";
import * as classNames from "classnames";
import { BoxStates } from "../pageDefaults";

export const ReadyBox: StatelessComponent<any> = (props) => {
    const shouldFadeIn = props.prevState === BoxStates.LOADING && !props.isFlipping;
    return (
        <div className="perspective">
            <Box
                className={classNames("Box--researchHomepage flip", {
                    "fade-items-in": shouldFadeIn,
                    "flip-reverse": props.isFlipping,
                })}
            >
                <Header {...props} />
                <MiniFlexTable
                    key="MiniFlexTable"
                    className="MiniFlexTable MiniFlexTable--swProTheme"
                    data={props.table.data}
                    columns={props.table.columns}
                    metadata={props.table.metadata}
                />
            </Box>
        </div>
    );
};

export const ReadyBoxCustomizable: StatelessComponent<any> = (props) => {
    const shouldFadeIn = props.prevState === BoxStates.LOADING && !props.isFlipping;
    return (
        <div className="perspective">
            <Box
                className={classNames("Box--researchHomepage flip", {
                    "fade-items-in": shouldFadeIn,
                    "flip-reverse": props.isFlipping,
                })}
            >
                <HeaderCustomizable {...props} />
                <MiniFlexTable
                    key="MiniFlexTable"
                    className="MiniFlexTable MiniFlexTable--swProTheme"
                    data={props.table.data}
                    columns={props.table.columns}
                    metadata={{ ...props.table.metadata, onEdit: props.onEdit }}
                    pagination={true}
                    onPaging={props.table.onPaging}
                    desktopSwipe={false}
                />
            </Box>
        </div>
    );
};
