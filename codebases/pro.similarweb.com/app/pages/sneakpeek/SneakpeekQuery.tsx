import { Button, IconButton } from "@similarweb/ui-components/dist/button";
import {
    Dropdown,
    DropdownButton,
    SimpleDropdownItem,
} from "@similarweb/ui-components/dist/dropdown";
import { Injector } from "common/ioc/Injector";
import { swSettings } from "common/services/swSettings";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import * as _ from "lodash";
import { Component } from "react";
import * as React from "react";
import { allTrackers } from "services/track/track";
import { FlexColumn, FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import Footer from "./components/Footer";
import Input from "./components/Input";
import InputBox from "./components/InputBox";
import { getDynamicParams, getNewDefaultParamObject } from "./dynamicParams";
import { ConfigureDynamicParams } from "./EditDynamicParams";
import { SneakpeekApiService } from "./SneakpeekApiService";
import { SneakpeekExistingQueries } from "./SneakpeekExistingQueries";
import { canCreateSneak, getNewColumn, getNewQuestion, serializeColumns } from "./utilities";
import {
    BoxHeader,
    BoxTitle,
    FeedbackBox,
    GraphMetaContainer,
    Label,
    QueryBox,
    QueryBoxAndButtonsContainer,
    QueryFieldTitle,
    VisualizationBox,
    VisualizationContent,
} from "./StyledComponents";
import { ValidateQuery } from "./ValidateQuery";
import { SaveQueryModal } from "./components/SaveQueryModal";
import {
    dataSourcesMap,
    displayOptions,
    EDataSources,
    granularityOptions,
    modulesEntityMap,
} from "pages/sneakpeek/constants";
import { TableMetaDataItem } from "./components/TableMetaDataItem";
import { TimeGranularitySwitcher } from "pages/website-analysis/TrafficAndEngagement/ChartUtilities/TimeGranularitySwitcher";
import { FeedbackBuilder } from "pages/sneakpeek/SneakpeekFeedbackBuilder";
import { buttonTypes } from "UtilitiesAndConstants/Constants/ButtonTypes";
import { PageLoader } from "../../../.pro-features/components/Loaders/PageLoader";

const dropdownWidth = 314;

@SWReactRootComponent
export class SneakpeekQuery extends Component<any, any> {
    private queryApis = {
        graph: SneakpeekApiService.SaveGraphQuery,
        table: SneakpeekApiService.SaveTableQuery,
        piechart: SneakpeekApiService.SavePieChartQuery,
    }; //save type name
    private canSave = true;
    private swSettings;
    private swNavigator;
    private module;
    private validateQuery;

    constructor(props) {
        super(props);
        this.swSettings = swSettings;
        this.swNavigator = Injector.get("swNavigator");
        this.module = this.swNavigator.current().name;

        this.state = {
            loaded: false,
            dataSrc: dataSourcesMap[EDataSources.ATHENA].id,
            databases: [],
            database: "",
            sql: "",
            type: "graph",
            title: "",
            queryId: "",
            meta: {
                columns: [],
                dynamicParams: {},
                feedback: {
                    sendTo: this.swSettings.user.username,
                    questions: [],
                },
                granularity: "daily",
                yaxis: "",
            },
            allQueries: [],
            isSaveQueryModalOpen: false,
        };
    }

    public render() {
        const moduleEntity = modulesEntityMap(this.module);
        if (canCreateSneak()) {
            return (
                <>
                    <PageLoader isLoading={!this.state.loaded} />;
                    <FlexColumn justifyContent="center" className="sneakpeek-container">
                        <FlexRow>
                            <QueryBoxAndButtonsContainer>
                                <QueryBox>
                                    <BoxHeader>
                                        <BoxTitle>Query definition</BoxTitle>
                                    </BoxHeader>
                                    {this.state.allQueries.length > 0 && (
                                        <FlexColumn>
                                            <Label>
                                                Choose existing query to edit or create a new one
                                            </Label>
                                            <SneakpeekExistingQueries
                                                onSelect={this.onSelectExistingQuery}
                                                title="Edit Existing Query"
                                                selectedIds={{ [this.state.queryId]: true }}
                                                allQueries={this.state.allQueries}
                                                width={314}
                                            />
                                        </FlexColumn>
                                    )}
                                    {this.state.queryId && (
                                        <div className="query-title-container">
                                            <Label>Edit Existing Query</Label>
                                            <Input
                                                placeholder="Query title"
                                                width="314px"
                                                onChange={this.onTitleChange}
                                                value={this.state.title}
                                            />
                                        </div>
                                    )}
                                    <FlexColumn className="data-src-container">
                                        <QueryFieldTitle>Source</QueryFieldTitle>
                                        <FlexRow>
                                            <FlexColumn
                                                style={{
                                                    marginRight: "16px",
                                                    maxWidth: 314,
                                                    width: "100%",
                                                }}
                                            >
                                                <Label>Data Source</Label>
                                                <Dropdown
                                                    selectedIds={{ [this.state.dataSrc]: true }}
                                                    onClick={this.onChangeDataSrc}
                                                    itemsComponent={SimpleDropdownItem}
                                                    width={dropdownWidth}
                                                >
                                                    <DropdownButton key="dataSrc" width={"100%"}>
                                                        {this.state.dataSrc}
                                                    </DropdownButton>
                                                    <SimpleDropdownItem id={EDataSources.ATHENA}>
                                                        Athena
                                                    </SimpleDropdownItem>
                                                    <SimpleDropdownItem
                                                        id={EDataSources.HBASE}
                                                        disabled={true}
                                                    >
                                                        Hbase
                                                    </SimpleDropdownItem>
                                                    <SimpleDropdownItem
                                                        id={EDataSources.FIREBOLT}
                                                        disabled={true}
                                                    >
                                                        Firebolt
                                                    </SimpleDropdownItem>
                                                </Dropdown>
                                            </FlexColumn>
                                            <FlexColumn
                                                style={{
                                                    maxWidth: 314,
                                                    width: "100%",
                                                }}
                                            >
                                                <Label>Database</Label>
                                                <Dropdown
                                                    selectedIds={{
                                                        [this.state.database]: true,
                                                    }}
                                                    onClick={this.onChangeDatabase}
                                                    itemsComponent={SimpleDropdownItem}
                                                    width={dropdownWidth}
                                                    shouldScrollToSelected={true}
                                                >
                                                    {[
                                                        <DropdownButton
                                                            key="database"
                                                            width={"100%"}
                                                        >
                                                            {this.state.database}
                                                        </DropdownButton>,
                                                        ...this.state.databases,
                                                    ]}
                                                </Dropdown>
                                            </FlexColumn>
                                        </FlexRow>
                                    </FlexColumn>
                                    <div className="query-container">
                                        <QueryFieldTitle>Query body</QueryFieldTitle>
                                        <Label>
                                            Use {"{country}"}, {"{"}
                                            {moduleEntity.entity}
                                            {"}"} to interact with chosen filters <br /> e.g{" "}
                                            {moduleEntity.example}
                                        </Label>
                                        <textarea
                                            value={this.state.sql}
                                            onChange={this.onSqlChange}
                                            placeholder="-- SQL body goes here"
                                        />
                                    </div>
                                    <div className="dynamic-params-container">
                                        <QueryFieldTitle>Parameters</QueryFieldTitle>
                                        {_.isEmpty(this.state.meta.dynamicParams) && (
                                            <Label>
                                                Hint: Any @parameters you add to the query body will
                                                show up here
                                            </Label>
                                        )}
                                        {!_.isEmpty(this.state.meta.dynamicParams) && (
                                            <ConfigureDynamicParams
                                                onParamTypeChange={this.setParam.bind(this, "type")}
                                                onParamValueChange={this.setParam.bind(
                                                    this,
                                                    "value",
                                                )}
                                                onParamDescriptionChange={this.setParam.bind(
                                                    this,
                                                    "description",
                                                )}
                                                dynamicParams={this.state.meta.dynamicParams}
                                            />
                                        )}
                                    </div>
                                    <VisualizationBox>
                                        <QueryFieldTitle>Display settings</QueryFieldTitle>
                                        <FlexRow>
                                            <TimeGranularitySwitcher
                                                timeGranularity={displayOptions.find(
                                                    (opt) => opt.value === this.state.type,
                                                )}
                                                getGranularity={this.getDisplayOptions}
                                                granularityUpdate={this.onChangeType}
                                            />
                                        </FlexRow>
                                        <VisualizationContent>
                                            {this.state.type === "table" && this.tableMetaData()}
                                            {this.state.type === "graph" && this.graphMetaData()}
                                        </VisualizationContent>
                                    </VisualizationBox>
                                    <FlexRow justifyContent="space-between">
                                        <FlexRow>
                                            <IconButton
                                                iconName="checked"
                                                type="outlined"
                                                onClick={this.onValidate}
                                            >
                                                Validate
                                            </IconButton>
                                            <ValidateQuery
                                                ref={this.setValidateQuery}
                                                type={this.state.type}
                                                database={this.state.database}
                                                granularity={this.state.meta.granularity}
                                                sql={this.state.sql}
                                                dynamicParams={this.state.meta.dynamicParams}
                                            />
                                        </FlexRow>
                                        <Button
                                            height={36}
                                            width={150}
                                            type={buttonTypes.FLAT_WARNING}
                                            isDisabled={false}
                                            onClick={this.resetQuery}
                                        >
                                            Reset All
                                        </Button>
                                    </FlexRow>
                                </QueryBox>
                                <Footer>
                                    {this.state.queryId && (
                                        <Button
                                            height={36}
                                            width={150}
                                            className="sneakpeek-edit-btn"
                                            isDisabled={!this.canSave}
                                            onClick={this.onEdit}
                                            textCase={"none"}
                                        >
                                            Update and run
                                        </Button>
                                    )}
                                    <Button
                                        height={36}
                                        isDisabled={!this.canSave}
                                        onClick={this.onSaveButtonClick}
                                        textCase={"none"}
                                    >
                                        {this.state.queryId
                                            ? "Save and run as new"
                                            : "Save and run"}
                                    </Button>
                                    <Button
                                        height={36}
                                        isDisabled={!this.canSave}
                                        onClick={this.onFork}
                                        textCase={"none"}
                                    >
                                        {this.state.queryId
                                            ? "Run as new without saving"
                                            : "Run without saving"}
                                    </Button>
                                </Footer>
                            </QueryBoxAndButtonsContainer>
                            <FeedbackBox>
                                <FeedbackBuilder
                                    currentFeedbackMetaData={this.state.meta.feedback}
                                    setFeedbackMetaData={this.setFeedbackMetaData}
                                    deleteFeedbackQuestion={this.deleteFeedbackQuestion}
                                    addFeedbackQuestion={this.addFeedbackQuestion}
                                    onFeedbackSendToChange={this.onFeedbackSendToChange}
                                />
                            </FeedbackBox>
                        </FlexRow>
                    </FlexColumn>
                    <SaveQueryModal
                        isOpen={this.state.isSaveQueryModalOpen}
                        onTitleChange={this.onTitleChange}
                        queryName={this.state.title}
                        onCancel={this.onSaveQueryModalCancelClick}
                        onSave={this.onSaveQueryModalRunClick}
                    />
                </>
            );
        } else {
            return (
                <div className="alert alert-danger">
                    <strong>Oops! Can&apos;t create a sneak! redirecting...</strong>
                </div>
            );
        }
    }

    public async componentDidMount() {
        if (!canCreateSneak()) {
            setTimeout(() => {
                this.swNavigator.go("proModules");
            }, 3000);
        } else {
            const promises = [
                SneakpeekApiService.getQueriesList(),
                SneakpeekApiService.getDatabases(),
            ];
            const [allQueries, databases] = await Promise.all(promises);
            const index = databases.findIndex((db) => db === "sw_sneakpeek_analytics");
            const defaultDb = index > 0 ? index : 0;
            this.setState({
                databases,
                database: databases[defaultDb].id,
                allQueries,
                loaded: true,
            });
            const { editedId } = this.swNavigator.getParams();
            if (editedId) {
                SneakpeekApiService.getMetadata(editedId)
                    .then(this.changeForm)
                    .catch(this.onFailure);
            }
        }
    }

    public graphMetaData = () => {
        return (
            <GraphMetaContainer>
                <FlexRow>
                    <FlexColumn style={{ marginRight: "16px" }}>
                        <Label>Time granularity</Label>
                        <TimeGranularitySwitcher
                            timeGranularity={granularityOptions.find(
                                (opt) => opt.value === this.state.meta.granularity,
                            )}
                            getGranularity={this.getGranularityOptions}
                            granularityUpdate={this.onChangeGranularity}
                        />
                    </FlexColumn>
                    <InputBox
                        value={this.state.meta.yaxis}
                        onChange={this.onYaxisChange}
                        placeholder="field_1, field_2, field_n …"
                        width={"314px"}
                    >
                        Field(s) to use for the y-axis (comma separated)
                    </InputBox>
                </FlexRow>
            </GraphMetaContainer>
        );
    };
    public tableMetaData = () => {
        return (
            <FlexColumn>
                <div style={{ marginBottom: "16px" }}>
                    <IconButton iconName="add" type="outlined" onClick={this.addColumn}>
                        Add Column Configuration
                    </IconButton>
                </div>
                {this.state.meta.columns.map((item, index) => (
                    <TableMetaDataItem
                        field={item.field}
                        name={item.name}
                        cellTemp={item.cellTemp}
                        onChange={(field, name, cellTemp) =>
                            this.setColumnMetaData(index, field, name, cellTemp)
                        }
                        onDelete={() => this.deleteColumnMetaData(index)}
                        key={index}
                    />
                ))}
            </FlexColumn>
        );
    };

    public getGranularityOptions = () => granularityOptions;
    public getDisplayOptions = () => displayOptions;

    public serializeMetaData = () => {
        const { meta } = this.state;
        const { columns } = meta;

        return JSON.stringify({
            ...meta,
            columns: serializeColumns(columns),
        });
    };

    public onSqlChange = (event) => {
        const sql = event.target.value;
        const detectedParamsInSql = getDynamicParams(sql);
        const { meta } = this.state;
        const { dynamicParams } = meta;
        this.setState({
            sql,
            meta: {
                ...meta,
                dynamicParams: detectedParamsInSql.reduce(
                    (newParams: object, paramName: string) => {
                        const { [paramName]: param = getNewDefaultParamObject() } = dynamicParams;
                        return {
                            ...newParams,
                            [paramName]: param,
                        };
                    },
                    {},
                ),
            },
        });
    };

    public onTitleChange = (event) => {
        this.setState({
            title: event.target.value,
        });
    };

    public onYaxisChange = (yaxis) => {
        const { meta } = this.state;
        this.setState({
            meta: {
                ...meta,
                yaxis,
            },
        });
    };

    public onFeedbackSendToChange = (sendTo) => {
        const { meta } = this.state;
        const { feedback } = meta;
        this.setState({
            meta: {
                ...meta,
                feedback: {
                    ...feedback,
                    sendTo,
                },
            },
        });
    };

    public addColumn = () => {
        const { meta } = this.state;
        const { columns } = meta;
        this.setState({
            meta: {
                ...meta,
                columns: [...columns, getNewColumn()],
            },
        });
    };

    public addFeedbackQuestion = () => {
        const { meta } = this.state;
        const { feedback } = meta;
        const questions = feedback.questions;
        this.setState({
            meta: {
                ...meta,
                feedback: {
                    ...feedback,
                    questions: [...questions, getNewQuestion()],
                },
            },
        });
    };

    public onChangeDataSrc = (item) => {
        this.setState({
            dataSrc: dataSourcesMap[item.id].id,
        });
    };

    public onChangeDatabase = (item) => {
        this.setState({
            database: item.id,
        });
    };

    public onChangeType = (index) => {
        const selectedDisplayObject = displayOptions[index];
        allTrackers.trackEvent(
            `sneakpeek/query/${this.module}`,
            "type selected",
            selectedDisplayObject.value,
        );
        this.setState({
            type: selectedDisplayObject.value,
        });
    };

    public onChangeGranularity = (index) => {
        const selectedGranularityObject = granularityOptions[index];
        const { meta } = this.state;
        allTrackers.trackEvent(
            `sneakpeek/query/${this.module}`,
            "granularity selected",
            selectedGranularityObject.value,
        );
        this.setState({
            meta: {
                ...meta,
                granularity: selectedGranularityObject.value,
            },
        });
    };

    public deleteColumnMetaData = (index) => {
        const { meta } = this.state;
        const { columns } = meta;
        if (columns.length) {
            columns.splice(index, 1);
            this.setState({
                meta: {
                    ...meta,
                    columns,
                },
            });
        }
    };

    public setColumnMetaData = (index, field, name, cellTemp) => {
        const { meta } = this.state;
        const { columns } = meta;
        this.setState({
            meta: {
                ...meta,
                columns: columns.map((column, colIndex) => {
                    return index !== colIndex
                        ? column
                        : {
                              field,
                              name,
                              cellTemp,
                          };
                }),
            },
        });
    };

    public setValidateQuery = (validateQuery) => {
        this.validateQuery = validateQuery;
    };

    public onValidate = () => {
        if (this.validateQuery) {
            this.validateQuery.runValidation();
        }
    };

    public deleteFeedbackQuestion = (index) => {
        const { meta } = this.state;
        const { feedback } = meta;
        const questions = feedback.questions;
        if (questions.length) {
            questions.splice(index, 1);
            this.setState({
                meta: {
                    ...meta,
                    feedback: {
                        ...feedback,
                        questions,
                    },
                },
            });
        }
    };

    public setFeedbackMetaData = (index, type, text) => {
        const { meta } = this.state;
        const { feedback } = meta;
        const questions = feedback.questions;
        this.setState({
            meta: {
                ...meta,
                feedback: {
                    ...feedback,
                    questions: questions.map((question, colIndex) => {
                        return index !== colIndex
                            ? question
                            : {
                                  type,
                                  text,
                              };
                    }),
                },
            },
        });
    };

    public trackSaveQuery = (isNew = true) => {
        const trackTitle = isNew
            ? `create new ${this.state.type} query`
            : `edit existing ${this.state.type} query`;
        const trackData = this.getUrlSuffix(isNew, "/");
        allTrackers.trackEvent(`sneakpeek/query/${this.module}`, trackTitle, trackData);
    };

    public saveQuery = (isNew = true) => {
        const urlSfx = this.getUrlSuffix(isNew);
        const apiFunction = this.queryApis[this.state.type];
        const params =
            this.state.type === "table"
                ? urlSfx
                : `${urlSfx}&granularity=${this.state.meta.granularity}`;
        apiFunction(params, this.state.sql, this.state.meta.dynamicParams)
            .then(this.onSaveSuccess)
            .catch(this.onFailure);
    };

    public getUrlSuffix = (isNew = true, delimiter = "&") => {
        const meta = this.serializeMetaData();
        const { database, title, queryId } = this.state;
        let urlSfx = `title=${title}${delimiter}meta=${meta}${delimiter}database=${database}${delimiter}entityType=${
            modulesEntityMap(this.module).entity
        }`;
        if (!isNew) {
            urlSfx += `${delimiter}queryId=${queryId}`;
        }
        return urlSfx;
    };

    public onEdit = () => {
        this.trackSaveQuery(false);
        this.saveQuery(false);
    };

    public onFork = () => {
        this.trackSaveQuery();
        this.saveQuery();
    };

    public onSaveSuccess = (queryId) => {
        allTrackers.trackEvent(
            `sneakpeek/query/${this.module}`,
            "query was saved successfully",
            `id=${queryId}`,
        );
        this.swNavigator.go(`${this.module.replace("sneakpeekQuery", "sneakpeekResults")}`, {
            ...this.swNavigator.getParams(),
            queryId,
        });
    };

    public setParam = (field, paramName, value) => {
        const { meta } = this.state;
        const { dynamicParams } = meta;
        const paramObject = dynamicParams[paramName];
        this.setState({
            meta: {
                ...meta,
                dynamicParams: {
                    ...dynamicParams,
                    [paramName]: {
                        ...paramObject,
                        [field]: value,
                    },
                },
            },
        });
    };

    public onFailure = (errMsg) => {
        return {
            success: false,
            payload: errMsg,
        };
    };

    public onSelectExistingQuery = (queryId) => {
        SneakpeekApiService.getMetadata(queryId)
            .then((data) => {
                this.changeForm(data);
                this.swNavigator.updateParams({ queryId });
            })
            .catch(this.onFailure);
    };

    public changeForm = (data) => {
        const { database, sql, type, title, queryId, meta } = data;
        this.setState({
            database,
            type,
            title,
            queryId,
            sql,
            meta: {
                ...this.state.meta,
                ...meta,
            },
        });
    };

    public resetQuery = () => {
        const index = this.state.databases.findIndex((db) => db === "sw_sneakpeek_analytics");
        const defaultDb = index > 0 ? index : 0;
        this.setState({
            dataSrc: dataSourcesMap[EDataSources.ATHENA].id,
            database: this.state.databases[defaultDb].id,
            sql: "",
            type: "graph",
            title: "",
            queryId: "",
            meta: {
                columns: [],
                dynamicParams: {},
                feedback: {
                    sendTo: this.swSettings.user.username,
                    questions: [],
                },
                granularity: "daily",
                yaxis: "",
            },
        });
    };

    public onSaveButtonClick = () => {
        if (this.state.title === "") {
            this.setState({ isSaveQueryModalOpen: true });
        } else {
            this.onFork();
        }
    };

    public onSaveQueryModalCancelClick = () => {
        this.setState({ isSaveQueryModalOpen: false });
    };

    public onSaveQueryModalRunClick = () => {
        this.setState({ isSaveQueryModalOpen: false });
        this.onFork();
    };
}
