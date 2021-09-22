import ScrollListener from "components/React/ScrollListener/ScrollListener";
import React, { Component } from "react";
import Tiles from "./Tiles";

import autobind from "autobind-decorator";

export default class TilesContainer extends Component<any, any> {
    public static defaultProps = {
        pageSize: 10,
    };

    constructor(prop) {
        super(prop);
        this.state = {
            pagesToRender: 1,
        };
    }

    public componentDidUpdate(prevProps) {
        if (this.props.list !== prevProps.list) {
            this.setState({
                pagesToRender: 1,
            });
        }
    }

    public render() {
        const { pageSize, list, onTileUpgradeClick, tileUnlockConfig } = this.props;
        const { pagesToRender } = this.state;
        const tilesToRender = list.slice(0, pageSize * pagesToRender);
        const lockedAdsCount = this.getLockedAdsCount();
        const showUpgradeTile = lockedAdsCount > 0 && tilesToRender.length === list.length;
        return (
            <div>
                <ScrollListener threshold={200} onThresholdReached={this.renderMoreTiles}>
                    <Tiles
                        list={tilesToRender}
                        lockedAdsCount={lockedAdsCount}
                        onTileUpgradeClick={onTileUpgradeClick}
                        tileUnlockConfig={tileUnlockConfig}
                        showUpgradeTile={showUpgradeTile}
                    />
                </ScrollListener>
            </div>
        );
    }

    private getLockedAdsCount() {
        const { totalCount, list } = this.props;
        return totalCount - list.length;
    }

    @autobind
    private renderMoreTiles() {
        this.setState(({ pagesToRender }) => ({
            pagesToRender: pagesToRender + 1,
        }));
    }
}
