import React, { PureComponent } from "react";
import ReactDOM from "react-dom";
import { any, string, func, instanceOf } from "prop-types";
import { IPopupConfig, Popup } from "@similarweb/ui-components/dist/popup";
import { createDomRoot, popupStack } from "@similarweb/ui-components/dist/utils";

export interface AnnotationCalloutProps {
    target: Element;
    onClickOut: (e?) => void;
    appendTo?: string;
    config: IPopupConfig;
}
/*
 * This is the the callout that display initialy the list of annotations
 * upon clicking on an annotation count cell
 * (annotations count cell display number of annotations for a data point under the xAxis).
 * This component allow to use popup ui-component without wrapping the target component
 * because annotations count are added through Highcharts API
 * and therefore cannot be wrapped.
 * This component could be move at a later stage as a more global component
 * if similar use case where we cannot wrapped the target happen (which is very unlikely to happen),
 * however if the global component will be changed it could lead to regression
 * in all chart annotations which is a risk to consider as well.
 */
export class AnnotationCallout extends PureComponent<AnnotationCalloutProps, any> {
    public static propTypes = {
        config: any.isRequired,
        appendTo: string,
        onClickOut: func.isRequired,
        target: instanceOf(Element).isRequired,
    };

    public static defaultProps = {
        appendTo: "body",
    };
    /**
     * DOM element that is used as the container for the popup
     * popup component is rendered into this root using react.createPortal
     */
    private popupRoot: HTMLDivElement;

    /**
     * Reference for the currently opened popup within the popupRoot
     */
    private popupRef: Popup;
    /**
     * Configuration data for the popup
     */
    private config: IPopupConfig;
    private contentChildElt;

    public constructor(props) {
        super(props);
        this.config = {
            ...Popup.getDefaultConfig(),
            ...props.config,
        };
        this.popupRoot = createDomRoot("popupRootID", undefined, this.props.appendTo);
    }
    private setRef = (elem) => {
        // Each new popup in the current view is being added to the end of popupStack.
        if (elem) {
            this.popupRef = elem;
            popupStack.push(this.popupRef);
        }
    };
    /**
     * notify parent if click was outside the target (in order to close the dialog)
     */
    private onClickOut = (event) => {
        if (this.contentChildElt && !this.contentChildElt.contains(event.target)) {
            this.props.onClickOut();
        }
    };
    public componentDidMount() {
        this.addListeners();
    }
    public componentWillUnmount() {
        this.removeListeners();
        // If the current popup being closed is the "highest" in the stack - remove it from the stack.
        // We want to avoid closing a drop down in another popup - e.g. drop down in the durationSelector.
        if (popupStack.length > 0 && popupStack[popupStack.length - 1] === this.popupRef) {
            popupStack.pop();
        }
        // deleteDomRoot(this.popupRoot);
        this.popupRoot.remove();
    }
    private getRef = (refInstance) => {
        // eslint-disable-next-line react/no-find-dom-node
        this.contentChildElt = ReactDOM.findDOMNode(refInstance) as Element;
    };
    private handleWheel = () => {
        this.popupRef.reposition();
    };

    public addListeners() {
        document.body.addEventListener("wheel", this.handleWheel, {
            capture: true,
        });
    }
    public removeListeners() {
        document.body.removeEventListener("wheel", this.handleWheel);
    }

    public render() {
        if (!this.popupRoot) return null;
        const { target, children, appendTo } = this.props;
        const child = React.Children.only(children) as any;
        const containerChildElement = React.cloneElement(child, {
            ref: this.getRef,
        });
        const popupElementInPortal = ReactDOM.createPortal(
            <Popup
                target={target as Element}
                isOpen={true}
                ref={this.setRef}
                appendTo={appendTo}
                onClickOut={this.onClickOut}
                {...this.config}
            >
                {containerChildElement}
            </Popup>,
            this.popupRoot,
        );
        return <>{popupElementInPortal}</>;
    }
}
