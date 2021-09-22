import * as React from "react";
import virtualList from "react-virtual-list";
import { ItemContainer } from "./ItemContainer";
const List = ({
    virtual,
    validateExistingItem,
    onItemTextChanged,
    ListItemComponent,
    tracker,
    removeItem,
}) => (
    <ul className="item-list" style={{ boxSizing: "border-box", ...virtual.style }}>
        {virtual.items.map((item, index) => {
            const isValid = validateExistingItem(item, virtual.items);
            return (
                <ItemContainer
                    onItemTextChanged={onItemTextChanged}
                    key={item.text}
                    item={item}
                    isValid={isValid}
                    validateExistingItem={validateExistingItem}
                    ListItemComponent={ListItemComponent}
                    tracker={tracker}
                    removeItem={() => removeItem(item)}
                />
            );
        })}
    </ul>
);
export class ListItems extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            VirtualList: null,
        };
        this.setContainer = this.setContainer.bind(this);
    }

    setContainer(container) {
        const { VirtualList } = this.state;
        if (container && !VirtualList)
            this.setState({
                VirtualList: virtualList({ container, containerHeight: 324 })(List),
            });
    }

    render() {
        const { VirtualList } = this.state;
        return (
            <div
                className="items-list-container"
                ref={this.setContainer}
                style={{ overflow: "auto" }}
            >
                {VirtualList && <VirtualList {...this.props} itemBuffer={20} />}
            </div>
        );
    }
}
