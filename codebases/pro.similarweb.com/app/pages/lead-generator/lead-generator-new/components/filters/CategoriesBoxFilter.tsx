import { CategoryChipItem } from "@similarweb/ui-components/dist/chip";
import { MultiSelectCategoryDropdownItem } from "@similarweb/ui-components/dist/dropdown";
import React, { Component, StatelessComponent } from "react";
import styled, { css } from "styled-components";
import LeadGeneratorChips from "../../../components/LeadGeneratorChips";
import LeadGeneratorUtils from "../../../LeadGeneratorUtils";

const ParentItemStyle: any = styled.div`
    ${(props: any) =>
        props.isDisabled &&
        css`
            opacity: 0.5;
        `}
`;

const ParentItem = ({ isDisabled, ...props }) => (
    <ParentItemStyle isDisabled={isDisabled}>
        <MultiSelectCategoryDropdownItem {...props} />
    </ParentItemStyle>
);

const ChildItem = (props) => <MultiSelectCategoryDropdownItem {...props} />;

function getFreshItemList(value, term) {
    const allItems = LeadGeneratorUtils.getComponentCategories();
    const searchTermAppearsInItem = (item) =>
        item.text.trim().toLowerCase().includes(term.trim().toLowerCase());
    const retItems = allItems
        .filter((f) => f.id !== "All")
        .reduce((items, item) => {
            const searchTermAppearsInMyText = !term || searchTermAppearsInItem(item);
            const isParent = !item.isChild;
            if (isParent) {
                if (searchTermAppearsInMyText) {
                    return [...items, <ParentItem key={item.text} {...item} isDisabled={false} />];
                }
                const searchTermAppearsInAnyOfMyChildren = item.children.some((child) =>
                    searchTermAppearsInItem(child),
                );
                if (searchTermAppearsInAnyOfMyChildren) {
                    return [...items, <ParentItem key={item.text} {...item} isDisabled={true} />];
                } else {
                    return items;
                }
            } else {
                if (searchTermAppearsInMyText) {
                    return [...items, <ChildItem key={item.text} {...item} />];
                }
                const searchTermAppearsInParentItem = searchTermAppearsInItem(item.parentItem);
                if (searchTermAppearsInParentItem) {
                    return [...items, <ChildItem key={item.text} {...item} />];
                } else {
                    return items;
                }
            }
        }, []);
    return retItems;
}

interface ILeadGeneratorCategoryDropDownProps {
    value: any[];
    placeholder: string;
    type: string;
    items: any[];
    getDropDownProps: any;
    componentType: string;
    placeholderKey: string;
    ChipsComponent: StatelessComponent<any>;
    onChange(items: any[]): void;
}

export default class CategoriesBoxFilter extends Component<
    ILeadGeneratorCategoryDropDownProps,
    any
> {
    public state = {
        term: "",
        value: this.props.value,
        items: [],
    };

    public componentDidMount() {
        const { value, term } = this.state;
        this.setState({
            items: getFreshItemList(value, term),
        });
    }

    public render() {
        return (
            <LeadGeneratorChips
                {...this.props}
                type={this.props.componentType}
                getDropDownProps={this.getDropDownProps}
                ChipsComponent={CategoryChipItem}
            />
        );
    }

    public getDropDownProps = () => {
        return {
            shouldScrollToSelected: false,
            getItems: (p, { term }) => {
                const { value } = this.props;
                if (term === this.state.term && value === this.state.value) {
                    return this.state.items;
                } else {
                    const newItems = getFreshItemList(value, term);
                    this.setState({
                        term,
                        value,
                        items: newItems,
                    });
                    return newItems;
                }
            },
        };
    };
}
