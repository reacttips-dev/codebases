import * as React from "react";
import { PureComponent } from "react";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { FlexGrid } from "@similarweb/ui-components/dist/flex-grid";
import { TileContainer, TileIcon } from "@similarweb/ui-components/dist/grouped-tiles";
import { Title } from "@similarweb/ui-components/dist/title";
import { growHomepageTiles } from "./growHomepageTiles";
import I18n from "components/React/Filters/I18n";
import { allTrackers } from "services/track/track";
import { connect } from "react-redux";

export class GrowHomepage extends PureComponent<any, any> {
    constructor(props) {
        super(props);
    }

    private onTileClick = (tile) => () => {
        allTrackers.trackEvent("Internal link", "click", tile.trackName);
        if (typeof tile.onClick === "function") {
            tile.onClick();
        }
    };

    public render() {
        return (
            <div className="growHomepage">
                <FlexGrid>
                    <Title className="Title--researchHomepage">
                        <I18n>tools.homepage.title</I18n>
                    </Title>
                    <TileContainer>
                        {growHomepageTiles(this.props.cig.cigLink).map((tile) => (
                            <TileIcon
                                {...tile}
                                IconBackground="#1EC794"
                                onClick={this.onTileClick(tile)}
                                key={tile.IconName}
                            />
                        ))}
                    </TileContainer>
                </FlexGrid>
            </div>
        );
    }
}

function mapStateToProps(store) {
    const cig = store.cig;
    return {
        cig,
    };
}

SWReactRootComponent(connect(mapStateToProps)(GrowHomepage), "GrowHomepage");
