import autobind from "autobind-decorator";
import React, { Component } from "react";
import { allTrackers } from "services/track/track";
import { SneakpeekApiService } from "../SneakpeekApiService";
import { SneakpeekExistingQueries } from "../SneakpeekExistingQueries";
import Query from "./Query";
import { NoSelectedQueries } from "pages/sneakpeek/components/NoSelectedQueries";
import { FlexColumn } from "styled components/StyledFlex/src/StyledFlex";
import { PageLoader } from "components/Loaders/PageLoader";

class ResultsMain extends Component<any, any> {
    private module;

    constructor(props) {
        super(props);
        this.state = {
            selectedQueries: props.selectedQueries ? props.selectedQueries.split(",") : [],
            allQueries: [],
            isLoading: true,
        };
        this.module = props.navigator.current().name;
    }

    public async componentDidMount() {
        await this.getAllQueries();
        this.setState({ isLoading: false });
    }

    public async getAllQueries() {
        const allQueries = await SneakpeekApiService.getQueriesList();
        this.setState({ allQueries });
    }

    @autobind
    public onSelectExistingQuery(query) {
        const { selectedQueries: qries } = this.state;
        const selectedQueries = new Set(qries);
        let action = "add";
        if (!selectedQueries.has(query)) {
            selectedQueries.add(query);
        } else {
            selectedQueries.delete(query);
            action = "remove";
        }
        this.setState(
            {
                selectedQueries: Array.from(selectedQueries),
            },
            () => {
                this.props.navigator.updateParams({
                    queryId: this.state.selectedQueries.join(","),
                });
                allTrackers.trackEvent(
                    `sneakpeek/results/${this.module}`,
                    `${action} query results with id`,
                    query,
                );
            },
        );
    }

    @autobind
    public onEdit(editedId) {
        allTrackers.trackEvent(
            `sneakpeek/results/${this.module}`,
            "clicked on edit",
            `id=${editedId}`,
        );
        this.props.navigator.go(`${this.module.replace("sneakpeekResults", "sneakpeekQuery")}`, {
            ...this.props.navigator.getParams(),
            editedId,
        });
    }

    @autobind
    public onDelete(queryId) {
        allTrackers.trackEvent(
            `sneakpeek/results/${this.module}`,
            "clicked on delete",
            `id=${queryId}`,
        );
        SneakpeekApiService.DeleteQuery(queryId)
            .then(() => {
                this.onSelectExistingQuery(queryId);
                this.getAllQueries();
            })
            .catch();
    }

    public render() {
        const { params, navigator } = this.props;
        const { selectedQueries, allQueries, isLoading } = this.state;
        const selectedIds = selectedQueries.reduce((all, id) => {
            return {
                ...all,
                [id]: true,
            };
        }, {});

        return (
            <>
                <PageLoader isLoading={isLoading} />
                <FlexColumn justifyContent="center" className="sneakpeek-container">
                    <SneakpeekExistingQueries
                        onSelect={this.onSelectExistingQuery}
                        allQueries={allQueries}
                        multi={true}
                        title="Add or remove queries from the page"
                        selectedIds={selectedIds}
                        width={336}
                    />
                    <div className="queries">
                        {selectedQueries.length ? (
                            selectedQueries.map((query) => (
                                <Query
                                    key={query}
                                    params={params}
                                    queryId={query}
                                    navigator={navigator}
                                    onRemove={() => this.onSelectExistingQuery(query)}
                                    onEdit={() => this.onEdit(query)}
                                    onDelete={() => this.onDelete(query)}
                                    ownList={!!allQueries.find((crr) => crr.id === query)}
                                />
                            ))
                        ) : (
                            <NoSelectedQueries />
                        )}
                    </div>
                </FlexColumn>
            </>
        );
    }
}

export default ResultsMain;
