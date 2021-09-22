import React from "react";
import VList from "react-virtual-list";
import { TechnologiesDDItemType } from "../../../filters/technology/types";
import TechnologiesDDVirtualList, {
    TechnologiesDDVirtualListProps,
} from "./TechnologiesDDVirtualList";

type TechnologiesDDVirtualListContainerProps = {
    itemHeight: number;
    containerHeight: number;
    items: readonly TechnologiesDDItemType[];
} & Pick<TechnologiesDDVirtualListProps, "itemHeight" | "onItemClick">;

const createVirtualList = (node: Node) => {
    return VList({ container: node })(TechnologiesDDVirtualList) as React.ComponentType<
        Pick<TechnologiesDDVirtualListProps["virtual"], "items"> &
            Omit<TechnologiesDDVirtualListProps, "virtual">
    >;
};

const TechnologiesDDVirtualListContainer = (props: TechnologiesDDVirtualListContainerProps) => {
    const { containerHeight, ...rest } = props;
    const containerRef = React.useRef<HTMLDivElement>(null);
    const [, setMounted] = React.useState(false);
    const Component =
        containerRef.current !== null ? createVirtualList(containerRef.current) : null;

    React.useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div style={{ height: containerHeight, overflow: "scroll" }} ref={containerRef}>
            {Component !== null && <Component {...rest} />}
        </div>
    );
};

export default TechnologiesDDVirtualListContainer;
