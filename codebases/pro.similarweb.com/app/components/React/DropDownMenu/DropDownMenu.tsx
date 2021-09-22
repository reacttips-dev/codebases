import * as React from "react";
import * as PropTypes from "prop-types";
import * as classNames from "classnames";
import { Component } from "react";
import * as _ from "lodash";
import I18n from "../Filters/I18n";
import { ScrollContainer } from "../ScrollContainer/ScrollContainer";
import SWReactRootComponent from "decorators/SWReactRootComponent";

const DefaultDropDownMenuItem = ({ text }) => {
    return <div>{text}</div>;
};

@SWReactRootComponent
export class DropDownMenu extends Component<any, any> {
    private _scroller: any;
    private _itemsContainer: HTMLElement;
    private _list: HTMLElement;

    constructor(props) {
        super(props);
        this.state = {
            popupVisible: false,
            tabIndex: props.tabIndex || _.sample(_.range(900, 1000)),
            list: {
                height: 0,
                width: 0,
            },
        };
    }

    static propTypes = {
        items: PropTypes.arrayOf(
            PropTypes.shape({
                text: PropTypes.string.isRequired,
            }),
        ),
        ItemComponent: PropTypes.func,
        selectedItem: PropTypes.shape({
            text: PropTypes.string.isRequired,
        }),
        placeHolder: PropTypes.shape({
            text: PropTypes.string.isRequired,
        }),
        onItemSelected: PropTypes.func.isRequired,
        tabIndex: PropTypes.number,
        maxHeight: PropTypes.number,
        tracking: PropTypes.shape({
            onOpen: PropTypes.func,
        }).isRequired,
    };

    static defaultProps = {
        maxHeight: 600,
        ItemComponent: DefaultDropDownMenuItem,
    };

    render() {
        const {
            selectedItem = this.props.placeHolder,
            placeHolder,
            items,
            ItemComponent,
            onItemSelected,
            maxHeight,
            tracking,
            disabled,
            ...otherProps
        } = this.props;
        let {
            popupVisible,
            tabIndex,
            list: { width, height },
        } = this.state;

        return (
            <div className="dd-menu" tabIndex={tabIndex} onBlur={this.onBlur} {...otherProps}>
                <div
                    className={classNames("selected-item", { "selected-item--disabled": disabled })}
                    onClick={() => this.toggleList(selectedItem.text)}
                >
                    <I18n>{selectedItem.text}</I18n>
                </div>
                <div
                    ref={(itemsContainer) => (this._itemsContainer = itemsContainer)}
                    className="menu-items-container"
                    style={{ height: Math.min(maxHeight, height) }}
                >
                    <ScrollContainer ref={(scroller) => (this._scroller = scroller)}>
                        <ul ref={this.setList} className="menu-items">
                            {items.map((item, i) => {
                                return (
                                    <li
                                        className={classNames("menu-item", {
                                            selected: item === selectedItem,
                                        })}
                                        key={i}
                                        data-item-text={item.text}
                                        onMouseDown={() => onItemSelected(item)}
                                    >
                                        <ItemComponent {...item} />
                                    </li>
                                );
                            })}
                        </ul>
                    </ScrollContainer>
                </div>
            </div>
        );
    }

    setList = (el) => {
        this._list = el;
        this.updateListDimensions();
    };

    updateListDimensions() {
        const { popupVisible } = this.state;
        const el = this._list;
        const { height = 0, width = 0 } = (popupVisible && el && el.getBoundingClientRect()) || {};
        this.setState(
            {
                list: {
                    height,
                    width,
                },
            },
            () => {
                setTimeout(() => {
                    if (this._scroller) {
                        this._scroller.update();
                    }
                }, 300);
            },
        );
    }

    toggleList = (selectedItem = "") => {
        let popupState = !this.state.popupVisible;
        if (popupState === true) {
            // is visible
            this.props.tracking.onOpen("Drop down", selectedItem, "open");
        }
        this.setState(
            {
                popupVisible: popupState,
            },
            () => {
                this.updateListDimensions();
            },
        );
    };

    onBlur = (e) => {
        if (this.state.popupVisible) {
            this.toggleList();
        }
    };
}
