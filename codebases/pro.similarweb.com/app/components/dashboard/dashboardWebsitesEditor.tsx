import autobind from "autobind-decorator";
import * as _ from "lodash";
import * as React from "react";
import { Component } from "react";

export class DashboardWebsitesEditor extends Component<
    {
        //Props
        websites: Array<any>;
        onClickFunc(websiteMap): (websiteMap) => void;
    },
    {
        //State
        websitesMap: any;
    }
> {
    public static getDerivedStateFromProps(props, state) {
        if (_(props.websites).differenceWith(state.websitesMap, _.isEqual).isEmpty()) {
            const newWebsitesMap = {};
            props.websites.forEach((website) => (newWebsitesMap[website] = website));
            return {
                websitesMap: newWebsitesMap,
            };
        }

        return null;
    }

    constructor(props) {
        super(props);
        const websitesMap = {};
        props.websites.forEach((website) => {
            websitesMap[website] = website;
        });
        this.state = {
            websitesMap,
        };
    }

    @autobind
    private submit() {
        this.props.onClickFunc(this.state.websitesMap);
    }

    @autobind
    private onChange(event) {
        const website = event.target.id.split("DashboardWebsiteEditor_")[1];
        const newWebsiteValue = event.target.value;
        this.setState((currentState) => {
            currentState.websitesMap[website] = newWebsiteValue;
            return currentState;
        });
    }

    public render() {
        let websitesList: Array<any> = [];
        this.props.websites.forEach((website) => {
            websitesList.push(
                <div>
                    <div>
                        Replace <strong>{website}</strong> with:
                    </div>
                    <input
                        value={this.state.websitesMap[website]}
                        id={`DashboardWebsiteEditor_${website}`}
                        onChange={this.onChange}
                        type="text"
                    />
                </div>,
            );
        });
        return (
            <div className="dashboardWebsitesEditor">
                <div className="dashboardWebsitesEditor-list">{websitesList}</div>
                <button onClick={this.submit}>Go!</button>
            </div>
        );
    }
}
