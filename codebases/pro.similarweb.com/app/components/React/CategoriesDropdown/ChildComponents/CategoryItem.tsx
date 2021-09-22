/**
 * Created by Sahar.Rehani on 7/29/2016.
 */

import * as React from "react";
import * as PropTypes from "prop-types";
import { InjectableComponent } from "../../InjectableComponent/InjectableComponent";

export class CategoryItem extends InjectableComponent {
    static defaultProps = {
        isChild: false,
        isDisabled: false,
    };

    static propTypes = {
        item: PropTypes.object.isRequired,
        isChild: PropTypes.bool,
        isDisabled: PropTypes.bool,
        onSelect: PropTypes.func.isRequired,
        getClass: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
    }

    getGroupText(item) {
        let label = item.text || item.title || (item.getText && item.getText());
        return label
            ? this.i18n(label) + (item.children ? " (" + item.children.length + ")" : "")
            : "";
    }

    render() {
        return !this.props.item.hidden ? (
            <li>
                <a
                    className={this.props.getClass(
                        this.props.item,
                        this.props.isChild,
                        this.props.isDisabled,
                    )}
                    title={this.getGroupText(this.props.item)}
                    onClick={(event) => this.props.onSelect(this.props.item, event)}
                >
                    {this.props.item.icon ? <i className={this.props.item.icon}></i> : null}
                    <span>
                        {this.i18n(
                            this.props.item.text ||
                                this.props.item.getText() ||
                                this.props.item.title,
                        )}
                    </span>
                </a>
                {this.props.children}
            </li>
        ) : null;
    }
}
