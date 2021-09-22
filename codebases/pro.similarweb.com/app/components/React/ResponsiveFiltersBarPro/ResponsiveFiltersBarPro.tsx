import { ResponsiveFiltersBar } from "@similarweb/ui-components/dist/responsive-filters-bar";
import * as React from "react";
import { connect } from "react-redux";
import styled from "styled-components";

class ResponsiveFiltersBarPro extends ResponsiveFiltersBar {
    public constructor(props, context) {
        super(props, context);
    }
    public render() {
        const properties = this.props as any;
        return (
            <ResponsiveFiltersBarContainer
                notificationListHeight={properties.notificationListHeight}
            >
                <ResponsiveFiltersBar {...this.props} />
            </ResponsiveFiltersBarContainer>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {};
}

function mapStateToProps({ common: { notificationListHeight } }) {
    return {
        notificationListHeight,
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(ResponsiveFiltersBarPro);

interface IResponsiveFiltersBarContainerProps {
    notificationListHeight: number;
}

export const ResponsiveFiltersBarContainer = styled.div<IResponsiveFiltersBarContainerProps>`
    .ResponsiveFiltersBar .Sidebar-container.animation-overlay.animation-right {
        top: ${(props: any) =>
            `${props.notificationListHeight ? props.notificationListHeight + 64 : 64}px`};
        width: 320px;
    }
`;
