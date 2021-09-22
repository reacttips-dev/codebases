import { Button } from "@similarweb/ui-components/dist/button";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { BenchmarkToArenaModal } from "./BenchmarkToArenaModal";
import * as React from "react";
import * as PropTypes from "prop-types";
import { ReactNode } from "react";
import { abbrNumberFilter } from "../../../../../app/filters/ngFilters";

interface IBenchmarkToArenaProps {
    arenas: ReactNode;
    loading?: boolean;
}

export class BenchmarkToArena extends React.PureComponent<IBenchmarkToArenaProps, any> {
    public static contextTypes = {
        translate: PropTypes.func,
        track: PropTypes.func,
    };

    state = {
        showArenasModal: false,
    };

    private onBenchmarkToArenaToggle = (track) => () => {
        track("Pop Up", "Open", "BENCHMARK AGAINST YOUR ARENA");
        return this.setState({
            showArenasModal: !this.state.showArenasModal,
        });
    };

    private onBenchmarkToArenaClose = (track) => () => {
        track("Pop Up", "Close", "BENCHMARK AGAINST YOUR ARENA");
        return this.setState({
            showArenasModal: false,
        });
    };

    render() {
        const { translate, track } = this.context;
        const buttonDisabled = !this.props.arenas;
        const buttonLoading = this.props.loading;
        let tooltipText;
        if (buttonLoading) {
            tooltipText = "workspaces.marketing.keywordgroup.filters.benchmark.loading.tooltip";
        } else {
            tooltipText = buttonDisabled
                ? "workspaces.marketing.keywordgroup.filters.benchmark.disabled.tooltip"
                : "workspaces.marketing.keywordgroup.filters.benchmark.tooltip";
        }
        return (
            <>
                <PlainTooltip tooltipContent={translate(tooltipText)} placement="bottom">
                    <div>
                        <Button
                            type="primary"
                            isDisabled={buttonDisabled}
                            onClick={this.onBenchmarkToArenaToggle(track)}
                        >
                            {translate("workspaces.marketing.keywordgroup.filters.benchmark")}
                        </Button>
                    </div>
                </PlainTooltip>

                <BenchmarkToArenaModal
                    isOpen={this.state.showArenasModal}
                    title={translate("workspaces.marketing.keywordgroup.filters.benchmark.title")}
                    subTitle={translate(
                        "workspaces.marketing.keywordgroup.filters.benchmark.subtitle",
                    )}
                    onCloseClick={this.onBenchmarkToArenaClose(track)}
                >
                    {this.props.arenas}
                </BenchmarkToArenaModal>
            </>
        );
    }
}

export default SWReactRootComponent(BenchmarkToArena, "BenchmarkToArena");
